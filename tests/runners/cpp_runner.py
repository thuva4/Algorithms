#!/usr/bin/env python3

from __future__ import annotations

import hashlib
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
CACHE_DIR = REPO_ROOT / ".cache" / "cpp-runner"
COMPAT_DIR = CACHE_DIR / "compat"
VERBOSE = os.environ.get("CPP_RUNNER_VERBOSE", "0") == "1"
RUN_TIMEOUT_SECONDS = float(os.environ.get("CPP_RUNNER_TIMEOUT_SECONDS", "2"))


@dataclass
class FunctionCandidate:
    source_index: int
    return_type: str
    name: str
    params: list[str]


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
    bits_dir = COMPAT_DIR / "bits"
    bits_dir.mkdir(parents=True, exist_ok=True)
    header = bits_dir / "stdc++.h"
    content = """\
#pragma once
#include <algorithm>
#include <array>
#include <bitset>
#include <cassert>
#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <map>
#include <numeric>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <tuple>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
"""
    if not header.exists() or header.read_text() != content:
        header.write_text(content)
    conio_header = COMPAT_DIR / "conio.h"
    if not conio_header.exists():
        conio_header.write_text("#pragma once\n")


def detect_job_count() -> int:
    raw = os.environ.get("CPP_RUNNER_JOBS")
    if raw:
        try:
            jobs = int(raw)
            return max(1, jobs)
        except ValueError:
            return 4
    cpu_count = os.cpu_count() or 4
    return max(1, cpu_count)


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
    head = parts[0]
    tail = "".join(part[:1].upper() + part[1:] for part in parts[1:])
    return f"{head}{tail}"


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

    cases_files = sorted(ALGORITHMS_DIR.glob("**/tests/cases.yaml"))
    return [cases.parent.parent for cases in cases_files]


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


def is_supported_expected(value: Any) -> bool:
    if isinstance(value, dict):
        return all(is_supported_expected(item) for item in value.values())
    if isinstance(value, list):
        return all(is_supported_expected(item) for item in value)
    return True


def bool_token(value: bool) -> str:
    return "true" if value else "false"


def expected_tokens(value: Any) -> list[str]:
    return [canonical_scalar(item) for item in flatten_expected(value)]


def canonical_scalar(value: Any) -> str:
    if isinstance(value, bool):
        return bool_token(value)
    if isinstance(value, float):
        if value.is_integer():
            return str(int(value))
        return str(value)
    return str(value)


def extract_actual_tokens(text: str, expected: Any) -> list[str]:
    flattened = flatten_expected(expected)
    count = max(1, len(flattened))
    lowered = text.lower()

    if flattened and all(isinstance(item, bool) for item in flattened):
        found = re.findall(r"\b(?:true|false|0|1)\b", lowered)
        tokens = [normalize_bool_token(token) for token in found]
        return tokens[-count:]

    if flattened and all(isinstance(item, (int, float)) and not isinstance(item, bool) for item in flattened):
        found = re.findall(r"-?\d+(?:\.\d+)?", text)
        return found[-count:]

    if flattened and all(isinstance(item, str) for item in flattened):
        pieces = [piece for piece in re.split(r"\s+", text.strip()) if piece]
        if len(flattened) == 1:
            if pieces:
                return [pieces[-1]]
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            return [lines[-1] if lines else ""]
        return pieces[-count:]

    pieces = [piece for piece in re.split(r"\s+", text.strip()) if piece]
    return pieces[-count:]


def normalize_bool_token(token: str) -> str:
    lowered = token.lower()
    if lowered == "1":
        return "true"
    if lowered == "0":
        return "false"
    return lowered


def normalize_actual(text: str, expected: Any) -> str:
    tokens = extract_actual_tokens(text, expected)
    if not tokens:
        return ""
    if flatten_expected(expected) and all(isinstance(item, bool) for item in flatten_expected(expected)):
        tokens = [normalize_bool_token(token) for token in tokens]
    return " ".join(tokens)


