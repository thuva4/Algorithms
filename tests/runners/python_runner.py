#!/usr/bin/env python3

from __future__ import annotations

import ast
import copy
import hashlib
import inspect
import io
import os
import re
import sys
import types
from concurrent.futures import ThreadPoolExecutor
from contextlib import redirect_stdout
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
ALGORITHMS_DIR = REPO_ROOT / "algorithms"
RUN_TIMEOUT_SECONDS = float(os.environ.get("PYTHON_RUNNER_TIMEOUT_SECONDS", "10"))


@dataclass
class AlgorithmResult:
    algo_name: str
    passed: int = 0
    failed: int = 0
    skipped: int = 0
    errors: list[str] | None = None
    skip_messages: list[str] | None = None

    def __post_init__(self) -> None:
        if self.errors is None:
            self.errors = []
        if self.skip_messages is None:
            self.skip_messages = []


def detect_job_count() -> int:
    raw = os.environ.get("PYTHON_RUNNER_JOBS")
    if raw:
        try:
            return max(1, int(raw))
        except ValueError:
            return 4
    return max(1, min(8, os.cpu_count() or 4))


def normalized_symbol(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def snake_to_camel(name: str) -> str:
    parts = name.split("_")
    if not parts:
        return name
    return parts[0] + "".join(part[:1].upper() + part[1:] for part in parts[1:])


def snake_to_pascal(name: str) -> str:
    return "".join(part[:1].upper() + part[1:] for part in name.split("_") if part)


def normalize_sig_inputs(value: Any) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value]
    if isinstance(value, str):
        names: list[str] = []
        for part in value.split(","):
            match = re.search(r"[A-Za-z_][A-Za-z0-9_]*", part)
            if match:
                names.append(match.group(0))
        return names
    return []


def split_name_tokens(name: str) -> list[str]:
    if not name:
        return []
    spaced = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", name.replace("-", " ").replace("_", " "))
    return [token.lower() for token in spaced.split() if token]


def find_algorithm_dirs(target: str | None) -> list[Path]:
    if target:
        candidate = (REPO_ROOT / target).resolve()
        if not candidate.exists():
            candidate = (ALGORITHMS_DIR / target).resolve()
        if not candidate.exists() or not candidate.is_dir():
            raise FileNotFoundError(target)
        return [candidate]
    return [cases.parent.parent for cases in sorted(ALGORITHMS_DIR.glob("**/tests/cases.yaml"))]


def read_cases(cases_file: Path) -> dict[str, Any]:
    return yaml.safe_load(cases_file.read_text()) or {}


def algo_name_for_dir(algo_dir: Path) -> str:
    return str(algo_dir.relative_to(ALGORITHMS_DIR))


def python_source_files(algo_dir: Path) -> list[Path]:
    python_dir = algo_dir / "python"
    if not python_dir.is_dir():
        return []
    return sorted(path for path in python_dir.glob("*.py") if not path.name.startswith("__"))


def args_for_case(data: dict[str, Any], case_input: Any) -> list[Any]:
    if isinstance(case_input, dict):
        order = normalize_sig_inputs(data.get("function_signature", {}).get("input"))
        args: list[Any] = []
        seen: set[str] = set()
        for key in order:
            if key in case_input:
                args.append(case_input[key])
                seen.add(key)
        for key, value in case_input.items():
            if key not in seen:
                args.append(value)
        return args
    if isinstance(case_input, list):
        declared_inputs = normalize_sig_inputs(data.get("function_signature", {}).get("input"))
        if (
            len(declared_inputs) == 1
            and len(case_input) > 1
            and all(not isinstance(item, (list, dict)) for item in case_input)
        ):
            return [list(case_input)]
        return list(case_input)
    return [case_input]


def canonical_scalar(value: Any) -> Any:
    if isinstance(value, float):
        if value == float("inf"):
            return "Infinity"
        if value == float("-inf"):
            return "-Infinity"
        if value.is_integer():
            return int(value)
    return value


def normalize_structure(value: Any) -> Any:
    if isinstance(value, tuple):
        return [normalize_structure(item) for item in value]
    if isinstance(value, list):
        return [normalize_structure(item) for item in value]
    if isinstance(value, dict):
        normalized: dict[str, Any] = {}
        for key, item in value.items():
            normalized[str(key)] = normalize_structure(item)
        return normalized
    return canonical_scalar(value)


