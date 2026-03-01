#!/bin/sh
# C Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs C implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/c_runner.sh                              # Run all algorithms
#   ./tests/runners/c_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: gcc, python3 (for YAML parsing)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "$0")"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ALGORITHMS_DIR="$REPO_ROOT/algorithms"
CACHE_DIR="$REPO_ROOT/.cache/c-runner"
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
VERBOSE="${C_RUNNER_VERBOSE:-0}"

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
    if [ -n "$C_RUNNER_JOBS" ]; then
        echo "$C_RUNNER_JOBS"
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
            C_RUNNER_VERBOSE=0 sh "$SCRIPT_PATH" "$algo_rel"
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
        grep -E '^\[(FAIL|SKIP)\]' "$child_log" || true

        child_passed=$(sed -n 's/^  Passed:  //p' "$child_log" | tail -n 1)
        child_failed=$(sed -n 's/^  Failed:  //p' "$child_log" | tail -n 1)
        child_skipped=$(sed -n 's/^  Skipped: //p' "$child_log" | sed 's/ (no C implementation).*//' | tail -n 1)

        PASSED=$((PASSED + ${child_passed:-0}))
        FAILED=$((FAILED + ${child_failed:-0}))
        SKIPPED=$((SKIPPED + ${child_skipped:-0}))

        child_failures=$(awk 'BEGIN { capture = 0 } /^Failures:$/ { capture = 1; next } capture { print }' "$child_log")
        if [ -n "$child_failures" ]; then
            ERRORS="$ERRORS\n$child_failures"
        fi
    done < "$manifest_file"
}