def normalize_expected(value: Any) -> str:
    return " ".join(expected_tokens(value))


def render_scalar_for_stdin(value: Any) -> str:
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def should_prefix_count(key: str, value: Any, mapping: dict[str, Any]) -> bool:
    if not isinstance(value, list):
        return False
    lowered = key.lower()
    if lowered == "queries" and not any(name in mapping for name in ("q", "query_count", "num_queries")):
        return True
    if lowered == "operations" and not any(name in mapping for name in ("m", "operation_count", "num_operations")):
        return True
    if lowered == "edges" and not any(name in mapping for name in ("m", "edge_count", "num_edges")):
        return True
    return False


def render_lines(value: Any, key: str | None = None, mapping: dict[str, Any] | None = None) -> list[str]:
    if isinstance(value, dict):
        lines: list[str] = []
        for child_key, child_value in value.items():
            lines.extend(render_lines(child_value, child_key, value))
        return lines

    if isinstance(value, list):
        lines: list[str] = []
        if key and mapping and should_prefix_count(key, value, mapping):
            lines.append(str(len(value)))
        if not value:
            return lines + [""]
        if all(not isinstance(item, (list, dict)) for item in value):
            lines.append(" ".join(render_scalar_for_stdin(item) for item in value))
            return lines
        if all(isinstance(item, list) for item in value):
            for item in value:
                if all(not isinstance(cell, (list, dict)) for cell in item):
                    lines.append(" ".join(render_scalar_for_stdin(cell) for cell in item))
                else:
                    lines.append(" ".join(flatten_for_stdin(item)))
            return lines
        if all(isinstance(item, dict) for item in value):
            for item in value:
                lines.append(" ".join(flatten_for_stdin(item)))
            return lines
        lines.append(" ".join(flatten_for_stdin(value)))
        return lines

    return [render_scalar_for_stdin(value)]


def flatten_for_stdin(value: Any) -> list[str]:
    if isinstance(value, dict):
        tokens: list[str] = []
        for child in value.values():
            tokens.extend(flatten_for_stdin(child))
        return tokens
    if isinstance(value, list):
        tokens: list[str] = []
        for child in value:
            tokens.extend(flatten_for_stdin(child))
        return tokens
    return [render_scalar_for_stdin(value)]


def serialize_case_input(case_input: Any) -> str:
    if isinstance(case_input, dict):
        lines: list[str] = []
        for key, value in case_input.items():
            lines.extend(render_lines(value, key, case_input))
        return "\n".join(lines) + "\n"
    if isinstance(case_input, list):
        lines: list[str] = []
        for value in case_input:
            lines.extend(render_lines(value))
        return "\n".join(lines) + "\n"
    return f"{render_scalar_for_stdin(case_input)}\n"


def strip_main(source: str) -> str:
    pattern = re.compile(r"\b(?:int|void|auto)\s+main\s*\(")
    match = pattern.search(source)
    if not match:
        return source
    start = match.start()
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
    return source[:start] + source[end:]


def source_has_main(source: str) -> bool:
    return bool(re.search(r"\b(?:int|void|auto)\s+main\s*\(", source))


def source_reads_input(source: str) -> bool:
    return bool(re.search(r"\b(?:cin|scanf|getchar|getline)\b", source))


def split_params(params: str) -> list[str]:
    items: list[str] = []
    current: list[str] = []
    angle = 0
    paren = 0
    bracket = 0
    for char in params:
        if char == "<":
            angle += 1
        elif char == ">":
            angle = max(0, angle - 1)
        elif char == "(":
            paren += 1
        elif char == ")":
            paren = max(0, paren - 1)
        elif char == "[":
            bracket += 1
        elif char == "]":
            bracket = max(0, bracket - 1)
        elif char == "," and angle == 0 and paren == 0 and bracket == 0:
            piece = "".join(current).strip()
            if piece and piece != "void":
                items.append(piece)
            current = []
            continue
        current.append(char)
    piece = "".join(current).strip()
    if piece and piece != "void":
        items.append(piece)
    return items


