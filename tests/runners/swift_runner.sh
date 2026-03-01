#!/bin/sh
# Swift Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs Swift implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/swift_runner.sh                              # Run all algorithms
#   ./tests/runners/swift_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: swiftc (Swift compiler), python3 (for YAML parsing)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$(basename "$0")"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ALGORITHMS_DIR="$REPO_ROOT/algorithms"
CACHE_DIR="$REPO_ROOT/.cache/swift-runner"
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

# Check if swiftc is available
if ! command -v swiftc >/dev/null 2>&1; then
    echo "WARNING: swiftc not found. Install Swift to run Swift tests."
    echo "Skipping all Swift tests."
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
    if [ -n "$SWIFT_RUNNER_JOBS" ]; then
        echo "$SWIFT_RUNNER_JOBS"
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
            sh "$SCRIPT_PATH" "$algo_rel"
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
        child_skipped=$(sed -n 's/^  Skipped: //p' "$child_log" | sed 's/ (no Swift implementation).*//' | tail -n 1)

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
    local swift_dir="$algo_dir/swift"

    if [ ! -f "$cases_file" ]; then
        return
    fi

    local algo_name
    algo_name="$(basename "$(dirname "$algo_dir")")/$(basename "$algo_dir")"

    if [ ! -d "$swift_dir" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No Swift implementation found"
        return
    fi

    # Find Swift source files
    local swift_files
    swift_files=$(find "$swift_dir" -name "*.swift" 2>/dev/null | head -1)
    if [ -z "$swift_files" ]; then
        SKIPPED=$((SKIPPED + 1))
        echo "[SKIP] $algo_name: No .swift files found"
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
    local harness_file="$TEMP_DIR/test_harness_${algo_name##*/}.swift"
    local binary_file="$TEMP_DIR/test_binary_${algo_name##*/}"

    printf '%s' "$test_data" | python3 -c "
import json, re, sys

data = json.loads(sys.stdin.read())
func_name = data['function_signature']['name']
inputs = data['function_signature']['input']
output = data['function_signature']['output']
sample_case = data['test_cases'][0] if data.get('test_cases') else {'input': [], 'expected': None}
raw_sample_inputs = sample_case.get('input', [])
if isinstance(inputs, list):
    pass
elif isinstance(raw_sample_inputs, dict):
    inputs = list(raw_sample_inputs.keys())
elif inputs is None:
    inputs = []
else:
    inputs = [inputs]
if isinstance(raw_sample_inputs, list):
    sample_inputs = raw_sample_inputs
elif isinstance(raw_sample_inputs, dict):
    sample_inputs = [raw_sample_inputs[key] for key in inputs if key in raw_sample_inputs]
else:
    sample_inputs = []
sample_expected = sample_case.get('expected')
sample_expected_is_nested_list = isinstance(sample_expected, list) and any(isinstance(item, list) for item in sample_expected)

# Read the original Swift source
with open('$swift_files') as f:
    source = f.read()

# Convert snake_case to camelCase for Swift
def snake_to_camel(name):
    parts = name.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])

def normalize_name(name):
    return ''.join(ch for ch in name.lower() if ch.isalnum())

def strip_modifiers(text):
    modifiers = [
        'public', 'private', 'internal', 'fileprivate', 'open',
        'final', 'indirect', 'override', 'required', 'convenience',
        'mutating', 'nonmutating'
    ]
    value = text.strip()
    changed = True
    while changed:
        changed = False
        for modifier in modifiers:
            prefix = modifier + ' '
            if value.startswith(prefix):
                value = value[len(prefix):].lstrip()
                changed = True
                break
    return value

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

def parse_param_specs(param_blob):
    if not param_blob.strip():
        return []

    result = []
    for part in split_top_level(param_blob):
        segment = part.split('=', 1)[0].strip()
        if ':' not in segment:
            continue
        names_blob, type_blob = segment.split(':', 1)
        name_tokens = names_blob.strip().split()
        external = '_'
        if len(name_tokens) == 1:
            external = name_tokens[0]
        elif len(name_tokens) >= 2:
            external = name_tokens[0]
        result.append({'external': external, 'type': type_blob.strip()})
    return result

def format_call_arg(spec, expr):
    if spec and spec.get('external') and spec['external'] != '_':
        return f\"{spec['external']}: {expr}\"
    return expr

