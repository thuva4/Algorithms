#!/usr/bin/env bash
#
# Java test runner - reads cases.yaml and tests Java implementations.
#
# Usage:
#   bash tests/runners/java_runner.sh                        # Run all
#   bash tests/runners/java_runner.sh sorting/bubble-sort    # Run one algorithm
#
# Requirements: JDK 17+ (javac + java), bash 4+
#
# This script generates a temporary test harness for each algorithm,
# compiles it alongside the algorithm source, runs it, and reports results.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "$0")"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ALGORITHMS_DIR="$REPO_ROOT/algorithms"
CACHE_DIR="$REPO_ROOT/.cache/java-runner"
mkdir -p "$CACHE_DIR"

PASSED=0
FAILED=0
SKIPPED=0
ERRORS=()
VERBOSE="${JAVA_RUNNER_VERBOSE:-0}"

# Check for Java compiler
if ! command -v javac &> /dev/null; then
    echo "ERROR: javac not found. Please install a JDK (Java 17+)."
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo "ERROR: java not found. Please install a JDK (Java 17+)."
    exit 1
fi

# Convert snake_case to camelCase
snake_to_camel() {
    local input="$1"
    echo "$input" | sed -E 's/_([a-z])/\U\1/g'
}

compute_files_hash() {
    python3 -c "
import hashlib, pathlib, sys
h = hashlib.sha256()
for raw_path in sorted(sys.argv[1:]):
    path = pathlib.Path(raw_path)
    h.update(path.name.encode())
    h.update(b'\0')
    h.update(path.read_bytes())
    h.update(b'\0')
print(h.hexdigest())
" "$@"
}

detect_job_count() {
    if [[ -n "${JAVA_RUNNER_JOBS:-}" ]]; then
        echo "$JAVA_RUNNER_JOBS"
        return
    fi
    if command -v getconf >/dev/null 2>&1; then
        getconf _NPROCESSORS_ONLN 2>/dev/null && return
    fi
    if command -v sysctl >/dev/null 2>&1; then
        sysctl -n hw.ncpu 2>/dev/null && return
    fi
    echo 4
}

log_pass() {
    if [[ "$VERBOSE" == "1" ]]; then
        echo "$1"
    fi
}

run_all_algorithms_parallel() {
    local max_jobs="$1"
    local logs_dir
    logs_dir="$(mktemp -d)"
    local manifest_file="$logs_dir/manifest.txt"
    local active_jobs=0
    local index=0
    local child_log
    : > "$manifest_file"

    while IFS= read -r cases_file; do
        local algo_dir
        local algo_rel
        algo_dir="$(dirname "$(dirname "$cases_file")")"
        algo_rel="${algo_dir#"$ALGORITHMS_DIR"/}"
        algo_rel="${algo_rel#/}"
        index=$((index + 1))
        child_log="$logs_dir/$index.log"
        printf '%s\n' "$child_log" >> "$manifest_file"
        (
            JAVA_RUNNER_VERBOSE=0 bash "$SCRIPT_PATH" "$algo_rel"
        ) >"$child_log" 2>&1 &
        active_jobs=$((active_jobs + 1))

        if [[ "$active_jobs" -ge "$max_jobs" ]]; then
            wait
            active_jobs=0
        fi
    done < <(find "$ALGORITHMS_DIR" -path "*/tests/cases.yaml" | sort)
    wait

    PASSED=0
    FAILED=0
    SKIPPED=0
    ERRORS=()

    while IFS= read -r child_log; do
        grep -E '^\[(FAIL|SKIP)\]' "$child_log" || true

        local child_passed
        local child_failed
        local child_skipped
        child_passed=$(sed -n 's/^  Passed:  //p' "$child_log" | tail -n 1)
        child_failed=$(sed -n 's/^  Failed:  //p' "$child_log" | tail -n 1)
        child_skipped=$(sed -n 's/^  Skipped: //p' "$child_log" | sed 's/ (no Java implementation or method not found).*//' | tail -n 1)

        PASSED=$((PASSED + ${child_passed:-0}))
        FAILED=$((FAILED + ${child_failed:-0}))
        SKIPPED=$((SKIPPED + ${child_skipped:-0}))

        while IFS= read -r failure_line; do
            [[ -n "$failure_line" ]] && ERRORS+=("${failure_line#  x }")
        done < <(awk 'BEGIN { capture = 0 } /^Failures:$/ { capture = 1; next } capture { print }' "$child_log")
    done < "$manifest_file"

    rm -rf "$logs_dir"
}

# Parse a simple YAML value (handles arrays, strings, numbers)
# This is a minimal YAML parser for our specific cases.yaml format.