def collect_function_candidates(sources: list[str]) -> list[FunctionCandidate]:
    pattern = re.compile(
        r"(^|\n)\s*([A-Za-z_][\w:\s<>\[\],*&]*?)\s+([A-Za-z_]\w*)\s*\(([^;{}]*)\)\s*(?:const\s*)?\{",
        re.MULTILINE,
    )
    results: list[FunctionCandidate] = []
    for source_index, source in enumerate(sources):
        stripped = strip_main(source)
        for match in pattern.finditer(stripped):
            return_type = " ".join(match.group(2).split())
            name = match.group(3)
            if name in {"if", "for", "while", "switch", "main"}:
                continue
            params = split_params(match.group(4))
            results.append(
                FunctionCandidate(
                    source_index=source_index,
                    return_type=return_type,
                    name=name,
                    params=params,
                )
            )
    return results


def source_defines_name(source: str, name: str) -> bool:
    pattern = re.compile(rf"\b{name}\s*\(")
    return bool(pattern.search(strip_main(source)))


def pick_primary_source_index(cpp_files: list[Path], sources: list[str], desired_name: str) -> int:
    desired = normalized_symbol(desired_name)
    camel = normalized_symbol(snake_to_camel(desired_name))
    ranked: list[tuple[int, int]] = []

    for index, path in enumerate(cpp_files):
        score = 100
        stem = normalized_symbol(path.stem)
        if desired and desired in stem:
            score = 0
        elif camel and camel in stem:
            score = 1
        elif source_has_main(sources[index]):
            score = 5
        elif desired and source_defines_name(sources[index], desired_name):
            score = 10
        ranked.append((score, index))

    ranked.sort()
    return ranked[0][1]


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
        ranked.append((score, candidate))

    ranked.sort(key=lambda item: (item[0], item[1].name))
    if not ranked or ranked[0][0] >= 100:
        return None
    best_score = ranked[0][0]
    best_matches = [item[1] for item in ranked if item[0] == best_score]
    matching_arity = [candidate for candidate in best_matches if len(candidate.params) == arg_count]
    if not matching_arity:
        return None
    compatible = [
        candidate
        for candidate in matching_arity
        if all(is_param_compatible(param, value) for param, value in zip(candidate.params, sample_args))
    ]
    if not compatible:
        return None
    compatible.sort(
        key=lambda candidate: (
            " ".join(candidate.return_type.split()) == "void",
            sum("&" in param and "const" not in param for param in candidate.params),
            candidate.source_index,
            candidate.name,
        )
    )
    if best_score >= 10 and len(compatible) > 1:
        return None
    return compatible[0]


def infer_scalar_cpp_type(param: str) -> str:
    lowered = param.lower()
    if "double" in lowered or "float" in lowered:
        return "double"
    if "long long" in lowered:
        return "long long"
    if "bool" in lowered:
        return "bool"
    if "string" in lowered:
        return "std::string"
    return "int"


def param_kind(param: str, value: Any) -> str:
    lowered = param.lower()
    if "vector" in lowered and "pair" in lowered:
        return "vector_pair"
    if lowered.count("vector") >= 3:
        return "vector_3d"
    if lowered.count("vector") >= 2:
        return "vector_vector"
    if "vector" in lowered:
        return "vector"
    if ("*" in param or "[" in param) and "char" not in lowered:
        return "pointer"
    if "string" in lowered:
        return "string"
    if "bool" in lowered:
        return "bool"
    return "scalar"


def cpp_string_literal(value: str) -> str:
    escaped = (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\t", "\\t")
    )
    return f'"{escaped}"'


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
        return 0

    dense = [default_value() for _ in range(indexed_items[-1][0] + 1)]
    for index, item in indexed_items:
        dense[index] = item
    return dense