def trim_trailing_demo(swift_source):
    lines = swift_source.split('\n')
    scope_stack = []
    last_keep = -1

    for idx, raw_line in enumerate(lines):
        line = raw_line.split('//', 1)[0]
        stripped = line.strip()
        decl = strip_modifiers(stripped)
        in_decl_scope = bool(scope_stack) and scope_stack[-1]

        is_decl_line = False
        if (not scope_stack) and stripped.startswith('@'):
            is_decl_line = True
        elif (not scope_stack) and (
            decl.startswith('import ')
            or decl.startswith('func ')
            or decl.startswith('class ')
            or decl.startswith('struct ')
            or decl.startswith('enum ')
            or decl.startswith('actor ')
            or decl.startswith('protocol ')
            or decl.startswith('extension ')
            or decl.startswith('typealias ')
            or decl.startswith('precedencegroup ')
            or decl.startswith('infix operator ')
            or decl.startswith('prefix operator ')
            or decl.startswith('postfix operator ')
        ):
            is_decl_line = True

        if in_decl_scope or is_decl_line:
            last_keep = idx

        open_count = raw_line.count('{')
        close_count = raw_line.count('}')
        for _ in range(open_count):
            scope_stack.append(in_decl_scope or is_decl_line)
        for _ in range(close_count):
            if scope_stack:
                scope_stack.pop()

    if last_keep >= 0:
        return '\n'.join(lines[:last_keep + 1]).rstrip()
    return swift_source

def discover_callables(swift_source):
    top_level = []
    owned = []
    scope_stack = []
    brace_depth = 0

    def extract_func_signature(text):
        marker = text.find('func ')
        if marker == -1:
            return None
        prefix = text[:marker]
        rest = text[marker + 5:]
        name_match = re.match(r'([A-Za-z_][A-Za-z0-9_]*)', rest)
        if not name_match:
            return None
        fn_name = name_match.group(1)
        rest = rest[name_match.end():]
        paren_start = rest.find('(')
        if paren_start == -1:
            return None

        depth = 0
        params = []
        started = False
        for ch in rest[paren_start:]:
            if ch == '(':
                if started:
                    depth += 1
                    params.append(ch)
                else:
                    started = True
                continue
            if ch == ')':
                if depth == 0:
                    break
                depth -= 1
                params.append(ch)
                continue
            if started:
                params.append(ch)

        is_static = ('static ' in prefix) or ('class ' in prefix)
        return fn_name, ''.join(params), is_static

    for raw_line in swift_source.splitlines():
        line = raw_line.split('//', 1)[0]
        stripped = line.strip()
        decl = strip_modifiers(stripped)

        pending_owner = None
        owner_match = re.match(r'(?:class|struct|enum|actor)\s+([A-Za-z_][A-Za-z0-9_]*)', decl)
        open_count = line.count('{')
        close_count = line.count('}')
        if owner_match and open_count > close_count:
            pending_owner = (owner_match.group(1), brace_depth + open_count - close_count)

        fn_signature = extract_func_signature(decl)
        if fn_signature and fn_signature[0] != 'main':
            fn_name, param_blob, is_static = fn_signature
            if scope_stack:
                owner_name, _ = scope_stack[-1]
                owned.append((owner_name, fn_name, param_blob, is_static))
            else:
                top_level.append((fn_name, param_blob))

        brace_depth += open_count - close_count
        if pending_owner is not None:
            scope_stack.append(pending_owner)
        while scope_stack and brace_depth < scope_stack[-1][1]:
            scope_stack.pop()

    return top_level, owned

source = trim_trailing_demo(source)
swift_func_name = snake_to_camel(func_name)
top_level_functions, owned_functions = discover_callables(source)

preferred_names = [swift_func_name]
if swift_func_name.endswith('Search'):
    preferred_names.append('search')
    if len(swift_func_name) > len('Search'):
        preferred_names.append(swift_func_name[:-len('Search')])
if swift_func_name.endswith('Sort'):
    preferred_names.append('sort')
    if len(swift_func_name) > len('Sort'):
        preferred_names.append(swift_func_name[:-len('Sort')])
if swift_func_name.endswith('Algorithm') and len(swift_func_name) > len('Algorithm'):
    preferred_names.append(swift_func_name[:-len('Algorithm')])
preferred_names.extend(['sort', 'search', 'solve', 'compute', 'select'])

selected_call_target = swift_func_name
selected_param_specs = []

for preferred in preferred_names:
    for fn_name, param_blob in top_level_functions:
        if fn_name == preferred:
            selected_call_target = fn_name
            selected_param_specs = parse_param_specs(param_blob)
            break
    if selected_param_specs:
        break

if not selected_param_specs:
    for preferred in preferred_names:
        for owner_name, fn_name, param_blob, is_static in owned_functions:
            if fn_name == preferred:
                selected_call_target = f'{owner_name}.{fn_name}' if is_static else f'{owner_name}().{fn_name}'
                selected_param_specs = parse_param_specs(param_blob)
                break
        if selected_param_specs:
            break

if not selected_param_specs:
    normalized_preferred = {normalize_name(name) for name in preferred_names}
    for fn_name, param_blob in top_level_functions:
        if normalize_name(fn_name) in normalized_preferred:
            selected_call_target = fn_name
            selected_param_specs = parse_param_specs(param_blob)
            break

