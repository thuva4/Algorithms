#!/usr/bin/env bash
# C# Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs C# implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/csharp_runner.sh                              # Run all algorithms
#   ./tests/runners/csharp_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: dotnet SDK, python3 (for YAML parsing)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ALGORITHMS_DIR="$REPO_ROOT/algorithms"
TEMP_DIR=$(mktemp -d)

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

PASSED=0
FAILED=0
SKIPPED=0
ERRORS=""

format_error_excerpt() {
    local error_file="$1"
    if [ ! -s "$error_file" ]; then
        printf '%s' ""
        return
    fi
    sed -n '1,5p' "$error_file" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//'
}

# Check if dotnet is available
if ! command -v dotnet >/dev/null 2>&1; then
    echo "WARNING: dotnet not found. Install .NET SDK to run C# tests."
    echo "Skipping all C# tests."
    exit 0
fi

# Parse YAML using Python
parse_yaml() {
    local yaml_file="$1"
    python3 -c "
import yaml, json, sys
with open('$yaml_file') as f:
    data = yaml.safe_load(f)
print(json.dumps(data))
"
}

# Run tests for a single algorithm directory
run_algo_tests() {
    local algo_dir="$1"
    local cases_file="$algo_dir/tests/cases.yaml"
    local cs_dir="$algo_dir/csharp"

    if [ ! -f "$cases_file" ]; then
        return
    fi

    local algo_name
    algo_name="$(basename "$(dirname "$algo_dir")")/$(basename "$algo_dir")"

    if [ ! -d "$cs_dir" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No C# implementation found"
        return
    fi

    # Find C# source files
    local -a cs_files=()
    mapfile -t cs_files < <(find "$cs_dir" -name "*.cs" 2>/dev/null | sort)
    if [ "${#cs_files[@]}" -eq 0 ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No .cs files found"
        return
    fi

    # Parse test data
    local test_data
    test_data=$(parse_yaml "$cases_file") || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to parse cases.yaml"
        return
    }

    local func_name
    func_name=$(echo "$test_data" | python3 -c "import json,sys; print(json.loads(sys.stdin.read())['function_signature']['name'])")

    local num_cases
    num_cases=$(echo "$test_data" | python3 -c "import json,sys; print(len(json.loads(sys.stdin.read())['test_cases']))")

    local primary_cs_file
    primary_cs_file=$(printf '%s\n' "${cs_files[@]}" | ALGO_SLUG="${algo_name##*/}" TEST_DATA_JSON="$test_data" python3 -c "
import json, os, re, sys
from pathlib import Path

data = json.loads(os.environ['TEST_DATA_JSON'])
algo_slug = os.environ.get('ALGO_SLUG', '')
func_name = data['function_signature']['name']
files = [line.strip() for line in sys.stdin.read().splitlines() if line.strip()]

def snake_to_pascal(name):
    return ''.join(part.capitalize() for part in re.split(r'[_\\-]+', name) if part)

def snake_to_camel(name):
    pascal = snake_to_pascal(name)
    return pascal[:1].lower() + pascal[1:] if pascal else ''

def normalize_name(name):
    return re.sub(r'[^A-Za-z0-9]', '', name).lower()

preferred = []
for candidate in (algo_slug, data.get('algorithm', ''), func_name):
    if candidate:
        for variant in (snake_to_pascal(candidate), snake_to_camel(candidate), candidate):
            if variant and variant not in preferred:
                preferred.append(variant)

best_file = files[0]
best_score = -1
for path_str in files:
    path = Path(path_str)
    source = path.read_text()
    score = 0
    base_norm = normalize_name(path.stem)
    class_names = re.findall(r'(?m)\\b(?:public|internal|private|protected)?\\s*(?:static\\s+|sealed\\s+|abstract\\s+)*class\\s+(\\w+)', source)
    methods = re.findall(r'(?m)\\b(?:public|private|internal|protected)?\\s*(?:static\\s+)?[^\\s(]+\\s+(\\w+)\\s*\\(', source)
    for index, name in enumerate(preferred):
        norm = normalize_name(name)
        bonus = len(preferred) - index
        if base_norm == norm:
            score += 1000 + bonus
        elif base_norm.endswith(norm):
            score += 800 + bonus
        for class_name in class_names:
            class_norm = normalize_name(class_name)
            if class_norm == norm:
                score += 1200 + bonus
            elif class_norm.endswith(norm):
                score += 900 + bonus
        for method_name in methods:
            method_norm = normalize_name(method_name)
            if method_name == 'Main':
                continue
            if method_norm == norm:
                score += 700 + bonus
            elif method_norm.startswith(norm):
                score += 500 + bonus
    if 'Console.ReadLine' in source:
        score += 25
    if score > best_score:
        best_score = score
        best_file = path_str

print(best_file)
")

    # Create a dotnet console project in temp
    local project_dir="$TEMP_DIR/project_${algo_name##*/}"
    mkdir -p "$project_dir"
    dotnet new console -o "$project_dir" --force >/dev/null 2>&1 || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to create dotnet project"
        return
    }

    local csproj_file
    csproj_file=$(find "$project_dir" -maxdepth 1 -name "*.csproj" | head -1)
    if [ -z "$csproj_file" ]; then
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to find dotnet project file"
        return
    fi

    python3 -c "
from pathlib import Path

path = Path('$csproj_file')
text = path.read_text()
if '<StartupObject>' not in text:
    text = text.replace(
        '<PropertyGroup>',
        '<PropertyGroup>\n    <StartupObject>TestHarnessProgram</StartupObject>',
        1,
    )
path.write_text(text)
"

    local cs_file
    for cs_file in "${cs_files[@]}"; do
        cp "$cs_file" "$project_dir/alg_$(basename "$cs_file")"
    done

    # Generate test harness (Program.cs)
    local harness_status=0
    set +e
    ALGO_SLUG="${algo_name##*/}" \
    TEST_DATA_JSON="$test_data" \
    PRIMARY_CS_SOURCE_PATH="$primary_cs_file" \
    CSHARP_PROGRAM_PATH="$project_dir/Program.cs" \
    python3 - <<'PY'
import json
import os
import re
from pathlib import Path

data = json.loads(os.environ["TEST_DATA_JSON"])
func_name = data["function_signature"]["name"]
inputs = data["function_signature"]["input"]
output = data["function_signature"]["output"]
algo_slug = os.environ.get("ALGO_SLUG", "")
sample_case = data["test_cases"][0] if data.get("test_cases") else {"input": [], "expected": None}
input_keys = inputs if isinstance(inputs, list) else re.findall(r"[A-Za-z_][A-Za-z0-9_]*", str(inputs))


def normalized_top_level_inputs(raw):
    if isinstance(raw, dict):
        if len(input_keys) == 1 and input_keys[0] not in raw:
            return [raw]
        ordered_keys = [key for key in input_keys if key in raw]
        if not ordered_keys:
            ordered_keys = list(raw.keys())
        elif len(ordered_keys) != len(raw):
            for key in raw.keys():
                if key not in ordered_keys:
                    ordered_keys.append(key)
        return [raw[key] for key in ordered_keys]
    if isinstance(raw, list):
        if (
            len(input_keys) == 1
            and all(not isinstance(item, (list, dict)) for item in raw)
            and any(token in str(input_keys[0]) for token in ("array", "list", "matrix", "grid", "tree", "points", "interval"))
        ):
            return [raw]
        return raw
    return [raw]


def snake_to_pascal(name):
    return "".join(part.capitalize() for part in re.split(r"[_\-]+", name) if part)


def snake_to_camel(name):
    pascal = snake_to_pascal(name)
    return pascal[:1].lower() + pascal[1:] if pascal else ""


def normalize_name(name):
    return re.sub(r"[^A-Za-z0-9]", "", name).lower()


sample_inputs = normalized_top_level_inputs(sample_case.get("input", []))
sample_expected = sample_case.get("expected")
source = Path(os.environ["PRIMARY_CS_SOURCE_PATH"]).read_text()
allow_main_fallback = False

namespace_match = re.search(r"(?m)^\s*namespace\s+([A-Za-z_][A-Za-z0-9_.]*)\s*(?:;|\{)", source)
namespace_name = namespace_match.group(1) if namespace_match else ""

class_names = re.findall(
    r"(?m)\b(?:public|internal|private|protected)?\s*(?:static\s+|sealed\s+|abstract\s+)*class\s+(\w+)",
    source,
)

preferred_class_names = []
for candidate in (algo_slug, data.get("algorithm", ""), func_name):
    if candidate:
        for variant in (snake_to_pascal(candidate), snake_to_camel(candidate), candidate):
            if variant and variant not in preferred_class_names:
                preferred_class_names.append(variant)

class_name = None
for preferred in preferred_class_names:
    preferred_norm = normalize_name(preferred)
    for candidate in class_names:
        candidate_norm = normalize_name(candidate)
        if candidate_norm == preferred_norm or candidate_norm.endswith(preferred_norm):
            class_name = candidate
            break
    if class_name:
        break
if class_name is None:
    class_name = class_names[-1] if class_names else "Algorithm"

declared_methods = [
    name
    for name in re.findall(
        r"(?m)\b(?:public|private|internal|protected)?\s*static\s+[^\s(]+\s+(\w+)\s*\(",
        source,
    )
    if name != "Main"
]

preferred_method_names = []
for candidate in (snake_to_pascal(func_name), snake_to_camel(func_name), func_name):
    if candidate and candidate not in preferred_method_names:
        preferred_method_names.append(candidate)

pascal_name = snake_to_pascal(func_name)
if pascal_name.endswith("Search"):
    for fallback in ("Search", pascal_name[: -len("Search")]):
        if fallback and fallback not in preferred_method_names:
            preferred_method_names.append(fallback)
if pascal_name.endswith("Sort"):
    for fallback in ("Sort", pascal_name[: -len("Sort")]):
        if fallback and fallback not in preferred_method_names:
            preferred_method_names.append(fallback)
if pascal_name.endswith("Algorithm") and len(pascal_name) > len("Algorithm"):
    trimmed = pascal_name[: -len("Algorithm")]
    if trimmed and trimmed not in preferred_method_names:
        preferred_method_names.append(trimmed)
for fallback in ("Sort", "Search", "Solve", "Compute"):
    if fallback not in preferred_method_names:
        preferred_method_names.append(fallback)

cs_method_name = None
for preferred in preferred_method_names:
    if preferred in declared_methods:
        cs_method_name = preferred
        break
if cs_method_name is None:
    normalized_methods = {normalize_name(name): name for name in declared_methods}
    for preferred in preferred_method_names:
        match = normalized_methods.get(normalize_name(preferred))
        if match:
            cs_method_name = match
            break
if cs_method_name is None:
    for preferred in preferred_method_names:
        preferred_norm = normalize_name(preferred)
        for candidate in declared_methods:
            candidate_norm = normalize_name(candidate)
            if candidate_norm.startswith(preferred_norm) or preferred_norm in candidate_norm:
                cs_method_name = candidate
                break
        if cs_method_name:
            break
if cs_method_name is None:
    cs_method_name = declared_methods[0] if declared_methods else "Compute"

qualified_class_name = class_name if not namespace_name else f"{namespace_name}.{class_name}"

preferred_name_literals = ", ".join(json.dumps(name) for name in preferred_method_names)


def is_flat_list(value):
    return isinstance(value, list) and all(not isinstance(item, (list, dict)) for item in value)

def classify_input_kind(value):
    if isinstance(value, dict):
        if all(not isinstance(item, (list, dict)) for item in value.values()):
            return "int_map"
        if all(is_flat_list(item) for item in value.values()):
            return "adjacency_dict"
        return "json_dict"
    if is_flat_list(value):
        return "flat_list"
    if isinstance(value, list):
        return "nested_list"
    return "scalar"

generic_input_kinds = [classify_input_kind(value) for value in sample_inputs]
generic_input_kind_literals = ", ".join(json.dumps(kind) for kind in generic_input_kinds)
generic_input_count = len(generic_input_kinds)
if inputs == ["tree_values", "depth", "is_maximizing"]:
    shape = "minimax"
elif inputs == ["tree_as_array"]:
    shape = "nullable_array"
else:
    shape = "generic"

common_block = [
    "        if (method.ReturnType == typeof(void)) {",
    "            result = argsToInvoke[0];",
    "        }",
    "        Console.WriteLine(FormatResult(result));",
]

harness_lines = [
    "using System;",
    "using System.Linq;",
    "using System.Reflection;",
    "using System.Collections;",
    "using System.Collections.Generic;",
    "using System.Runtime.CompilerServices;",
    "using System.Text.Json;",
    "",
    "class TestHarnessProgram {",
    "    static string FormatDictionaryKey(object value) {",
    '        return value == null ? "\'null\'" : "\'" + (value.ToString() ?? "") + "\'";',
    "    }",
    '    static string FormatScalar(object value) {',
    '        if (value == null) return "null";',
    '        if (value is bool boolValue) return boolValue ? "true" : "false";',
    '        if (value is double doubleValue && double.IsPositiveInfinity(doubleValue)) return "Infinity";',
    '        if (value is double negativeDouble && double.IsNegativeInfinity(negativeDouble)) return "-Infinity";',
    '        if (value is float floatValue && float.IsPositiveInfinity(floatValue)) return "Infinity";',
    '        if (value is float negativeFloat && float.IsNegativeInfinity(negativeFloat)) return "-Infinity";',
    '        if (value is string stringValue) return stringValue;',
    '        if (value is IDictionary dictionary) {',
    '            return "{" + string.Join(", ", dictionary.Cast<DictionaryEntry>().Select(entry => $"{FormatDictionaryKey(entry.Key)}: {FormatScalar(entry.Value)}")) + "}";',
    "        }",
    '        if (value is ITuple tuple) {',
    '            return "(" + string.Join(", ", Enumerable.Range(0, tuple.Length).Select(index => FormatScalar(tuple[index]!))) + ")";',
    "        }",
    '        if (value is Array array && array.Rank == 2) {',
    "            var rows = new List<string>();",
    "            for (int i = 0; i < array.GetLength(0); i++) {",
    "                var row = new List<string>();",
    "                for (int j = 0; j < array.GetLength(1); j++) {",
    "                    row.Add(FormatScalar(array.GetValue(i, j)!));",
    "                }",
    '                rows.Add("[" + string.Join(", ", row) + "]");',
    "            }",
    '            return string.Join(" ", rows);',
    "        }",
    '        if (value is IEnumerable enumerable && value is not string) {',
    '            return "[" + string.Join(", ", enumerable.Cast<object>().Select(FormatScalar)) + "]";',
    "        }",
    '        return value.ToString() ?? "";',
    "    }",
    "    static string JoinEnumerable(IEnumerable values) {",
    '        return string.Join(" ", values.Cast<object>().Select(FormatScalar));',
    "    }",
    "    static string FormatResult(object value) {",
    "        if (value is IDictionary || value is ITuple) return FormatScalar(value);",
    "        if (value is Array array && array.Rank == 2) return FormatScalar(value);",
    '        if (value is IEnumerable enumerable && value is not string) return JoinEnumerable(enumerable);',
    "        return FormatScalar(value);",
    "    }",
    "    static int[] ParseIntArray(string line) {",
    "        if (string.IsNullOrWhiteSpace(line)) return Array.Empty<int>();",
    '        return line.Trim().Split(" ", StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToArray();',
    "    }",
    "    static int?[] ParseNullableIntArray(string line) {",
    "        if (string.IsNullOrWhiteSpace(line)) return Array.Empty<int?>();",
    '        return line.Trim().Split(" ", StringSplitOptions.RemoveEmptyEntries)',
    '            .Select(token => token.Equals("null", StringComparison.OrdinalIgnoreCase) || token.Equals("none", StringComparison.OrdinalIgnoreCase) ? (int?)null : int.Parse(token))',
    "            .ToArray();",
    "    }",
    "    static string NormalizeName(string value) {",
    '        return new string((value ?? "").Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());',
    "    }",
    "    static bool IsSimpleScalarType(Type type) {",
    "        return type == typeof(string)",
    "            || type == typeof(bool)",
    "            || type == typeof(int)",
    "            || type == typeof(long)",
    "            || type == typeof(uint)",
    "            || type == typeof(ulong)",
    "            || type == typeof(float)",
    "            || type == typeof(double)",
    "            || type == typeof(decimal);",
    "    }",
    "    static object ParseScalar(Type type, string raw) {",
    '        raw = (raw ?? "").Trim();',
    "        if (type == typeof(string)) return raw;",
    "        if (type == typeof(bool)) return bool.Parse(string.IsNullOrEmpty(raw) ? \"false\" : raw);",
    "        if (type == typeof(int)) return int.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    "        if (type == typeof(long)) return long.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    "        if (type == typeof(uint)) return uint.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    "        if (type == typeof(ulong)) return ulong.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    "        if (type == typeof(float)) return float.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    "        if (type == typeof(double)) return double.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    "        if (type == typeof(decimal)) return decimal.Parse(string.IsNullOrEmpty(raw) ? \"0\" : raw);",
    '        throw new InvalidOperationException("Unsupported scalar parameter type");',
    "    }",
    "    static bool MatchesGenericCollection(Type type, Type elementType) {",
    "        if (!type.IsGenericType) return false;",
    "        Type generic = type.GetGenericTypeDefinition();",
    "        Type[] args = type.GetGenericArguments();",
    "        if (args.Length != 1 || args[0] != elementType) return false;",
    "        return generic == typeof(IEnumerable<>)",
    "            || generic == typeof(ICollection<>)",
    "            || generic == typeof(IList<>)",
    "            || generic == typeof(IReadOnlyCollection<>)",
    "            || generic == typeof(IReadOnlyList<>)",
    "            || generic == typeof(List<>);",
    "    }",
    "    static bool IsFlatIntEnumerableType(Type type) {",
    "        return type == typeof(int[]) || MatchesGenericCollection(type, typeof(int));",
    "    }",
    "    static bool IsFlatNullableIntEnumerableType(Type type) {",
    "        return type == typeof(int?[]) || MatchesGenericCollection(type, typeof(int?));",
    "    }",
    "    static object BuildFlatIntArg(Type type, int[] values) {",
    "        if (type == typeof(int[])) return values;",
    "        if (MatchesGenericCollection(type, typeof(int))) return new List<int>(values);",
    '        throw new InvalidOperationException("Unsupported integer sequence parameter type");',
    "    }",
    "    static object BuildNullableIntArg(Type type, int?[] values) {",
    "        if (type == typeof(int?[])) return values;",
    "        if (MatchesGenericCollection(type, typeof(int?))) return new List<int?>(values);",
    '        throw new InvalidOperationException("Unsupported nullable integer sequence parameter type");',
    "    }",
    "    static int[][] ParseJaggedIntArray(string raw) {",
    "        if (string.IsNullOrWhiteSpace(raw)) return Array.Empty<int[]>();",
    "        using JsonDocument doc = JsonDocument.Parse(raw);",
    "        return doc.RootElement.EnumerateArray()",
    "            .Select(row => row.EnumerateArray().Select(item => item.GetInt32()).ToArray())",
    "            .ToArray();",
    "    }",
    "    static int[,] ToRectangular(int[][] values) {",
    "        int rows = values.Length;",
    "        int cols = rows == 0 ? 0 : values.Max(row => row.Length);",
    "        int[,] result = new int[rows, cols];",
    "        for (int i = 0; i < rows; i++) {",
    "            for (int j = 0; j < values[i].Length; j++) {",
    "                result[i, j] = values[i][j];",
    "            }",
    "        }",
    "        return result;",
    "    }",
    "    static bool IsNestedIntEnumerableType(Type type) {",
    "        return type == typeof(int[][])",
    "            || type == typeof(int[,])",
    "            || MatchesGenericCollection(type, typeof(int[]))",
    "            || MatchesGenericCollection(type, typeof(List<int>));",
    "    }",
    "    static object BuildNestedIntArg(Type type, string raw) {",
    "        int[][] values = ParseJaggedIntArray(raw);",
    "        if (type == typeof(int[][])) return values;",
    "        if (type == typeof(int[,])) return ToRectangular(values);",
    "        if (MatchesGenericCollection(type, typeof(int[]))) return new List<int[]>(values);",
    "        if (MatchesGenericCollection(type, typeof(List<int>))) return values.Select(row => row.ToList()).ToList();",
    '        throw new InvalidOperationException("Unsupported nested integer sequence parameter type");',
    "    }",
    "    static bool MatchesDictionaryType(Type type, Type keyType, Type valueType) {",
    "        if (!type.IsGenericType) return false;",
    "        Type generic = type.GetGenericTypeDefinition();",
    "        Type[] args = type.GetGenericArguments();",
    "        return args.Length == 2 && args[0] == keyType && args[1] == valueType",
    "            && (generic == typeof(Dictionary<,>)",
    "                || generic == typeof(IDictionary<,>)",
    "                || generic == typeof(IReadOnlyDictionary<,>));",
    "    }",
    "    static Dictionary<int, List<int>> ParseAdjacencyDictionary(string raw) {",
    "        var result = new Dictionary<int, List<int>>();",
    "        if (string.IsNullOrWhiteSpace(raw)) return result;",
    "        using JsonDocument doc = JsonDocument.Parse(raw);",
    "        foreach (JsonProperty property in doc.RootElement.EnumerateObject()) {",
    "            result[int.Parse(property.Name)] = property.Value.EnumerateArray().Select(item => item.GetInt32()).ToList();",
    "        }",
    "        return result;",
    "    }",
    "    static bool IsAdjacencyDictionaryType(Type type) {",
    "        return MatchesDictionaryType(type, typeof(int), typeof(List<int>));",
    "    }",
    "    static bool IsAdjacencyListVectorType(Type type) {",
    "        return MatchesGenericCollection(type, typeof(List<int>));",
    "    }",
    "    static object BuildAdjacencyArg(Type type, string raw) {",
    "        Dictionary<int, List<int>> values = ParseAdjacencyDictionary(raw);",
    "        if (IsAdjacencyDictionaryType(type)) return values;",
    "        if (IsAdjacencyListVectorType(type)) {",
    "            int size = values.Count == 0 ? 0 : values.Keys.Max() + 1;",
    "            var list = Enumerable.Range(0, size).Select(_ => new List<int>()).ToList();",
    "            foreach (var entry in values) list[entry.Key] = entry.Value;",
    "            return list;",
    "        }",
    '        throw new InvalidOperationException("Unsupported adjacency parameter type");',
    "    }",
    "    static int DeriveNodeCount(string raw) {",
    "        Dictionary<int, List<int>> values = ParseAdjacencyDictionary(raw);",
    "        return values.Count == 0 ? 0 : values.Keys.Max() + 1;",
    "    }",
    "    static Dictionary<int, int> ParseIntMap(string raw) {",
    "        var result = new Dictionary<int, int>();",
    "        if (string.IsNullOrWhiteSpace(raw)) return result;",
    "        using JsonDocument doc = JsonDocument.Parse(raw);",
    "        foreach (JsonProperty property in doc.RootElement.EnumerateObject()) {",
    "            result[int.Parse(property.Name)] = property.Value.GetInt32();",
    "        }",
    "        return result;",
    "    }",
    "    static bool IsIntMapType(Type type) {",
    "        return MatchesDictionaryType(type, typeof(int), typeof(int));",
    "    }",
    "    static object BuildIntMapArg(Type type, string raw) {",
    "        Dictionary<int, int> values = ParseIntMap(raw);",
    "        if (IsIntMapType(type)) return values;",
    "        if (type == typeof(int[])) {",
    "            int size = values.Count == 0 ? 0 : values.Keys.Max() + 1;",
    "            int[] arr = new int[size];",
    "            foreach (var entry in values) arr[entry.Key] = entry.Value;",
    "            return arr;",
    "        }",
    "        if (MatchesGenericCollection(type, typeof(int))) {",
    "            int size = values.Count == 0 ? 0 : values.Keys.Max() + 1;",
    "            var list = Enumerable.Repeat(0, size).ToList();",
    "            foreach (var entry in values) list[entry.Key] = entry.Value;",
    "            return list;",
    "        }",
    '        throw new InvalidOperationException("Unsupported integer map parameter type");',
    "    }",
    "    static bool IsCompatibleInputType(Type type, string kind) {",
    "        return kind switch {",
    "            \"scalar\" => IsSimpleScalarType(type),",
    "            \"flat_list\" => IsFlatIntEnumerableType(type),",
    "            \"nested_list\" => IsNestedIntEnumerableType(type),",
    "            \"adjacency_dict\" => IsAdjacencyDictionaryType(type) || IsAdjacencyListVectorType(type),",
    "            \"int_map\" => IsIntMapType(type) || IsFlatIntEnumerableType(type),",
    "            _ => false,",
    "        };",
    "    }",
    "    static object BuildArg(Type type, string raw, string kind) {",
    "        return kind switch {",
    "            \"scalar\" => ParseScalar(type, raw),",
    "            \"flat_list\" => BuildFlatIntArg(type, ParseIntArray(raw)),",
    "            \"nested_list\" => BuildNestedIntArg(type, raw),",
    "            \"adjacency_dict\" => BuildAdjacencyArg(type, raw),",
    "            \"int_map\" => BuildIntMapArg(type, raw),",
    '            _ => throw new InvalidOperationException("Unsupported input kind"),',
    "        };",
    "    }",
    "    static int ScoreMethod(MethodInfo method, string[] preferredNames) {",
    "        int score = 0;",
    "        if (method.IsPublic) score += 100;",
    "        string methodName = method.Name;",
    "        string normalizedMethodName = NormalizeName(methodName);",
    "        for (int i = 0; i < preferredNames.Length; i++) {",
    "            string preferred = preferredNames[i];",
    "            string normalizedPreferred = NormalizeName(preferred);",
    "            int bonus = preferredNames.Length - i;",
    "            if (methodName == preferred) score += 1000 + bonus;",
    "            else if (normalizedMethodName == normalizedPreferred) score += 800 + bonus;",
    "            else if (!string.IsNullOrEmpty(normalizedPreferred) && normalizedMethodName.StartsWith(normalizedPreferred)) score += 600 + bonus;",
    "            else if (!string.IsNullOrEmpty(normalizedPreferred) && normalizedMethodName.Contains(normalizedPreferred)) score += 400 + bonus;",
    "        }",
    "        return score;",
    "    }",
    "    static MethodInfo ChooseMethod(Type targetType, string[] preferredNames, Func<MethodInfo, bool> isCompatible) {",
    "        return targetType",
    "            .GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static)",
    '            .Where(candidate => candidate.Name != "Main")',
    "            .Where(isCompatible)",
    "            .OrderByDescending(candidate => ScoreMethod(candidate, preferredNames))",
    "            .FirstOrDefault();",
    "    }",
    "    static MethodInfo ChooseInstanceMethod(Type targetType, string[] preferredNames, Func<MethodInfo, bool> isCompatible) {",
    "        return targetType",
    "            .GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)",
    '            .Where(candidate => candidate.Name != "Main")',
    "            .Where(isCompatible)",
    "            .OrderByDescending(candidate => ScoreMethod(candidate, preferredNames))",
    "            .FirstOrDefault();",
    "    }",
    "    static bool TryInvokeMain(Type targetType) {",
    "        MethodInfo mainMethod = targetType",
    "            .GetMethods(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static)",
    '            .Where(candidate => candidate.Name == "Main")',
    "            .FirstOrDefault(candidate => {",
    "                ParameterInfo[] parameters = candidate.GetParameters();",
    "                return parameters.Length == 0 || (parameters.Length == 1 && parameters[0].ParameterType == typeof(string[]));",
    "            });",
    "        if (mainMethod == null) return false;",
    "        object[] argsToInvoke = mainMethod.GetParameters().Length == 0 ? Array.Empty<object>() : new object[] { Array.Empty<string>() };",
    "        mainMethod.Invoke(null, argsToInvoke);",
    "        return true;",
    "    }",
    "    static void Main(string[] args) {",
    f"        Type targetType = typeof({qualified_class_name});",
    f"        string[] preferredNames = new[] {{ {preferred_name_literals} }};",
]

if shape == "minimax":
    harness_lines.extend(
        [
            "        MethodInfo method = ChooseMethod(targetType, preferredNames, candidate => {",
            "            int paramCount = candidate.GetParameters().Length;",
            "            return paramCount == 3 || paramCount == 5 || paramCount == 7;",
            "        });",
            '        if (method == null) {',
            f'            if ({str(allow_main_fallback).lower()} && TryInvokeMain(targetType)) return;',
            '            Console.WriteLine("__SKIP_UNSUPPORTED_CSHARP__");',
            "            return;",
            "        }",
            '        int[] scores = ParseIntArray(Console.ReadLine() ?? "");',
            '        int depth = int.Parse((Console.ReadLine() ?? "0").Trim());',
            '        bool isMaximizing = bool.Parse((Console.ReadLine() ?? "false").Trim());',
            "        int paramCount = method.GetParameters().Length;",
            "        object result;",
            "        if (paramCount == 3) {",
            "            result = method.Invoke(null, new object[] { scores, depth, isMaximizing });",
            "        } else if (paramCount == 5) {",
            "            result = method.Invoke(null, new object[] { 0, 0, isMaximizing, scores, depth });",
            "        } else if (paramCount == 7) {",
            "            result = method.Invoke(null, new object[] { 0, 0, isMaximizing, scores, depth, int.MinValue, int.MaxValue });",
            "        } else {",
            '            Console.WriteLine("__SKIP_UNSUPPORTED_CSHARP__");',
            "            return;",
            "        }",
            "        Console.WriteLine(FormatResult(result));",
        ]
    )
elif shape == "nullable_array":
    harness_lines.extend(
        [
            "        MethodInfo method = ChooseMethod(targetType, preferredNames, candidate => {",
            "            ParameterInfo[] parameters = candidate.GetParameters();",
            "            return parameters.Length == 1 && IsFlatNullableIntEnumerableType(parameters[0].ParameterType);",
            "        });",
            '        if (method == null) {',
            f'            if ({str(allow_main_fallback).lower()} && TryInvokeMain(targetType)) return;',
            '            Console.WriteLine("__SKIP_UNSUPPORTED_CSHARP__");',
            "            return;",
            "        }",
            '        int?[] values = ParseNullableIntArray(Console.ReadLine() ?? "");',
            "        object[] argsToInvoke = new object[] { BuildNullableIntArg(method.GetParameters()[0].ParameterType, values) };",
            "        object result = method.Invoke(null, argsToInvoke);",
        ]
    )
    harness_lines.extend(common_block)
elif shape == "generic":
    harness_lines.extend(
        [
            f"        string[] inputKinds = new[] {{ {generic_input_kind_literals} }};",
            "        Func<MethodInfo, bool> isCompatible = candidate => {",
            "            ParameterInfo[] parameters = candidate.GetParameters();",
            f"            if (parameters.Length != {generic_input_count}) return false;",
            "            for (int i = 0; i < parameters.Length; i++) {",
            "                if (!IsCompatibleInputType(parameters[i].ParameterType, inputKinds[i])) return false;",
            "            }",
            "            return true;",
            "        };",
            "        MethodInfo method = ChooseMethod(targetType, preferredNames, isCompatible);",
            "        object target = null;",
            "        bool prependDerivedNodeCount = false;",
            "        if (method == null && targetType.GetConstructor(Type.EmptyTypes) != null) {",
            "            method = ChooseInstanceMethod(targetType, preferredNames, isCompatible);",
            "            if (method != null) target = Activator.CreateInstance(targetType);",
            "        }",
            "        if (method == null && inputKinds.Length > 0 && inputKinds[0] == \"adjacency_dict\") {",
            "            Func<MethodInfo, bool> acceptsDerivedNodeCount = candidate => {",
            "                ParameterInfo[] parameters = candidate.GetParameters();",
            f"                if (parameters.Length != {generic_input_count} + 1) return false;",
            "                if (parameters[0].ParameterType != typeof(int)) return false;",
            "                for (int i = 1; i < parameters.Length; i++) {",
            "                    if (!IsCompatibleInputType(parameters[i].ParameterType, inputKinds[i - 1])) return false;",
            "                }",
            "                return true;",
            "            };",
            "            method = ChooseMethod(targetType, preferredNames, acceptsDerivedNodeCount);",
            "            if (method == null && targetType.GetConstructor(Type.EmptyTypes) != null) {",
            "                method = ChooseInstanceMethod(targetType, preferredNames, acceptsDerivedNodeCount);",
            "                if (method != null) target = Activator.CreateInstance(targetType);",
            "            }",
            "            if (method != null) prependDerivedNodeCount = true;",
            "        }",
            "        if (method == null) {",
            f"            if ({str(allow_main_fallback).lower()} && TryInvokeMain(targetType)) return;",
            '            Console.WriteLine("__SKIP_UNSUPPORTED_CSHARP__");',
            "            return;",
            "        }",
            f"        string[] rawInputs = new string[{generic_input_count}];",
            f"        for (int i = 0; i < {generic_input_count}; i++) rawInputs[i] = Console.ReadLine() ?? \"\";",
            "        ParameterInfo[] parameters = method.GetParameters();",
            "        object[] argsToInvoke = new object[parameters.Length];",
            "        int sourceOffset = 0;",
            "        if (prependDerivedNodeCount) {",
            "            argsToInvoke[0] = DeriveNodeCount(rawInputs[0]);",
            "            sourceOffset = 1;",
            "        }",
            "        for (int i = sourceOffset; i < parameters.Length; i++) {",
            "            argsToInvoke[i] = BuildArg(parameters[i].ParameterType, rawInputs[i - sourceOffset], inputKinds[i - sourceOffset]);",
            "        }",
            "        object result = method.Invoke(target, argsToInvoke);",
        ]
    )
    harness_lines.extend(common_block)

harness_lines.extend(["    }", "}"])
Path(os.environ["CSHARP_PROGRAM_PATH"]).write_text("\n".join(harness_lines) + "\n")
PY
    harness_status=$?
    set -e
    if [ "$harness_status" -ne 0 ]; then
        if [ "$harness_status" -eq 3 ]; then
            SKIPPED=$((SKIPPED + 1))
            echo "[SKIP] $algo_name: Unsupported C# signature for automated testing"
            return
        fi
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to generate test harness"
        return
    fi

    # Build
    if ! dotnet build "$project_dir" -c Release -o "$project_dir/bin" >"$TEMP_DIR/compile_err.txt" 2>&1; then
        FAILED=$((FAILED + 1))
        local compile_err
        compile_err=$(format_error_excerpt "$TEMP_DIR/compile_err.txt")
        ERRORS="$ERRORS\n  x $algo_name: Build failed: $compile_err"
        return
    fi

    # Find the built DLL
    local dll_name
    dll_name=$(basename "$project_dir")
    local dll_file="$project_dir/bin/${dll_name}.dll"

    if [ ! -f "$dll_file" ]; then
        # Try to find it
        dll_file=$(find "$project_dir/bin" -name "*.dll" ! -name "System.*" ! -name "Microsoft.*" | head -1)
    fi

    if [ -z "$dll_file" ] || [ ! -f "$dll_file" ]; then
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Built DLL not found"
        return
    fi

    # Run each test case
    local i=0
    while [ "$i" -lt "$num_cases" ]; do
        local case_name input_str expected_str
        case_name=$(echo "$test_data" | python3 -c "import json,sys; print(json.loads(sys.stdin.read())['test_cases'][$i]['name'])")
        input_str=$(echo "$test_data" | python3 -c "
import json, re, sys

def normalized_top_level_inputs(raw, ordered_keys):
    if not isinstance(ordered_keys, list):
        ordered_keys = re.findall(r'[A-Za-z_][A-Za-z0-9_]*', str(ordered_keys))
    if isinstance(raw, dict):
        if isinstance(ordered_keys, list) and len(ordered_keys) == 1 and ordered_keys[0] not in raw:
            return [raw]
        keys = [key for key in ordered_keys if key in raw]
        if not keys:
            keys = list(raw.keys())
        elif len(keys) != len(raw):
            for key in raw.keys():
                if key not in keys:
                    keys.append(key)
        return [raw[key] for key in keys]
    if isinstance(raw, list):
        if (
            len(ordered_keys) == 1
            and all(not isinstance(item, (list, dict)) for item in raw)
            and any(token in str(ordered_keys[0]) for token in ('array', 'list', 'matrix', 'grid', 'tree', 'points', 'interval'))
        ):
            return [raw]
        return raw
    return [raw]

def format_scalar(value):
    if value is None:
        return 'null'
    if isinstance(value, bool):
        return 'true' if value else 'false'
    return str(value)

def format_line(value):
    if isinstance(value, dict):
        return json.dumps(value, separators=(',', ':'))
    if isinstance(value, list):
        if all(not isinstance(item, (list, dict)) for item in value):
            return ' '.join(format_scalar(item) for item in value)
        return json.dumps(value, separators=(',', ':'))
    return format_scalar(value)

payload = json.loads(sys.stdin.read())
tc = payload['test_cases'][$i]
inp = normalized_top_level_inputs(tc['input'], payload['function_signature']['input'])
parts = []
for v in inp:
    parts.append(format_line(v))
print('\n'.join(parts))
")
        expected_str=$(echo "$test_data" | python3 -c "
import json, sys

def format_scalar(value):
    if value is None:
        return 'null'
    if isinstance(value, bool):
        return 'true' if value else 'false'
    return str(value)

tc = json.loads(sys.stdin.read())['test_cases'][$i]
val = tc['expected']
if isinstance(val, list):
    print(' '.join(format_scalar(x) for x in val))
else:
    print(format_scalar(val))
")

        local actual
        actual=$(echo "$input_str" | dotnet "$dll_file" 2>"$TEMP_DIR/runtime_err.txt") || {
            FAILED=$((FAILED + 1))
            local runtime_err
            runtime_err=$(format_error_excerpt "$TEMP_DIR/runtime_err.txt")
            if [ -n "$runtime_err" ]; then
                ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error: $runtime_err"
            else
                ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error"
            fi
            i=$((i + 1))
            continue
        }

        actual=$(echo "$actual" | tr -s ' ' | sed 's/^ *//;s/ *$//')
        expected_str=$(echo "$expected_str" | tr -s ' ' | sed 's/^ *//;s/ *$//')

        if [ "$actual" = "__SKIP_UNSUPPORTED_CSHARP__" ]; then
            SKIPPED=$((SKIPPED + 1))
            echo "[SKIP] $algo_name: Unsupported C# signature for automated testing"
            return
        fi

        local special_match=1
        if [ "$actual" != "$expected_str" ] && [ "$algo_name" = "graph/topological-sort" ]; then
            if echo "$test_data" | ACTUAL="$actual" CASE_INDEX="$i" python3 -c "
import json, os, sys

def parse_order(raw):
    raw = raw.strip()
    if not raw:
        return []
    return [int(token) for token in raw.split()]

data = json.loads(sys.stdin.read())
adj = data['test_cases'][int(os.environ['CASE_INDEX'])]['input'][0]
order = parse_order(os.environ.get('ACTUAL', ''))
nodes = {int(key) for key in adj.keys()}
if len(order) != len(nodes) or set(order) != nodes:
    raise SystemExit(1)
position = {node: index for index, node in enumerate(order)}
for raw_u, neighbors in adj.items():
    u = int(raw_u)
    for v in neighbors:
        if position[u] > position[v]:
            raise SystemExit(1)
" >/dev/null 2>&1; then
                special_match=0
            fi
        elif [ "$actual" != "$expected_str" ] && [ "$algo_name" = "graph/strongly-connected-graph" ]; then
            if echo "$test_data" | ACTUAL="$actual" EXPECTED="$expected_str" CASE_INDEX="$i" python3 -c "
import json, os, re, sys

def parse_groups(raw):
    groups = []
    for chunk in re.findall(r'\\[([^\\]]*)\\]', raw):
        chunk = chunk.strip()
        if not chunk:
            groups.append(tuple())
            continue
        groups.append(tuple(sorted(int(token.strip()) for token in chunk.split(',') if token.strip())))
    return sorted(groups)

actual = parse_groups(os.environ.get('ACTUAL', ''))
expected = parse_groups(os.environ.get('EXPECTED', ''))
if actual != expected:
    raise SystemExit(1)
" >/dev/null 2>&1; then
                special_match=0
            fi
        elif [ "$actual" != "$expected_str" ] && [ "$algo_name" = "graph/hungarian-algorithm" ]; then
            if echo "$test_data" | ACTUAL="$actual" CASE_INDEX="$i" python3 -c "
import json, os, re, sys

data = json.loads(sys.stdin.read())
expected = data['test_cases'][int(os.environ['CASE_INDEX'])]['expected']
match = re.fullmatch(r'\\(\\[(.*)\\],\\s*(-?\\d+)\\)', os.environ.get('ACTUAL', '').strip())
if not match:
    raise SystemExit(1)
assignment_raw, total_cost_raw = match.groups()
assignment = []
if assignment_raw.strip():
    assignment = [int(token.strip()) for token in assignment_raw.split(',') if token.strip()]
if assignment != expected.get('assignment') or int(total_cost_raw) != expected.get('total_cost'):
    raise SystemExit(1)
" >/dev/null 2>&1; then
                special_match=0
            fi
        elif [ "$actual" != "$expected_str" ] && [ "$algo_name" = "graph/johnson-algorithm" ] && [ "$actual" = "null" ] && [ "$expected_str" = "negative_cycle" ]; then
            special_match=0
        fi

        if [ "$actual" = "$expected_str" ] || [ "$special_match" -eq 0 ]; then
            PASSED=$((PASSED + 1))
            echo "[PASS] $algo_name - $case_name: $input_str -> $expected_str"
        else
            FAILED=$((FAILED + 1))
            echo "[FAIL] $algo_name - $case_name: expected=$expected_str got=$actual"
            ERRORS="$ERRORS\n  x $algo_name - $case_name: expected=$expected_str got=$actual"
        fi

        i=$((i + 1))
    done
}

# Main
if [ -n "${1:-}" ]; then
    algo_path="$REPO_ROOT/$1"
    if [ ! -d "$algo_path" ]; then
        algo_path="$ALGORITHMS_DIR/$1"
    fi
    run_algo_tests "$algo_path"
else
    for cases_file in $(find "$ALGORITHMS_DIR" -path "*/tests/cases.yaml" | sort); do
        algo_dir="$(dirname "$(dirname "$cases_file")")"
        run_algo_tests "$algo_dir"
    done
fi

# Report
TOTAL=$((PASSED + FAILED + SKIPPED))
echo ""
echo "============================================================"
echo "C# Test Results"
echo "============================================================"
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED"
echo "  Total:   $TOTAL"

if [ -n "$ERRORS" ]; then
    echo ""
    echo "Failures:"
    printf "$ERRORS\n"
fi

echo ""

if [ "$FAILED" -gt 0 ]; then
    exit 1
fi
exit 0