# Process a single algorithm directory
process_algorithm() {
    local algo_dir="$1"
    local cases_file="$algo_dir/tests/cases.yaml"
    local java_dir="$algo_dir/java"
    local category
    category="$(basename "$(dirname "$algo_dir")")"
    local slug
    slug="$(basename "$algo_dir")"
    local algo_name="$category/$slug"

    if [[ ! -f "$cases_file" ]]; then
        return
    fi

    if [[ ! -d "$java_dir" ]]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No Java implementation found"
        return
    fi

    # Find Java files
    local java_files=()
    while IFS= read -r -d '' f; do
        java_files+=("$f")
    done < <(find "$java_dir" -name "*.java" -print0 2>/dev/null)

    if [[ ${#java_files[@]} -eq 0 ]]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No .java files found"
        return
    fi

    local case_count
    case_count=$(grep -c "^\s*- name:" "$cases_file" 2>/dev/null || echo "0")
    if [[ "$VERBOSE" == "1" ]]; then
        echo "[RUN] $algo_name ($case_count cases)"
    fi

    # Extract function name from cases.yaml
    local func_name
    func_name=$(grep -A1 'function_signature:' "$cases_file" | grep 'name:' | sed 's/.*name: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | tr -d ' ')
    local camel_name
    camel_name=$(snake_to_camel "$func_name")

    # Create temp directory for compilation
    local tmp_dir
    tmp_dir=$(mktemp -d)

    # Copy Java source files to temp dir (to avoid polluting the source tree)
    for jf in "${java_files[@]}"; do
        cp "$jf" "$tmp_dir/"
    done

    # Generate test harness
    generate_test_harness "$tmp_dir" "$cases_file" "$func_name" "$camel_name" "$algo_name"

    # Compile all Java files in temp dir (cached by generated source content)
    local source_hash
    local cache_classes_dir
    source_hash=$(compute_files_hash "$tmp_dir"/*.java) || {
        ERRORS+=("$algo_name: Failed to hash generated Java sources")
        FAILED=$((FAILED + 1))
        rm -rf "$tmp_dir"
        return
    }
    cache_classes_dir="$CACHE_DIR/$source_hash"

    if [[ ! -d "$cache_classes_dir" ]]; then
        local cache_tmp_dir="$CACHE_DIR/$source_hash.$$.tmp"
        mkdir -p "$cache_tmp_dir"
        if ! javac -source 17 -target 17 -nowarn -d "$cache_tmp_dir" "$tmp_dir"/*.java 2>/dev/null; then
            ERRORS+=("$algo_name: Compilation failed")
            FAILED=$((FAILED + 1))
            rm -rf "$cache_tmp_dir" "$tmp_dir"
            return
        fi
        if ! mv "$cache_tmp_dir" "$cache_classes_dir" 2>/dev/null; then
            rm -rf "$cache_tmp_dir"
        fi
    fi

    # Run the test harness
    local output_file
    local exit_code=0
    output_file="$tmp_dir/harness-output.log"
    java -cp "$cache_classes_dir" TestHarness >"$output_file" 2>&1 || exit_code=$?

    # Parse output: each line is either PASS or FAIL
    while IFS= read -r line; do
        if [[ "$line" == PASS:* ]]; then
            PASSED=$((PASSED + 1))
            log_pass "[PASS] $algo_name - ${line#PASS: }"
        elif [[ "$line" == FAIL:* ]]; then
            FAILED=$((FAILED + 1))
            echo "[FAIL] $algo_name - ${line#FAIL: }"
            ERRORS+=("$algo_name - ${line#FAIL: }")
        elif [[ "$line" == SKIP:* ]]; then
            SKIPPED=$((SKIPPED + 1))
            echo "[SKIP] $algo_name: ${line#SKIP: }"
            ERRORS+=("$algo_name: ${line#SKIP: }")
        elif [[ "$line" == ERROR:* ]]; then
            FAILED=$((FAILED + 1))
            echo "[ERROR] $algo_name: ${line#ERROR: }"
            ERRORS+=("$algo_name: ${line#ERROR: }")
        fi
    done < "$output_file"

    if [[ $exit_code -eq 0 && "$VERBOSE" == "1" ]]; then
        echo "[DONE] $algo_name"
    fi

    rm -rf "$tmp_dir"
}

# Generate a Java test harness that reads the algorithm method via reflection
# and runs all test cases from cases.yaml (parsed at bash level and embedded).
generate_test_harness() {
    local tmp_dir="$1"
    local cases_file="$2"
    local func_name="$3"
    local camel_name="$4"
    local algo_name="$5"
    local harness_file="$tmp_dir/TestHarness.java"
    if ! TMP_DIR="$tmp_dir" CASES_FILE="$cases_file" FUNC_NAME="$func_name" CAMEL_NAME="$camel_name" HARNESS_FILE="$harness_file" python3 - <<'PY'
import os
import re
import yaml

tmp_dir = os.environ["TMP_DIR"]
cases_file = os.environ["CASES_FILE"]
func_name = os.environ["FUNC_NAME"]
camel_name = os.environ["CAMEL_NAME"]
harness_file = os.environ["HARNESS_FILE"]

with open(cases_file, "r", encoding="utf-8") as f:
    data = yaml.safe_load(f) or {}

cases = data.get("test_cases", []) or []
func_sig = data.get("function_signature", {}) or {}
sig_input = func_sig.get("input", [])

def declared_class_name(java_filename: str) -> str:
    base = os.path.splitext(java_filename)[0]
    package_name = None
    with open(os.path.join(tmp_dir, java_filename), "r", encoding="utf-8") as src:
        for line in src:
            match = re.match(r"\s*package\s+([A-Za-z_][A-Za-z0-9_.]*)\s*;", line)
            if match:
                package_name = match.group(1)
                break
    return f"{package_name}.{base}" if package_name else base

class_names = sorted(
    declared_class_name(name)
    for name in os.listdir(tmp_dir)
    if name.endswith(".java") and name != "TestHarness.java"
)

def escape_java_string(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
    )

def java_expr(value):
    if isinstance(value, bool):
        return "Boolean.TRUE" if value else "Boolean.FALSE"
    if value is None:
        return "null"
    if isinstance(value, int):
        if -(2 ** 31) <= value <= (2 ** 31 - 1):
            return f"Integer.valueOf({value})"
        return f"Long.valueOf({value}L)"
    if isinstance(value, float):
        if value == float("inf"):
            return "Double.POSITIVE_INFINITY"
        if value == float("-inf"):
            return "Double.NEGATIVE_INFINITY"
        return f"Double.valueOf({value})"
    if isinstance(value, str):
        return '"' + escape_java_string(value) + '"'
    if isinstance(value, list):
        if not value:
            return "java.util.List.of()"
        return "java.util.List.of(" + ", ".join(java_expr(item) for item in value) + ")"
    if isinstance(value, dict):
        parts = []
        for key, item in value.items():
            parts.append(java_expr(key))
            parts.append(java_expr(item))
        return "orderedMap(" + ", ".join(parts) + ")"
    return '"' + escape_java_string(str(value)) + '"'

def normalized_top_level_inputs(raw):
    if isinstance(raw, dict):
        if isinstance(sig_input, list):
            ordered_keys = [key for key in sig_input if key in raw]
            if not ordered_keys:
                ordered_keys = list(raw.keys())
        else:
            ordered_keys = list(raw.keys())
        return [raw[key] for key in ordered_keys]

    if isinstance(raw, list):
        if (
            isinstance(sig_input, list)
            and len(sig_input) == 1
            and raw
            and not any(isinstance(item, (list, dict)) for item in raw)
        ):
            token = str(sig_input[0]).lower()
            if any(marker in token for marker in ("array", "list", "matrix", "graph", "adjacency", "edges", "values", "queries")):
                return [raw]
        return raw

    return [raw]

preferred_names = []
for candidate in (camel_name, func_name):
    if candidate and candidate not in preferred_names:
        preferred_names.append(candidate)
if camel_name.endswith("Search"):
    preferred_names.append("search")
    if len(camel_name) > len("Search"):
        preferred_names.append(camel_name[:-len("Search")])
if camel_name.endswith("Sort"):
    preferred_names.append("sort")
    if len(camel_name) > len("Sort"):
        preferred_names.append(camel_name[:-len("Sort")])
if camel_name.endswith("Algorithm") and len(camel_name) > len("Algorithm"):
    preferred_names.append(camel_name[:-len("Algorithm")])
for fallback in ("sort", "search", "solve", "select", "compute"):
    if fallback not in preferred_names:
        preferred_names.append(fallback)

case_names = []
raw_inputs = []
expecteds = []
for case in cases:
    case_names.append(case.get("name", "unnamed"))
    raw_inputs.append(normalized_top_level_inputs(case.get("input")))
    expecteds.append(case.get("expected"))

expected_param_count = len(raw_inputs[0]) if raw_inputs else 0

lines = []
lines.append("import java.lang.reflect.Array;")
lines.append("import java.lang.reflect.Constructor;")
lines.append("import java.lang.reflect.InvocationTargetException;")
lines.append("import java.lang.reflect.Method;")
lines.append("import java.lang.reflect.Modifier;")
lines.append("import java.util.ArrayList;")
lines.append("import java.util.Arrays;")
lines.append("import java.util.LinkedHashMap;")
lines.append("import java.util.List;")
lines.append("import java.util.Map;")
lines.append("")
lines.append("public class TestHarness {")
lines.append("    private static final Object MISSING = new Object();")
lines.append(f"    private static final String[] CASE_NAMES = new String[]{{{', '.join(java_expr(name) for name in case_names)}}};")
lines.append("    private static final Object[][] RAW_INPUTS = new Object[][]{")
for case_values in raw_inputs:
    lines.append("        new Object[]{" + ", ".join(java_expr(value) for value in case_values) + "},")
lines.append("    };")
lines.append("    private static final Object[] EXPECTEDS = new Object[]{")
for expected in expecteds:
    lines.append("        " + java_expr(expected) + ",")
lines.append("    };")
lines.append(f"    private static final String[] CLASS_NAMES = new String[]{{{', '.join(java_expr(name) for name in class_names)}}};")
lines.append(f"    private static final String[] METHOD_NAMES = new String[]{{{', '.join(java_expr(name) for name in preferred_names)}}};")
lines.append(f"    private static final int EXPECTED_PARAM_COUNT = {expected_param_count};")
lines.append("")
lines.append("    public static void main(String[] args) {")
lines.append("        try {")
lines.append("            runTests();")
lines.append("        } catch (Throwable t) {")
lines.append("            System.out.println(\"ERROR: \" + describeThrowable(t));")
lines.append("        }")
lines.append("    }")
lines.append("")
lines.append("    private static void runTests() throws Exception {")
lines.append("        MethodMatch match = findTargetMethod();")
lines.append("        if (match == null) {")
lines.append("            System.out.println(\"SKIP: Could not find matching method\");")
lines.append("            return;")
lines.append("        }")
lines.append("")
lines.append("        for (int i = 0; i < CASE_NAMES.length; i++) {")
lines.append("            try {")
lines.append("                Object[] methodArgs = buildArgs(RAW_INPUTS[i], match.method.getParameterTypes());")
lines.append("                Object target = null;")
lines.append("                if (!Modifier.isStatic(match.method.getModifiers())) {")
lines.append("                    Constructor<?> ctor = match.clazz.getDeclaredConstructor();")
lines.append("                    ctor.setAccessible(true);")
lines.append("                    target = ctor.newInstance();")
lines.append("                }")
lines.append("                Object result = match.method.invoke(target, methodArgs);")
lines.append("                if (match.method.getReturnType() == void.class && methodArgs.length > 0) {")
lines.append("                    result = methodArgs[0];")
lines.append("                }")
lines.append("                if (compareResults(result, EXPECTEDS[i])) {")
lines.append("                    System.out.println(\"PASS: \" + CASE_NAMES[i]);")
lines.append("                } else {")
lines.append("                    System.out.println(\"FAIL: \" + CASE_NAMES[i] + \": expected \" + formatValue(EXPECTEDS[i]) + \", got \" + formatValue(result));")
lines.append("                }")
lines.append("            } catch (Throwable t) {")
lines.append("                System.out.println(\"FAIL: \" + CASE_NAMES[i] + \": \" + describeThrowable(t));")
lines.append("            }")
lines.append("        }")
lines.append("    }")
lines.append("")
lines.append("    private static class MethodMatch {")
lines.append("        final Class<?> clazz;")
lines.append("        final Method method;")
lines.append("        final int score;")
lines.append("")
lines.append("        MethodMatch(Class<?> clazz, Method method, int score) {")
lines.append("            this.clazz = clazz;")
lines.append("            this.method = method;")
lines.append("            this.score = score;")
lines.append("        }")
lines.append("    }")
lines.append("")
lines.append("    private static MethodMatch findTargetMethod() {")
lines.append("        Object[] sampleInputs = RAW_INPUTS.length == 0 ? new Object[0] : RAW_INPUTS[0];")
lines.append("        Object sampleExpected = EXPECTEDS.length == 0 ? null : EXPECTEDS[0];")
lines.append("        MethodMatch best = null;")
lines.append("")
lines.append("        for (String className : CLASS_NAMES) {")
lines.append("            try {")
lines.append("                Class<?> clazz = Class.forName(className);")
lines.append("                for (Method method : clazz.getDeclaredMethods()) {")
lines.append("                    if (method.getName().equals(\"main\")) continue;")
lines.append("                    method.setAccessible(true);")
lines.append("                    int score = scoreMethod(method, sampleInputs, sampleExpected);")
lines.append("                    if (score < 0) continue;")
lines.append("                    if (best == null || score > best.score) {")
lines.append("                        best = new MethodMatch(clazz, method, score);")
lines.append("                    }")
lines.append("                }")
lines.append("            } catch (Throwable ignored) {")
lines.append("            }")
lines.append("        }")
lines.append("")
lines.append("        return best;")
lines.append("    }")
lines.append("")
lines.append("    private static int scoreMethod(Method method, Object[] sampleInputs, Object sampleExpected) {")
lines.append("        if (method.getParameterCount() != EXPECTED_PARAM_COUNT) return -1;")
lines.append("")
lines.append("        Class<?>[] paramTypes = method.getParameterTypes();")
lines.append("        for (int i = 0; i < paramTypes.length; i++) {")
lines.append("            if (!canConvert(sampleInputs[i], paramTypes[i])) return -1;")
lines.append("        }")
lines.append("")
lines.append("        int score = 0;")
lines.append("        if (Modifier.isStatic(method.getModifiers())) score += 20;")
lines.append("        if (method.getReturnType() == void.class) {")
lines.append("            if (!isVoidMethodCompatible(sampleExpected, paramTypes)) return -1;")
lines.append("            score += 2;")
lines.append("        } else {")
lines.append("            if (!isExpectedCompatible(sampleExpected, method.getReturnType())) return -1;")
lines.append("            score += 5;")
lines.append("        }")
lines.append("")
lines.append("        String name = method.getName();")
lines.append("        String normalized = normalizeName(name);")
lines.append("        for (int i = 0; i < METHOD_NAMES.length; i++) {")
lines.append("            String preferred = METHOD_NAMES[i];")
lines.append("            if (name.equals(preferred)) {")
lines.append("                score += 200 - i;")
lines.append("                break;")
lines.append("            }")
lines.append("            if (normalized.equals(normalizeName(preferred))) {")
lines.append("                score += 150 - i;")
lines.append("                break;")
lines.append("            }")
lines.append("        }")
lines.append("")
lines.append("        if (method.getName().equals(\"main\")) score -= 1000;")
lines.append("        return score;")
lines.append("    }")
lines.append("")
lines.append("    private static String normalizeName(String value) {")
lines.append("        return value.replaceAll(\"[^A-Za-z0-9]\", \"\").toLowerCase();")
lines.append("    }")
lines.append("")
lines.append("    private static Object[] buildArgs(Object[] rawInputs, Class<?>[] paramTypes) {")
lines.append("        Object[] converted = new Object[paramTypes.length];")
lines.append("        for (int i = 0; i < paramTypes.length; i++) {")
lines.append("            converted[i] = convertValue(rawInputs[i], paramTypes[i]);")
lines.append("        }")
lines.append("        return converted;")
lines.append("    }")
lines.append("")
lines.append("    private static boolean canConvert(Object raw, Class<?> targetType) {")
lines.append("        if (raw == null) return !targetType.isPrimitive();")
lines.append("        if (targetType == Object.class) return true;")
lines.append("        if (targetType.isInstance(raw)) return true;")
lines.append("        if ((targetType == int.class || targetType == Integer.class || targetType == long.class || targetType == Long.class")
lines.append("                || targetType == short.class || targetType == Short.class || targetType == byte.class || targetType == Byte.class")
lines.append("                || targetType == double.class || targetType == Double.class || targetType == float.class || targetType == Float.class)")
lines.append("                && raw instanceof Number) return true;")
lines.append("        if ((targetType == boolean.class || targetType == Boolean.class) && raw instanceof Boolean) return true;")
lines.append("        if ((targetType == char.class || targetType == Character.class) && raw instanceof String && ((String) raw).length() == 1) return true;")
lines.append("        if (targetType == String.class && raw instanceof String) return true;")
lines.append("        if (targetType.isArray()) {")
lines.append("            if (!(raw instanceof List<?>)) return false;")
lines.append("            Class<?> component = targetType.getComponentType();")
lines.append("            for (Object item : (List<?>) raw) {")
lines.append("                if (!canConvert(item, component)) return false;")
lines.append("            }")
lines.append("            return true;")
lines.append("        }")
lines.append("        if (List.class.isAssignableFrom(targetType) && raw instanceof List<?>) return true;")
lines.append("        if (Map.class.isAssignableFrom(targetType) && raw instanceof Map<?, ?>) return true;")
lines.append("        return false;")
lines.append("    }")
lines.append("")
lines.append("    private static Object convertValue(Object raw, Class<?> targetType) {")
lines.append("        if (raw == null) return null;")
lines.append("        if (targetType == Object.class) return normalizeRawObject(raw);")
lines.append("        if (targetType.isInstance(raw) && !(raw instanceof Map<?, ?>) && !(raw instanceof List<?>)) return raw;")
lines.append("        if ((targetType == int.class || targetType == Integer.class) && raw instanceof Number) return ((Number) raw).intValue();")
lines.append("        if ((targetType == long.class || targetType == Long.class) && raw instanceof Number) return ((Number) raw).longValue();")
lines.append("        if ((targetType == short.class || targetType == Short.class) && raw instanceof Number) return ((Number) raw).shortValue();")
lines.append("        if ((targetType == byte.class || targetType == Byte.class) && raw instanceof Number) return ((Number) raw).byteValue();")
lines.append("        if ((targetType == double.class || targetType == Double.class) && raw instanceof Number) return ((Number) raw).doubleValue();")
lines.append("        if ((targetType == float.class || targetType == Float.class) && raw instanceof Number) return ((Number) raw).floatValue();")
lines.append("        if ((targetType == boolean.class || targetType == Boolean.class) && raw instanceof Boolean) return raw;")
lines.append("        if ((targetType == char.class || targetType == Character.class) && raw instanceof String && ((String) raw).length() == 1) return ((String) raw).charAt(0);")
lines.append("        if (targetType == String.class && raw instanceof String) return raw;")
lines.append("        if (targetType.isArray() && raw instanceof List<?>) {")
lines.append("            List<?> list = (List<?>) raw;")
lines.append("            Class<?> component = targetType.getComponentType();")
lines.append("            Object array = Array.newInstance(component, list.size());")
lines.append("            for (int i = 0; i < list.size(); i++) {")
lines.append("                Array.set(array, i, convertValue(list.get(i), component));")
lines.append("            }")
lines.append("            return array;")
lines.append("        }")
lines.append("        if (List.class.isAssignableFrom(targetType) && raw instanceof List<?>) return normalizeRawObject(raw);")
lines.append("        if (Map.class.isAssignableFrom(targetType) && raw instanceof Map<?, ?>) return normalizeRawObject(raw);")
lines.append("        return raw;")
lines.append("    }")
lines.append("")
lines.append("    private static boolean isExpectedCompatible(Object expected, Class<?> returnType) {")
lines.append("        if (expected == null) return !returnType.isPrimitive();")
lines.append("        if (returnType == Object.class) return true;")
lines.append("        if (expected instanceof Map<?, ?>) {")
lines.append("            Map<?, ?> expectedMap = (Map<?, ?>) expected;")
lines.append("            if (expectedMap.containsKey(\"assignment\") && expectedMap.containsKey(\"total_cost\")) {")
lines.append("                if (returnType.isArray()) return true;")
lines.append("                if (List.class.isAssignableFrom(returnType)) return true;")
lines.append("            }")
lines.append("        }")
lines.append("        if (returnType.isArray() && expected instanceof List<?>) return true;")
lines.append("        if (List.class.isAssignableFrom(returnType) && expected instanceof List<?>) return true;")
lines.append("        if (Map.class.isAssignableFrom(returnType) && expected instanceof Map<?, ?>) return true;")
lines.append("        if ((returnType == String.class) && expected instanceof String) return true;")
lines.append("        if ((returnType == boolean.class || returnType == Boolean.class) && expected instanceof Boolean) return true;")
lines.append("        if ((returnType == int.class || returnType == Integer.class || returnType == long.class || returnType == Long.class")
lines.append("                || returnType == short.class || returnType == Short.class || returnType == byte.class || returnType == Byte.class")
lines.append("                || returnType == double.class || returnType == Double.class || returnType == float.class || returnType == Float.class)")
lines.append("                && expected instanceof Number) return true;")
lines.append("        return false;")
lines.append("    }")
lines.append("")
lines.append("    private static boolean isVoidMethodCompatible(Object expected, Class<?>[] paramTypes) {")
lines.append("        if (paramTypes.length == 0 || expected == null) return false;")
lines.append("        Class<?> firstType = paramTypes[0];")
lines.append("        if (expected instanceof List<?>) {")
lines.append("            return firstType.isArray() || List.class.isAssignableFrom(firstType);")
lines.append("        }")
lines.append("        if (expected instanceof Map<?, ?>) {")
lines.append("            return Map.class.isAssignableFrom(firstType);")
lines.append("        }")
lines.append("        return false;")
lines.append("    }")
lines.append("")
lines.append("    private static boolean compareResults(Object actual, Object expected) {")
lines.append("        if (actual == null && expected == null) return true;")
lines.append("        if (actual == null || expected == null) return false;")
lines.append("")
lines.append("        if (expected instanceof Number && actual instanceof Number) {")
lines.append("            if (expected instanceof Double || expected instanceof Float || actual instanceof Double || actual instanceof Float) {")
lines.append("                double a = ((Number) actual).doubleValue();")
lines.append("                double b = ((Number) expected).doubleValue();")
lines.append("                if (Double.isInfinite(a) || Double.isInfinite(b)) return Double.compare(a, b) == 0;")
lines.append("                return Math.abs(a - b) < 1e-9;")
lines.append("            }")
lines.append("            return ((Number) actual).longValue() == ((Number) expected).longValue();")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof String && actual instanceof String) {")
lines.append("            return actual.equals(expected);")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof String && actual instanceof Number) {")
lines.append("            return matchesSpecialNumberString((Number) actual, (String) expected);")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof Number && actual instanceof String) {")
lines.append("            return matchesSpecialNumberString((Number) expected, (String) actual);")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof Boolean && actual instanceof Boolean) {")
lines.append("            return actual.equals(expected);")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof List<?>) {")
lines.append("            List<?> expectedList = (List<?>) expected;")
lines.append("            if (actual != null && actual.getClass().isArray()) {")
lines.append("                int len = Array.getLength(actual);")
lines.append("                if (len != expectedList.size()) return false;")
lines.append("                for (int i = 0; i < len; i++) {")
lines.append("                    if (!compareResults(Array.get(actual, i), expectedList.get(i))) return false;")
lines.append("                }")
lines.append("                return true;")
lines.append("            }")
lines.append("            if (actual instanceof List<?>) {")
lines.append("                List<?> actualList = (List<?>) actual;")
lines.append("                if (actualList.size() != expectedList.size()) return false;")
lines.append("                for (int i = 0; i < actualList.size(); i++) {")
lines.append("                    if (!compareResults(actualList.get(i), expectedList.get(i))) return false;")
lines.append("                }")
lines.append("                return true;")
lines.append("            }")
lines.append("            return false;")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof Map<?, ?>) {")
lines.append("            Map<?, ?> expectedMap = (Map<?, ?>) expected;")
lines.append("            if (expectedMap.containsKey(\"assignment\") && expectedMap.containsKey(\"total_cost\")) {")
lines.append("                return compareResults(actual, expectedMap.get(\"assignment\"));")
lines.append("            }")
lines.append("        }")
lines.append("")
lines.append("        if (expected instanceof Map<?, ?> && actual instanceof Map<?, ?>) {")
lines.append("            Map<?, ?> expectedMap = (Map<?, ?>) expected;")
lines.append("            Map<?, ?> actualMap = (Map<?, ?>) actual;")
lines.append("            if (expectedMap.size() != actualMap.size()) return false;")
lines.append("            for (Map.Entry<?, ?> entry : expectedMap.entrySet()) {")
lines.append("                Object actualValue = lookupMapValue(actualMap, entry.getKey());")
lines.append("                if (actualValue == MISSING) return false;")
lines.append("                if (!compareResults(actualValue, entry.getValue())) return false;")
lines.append("            }")
lines.append("            return true;")
lines.append("        }")
lines.append("")
lines.append("        return actual.equals(expected);")
lines.append("    }")
lines.append("")
lines.append("    private static String formatValue(Object value) {")
lines.append("        if (value == null) return \"null\";")
lines.append("        if (value instanceof String) return (String) value;")
lines.append("        if (value instanceof List<?>) {")
lines.append("            List<String> parts = new ArrayList<>();")
lines.append("            for (Object item : (List<?>) value) parts.add(formatValue(item));")
lines.append("            return \"[\" + String.join(\", \", parts) + \"]\";")
lines.append("        }")
lines.append("        if (value instanceof Map<?, ?>) {")
lines.append("            List<String> parts = new ArrayList<>();")
lines.append("            for (Map.Entry<?, ?> entry : ((Map<?, ?>) value).entrySet()) {")
lines.append("                parts.add(formatValue(entry.getKey()) + \"=\" + formatValue(entry.getValue()));")
lines.append("            }")
lines.append("            return \"{\" + String.join(\", \", parts) + \"}\";")
lines.append("        }")
lines.append("        if (value.getClass().isArray()) {")
lines.append("            List<String> parts = new ArrayList<>();")
lines.append("            int len = Array.getLength(value);")
lines.append("            for (int i = 0; i < len; i++) parts.add(formatValue(Array.get(value, i)));")
lines.append("            return \"[\" + String.join(\", \", parts) + \"]\";")
lines.append("        }")
lines.append("        if (value instanceof Double) {")
lines.append("            double d = (Double) value;")
lines.append("            if (Double.isInfinite(d)) return d > 0 ? \"Infinity\" : \"-Infinity\";")
lines.append("            if (d == Math.rint(d)) return String.valueOf((long) d);")
lines.append("        }")
lines.append("        if (value instanceof Float) {")
lines.append("            float d = (Float) value;")
lines.append("            if (Float.isInfinite(d)) return d > 0 ? \"Infinity\" : \"-Infinity\";")
lines.append("        }")
lines.append("        return String.valueOf(value);")
lines.append("    }")
lines.append("")
lines.append("    private static boolean matchesSpecialNumberString(Number number, String value) {")
lines.append("        double d = number.doubleValue();")
lines.append("        if (\"Infinity\".equals(value)) return Double.isInfinite(d) && d > 0;")
lines.append("        if (\"-Infinity\".equals(value)) return Double.isInfinite(d) && d < 0;")
lines.append("        return false;")
lines.append("    }")
lines.append("")
lines.append("    private static String describeThrowable(Throwable throwable) {")
lines.append("        Throwable current = throwable;")
lines.append("        while (current instanceof InvocationTargetException && ((InvocationTargetException) current).getCause() != null) {")
lines.append("            current = ((InvocationTargetException) current).getCause();")
lines.append("        }")
lines.append("        if (current.getCause() != null && current != current.getCause()) {")
lines.append("            current = current.getCause();")
lines.append("        }")
lines.append("        return current.toString();")
lines.append("    }")
lines.append("")
lines.append("    private static Object normalizeRawObject(Object raw) {")
lines.append("        if (raw instanceof Map<?, ?>) {")
lines.append("            LinkedHashMap<Object, Object> normalized = new LinkedHashMap<>();")
lines.append("            for (Map.Entry<?, ?> entry : ((Map<?, ?>) raw).entrySet()) {")
lines.append("                normalized.put(normalizeMapKey(entry.getKey()), normalizeRawObject(entry.getValue()));")
lines.append("            }")
lines.append("            return normalized;")
lines.append("        }")
lines.append("        if (raw instanceof List<?>) {")
lines.append("            List<Object> normalized = new ArrayList<>();")
lines.append("            for (Object item : (List<?>) raw) {")
lines.append("                normalized.add(normalizeRawObject(item));")
lines.append("            }")
lines.append("            return normalized;")
lines.append("        }")
lines.append("        return raw;")
lines.append("    }")
lines.append("")
lines.append("    private static Object normalizeMapKey(Object key) {")
lines.append("        if (key instanceof String) {")
lines.append("            String text = (String) key;")
lines.append("            try {")
lines.append("                return Integer.valueOf(text);")
lines.append("            } catch (NumberFormatException ignored) {")
lines.append("            }")
lines.append("        }")
lines.append("        return key;")
lines.append("    }")
lines.append("")
lines.append("    private static Object lookupMapValue(Map<?, ?> map, Object expectedKey) {")
lines.append("        if (map.containsKey(expectedKey)) return map.get(expectedKey);")
lines.append("        if (expectedKey instanceof String) {")
lines.append("            String text = (String) expectedKey;")
lines.append("            try {")
lines.append("                Integer numeric = Integer.valueOf(text);")
lines.append("                if (map.containsKey(numeric)) return map.get(numeric);")
lines.append("            } catch (NumberFormatException ignored) {")
lines.append("            }")
lines.append("        }")
lines.append("        if (expectedKey instanceof Number) {")
lines.append("            String text = String.valueOf(((Number) expectedKey).intValue());")
lines.append("            if (map.containsKey(text)) return map.get(text);")
lines.append("        }")
lines.append("        return MISSING;")
lines.append("    }")
lines.append("")
lines.append("    private static Map<Object, Object> orderedMap(Object... values) {")
lines.append("        LinkedHashMap<Object, Object> map = new LinkedHashMap<>();")
lines.append("        for (int i = 0; i + 1 < values.length; i += 2) {")
lines.append("            map.put(values[i], values[i + 1]);")
lines.append("        }")
lines.append("        return map;")
lines.append("    }")
lines.append("}")

with open(harness_file, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
PY
    then
        ERRORS+=("$algo_name: Failed to generate test harness")
        FAILED=$((FAILED + 1))
    fi
}

# Main execution
main() {
    local algo_path="${1:-}"

    if [[ -n "$algo_path" ]]; then
        local algo_dir="$ALGORITHMS_DIR/$algo_path"
        if [[ ! -d "$algo_dir" ]]; then
            echo "ERROR: Algorithm directory not found: $algo_dir"
            exit 1
        fi
        process_algorithm "$algo_dir"
    else
        local max_jobs
        max_jobs="$(detect_job_count)"
        if [[ ! "$max_jobs" =~ ^[0-9]+$ ]] || [[ "$max_jobs" -lt 1 ]]; then
            max_jobs=4
        fi

        if [[ "$max_jobs" -gt 1 ]]; then
            run_all_algorithms_parallel "$max_jobs"
        else
            while IFS= read -r cases_file; do
                local algo_dir
                algo_dir="$(dirname "$(dirname "$cases_file")")"
                process_algorithm "$algo_dir"
            done < <(find "$ALGORITHMS_DIR" -path "*/tests/cases.yaml" | sort)
        fi
    fi

    # Print report
    local total=$((PASSED + FAILED + SKIPPED))
    echo ""
    echo "============================================================"
    echo "Java Test Results"
    echo "============================================================"
    echo "  Passed:  $PASSED"
    echo "  Failed:  $FAILED"
    echo "  Skipped: $SKIPPED (no Java implementation or method not found)"
    echo "  Total:   $total"

    if [[ ${#ERRORS[@]} -gt 0 ]]; then
        echo ""
        echo "Failures:"
        for err in "${ERRORS[@]}"; do
            echo "  x $err"
        done
    fi

    echo ""

    if [[ $FAILED -gt 0 ]]; then
        exit 1
    fi
}

main "$@"