if not selected_param_specs:
    normalized_preferred = {normalize_name(name) for name in preferred_names}
    for owner_name, fn_name, param_blob, is_static in owned_functions:
        if normalize_name(fn_name) in normalized_preferred:
            selected_call_target = f'{owner_name}.{fn_name}' if is_static else f'{owner_name}().{fn_name}'
            selected_param_specs = parse_param_specs(param_blob)
            break

if not selected_param_specs and len(top_level_functions) == 1:
    fn_name, param_blob = top_level_functions[0]
    selected_call_target = fn_name
    selected_param_specs = parse_param_specs(param_blob)

first_spec = selected_param_specs[0] if len(selected_param_specs) > 0 else None
second_spec = selected_param_specs[1] if len(selected_param_specs) > 1 else None
first_is_inout = bool(first_spec and 'inout' in first_spec['type'])

single_array_decl = (
    'var __codexArr = __codexLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }'
    if first_is_inout else
    'let __codexArr = __codexLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }'
)
single_array_arg = format_call_arg(first_spec, '&__codexArr' if first_is_inout else '__codexArr')
single_array_call = f'let __codexResult = {selected_call_target}({single_array_arg})'

array_target_call = (
    f'let __codexResult = {selected_call_target}('
    + format_call_arg(first_spec, '__codexArr')
    + ', '
    + format_call_arg(second_spec, '__codexTarget')
    + ')'
)
single_scalar_call = f'let __codexResult = {selected_call_target}({format_call_arg(first_spec, \"__codexX\")})'
double_scalar_call = (
    f'let __codexResult = {selected_call_target}('
    + format_call_arg(first_spec, '__codexA')
    + ', '
    + format_call_arg(second_spec, '__codexB')
    + ')'
)

def normalized_type(spec):
    if not spec:
        return ''
    return spec['type'].replace(' ', '').replace('inout', '')

def infer_shape(value):
    if isinstance(value, dict):
        values = list(value.values())
        if not values:
            return 'scalar_map'
        if all(isinstance(item, list) and all(isinstance(part, list) for part in item) for item in values):
            return 'weighted_adj_map'
        if all(isinstance(item, list) and not any(isinstance(part, (list, dict)) for part in item) for item in values):
            return 'adj_map'
        if all(not isinstance(item, (list, dict)) for item in values):
            return 'scalar_map'
        return 'unsupported'
    if isinstance(value, list):
        if not value:
            return 'array'
        if all(isinstance(item, list) for item in value):
            return 'matrix'
        if any(isinstance(item, (list, dict)) for item in value):
            return 'unsupported'
        return 'array'
    return 'scalar'

def scalar_parse_expr(spec, value, line_var):
    spec_lower = normalized_type(spec).lower()
    trimmed = f'{line_var}.trimmingCharacters(in: .whitespaces)'
    if 'string' in spec_lower or isinstance(value, str):
        return line_var
    if 'bool' in spec_lower or isinstance(value, bool):
        return f'({trimmed} == \"true\")'
    if 'double' in spec_lower or isinstance(value, float):
        return f'(Double({trimmed}) ?? 0)'
    return f'(Int({trimmed}) ?? 0)'

def array_parse_expr(spec, value, line_var):
    spec_lower = normalized_type(spec).lower()
    trimmed = f'{line_var}.trimmingCharacters(in: .whitespaces)'
    if 'string' in spec_lower or any(isinstance(item, str) for item in value):
        return f'({trimmed}.isEmpty ? [String]() : {trimmed}.split(separator: \" \").map {{ String(\$0) }})'
    if 'double' in spec_lower or any(isinstance(item, float) for item in value):
        return f'({trimmed}.isEmpty ? [Double]() : {trimmed}.split(separator: \" \").compactMap {{ Double(\$0) }})'
    return f'({trimmed}.isEmpty ? [Int]() : {trimmed}.split(separator: \" \").compactMap {{ Int(\$0) }})'