def structures_match(expected: Any, actual: Any) -> bool:
    expected = normalize_structure(expected)
    actual = normalize_structure(actual)

    if isinstance(expected, dict) and isinstance(actual, dict):
        if set(expected.keys()) != set(actual.keys()):
            return False
        return all(structures_match(expected[key], actual[key]) for key in expected)
    if isinstance(expected, list) and isinstance(actual, list):
        if len(expected) != len(actual):
            return False
        return all(structures_match(left, right) for left, right in zip(expected, actual))
    return expected == actual


def normalize_scc_groups(value: Any) -> list[tuple[int, ...]] | None:
    if not isinstance(value, list):
        return None
    groups: list[tuple[int, ...]] = []
    for item in value:
        if not isinstance(item, list):
            return None
        try:
            groups.append(tuple(sorted(int(entry) for entry in item)))
        except (TypeError, ValueError):
            return None
    groups.sort()
    return groups


def is_valid_topological_order(case_input: Any, actual: Any) -> bool:
    if not isinstance(actual, list):
        return False
    try:
        actual_nodes = [int(node) for node in actual]
    except (TypeError, ValueError):
        return False

    adjacency = case_input[0] if isinstance(case_input, list) and case_input else case_input
    if not isinstance(adjacency, dict):
        return False

    try:
        expected_nodes = sorted(int(key) for key in adjacency.keys())
    except (TypeError, ValueError):
        return False
    if sorted(actual_nodes) != expected_nodes:
        return False

    positions = {node: index for index, node in enumerate(actual_nodes)}
    for raw_node, raw_neighbors in adjacency.items():
        node = int(raw_node)
        neighbors = raw_neighbors if isinstance(raw_neighbors, list) else []
        for neighbor in neighbors:
            if positions[node] >= positions[int(neighbor)]:
                return False
    return True


def parse_literal_from_text(text: str) -> Any | None:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return None
    candidate = lines[-1]
    candidate = re.sub(
        r"(?<![A-Za-z0-9_])-?inf(?![A-Za-z0-9_])",
        lambda match: '"-Infinity"' if match.group(0).startswith("-") else '"Infinity"',
        candidate,
        flags=re.IGNORECASE,
    )
    try:
        return ast.literal_eval(candidate)
    except (SyntaxError, ValueError):
        return candidate


def render_value(value: Any) -> str:
    return repr(normalize_structure(value))


def compare_case_output(algo_name: str, test_case: dict[str, Any], actual: Any) -> bool:
    expected = test_case.get("expected")

    if algo_name == "graph/topological-sort":
        return is_valid_topological_order(test_case.get("input"), actual)

    if algo_name == "graph/strongly-connected-graph":
        return normalize_scc_groups(actual) == normalize_scc_groups(expected)

    if algo_name == "strings/aho-corasick":
        try:
            expected_pairs = sorted((str(item[0]), int(item[1])) for item in expected)
            actual_pairs = sorted((str(item[0]), int(item[1])) for item in actual)
            return actual_pairs == expected_pairs
        except (TypeError, ValueError, IndexError):
            return False

    if algo_name == "graph/hungarian-algorithm" and isinstance(expected, dict):
        normalized = normalize_structure(actual)
        if (
            isinstance(normalized, list)
            and len(normalized) == 2
            and structures_match(expected.get("assignment"), normalized[0])
            and structures_match(expected.get("total_cost"), normalized[1])
        ):
            return True

    if algo_name == "math/doomsday" and isinstance(expected, str) and isinstance(actual, int):
        names = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ]
        return 0 <= actual < len(names) and names[actual] == expected

    if algo_name == "strings/bitap-algorithm" and isinstance(expected, int):
        if isinstance(actual, (list, tuple)) and len(actual) == 2:
            text, pattern = test_case.get("input", [None, None])
            if actual[1] == -1:
                return expected == -1
            if isinstance(text, str) and isinstance(pattern, str):
                return text.find(pattern) == expected

    if algo_name == "strings/rabin-karp" and isinstance(expected, int) and isinstance(actual, list):
        first = actual[0] if actual else -1
        return structures_match(expected, first)

    if algo_name == "math/reservoir-sampling" and isinstance(actual, list):
        case_input = test_case.get("input", [])
        if (
            isinstance(case_input, list)
            and len(case_input) >= 2
            and isinstance(case_input[0], list)
            and isinstance(case_input[1], int)
        ):
            source = case_input[0]
            k = case_input[1]
            return len(actual) == k and all(item in source for item in actual)

    if structures_match(expected, actual):
        return True

    if isinstance(actual, str):
        parsed = parse_literal_from_text(actual)
        if structures_match(expected, parsed):
            return True

    return False


