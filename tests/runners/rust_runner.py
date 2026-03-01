#!/usr/bin/env python3

from __future__ import annotations

import ast
import hashlib
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
ALGORITHMS_DIR = REPO_ROOT / "algorithms"
CACHE_DIR = REPO_ROOT / ".cache" / "rust-runner"
VERBOSE = os.environ.get("RUST_RUNNER_VERBOSE", "0") == "1"
RUN_TIMEOUT_SECONDS = float(os.environ.get("RUST_RUNNER_TIMEOUT_SECONDS", "10"))


@dataclass
class FunctionCandidate:
    source_index: int
    name: str
    params: list[str]
    return_type: str | None


@dataclass
class AlgorithmResult:
    algo_name: str
    passed: int = 0
    failed: int = 0
    skipped: int = 0
    errors: list[str] | None = None
    skip_messages: list[str] | None = None
    pass_messages: list[str] | None = None

    def __post_init__(self) -> None:
        if self.errors is None:
            self.errors = []
        if self.skip_messages is None:
            self.skip_messages = []
        if self.pass_messages is None:
            self.pass_messages = []


def ensure_cache_dir() -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)


def detect_job_count() -> int:
    raw = os.environ.get("RUST_RUNNER_JOBS")
    if raw:
        try:
            return max(1, int(raw))
        except ValueError:
            return 4
    return max(1, min(4, os.cpu_count() or 4))


def hash_bytes(parts: list[bytes]) -> str:
    digest = hashlib.sha256()
    for part in parts:
        digest.update(part)
        digest.update(b"\0")
    return digest.hexdigest()


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


def snake_to_camel(name: str) -> str:
    parts = name.split("_")
    if not parts:
        return name
    return parts[0] + "".join(part[:1].upper() + part[1:] for part in parts[1:])