def build_reader(index, value, spec):
    shape = infer_shape(value)
    arg_var = f'__codexArg{index}'
    is_inout = bool(spec and 'inout' in spec['type'])
    if shape == 'scalar':
        line_var = f'__codexLine{index}'
        return [
            f'let {line_var} = readLine() ?? \"\"',
            f'let {arg_var} = {scalar_parse_expr(spec, value, line_var)}',
        ], arg_var

    if shape == 'array':
        line_var = f'__codexLine{index}'
        decl_kw = 'var' if is_inout else 'let'
        return [
            f'let {line_var} = readLine() ?? \"\"',
            f'{decl_kw} {arg_var} = {array_parse_expr(spec, value, line_var)}',
        ], ('&' + arg_var) if is_inout else arg_var

    if shape == 'matrix':
        count_var = f'__codexRowCount{index}'
        rows_var = f'__codexRows{index}'
        row_line_var = f'__codexRowLine{index}'
        row_var = f'__codexRow{index}'
        spec_lower = normalized_type(spec).lower()
        if 'double' in spec_lower:
            rows_decl = f'var {rows_var}: [[Double]] = []'
            row_parse_expr = (
                f'({row_line_var}.trimmingCharacters(in: .whitespaces).isEmpty ? [Double]() : '
                f'{row_line_var}.trimmingCharacters(in: .whitespaces).split(separator: \" \").map {{ __codexToken in '
                f'let __codexText = String(__codexToken); '
                f'if __codexText == \"Infinity\" {{ return Double.infinity }}; '
                f'if __codexText == \"-Infinity\" {{ return -Double.infinity }}; '
                f'return Double(__codexText) ?? 0 }}'
                f')'
            )
        else:
            rows_decl = f'var {rows_var}: [[Int]] = []'
            row_parse_expr = f'({row_line_var}.trimmingCharacters(in: .whitespaces).isEmpty ? [Int]() : {row_line_var}.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap {{ Int(\$0) }})'
        lines = [
            f'let {count_var} = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0',
            rows_decl,
            f'for _ in 0..<{count_var} {{',
            f'    let {row_line_var} = readLine() ?? \"\"',
            f'    let {row_var} = {row_parse_expr}',
            f'    {rows_var}.append({row_var})',
            '}',
        ]
        if spec_lower in ('[(int,int)]', 'array<(int,int)>'):
            lines.append(f'let {arg_var} = {rows_var}.map {{ ((\$0.count > 0 ? \$0[0] : 0), (\$0.count > 1 ? \$0[1] : 0)) }}')
        else:
            lines.append(f'let {arg_var} = {rows_var}')
        return lines, arg_var

    if shape == 'adj_map':
        count_var = f'__codexEntryCount{index}'
        line_var = f'__codexEntryLine{index}'
        parts_var = f'__codexEntryParts{index}'
        map_var = f'__codexMap{index}'
        spec_lower = normalized_type(spec).lower()
        lines = [
            f'let {count_var} = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0',
            f'var {map_var}: [Int: [Int]] = [:]',
            f'for _ in 0..<{count_var} {{',
            f'    let {line_var} = readLine() ?? \"\"',
            f'    let {parts_var} = {line_var}.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap {{ Int(\$0) }}',
            f'    if let __codexKey = {parts_var}.first {{',
            f'        {map_var}[__codexKey] = Array({parts_var}.dropFirst())',
            '    }',
            '}',
        ]
        if spec_lower in ('[[int]]', 'array<[int]>', 'array<array<int>>'):
            lines.extend([
                f'let __codexMaxKey{index} = {map_var}.keys.max() ?? -1',
                f'let {arg_var} = (__codexMaxKey{index} < 0) ? [[Int]]() : (0...__codexMaxKey{index}).map {{ {map_var}[\$0] ?? [] }}',
            ])
        else:
            lines.append(f'let {arg_var} = {map_var}')
        return lines, arg_var

    if shape == 'weighted_adj_map':
        count_var = f'__codexEntryCount{index}'
        line_var = f'__codexEntryLine{index}'
        parts_var = f'__codexEntryParts{index}'
        map_var = f'__codexMap{index}'
        lines = [
            f'let {count_var} = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0',
            f'var {map_var}: [Int: [[Int]]] = [:]',
            f'for _ in 0..<{count_var} {{',
            f'    let {line_var} = readLine() ?? \"\"',
            f'    let {parts_var} = {line_var}.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap {{ Int(\$0) }}',
            f'    if let __codexKey = {parts_var}.first {{',
            f'        var __codexEdges: [[Int]] = []',
            f'        var __codexIndex = 1',
            f'        while __codexIndex + 1 < {parts_var}.count {{',
            f'            __codexEdges.append([{parts_var}[__codexIndex], {parts_var}[__codexIndex + 1]])',
            f'            __codexIndex += 2',
            f'        }}',
            f'        {map_var}[__codexKey] = __codexEdges',
            '    }',
            '}',
            f'let {arg_var} = {map_var}',
        ]
        return lines, arg_var

    if shape == 'scalar_map':
        count_var = f'__codexEntryCount{index}'
        line_var = f'__codexEntryLine{index}'
        parts_var = f'__codexEntryParts{index}'
        map_var = f'__codexMap{index}'
        spec_lower = normalized_type(spec).lower()
        lines = [
            f'let {count_var} = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0',
            f'var {map_var}: [Int: Int] = [:]',
            f'for _ in 0..<{count_var} {{',
            f'    let {line_var} = readLine() ?? \"\"',
            f'    let {parts_var} = {line_var}.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap {{ Int(\$0) }}',
            f'    if {parts_var}.count >= 2 {{',
            f'        {map_var}[{parts_var}[0]] = {parts_var}[1]',
            '    }',
            '}',
        ]
        if spec_lower in ('[int]', 'array<int>'):
            lines.extend([
                f'let __codexMaxKey{index} = {map_var}.keys.max() ?? -1',
                f'let {arg_var} = (__codexMaxKey{index} < 0) ? [Int]() : (0...__codexMaxKey{index}).map {{ {map_var}[\$0] ?? 0 }}',
            ])
        else:
            lines.append(f'let {arg_var} = {map_var}')
        return lines, arg_var

    return None, None