def normalized_container_value(kind: str, value: Any) -> Any:
    if kind in {"pointer", "vector", "vector_vector", "vector_3d"} and isinstance(value, dict):
        return dense_indexed_values(value)
    if kind == "vector_vector" and isinstance(value, list) and all(isinstance(item, dict) for item in value):
        return [list(item.values()) for item in value]
    return value


def is_param_compatible(param: str, value: Any) -> bool:
    kind = param_kind(param, value)
    value = normalized_container_value(kind, value)
    if value is None:
        return False

    if kind == "string":
        return isinstance(value, str)
    if kind in {"bool", "scalar"}:
        return not isinstance(value, (list, dict))
    if kind in {"pointer", "vector"}:
        return isinstance(value, list) and all(not isinstance(item, (list, dict)) for item in value)
    if kind == "vector_vector":
        return isinstance(value, list) and all(isinstance(item, list) for item in value)
    if kind == "vector_3d":
        return (
            isinstance(value, list)
            and all(
                isinstance(item, list)
                and all(isinstance(child, list) for child in item)
                for item in value
            )
        )
    if kind == "vector_pair":
        return isinstance(value, list) and all(isinstance(item, list) and len(item) == 2 for item in value)
    return False


def scalar_literal(value: Any, scalar_type: str) -> str:
    if scalar_type == "std::string":
        return cpp_string_literal(str(value))
    if scalar_type == "bool":
        return "true" if bool(value) else "false"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def vector_literal(values: list[Any], scalar_type: str) -> str:
    return "{" + ", ".join(scalar_literal(value, scalar_type) for value in values) + "}"


def nested_vector_literal(values: list[list[Any]], scalar_type: str) -> str:
    inner = ", ".join(vector_literal(value, scalar_type) for value in values)
    return "{" + inner + "}"


def triple_nested_vector_literal(values: list[list[list[Any]]], scalar_type: str) -> str:
    inner = ", ".join(nested_vector_literal(value, scalar_type) for value in values)
    return "{" + inner + "}"


def pair_vector_literal(values: list[list[Any]], scalar_type: str) -> str:
    items = []
    for value in values:
        if not isinstance(value, list) or len(value) != 2:
            raise ValueError("expected pair values")
        left = scalar_literal(value[0], scalar_type)
        right = scalar_literal(value[1], scalar_type)
        items.append(f"{{{left}, {right}}}")
    return "{" + ", ".join(items) + "}"


def declare_arg(index: int, param: str, value: Any) -> tuple[str, str] | None:
    name = f"arg{index}"
    kind = param_kind(param, value)
    scalar_type = infer_scalar_cpp_type(param)

    try:
        value = normalized_container_value(kind, value)
        if value is None:
            return None

        if kind == "string":
            return f"std::string {name} = {cpp_string_literal(str(value))};", name
        if kind == "bool":
            return f"bool {name} = {'true' if bool(value) else 'false'};", name
        if kind == "scalar":
            return f"{scalar_type} {name} = {scalar_literal(value, scalar_type)};", name
        if kind == "pointer":
            if not isinstance(value, list) or any(isinstance(item, (list, dict)) for item in value):
                return None
            decl = f"std::vector<{scalar_type}> {name} = {vector_literal(value, scalar_type)};"
            return decl, f"{name}.data()"
        if kind == "vector":
            if not isinstance(value, list) or any(isinstance(item, (list, dict)) for item in value):
                return None
            decl = f"std::vector<{scalar_type}> {name} = {vector_literal(value, scalar_type)};"
            return decl, name
        if kind == "vector_vector":
            if not isinstance(value, list) or not all(isinstance(item, list) for item in value):
                return None
            decl = f"std::vector<std::vector<{scalar_type}>> {name} = {nested_vector_literal(value, scalar_type)};"
            return decl, name
        if kind == "vector_3d":
            if (
                not isinstance(value, list)
                or not all(isinstance(item, list) and all(isinstance(child, list) for child in item) for item in value)
            ):
                return None
            decl = (
                f"std::vector<std::vector<std::vector<{scalar_type}>>> {name} = "
                f"{triple_nested_vector_literal(value, scalar_type)};"
            )
            return decl, name
        if kind == "vector_pair":
            if not isinstance(value, list) or not all(isinstance(item, list) for item in value):
                return None
            decl = (
                f"std::vector<std::pair<{scalar_type}, {scalar_type}>> {name} = "
                f"{pair_vector_literal(value, scalar_type)};"
            )
            return decl, name
    except ValueError:
        return None

    return None


