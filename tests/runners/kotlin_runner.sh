#!/bin/sh
# Kotlin Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs Kotlin implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/kotlin_runner.sh                              # Run all algorithms
#   ./tests/runners/kotlin_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: kotlinc (Kotlin compiler), python3 (for YAML parsing)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "$0")"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ALGORITHMS_DIR="$REPO_ROOT/algorithms"
CACHE_DIR="$REPO_ROOT/.cache/kotlin-runner"
TEMP_DIR=$(mktemp -d)
mkdir -p "$CACHE_DIR"

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

PASSED=0
FAILED=0
SKIPPED=0
ERRORS=""
VERBOSE="${KOTLIN_RUNNER_VERBOSE:-0}"
DEBUG_STDERR="${KOTLIN_RUNNER_DEBUG_STDERR:-0}"

# Check if kotlinc is available
if ! command -v kotlinc >/dev/null 2>&1; then
    echo "WARNING: kotlinc not found. Install Kotlin compiler to run Kotlin tests."
    echo "Skipping all Kotlin tests."
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

compute_hash() {
    local file_path="$1"
    if command -v shasum >/dev/null 2>&1; then
        shasum -a 256 "$file_path" | awk '{print $1}'
        return
    fi
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$file_path" | awk '{print $1}'
        return
    fi
    python3 -c "
import hashlib, sys
with open(sys.argv[1], 'rb') as f:
    print(hashlib.sha256(f.read()).hexdigest())
" "$file_path"
}

detect_job_count() {
    if [ -n "$KOTLIN_RUNNER_JOBS" ]; then
        echo "$KOTLIN_RUNNER_JOBS"
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
    if [ "$VERBOSE" = "1" ]; then
        echo "$1"
    fi
}