shape_entries = None
shape_prefix_arg = None
if not selected_param_specs or len(selected_param_specs) == len(sample_inputs):
    shape_entries = [(value, selected_param_specs[idx] if idx < len(selected_param_specs) else None, True) for idx, value in enumerate(sample_inputs)]
elif (
    selected_param_specs
    and len(sample_inputs) == len(selected_param_specs) + 1
    and isinstance(sample_inputs[0], int)
    and len(sample_inputs) > 1
    and isinstance(sample_inputs[1], list)
    and sample_inputs[0] == len(sample_inputs[1])
):
    shape_entries = [(sample_inputs[0], None, False)]
    shape_entries.extend((value, selected_param_specs[idx], True) for idx, value in enumerate(sample_inputs[1:]))
elif (
    selected_param_specs
    and len(selected_param_specs) == len(sample_inputs) + 1
    and sample_inputs
    and normalized_type(selected_param_specs[0]).lower() in ('int', 'int?', 'double', 'double?')
    and infer_shape(sample_inputs[0]) in ('array', 'matrix', 'adj_map', 'scalar_map')
):
    shape_entries = [(value, selected_param_specs[idx + 1], True) for idx, value in enumerate(sample_inputs)]
    shape_prefix_arg = format_call_arg(selected_param_specs[0], '__codexArg0.count')

shape_driven_body = None
if shape_entries and all(infer_shape(value) != 'unsupported' for value, _, _ in shape_entries):
    shape_lines = []
    shape_args = []
    for idx, (value, spec, include_in_call) in enumerate(shape_entries):
        reader_lines, arg_expr = build_reader(idx, value, spec)
        if reader_lines is None:
            shape_lines = []
            shape_args = []
            break
        shape_lines.extend(reader_lines)
        if include_in_call:
            shape_args.append(format_call_arg(spec, arg_expr))
    if shape_args:
        if shape_prefix_arg:
            shape_args.insert(0, shape_prefix_arg)
        shape_lines.append(f'let __codexResult = {selected_call_target}(' + ', '.join(shape_args) + ')')
        if (
            shape_prefix_arg is None
            and len(shape_entries) == 1
            and shape_entries[0][2]
            and shape_entries[0][1]
            and 'inout' in shape_entries[0][1]['type']
            and infer_shape(shape_entries[0][0]) == 'array'
        ):
            shape_lines.append('let __codexOutput = __codexFormatResult(__codexResult)')
            shape_lines.append('print(__codexOutput == \"()\" ? __codexFormatResult(__codexArg0) : __codexOutput)')
        else:
            shape_lines.append('print(__codexFormatResult(__codexResult))')
        shape_driven_body = '\n'.join(shape_lines)

harness = 'import Foundation\n\n'
harness += source + '\n\n'
harness += '''
func __codexFormatResult(_ value: [Int]) -> String {
    value.map { String(\$0) }.joined(separator: \" \")
}

func __codexFormatResult(_ value: [[Int]]) -> String {
    value.flatMap { \$0 }.map { String(\$0) }.joined(separator: \" \")
}

func __codexFormatResult(_ value: [Bool]) -> String {
    value.map { \$0 ? \"true\" : \"false\" }.joined(separator: \" \")
}

func __codexFormatResult(_ value: [String]) -> String {
    value.joined(separator: \" \")
}

func __codexFormatDouble(_ value: Double) -> String {
    if value.isInfinite {
        return value > 0 ? \"Infinity\" : \"-Infinity\"
    }
    if value == value.rounded() {
        return String(Int(value))
    }
    return String(value)
}

func __codexFormatResult(_ value: [Double]) -> String {
    value.map { __codexFormatDouble(\$0) }.joined(separator: \" \")
}

func __codexFormatResult(_ value: [[Double]]) -> String {
    value.flatMap { \$0 }.map { __codexFormatDouble(\$0) }.joined(separator: \" \")
}

func __codexFormatResult(_ value: [Int: Double]) -> String {
    value.keys.sorted().map { __codexFormatDouble(value[\$0] ?? 0) }.joined(separator: \" \")
}

func __codexFormatResult(_ value: [Int: [Int: Double]]) -> String {
    value.keys.sorted().flatMap { __codexOuterKey in
        (value[__codexOuterKey] ?? [:]).keys.sorted().map { __codexInnerKey in
            __codexFormatDouble(value[__codexOuterKey]?[__codexInnerKey] ?? 0)
        }
    }.joined(separator: \" \")
}

func __codexFormatResult(_ value: Int) -> String {
    String(value)
}

func __codexFormatResult(_ value: Bool) -> String {
    value ? \"true\" : \"false\"
}

func __codexFormatResult(_ value: String) -> String {
    value
}

func __codexFormatResult<T>(_ value: T) -> String {
    String(describing: value)
}

'''

