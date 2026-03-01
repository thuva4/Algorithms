#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]
ALGORITHMS_DIR = REPO_ROOT / "algorithms"
CACHE_DIR = REPO_ROOT / ".cache" / "go-runner"
GO_BUILD_CACHE = REPO_ROOT / ".cache" / "go-build"
RUN_TIMEOUT_SECONDS = float(os.environ.get("GO_RUNNER_TIMEOUT_SECONDS", "10"))
BUILD_TIMEOUT_SECONDS = float(os.environ.get("GO_RUNNER_BUILD_TIMEOUT_SECONDS", "60"))


@dataclass
class GoParam:
    name: str
    type_name: str


@dataclass
class FunctionCandidate:
    source_index: int
    name: str
    params: list[GoParam]
    returns: list[str]


@dataclass
class TypeDef:
    kind: str
    target: str | None = None
    fields: list[GoParam] | None = None


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


def ensure_cache_dirs() -> None:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    GO_BUILD_CACHE.mkdir(parents=True, exist_ok=True)


def detect_job_count() -> int:
    raw = os.environ.get("GO_RUNNER_JOBS")
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


def snake_to_pascal(name: str) -> str:
    return "".join(part[:1].upper() + part[1:] for part in name.split("_") if part)


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


def split_top_level(text: str, delimiter: str = ",") -> list[str]:
    items: list[str] = []
    current: list[str] = []
    depth_paren = 0
    depth_bracket = 0
    depth_brace = 0
    for char in text:
        if char == "(":
            depth_paren += 1
        elif char == ")":
            depth_paren = max(0, depth_paren - 1)
        elif char == "[":
            depth_bracket += 1
        elif char == "]":
            depth_bracket = max(0, depth_bracket - 1)
        elif char == "{":
            depth_brace += 1
        elif char == "}":
            depth_brace = max(0, depth_brace - 1)
        elif char == delimiter and depth_paren == 0 and depth_bracket == 0 and depth_brace == 0:
            piece = "".join(current).strip()
            if piece:
                items.append(piece)
            current = []
            continue
        current.append(char)
    piece = "".join(current).strip()
    if piece:
        items.append(piece)
    return items


def last_top_level_space(text: str) -> int:
    depth_paren = 0
    depth_bracket = 0
    depth_brace = 0
    depth_angle = 0
    result = -1
    for index, char in enumerate(text):
        if char == "(":
            depth_paren += 1
        elif char == ")":
            depth_paren = max(0, depth_paren - 1)
        elif char == "[":
            depth_bracket += 1
        elif char == "]":
            depth_bracket = max(0, depth_bracket - 1)
        elif char == "{":
            depth_brace += 1
        elif char == "}":
            depth_brace = max(0, depth_brace - 1)
        elif char == "<":
            depth_angle += 1
        elif char == ">":
            depth_angle = max(0, depth_angle - 1)
        elif char.isspace() and depth_paren == 0 and depth_bracket == 0 and depth_brace == 0 and depth_angle == 0:
            result = index
    return result


def expand_go_params(params_text: str) -> list[GoParam]:
    pieces = split_top_level(params_text)
    result: list[GoParam] = []
    pending_names: list[str] = []

    for piece in pieces:
        idx = last_top_level_space(piece)
        if idx == -1:
            pending_names.append(piece.strip())
            continue
        names_part = piece[:idx].strip()
        type_part = piece[idx + 1 :].strip()
        names = [name.strip() for name in names_part.split(",") if name.strip()]
        if not names:
            names = pending_names or [f"arg{len(result)}"]
        else:
            names = pending_names + names
        pending_names = []
        for name in names:
            result.append(GoParam(name=name, type_name=type_part))

    for name in pending_names:
        result.append(GoParam(name=name, type_name="interface{}"))
    return result