# Run tests for a single algorithm directory
run_algo_tests() {
    local algo_dir="$1"
    local cases_file="$algo_dir/tests/cases.yaml"
    local kt_dir="$algo_dir/kotlin"

    if [ ! -f "$cases_file" ]; then
        return
    fi

    local algo_name
    algo_name="$(basename "$(dirname "$algo_dir")")/$(basename "$algo_dir")"

    if [ ! -d "$kt_dir" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No Kotlin implementation found"
        return
    fi

    # Find Kotlin source files
    local kt_files
    kt_files=$(find "$kt_dir" -name "*.kt" 2>/dev/null | head -1)
    if [ -z "$kt_files" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No .kt files found"
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
    local safe_algo_name
    safe_algo_name=$(printf '%s' "$algo_name" | tr '/ -' '___')
    local harness_file="$TEMP_DIR/TestHarness_${safe_algo_name}.kt"
    local jar_file

    printf '%s' "$test_data" | python3 -c "
import json, sys, math

data = json.loads(sys.stdin.read())
func_name = data['function_signature']['name']
inputs = data['function_signature']['input']
output = data['function_signature']['output']
sample_case = data['test_cases'][0] if data.get('test_cases') else {'input': [], 'expected': None}
raw_sample_inputs = sample_case.get('input', [])
sample_inputs = raw_sample_inputs if isinstance(raw_sample_inputs, list) else []
sample_expected = sample_case.get('expected')

# Read the original Kotlin source
with open('$kt_files') as f:
    source = f.read()

# Convert snake_case to camelCase for Kotlin
def snake_to_camel(name):
    parts = name.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])

kt_func_name = snake_to_camel(func_name)

# Check if source has a main function
has_main = 'fun main(' in source or 'fun main()' in source

# Strip main function if present
if has_main:
    lines = source.split('\n')
    new_lines = []
    brace_count = 0
    in_main = False
    for line in lines:
        if ('fun main(' in line or 'fun main()' in line) and not in_main:
            in_main = True
            if '{' in line:
                brace_count = line.count('{') - line.count('}')
            continue
        if in_main:
            brace_count += line.count('{') - line.count('}')
            if brace_count <= 0:
                in_main = False
            continue
        new_lines.append(line)
    source = '\n'.join(new_lines)

def split_top_level(text, delimiter=','):
    parts = []
    current = []
    angle_depth = 0
    paren_depth = 0
    bracket_depth = 0
    for ch in text:
        if ch == '<':
            angle_depth += 1
        elif ch == '>':
            angle_depth = max(0, angle_depth - 1)
        elif ch == '(':
            paren_depth += 1
        elif ch == ')':
            paren_depth = max(0, paren_depth - 1)
        elif ch == '[':
            bracket_depth += 1
        elif ch == ']':
            bracket_depth = max(0, bracket_depth - 1)

        if ch == delimiter and angle_depth == 0 and paren_depth == 0 and bracket_depth == 0:
            parts.append(''.join(current).strip())
            current = []
            continue
        current.append(ch)

    tail = ''.join(current).strip()
    if tail:
        parts.append(tail)
    return parts

def parse_param_types(param_blob):
    if not param_blob.strip():
        return []
    result = []
    for part in split_top_level(param_blob):
        if ':' in part:
            result.append(part.split(':', 1)[1].strip())
        else:
            result.append(part.strip())
    return result

def normalize_name(name):
    return ''.join(ch for ch in name.lower() if ch.isalnum())

def discover_callables(kotlin_source):
    top_level = []
    owned = []
    scope_stack = []
    brace_depth = 0

    for raw_line in kotlin_source.splitlines():
        line = raw_line.split('//', 1)[0]
        stripped = line.strip()

        class_match = re.match(r'(?:data\s+)?(object|class)\s+([A-Za-z_][A-Za-z0-9_]*)', stripped)
        pending_owner = None
        if class_match and '{' in line:
            pending_owner = (class_match.group(1), class_match.group(2), brace_depth + line.count('{') - line.count('}'))

        fn_match = re.search(r'fun\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)', stripped)
        if fn_match and fn_match.group(1) != 'main' and not stripped.startswith('private '):
            fn_name = fn_match.group(1)
            param_blob = fn_match.group(2)
            if scope_stack:
                owner_kind, owner_name, _ = scope_stack[-1]
                owned.append((owner_kind, owner_name, fn_name, param_blob))
            else:
                top_level.append((fn_name, param_blob))

        brace_depth += line.count('{') - line.count('}')
        if pending_owner is not None:
            scope_stack.append(pending_owner)
        while scope_stack and brace_depth < scope_stack[-1][2]:
            scope_stack.pop()

    return top_level, owned

import re
top_level_functions, owned_functions = discover_callables(source)

preferred_names = [kt_func_name]
if kt_func_name.endswith('Search'):
    preferred_names.append('search')
preferred_names.extend(['sort', 'solve', 'search', 'compute', 'select'])

selected_call_target = None
selected_param_types = []

for preferred in preferred_names:
    for fn_name, param_blob in top_level_functions:
        if fn_name == preferred:
            selected_call_target = fn_name
            selected_param_types = parse_param_types(param_blob)
            break
    if selected_call_target:
        break

if not selected_call_target:
    for preferred in preferred_names:
        for owner_kind, owner_name, fn_name, param_blob in owned_functions:
            if fn_name == preferred:
                selected_call_target = f'{owner_name}.{fn_name}' if owner_kind == 'object' else f'{owner_name}().{fn_name}'
                selected_param_types = parse_param_types(param_blob)
                break
        if selected_call_target:
            break

if not selected_call_target:
    normalized_preferred = {normalize_name(name) for name in preferred_names}
    for fn_name, param_blob in top_level_functions:
        if normalize_name(fn_name) in normalized_preferred:
            selected_call_target = fn_name
            selected_param_types = parse_param_types(param_blob)
            break

if not selected_call_target:
    for owner_kind, owner_name, fn_name, param_blob in owned_functions:
        if normalize_name(fn_name) in normalized_preferred:
            selected_call_target = f'{owner_name}.{fn_name}' if owner_kind == 'object' else f'{owner_name}().{fn_name}'
            selected_param_types = parse_param_types(param_blob)
            break

if not selected_call_target:
    selected_call_target = kt_func_name
    selected_param_types = []

def is_array_like(type_name):
    normalized = type_name.replace(' ', '')
    return (
        normalized.startswith('IntArray')
        or normalized.startswith('LongArray')
        or normalized.startswith('DoubleArray')
        or normalized.startswith('List<Int>')
        or normalized.startswith('MutableList<Int>')
        or normalized.startswith('List<Long>')
        or normalized.startswith('MutableList<Long>')
    )

def is_nested_collection_like(type_name):
    normalized = type_name.replace(' ', '')
    return (
        normalized.startswith('Array<IntArray>')
        or normalized.startswith('Array<DoubleArray>')
        or normalized.startswith('List<List<Int>>')
        or normalized.startswith('List<IntArray>')
        or normalized.startswith('MutableList<List<Int>>')
    )

def is_graph_map_like(type_name):
    normalized = type_name.replace(' ', '')
    return (
        normalized.startswith('Map<Int,List<List<Int>>>')
        or normalized.startswith('Map<Int,List<Int>>')
    )

def array_expr(type_name, variable_name='arr'):
    if 'List<Int>' in type_name or 'MutableList<Int>' in type_name:
        return f'{variable_name}.toList()'
    if 'List<Long>' in type_name or 'MutableList<Long>' in type_name:
        return f'{variable_name}.toList()'
    return variable_name

def nested_expr(type_name, variable_name='rows'):
    if 'List<List<Int>>' in type_name or 'MutableList<List<Int>>' in type_name:
        return f'{variable_name}.map {{ it.toList() }}'
    if 'List<IntArray>' in type_name:
        return f'{variable_name}.toList()'
    return f'{variable_name}.toTypedArray()'

def scalar_reader(type_name, variable_name):
    if 'String' in type_name:
        return f'    val {variable_name} = readLine() ?: \"\"'
    if 'Long' in type_name:
        return f'    val {variable_name} = readLine()!!.trim().toLong()'
    if 'Boolean' in type_name:
        return f'    val {variable_name} = (readLine()!!.trim() == \"true\")'
    if 'Double' in type_name:
        return f'    val {variable_name} = readLine()!!.trim().toDouble()'
    return f'    val {variable_name} = readLine()!!.trim().toInt()'

harness = source + '\n\n'
harness += '\n'.join([
    'fun formatResult(result: Any?): String = when (result) {',
    '    null -> \"\"',
    '    is IntArray -> result.joinToString(\" \")',
    '    is LongArray -> result.joinToString(\" \")',
    '    is DoubleArray -> result.joinToString(\" \")',
    '    is BooleanArray -> result.joinToString(\" \") { if (it) \"true\" else \"false\" }',
    '    is Pair<*, *> -> listOf(formatResult(result.first), formatResult(result.second)).filter { it.isNotEmpty() }.joinToString(\" \")',
    '    is Map<*, *> -> result.entries.sortedBy { it.key.toString() }.joinToString(\" \") { formatResult(it.value) }',
    '    is Array<*> -> when {',
        '        result.isArrayOf<IntArray>() -> (result as Array<IntArray>).flatMap { it.toList() }.joinToString(\" \")',
        '        result.isArrayOf<DoubleArray>() -> (result as Array<DoubleArray>).flatMap { row -> row.map { if (it.isInfinite()) if (it > 0) \"Infinity\" else \"-Infinity\" else if (it == it.toLong().toDouble()) it.toLong().toString() else it.toString() } }.joinToString(\" \")',
        '        else -> result.map { formatResult(it) }.filter { it.isNotEmpty() }.joinToString(\" \")',
    '    }',
    '    is Iterable<*> -> result.map { formatResult(it) }.filter { it.isNotEmpty() }.joinToString(\" \")',
    '    is Double -> if (result.isInfinite()) if (result > 0) \"Infinity\" else \"-Infinity\" else if (result == result.toLong().toDouble()) result.toLong().toString() else result.toString()',
    '    else -> result.toString()',
    '}',
    '',
    '',
])

# Generate main function
if (
    func_name == 'union_find_operations'
):
    harness += '''
fun runSingleCase(): String {
    val n = readLine()!!.trim().toInt()
    val count = readLine()!!.trim().toInt()
    val operations = mutableListOf<UnionFindOperation>()
    repeat(count) {
        val parts = readLine()!!.trim().split(\" \")
        operations.add(UnionFindOperation(parts[0], parts[1].toInt(), parts[2].toInt()))
    }
    val result = ''' + kt_func_name + '''(n, operations)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    func_name == 'minimax'
    and len(selected_param_types) == 5
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val depth = readLine()!!.trim().toInt()
    val isMax = (readLine()!!.trim() == \"true\")
    val result = ''' + selected_call_target + '''(0, 0, isMax, arr, depth)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    func_name == 'minimax_ab'
    and len(selected_param_types) == 7
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val depth = readLine()!!.trim().toInt()
    val isMax = (readLine()!!.trim() == \"true\")
    val result = ''' + selected_call_target + '''(0, 0, isMax, arr, depth, Int.MIN_VALUE, Int.MAX_VALUE)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    func_name == 'hld_path_query'
):
    harness += '''
fun runSingleCase(): String {
    val n = readLine()!!.trim().toInt()
    val edgeCount = readLine()!!.trim().toInt()
    val edges = MutableList(edgeCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val valuesLine = readLine()?.trim() ?: \"\"
    val values = if (valuesLine.isEmpty()) intArrayOf() else valuesLine.split(\" \").map { it.toInt() }.toIntArray()
    val queryCount = readLine()!!.trim().toInt()
    val queries = Array(queryCount) { readLine()?.trim() ?: \"\" }
    val result = ''' + selected_call_target + '''(n, edges.toTypedArray(), values, queries)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    func_name == 'offline_lca'
):
    harness += '''
fun runSingleCase(): String {
    val n = readLine()!!.trim().toInt()
    val edgeCount = readLine()!!.trim().toInt()
    val edges = MutableList(edgeCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val queryCount = readLine()!!.trim().toInt()
    val queries = MutableList(queryCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val result = ''' + selected_call_target + '''(n, edges.toTypedArray(), queries.toTypedArray())
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    func_name == 'best_first_search'
):
    harness += '''
fun runSingleCase(): String {
    val nodeCount = readLine()!!.trim().toInt()
    val graph = mutableMapOf<Int, List<Int>>()
    repeat(nodeCount) {
        val node = readLine()!!.trim().toInt()
        val edgeCount = readLine()!!.trim().toInt()
        val line = readLine()?.trim() ?: \"\"
        val neighbors = if (edgeCount == 0 || line.isEmpty()) emptyList() else line.split(\" \").map { it.toInt() }
        graph[node] = neighbors
    }
    val start = readLine()!!.trim().toInt()
    val goal = readLine()!!.trim().toInt()
    val heuristicCount = readLine()!!.trim().toInt()
    val heuristic = mutableMapOf<Int, Int>()
    repeat(heuristicCount) {
        val node = readLine()!!.trim().toInt()
        val value = readLine()!!.trim().toInt()
        heuristic[node] = value
    }
    val result = ''' + selected_call_target + '''(graph, start, goal, heuristic)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    func_name == 'fenwick_tree_operations'
    or func_name == 'segment_tree_operations'
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val queryCount = readLine()!!.trim().toInt()
    val queries = Array(queryCount) { readLine()?.trim() ?: \"\" }
    val result = ''' + selected_call_target + '''(arr, queries)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 1
    and is_graph_map_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val nodeCount = readLine()!!.trim().toInt()
''' + (
    '\n'.join([
        '    val graph = mutableMapOf<Int, List<List<Int>>>()',
        '    repeat(nodeCount) {',
        '        val node = readLine()!!.trim().toInt()',
        '        val edgeCount = readLine()!!.trim().toInt()',
        '        val edges = MutableList(edgeCount) {',
        '            val line = readLine()?.trim() ?: \"\"',
        '            if (line.isEmpty()) emptyList<Int>() else line.split(\" \").map { it.toInt() }',
        '        }',
        '        graph[node] = edges',
        '    }',
        '',
    ]) if 'List<List<Int>>' in selected_param_types[0] else
    '\n'.join([
        '    val graph = mutableMapOf<Int, List<Int>>()',
        '    repeat(nodeCount) {',
        '        val node = readLine()!!.trim().toInt()',
        '        val edgeCount = readLine()!!.trim().toInt()',
        '        val line = readLine()?.trim() ?: \"\"',
        '        val neighbors = if (edgeCount == 0 || line.isEmpty()) emptyList() else line.split(\" \").map { it.toInt() }',
        '        graph[node] = neighbors',
        '    }',
        '',
    ])
) + '''
    val result = ''' + selected_call_target + '''(graph)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 1
    and 'Array<Int?>' in selected_param_types[0]
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) emptyArray<Int?>() else line.split(\" \").map { token -> if (token == \"null\") null else token.toInt() }.toTypedArray()
    val result = ''' + selected_call_target + '''(arr)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 1
    and is_nested_collection_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val rowCount = readLine()!!.trim().toInt()
''' + (
    '\n'.join([
        '    val rows = MutableList(rowCount) {',
        '        val line = readLine()?.trim() ?: \"\"',
        '        if (line.isEmpty()) doubleArrayOf() else {',
        '            val tokens = line.split(\" \")',
        '            DoubleArray(tokens.size) { index ->',
        '                when (tokens[index]) {',
        '                    \"Infinity\" -> Double.POSITIVE_INFINITY',
        '                    \"-Infinity\" -> Double.NEGATIVE_INFINITY',
        '                    else -> tokens[index].toDouble()',
        '                }',
        '            }',
        '        }',
        '    }',
        '',
    ]) if 'Array<DoubleArray>' in selected_param_types[0] else
    '\n'.join([
        '    val rows = MutableList(rowCount) {',
        '        val line = readLine()?.trim() ?: \"\"',
        '        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()',
        '    }',
        '',
    ])
) + '''
    val result = ''' + selected_call_target + '''(''' + nested_expr(selected_param_types[0]) + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 1
    and is_array_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val result: Any? = ''' + selected_call_target + '''(''' + array_expr(selected_param_types[0]) + ''')
    return if (result == Unit) formatResult(arr) else formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 1
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
    val result = ''' + selected_call_target + '''(arg0)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and is_graph_map_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val nodeCount = readLine()!!.trim().toInt()
''' + (
    '\n'.join([
        '    val graph = mutableMapOf<Int, List<List<Int>>>()',
        '    repeat(nodeCount) {',
        '        val node = readLine()!!.trim().toInt()',
        '        val edgeCount = readLine()!!.trim().toInt()',
        '        val edges = MutableList(edgeCount) {',
        '            val line = readLine()?.trim() ?: \"\"',
        '            if (line.isEmpty()) emptyList<Int>() else line.split(\" \").map { it.toInt() }',
        '        }',
        '        graph[node] = edges',
        '    }',
        '',
    ]) if 'List<List<Int>>' in selected_param_types[0] else
    '\n'.join([
        '    val graph = mutableMapOf<Int, List<Int>>()',
        '    repeat(nodeCount) {',
        '        val node = readLine()!!.trim().toInt()',
        '        val edgeCount = readLine()!!.trim().toInt()',
        '        val line = readLine()?.trim() ?: \"\"',
        '        val neighbors = if (edgeCount == 0 || line.isEmpty()) emptyList() else line.split(\" \").map { it.toInt() }',
        '        graph[node] = neighbors',
        '    }',
        '',
    ])
) + scalar_reader(selected_param_types[1], 'arg1') + '''
    val result = ''' + selected_call_target + '''(graph, arg1)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and is_graph_map_like(selected_param_types[1])
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
''' + (
    '\n'.join([
        '    val nodeCount = readLine()!!.trim().toInt()',
        '    val graph = mutableMapOf<Int, List<List<Int>>>()',
        '    repeat(nodeCount) {',
        '        val node = readLine()!!.trim().toInt()',
        '        val edgeCount = readLine()!!.trim().toInt()',
        '        val edges = MutableList(edgeCount) {',
        '            val line = readLine()?.trim() ?: \"\"',
        '            if (line.isEmpty()) emptyList<Int>() else line.split(\" \").map { it.toInt() }',
        '        }',
        '        graph[node] = edges',
        '    }',
        '',
    ]) if 'List<List<Int>>' in selected_param_types[1] else
    '\n'.join([
        '    val nodeCount = readLine()!!.trim().toInt()',
        '    val graph = mutableMapOf<Int, List<Int>>()',
        '    repeat(nodeCount) {',
        '        val node = readLine()!!.trim().toInt()',
        '        val edgeCount = readLine()!!.trim().toInt()',
        '        val line = readLine()?.trim() ?: \"\"',
        '        val neighbors = if (edgeCount == 0 || line.isEmpty()) emptyList() else line.split(\" \").map { it.toInt() }',
        '        graph[node] = neighbors',
        '    }',
        '',
    ])
) + '''
    val result = ''' + selected_call_target + '''(arg0, graph)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and is_nested_collection_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val rowCount = readLine()!!.trim().toInt()
    val rows = MutableList(rowCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
    val result = ''' + selected_call_target + '''(''' + nested_expr(selected_param_types[0]) + ''', arg1)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and is_array_like(selected_param_types[0])
    and not is_array_like(selected_param_types[1])
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
    val result = ''' + selected_call_target + '''(''' + array_expr(selected_param_types[0]) + ''', arg1)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and not is_array_like(selected_param_types[0])
    and not is_nested_collection_like(selected_param_types[0])
    and not is_graph_map_like(selected_param_types[0])
    and is_array_like(selected_param_types[1])
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val result = ''' + selected_call_target + '''(arg0, ''' + array_expr(selected_param_types[1]) + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and is_array_like(selected_param_types[0])
    and is_array_like(selected_param_types[1])
):
    harness += '''
fun runSingleCase(): String {
    val line0 = readLine()?.trim() ?: \"\"
    val arr0 = if (line0.isEmpty()) intArrayOf() else line0.split(\" \").map { it.toInt() }.toIntArray()
    val line1 = readLine()?.trim() ?: \"\"
    val arr1 = if (line1.isEmpty()) intArrayOf() else line1.split(\" \").map { it.toInt() }.toIntArray()
    val result = ''' + selected_call_target + '''(''' + array_expr(selected_param_types[0], 'arr0') + ''', ''' + array_expr(selected_param_types[1], 'arr1') + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
    and is_nested_collection_like(selected_param_types[1])
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
    val rowCount = readLine()!!.trim().toInt()
    val rows = MutableList(rowCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val result = ''' + selected_call_target + '''(arg0, ''' + nested_expr(selected_param_types[1]) + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 2
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
    val result = ''' + selected_call_target + '''(arg0, arg1)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 3
    and is_array_like(selected_param_types[0])
    and not is_array_like(selected_param_types[1])
    and not is_nested_collection_like(selected_param_types[1])
    and not is_graph_map_like(selected_param_types[1])
    and not is_array_like(selected_param_types[2])
    and not is_nested_collection_like(selected_param_types[2])
    and not is_graph_map_like(selected_param_types[2])
):
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
''' + scalar_reader(selected_param_types[2], 'arg2') + '''
    val result = ''' + selected_call_target + '''(''' + array_expr(selected_param_types[0]) + ''', arg1, arg2)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 3
    and not is_array_like(selected_param_types[0])
    and not is_nested_collection_like(selected_param_types[0])
    and not is_graph_map_like(selected_param_types[0])
    and is_array_like(selected_param_types[1])
    and is_nested_collection_like(selected_param_types[2])
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val rowCount = readLine()!!.trim().toInt()
''' + (
    '\n'.join([
        '    val rows = MutableList(rowCount) {',
        '        val line = readLine()?.trim() ?: \"\"',
        '        if (line.isEmpty()) doubleArrayOf() else {',
        '            val tokens = line.split(\" \")',
        '            DoubleArray(tokens.size) { index ->',
        '                when (tokens[index]) {',
        '                    \"Infinity\" -> Double.POSITIVE_INFINITY',
        '                    \"-Infinity\" -> Double.NEGATIVE_INFINITY',
        '                    else -> tokens[index].toDouble()',
        '                }',
        '            }',
        '        }',
        '    }',
        '',
    ]) if 'Array<DoubleArray>' in selected_param_types[2] else
    '\n'.join([
        '    val rows = MutableList(rowCount) {',
        '        val line = readLine()?.trim() ?: \"\"',
        '        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()',
        '    }',
        '',
    ])
) + '''
    val result = ''' + selected_call_target + '''(arg0, ''' + array_expr(selected_param_types[1]) + ''', ''' + nested_expr(selected_param_types[2]) + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 3
    and not is_array_like(selected_param_types[0])
    and not is_nested_collection_like(selected_param_types[0])
    and not is_graph_map_like(selected_param_types[0])
    and is_nested_collection_like(selected_param_types[1])
    and is_array_like(selected_param_types[2])
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
    val rowCount = readLine()!!.trim().toInt()
    val rows = MutableList(rowCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val result = ''' + selected_call_target + '''(arg0, ''' + nested_expr(selected_param_types[1]) + ''', ''' + array_expr(selected_param_types[2]) + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 3
    and is_nested_collection_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val rowCount = readLine()!!.trim().toInt()
    val rows = MutableList(rowCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
''' + scalar_reader(selected_param_types[2], 'arg2') + '''
    val result = ''' + selected_call_target + '''(''' + nested_expr(selected_param_types[0]) + ''', arg1, arg2)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 4
    and all(
        not is_array_like(param_type)
        and not is_nested_collection_like(param_type)
        and not is_graph_map_like(param_type)
        for param_type in selected_param_types[:2]
    )
    and is_nested_collection_like(selected_param_types[2])
    and is_nested_collection_like(selected_param_types[3])
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
    val rowCount0 = readLine()!!.trim().toInt()
    val rows0 = MutableList(rowCount0) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val rowCount1 = readLine()!!.trim().toInt()
    val rows1 = MutableList(rowCount1) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
    val result = ''' + selected_call_target + '''(arg0, arg1, ''' + nested_expr(selected_param_types[2], 'rows0') + ''', ''' + nested_expr(selected_param_types[3], 'rows1') + ''')
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 4
    and all(
        not is_array_like(param_type)
        and not is_nested_collection_like(param_type)
        and not is_graph_map_like(param_type)
        for param_type in selected_param_types
    )
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
''' + scalar_reader(selected_param_types[2], 'arg2') + '''
''' + scalar_reader(selected_param_types[3], 'arg3') + '''
    val result = ''' + selected_call_target + '''(arg0, arg1, arg2, arg3)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 4
    and is_nested_collection_like(selected_param_types[0])
):
    harness += '''
fun runSingleCase(): String {
    val rowCount = readLine()!!.trim().toInt()
    val rows = MutableList(rowCount) {
        val line = readLine()?.trim() ?: \"\"
        if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    }
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
''' + scalar_reader(selected_param_types[2], 'arg2') + '''
''' + scalar_reader(selected_param_types[3], 'arg3') + '''
    val result = ''' + selected_call_target + '''(''' + nested_expr(selected_param_types[0]) + ''', arg1, arg2, arg3)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 3
    and is_array_like(selected_param_types[0])
    and is_array_like(selected_param_types[1])
    and not is_array_like(selected_param_types[2])
    and not is_nested_collection_like(selected_param_types[2])
    and not is_graph_map_like(selected_param_types[2])
):
    harness += '''
fun runSingleCase(): String {
    val line0 = readLine()?.trim() ?: \"\"
    val arr0 = if (line0.isEmpty()) intArrayOf() else line0.split(\" \").map { it.toInt() }.toIntArray()
    val line1 = readLine()?.trim() ?: \"\"
    val arr1 = if (line1.isEmpty()) intArrayOf() else line1.split(\" \").map { it.toInt() }.toIntArray()
''' + scalar_reader(selected_param_types[2], 'arg2') + '''
    val result = ''' + selected_call_target + '''(''' + array_expr(selected_param_types[0], 'arr0') + ''', ''' + array_expr(selected_param_types[1], 'arr1') + ''', arg2)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
elif (
    len(selected_param_types) == 3
    and all(not is_array_like(param_type) for param_type in selected_param_types)
):
    harness += '''
fun runSingleCase(): String {
''' + scalar_reader(selected_param_types[0], 'arg0') + '''
''' + scalar_reader(selected_param_types[1], 'arg1') + '''
''' + scalar_reader(selected_param_types[2], 'arg2') + '''
    val result = ''' + selected_call_target + '''(arg0, arg1, arg2)
    return formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''
else:
    harness += '''
fun runSingleCase(): String {
    val line = readLine()?.trim() ?: \"\"
    val arr = if (line.isEmpty()) intArrayOf() else line.split(\" \").map { it.toInt() }.toIntArray()
    val result: Any? = ''' + selected_call_target + '''(arr)
    return if (result == Unit) formatResult(arr) else formatResult(result)
}

fun main() {
    val caseCount = readLine()?.trim()?.toIntOrNull() ?: 0
    repeat(caseCount) {
        println(runSingleCase())
    }
}
'''

with open('$harness_file', 'w') as f:
    f.write(harness)
" || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to generate test harness"
        return
    }

    # Compile (cached by generated harness content)
    local harness_hash
    harness_hash=$(compute_hash "$harness_file") || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to hash generated harness"
        return
    }
    local cached_jar="$CACHE_DIR/$harness_hash.jar"
    jar_file="$cached_jar"
    if [ ! -f "$cached_jar" ]; then
        local cache_tmp_jar="$CACHE_DIR/$harness_hash.$$.tmp.jar"
        if ! kotlinc -include-runtime -d "$cache_tmp_jar" "$harness_file" 2>"$TEMP_DIR/compile_err_${safe_algo_name}.txt"; then
            FAILED=$((FAILED + 1))
            local compile_err
            compile_err=$(cat "$TEMP_DIR/compile_err_${safe_algo_name}.txt" | head -5)
            rm -f "$cache_tmp_jar"
            ERRORS="$ERRORS\n  x $algo_name: Compilation failed: $compile_err"
            return
        fi
        mv "$cache_tmp_jar" "$cached_jar" 2>/dev/null || rm -f "$cache_tmp_jar"
    fi

    # Prepare all test cases once and run the JVM once per algorithm.
    local case_names_file="$TEMP_DIR/case_names_${safe_algo_name}.txt"
    local expecteds_file="$TEMP_DIR/expecteds_${safe_algo_name}.txt"
    local batch_input_file="$TEMP_DIR/batch_input_${safe_algo_name}.txt"
    local actual_output_file="$TEMP_DIR/actual_${safe_algo_name}.txt"

    printf '%s' "$test_data" | python3 -c "
import json, sys, math

data = json.loads(sys.stdin.read())
case_names_path = sys.argv[1]
expecteds_path = sys.argv[2]
batch_input_path = sys.argv[3]
signature_input = data['function_signature']['input']

def render(value):
    if value is None:
        return 'null'
    if isinstance(value, float) and math.isinf(value):
        return 'Infinity' if value > 0 else '-Infinity'
    if isinstance(value, bool):
        return 'true' if value else 'false'
    return str(value)

def serialize_input(value):
    expects_single_collection = (
        isinstance(signature_input, list)
        and len(signature_input) == 1
        and any(token in str(signature_input[0]).lower() for token in ['array', 'list', 'matrix', 'graph', 'adjacency', 'queries', 'operations', 'edges', 'data'])
    )
    already_wrapped = (
        isinstance(value, list)
        and len(value) == 1
        and isinstance(value[0], (list, dict))
    )

    if isinstance(value, list) and expects_single_collection and not already_wrapped:
        values = [value]
    elif isinstance(value, dict):
        values = list(value.items())
    elif isinstance(value, list):
        values = value
    else:
        values = [value]

    lines = []
    for index, entry in enumerate(values):
        descriptor = ''
        if isinstance(signature_input, list) and index < len(signature_input):
            descriptor = str(signature_input[index]).lower()
        if isinstance(entry, (list, tuple)) and len(entry) == 2 and isinstance(entry[0], str):
            if not descriptor:
                descriptor = entry[0].lower()
            entry = entry[1]
        expects_nested_rows = any(token in descriptor for token in ['matrix', 'grid', 'edges'])
        expects_graph_map = 'adjacency' in descriptor or descriptor in ['weighted_adjacency_list', 'adjacency_list']
        is_weighted_graph = descriptor == 'weighted_adjacency_list'

        if isinstance(entry, dict):
            sorted_keys = sorted(
                entry.keys(),
                key=lambda item: int(item) if str(item).lstrip('-').isdigit() else str(item),
            )
            lines.append(str(len(sorted_keys)))
            for key in sorted_keys:
                lines.append(str(key))
                neighbors = entry[key]
                if isinstance(neighbors, list) and neighbors and isinstance(neighbors[0], list):
                    lines.append(str(len(neighbors)))
                    for row in neighbors:
                        lines.append(' '.join(render(item) for item in row))
                elif isinstance(neighbors, list):
                    lines.append(str(len(neighbors)))
                    if neighbors or not is_weighted_graph:
                        lines.append(' '.join(render(item) for item in neighbors))
                elif expects_graph_map:
                    lines.append('1')
                    lines.append(render(neighbors))
                else:
                    lines.append(render(neighbors))
        elif isinstance(entry, list):
            if entry and isinstance(entry[0], dict):
                lines.append(str(len(entry)))
                for item in entry:
                    if isinstance(item, dict):
                        parts = []
                        if 'type' in item:
                            parts.append(str(item['type']))
                        for key, raw_value in item.items():
                            if key == 'type':
                                continue
                            parts.append(render(raw_value))
                        lines.append(' '.join(parts))
                    else:
                        lines.append(render(item))
            elif (entry and isinstance(entry[0], list)) or (not entry and expects_nested_rows):
                lines.append(str(len(entry)))
                for row in entry:
                    lines.append(' '.join(render(item) for item in row))
            else:
                lines.append(' '.join(render(item) for item in entry))
        else:
            lines.append(render(entry))
    return lines

def flatten_expected(value):
    if isinstance(value, dict):
        return [piece for key in sorted(value.keys(), key=lambda item: str(item)) for piece in flatten_expected(value[key])]
    if isinstance(value, list):
        if value and isinstance(value[0], list):
            return [render(item) for row in value for item in row]
        return [render(item) for item in value]
    return [render(value)]

with open(case_names_path, 'w') as names_file, open(expecteds_path, 'w') as expecteds_file, open(batch_input_path, 'w') as input_file:
    for test_case in data['test_cases']:
        names_file.write(test_case['name'].replace('\n', ' ') + '\n')
        expected = test_case['expected']
        expecteds_file.write(' '.join(flatten_expected(expected)) + '\n')

        for line in serialize_input(test_case['input']):
            input_file.write(line + '\n')
" "$case_names_file" "$expecteds_file" "$batch_input_file" || {
        FAILED=$((FAILED + num_cases))
        ERRORS="$ERRORS\n  x $algo_name: Failed to serialize test cases"
        return
    }

    if [ "$DEBUG_STDERR" = "1" ]; then
        if ! (
            printf '%s\n' "$num_cases"
            cat "$batch_input_file"
        ) | java -jar "$jar_file" >"$actual_output_file"; then
            FAILED=$((FAILED + num_cases))
            ERRORS="$ERRORS\n  x $algo_name: Runtime error"
            return
        fi
    elif ! (
        printf '%s\n' "$num_cases"
        cat "$batch_input_file"
    ) | java -jar "$jar_file" >"$actual_output_file" 2>/dev/null; then
        FAILED=$((FAILED + num_cases))
        ERRORS="$ERRORS\n  x $algo_name: Runtime error"
        return
    fi

    local case_name expected_str actual
    exec 3< "$case_names_file"
    exec 4< "$expecteds_file"
    exec 5< "$actual_output_file"

    while IFS= read -r case_name <&3; do
        if ! IFS= read -r expected_str <&4; then
            expected_str=""
        fi
        if ! IFS= read -r actual <&5; then
            actual=""
        fi

        if [ "$actual" = "$expected_str" ]; then
            PASSED=$((PASSED + 1))
            log_pass "[PASS] $algo_name - $case_name"
        else
            FAILED=$((FAILED + 1))
            echo "[FAIL] $algo_name - $case_name: expected=$expected_str got=$actual"
            ERRORS="$ERRORS\n  x $algo_name - $case_name: expected=$expected_str got=$actual"
        fi
    done

    while IFS= read -r actual <&5; do
        FAILED=$((FAILED + 1))
        echo "[FAIL] $algo_name: extra output: $actual"
        ERRORS="$ERRORS\n  x $algo_name: extra output: $actual"
    done

    exec 3<&-
    exec 4<&-
    exec 5<&-
}

run_all_algorithms_parallel() {
    local max_jobs="$1"
    local logs_dir="$TEMP_DIR/parallel_logs"
    local manifest_file="$TEMP_DIR/parallel_manifest.txt"
    local active_jobs=0
    local index=0
    local child_log
    mkdir -p "$logs_dir"
    : > "$manifest_file"

    for cases_file in $(find "$ALGORITHMS_DIR" -path "*/tests/cases.yaml" | sort); do
        algo_dir="$(dirname "$(dirname "$cases_file")")"
        algo_rel="${algo_dir#"$REPO_ROOT"/}"
        index=$((index + 1))
        child_log="$logs_dir/$index.log"
        printf '%s\n' "$child_log" >> "$manifest_file"
        (
            VERBOSE=0 sh "$SCRIPT_PATH" "$algo_rel"
        ) >"$child_log" 2>&1 &
        active_jobs=$((active_jobs + 1))

        if [ "$active_jobs" -ge "$max_jobs" ]; then
            wait
            active_jobs=0
        fi
    done
    wait

    PASSED=0
    FAILED=0
    SKIPPED=0
    ERRORS=""

    while IFS= read -r child_log; do
        if [ "$VERBOSE" = "1" ]; then
            grep -E '^\[(FAIL|SKIP)\]' "$child_log" || true
        else
            grep -E '^\[FAIL\]' "$child_log" || true
        fi

        local child_passed child_failed child_skipped
        child_passed=$(sed -n 's/^  Passed:  //p' "$child_log" | tail -n 1)
        child_failed=$(sed -n 's/^  Failed:  //p' "$child_log" | tail -n 1)
        child_skipped=$(sed -n 's/^  Skipped: //p' "$child_log" | sed 's/ (no Kotlin implementation).*//' | tail -n 1)

        PASSED=$((PASSED + ${child_passed:-0}))
        FAILED=$((FAILED + ${child_failed:-0}))
        SKIPPED=$((SKIPPED + ${child_skipped:-0}))

        local child_failures
        child_failures=$(awk '
            BEGIN { capture = 0 }
            /^Failures:$/ { capture = 1; next }
            capture { print }
        ' "$child_log")
        if [ -n "$child_failures" ]; then
            ERRORS="$ERRORS\n$child_failures"
        fi
    done < "$manifest_file"
}

# Main
if [ -n "$1" ]; then
    algo_path="$REPO_ROOT/$1"
    if [ ! -d "$algo_path" ]; then
        algo_path="$ALGORITHMS_DIR/$1"
    fi
    run_algo_tests "$algo_path"
else
    MAX_JOBS=$(detect_job_count)
    case "$MAX_JOBS" in
        ''|*[!0-9]*)
            MAX_JOBS=4
            ;;
    esac
    if [ "$MAX_JOBS" -lt 1 ]; then
        MAX_JOBS=1
    fi

    if [ "$MAX_JOBS" -gt 1 ]; then
        run_all_algorithms_parallel "$MAX_JOBS"
    else
        for cases_file in $(find "$ALGORITHMS_DIR" -path "*/tests/cases.yaml" | sort); do
            algo_dir="$(dirname "$(dirname "$cases_file")")"
            run_algo_tests "$algo_dir"
        done
    fi
fi

# Report
TOTAL=$((PASSED + FAILED + SKIPPED))
echo ""
echo "============================================================"
echo "Kotlin Test Results"
echo "============================================================"
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED (no Kotlin implementation)"
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