# Generate main code
if func_name == 'union_find_operations':
    harness += '''
func runSingleCase() -> String {
    let n = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let opCount = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let uf = UnionFind(n)
    var outputs: [String] = []

    for _ in 0..<opCount {
        let parts = (readLine() ?? \"\").trimmingCharacters(in: .whitespaces).split(separator: \" \")
        if parts.count < 3 {
            continue
        }

        let operation = String(parts[0])
        let a = Int(parts[1]) ?? 0
        let b = Int(parts[2]) ?? 0

        if operation == \"union\" {
            uf.union(a, b)
        } else {
            outputs.append(uf.connected(a, b) ? \"true\" : \"false\")
        }
    }

    return outputs.joined(separator: \" \")
}

print(runSingleCase())
'''
elif func_name == 'fenwick_tree_operations':
    harness += '''
func runSingleCase() -> String {
    let __codexArrayLine = readLine() ?? \"\"
    var __codexArray = __codexArrayLine.trimmingCharacters(in: .whitespaces).isEmpty
        ? [Int]()
        : __codexArrayLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
    let __codexQueryCount = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let __codexTree = FenwickTree(__codexArray)
    var __codexOutputs: [String] = []

    for _ in 0..<__codexQueryCount {
        let __codexParts = (readLine() ?? \"\").trimmingCharacters(in: .whitespaces).split(separator: \" \")
        guard let __codexOp = __codexParts.first else { continue }
        if __codexOp == \"update\", __codexParts.count >= 3 {
            let __codexIndex = Int(__codexParts[1]) ?? 0
            let __codexValue = Int(__codexParts[2]) ?? 0
            if __codexIndex >= 0 && __codexIndex < __codexArray.count {
                let __codexDelta = __codexValue - __codexArray[__codexIndex]
                __codexArray[__codexIndex] = __codexValue
                __codexTree.update(__codexIndex, __codexDelta)
            }
        } else if __codexOp == \"sum\", __codexParts.count >= 2 {
            let __codexIndex = Int(__codexParts[1]) ?? 0
            __codexOutputs.append(String(__codexTree.query(__codexIndex)))
        }
    }

    return __codexOutputs.joined(separator: \" \")
}

print(runSingleCase())
'''
elif func_name == 'segment_tree_operations':
    harness += '''
func runSingleCase() -> String {
    let __codexArrayLine = readLine() ?? \"\"
    let __codexArray = __codexArrayLine.trimmingCharacters(in: .whitespaces).isEmpty
        ? [Int]()
        : __codexArrayLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
    let __codexQueryCount = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let __codexTree = SegmentTree(__codexArray)
    var __codexOutputs: [String] = []

    for _ in 0..<__codexQueryCount {
        let __codexParts = (readLine() ?? \"\").trimmingCharacters(in: .whitespaces).split(separator: \" \")
        guard let __codexOp = __codexParts.first else { continue }
        if __codexOp == \"update\", __codexParts.count >= 3 {
            let __codexIndex = Int(__codexParts[1]) ?? 0
            let __codexValue = Int(__codexParts[2]) ?? 0
            __codexTree.update(__codexIndex, __codexValue)
        } else if __codexOp == \"sum\", __codexParts.count >= 3 {
            let __codexLeft = Int(__codexParts[1]) ?? 0
            let __codexRight = Int(__codexParts[2]) ?? 0
            __codexOutputs.append(String(__codexTree.query(__codexLeft, __codexRight)))
        }
    }

    return __codexOutputs.joined(separator: \" \")
}

print(runSingleCase())
'''
elif func_name == 'hld_path_query':
    harness += '''
func runSingleCase() -> String {
    let __codexN = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let __codexEdgeCount = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    var __codexEdges: [[Int]] = []
    for _ in 0..<__codexEdgeCount {
        let __codexLine = readLine() ?? \"\"
        let __codexEdge = __codexLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
        __codexEdges.append(__codexEdge)
    }
    let __codexValuesLine = readLine() ?? \"\"
    let __codexValues = __codexValuesLine.trimmingCharacters(in: .whitespaces).isEmpty
        ? [Int]()
        : __codexValuesLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
    let __codexQueryCount = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    var __codexQueries: [(String, Int, Int)] = []
    for _ in 0..<__codexQueryCount {
        let __codexParts = (readLine() ?? \"\").trimmingCharacters(in: .whitespaces).split(separator: \" \")
        guard __codexParts.count >= 3 else { continue }
        let __codexType = String(__codexParts[0])
        let __codexU = Int(__codexParts[1]) ?? 0
        let __codexV = Int(__codexParts[2]) ?? 0
        __codexQueries.append((__codexType, __codexU, __codexV))
    }

    let __codexResult = hldPathQuery(__codexN, __codexEdges, __codexValues, __codexQueries)
    return __codexFormatResult(__codexResult)
}

print(runSingleCase())
'''
elif func_name == 'minimax':
    harness += '''
func runSingleCase() -> String {
    let __codexLine = readLine() ?? \"\"
    let __codexScores = __codexLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
    let __codexDepth = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let __codexIsMax = (readLine() ?? \"\").trimmingCharacters(in: .whitespaces) == \"true\"
    let __codexResult = minimax(depth: 0, nodeIndex: 0, isMax: __codexIsMax, scores: __codexScores, h: __codexDepth)
    return String(__codexResult)
}

print(runSingleCase())
'''
elif func_name == 'minimax_ab':
    harness += '''
func runSingleCase() -> String {
    let __codexLine = readLine() ?? \"\"
    let __codexScores = __codexLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
    let __codexDepth = Int((readLine() ?? \"0\").trimmingCharacters(in: .whitespaces)) ?? 0
    let __codexIsMax = (readLine() ?? \"\").trimmingCharacters(in: .whitespaces) == \"true\"
    let __codexResult = minimaxAB(depth: 0, nodeIndex: 0, isMax: __codexIsMax, scores: __codexScores, h: __codexDepth,
                           alpha: Int.min, beta: Int.max)
    return String(__codexResult)
}

print(runSingleCase())
'''
elif shape_driven_body is not None:
    harness += shape_driven_body + '\n'