def parse_return_types(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    if text.startswith("(") and text.endswith(")"):
        return [piece.strip() for piece in split_top_level(text[1:-1]) if piece.strip()]
    return [text]


def extract_struct_types(source: str) -> dict[str, TypeDef]:
    type_defs: dict[str, TypeDef] = {}
    struct_pattern = re.compile(r"type\s+([A-Za-z_][A-Za-z0-9_]*)\s+struct\s*\{(.*?)\}", re.S)
    for match in struct_pattern.finditer(source):
        fields: list[GoParam] = []
        for raw_line in match.group(2).splitlines():
            line = raw_line.split("//", 1)[0].strip()
            if not line:
                continue
            fields.extend(expand_go_params(line))
        type_defs[match.group(1)] = TypeDef(kind="struct", fields=fields)

    alias_pattern = re.compile(r"type\s+([A-Za-z_][A-Za-z0-9_]*)\s+([^\s{][^\n]*)")
    for match in alias_pattern.finditer(source):
        name = match.group(1)
        if name in type_defs:
            continue
        target = match.group(2).strip()
        if target.startswith("struct"):
            continue
        type_defs[name] = TypeDef(kind="alias", target=target)
    return type_defs


def strip_go_main(source: str) -> str:
    match = re.search(r"\bfunc\s+main\s*\(", source)
    if not match:
        return source
    brace_start = source.find("{", match.end())
    if brace_start == -1:
        return source
    depth = 0
    end = brace_start
    while end < len(source):
        if source[end] == "{":
            depth += 1
        elif source[end] == "}":
            depth -= 1
            if depth == 0:
                end += 1
                break
        end += 1
    return source[: match.start()] + source[end:]


def imported_name(spec: str) -> str | None:
    spec = spec.strip()
    if not spec:
        return None
    if spec.startswith("_ ") or spec.startswith(". "):
        return spec.split()[0]
    alias_match = re.match(r'([A-Za-z_][A-Za-z0-9_]*)\s+"', spec)
    if alias_match:
        return alias_match.group(1)
    path_match = re.search(r'"([^"]+)"', spec)
    if not path_match:
        return None
    return path_match.group(1).split("/")[-1]


def spec_is_used(body: str, spec: str) -> bool:
    name = imported_name(spec)
    if not name:
        return True
    if name in {"_", "."}:
        return True
    return bool(re.search(rf"\b{re.escape(name)}\s*\.", body))


def strip_unused_imports(source: str) -> str:
    block_pattern = re.compile(r"(?ms)^(\s*)import\s*\((.*?)^\s*\)\s*")

    def replace_block(match: re.Match[str]) -> str:
        body_without = source[: match.start()] + source[match.end() :]
        specs: list[str] = []
        for raw_line in match.group(2).splitlines():
            for piece in raw_line.split(";"):
                piece = piece.strip()
                if piece:
                    specs.append(piece)
        kept = [spec for spec in specs if spec and spec_is_used(body_without, spec)]
        if not kept:
            return ""
        rendered = "\n".join(f"\t{spec}" for spec in kept)
        return f"{match.group(1)}import (\n{rendered}\n)\n"

    updated = block_pattern.sub(replace_block, source)

    single_pattern = re.compile(r'(?m)^(\s*)import\s+([^\n]+)\n')

    def replace_single(match: re.Match[str]) -> str:
        spec = match.group(2).strip()
        body_without = updated[: match.start()] + updated[match.end() :]
        if spec_is_used(body_without, spec):
            return f"{match.group(1)}import {spec}\n"
        return ""

    return single_pattern.sub(replace_single, updated)


def rewrite_go_source(source: str) -> str:
    stripped = strip_go_main(source)
    rewritten = re.sub(r"^\s*package\s+[A-Za-z_][A-Za-z0-9_]*", "package main", stripped, count=1, flags=re.M)
    rewritten = re.sub(
        r"import\s*\(([^()\n]*)\)",
        lambda match: "import (\n"
        + "\n".join(f"\t{piece.strip()}" for piece in match.group(1).split(";") if piece.strip())
        + "\n)",
        rewritten,
    )
    return strip_unused_imports(rewritten)


def collect_function_candidates(sources: list[str]) -> list[FunctionCandidate]:
    pattern = re.compile(
        r"func\s*(?:\([^\)]*\)\s*)?(?P<name>[A-Za-z_][A-Za-z0-9_]*)\s*\((?P<params>[^\)]*)\)\s*(?P<ret>\([^\)]*\)|[^\{\n]+)?\s*\{",
        re.S,
    )
    results: list[FunctionCandidate] = []
    for source_index, source in enumerate(sources):
        for match in pattern.finditer(strip_go_main(source)):
            name = match.group("name")
            if name == "main":
                continue
            results.append(
                FunctionCandidate(
                    source_index=source_index,
                    name=name,
                    params=expand_go_params(match.group("params")),
                    returns=parse_return_types(match.group("ret") or ""),
                )
            )
    return results


def source_defines_function(source: str, name: str) -> bool:
    pattern = re.compile(rf"\bfunc\s*(?:\([^\)]*\)\s*)?{re.escape(name)}\s*\(")
    return bool(pattern.search(strip_go_main(source)))


def is_go_scalar_type(type_name: str) -> bool:
    return type_name in {
        "int",
        "int8",
        "int16",
        "int32",
        "int64",
        "uint",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "float32",
        "float64",
        "bool",
        "string",
        "byte",
        "rune",
    }


def go_type_compatible(type_name: str, value: Any) -> bool:
    type_name = type_name.strip()
    if not type_name:
        return False
    if type_name.startswith("*"):
        return value is None or go_type_compatible(type_name[1:].strip(), value)
    if type_name.startswith("[]"):
        return isinstance(value, list)
    if type_name.startswith("["):
        return isinstance(value, list)
    if type_name.startswith("map["):
        return isinstance(value, dict)
    if type_name.startswith("..."):
        return isinstance(value, list)
    if is_go_scalar_type(type_name):
        return not isinstance(value, (list, dict))
    return True


def resolve_function(
    data: dict[str, Any],
    candidates: list[FunctionCandidate],
    sample_args: list[Any],
) -> FunctionCandidate | None:
    if not candidates:
        return None

    desired = str(data.get("function_signature", {}).get("name", "")).strip()
    names = {
        desired,
        snake_to_camel(desired),
        snake_to_pascal(desired),
    }
    normalized_names = {normalized_symbol(name) for name in names if name}

    ranked: list[tuple[int, FunctionCandidate]] = []
    for candidate in candidates:
        if candidate.name in names:
            score = 0
        elif normalized_symbol(candidate.name) in normalized_names:
            score = 1
        else:
            score = 100
        ranked.append((score, candidate))

    ranked.sort(key=lambda item: (item[0], item[1].source_index, item[1].name))
    if not ranked or ranked[0][0] >= 100:
        return None

    best_score = ranked[0][0]
    matching = [candidate for score, candidate in ranked if score == best_score]
    matching = [candidate for candidate in matching if len(candidate.params) == len(sample_args)]
    if not matching:
        return None
    compatible = [
        candidate
        for candidate in matching
        if all(go_type_compatible(param.type_name, value) for param, value in zip(candidate.params, sample_args))
    ]
    if not compatible:
        return matching[0]
    compatible.sort(key=lambda candidate: (len(candidate.returns) == 0, candidate.source_index, candidate.name))
    return compatible[0]


def preferred_source_index(
    desired_name: str,
    candidate_name: str,
    go_files: list[Path],
    sources: list[str],
    fallback: int,
) -> int:
    exact_snake = desired_name
    exact_camel = snake_to_camel(desired_name)
    exact_pascal = snake_to_pascal(desired_name)
    ranked: list[tuple[int, int]] = []
    for index, path in enumerate(go_files):
        if not source_defines_function(sources[index], candidate_name):
            continue
        stem = path.stem
        if stem == exact_snake:
            score = 0
        elif stem == exact_camel:
            score = 1
        elif stem == exact_pascal:
            score = 2
        elif normalized_symbol(stem) == normalized_symbol(desired_name):
            score = 3
        else:
            score = 10
        ranked.append((score, index))
    if not ranked:
        return fallback
    ranked.sort()
    return ranked[0][1]


def candidate_for_source(
    candidates: list[FunctionCandidate],
    name: str,
    source_index: int,
    fallback: FunctionCandidate,
) -> FunctionCandidate:
    for candidate in candidates:
        if candidate.source_index == source_index and candidate.name == name:
            return candidate
    return fallback


def parse_map_type(type_name: str) -> tuple[str, str] | None:
    if not type_name.startswith("map["):
        return None
    depth = 0
    for index, char in enumerate(type_name):
        if char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return type_name[4:index], type_name[index + 1 :].strip()
    return None


def parse_array_type(type_name: str) -> tuple[str | None, str] | None:
    if not type_name.startswith("["):
        return None
    end = type_name.find("]")
    if end == -1:
        return None
    length = type_name[1:end].strip() or None
    return length, type_name[end + 1 :].strip()


def normalize_numeric_nulls(value: Any) -> Any:
    if isinstance(value, list):
        return [normalize_numeric_nulls(-1 if item is None else item) for item in value]
    if isinstance(value, dict):
        return {key: normalize_numeric_nulls(item) for key, item in value.items()}
    return value


def go_string_literal(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\t", "\\t")
    )
    return f'"{escaped}"'


def scalar_literal(type_name: str, value: Any) -> str:
    if type_name in {"string"}:
        return go_string_literal("" if value is None else str(value))
    if type_name == "bool":
        return "true" if bool(value) else "false"
    if type_name in {"float32", "float64"}:
        number = 0.0 if value is None else float(value)
        if number == float("inf"):
            return "math.Inf(1)"
        if number == float("-inf"):
            return "math.Inf(-1)"
        return repr(number)
    if type_name in {"int64", "int32", "int16", "int8", "int", "uint64", "uint32", "uint16", "uint8", "uint"}:
        number = -1 if value is None else int(value)
        if type_name == "int":
            return str(number)
        return f"{type_name}({number})"
    if type_name in {"byte", "rune"}:
        number = -1 if value is None else int(value)
        return f"{type_name}({number})"
    if value is None:
        return "nil"
    if isinstance(value, str):
        return go_string_literal(value)
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def go_literal(type_name: str, value: Any, type_defs: dict[str, TypeDef]) -> str:
    type_name = type_name.strip()
    if not type_name:
        return "nil"

    if value is None and type_name.startswith("[]"):
        return f"{type_name}{{}}"
    if value is None and type_name.startswith("["):
        return f"{type_name}{{}}"
    if value is None and type_name.startswith("map["):
        return f"{type_name}{{}}"
    if value is None and type_name.startswith("*"):
        return "nil"

    if type_name.startswith("..."):
        return go_literal("[]" + type_name[3:].strip(), value, type_defs)

    if type_name.startswith("*"):
        inner = type_name[1:].strip()
        return f"func() *{inner} {{ v := {go_literal(inner, value, type_defs)}; return &v }}()"

    if is_go_scalar_type(type_name):
        return scalar_literal(type_name, value)

    if type_name.startswith("[]"):
        inner = type_name[2:].strip()
        items = value if isinstance(value, list) else []
        items = normalize_numeric_nulls(items)
        return f"{type_name}{{{', '.join(go_literal(inner, item, type_defs) for item in items)}}}"

    array_parts = parse_array_type(type_name)
    if array_parts:
        _, inner = array_parts
        items = value if isinstance(value, list) else []
        items = normalize_numeric_nulls(items)
        return f"{type_name}{{{', '.join(go_literal(inner, item, type_defs) for item in items)}}}"

    map_parts = parse_map_type(type_name)
    if map_parts:
        key_type, value_type = map_parts
        entries: list[str] = []
        mapping = value if isinstance(value, dict) else {}
        for key in sorted(mapping, key=lambda item: str(item)):
            entries.append(
                f"{go_literal(key_type, key, type_defs)}: {go_literal(value_type, mapping[key], type_defs)}"
            )
        return f"{type_name}{{{', '.join(entries)}}}"

    type_def = type_defs.get(type_name)
    if type_def and type_def.kind == "alias" and type_def.target:
        target = type_def.target.strip()
        if target.startswith("[]") or target.startswith("[") or target.startswith("map["):
            rendered = go_literal(target, value, type_defs)
            body = rendered[rendered.find("{") :]
            return f"{type_name}{body}"
        if is_go_scalar_type(target):
            inner = scalar_literal(target, value)
            return f"{type_name}({inner})"
        return go_literal(target, value, type_defs)

    if type_def and type_def.kind == "struct":
        fields = type_def.fields or []
        normalized = normalize_numeric_nulls(value)
        if isinstance(normalized, dict):
            parts: list[str] = []
            for field in fields:
                if field.name in normalized:
                    parts.append(f"{field.name}: {go_literal(field.type_name, normalized[field.name], type_defs)}")
            return f"{type_name}{{{', '.join(parts)}}}"
        if isinstance(normalized, list):
            parts = []
            for index, field in enumerate(fields):
                if index < len(normalized):
                    parts.append(f"{field.name}: {go_literal(field.type_name, normalized[index], type_defs)}")
            return f"{type_name}{{{', '.join(parts)}}}"
        return f"{type_name}{{}}"

    if isinstance(value, str):
        return scalar_literal("string", value)
    if isinstance(value, bool):
        return scalar_literal("bool", value)
    if isinstance(value, (int, float)):
        return scalar_literal("int", value)
    if isinstance(value, list):
        items = normalize_numeric_nulls(value)
        return f"{type_name}{{{', '.join(go_literal('interface{}', item, type_defs) for item in items)}}}"
    if isinstance(value, dict):
        entries = [f"{go_string_literal(str(key))}: {go_literal('interface{}', item, type_defs)}" for key, item in value.items()]
        return f"map[string]interface{{}}{{{', '.join(entries)}}}"
    return "nil"


def expected_tokens(value: Any) -> list[str]:
    if isinstance(value, dict):
        tokens: list[str] = []
        for item in value.values():
            tokens.extend(expected_tokens(item))
        return tokens
    if isinstance(value, list):
        tokens: list[str] = []
        for item in value:
            tokens.extend(expected_tokens(item))
        return tokens
    if value is None:
        return ["null"]
    if isinstance(value, bool):
        return ["true" if value else "false"]
    if isinstance(value, float) and value.is_integer():
        return [str(int(value))]
    return [str(value)]


def normalize_structure(value: Any) -> Any:
    if isinstance(value, list):
        return [normalize_structure(item) for item in value]
    if isinstance(value, dict):
        normalized: dict[str, Any] = {}
        for key, item in value.items():
            normalized[str(key)] = normalize_structure(item)
        return normalized
    if value is None:
        return None
    if isinstance(value, float) and value.is_integer():
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

    return expected == actual


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


def valid_topological_order(order: Any, case_input: Any) -> bool:
    if not isinstance(order, list):
        return False
    args = case_input if isinstance(case_input, list) else []
    node_count = 0
    edges: list[Any] = []

    if len(args) == 1 and isinstance(args[0], dict):
        adjacency = args[0]
        node_count = len(adjacency)
        for key, neighbors in adjacency.items():
            if not isinstance(neighbors, list):
                continue
            for neighbor in neighbors:
                edges.append([int(key), int(neighbor)])
    else:
        if len(args) < 2:
            return False
        try:
            node_count = int(args[0])
        except (TypeError, ValueError):
            return False
        edges = args[2] if len(args) >= 3 and isinstance(args[2], list) else args[1] if len(args) >= 2 and isinstance(args[1], list) else []

    position = {int(node): index for index, node in enumerate(order)}
    if len(position) != node_count:
        return False
    for node in range(node_count):
        if node not in position:
            return False
    for edge in edges:
        if not isinstance(edge, list) or len(edge) != 2:
            continue
        left = int(edge[0])
        right = int(edge[1])
        if position[left] >= position[right]:
            return False
    return True


def compare_output(algo_name: str, case_input: Any, expected: Any, actual: Any) -> bool:
    if structures_match(expected, actual):
        return True

    if "hungarian-algorithm" in algo_name and isinstance(expected, dict) and isinstance(actual, list) and len(actual) == 2:
        return structures_match(expected, {"assignment": actual[0], "total_cost": actual[1]})

    if "johnson-algorithm" in algo_name and isinstance(actual, list) and len(actual) == 2:
        if expected == "negative_cycle":
            return actual[1] is False
        if actual[1] is True:
            return structures_match(expected, actual[0])

    if "topological-sort" in algo_name and isinstance(actual, list):
        return valid_topological_order(actual, case_input)

    if "strongly-connected" in algo_name or algo_name.endswith("/tarjans-scc") or algo_name.endswith("/kosarajus-scc"):
        expected_groups = normalize_scc_groups(expected)
        actual_groups = normalize_scc_groups(actual)
        if expected_groups is not None and actual_groups is not None:
            return expected_groups == actual_groups

    if algo_name.endswith("/permutations") and isinstance(expected, list) and isinstance(actual, list):
        try:
            expected_set = sorted(tuple(item) for item in expected)
            actual_set = sorted(tuple(item) for item in actual)
            return expected_set == actual_set
        except TypeError:
            pass

    return structures_match(expected, actual)


def build_wrapper_source(
    candidate: FunctionCandidate,
    type_defs: dict[str, TypeDef],
    test_cases: list[dict[str, Any]],
    data: dict[str, Any],
) -> str | None:
    lines = [
        "package main",
        "",
        "import (",
        '\t"encoding/json"',
        '\t"fmt"',
        '\t"math"',
        '\t"reflect"',
        ")",
        "",
        "func normalizeValue(v interface{}) interface{} {",
        "\tif v == nil {",
        "\t\treturn nil",
        "\t}",
        "\trv := reflect.ValueOf(v)",
        "\tif !rv.IsValid() {",
        "\t\treturn nil",
        "\t}",
        "\tswitch rv.Kind() {",
        "\tcase reflect.Float32, reflect.Float64:",
        "\t\tf := rv.Convert(reflect.TypeOf(float64(0))).Float()",
        '\t\tif math.IsInf(f, 1) { return "Infinity" }',
        '\t\tif math.IsInf(f, -1) { return "-Infinity" }',
        '\t\tif math.IsNaN(f) { return "NaN" }',
        "\t\treturn f",
        "\tcase reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:",
        "\t\treturn rv.Int()",
        "\tcase reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Uintptr:",
        "\t\treturn rv.Uint()",
        "\tcase reflect.Bool:",
        "\t\treturn rv.Bool()",
        "\tcase reflect.String:",
        "\t\treturn rv.String()",
        "\tcase reflect.Slice, reflect.Array:",
        "\t\titems := make([]interface{}, rv.Len())",
        "\t\tfor i := 0; i < rv.Len(); i++ {",
        "\t\t\titems[i] = normalizeValue(rv.Index(i).Interface())",
        "\t\t}",
        "\t\treturn items",
        "\tcase reflect.Map:",
        "\t\titems := map[string]interface{}{}",
        "\t\titer := rv.MapRange()",
        "\t\tfor iter.Next() {",
        "\t\t\titems[fmt.Sprint(iter.Key().Interface())] = normalizeValue(iter.Value().Interface())",
        "\t\t}",
        "\t\treturn items",
        "\tcase reflect.Ptr, reflect.Interface:",
        "\t\tif rv.IsNil() {",
        "\t\t\treturn nil",
        "\t\t}",
        "\t\treturn normalizeValue(rv.Elem().Interface())",
        "\tcase reflect.Struct:",
        "\t\titems := map[string]interface{}{}",
        "\t\trt := rv.Type()",
        "\t\tfor i := 0; i < rv.NumField(); i++ {",
        "\t\t\tif rt.Field(i).PkgPath != \"\" {",
        "\t\t\t\tcontinue",
        "\t\t\t}",
        "\t\t\titems[rt.Field(i).Name] = normalizeValue(rv.Field(i).Interface())",
        "\t\t}",
        "\t\treturn items",
        "\tdefault:",
        "\t\treturn fmt.Sprint(v)",
        "\t}",
        "}",
        "",
        "func emit(v interface{}) {",
        "\tbytes, err := json.Marshal(normalizeValue(v))",
        "\tif err != nil {",
        '\t\tfmt.Printf("{\\"error\\":%q}\\n", err.Error())',
        "\t\treturn",
        "\t}",
        "\tfmt.Println(string(bytes))",
        "}",
        "",
        "func main() {",
    ]

    for index, test_case in enumerate(test_cases):
        args = args_for_case(data, test_case.get("input"))
        if len(args) != len(candidate.params):
            return None
        arg_names: list[str] = []
        for arg_index, (param, value) in enumerate(zip(candidate.params, args)):
            arg_name = f"arg{index}_{arg_index}"
            rendered = go_literal(param.type_name, value, type_defs)
            if rendered == "nil" and not (param.type_name.startswith("*") or param.type_name == "interface{}"):
                return None
            lines.append(f"\t{arg_name} := {rendered}")
            arg_names.append(arg_name)

        if len(candidate.returns) == 0:
            call = f"{candidate.name}({', '.join(arg_names)})"
            lines.append(f"\t{call}")
            if not candidate.params:
                lines.append("\temit(nil)")
            elif len(candidate.params) == 2 and candidate.params[0].type_name.startswith("*") and candidate.params[1].type_name.startswith("*"):
                lines.append(
                    "\tif {a} == nil || {b} == nil {{ emit(nil) }} else {{ emit([]interface{{}}{{*{a}, *{b}}}) }}".format(
                        a=arg_names[0],
                        b=arg_names[1],
                    )
                )
            else:
                first = candidate.params[0]
                if first.type_name.startswith("*"):
                    lines.append(f"\tif {arg_names[0]} == nil {{ emit(nil) }} else {{ emit(*{arg_names[0]}) }}")
                else:
                    lines.append(f"\temit({arg_names[0]})")
            continue

        if len(candidate.returns) == 1:
            lines.append(f"\tresult{index} := {candidate.name}({', '.join(arg_names)})")
            lines.append(f"\temit(result{index})")
            continue

        result_names = [f"r{index}_{result_index}" for result_index in range(len(candidate.returns))]
        lines.append(f"\t{', '.join(result_names)} := {candidate.name}({', '.join(arg_names)})")
        lines.append(f"\temit([]interface{{}}{{{', '.join(result_names)}}})")

    lines.extend(["}", ""])
    return "\n".join(lines)


def compile_binary(algo_dir: Path, sources: list[Path], wrapper_source: str) -> tuple[Path | None, str | None]:
    digest_parts = [wrapper_source.encode()]
    rewritten_sources: list[tuple[str, str]] = []
    for path in sources:
        rewritten = rewrite_go_source(path.read_text())
        rewritten_sources.append((path.name, rewritten))
        digest_parts.append(path.name.encode())
        digest_parts.append(rewritten.encode())
    key = hash_bytes(digest_parts)
    build_dir = CACHE_DIR / key
    binary = build_dir / "runner"
    if binary.exists():
        return binary, None

    tmp_dir = Path(tempfile.mkdtemp(prefix="go-runner-build-"))
    try:
        for filename, rewritten in rewritten_sources:
            (tmp_dir / filename).write_text(rewritten)
        (tmp_dir / "zz_runner_main.go").write_text(wrapper_source)

        env = os.environ.copy()
        env["GO111MODULE"] = "off"
        env["GOCACHE"] = str(GO_BUILD_CACHE)

        cmd = ["go", "build", "-o", str(tmp_dir / "runner")]
        try:
            proc = subprocess.run(
                cmd,
                cwd=tmp_dir,
                env=env,
                text=True,
                capture_output=True,
                timeout=BUILD_TIMEOUT_SECONDS,
            )
        except subprocess.TimeoutExpired:
            return None, f"Build timed out after {BUILD_TIMEOUT_SECONDS:.1f}s"
        if proc.returncode != 0:
            output = (proc.stdout + proc.stderr).strip()
            return None, output

        build_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(tmp_dir / "runner", binary)
        return binary, None
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def run_algorithm(algo_dir: Path) -> AlgorithmResult:
    algo_name = algo_name_for_dir(algo_dir)
    result = AlgorithmResult(algo_name=algo_name)

    cases_file = algo_dir / "tests" / "cases.yaml"
    if not cases_file.exists():
        return result

    go_dir = algo_dir / "go"
    if not go_dir.exists():
        result.skipped += 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No Go implementation found")
        return result

    go_files = sorted(path for path in go_dir.glob("*.go") if not path.name.endswith("_test.go"))
    if not go_files:
        result.skipped += 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No Go implementation found")
        return result

    data = read_cases(cases_file)
    test_cases = data.get("test_cases") or []
    if not test_cases:
        return result

    sources = [path.read_text() for path in go_files]
    candidates = collect_function_candidates(sources)
    type_defs: dict[str, TypeDef] = {}
    for source in sources:
        type_defs.update(extract_struct_types(source))

    sample_args = args_for_case(data, test_cases[0].get("input"))
    candidate = resolve_function(data, candidates, sample_args)
    if candidate is None:
        result.skipped += 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No testable Go function signature found")
        return result

    desired_name = str(data.get("function_signature", {}).get("name", "")).strip()
    preferred_index = preferred_source_index(desired_name, candidate.name, go_files, sources, candidate.source_index)
    preferred_candidate = candidate_for_source(candidates, candidate.name, preferred_index, candidate)
    if len(preferred_candidate.params) == len(sample_args) and all(
        go_type_compatible(param.type_name, value) for param, value in zip(preferred_candidate.params, sample_args)
    ):
        candidate = preferred_candidate

    wrapper_source = build_wrapper_source(candidate, type_defs, test_cases, data)
    if not wrapper_source:
        result.skipped += 1
        result.skip_messages.append(f"[SKIP] {algo_name}: Unsupported Go signature for automated testing")
        return result

    selected_files = [go_files[candidate.source_index]]

    binary, build_error = compile_binary(algo_dir, selected_files, wrapper_source)
    if build_error:
        for test_case in test_cases:
            result.failed += 1
        result.errors.append(f"{algo_name}: Build failed: {build_error}")
        return result
    if binary is None:
        result.failed += len(test_cases)
        result.errors.append(f"{algo_name}: Build failed")
        return result

    env = os.environ.copy()
    env["GO111MODULE"] = "off"
    env["GOCACHE"] = str(GO_BUILD_CACHE)

    try:
        proc = subprocess.run(
            [str(binary)],
            cwd=algo_dir,
            env=env,
            text=True,
            capture_output=True,
            timeout=RUN_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired:
        result.failed += len(test_cases)
        result.errors.append(f"{algo_name}: Timed out")
        return result

    if proc.returncode != 0:
        result.failed += len(test_cases)
        output = (proc.stdout + proc.stderr).strip()
        result.errors.append(f"{algo_name}: Runtime error: {output}")
        return result

    lines = [line for line in proc.stdout.splitlines() if line.strip()]
    if len(lines) != len(test_cases):
        result.failed += len(test_cases)
        result.errors.append(
            f"{algo_name}: Expected {len(test_cases)} outputs but got {len(lines)}"
        )
        return result

    for line, test_case in zip(lines, test_cases):
        case_name = str(test_case.get("name", "unnamed"))
        expected = test_case.get("expected")
        try:
            actual = json.loads(line)
        except json.JSONDecodeError:
            actual = line.strip()
        if compare_output(algo_name, test_case.get("input"), expected, actual):
            result.passed += 1
            result.pass_messages.append(f"[PASS] {algo_name} - {case_name}")
        else:
            result.failed += 1
            result.errors.append(
                f"{algo_name} - {case_name}: expected={json.dumps(expected, sort_keys=True)} got={json.dumps(actual, sort_keys=True)}"
            )

    return result


def main() -> int:
    ensure_cache_dirs()
    target = sys.argv[1] if len(sys.argv) > 1 else None
    try:
        algo_dirs = find_algorithm_dirs(target)
    except FileNotFoundError:
        print(f"Path not found: {target}", file=sys.stderr)
        return 1

    jobs = detect_job_count()
    if jobs == 1 or len(algo_dirs) <= 1:
        results = [run_algorithm(algo_dir) for algo_dir in algo_dirs]
    else:
        with ThreadPoolExecutor(max_workers=jobs) as pool:
            results = list(pool.map(run_algorithm, algo_dirs))

    passed = sum(item.passed for item in results)
    failed = sum(item.failed for item in results)
    skipped = sum(item.skipped for item in results)

    for item in results:
        for message in item.skip_messages or []:
            print(message)
        for message in item.pass_messages or []:
            print(message)

    print()
    print("============================================================")
    print("Go Test Results")
    print("============================================================")
    print(f"  Passed:  {passed}")
    print(f"  Failed:  {failed}")
    print(f"  Skipped: {skipped}")
    print(f"  Total:   {passed + failed + skipped}")

    errors = [error for item in results for error in (item.errors or [])]
    if errors:
        print()
        print("Failures:")
        for error in errors:
            print(f"  x {error}")
    print()
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