# Run tests for a single algorithm directory
run_algo_tests() {
    local algo_dir="$1"
    local cases_file="$algo_dir/tests/cases.yaml"
    local c_dir="$algo_dir/c"

    if [ ! -f "$cases_file" ]; then
        return
    fi

    local algo_name
    algo_name="$(basename "$(dirname "$algo_dir")")/$(basename "$algo_dir")"

    if [ ! -d "$c_dir" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No C implementation found"
        return
    fi

    # Find C source files
    local c_files
    c_files=$(find "$c_dir" -name "*.c" 2>/dev/null | sort)
    if [ -z "$c_files" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No .c files found"
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

    # Choose the implementation file whose identifiers best match the declared function name.
    local primary_c
    primary_c=$(C_FILES="$c_files" FUNC_NAME="$func_name" python3 - <<'PY'
import os
import re

files = [line for line in os.environ['C_FILES'].splitlines() if line.strip()]
func_name = os.environ['FUNC_NAME']


def normalize(name):
    return name.replace('_', '').lower()

target = normalize(func_name)
pattern = re.compile(r'(?ms)^\s*[A-Za-z_][\w\s\*]*?\s+([A-Za-z_]\w*)\s*\(([^;{}]*)\)(?:\s|//[^\n]*)*\{')
best_path = None
best_score = -1

for path in files:
    with open(path) as f:
        source = f.read()
    definitions = [match.group(1) for match in pattern.finditer(source)]
    basename = os.path.splitext(os.path.basename(path))[0]
    score = 0
    if func_name in definitions:
        score = 100
    elif func_name.lower() in definitions:
        score = 90
    elif target in {normalize(name) for name in definitions}:
        score = 80
    elif basename == func_name:
        score = 70
    elif basename.lower() == func_name.lower():
        score = 60
    elif normalize(basename) == target:
        score = 50

    if score >= 80:
        if basename == func_name:
            score += 5
        elif basename.lower() == func_name.lower():
            score += 4
        elif normalize(basename) == target:
            score += 3

    if score > best_score:
        best_score = score
        best_path = path

print(best_path or (files[0] if files else ''))
PY
)

    local num_cases
    num_cases=$(echo "$test_data" | python3 -c "import json,sys; print(len(json.loads(sys.stdin.read())['test_cases']))")

    # Generate test harness
    local harness_file="$TEMP_DIR/test_harness_${algo_name##*/}.c"
    local binary_file="$TEMP_DIR/test_binary_${algo_name##*/}"

    TEST_DATA="$test_data" PRIMARY_C="$primary_c" HARNESS_FILE="$harness_file" python3 - <<'PY' || {
import json
import os
import re

data = json.loads(os.environ['TEST_DATA'])
primary_c = os.environ['PRIMARY_C']
harness_file = os.environ['HARNESS_FILE']

func_name = data['function_signature']['name']
inputs = data['function_signature']['input']
output = data['function_signature']['output']
sample_case = data['test_cases'][0] if data.get('test_cases') else {'input': [], 'expected': None}
sample_input_payload = sample_case.get('input', [])

if isinstance(inputs, str):
    if isinstance(sample_input_payload, dict):
        inputs = list(sample_input_payload.keys())
    else:
        inputs = [inputs]

def expects_collection(name):
    if not isinstance(name, str):
        return False
    tokens = ('array', 'list', 'matrix', 'grid', 'board', 'stream', 'adjacency', 'points', 'values')
    return any(token in name for token in tokens)

if isinstance(sample_input_payload, dict):
    sample_inputs = [sample_input_payload.get(name) for name in inputs]
elif len(inputs) == 1:
    if expects_collection(inputs[0]):
        if (
            isinstance(sample_input_payload, list)
            and len(sample_input_payload) == 1
            and isinstance(sample_input_payload[0], (list, dict, str))
        ):
            sample_inputs = sample_input_payload
        else:
            sample_inputs = [sample_input_payload]
    else:
        if isinstance(sample_input_payload, list) and len(sample_input_payload) == 1:
            sample_inputs = [sample_input_payload[0]]
        else:
            sample_inputs = [sample_input_payload]
else:
    sample_inputs = sample_input_payload
sample_expected = sample_case.get('expected')

with open(primary_c) as f:
    source = f.read()


def strip_main(src):
    match = re.search(r'(?ms)^\s*(?:int|void)\s+main\s*\([^)]*\)\s*\{', src)
    if not match:
        return src

    start = match.start()
    idx = match.end() - 1
    depth = 0
    end = None
    while idx < len(src):
        char = src[idx]
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
            if depth == 0:
                end = idx + 1
                break
        idx += 1

    if end is None:
        return src
    return src[:start] + src[end:]


def snake_to_camel(name):
    parts = name.split('_')
    if not parts:
        return name
    return parts[0] + ''.join(part[:1].upper() + part[1:] for part in parts[1:])


def snake_to_pascal(name):
    return ''.join(part[:1].upper() + part[1:] for part in name.split('_'))


def normalize_name(name):
    return name.replace('_', '').lower()


def count_params(params):
    params = params.strip()
    if not params or params == 'void':
        return 0
    return len([part for part in params.split(',') if part.strip()])


def is_pointer_like(part):
    compact = part.replace(' ', '')
    return '*' in compact or ('[' in compact and ']' in compact)


def find_functions(src):
    functions = []
    pattern = re.compile(r'(?ms)^\s*([A-Za-z_][\w\s]*?(?:\s*\*)*)\s*([A-Za-z_]\w*)\s*\(([^;{}]*)\)(?:\s|//[^\n]*)*\{')
    for match in pattern.finditer(src):
        return_type = ' '.join(match.group(1).split())
        name = match.group(2)
        params = match.group(3).strip()
        keyword = (return_type + name).replace(' ', '').replace('*', '').lower()
        if keyword in {'if', 'elseif', 'for', 'while', 'switch'}:
            continue
        functions.append({
            'name': name,
            'return_type': return_type,
            'param_count': count_params(params),
            'params': params,
        })
    return functions


source = strip_main(source)
functions = find_functions(source)
functions_by_name = {fn['name']: fn for fn in functions}

candidates = []
for candidate in [
    func_name,
    func_name.lower(),
    snake_to_camel(func_name),
    snake_to_pascal(func_name),
    func_name.replace('_', ''),
]:
    if candidate and candidate not in candidates:
        candidates.append(candidate)

selected = None
for candidate in candidates:
    if candidate in functions_by_name:
        selected = functions_by_name[candidate]
        break

if selected is None:
    normalized_functions = {normalize_name(fn['name']): fn for fn in functions}
    for candidate in candidates:
        normalized = normalize_name(candidate)
        if normalized in normalized_functions:
            selected = normalized_functions[normalized]
            break

if selected is None and len(functions) == 1:
    selected = functions[0]

selected_name = selected['name'] if selected else func_name
param_count = selected['param_count'] if selected else None
return_type = selected['return_type'].lower() if selected else ''
params_text = selected['params'] if selected else ''
param_parts = [part.strip() for part in params_text.split(',')] if params_text else []
returns_pointer = '*' in return_type
returns_void = return_type.startswith('void')
returns_char_pointer = 'char' in return_type and '*' in return_type

single_array_input = len(sample_inputs) == 1 and isinstance(sample_inputs[0], list)
two_array_inputs = len(sample_inputs) == 2 and all(isinstance(value, list) for value in sample_inputs)
two_arrays_and_scalar_input = (
    len(sample_inputs) == 3
    and isinstance(sample_inputs[0], list)
    and isinstance(sample_inputs[1], list)
    and not isinstance(sample_inputs[2], list)
)
array_and_scalar_input = (
    len(sample_inputs) == 2
    and isinstance(sample_inputs[0], list)
    and not isinstance(sample_inputs[1], list)
)
scalar_and_array_input = (
    len(sample_inputs) == 2
    and not isinstance(sample_inputs[0], list)
    and not isinstance(sample_inputs[0], dict)
    and isinstance(sample_inputs[1], list)
)
array_and_two_scalars_input = (
    len(sample_inputs) == 3
    and isinstance(sample_inputs[0], list)
    and all(not isinstance(value, list) for value in sample_inputs[1:])
)
single_scalar_input = len(sample_inputs) == 1 and not isinstance(sample_inputs[0], list)
two_scalar_inputs = len(sample_inputs) == 2 and all(not isinstance(value, list) for value in sample_inputs)
many_scalar_inputs = len(sample_inputs) > 2 and all(not isinstance(value, list) for value in sample_inputs)
scalar_expected = not isinstance(sample_expected, list) and not isinstance(sample_expected, str)
string_expected = isinstance(sample_expected, str)
string_input = len(sample_inputs) == 1 and isinstance(sample_inputs[0], str)
two_string_inputs = len(sample_inputs) == 2 and all(isinstance(value, str) for value in sample_inputs)

harness = '''
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void trim_newline(char *s) {
    size_t len = strlen(s);
    while (len > 0 && (s[len - 1] == '\\n' || s[len - 1] == '\\r')) {
        s[--len] = '\\0';
    }
}
'''

harness += source + '\n'

if output == 'list_of_permutations_sorted' and single_array_input and param_count == 2:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n);
    return 0;
}}
'''
elif output == 'array_of_level_order_values' and single_array_input and param_count == 2 and returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n);
    return 0;
}}
'''
elif output == 'array_of_nodes_in_path' and len(inputs) == 4 and inputs[0] == 'adjacency_list' and param_count == 7:
    harness += f'''
int main() {{
    int edge_data[10000];
    int edge_count = 0;
    int n = 0;
    int m = 0;
    int start = 0;
    int target = 0;
    int heuristic[1000];
    int path[1000];
    int path_len = 0;
    int adj_storage[1000][1000];
    int *adj[1000];
    char line[100000];

    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            edge_data[edge_count++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}

    if (edge_count >= 2) {{
        n = edge_data[0];
        m = edge_data[1];
    }}

    for (int i = 0; i < n; i++) {{
        adj[i] = adj_storage[i];
        for (int j = 0; j < n; j++) {{
            adj_storage[i][j] = 0;
        }}
        heuristic[i] = 0;
    }}

    for (int i = 0; i < m; i++) {{
        int base = 2 + (2 * i);
        if (base + 1 < edge_count) {{
            int u = edge_data[base];
            int v = edge_data[base + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {{
                adj_storage[u][v] = 1;
            }}
        }}
    }}

    scanf("%d", &start);
    scanf("%d", &target);

    if (fgets(line, sizeof(line), stdin)) {{
        // consume trailing newline after scanf
    }}
    if (fgets(line, sizeof(line), stdin)) {{
        int idx = 0;
        char *tok = strtok(line, " \\n");
        while (tok && idx < n) {{
            heuristic[idx++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}

    if ({selected_name}(n, adj, start, target, heuristic, path, &path_len)) {{
        for (int i = 0; i < path_len; i++) {{
            if (i > 0) printf(" ");
            printf("%d", path[i]);
        }}
    }}
    printf("\\n");
    return 0;
}}
'''
elif output == 'array_of_nodes_in_topological_order' and len(inputs) == 1 and inputs[0] == 'adjacency_list' and param_count == 2:
    harness += f'''
int main() {{
    int edge_data[10000];
    int edge_count = 0;
    int n = 0;
    int m = 0;
    int result[1000];
    char line[100000];

    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            edge_data[edge_count++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}

    if (edge_count >= 2) {{
        n = edge_data[0];
        m = edge_data[1];
    }}

    for (int i = 0; i < n; i++) {{
        adjCount[i] = 0;
    }}

    for (int i = 0; i < m; i++) {{
        int base = 2 + (2 * i);
        if (base + 1 < edge_count) {{
            int u = edge_data[base];
            int v = edge_data[base + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {{
                adjList[u][adjCount[u]++] = v;
            }}
        }}
    }}

    int count = {selected_name}(n, result);
    for (int i = 0; i < count; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif len(inputs) == 2 and inputs[0] == 'num_vertices' and inputs[1] == 'weighted_adjacency_list' and scalar_expected and param_count == 2 and not returns_void:
    harness += f'''
int main() {{
    int num_vertices;
    int arr[10000];
    int arr_len = 0;
    char line[100000];
    scanf("%d", &num_vertices);
    if (fgets(line, sizeof(line), stdin)) {{
        // consume trailing newline
    }}
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[arr_len++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    printf("%lld\\n", (long long){selected_name}(num_vertices, arr));
    return 0;
}}
'''
elif len(inputs) == 2 and inputs[0] == 'num_vertices' and inputs[1] == 'edges_list' and scalar_expected and not isinstance(sample_expected, dict) and param_count == 2 and not returns_void:
    harness += f'''
int main() {{
    int num_vertices;
    int raw[10000];
    int arr[10000];
    int raw_count = 0;
    char line[100000];
    scanf("%d", &num_vertices);
    if (fgets(line, sizeof(line), stdin)) {{
        // consume trailing newline
    }}
    if (fgets(line, sizeof(line), stdin)) {{
        char *p = line;
        char *end = line;
        while (*p) {{
            long value = strtol(p, &end, 10);
            if (p == end) {{
                p++;
                continue;
            }}
            raw[raw_count++] = (int)value;
            p = end;
        }}
    }}
    if (raw_count > 0 && raw[0] >= 0 && ((raw_count - 1) % 3) == 0 && raw[0] == ((raw_count - 1) / 3)) {{
        for (int i = 0; i < raw_count; i++) {{
            arr[i] = raw[i];
        }}
    }} else {{
        arr[0] = raw_count / 3;
        for (int i = 0; i < raw_count; i++) {{
            arr[i + 1] = raw[i];
        }}
    }}
    printf("%lld\\n", (long long){selected_name}(num_vertices, arr));
    return 0;
}}
'''
elif output == 'list_of_sccs' and len(inputs) == 1 and inputs[0] == 'adjacency_list' and param_count == 1:
    harness += f'''
int main() {{
    int edge_data[10000];
    int edge_count = 0;
    int n = 0;
    int m = 0;
    char line[100000];

    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            edge_data[edge_count++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}

    if (edge_count >= 2) {{
        n = edge_data[0];
        m = edge_data[1];
    }}

    for (int i = 0; i < n; i++) {{
        adjCount[i] = 0;
        revAdjCount[i] = 0;
    }}

    for (int i = 0; i < m; i++) {{
        int base = 2 + (2 * i);
        if (base + 1 < edge_count) {{
            int u = edge_data[base];
            int v = edge_data[base + 1];
            if (u >= 0 && u < n && v >= 0 && v < n) {{
                adjList[u][adjCount[u]++] = v;
                revAdj[v][revAdjCount[v]++] = u;
            }}
        }}
    }}

    int count = {selected_name}(n);
    int order[1000];
    for (int i = 0; i < count; i++) {{
        for (int a = 0; a < componentSizes[i]; a++) {{
            for (int b = a + 1; b < componentSizes[i]; b++) {{
                if (components[i][a] > components[i][b]) {{
                    int temp = components[i][a];
                    components[i][a] = components[i][b];
                    components[i][b] = temp;
                }}
            }}
        }}
        order[i] = i;
    }}

    for (int i = 0; i < count; i++) {{
        for (int j = i + 1; j < count; j++) {{
            int left = order[i];
            int right = order[j];
            int left_key = componentSizes[left] > 0 ? components[left][0] : 1000000000;
            int right_key = componentSizes[right] > 0 ? components[right][0] : 1000000000;
            if (left_key > right_key) {{
                int temp = order[i];
                order[i] = order[j];
                order[j] = temp;
            }}
        }}
    }}

    for (int idx = 0; idx < count; idx++) {{
        int i = order[idx];
        if (idx > 0) printf(" ");
        printf("[");
        for (int j = 0; j < componentSizes[i]; j++) {{
            if (j > 0) printf(", ");
            printf("%d", components[i][j]);
        }}
        printf("]");
    }}
    printf("\\n");
    return 0;
}}
'''
elif output == 'modified_grid' and len(inputs) == 4 and inputs[0] == 'grid' and returns_char_pointer and param_count == 5:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int sr;
    int sc;
    int new_value;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &sr);
    scanf("%d", &sc);
    scanf("%d", &new_value);
    char *result = {selected_name}(arr, n, sr, sc, new_value);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif output == 'assignment_and_cost' and single_array_input and returns_char_pointer and param_count == 2:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    char *result = {selected_name}(arr, n);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif output == 'all_pairs_shortest_distances' and len(inputs) == 2 and inputs[0] == 'num_vertices' and inputs[1] == 'edges_list' and param_count == 2:
    harness += f'''
int main() {{
    int n;
    int arr[10000];
    int arr_len = 0;
    scanf("%d", &n);
    while (scanf("%d", &arr[arr_len]) == 1) {{
        arr_len++;
    }}
    char *result = (char *){selected_name}(n, arr);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif output == 'shortest_distance_matrix' and single_array_input and returns_char_pointer and param_count == 2:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    char *result = {selected_name}(arr, n);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif output == 'longest_distances_dict' and len(inputs) == 2 and inputs[0] == 'weighted_adjacency_list' and returns_char_pointer and param_count == 3:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int start_node;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &start_node);
    char *result = {selected_name}(arr, n, start_node);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif output == 'list_of_matches' and len(inputs) == 2 and inputs[0] == 'text' and inputs[1] == 'patterns' and returns_char_pointer and param_count == 2:
    harness += f'''
int main() {{
    char text[100000];
    char patterns[100000];
    if (!fgets(text, sizeof(text), stdin)) {{
        text[0] = '\\0';
    }}
    if (!fgets(patterns, sizeof(patterns), stdin)) {{
        patterns[0] = '\\0';
    }}
    trim_newline(text);
    trim_newline(patterns);
    char *result = {selected_name}(text, patterns);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif output == 'array_of_tokens' and two_string_inputs and returns_char_pointer and param_count == 2:
    harness += f'''
int main() {{
    char a[100000];
    char b[100000];
    if (!fgets(a, sizeof(a), stdin)) {{
        a[0] = '\\0';
    }}
    if (!fgets(b, sizeof(b), stdin)) {{
        b[0] = '\\0';
    }}
    trim_newline(a);
    trim_newline(b);
    char *result = {selected_name}(a, b);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif single_array_input and isinstance(sample_expected, list):
    if param_count == 4:
        if returns_void and len(param_parts) >= 3 and '**' in param_parts[2].replace(' ', ''):
            harness += f'''
int main() {{
    int arr[10000];
    int *result = NULL;
    int n = 0;
    int result_size = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n, &result, &result_size);
    for (int i = 0; i < result_size; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
        elif (
            returns_void
            and len(param_parts) == 4
            and not is_pointer_like(param_parts[2])
            and is_pointer_like(param_parts[3])
            and '**' not in param_parts[3].replace(' ', '')
        ):
            harness += f'''
int main() {{
    int arr[10000];
    int result[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n, n, result);
    for (int i = 0; i < n; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
        else:
            harness += f'''
int main() {{
    int arr[10000];
    int result[10000];
    int n = 0;
    int result_size = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n, result, &result_size);
    for (int i = 0; i < result_size; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
    elif param_count == 3 and returns_pointer:
        harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int out_size = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    int *result = {selected_name}(arr, n, &out_size);
    for (int i = 0; i < out_size; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
    elif param_count == 2 and returns_pointer:
        harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    int *result = {selected_name}(arr, n);
    for (int i = 0; i < n; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
    elif param_count == 3 and returns_void:
        harness += f'''
int main() {{
    int arr[10000];
    int result[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n, result);
    for (int i = 0; i < n; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
    elif (
        param_count == 3
        and not returns_void
        and len(param_parts) == 3
        and is_pointer_like(param_parts[1])
        and not is_pointer_like(param_parts[2])
    ):
        harness += f'''
int main() {{
    int arr[10000];
    int result[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, result, n);
    for (int i = 0; i < n; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
    else:
        harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n);
    for (int i = 0; i < n; i++) {{
        if (i > 0) printf(" ");
        printf("%d", arr[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif two_array_inputs and scalar_expected and param_count == 4:
    harness += f'''
int main() {{
    int arr1[10000];
    int arr2[10000];
    int n1 = 0;
    int n2 = 0;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr1[n1++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr2[n2++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    printf("%lld\\n", (long long){selected_name}(arr1, n1, arr2, n2));
    return 0;
}}
'''
elif two_arrays_and_scalar_input and scalar_expected and param_count == 3 and not returns_void:
    harness += f'''
int main() {{
    int arr1[10001] = {{0}};
    int arr2[10001] = {{0}};
    int n1 = 0;
    int n2 = 0;
    int x;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr1[n1++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr2[n2++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    arr1[n1] = 0;
    arr2[n2] = 0;
    scanf("%d", &x);
    printf("%lld\\n", (long long){selected_name}(arr1, arr2, x));
    return 0;
}}
'''
elif two_string_inputs and scalar_expected and param_count == 2:
    harness += f'''
int main() {{
    char a[100000];
    char b[100000];
    if (!fgets(a, sizeof(a), stdin)) {{
        a[0] = '\\0';
    }}
    if (!fgets(b, sizeof(b), stdin)) {{
        b[0] = '\\0';
    }}
    trim_newline(a);
    trim_newline(b);
    printf("%lld\\n", (long long){selected_name}(a, b));
    return 0;
}}
'''
elif two_string_inputs and scalar_expected and param_count == 4:
    harness += f'''
int main() {{
    char a[100000];
    char b[100000];
    if (!fgets(a, sizeof(a), stdin)) {{
        a[0] = '\\0';
    }}
    if (!fgets(b, sizeof(b), stdin)) {{
        b[0] = '\\0';
    }}
    trim_newline(a);
    trim_newline(b);
    printf("%lld\\n", (long long){selected_name}(a, b, (int)strlen(a), (int)strlen(b)));
    return 0;
}}
'''
elif two_string_inputs and string_expected and param_count == 2 and returns_char_pointer:
    harness += f'''
int main() {{
    char a[100000];
    char b[100000];
    if (!fgets(a, sizeof(a), stdin)) {{
        a[0] = '\\0';
    }}
    if (!fgets(b, sizeof(b), stdin)) {{
        b[0] = '\\0';
    }}
    trim_newline(a);
    trim_newline(b);
    char *result = {selected_name}(a, b);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif string_input and scalar_expected and param_count == 1:
    harness += f'''
int main() {{
    char s[100000];
    if (!fgets(s, sizeof(s), stdin)) {{
        s[0] = '\\0';
    }}
    trim_newline(s);
    printf("%lld\\n", (long long){selected_name}(s));
    return 0;
}}
'''
elif string_input and string_expected and param_count == 1 and returns_char_pointer:
    harness += f'''
int main() {{
    char s[100000];
    if (!fgets(s, sizeof(s), stdin)) {{
        s[0] = '\\0';
    }}
    trim_newline(s);
    char *result = {selected_name}(s);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif array_and_scalar_input and scalar_expected and param_count == 3:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int target;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &target);
    printf("%lld\\n", (long long){selected_name}(arr, n, target));
    return 0;
}}
'''
elif array_and_scalar_input and scalar_expected and param_count == 2 and not returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int target;
    int n = 0;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &target);
    printf("%lld\\n", (long long){selected_name}(arr, target));
    return 0;
}}
'''
elif array_and_two_scalars_input and scalar_expected and param_count == 3 and not returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int a;
    int b;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &a);
    scanf("%d", &b);
    printf("%lld\\n", (long long){selected_name}(arr, a, b));
    return 0;
}}
'''
elif array_and_two_scalars_input and scalar_expected and param_count == 4 and not returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int a;
    int b;
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &a);
    scanf("%d", &b);
    printf("%lld\\n", (long long){selected_name}(arr, n, a, b));
    return 0;
}}
'''
elif array_and_two_scalars_input and isinstance(sample_expected, list) and param_count == 5 and returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int k;
    int seed;
    int result[10000];
    char line[100000];
    if (fgets(line, sizeof(line), stdin)) {{
        char *tok = strtok(line, " \\n");
        while (tok) {{
            arr[n++] = atoi(tok);
            tok = strtok(NULL, " \\n");
        }}
    }}
    scanf("%d", &k);
    scanf("%d", &seed);
    {selected_name}(arr, n, k, seed, result);
    int out_size = k;
    if (out_size > n) out_size = n;
    if (out_size < 0) out_size = 0;
    for (int i = 0; i < out_size; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif (
    scalar_and_array_input
    and scalar_expected
    and param_count == 2
    and len(param_parts) == 2
    and not is_pointer_like(param_parts[0])
    and '[' in param_parts[1]
    and ']' in param_parts[1]
    and not returns_void
):
    harness += f'''
int main() {{
    int n;
    int matrix[20][20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {{
        for (int j = 0; j < n; j++) {{
            scanf("%d", &matrix[i][j]);
        }}
    }}
    printf("%lld\\n", (long long){selected_name}(n, matrix));
    return 0;
}}
'''
elif (
    scalar_and_array_input
    and scalar_expected
    and param_count == 2
    and not returns_void
):
    harness += f'''
int main() {{
    int count;
    int arr[10000];
    int arr_len = 0;
    scanf("%d", &count);
    while (scanf("%d", &arr[arr_len]) == 1) {{
        arr_len++;
    }}
    printf("%lld\\n", (long long){selected_name}(count, arr));
    return 0;
}}
'''
elif (
    scalar_and_array_input
    and isinstance(sample_expected, list)
    and param_count == 3
    and returns_void
    and len(param_parts) == 3
    and not is_pointer_like(param_parts[0])
    and is_pointer_like(param_parts[1])
    and is_pointer_like(param_parts[2])
):
    harness += f'''
int main() {{
    int count;
    int arr[10000];
    int result[10000];
    int arr_len = 0;
    scanf("%d", &count);
    while (scanf("%d", &arr[arr_len]) == 1) {{
        arr_len++;
    }}
    {selected_name}(count, arr, result);
    for (int i = 0; i < arr_len; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif (
    isinstance(sample_expected, list)
    and len(sample_inputs) > 1
    and any(isinstance(value, list) for value in sample_inputs)
    and param_count == 3
    and returns_pointer
):
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    int out_size = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    int *result = {selected_name}(arr, n, &out_size);
    for (int i = 0; i < out_size; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif single_array_input and scalar_expected and param_count == 2 and not returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    printf("%lld\\n", (long long){selected_name}(arr, n));
    return 0;
}}
'''
elif single_array_input and scalar_expected and param_count == 1 and not returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    printf("%lld\\n", (long long){selected_name}(arr));
    return 0;
}}
'''
elif single_scalar_input and string_expected and param_count == 2 and returns_void:
    harness += f'''
int main() {{
    long long x;
    char result[10000];
    scanf("%lld", &x);
    {selected_name}(x, result);
    printf("%s\\n", result);
    return 0;
}}
'''
elif single_scalar_input and isinstance(sample_expected, list) and param_count == 2 and returns_pointer:
    harness += f'''
int main() {{
    int x;
    int out_size = 0;
    scanf("%d", &x);
    int *result = {selected_name}(x, &out_size);
    for (int i = 0; i < out_size; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif single_scalar_input and scalar_expected and param_count == 1 and not returns_char_pointer:
    harness += f'''
int main() {{
    long long x;
    scanf("%lld", &x);
    printf("%lld\\n", (long long){selected_name}(x));
    return 0;
}}
'''
elif two_scalar_inputs and scalar_expected and param_count == 2:
    harness += f'''
int main() {{
    int a;
    int b;
    scanf("%d", &a);
    scanf("%d", &b);
    printf("%lld\\n", (long long){selected_name}(a, b));
    return 0;
}}
'''
elif two_scalar_inputs and isinstance(sample_expected, list) and param_count == 2 and returns_char_pointer:
    harness += f'''
int main() {{
    int a;
    int b;
    scanf("%d", &a);
    scanf("%d", &b);
    char *result = {selected_name}(a, b);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif (
    two_scalar_inputs
    and isinstance(sample_expected, list)
    and param_count == 2
    and len(param_parts) == 2
    and is_pointer_like(param_parts[0])
    and is_pointer_like(param_parts[1])
):
    harness += f'''
int main() {{
    int a;
    int b;
    scanf("%d", &a);
    scanf("%d", &b);
    {selected_name}(&a, &b);
    printf("%d %d\\n", a, b);
    return 0;
}}
'''
elif (
    two_scalar_inputs
    and isinstance(sample_expected, list)
    and param_count == 3
    and len(param_parts) == 3
    and is_pointer_like(param_parts[2])
):
    output_count = len(sample_expected)
    harness += f'''
int main() {{
    int a;
    int b;
    int result[100];
    scanf("%d", &a);
    scanf("%d", &b);
    {selected_name}(a, b, result);
    for (int i = 0; i < {output_count}; i++) {{
        if (i > 0) printf(" ");
        printf("%d", result[i]);
    }}
    printf("\\n");
    return 0;
}}
'''
elif (
    scalar_expected
    and len(sample_inputs) > 1
    and any(isinstance(value, list) for value in sample_inputs)
    and param_count == 2
    and not returns_void
):
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    printf("%lld\\n", (long long){selected_name}(arr, n));
    return 0;
}}
'''
elif (
    isinstance(sample_expected, list)
    and len(sample_inputs) > 1
    and any(isinstance(value, list) for value in sample_inputs)
    and param_count == 2
    and returns_char_pointer
):
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    char *result = {selected_name}(arr, n);
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif scalar_expected and not returns_void and all(not isinstance(value, list) and not isinstance(value, dict) for value in sample_inputs) and param_count == len(sample_inputs):
    scalar_vars = [f'v{i}' for i in range(len(sample_inputs))]
    declarations = '\n    '.join(f'long long {name};' for name in scalar_vars)
    scans = '\n    '.join(f'scanf(\"%lld\", &{name});' for name in scalar_vars)
    call_args = ', '.join(scalar_vars)
    harness += f'''
int main() {{
    {declarations}
    {scans}
    printf("%lld\\n", (long long){selected_name}({call_args}));
    return 0;
}}
'''
elif string_expected and returns_char_pointer and all(not isinstance(value, list) and not isinstance(value, dict) for value in sample_inputs) and param_count == len(sample_inputs):
    scalar_vars = [f'v{i}' for i in range(len(sample_inputs))]
    declarations = '\n    '.join(f'int {name};' for name in scalar_vars)
    scans = '\n    '.join(f'scanf(\"%d\", &{name});' for name in scalar_vars)
    call_args = ', '.join(scalar_vars)
    harness += f'''
int main() {{
    {declarations}
    {scans}
    char *result = {selected_name}({call_args});
    printf("%s\\n", result ? result : "");
    return 0;
}}
'''
elif many_scalar_inputs and scalar_expected and param_count == 2 and not returns_void:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    printf("%lld\\n", (long long){selected_name}(arr, n));
    return 0;
}}
'''
else:
    harness += f'''
int main() {{
    int arr[10000];
    int n = 0;
    while (scanf("%d", &arr[n]) == 1) {{
        n++;
    }}
    {selected_name}(arr, n);
    for (int i = 0; i < n; i++) {{
        if (i > 0) printf(" ");
        printf("%d", arr[i]);
    }}
    printf("\\n");
    return 0;
}}
'''

with open(harness_file, 'w') as f:
    f.write(harness)
PY
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to generate test harness"
        return
    }

    # Compile (cached by generated harness content). Include headers in the hash because the inlined
    # source may still include them.
    local source_hash
    local cached_binary
    source_hash=$(compute_files_hash "$harness_file" $(find "$c_dir" -name "*.h" 2>/dev/null | sort)) || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to hash generated C sources"
        return
    }
    cached_binary="$CACHE_DIR/$source_hash.bin"
    binary_file="$cached_binary"

    if [ ! -f "$cached_binary" ]; then
        local temp_binary="$CACHE_DIR/$source_hash.$$.tmp.bin"
        if ! gcc -std=c11 -o "$temp_binary" "$harness_file" -I"$c_dir" -lm 2>"$TEMP_DIR/compile_err.txt"; then
            FAILED=$((FAILED + 1))
            local compile_err
            compile_err=$(cat "$TEMP_DIR/compile_err.txt" | head -5)
            rm -f "$temp_binary"
            ERRORS="$ERRORS\n  x $algo_name: Compilation failed: $compile_err"
            return
        fi
        mv "$temp_binary" "$cached_binary" 2>/dev/null || rm -f "$temp_binary"
        binary_file="$cached_binary"
    fi

    # Run each test case
    local i=0
    while [ "$i" -lt "$num_cases" ]; do
        local case_name input_str expected_str
        case_name=$(echo "$test_data" | python3 -c "import json,sys; print(json.loads(sys.stdin.read())['test_cases'][$i]['name'])")
        input_str=$(echo "$test_data" | python3 -c "
import json, sys
data = json.loads(sys.stdin.read())
tc = data['test_cases'][$i]
inp = tc['input']
names = data['function_signature']['input']

if isinstance(names, str):
    if isinstance(inp, dict):
        names = list(inp.keys())
    else:
        names = [names]

def expects_collection(name):
    if not isinstance(name, str):
        return False
    tokens = ('array', 'list', 'matrix', 'grid', 'board', 'stream', 'adjacency', 'points', 'values')
    return any(token in name for token in tokens)

if isinstance(inp, dict):
    values = [inp.get(name) for name in names]
elif len(names) == 1:
    if expects_collection(names[0]):
        if isinstance(inp, list) and len(inp) == 1 and isinstance(inp[0], (list, dict, str)):
            values = inp
        else:
            values = [inp]
    else:
        if isinstance(inp, list) and len(inp) == 1:
            values = [inp[0]]
        else:
            values = [inp]
else:
    values = inp

def serialize(name, value):
    def flatten_list(items):
        flat = []
        for item in items:
            if isinstance(item, list):
                flat.extend(flatten_list(item))
            else:
                flat.append(item)
        return flat

    def scalar_token(item):
        if item is None:
            return '-1'
        if item is True:
            return '1'
        if item is False:
            return '0'
        if isinstance(item, float) and item == float('inf'):
            return '1000000000'
        if isinstance(item, float) and item == float('-inf'):
            return '-1000000000'
        if item == 'Infinity':
            return '1000000000'
        if item == '-Infinity':
            return '-1000000000'
        return str(item)

    if isinstance(value, dict):
        numeric_keys = sorted(int(k) for k in value.keys())
        if name == 'adjacency_list':
            edges = []
            for key in numeric_keys:
                neighbors = value.get(str(key), value.get(key, []))
                for neighbor in neighbors:
                    edges.extend([key, neighbor])
            return ' '.join(str(x) for x in ([len(numeric_keys), len(edges) // 2] + edges))
        if name == 'weighted_adjacency_list':
            edges = []
            for key in numeric_keys:
                neighbors = value.get(str(key), value.get(key, []))
                for neighbor in neighbors:
                    edges.extend([key, neighbor[0], neighbor[1]])
            return ' '.join(str(x) for x in ([len(numeric_keys), len(edges) // 3] + edges))
        if 'heuristic' in name:
            return ' '.join(str(value.get(str(key), value.get(key, 0))) for key in numeric_keys)
        return json.dumps(value, sort_keys=True)
    if isinstance(value, list):
        if name in {'set_a', 'set_b'}:
            return ' '.join([str(len(value))] + [scalar_token(x) for x in value])
        if name == 'edges_list' and all(isinstance(item, list) for item in value):
            encoded = []
            for item in value:
                encoded.extend(item)
            return ' '.join(str(x) for x in ([len(value)] + encoded))
        if value and all(isinstance(item, dict) for item in value):
            encoded = []
            for item in value:
                keys = set(item.keys())
                if {'type', 'a', 'b'} <= keys:
                    encoded.extend([
                        1 if item['type'] == 'union' else 2,
                        item['a'],
                        item['b'],
                    ])
                elif {'type', 'index'} <= keys:
                    if item['type'] == 'update':
                        encoded.extend([1, item['index'], item.get('value', 0)])
                    else:
                        encoded.extend([2, item['index'], 0])
                elif 'type' in keys and ({'left', 'right'} <= keys or {'index', 'value'} <= keys):
                    if item['type'] == 'update':
                        encoded.extend([1, item['index'], item['value']])
                    else:
                        encoded.extend([2, item['left'], item['right']])
                elif {'type', 'u', 'v'} <= keys:
                    encoded.extend([
                        1 if item['type'] == 'sum' else 2,
                        item['u'],
                        item['v'],
                    ])
                else:
                    return json.dumps(value, sort_keys=True)
            return ' '.join(str(x) for x in encoded)
        return ' '.join(scalar_token(x) for x in flatten_list(value))
    if value is None:
        return '-1'
    if value is True:
        return '1'
    if value is False:
        return '0'
    return str(value)

parts = []
for idx, value in enumerate(values):
    name = names[idx] if idx < len(names) else ''
    if (
        name == 'array'
        and 'queries' in names
        and 'n' not in names
        and isinstance(value, list)
        and all(not isinstance(item, (list, dict)) for item in value)
    ):
        parts.append(' '.join([str(len(value))] + [str(item) for item in value]))
    else:
        parts.append(serialize(name, value))
print('\n'.join(parts))
")
        expected_str=$(echo "$test_data" | python3 -c "
import json, math, sys
data = json.loads(sys.stdin.read())
tc = data['test_cases'][$i]
output = data['function_signature']['output']
val = tc['expected']

def atom(x):
    if isinstance(x, bool):
        return '1' if x else '0'
    if isinstance(x, float) and math.isinf(x):
        return 'Infinity' if x > 0 else '-Infinity'
    if x == 'Infinity' or x == '-Infinity':
        return x
    return str(x)

if output == 'modified_grid' or output == 'shortest_distance_matrix':
    print(' '.join(atom(item) for row in val for item in row))
elif output == 'assignment_and_cost':
    assignment = val.get('assignment', [])
    total_cost = val.get('total_cost', 0)
    print(' '.join([str(x) for x in assignment] + [str(total_cost)]))
elif output == 'all_pairs_shortest_distances':
    if isinstance(val, str):
        print(val)
    else:
        rows = []
        for outer_key in sorted(val.keys(), key=lambda k: int(k)):
            row = val[outer_key]
            for inner_key in sorted(row.keys(), key=lambda k: int(k)):
                rows.append(atom(row[inner_key]))
        print(' '.join(rows))
elif output == 'longest_distances_dict':
    print(' '.join(atom(val[key]) for key in sorted(val.keys(), key=lambda k: int(k))))
elif output == 'list_of_matches':
    print(' '.join(f'{match[0]}:{match[1]}' for match in val))
elif output == 'array_of_tokens':
    print(' '.join(str(x) for x in val))
elif isinstance(val, list):
    print(' '.join('1' if x is True else '0' if x is False else str(x) for x in val))
elif isinstance(val, bool):
    print(1 if val else 0)
else:
    print(val)
")

        local actual
        actual=$(echo "$input_str" | "$binary_file" 2>/dev/null) || {
            FAILED=$((FAILED + 1))
            ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error"
            i=$((i + 1))
            continue
        }

        actual=$(echo "$actual" | tr '\n\r\t' '   ' | tr -s ' ' | sed 's/^ *//;s/ *$//')
        expected_str=$(echo "$expected_str" | tr '\n\r\t' '   ' | tr -s ' ' | sed 's/^ *//;s/ *$//')

        if [ "$actual" = "$expected_str" ]; then
            PASSED=$((PASSED + 1))
            log_pass "[PASS] $algo_name - $case_name"
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
echo "C Test Results"
echo "============================================================"
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED (no C implementation)"
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