def render_wrapper_source(
    algo_dir: Path,
    sources: list[str],
    candidate: FunctionCandidate,
    test_cases: list[dict[str, Any]],
    data: dict[str, Any],
) -> str | None:
    body_parts = [
        "#include <algorithm>",
        "#include <cstdint>",
        "#include <iostream>",
        "#include <string>",
        "#include <utility>",
        "#include <vector>",
        "",
        "template <typename T>",
        "void printValue(const T& value) {",
        "    std::cout << value;",
        "}",
        "",
        "void printValue(const bool& value) {",
        '    std::cout << (value ? "true" : "false");',
        "}",
        "",
        "void printValue(const std::string& value) {",
        "    std::cout << value;",
        "}",
        "",
        "template <typename A, typename B>",
        "void printValue(const std::pair<A, B>& value) {",
        "    printValue(value.first);",
        '    std::cout << " ";',
        "    printValue(value.second);",
        "}",
        "",
        "template <typename T>",
        "void printValue(const std::vector<T>& values) {",
        "    for (std::size_t i = 0; i < values.size(); ++i) {",
        "        if (i > 0) {",
        '            std::cout << " ";',
        "        }",
        "        printValue(values[i]);",
        "    }",
        "}",
        "",
    ]

    for source in sources:
        body_parts.append(strip_main(source))
        body_parts.append("")

    body_parts.append("int main(int argc, char** argv) {")
    body_parts.append("    if (argc != 2) {")
    body_parts.append("        return 2;")
    body_parts.append("    }")
    body_parts.append("    int caseIndex = std::stoi(argv[1]);")
    body_parts.append("    switch (caseIndex) {")

    return_is_void = "void" == " ".join(candidate.return_type.split())

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

        body_parts.append(f"        case {case_index}: {{")
        for declaration in declarations:
            body_parts.append(f"            {declaration}")
        call_expr = f"{candidate.name}({', '.join(call_args)})"
        if return_is_void:
            body_parts.append(f"            {call_expr};")
            printable = "arg0" if declarations else ""
            if not printable:
                return None
            body_parts.append(f"            printValue({printable});")
        else:
            body_parts.append(f"            auto result = {call_expr};")
            body_parts.append("            printValue(result);")
        body_parts.append("            return 0;")
        body_parts.append("        }")

    body_parts.append("        default:")
    body_parts.append("            return 2;")
    body_parts.append("    }")
    body_parts.append("}")
    body_parts.append("")

    return "\n".join(body_parts)


def compile_cached_binary(key_parts: list[bytes], command: list[str]) -> tuple[Path | None, str | None]:
    source_hash = hash_bytes(key_parts)
    binary_path = CACHE_DIR / f"{source_hash}.bin"
    if binary_path.exists():
        return binary_path, None

    temp_binary = CACHE_DIR / f"{source_hash}.{os.getpid()}.tmp.bin"
    command = [*command[:-1], str(temp_binary)]

    compile_run = subprocess.run(command, capture_output=True, text=True)
    if compile_run.returncode != 0:
        error_lines = [line for line in compile_run.stderr.splitlines() if line.strip()][:5]
        return None, "\n".join(error_lines) or "Compilation failed"

    try:
        temp_binary.replace(binary_path)
    except FileExistsError:
        temp_binary.unlink(missing_ok=True)
    return binary_path, None


