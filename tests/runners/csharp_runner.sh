#!/bin/sh
# C# Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs C# implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/csharp_runner.sh                              # Run all algorithms
#   ./tests/runners/csharp_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: dotnet SDK, python3 (for YAML parsing)

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
    local cs_files
    cs_files=$(find "$cs_dir" -name "*.cs" 2>/dev/null | head -1)
    if [ -z "$cs_files" ]; then
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

    # Create a dotnet console project in temp
    local project_dir="$TEMP_DIR/project_${algo_name##*/}"
    mkdir -p "$project_dir"
    dotnet new console -o "$project_dir" --force >/dev/null 2>&1 || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to create dotnet project"
        return
    }

    # Generate test harness (Program.cs)
    python3 -c "
import json, sys

data = $test_data
func_name = data['function_signature']['name']
inputs = data['function_signature']['input']
output = data['function_signature']['output']
sample_case = data['test_cases'][0] if data.get('test_cases') else {'input': [], 'expected': None}
sample_inputs = sample_case.get('input', [])
sample_expected = sample_case.get('expected')

# Read the original C# source
with open('$cs_files') as f:
    source = f.read()

# Find the class name from source
import re
class_match = re.search(r'(?:public\s+)?class\s+(\w+)', source)
class_name = class_match.group(1) if class_match else 'Algorithm'

# Find the method name from the source
method_match = re.search(r'public\s+static\s+\w+\[?\]?\s+(\w+)\s*\(', source)
cs_method_name = method_match.group(1) if method_match else 'Sort'

harness = 'using System;\nusing System.Linq;\n\n'
harness += source + '\n\n'

harness += 'class Program {\n'
harness += '    static void Main(string[] args) {\n'

if (
    (output == 'array_of_integers' and inputs == ['array_of_integers'])
    or (
        len(sample_inputs) == 1
        and isinstance(sample_inputs[0], list)
        and isinstance(sample_expected, list)
    )
):
    harness += '''
        string line = Console.ReadLine() ?? \"\";
        int[] arr;
        if (string.IsNullOrWhiteSpace(line)) {
            arr = new int[0];
        } else {
            arr = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries)
                      .Select(int.Parse).ToArray();
        }
        int[] result = ''' + class_name + '.' + cs_method_name + '''(arr);
        Console.WriteLine(string.Join(\" \", result));
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
        string line = Console.ReadLine() ?? \"\";
        int[] arr;
        if (string.IsNullOrWhiteSpace(line)) {
            arr = new int[0];
        } else {
            arr = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries)
                      .Select(int.Parse).ToArray();
        }
        int target = int.Parse((Console.ReadLine() ?? \"0\").Trim());
        int result = ''' + class_name + '.' + cs_method_name + '''(arr, target);
        Console.WriteLine(result);
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
        int x = int.Parse((Console.ReadLine() ?? \"0\").Trim());
        int result = ''' + class_name + '.' + cs_method_name + '''(x);
        Console.WriteLine(result);
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
        int a = int.Parse((Console.ReadLine() ?? \"0\").Trim());
        int b = int.Parse((Console.ReadLine() ?? \"0\").Trim());
        int result = ''' + class_name + '.' + cs_method_name + '''(a, b);
        Console.WriteLine(result);
'''
else:
    harness += '''
        string line = Console.ReadLine() ?? \"\";
        int[] arr;
        if (string.IsNullOrWhiteSpace(line)) {
            arr = new int[0];
        } else {
            arr = line.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries)
                      .Select(int.Parse).ToArray();
        }
        var result = ''' + class_name + '.' + cs_method_name + '''(arr);
        Console.WriteLine(result);
'''

harness += '    }\n'
harness += '}\n'

with open('$project_dir/Program.cs', 'w') as f:
    f.write(harness)
" || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to generate test harness"
        return
    }

    # Build
    if ! dotnet build "$project_dir" -c Release -o "$project_dir/bin" >/dev/null 2>"$TEMP_DIR/compile_err.txt"; then
        FAILED=$((FAILED + 1))
        local compile_err
        compile_err=$(cat "$TEMP_DIR/compile_err.txt" | head -5)
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
        actual=$(echo "$input_str" | dotnet "$dll_file" 2>/dev/null) || {
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
echo "C# Test Results"
echo "============================================================"
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED (no C# implementation)"
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