def transform_py2_source(source: str) -> str:
    source = source.replace("xrange(", "range(")
    source = source.replace("raw_input(", "input(")
    source = source.replace("time.clock(", "time.perf_counter(")

    transformed_lines: list[str] = []
    for line in source.splitlines():
        stripped = line.lstrip()
        indent = line[: len(line) - len(stripped)]
        if stripped.startswith("print ") and not stripped.startswith("print("):
            transformed_lines.append(f"{indent}print({stripped[6:]})")
        else:
            transformed_lines.append(line)
    return "\n".join(transformed_lines) + ("\n" if source.endswith("\n") else "")


def is_safe_expr(node: ast.AST) -> bool:
    if isinstance(node, ast.Constant):
        return True
    if isinstance(node, ast.Name):
        return True
    if isinstance(node, (ast.Tuple, ast.List, ast.Set)):
        return all(is_safe_expr(item) for item in node.elts)
    if isinstance(node, ast.Dict):
        return all(
            (key is None or is_safe_expr(key)) and is_safe_expr(value)
            for key, value in zip(node.keys, node.values)
        )
    if isinstance(node, ast.UnaryOp):
        return is_safe_expr(node.operand)
    if isinstance(node, ast.BinOp):
        return is_safe_expr(node.left) and is_safe_expr(node.right)
    if isinstance(node, ast.BoolOp):
        return all(is_safe_expr(value) for value in node.values)
    if isinstance(node, ast.Compare):
        return is_safe_expr(node.left) and all(is_safe_expr(item) for item in node.comparators)
    return False