def compile_main_binary(algo_dir: Path, cpp_files: list[Path], sources: list[str]) -> tuple[Path | None, str | None]:
    key_parts = [b"main-mode"]
    for path, source in zip(cpp_files, sources):
        key_parts.append(str(path.relative_to(REPO_ROOT)).encode())
        key_parts.append(source.encode())

    command = [
        "g++",
        "-std=c++17",
        "-O2",
        "-I",
        str(COMPAT_DIR),
        "-I",
        str(algo_dir / "cpp"),
        *[str(path) for path in cpp_files],
        "-o",
        "PLACEHOLDER",
    ]
    return compile_cached_binary(key_parts, command)


def compile_wrapper_binary(algo_dir: Path, wrapper_source: str) -> tuple[Path | None, str | None]:
    key_parts = [b"wrapper-mode", str(algo_dir.relative_to(REPO_ROOT)).encode(), wrapper_source.encode()]
    source_hash = hash_bytes(key_parts)
    wrapper_file = CACHE_DIR / f"{source_hash}.wrapper.cpp"
    wrapper_file.write_text(wrapper_source)
    command = [
        "g++",
        "-std=c++17",
        "-O2",
        "-I",
        str(COMPAT_DIR),
        "-I",
        str(algo_dir / "cpp"),
        str(wrapper_file),
        "-o",
        "PLACEHOLDER",
    ]
    return compile_cached_binary(key_parts, command)


def run_main_mode(result: AlgorithmResult, binary: Path, test_cases: list[dict[str, Any]]) -> bool:
    for test_case in test_cases:
        case_name = str(test_case.get("name", "unnamed"))
        case_input = serialize_case_input(test_case.get("input"))
        expected = test_case.get("expected")
        try:
            run = subprocess.run(
                [str(binary)],
                input=case_input,
                capture_output=True,
                text=True,
                timeout=RUN_TIMEOUT_SECONDS,
            )
        except subprocess.TimeoutExpired:
            result.passed = 0
            result.failed = 0
            result.skipped = 1
            result.skip_messages.append(f"[SKIP] {result.algo_name}: Timed out running CLI implementation")
            return False
        if run.returncode != 0:
            result.failed += 1
            result.errors.append(f"{result.algo_name} - {case_name}: Runtime error")
            continue

        expected_text = normalize_expected(expected)
        actual_text = normalize_actual(run.stdout, expected)
        if actual_text == expected_text:
            result.passed += 1
            if VERBOSE:
                result.pass_messages.append(f"[PASS] {result.algo_name} - {case_name}")
        else:
            result.failed += 1
            result.errors.append(
                f"{result.algo_name} - {case_name}: expected={expected_text} got={actual_text}"
            )
    return True


def run_wrapper_mode(
    result: AlgorithmResult,
    binary: Path,
    test_cases: list[dict[str, Any]],
) -> None:
    for index, test_case in enumerate(test_cases):
        case_name = str(test_case.get("name", "unnamed"))
        expected = test_case.get("expected")
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

        expected_text = normalize_expected(expected)
        actual_text = normalize_actual(run.stdout, expected)
        if actual_text == expected_text:
            result.passed += 1
            if VERBOSE:
                result.pass_messages.append(f"[PASS] {result.algo_name} - {case_name}")
        else:
            result.failed += 1
            result.errors.append(
                f"{result.algo_name} - {case_name}: expected={expected_text} got={actual_text}"
            )