elif (
    (output == 'array_of_integers' and inputs == ['array_of_integers'])
    or (
        len(sample_inputs) == 1
        and isinstance(sample_inputs[0], list)
        and isinstance(sample_expected, list)
    )
):
    harness += '''
let __codexLine = readLine() ?? \"\"
''' + single_array_decl + '''
''' + single_array_call + '''
''' + (
'''print(__codexResult.flatMap { \$0 }.map { String(\$0) }.joined(separator: \" \"))'''
if sample_expected_is_nested_list else
'''print(__codexResult.map { String(\$0) }.joined(separator: \" \"))'''
) + '''
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
let __codexLine = readLine() ?? \"\"
let __codexArr = __codexLine.trimmingCharacters(in: .whitespaces).split(separator: \" \").compactMap { Int(\$0) }
let __codexTargetLine = readLine() ?? \"0\"
let __codexTarget = Int(__codexTargetLine.trimmingCharacters(in: .whitespaces))!
''' + array_target_call + '''
print(__codexResult)
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
let __codexLine = readLine() ?? \"0\"
let __codexX = Int(__codexLine.trimmingCharacters(in: .whitespaces))!
''' + single_scalar_call + '''
print(__codexResult)
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
let __codexLine1 = readLine() ?? \"0\"
let __codexLine2 = readLine() ?? \"0\"
let __codexA = Int(__codexLine1.trimmingCharacters(in: .whitespaces))!
let __codexB = Int(__codexLine2.trimmingCharacters(in: .whitespaces))!
''' + double_scalar_call + '''
print(__codexResult)
'''
else:
    harness += '''
let __codexLine = readLine() ?? \"\"
''' + single_array_decl + '''
''' + single_array_call + '''
print(__codexResult)
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
    local cached_binary
    harness_hash=$(compute_hash "$harness_file") || {
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to hash generated harness"
        return
    }
    cached_binary="$CACHE_DIR/$harness_hash.bin"
    binary_file="$cached_binary"

    if [ ! -f "$cached_binary" ]; then
        local temp_binary="$CACHE_DIR/$harness_hash.$$.tmp.bin"
        local module_cache_dir="$CACHE_DIR/module-cache"
        mkdir -p "$module_cache_dir"
        if ! swiftc -module-cache-path "$module_cache_dir" -o "$temp_binary" "$harness_file" 2>"$TEMP_DIR/compile_err.txt"; then
            FAILED=$((FAILED + 1))
            local compile_err
            compile_err=$(cat "$TEMP_DIR/compile_err.txt" | head -5)
            rm -f "$temp_binary"
            ERRORS="$ERRORS\n  x $algo_name: Compilation failed: $compile_err"
            return
        fi
        mv "$temp_binary" "$cached_binary" 2>/dev/null || rm -f "$temp_binary"
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
signature = data.get('function_signature', {}).get('input', [])
inp = tc['input']
sample_input = (data.get('test_cases') or [{}])[0].get('input', [])

def format_scalar(value):
    if isinstance(value, bool):
        return 'true' if value else 'false'
    return str(value)

def format_sequence(values):
    return ' '.join(format_scalar(value) for value in values)

def is_matrix_value(value, sample_value):
    if not isinstance(value, list):
        return False
    if value and all(isinstance(item, list) for item in value):
        return True
    if value:
        return False
    return isinstance(sample_value, list) and any(isinstance(item, list) for item in sample_value)

def is_object_list(value, sample_value):
    if isinstance(value, list) and value and all(isinstance(item, dict) for item in value):
        return True
    return (
        isinstance(value, list)
        and not value
        and isinstance(sample_value, list)
        and any(isinstance(item, dict) for item in sample_value)
    )

def is_adjacency_map(value, sample_value):
    if not isinstance(value, dict):
        return False
    entries = list(value.values())
    if entries and all(isinstance(item, list) and not any(isinstance(part, (list, dict)) for part in item) for item in entries):
        return True
    if entries:
        return False
    return (
        isinstance(sample_value, dict)
        and any(isinstance(item, list) for item in sample_value.values())
    )

def is_weighted_adjacency_map(value, sample_value):
    if not isinstance(value, dict):
        return False
    entries = list(value.values())
    if entries and all(isinstance(item, list) and all(isinstance(part, list) for part in item) for item in entries):
        return True
    if entries:
        return False
    return (
        isinstance(sample_value, dict)
        and any(isinstance(item, list) and any(isinstance(part, list) for part in item) for item in sample_value.values())
    )

def sort_key(raw_key):
    text = str(raw_key)
    stripped = text.lstrip('-')
    if stripped.isdigit():
        return (0, int(text))
    return (1, text)

def append_value(value, sample_value=None):
    if isinstance(value, dict):
        ordered_keys = sorted(value.keys(), key=sort_key)
        parts.append(str(len(ordered_keys)))
        if is_weighted_adjacency_map(value, sample_value):
            for key in ordered_keys:
                row = value[key]
                flattened = [format_scalar(key)]
                for edge in row:
                    flattened.extend(format_scalar(item) for item in edge)
                parts.append(' '.join(flattened))
        elif is_adjacency_map(value, sample_value):
            for key in ordered_keys:
                row = value[key]
                parts.append(' '.join([format_scalar(key)] + [format_scalar(item) for item in row]))
        else:
            for key in ordered_keys:
                parts.append(f'{format_scalar(key)} {format_scalar(value[key])}')
    elif isinstance(value, list):
        if is_object_list(value, sample_value):
            parts.append(str(len(value)))
            for entry in value:
                parts.append(' '.join(format_scalar(item) for item in entry.values()))
        elif is_matrix_value(value, sample_value):
            parts.append(str(len(value)))
            for row in value:
                parts.append(format_sequence(row))
        else:
            parts.append(format_sequence(value))
    else:
        parts.append(format_scalar(value))

parts = []

if isinstance(inp, dict):
    if isinstance(signature, list):
        ordered_keys = signature if signature else list(inp.keys())
    else:
        ordered_keys = list(inp.keys())
    for key in ordered_keys:
        if key not in inp:
            continue

        value = inp[key]
        sample_value = sample_input.get(key) if isinstance(sample_input, dict) else None
        if key == 'operations' and is_object_list(value, sample_value):
            parts.append(str(len(value)))
            for entry in value:
                parts.append(' '.join(format_scalar(entry.get(field, '')) for field in ['type', 'a', 'b']))
        else:
            append_value(value, sample_value)
elif isinstance(inp, list):
    if (
        isinstance(signature, list)
        and len(signature) == 1
        and not any(isinstance(value, (list, dict)) for value in inp)
        and any(token in str(signature[0]).lower() for token in ['array', 'list', 'matrix', 'graph', 'adjacency', 'distance', 'cost'])
    ):
        parts.append(format_sequence(inp))
    else:
        sample_items = sample_input if isinstance(sample_input, list) else []
        for idx, value in enumerate(inp):
            append_value(value, sample_items[idx] if idx < len(sample_items) else None)
else:
    append_value(inp, sample_input)

print('\n'.join(parts))
")
        expected_str=$(echo "$test_data" | python3 -c "
import json, sys

def format_value(value):
    if isinstance(value, dict):
        if set(value.keys()) == {'assignment', 'total_cost'}:
            return f\"({value.get('assignment', [])}, {format_value(value.get('total_cost'))})\"
        return ' '.join(format_value(value[key]) for key in sorted(value.keys()))
    if isinstance(value, list):
        return ' '.join(format_value(item) for item in value)
    if isinstance(value, bool):
        return 'true' if value else 'false'
    return str(value)

tc = json.loads(sys.stdin.read())['test_cases'][$i]
print(format_value(tc['expected']))
")

        local actual
        actual=$(echo "$input_str" | "$binary_file" 2>/dev/null) || {
            FAILED=$((FAILED + 1))
            ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error"
            i=$((i + 1))
            continue
        }

        actual=$(printf '%s' "$actual" | python3 -c "
import re, sys
s = sys.stdin.read().strip()
m = re.fullmatch(r'\\(a:\\s*(-?\\d+),\\s*b:\\s*(-?\\d+)\\)', s)
print(f'{m.group(1)} {m.group(2)}' if m else s)
")
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
echo "Swift Test Results"
echo "============================================================"
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED (no Swift implementation)"
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