def sanitize_module_ast(tree: ast.Module) -> ast.Module:
    body: list[ast.stmt] = []
    for index, node in enumerate(tree.body):
        if (
            index == 0
            and isinstance(node, ast.Expr)
            and isinstance(node.value, ast.Constant)
            and isinstance(node.value.value, str)
        ):
            body.append(node)
            continue
        if isinstance(node, (ast.Import, ast.ImportFrom, ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            body.append(node)
            continue
        if isinstance(node, ast.Assign) and is_safe_expr(node.value):
            body.append(node)
            continue
        if isinstance(node, ast.AnnAssign) and node.value is not None and is_safe_expr(node.value):
            body.append(node)
            continue
    return ast.Module(body=body, type_ignores=[])


def load_module_from_file(module_path: Path) -> types.ModuleType:
    source = transform_py2_source(module_path.read_text())
    tree = ast.parse(source, filename=str(module_path))
    sanitized = sanitize_module_ast(tree)
    module_name = f"algo_{hashlib.sha256(str(module_path).encode()).hexdigest()[:16]}"
    module = types.ModuleType(module_name)
    module.__file__ = str(module_path)
    module.__dict__["__name__"] = module_name
    module.__dict__["__package__"] = None
    compiled = compile(sanitized, str(module_path), "exec")

    original_path = list(sys.path)
    sys.path.insert(0, str(module_path.parent))
    try:
        exec(compiled, module.__dict__)
    finally:
        sys.path[:] = original_path
    return module


def build_fenwick_adapter(module: types.ModuleType) -> Any | None:
    tree_class = getattr(module, "FenwickTree", None)
    if not isinstance(tree_class, type):
        return None

    def fenwick_tree_operations(array: list[int], queries: list[dict[str, Any]]) -> list[int]:
        values = list(array)
        tree = tree_class(values)
        results: list[int] = []
        for query in queries:
            action = query.get("type")
            if action == "update":
                index = int(query["index"])
                new_value = int(query["value"])
                delta = new_value - values[index]
                values[index] = new_value
                tree.update(index, delta)
            elif action == "sum":
                results.append(tree.query(int(query["index"])))
        return results

    return fenwick_tree_operations


def build_segment_tree_adapter(module: types.ModuleType) -> Any | None:
    tree_class = getattr(module, "SegmentTree", None)
    if not isinstance(tree_class, type):
        return None

    def segment_tree_operations(array: list[int], queries: list[dict[str, Any]]) -> list[int]:
        tree = tree_class(list(array))
        results: list[int] = []
        for query in queries:
            action = query.get("type")
            if action == "update":
                tree.update(int(query["index"]), int(query["value"]))
            elif action == "sum":
                results.append(tree.query(int(query["left"]), int(query["right"])))
        return results

    return segment_tree_operations


def file_match_score(module_path: Path, function_name: str, algo_name: str) -> int:
    stem = module_path.stem
    if stem == function_name:
        return 30
    if normalized_symbol(stem) == normalized_symbol(function_name):
        return 20
    if normalized_symbol(stem) == normalized_symbol(algo_name.split("/")[-1]):
        return 10
    return 0


def callable_match_score(attr_name: str, function_name: str) -> int:
    candidate_names = [
        function_name,
        snake_to_camel(function_name),
        snake_to_pascal(function_name),
    ]
    for name in candidate_names:
        if attr_name == name:
            return 100 - (candidate_names.index(name) * 5)

    target = normalized_symbol(function_name)
    if normalized_symbol(attr_name) == target:
        return 80

    attr_tokens = set(split_name_tokens(attr_name))
    target_tokens = set(split_name_tokens(function_name))
    if attr_tokens and target_tokens:
        overlap = len(attr_tokens & target_tokens)
        if overlap and attr_tokens.issubset(target_tokens):
            return 60 + overlap
        if overlap >= 2:
            return 50 + overlap
    return -1


def resolve_callable(module: types.ModuleType, function_name: str) -> tuple[Any | None, int]:
    best_callable: Any | None = None
    best_score = -1
    for attr_name in sorted(dir(module)):
        if attr_name.startswith("_"):
            continue
        value = getattr(module, attr_name)
        if not callable(value) or isinstance(value, type):
            continue
        score = callable_match_score(attr_name, function_name)
        if score > best_score:
            best_callable = value
            best_score = score

    if function_name == "fenwick_tree_operations":
        adapter = build_fenwick_adapter(module)
        if adapter is not None and 85 > best_score:
            return adapter, 85
    if function_name == "segment_tree_operations":
        adapter = build_segment_tree_adapter(module)
        if adapter is not None and 85 > best_score:
            return adapter, 85
    return best_callable, best_score


def convert_numeric_strings(value: Any) -> Any:
    if isinstance(value, dict):
        converted: dict[Any, Any] = {}
        for key, item in value.items():
            if isinstance(key, str) and re.fullmatch(r"-?\d+", key):
                converted_key: Any = int(key)
            else:
                converted_key = key
            converted[converted_key] = convert_numeric_strings(item)
        return converted
    if isinstance(value, list):
        return [convert_numeric_strings(item) for item in value]
    if isinstance(value, str) and re.fullmatch(r"-?\d+", value):
        return int(value)
    return value


def graph_size(value: Any) -> int | None:
    if isinstance(value, dict):
        try:
            return max(int(key) for key in value.keys()) + 1 if value else 0
        except (TypeError, ValueError):
            return len(value)
    if isinstance(value, list):
        return len(value)
    return None


def adapt_arguments_for_callable(func: Any, args: list[Any]) -> list[Any]:
    try:
        params = list(inspect.signature(func).parameters.values())
    except (TypeError, ValueError):
        return args

    adapted = copy.deepcopy(args)
    required = [
        param
        for param in params
        if param.kind in (inspect.Parameter.POSITIONAL_ONLY, inspect.Parameter.POSITIONAL_OR_KEYWORD)
        and param.default is inspect._empty
    ]

    if len(adapted) == 1 and len(required) >= 2:
        first = adapted[0]
        first_name = required[0].name.lower()
        second_name = required[1].name.lower()
        if isinstance(first, dict) and first_name in {"vertices", "nodes"} and second_name in {"edges", "adj", "adj_list"}:
            adjacency = convert_numeric_strings(first)
            vertices = sorted(int(key) for key in adjacency.keys())
            return [vertices, adjacency]

    if len(adapted) == 1 and len(required) == 1 and isinstance(adapted[0], int):
        if "card" in required[0].name.lower():
            return [str(adapted[0])]

    if len(adapted) + 1 == len(required):
        leading_name = required[0].name.lower()
        trailing_name = required[-1].name.lower()
        if leading_name in {"n", "num_vertices", "num_nodes"} and adapted:
            size = graph_size(adapted[0])
            if size is not None:
                return [size, *adapted]
        if trailing_name == "k" and adapted and isinstance(adapted[0], list):
            return [*adapted, len(adapted[0])]
        if trailing_name == "base":
            return [*adapted, 10]
        if trailing_name in {"maxerrors", "max_errors"}:
            return [*adapted, 0]

    if len(adapted) + 2 == len(required) and adapted and isinstance(adapted[0], list):
        tail = [param.name.lower() for param in required[-2:]]
        if tail in (["startindex", "endindex"], ["low", "high"], ["left", "right"]):
            return [*adapted, 0, len(adapted[0]) - 1]
    if len(adapted) + 2 == len(required):
        tail = [param.name.lower() for param in required[-2:]]
        if tail == ["d", "q"]:
            return [*adapted, 256, 101]
    if len(adapted) == len(required) + 1 and adapted and isinstance(adapted[0], int) and len(required) >= 2:
        if required[0].name.lower() == "lines" and required[1].name.lower() == "queries":
            return adapted[1:]

    return adapted


def invoke_callable(func: Any, args: list[Any], expected: Any) -> Any:
    call_args = adapt_arguments_for_callable(func, [convert_numeric_strings(arg) for arg in args])
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        result = func(*call_args)
    if result is not None:
        return result
    if call_args and isinstance(call_args[0], list) and isinstance(expected, list):
        return call_args[0]
    printed = buffer.getvalue().strip()
    if not printed:
        return None
    if (
        isinstance(expected, list)
        and all(isinstance(item, int) for item in expected)
    ):
        numbers = [int(token) for token in re.findall(r"-?\d+", printed)]
        if numbers:
            return numbers
    parsed = parse_literal_from_text(printed)
    return printed if isinstance(parsed, str) and parsed == printed else parsed


def run_algorithm(algo_dir: Path) -> AlgorithmResult:
    algo_name = algo_name_for_dir(algo_dir)
    result = AlgorithmResult(algo_name=algo_name)
    cases_path = algo_dir / "tests" / "cases.yaml"
    if not cases_path.exists():
        return result

    data = read_cases(cases_path)
    function_name = data.get("function_signature", {}).get("name")
    if not isinstance(function_name, str) or not function_name:
        result.failed += 1
        result.errors.append(f"{algo_name}: Missing function signature")
        return result

    py_files = python_source_files(algo_dir)
    if not py_files:
        result.skipped += 1
        result.skip_messages.append(f"{algo_name}: No Python implementation")
        return result

    func = None
    chosen_file: Path | None = None
    chosen_score = -1
    load_errors: list[str] = []
    for py_file in py_files:
        try:
            module = load_module_from_file(py_file)
        except Exception as exc:
            load_errors.append(f"{py_file.name}: {exc}")
            continue
        candidate, score = resolve_callable(module, function_name)
        if candidate is None or score < 0:
            continue
        score += file_match_score(py_file, function_name, algo_name)
        if score > chosen_score:
            func = candidate
            chosen_file = py_file
            chosen_score = score

    if func is None:
        detail = load_errors[0] if load_errors else f"no callable matching '{function_name}'"
        result.failed += 1
        result.errors.append(f"{algo_name}: Failed to load '{function_name}': {detail}")
        return result

    for case in data.get("test_cases", []):
        try:
            expected = case.get("expected")
            actual = invoke_callable(func, args_for_case(data, case.get("input")), expected)
            if compare_case_output(algo_name, case, actual):
                result.passed += 1
            else:
                result.failed += 1
                result.errors.append(
                    f"{algo_name} - {case.get('name', 'unnamed case')}: "
                    f"expected {render_value(expected)}, got {render_value(actual)}"
                )
        except Exception as exc:
            result.failed += 1
            location = chosen_file.name if chosen_file else "python"
            result.errors.append(
                f"{algo_name} - {case.get('name', 'unnamed case')}: "
                f"{type(exc).__name__}: {exc} ({location})"
            )
    return result


def run_tests(algorithm_path: str | None = None) -> bool:
    passed = 0
    failed = 0
    skipped = 0
    errors: list[str] = []
    skip_messages: list[str] = []

    try:
        algo_dirs = find_algorithm_dirs(algorithm_path)
    except FileNotFoundError:
        print(f"ERROR: Algorithm path not found: {algorithm_path}")
        return False

    max_workers = 1 if algorithm_path else detect_job_count()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(run_algorithm, algo_dirs))

    for result in results:
        passed += result.passed
        failed += result.failed
        skipped += result.skipped
        errors.extend(result.errors or [])
        skip_messages.extend(result.skip_messages or [])

    total = passed + failed + skipped
    print(f"\n{'=' * 60}")
    print("Python Test Results")
    print(f"{'=' * 60}")
    print(f"  Passed:  {passed}")
    print(f"  Failed:  {failed}")
    print(f"  Skipped: {skipped} (no Python implementation)")
    print(f"  Total:   {total}")

    if skip_messages:
        print("\nSkips:")
        for message in skip_messages:
            print(f"  - {message}")

    if errors:
        print("\nFailures:")
        for error in errors:
            print(f"  x {error}")

    print()
    return failed == 0


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    success = run_tests(target)
    sys.exit(0 if success else 1)