def normalized_symbol(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


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


def flatten_expected(value: Any) -> list[Any]:
    if isinstance(value, dict):
        items: list[Any] = []
        for item in value.values():
            items.extend(flatten_expected(item))
        return items
    if isinstance(value, list):
        items: list[Any] = []
        for item in value:
            items.extend(flatten_expected(item))
        return items
    return [value]


def canonical_scalar(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float) and value == float("inf"):
        return "Infinity"
    if isinstance(value, float) and value == float("-inf"):
        return "-Infinity"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def expected_tokens(value: Any) -> list[str]:
    return [canonical_scalar(item) for item in flatten_expected(value)]


def normalize_bool_token(token: str) -> str:
    lowered = token.lower()
    if lowered == "1":
        return "true"
    if lowered == "0":
        return "false"
    return lowered


def normalize_scalar_token(token: str) -> str:
    lowered = token.lower()
    if lowered in {"inf", "infinity"}:
        return "Infinity"
    if lowered in {"-inf", "-infinity"}:
        return "-Infinity"
    if re.fullmatch(r"-?\d+\.0+", token):
        return token.split(".", 1)[0]
    return token


def extract_actual_tokens(text: str, expected: Any) -> list[str]:
    flattened = flatten_expected(expected)
    count = max(1, len(flattened))
    lowered = text.lower()

    if flattened and all(isinstance(item, bool) for item in flattened):
        found = re.findall(r"\b(?:true|false|0|1)\b", lowered)
        return [normalize_bool_token(token) for token in found][-count:]

    if flattened and all(isinstance(item, (int, float)) and not isinstance(item, bool) for item in flattened):
        return [normalize_scalar_token(token) for token in re.findall(r"-?\d+(?:\.\d+)?", text)][-count:]

    if flattened and all(isinstance(item, str) for item in flattened):
        quoted = re.findall(r'"((?:[^"\\]|\\.)*)"', text)
        if quoted:
            cleaned = [bytes(item, "utf-8").decode("unicode_escape") for item in quoted]
            return cleaned[-count:]
        pieces = [piece for piece in re.split(r"\s+", text.strip()) if piece]
        return pieces[-count:]

    pieces = [piece for piece in re.split(r"\s+", text.replace("[", " ").replace("]", " ").replace(",", " ").strip()) if piece]
    return [normalize_scalar_token(piece) for piece in pieces][-count:]


def normalize_actual(text: str, expected: Any) -> str:
    tokens = extract_actual_tokens(text, expected)
    return " ".join(tokens)


def normalize_expected(value: Any) -> str:
    return " ".join(expected_tokens(value))


def parse_debug_value(text: str) -> Any | None:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return None
    candidate = lines[-1]
    candidate = re.sub(r"(?<![A-Za-z0-9_])-?inf(?![A-Za-z0-9_])", lambda m: '"-Infinity"' if m.group(0).startswith("-") else '"Infinity"', candidate)
    try:
        return ast.literal_eval(candidate)
    except (SyntaxError, ValueError):
        return None


def normalize_scc_groups(value: Any) -> list[tuple[int, ...]] | None:
    if not isinstance(value, list):
        return None
    groups: list[tuple[int, ...]] = []
    for item in value:
        if not isinstance(item, list):
            return None
        groups.append(tuple(sorted(int(entry) for entry in item)))
    groups.sort()
    return groups


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
    if isinstance(value, float):
        if value == float("inf"):
            return "Infinity"
        if value == float("-inf"):
            return "-Infinity"
        if value.is_integer():
            return int(value)
    return value


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
    return canonical_scalar(expected) == canonical_scalar(actual)


def is_valid_topological_order(case_input: Any, actual: Any) -> bool:
    if not isinstance(actual, list):
        return False
    if not actual:
        return False
    try:
        actual_nodes = [int(node) for node in actual]
    except (TypeError, ValueError):
        return False

    adjacency = case_input[0] if isinstance(case_input, list) and case_input else case_input
    if not isinstance(adjacency, dict):
        return False

    expected_nodes = sorted(int(key) for key in adjacency.keys())
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


def compare_case_output(algo_name: str, test_case: dict[str, Any], stdout: str) -> tuple[bool, str, str]:
    expected = test_case.get("expected")
    expected_text = normalize_expected(expected)
    actual_text = normalize_actual(stdout, expected)
    parsed = parse_debug_value(stdout)

    if algo_name == "graph/hungarian-algorithm" and isinstance(expected, dict):
        normalized = normalize_structure(parsed)
        assignment = expected.get("assignment")
        total_cost = expected.get("total_cost")
        if (
            isinstance(normalized, list)
            and len(normalized) == 2
            and isinstance(normalized[0], list)
            and structures_match(assignment, normalized[0])
            and structures_match(total_cost, normalized[1])
        ):
            return True, expected_text, " ".join([*(canonical_scalar(item) for item in normalized[0]), canonical_scalar(normalized[1])])

    if algo_name == "graph/johnson-algorithm" and isinstance(parsed, str):
        if isinstance(expected, str):
            return parsed == expected, expected_text, parsed
        if isinstance(expected, dict):
            ordered_tokens: list[str] = []
            for outer_key in sorted(expected.keys(), key=lambda item: int(item)):
                inner = expected[outer_key]
                if isinstance(inner, dict):
                    for inner_key in sorted(inner.keys(), key=lambda item: int(item)):
                        ordered_tokens.append(canonical_scalar(inner[inner_key]))
            actual_tokens = [piece for piece in parsed.split() if piece]
            return actual_tokens == ordered_tokens, " ".join(ordered_tokens), " ".join(actual_tokens)

    if algo_name == "strings/aho-corasick" and isinstance(expected, list) and isinstance(parsed, list):
        try:
            expected_pairs = sorted((str(item[0]), int(item[1])) for item in expected)
            actual_pairs = sorted((str(item[0]), int(item[1])) for item in normalize_structure(parsed))
            if actual_pairs == expected_pairs:
                return True, expected_text, " ".join(f"{word} {index}" for word, index in actual_pairs)
        except (TypeError, ValueError, IndexError):
            pass

    if parsed is not None and structures_match(expected, parsed):
        if isinstance(parsed, str):
            actual_text = parsed
        return True, expected_text, actual_text

    if algo_name == "graph/topological-sort":
        if is_valid_topological_order(test_case.get("input"), parsed):
            if isinstance(parsed, list):
                actual_text = " ".join(str(int(node)) for node in parsed)
            return True, expected_text, actual_text

    if algo_name == "graph/strongly-connected-graph":
        actual_groups = normalize_scc_groups(parsed)
        expected_groups = normalize_scc_groups(expected)
        if actual_groups is not None and expected_groups is not None:
            actual_text = " ".join(str(item) for group in actual_groups for item in group)
            expected_text = " ".join(str(item) for group in expected_groups for item in group)
            return actual_groups == expected_groups, expected_text, actual_text

    return actual_text == expected_text, expected_text, actual_text


def split_params(raw: str) -> list[str]:
    params: list[str] = []
    depth_angle = 0
    depth_paren = 0
    depth_bracket = 0
    current: list[str] = []

    for char in raw:
        if char == "<":
            depth_angle += 1
        elif char == ">":
            depth_angle = max(0, depth_angle - 1)
        elif char == "(":
            depth_paren += 1
        elif char == ")":
            depth_paren = max(0, depth_paren - 1)
        elif char == "[":
            depth_bracket += 1
        elif char == "]":
            depth_bracket = max(0, depth_bracket - 1)
        elif char == "," and depth_angle == 0 and depth_paren == 0 and depth_bracket == 0:
            part = "".join(current).strip()
            if part:
                params.append(part)
            current = []
            continue
        current.append(char)

    part = "".join(current).strip()
    if part:
        params.append(part)
    return params


def strip_main(source: str) -> str:
    match = re.search(r"\bfn\s+main\s*\(", source)
    if not match:
        return source

    open_brace = source.find("{", match.end())
    if open_brace < 0:
        return source

    depth = 0
    end_index = None
    for index in range(open_brace, len(source)):
        char = source[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end_index = index + 1
                break

    if end_index is None:
        return source

    return source[:match.start()] + source[end_index:]


def collect_function_candidates(sources: list[str]) -> list[FunctionCandidate]:
    pattern = re.compile(
        r"(^|\n)\s*(?:pub(?:\([^)]*\))?\s+)?fn\s+([A-Za-z_]\w*)\s*(?:<[^>{}]*>)?\s*\(([^)]*)\)\s*(?:->\s*([^{]+?))?\s*\{",
        re.MULTILINE,
    )
    results: list[FunctionCandidate] = []
    for source_index, source in enumerate(sources):
        stripped = strip_main(source)
        for match in pattern.finditer(stripped):
            name = match.group(2)
            if name == "main":
                continue
            params = split_params(match.group(3))
            return_type = match.group(4).strip() if match.group(4) else None
            results.append(
                FunctionCandidate(
                    source_index=source_index,
                    name=name,
                    params=params,
                    return_type=return_type,
                )
            )
    return results


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
        declared = normalize_sig_inputs(data.get("function_signature", {}).get("input"))
        if len(declared) == 1 and len(case_input) > 1 and all(not isinstance(item, (list, dict)) for item in case_input):
            return [list(case_input)]
        return list(case_input)
    return [case_input]


def dense_indexed_values(value: dict[Any, Any]) -> list[Any] | None:
    if not isinstance(value, dict):
        return None
    if not value:
        return []

    indexed_items: list[tuple[int, Any]] = []
    for key, item in value.items():
        try:
            index = int(key)
        except (TypeError, ValueError):
            return None
        if index < 0:
            return None
        indexed_items.append((index, item))

    indexed_items.sort(key=lambda pair: pair[0])
    sample = indexed_items[0][1]

    def default_value() -> Any:
        if isinstance(sample, list):
            return []
        if isinstance(sample, dict):
            return {}
        return 0

    dense = [default_value() for _ in range(indexed_items[-1][0] + 1)]
    for index, item in indexed_items:
        dense[index] = item
    return dense


def extract_param_type(param: str) -> str:
    if ":" not in param:
        return param.strip()
    return param.split(":", 1)[1].strip()


def normalized_container_value(kind: str, value: Any) -> Any:
    if kind in {"vec", "vec2", "vec3", "vec_pair"} and isinstance(value, dict):
        return dense_indexed_values(value)
    if kind == "vec2" and isinstance(value, list) and all(isinstance(item, dict) for item in value):
        dense_rows = []
        for item in value:
            if not isinstance(item, dict):
                dense_rows.append(item)
                continue
            dense = dense_indexed_values(item)
            if dense is None:
                dense = list(item.values())
            dense_rows.append(dense)
        if any(item is None for item in dense_rows):
            return None
        return dense_rows
    return value


def param_kind(param: str, value: Any) -> str:
    type_name = extract_param_type(param)
    compact = re.sub(r"\s+", "", type_name)

    if "HashMap<" in compact:
        return "hashmap"
    if "Vec<(" in compact:
        return "vec_pair"
    vec_count = compact.count("Vec<")
    if vec_count >= 3:
        return "vec3"
    if vec_count >= 2:
        return "vec2"
    if vec_count >= 1 or "[" in compact:
        return "vec"
    if "&str" in compact or "String" in compact:
        return "string"
    if "bool" in compact:
        return "bool"
    return "scalar"


def is_param_compatible(param: str, value: Any) -> bool:
    kind = param_kind(param, value)
    value = normalized_container_value(kind, value)
    if value is None:
        return False

    if kind == "string":
        return isinstance(value, str)
    if kind in {"bool", "scalar"}:
        return not isinstance(value, (list, dict))
    if kind == "vec":
        return isinstance(value, list) and all(not isinstance(item, (list, dict)) for item in value)
    if kind == "vec_pair":
        return isinstance(value, list) and all(isinstance(item, list) and len(item) == 2 for item in value)
    if kind == "vec2":
        return isinstance(value, list) and all(isinstance(item, list) for item in value)
    if kind == "vec3":
        return (
            isinstance(value, list)
            and all(
                isinstance(item, list) and all(isinstance(child, list) for child in item)
                for item in value
            )
        )
    if kind == "hashmap":
        return isinstance(value, dict)
    return False


def resolve_function(data: dict[str, Any], candidates: list[FunctionCandidate], sample_args: list[Any]) -> FunctionCandidate | None:
    if not candidates:
        return None

    desired = str(data.get("function_signature", {}).get("name", "")).strip()
    camel = snake_to_camel(desired)
    desired_norm = normalized_symbol(desired)
    camel_norm = normalized_symbol(camel)
    arg_count = len(sample_args)

    ranked: list[tuple[int, FunctionCandidate]] = []
    for candidate in candidates:
        score = 100
        if desired and candidate.name == desired:
            score = 0
        elif desired and candidate.name == camel:
            score = 1
        elif desired and normalized_symbol(candidate.name) == desired_norm:
            score = 2
        elif desired and normalized_symbol(candidate.name) == camel_norm:
            score = 3
        elif desired and desired_norm and desired_norm in normalized_symbol(candidate.name):
            score = 4
        elif desired and camel_norm and camel_norm in normalized_symbol(candidate.name):
            score = 5
        ranked.append((score, candidate))

    ranked.sort(key=lambda item: (item[0], item[1].name))
    compatible_by_arity = [
        candidate
        for candidate in candidates
        if len(candidate.params) == arg_count
        and all(is_param_compatible(param, value) for param, value in zip(candidate.params, sample_args))
    ]

    if not ranked or ranked[0][0] >= 100:
        viable = [
            candidate
            for candidate in compatible_by_arity
            if candidate.return_type is not None and candidate.return_type.strip() != "()"
        ]
        if len(viable) == 1:
            return viable[0]
        return None

    best_score = ranked[0][0]
    best_matches = [item[1] for item in ranked if item[0] == best_score]
    compatible = [candidate for candidate in compatible_by_arity if candidate in best_matches]
    if not compatible:
        if best_score < 100:
            viable = [
                candidate
                for candidate in compatible_by_arity
                if candidate.return_type is not None and candidate.return_type.strip() != "()"
            ]
            if len(viable) == 1:
                return viable[0]
        return None

    compatible.sort(
        key=lambda candidate: (
            candidate.return_type is None or candidate.return_type == "()",
            sum("&mut" in param for param in candidate.params),
            candidate.source_index,
            candidate.name,
        )
    )
    if best_score >= 10 and len(compatible) > 1:
        return None
    return compatible[0]


def rust_string_literal(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\t", "\\t")
    )
    return f'"{escaped}"'


def scalar_literal(value: Any, type_name: str) -> str:
    compact = re.sub(r"\s+", "", type_name)
    if compact.startswith("Option<") and compact.endswith(">"):
        inner = compact[len("Option<") : -1]
        if value is None:
            return "None"
        return f"Some({scalar_literal(value, inner)})"
    if "&str" in compact:
        return rust_string_literal(str(value))
    if "String" in compact:
        return f"String::from({rust_string_literal(str(value))})"
    if "bool" in compact:
        return "true" if bool(value) else "false"
    if isinstance(value, str) and value.lower() in {"infinity", "inf"} and ("f32" in compact or "f64" in compact):
        return "f64::INFINITY" if "f64" in compact else "f32::INFINITY"
    if isinstance(value, str) and value.lower() in {"-infinity", "-inf"} and ("f32" in compact or "f64" in compact):
        return "-f64::INFINITY" if "f64" in compact else "-f32::INFINITY"
    if "f32" in compact or "f64" in compact:
        if isinstance(value, bool):
            return "1.0" if value else "0.0"
        if isinstance(value, (int, float)):
            return str(float(value))
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    if value is None:
        return "None"
    return str(value)


def element_type(type_name: str) -> str:
    compact = re.sub(r"\s+", "", type_name)
    match = re.search(r"Vec<(.+)>", compact)
    if match:
        return match.group(1)
    if compact.startswith("&[") and compact.endswith("]"):
        return compact[2:-1]
    if compact.startswith("&mut[") and compact.endswith("]"):
        return compact[5:-1]
    if compact.startswith("[") and compact.endswith("]"):
        return compact[1:-1]
    return "i32"


def split_generic_args(raw: str) -> list[str]:
    parts: list[str] = []
    current: list[str] = []
    depth = 0
    for char in raw:
        if char == "<":
            depth += 1
        elif char == ">":
            depth = max(0, depth - 1)
        elif char == "," and depth == 0:
            part = "".join(current).strip()
            if part:
                parts.append(part)
            current = []
            continue
        current.append(char)
    part = "".join(current).strip()
    if part:
        parts.append(part)
    return parts


def vector_literal(values: list[Any], type_name: str) -> str:
    inner_type = element_type(type_name)
    return "vec![" + ", ".join(scalar_literal(item, inner_type) for item in values) + "]"


def nested_vector_literal(values: list[list[Any]], type_name: str) -> str:
    inner_type = element_type(type_name)
    return "vec![" + ", ".join(vector_literal(item, inner_type) for item in values) + "]"


def triple_nested_vector_literal(values: list[list[list[Any]]], type_name: str) -> str:
    inner_type = element_type(type_name)
    return "vec![" + ", ".join(nested_vector_literal(item, inner_type) for item in values) + "]"


def pair_vector_literal(values: list[list[Any]], type_name: str) -> str:
    compact = re.sub(r"\s+", "", type_name)
    pair_match = re.search(r"Vec<\((.+)\)>", compact)
    left_type = "i32"
    right_type = "i32"
    if pair_match:
        inner = split_generic_args(pair_match.group(1))
        if len(inner) == 2:
            left_type, right_type = inner
    items = []
    for item in values:
        if not isinstance(item, list) or len(item) != 2:
            raise ValueError("expected 2-item pair")
        items.append(f"({scalar_literal(item[0], left_type)}, {scalar_literal(item[1], right_type)})")
    return "vec![" + ", ".join(items) + "]"


def rust_value_literal(value: Any, type_name: str) -> str:
    compact = re.sub(r"\s+", "", type_name)
    if "HashMap<" in compact:
        inner = compact[compact.index("<") + 1 : compact.rindex(">")]
        key_type, value_type = split_generic_args(inner)
        items = []
        for key, item in value.items():
            items.append(
                "("
                + scalar_literal(key, key_type)
                + ", "
                + rust_value_literal(item, value_type)
                + ")"
            )
        return "std::collections::HashMap::from([" + ", ".join(items) + "])"
    if "Vec<(" in compact:
        return pair_vector_literal(value, compact)
    vec_count = compact.count("Vec<")
    if vec_count >= 3:
        return triple_nested_vector_literal(value, compact)
    if vec_count >= 2:
        return nested_vector_literal(value, compact)
    if vec_count >= 1 or "[" in compact:
        return vector_literal(value, compact)
    return scalar_literal(value, compact)


def declare_arg(index: int, param: str, value: Any) -> tuple[str, str] | None:
    kind = param_kind(param, value)
    value = normalized_container_value(kind, value)
    if value is None:
        return None

    type_name = extract_param_type(param)
    compact = re.sub(r"\s+", "", type_name)
    base_type = compact
    if compact.startswith("&mut"):
        base_type = compact[4:]
    elif compact.startswith("&"):
        base_type = compact[1:]

    name = f"arg{index}"
    mutable = "&mut" in compact

    try:
        literal = rust_value_literal(value, base_type)
    except (TypeError, ValueError):
        return None

    declaration = f"let {'mut ' if mutable else ''}{name} = {literal};"
    if compact.startswith("&mut"):
        call_arg = f"&mut {name}"
    elif compact.startswith("&"):
        call_arg = f"&{name}"
    else:
        call_arg = name

    if "&str" in compact:
        declaration = f"let {name} = {rust_string_literal(str(value))};"
        call_arg = name
    elif compact == "String":
        declaration = f"let {name} = String::from({rust_string_literal(str(value))});"

    return declaration, call_arg


def render_wrapper_source(source: str, candidate: FunctionCandidate, test_cases: list[dict[str, Any]], data: dict[str, Any]) -> str | None:
    body_parts = [strip_main(source), "", "fn emit_debug<T: std::fmt::Debug>(value: &T) {", '    println!("{:?}", value);', "}", "", "fn main() {", "    let case_index = std::env::args().nth(1).and_then(|s| s.parse::<usize>().ok()).unwrap_or(usize::MAX);", "    match case_index {"]

    returns_void = candidate.return_type is None or candidate.return_type.strip() == "()"

    for case_index, test_case in enumerate(test_cases):
        args = args_for_case(data, test_case.get("input"))
        if len(args) != len(candidate.params):
            return None

        declarations: list[str] = []
        call_args: list[str] = []
        for arg_index, (param, value) in enumerate(zip(candidate.params, args)):
            declared = declare_arg(arg_index, param, value)
            if declared is None:
                return None
            declaration, call_arg = declared
            declarations.append(declaration)
            call_args.append(call_arg)

        body_parts.append(f"        {case_index} => {{")
        for declaration in declarations:
            body_parts.append(f"            {declaration}")
        call_expr = f"{candidate.name}({', '.join(call_args)})"
        if returns_void:
            body_parts.append(f"            {call_expr};")
            if not declarations:
                return None
            body_parts.append("            emit_debug(&arg0);")
        else:
            body_parts.append(f"            let result = {call_expr};")
            body_parts.append("            emit_debug(&result);")
        body_parts.append("        }")

    body_parts.extend(["        _ => std::process::exit(2),", "    }", "}"])
    return "\n".join(body_parts) + "\n"


def compile_cached_binary(algo_dir: Path, wrapper_source: str) -> tuple[Path | None, str | None]:
    key_parts = [str(algo_dir.relative_to(REPO_ROOT)).encode(), wrapper_source.encode()]
    source_hash = hash_bytes(key_parts)
    wrapper_file = CACHE_DIR / f"{source_hash}_wrapper.rs"
    binary_path = CACHE_DIR / f"{source_hash}.bin"
    if binary_path.exists():
        return binary_path, None

    wrapper_file.write_text(wrapper_source)
    temp_binary = CACHE_DIR / f"{source_hash}.{os.getpid()}.tmp.bin"
    run = subprocess.run(
        ["rustc", "-O", "--crate-name", f"rust_runner_{source_hash}", str(wrapper_file), "-o", str(temp_binary)],
        capture_output=True,
        text=True,
    )
    if run.returncode != 0:
        temp_binary.unlink(missing_ok=True)
        error_lines = [line for line in run.stderr.splitlines() if line.strip()][:5]
        return None, "\n".join(error_lines) or "Compilation failed"

    try:
        temp_binary.replace(binary_path)
    except FileExistsError:
        temp_binary.unlink(missing_ok=True)
    return binary_path, None


def run_wrapper_mode(result: AlgorithmResult, binary: Path, test_cases: list[dict[str, Any]]) -> None:
    for index, test_case in enumerate(test_cases):
        case_name = str(test_case.get("name", "unnamed"))
        try:
            run = subprocess.run(
                [str(binary), str(index)],
                capture_output=True,
                text=True,
                timeout=RUN_TIMEOUT_SECONDS,
            )
        except subprocess.TimeoutExpired:
            result.failed += 1
            result.errors.append(f"{result.algo_name} - {case_name}: Timed out")
            continue

        if run.returncode != 0:
            result.failed += 1
            result.errors.append(f"{result.algo_name} - {case_name}: Runtime error")
            continue

        matched, expected_text, actual_text = compare_case_output(result.algo_name, test_case, run.stdout)
        if matched:
            result.passed += 1
            if VERBOSE:
                result.pass_messages.append(f"[PASS] {result.algo_name} - {case_name}")
        else:
            result.failed += 1
            result.errors.append(f"{result.algo_name} - {case_name}: expected={expected_text} got={actual_text}")


def process_algorithm(algo_dir: Path) -> AlgorithmResult:
    algo_name = algo_name_for_dir(algo_dir)
    result = AlgorithmResult(algo_name=algo_name)
    cases_file = algo_dir / "tests" / "cases.yaml"
    rust_dir = algo_dir / "rust"

    if not cases_file.exists():
        return result

    if not rust_dir.exists():
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No Rust implementation found")
        return result

    rust_files = sorted(rust_dir.glob("*.rs"))
    if not rust_files:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No .rs files found")
        return result

    try:
        data = read_cases(cases_file)
    except Exception as exc:
        result.failed = 1
        result.errors.append(f"{algo_name}: Failed to parse cases.yaml ({exc})")
        return result

    test_cases = data.get("test_cases") or []
    if not test_cases:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No test cases defined")
        return result

    sources = [path.read_text() for path in rust_files]
    sample_args = args_for_case(data, test_cases[0].get("input"))
    candidate = resolve_function(data, collect_function_candidates(sources), sample_args)
    if candidate is None:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No testable Rust function signature found")
        return result

    wrapper_source = render_wrapper_source(
        sources[candidate.source_index],
        candidate,
        test_cases,
        data,
    )
    if wrapper_source is None:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: Unsupported Rust signature for automated testing")
        return result

    binary, compile_error = compile_cached_binary(algo_dir, wrapper_source)
    if binary is None:
        result.failed = 1
        result.errors.append(f"{algo_name}: Compilation failed: {compile_error}")
        return result

    run_wrapper_mode(result, binary, test_cases)
    return result


def print_result_messages(result: AlgorithmResult) -> None:
    for message in result.pass_messages:
        print(message)
    for message in result.skip_messages:
        print(message)
    for error in result.errors:
        if ": expected=" in error:
            algo_case, detail = error.split(": ", 1)
            print(f"[FAIL] {algo_case}: {detail}")
        elif " - " in error and ": " in error:
            prefix, detail = error.split(": ", 1)
            print(f"[FAIL] {prefix}: {detail}")
        else:
            print(f"[FAIL] {error}")


def summarize(results: list[AlgorithmResult]) -> int:
    passed = sum(item.passed for item in results)
    failed = sum(item.failed for item in results)
    skipped = sum(item.skipped for item in results)
    total = passed + failed + skipped

    print("")
    print("============================================================")
    print("Rust Test Results")
    print("============================================================")
    print(f"  Passed:  {passed}")
    print(f"  Failed:  {failed}")
    print(f"  Skipped: {skipped} (no Rust implementation)")
    print(f"  Total:   {total}")

    errors = [error for result in results for error in result.errors]
    if errors:
        print("")
        print("Failures:")
        for error in errors:
            print(f"  x {error}")
    print("")
    return 1 if failed else 0


def main(argv: list[str]) -> int:
    ensure_cache_dir()

    target = argv[1] if len(argv) > 1 else None
    try:
        algo_dirs = find_algorithm_dirs(target)
    except FileNotFoundError:
        print(f"[FAIL] {target}: algorithm path not found")
        return 1

    max_workers = detect_job_count() if target is None else 1
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(process_algorithm, algo_dirs))

    for result in results:
        print_result_messages(result)

    return summarize(results)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