def process_algorithm(algo_dir: Path) -> AlgorithmResult:
    algo_name = algo_name_for_dir(algo_dir)
    result = AlgorithmResult(algo_name=algo_name)
    cases_file = algo_dir / "tests" / "cases.yaml"
    cpp_dir = algo_dir / "cpp"

    if not cases_file.exists():
        return result

    if not cpp_dir.exists():
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No C++ implementation found")
        return result

    cpp_files = sorted(cpp_dir.glob("*.cpp"))
    if not cpp_files:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No .cpp files found")
        return result

    try:
        data = read_cases(cases_file)
    except Exception as exc:  # pragma: no cover - defensive
        result.failed = 1
        result.errors.append(f"{algo_name}: Failed to parse cases.yaml ({exc})")
        return result

    test_cases = data.get("test_cases") or []
    if not test_cases:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: No test cases defined")
        return result

    if any(not is_supported_expected(test_case.get("expected")) for test_case in test_cases):
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: Unsupported expected output structure")
        return result

    sources = [path.read_text() for path in cpp_files]
    desired_name = str(data.get("function_signature", {}).get("name", "")).strip()
    try_main = any(source_has_main(source) for source in sources)
    main_compile_error: str | None = None
    primary_index = pick_primary_source_index(cpp_files, sources, desired_name)
    primary_file = cpp_files[primary_index]
    primary_source = sources[primary_index]
    main_input_driven = source_has_main(primary_source) and source_reads_input(primary_source)

    candidates = collect_function_candidates(sources)
    sample_args = args_for_case(data, test_cases[0].get("input"))
    candidate = resolve_function(data, candidates, sample_args)
    if candidate is not None:
        candidate_sources = [sources[candidate.source_index]]
        wrapper_source = render_wrapper_source(algo_dir, candidate_sources, candidate, test_cases, data)
        if wrapper_source is not None:
            binary, compile_error = compile_wrapper_binary(algo_dir, wrapper_source)
            if binary is None:
                result.failed = 1
                result.errors.append(f"{algo_name}: Compilation failed: {compile_error}")
                return result

            run_wrapper_mode(result, binary, test_cases)
            return result

    if main_input_driven:
        binary, compile_error = compile_main_binary(
            algo_dir,
            [primary_file],
            [primary_source],
        )
        main_compile_error = compile_error
        if binary is not None:
            completed = run_main_mode(result, binary, test_cases)
            if completed and (result.passed or result.failed):
                return result

    if main_compile_error:
        result.failed = 1
        result.errors.append(f"{algo_name}: Compilation failed: {main_compile_error}")
    elif candidate is None:
        if try_main and not main_input_driven:
            result.skipped = 1
            result.skip_messages.append(f"[SKIP] {algo_name}: Main implementation is not input-driven")
        elif try_main:
            result.skipped = 1
            result.skip_messages.append(f"[SKIP] {algo_name}: No testable function signature found")
        else:
            result.failed = 1
            result.errors.append(f"{algo_name}: No testable function signature found")
    elif try_main and not main_input_driven:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: Main implementation is not input-driven")
    elif try_main:
        result.skipped = 1
        result.skip_messages.append(f"[SKIP] {algo_name}: Unsupported C++ signature for automated testing")
    else:
        result.failed = 1
        result.errors.append(f"{algo_name}: Unsupported C++ signature for automated testing")
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
    print("C++ Test Results")
    print("============================================================")
    print(f"  Passed:  {passed}")
    print(f"  Failed:  {failed}")
    print(f"  Skipped: {skipped} (no C++ implementation or unsupported signature)")
    print(f"  Total:   {total}")

    all_errors = [error for item in results for error in item.errors]
    if all_errors:
        print("")
        print("Failures:")
        for error in all_errors:
            print(f"  x {error}")
    print("")
    return 1 if failed else 0


def main() -> int:
    ensure_cache_dirs()

    target = sys.argv[1] if len(sys.argv) > 1 else None
    try:
        algo_dirs = find_algorithm_dirs(target)
    except FileNotFoundError:
        print(f"ERROR: algorithm path not found: {target}", file=sys.stderr)
        return 1

    if target:
        results = [process_algorithm(algo_dirs[0])]
    else:
        jobs = detect_job_count()
        if jobs == 1:
            results = [process_algorithm(algo_dir) for algo_dir in algo_dirs]
        else:
            with ThreadPoolExecutor(max_workers=jobs) as executor:
                results = list(executor.map(process_algorithm, algo_dirs))
        results.sort(key=lambda item: item.algo_name)

    for result in results:
        print_result_messages(result)

    return summarize(results)


if __name__ == "__main__":
    sys.exit(main())
