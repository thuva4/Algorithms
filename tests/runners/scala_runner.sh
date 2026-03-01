#!/bin/sh
# Scala Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs Scala implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/scala_runner.sh                              # Run all algorithms
#   ./tests/runners/scala_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: scalac, scala (Scala compiler/runner), python3 (for YAML parsing)

set -e

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

# Check if scalac is available
if ! command -v scalac >/dev/null 2>&1; then
    echo "WARNING: scalac not found. Install Scala to run Scala tests."
    echo "Skipping all Scala tests."
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
    local scala_dir="$algo_dir/scala"

    if [ ! -f "$cases_file" ]; then
        return
    fi

    local algo_name
    algo_name="$(basename "$(dirname "$algo_dir")")/$(basename "$algo_dir")"

    if [ ! -d "$scala_dir" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No Scala implementation found"
        return
    fi

    # Find Scala source files
    local scala_files
    scala_files=$(find "$scala_dir" -name "*.scala" 2>/dev/null | head -1)
    if [ -z "$scala_files" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No .scala files found"
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

    # Generate test harness
    local harness_file="$TEMP_DIR/TestHarness_${algo_name##*/}.scala"
    local class_dir="$TEMP_DIR/classes_${algo_name##*/}"
    mkdir -p "$class_dir"

    python3 -c "
import json, sys

data = $test_data
func_name = data['function_signature']['name']
inputs = data['function_signature']['input']
output = data['function_signature']['output']
sample_case = data['test_cases'][0] if data.get('test_cases') else {'input': [], 'expected': None}
sample_inputs = sample_case.get('input', [])
sample_expected = sample_case.get('expected')

# Read the original Scala source
with open('$scala_files') as f:
    source = f.read()

# Convert snake_case to camelCase for Scala
def snake_to_camel(name):
    parts = name.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])

scala_func_name = snake_to_camel(func_name)

# Find the object name from the source
import re
obj_match = re.search(r'object\s+(\w+)', source)
obj_name = obj_match.group(1) if obj_match else 'Algorithm'

harness = source + '\n\n'

# Generate main object
harness += 'object TestHarness {\n'
harness += '  def main(args: Array[String]): Unit = {\n'

if (
    (output == 'array_of_integers' and inputs == ['array_of_integers'])
    or (
        len(sample_inputs) == 1
        and isinstance(sample_inputs[0], list)
        and isinstance(sample_expected, list)
    )
):
    harness += '''
    val line = scala.io.StdIn.readLine()
    val arr = if (line == null || line.trim.isEmpty) Array.empty[Int]
              else line.trim.split(\"\\\\s+\").map(_.toInt)
    val result = ''' + obj_name + '.' + scala_func_name + '''(arr)
    println(result.mkString(\" \"))
'''
elif (
    (output == 'integer_index' and len(inputs) == 2)
    or (
        len(sample_inputs) == 2
        and isinstance(sample_inputs[0], list)
        and not isinstance(sample_inputs[1], list)
        and not isinstance(sample_expected, list)
    )
):
    harness += '''
    val line = scala.io.StdIn.readLine()
    val arr = if (line == null || line.trim.isEmpty) Array.empty[Int]
              else line.trim.split(\"\\\\s+\").map(_.toInt)
    val target = scala.io.StdIn.readLine().trim.toInt
    val result = ''' + obj_name + '.' + scala_func_name + '''(arr, target)
    println(result)
'''
elif (
    (output == 'integer' and inputs == ['integer'])
    or (
        len(sample_inputs) == 1
        and not isinstance(sample_inputs[0], list)
        and not isinstance(sample_expected, list)
    )
):
    harness += '''
    val x = scala.io.StdIn.readLine().trim.toInt
    val result = ''' + obj_name + '.' + scala_func_name + '''(x)
    println(result)
'''
elif (
    (output == 'integer' and inputs == ['integer', 'integer'])
    or (
        len(sample_inputs) == 2
        and all(not isinstance(value, list) for value in sample_inputs)
        and not isinstance(sample_expected, list)
    )
):
    harness += '''
    val a = scala.io.StdIn.readLine().trim.toInt
    val b = scala.io.StdIn.readLine().trim.toInt
    val result = ''' + obj_name + '.' + scala_func_name + '''(a, b)
    println(result)
'''
else:
    harness += '''
    val line = scala.io.StdIn.readLine()
    val arr = if (line == null || line.trim.isEmpty) Array.empty[Int]
              else line.trim.split(\"\\\\s+\").map(_.toInt)
    val result = ''' + obj_name + '.' + scala_func_name + '''(arr)
    println(result)
'''

harness += '  }\n'
harness += '}\n'

with open('$harness_file', 'w') as f:
    f.write(harness)
" || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to generate test harness"
        return
    }

    # Compile
    if ! scalac -d "$class_dir" "$harness_file" 2>"$TEMP_DIR/compile_err.txt"; then
        FAILED=$((FAILED + 1))
        local compile_err
        compile_err=$(cat "$TEMP_DIR/compile_err.txt" | head -5)
        ERRORS="$ERRORS\n  x $algo_name: Compilation failed: $compile_err"
        return
    fi

    # Run each test case
    local i=0
    while [ "$i" -lt "$num_cases" ]; do
        local case_name input_str expected_str
        case_name=$(echo "$test_data" | python3 -c "import json,sys; print(json.loads(sys.stdin.read())['test_cases'][$i]['name'])")
        input_str=$(echo "$test_data" | python3 -c "
import json, sys
tc = json.loads(sys.stdin.read())['test_cases'][$i]
inp = tc['input']
parts = []
for v in inp:
    if isinstance(v, list):
        parts.append(' '.join(str(x) for x in v))
    else:
        parts.append(str(v))
print('\n'.join(parts))
")
        expected_str=$(echo "$test_data" | python3 -c "
import json, sys
tc = json.loads(sys.stdin.read())['test_cases'][$i]
val = tc['expected']
if isinstance(val, list):
    print(' '.join(str(x) for x in val))
else:
    print(val)
")

        local actual
        actual=$(echo "$input_str" | scala -cp "$class_dir" TestHarness 2>/dev/null) || {
            FAILED=$((FAILED + 1))
            ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error"
            i=$((i + 1))
            continue
        }

        actual=$(echo "$actual" | tr -s ' ' | sed 's/^ *//;s/ *$//')
        expected_str=$(echo "$expected_str" | tr -s ' ' | sed 's/^ *//;s/ *$//')

        if [ "$actual" = "$expected_str" ]; then
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
if [ -n "$1" ]; then
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
echo "Scala Test Results"
echo "============================================================"
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED (no Scala implementation)"
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
