#!/usr/bin/env bash
# Scala Test Runner
# Reads tests/cases.yaml from an algorithm directory, compiles and runs Scala implementations,
# and compares output to expected values.
#
# Usage:
#   ./tests/runners/scala_runner.sh                              # Run all algorithms
#   ./tests/runners/scala_runner.sh algorithms/sorting/bubble-sort  # Run one algorithm
#
# Requires: scalac, scala (Scala compiler/runner), python3 (for YAML parsing)

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

find_tool() {
    local name="$1"
    local resolved=""
    local candidate

    if resolved=$(command -v "$name" 2>/dev/null); then
        printf '%s\n' "$resolved"
        return 0
    fi

    for candidate in \
        "$HOME/.local/bin/$name" \
        "$HOME/.local/share/coursier/bin/$name" \
        "$HOME/Library/Application Support/Coursier/bin/$name" \
        "/usr/local/bin/$name" \
        "/usr/bin/$name"
    do
        if [ -x "$candidate" ]; then
            printf '%s\n' "$candidate"
            return 0
        fi
    done

    return 1
}

SCALAC_BIN="$(find_tool scalac || true)"
SCALA_BIN="$(find_tool scala || true)"
SCALA_IS_CLI=0

format_error_excerpt() {
    local error_file="$1"
    if [ ! -s "$error_file" ]; then
        printf '%s' ""
        return
    fi
    sed -n '1,5p' "$error_file" | tr '\n' ' ' | sed 's/[[:space:]]\+/ /g; s/^ //; s/ $//'
}

if [ -n "$SCALA_BIN" ]; then
    if "$SCALA_BIN" -version 2>&1 | grep -q "Scala code runner version"; then
        SCALA_IS_CLI=1
    fi
fi

# Check if scalac / scala are available
if [ -z "$SCALAC_BIN" ]; then
    echo "WARNING: scalac not found. Install Scala to run Scala tests."
    echo "Skipping all Scala tests."
    exit 0
fi

if [ -z "$SCALA_BIN" ]; then
    echo "WARNING: scala not found. Install Scala to run Scala tests."
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
    local main_class="TestHarness"
    mkdir -p "$class_dir"

    local package_name
    package_name=$(python3 -c "
import re
with open('$scala_files') as f:
    source = f.read()
match = re.search(r'(?m)^\\s*package\\s+([A-Za-z_][A-Za-z0-9_.]*)\\s*$', source)
print(match.group(1) if match else '')
")
    if [ -n "$package_name" ]; then
        main_class="$package_name.TestHarness"
    fi

    local status=0
    TEST_DATA_JSON="$test_data" python3 -c "
import json, os, sys

data = json.loads(os.environ['TEST_DATA_JSON'])
func_name = data['function_signature']['name']
inputs = data['function_signature']['input']
output = data['function_signature']['output']
sample_case = data['test_cases'][0] if data.get('test_cases') else {'input': [], 'expected': None}

def normalized_top_level_inputs(raw):
    if isinstance(raw, dict):
        if isinstance(inputs, list):
            ordered_keys = [key for key in inputs if key in raw]
            if not ordered_keys:
                ordered_keys = list(raw.keys())
            elif len(ordered_keys) != len(raw):
                for key in raw.keys():
                    if key not in ordered_keys:
                        ordered_keys.append(key)
        else:
            ordered_keys = list(raw.keys())
        return [raw[key] for key in ordered_keys]
    if isinstance(raw, list):
        if (
            isinstance(inputs, list)
            and len(inputs) == 1
            and all(not isinstance(item, (list, dict)) for item in raw)
            and any(token in str(inputs[0]) for token in ('array', 'list', 'matrix', 'grid', 'tree', 'points', 'interval'))
        ):
            return [raw]
        return raw
    return [raw]

sample_inputs = normalized_top_level_inputs(sample_case.get('input', []))
sample_expected = sample_case.get('expected')

# Read the original Scala source
with open('$scala_files') as f:
    source = f.read()

# Convert snake_case to camelCase for Scala
def snake_to_camel(name):
    parts = name.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])

# Find the object name from the source
import re
obj_match = re.search(r'object\s+(\w+)', source)
obj_name = obj_match.group(1) if obj_match else 'Algorithm'
method_matches = re.findall(r'(?m)^\s*(private\s+)?def\s+(\w+)\s*\(', source)
declared_methods = [name for private, name in method_matches if name != 'main' and not private]
if not declared_methods:
    declared_methods = [name for _, name in method_matches if name != 'main']

preferred_names = []
for candidate in (snake_to_camel(func_name), func_name):
    if candidate and candidate not in preferred_names:
        preferred_names.append(candidate)
camel_name = snake_to_camel(func_name)
if camel_name.endswith('Search'):
    preferred_names.append('search')
    if len(camel_name) > len('Search'):
        preferred_names.append(camel_name[:-len('Search')])
if camel_name.endswith('Sort'):
    preferred_names.append('sort')
    if len(camel_name) > len('Sort'):
        preferred_names.append(camel_name[:-len('Sort')])
if camel_name.endswith('Algorithm') and len(camel_name) > len('Algorithm'):
    preferred_names.append(camel_name[:-len('Algorithm')])
for fallback in ('sort', 'search', 'solve', 'select', 'compute'):
    if fallback not in preferred_names:
        preferred_names.append(fallback)

def normalize_name(name):
    return re.sub(r'[^A-Za-z0-9]', '', name).lower()

scala_func_name = None
for preferred in preferred_names:
    if preferred in declared_methods:
        scala_func_name = preferred
        break
if scala_func_name is None:
    normalized_methods = {normalize_name(name): name for name in declared_methods}
    for preferred in preferred_names:
        match = normalized_methods.get(normalize_name(preferred))
        if match:
            scala_func_name = match
            break
if scala_func_name is None:
    scala_func_name = declared_methods[0] if declared_methods else snake_to_camel(func_name)

signature_match = re.search(r'def\s+' + re.escape(scala_func_name) + r'\s*\(([^)]*)\)', source, re.S)
param_types = []
if signature_match:
    param_types = [token.strip() for token in re.findall(r':\s*([A-Za-z0-9_.\[\]]+)', signature_match.group(1))]

def scalar_reader(index):
    param_type = param_types[index] if index < len(param_types) else ''
    if param_type.endswith('Long'):
        return 'scala.io.StdIn.readLine().trim.toLong'
    if param_type.endswith('Boolean'):
        return 'scala.io.StdIn.readLine().trim.toBoolean'
    return 'scala.io.StdIn.readLine().trim.toInt'

def flat_arg_expr(index, name):
    param_type = param_types[index] if index < len(param_types) else ''
    if 'Vector[Int]' in param_type:
        return f'{name}.toVector'
    if 'List[Int]' in param_type:
        return f'{name}.toList'
    if 'Seq[Int]' in param_type or 'IndexedSeq[Int]' in param_type:
        return f'{name}.toSeq'
    return name

def nested_arg_expr(index, name):
    param_type = param_types[index] if index < len(param_types) else ''
    if 'List[List[Int]]' in param_type:
        return f'{name}.map(_.toList).toList'
    if 'Seq[Seq[Int]]' in param_type or 'IndexedSeq[IndexedSeq[Int]]' in param_type:
        return f'{name}.map(_.toSeq).toSeq'
    if 'List[Array[Int]]' in param_type:
        return f'{name}.toList'
    return name

def adjacency_arg_expr(index, name):
    param_type = param_types[index] if index < len(param_types) else ''
    if 'Map[Int, Seq[Int]]' in param_type:
        return f'{name}.view.mapValues(_.toSeq).toMap'
    return name

def weighted_adjacency_arg_expr(index, name):
    param_type = param_types[index] if index < len(param_types) else ''
    if 'Map[Int, Seq[(Int, Int)]]' in param_type:
        return f'{name}.view.mapValues(_.toSeq).toMap'
    return name

harness = source + '\n\n'

# Generate main object
harness += 'object TestHarness {\n'
harness += '''
  def parseIntArray(line: String): Array[Int] = {
    if (line == null || line.trim.isEmpty) Array.emptyIntArray
    else line.trim.split(\" \").filter(_.nonEmpty).map(_.toInt)
  }

  def formatCollection(values: Seq[Any], wrapCollections: Boolean): String = {
    val rendered = values.map(value => formatValue(value, true))
    if (wrapCollections) rendered.mkString(\"[\", \", \", \"]\")
    else rendered.mkString(\" \")
  }

  def formatValue(value: Any, wrapCollections: Boolean = false): String = value match {
    case null => \"\"
    case _: Unit => \"\"
    case None => \"null\"
    case Some(inner) => formatValue(inner, wrapCollections)
    case b: Boolean => b.toString.toLowerCase
    case d: Double if d.isPosInfinity => \"Infinity\"
    case d: Double if d.isNegInfinity => \"-Infinity\"
    case d: Double if d.isWhole => d.toLong.toString
    case d: Double => d.toString
    case f: Float if f.isPosInfinity => \"Infinity\"
    case f: Float if f.isNegInfinity => \"-Infinity\"
    case f: Float if f.isWhole => f.toLong.toString
    case f: Float => f.toString
    case arr: Array[?] => formatCollection(arr.toSeq.asInstanceOf[Seq[Any]], wrapCollections)
    case seq: Iterable[?] => formatCollection(seq.toSeq.asInstanceOf[Seq[Any]], wrapCollections)
    case p: Product => p.productIterator.map(item => formatValue(item, true)).mkString(\" \")
    case other => other.toString
  }

  def splitTopLevel(raw: String, delimiter: Char): List[String] = {
    val parts = _root_.scala.collection.mutable.ListBuffer[String]()
    val current = new StringBuilder
    var depth = 0
    var inQuotes = false
    var i = 0
    while (i < raw.length) {
      val ch = raw.charAt(i)
      if (ch == '\"') {
        inQuotes = !inQuotes
      }
      if (!inQuotes && ch == delimiter && depth == 0) {
        parts += current.toString
        current.clear()
      } else {
        current.append(ch)
        if (!inQuotes) {
          if (ch == '[' || ch == '{') depth += 1
          else if (ch == ']' || ch == '}') depth -= 1
        }
      }
      i += 1
    }
    parts += current.toString
    parts.toList.filter(_.nonEmpty)
  }

  def parseNestedIntArray(raw: String): Array[Array[Int]] = {
    val trimmed = Option(raw).getOrElse(\"\").trim
    if (trimmed.isEmpty || trimmed == \"[]\") {
      Array.empty[Array[Int]]
    } else {
      val inner = trimmed.stripPrefix(\"[\").stripSuffix(\"]\")
      if (inner.trim.isEmpty) {
        Array.empty[Array[Int]]
      } else {
        splitTopLevel(inner, ',').map { row =>
          val rowInner = row.trim.stripPrefix(\"[\").stripSuffix(\"]\").trim
          if (rowInner.isEmpty) Array.emptyIntArray
          else rowInner.split(\",\").filter(_.nonEmpty).map(_.trim.toInt)
        }.toArray
      }
    }
  }

  def parseAdjacencyMap(raw: String): Map[Int, List[Int]] = {
    val trimmed = Option(raw).getOrElse(\"\").trim
    if (trimmed.isEmpty || trimmed == \"{}\") {
      Map.empty
    } else {
      val inner = trimmed.stripPrefix(\"{\").stripSuffix(\"}\")
      splitTopLevel(inner, ',').map { entry =>
        val pivot = entry.indexOf(':')
        val key = entry.take(pivot).filter(ch => ch.isDigit || ch == '-').toInt
        val valueRaw = entry.drop(pivot + 1).trim
        val values =
          if (valueRaw == \"[]\") List.empty[Int]
          else valueRaw.stripPrefix(\"[\").stripSuffix(\"]\").split(\",\").filter(_.nonEmpty).map(_.trim.toInt).toList
        key -> values
      }.toMap
    }
  }

  def parseWeightedAdjacencyMap(raw: String): Map[Int, List[(Int, Int)]] = {
    val trimmed = Option(raw).getOrElse(\"\").trim
    if (trimmed.isEmpty || trimmed == \"{}\") {
      Map.empty
    } else {
      val inner = trimmed.stripPrefix(\"{\").stripSuffix(\"}\")
      splitTopLevel(inner, ',').map { entry =>
        val pivot = entry.indexOf(':')
        val key = entry.take(pivot).filter(ch => ch.isDigit || ch == '-').toInt
        val valueRaw = entry.drop(pivot + 1).trim
        val values = parseNestedIntArray(valueRaw).collect {
          case row if row.length >= 2 => (row(0), row(1))
        }.toList
        key -> values
      }.toMap
    }
  }
'''
harness += '  def main(args: Array[String]): Unit = {\n'

if (
    len(sample_inputs) == 1
    and isinstance(sample_inputs[0], str)
    and not isinstance(sample_expected, list)
):
    harness += '''
    val x = _root_.scala.io.StdIn.readLine()
    val result = ''' + obj_name + '.' + scala_func_name + '''(if (x == null) \"\" else x)
    println(result)
'''
elif (
    len(sample_inputs) == 2
    and all(isinstance(value, str) for value in sample_inputs)
    and not isinstance(sample_expected, list)
):
    harness += '''
    val a = _root_.scala.io.StdIn.readLine()
    val b = _root_.scala.io.StdIn.readLine()
    val result = ''' + obj_name + '.' + scala_func_name + '''(if (a == null) \"\" else a, if (b == null) \"\" else b)
    println(result)
'''
elif (
    inputs == ['tree_as_array']
    or (
        len(sample_inputs) == 1
        and isinstance(sample_inputs[0], list)
        and any(item is None for item in sample_inputs[0])
    )
):
    harness += '''
    val line = _root_.scala.io.StdIn.readLine()
    val arr = if (line == null || line.trim.isEmpty) Array.empty[Option[Int]]
              else line.trim.split(\" \").filter(_.nonEmpty).map {
                case token if token.equalsIgnoreCase(\"null\") || token.equalsIgnoreCase(\"none\") => None
                case token => Some(token.toInt)
              }
    val result = ''' + obj_name + '.' + scala_func_name + '''(arr)
    println(formatValue(result))
'''
elif (
    len(sample_inputs) == 1
    and isinstance(sample_inputs[0], list)
    and all(not isinstance(item, (list, dict)) for item in sample_inputs[0])
):
    harness += '''
    val arr = parseIntArray(_root_.scala.io.StdIn.readLine())
    val result: Any = ''' + obj_name + '.' + scala_func_name + '''(''' + flat_arg_expr(0, 'arr') + ''')
    result match {
      case _: Unit => println(formatValue(arr))
      case other => println(formatValue(other))
    }
'''
elif (
    len(sample_inputs) == 1
    and isinstance(sample_inputs[0], list)
    and any(isinstance(item, list) for item in sample_inputs[0])
):
    harness += '''
    val matrix = parseNestedIntArray(_root_.scala.io.StdIn.readLine())
    val result: Any = ''' + obj_name + '.' + scala_func_name + '''(''' + nested_arg_expr(0, 'matrix') + ''')
    println(formatValue(result))
'''
elif (
    (output == 'integer_index' and len(inputs) == 2)
    or (
        len(sample_inputs) == 2
        and isinstance(sample_inputs[0], list)
        and not isinstance(sample_inputs[1], (list, dict))
        and not isinstance(sample_expected, list)
    )
):
    harness += '''
    val line = _root_.scala.io.StdIn.readLine()
    val arr = if (line == null || line.trim.isEmpty) Array.empty[Int]
              else line.trim.split(\" \").filter(_.nonEmpty).map(_.toInt)
    val target = _root_.scala.io.StdIn.readLine().trim.toInt
    val result = ''' + obj_name + '.' + scala_func_name + '''(arr, target)
    println(result)
'''
elif (
    len(sample_inputs) == 2
    and not isinstance(sample_inputs[0], (list, dict))
    and isinstance(sample_inputs[1], list)
    and any(isinstance(item, list) for item in sample_inputs[1])
    and not isinstance(sample_expected, list)
):
    harness += '''
    val a = ''' + scalar_reader(0).replace('scala.io.', '_root_.scala.io.') + '''
    val matrix = parseNestedIntArray(_root_.scala.io.StdIn.readLine())
    val result = ''' + obj_name + '.' + scala_func_name + '''(a, ''' + nested_arg_expr(1, 'matrix') + ''')
    println(result)
'''
elif (
    (output == 'integer' and inputs == ['integer'])
    or (
        len(sample_inputs) == 1
        and not isinstance(sample_inputs[0], (list, dict))
        and not isinstance(sample_expected, list)
    )
):
    harness += '''
    val x = ''' + scalar_reader(0).replace('scala.io.', '_root_.scala.io.') + '''
    val result = ''' + obj_name + '.' + scala_func_name + '''(x)
    println(result)
'''
elif (
    (output == 'integer' and inputs == ['integer', 'integer'])
    or (
        len(sample_inputs) == 2
        and all(not isinstance(value, (list, dict)) for value in sample_inputs)
        and not isinstance(sample_expected, list)
    )
):
    harness += '''
    val a = ''' + scalar_reader(0).replace('scala.io.', '_root_.scala.io.') + '''
    val b = ''' + scalar_reader(1).replace('scala.io.', '_root_.scala.io.') + '''
    val result = ''' + obj_name + '.' + scala_func_name + '''(a, b)
    println(result)
'''
elif (
    len(sample_inputs) == 2
    and all(not isinstance(value, (list, dict)) for value in sample_inputs)
    and isinstance(sample_expected, list)
    and not any(isinstance(item, (list, dict)) for item in sample_expected)
):
    harness += '''
    val a = ''' + scalar_reader(0).replace('scala.io.', '_root_.scala.io.') + '''
    val b = ''' + scalar_reader(1).replace('scala.io.', '_root_.scala.io.') + '''
    val result = ''' + obj_name + '.' + scala_func_name + '''(a, b)
    println(formatValue(result))
'''
elif (
    len(sample_inputs) == 1
    and isinstance(sample_inputs[0], dict)
    and all(isinstance(value, list) for value in sample_inputs[0].values())
    and all(all(not isinstance(item, list) for item in value) for value in sample_inputs[0].values())
):
    harness += '''
    val adj = parseAdjacencyMap(_root_.scala.io.StdIn.readLine())
    val result: Any = ''' + obj_name + '.' + scala_func_name + '''(''' + adjacency_arg_expr(0, 'adj') + ''')
    println(formatValue(result))
'''
elif (
    len(sample_inputs) == 2
    and not isinstance(sample_inputs[0], (list, dict))
    and isinstance(sample_inputs[1], dict)
    and all(isinstance(value, list) for value in sample_inputs[1].values())
    and all(all(isinstance(item, list) for item in value) for value in sample_inputs[1].values())
    and not isinstance(sample_expected, list)
):
    harness += '''
    val a = ''' + scalar_reader(0).replace('scala.io.', '_root_.scala.io.') + '''
    val adj = parseWeightedAdjacencyMap(_root_.scala.io.StdIn.readLine())
    val result = ''' + obj_name + '.' + scala_func_name + '''(a, ''' + weighted_adjacency_arg_expr(1, 'adj') + ''')
    println(result)
'''
elif (
    len(sample_inputs) == 3
    and isinstance(sample_inputs[0], list)
    and not isinstance(sample_inputs[1], (list, dict))
    and isinstance(sample_inputs[2], bool)
    and not isinstance(sample_expected, list)
):
    if 'ab' in scala_func_name.lower():
        harness += '''
    val line = _root_.scala.io.StdIn.readLine()
    val scores = if (line == null || line.trim.isEmpty) Array.empty[Int]
                 else line.trim.split(\" \").filter(_.nonEmpty).map(_.toInt)
    val h = _root_.scala.io.StdIn.readLine().trim.toInt
    val isMax = _root_.scala.io.StdIn.readLine().trim.toBoolean
    val result = ''' + obj_name + '.' + scala_func_name + '''(0, 0, isMax, scores, h, Int.MinValue, Int.MaxValue)
    println(result)
'''
    else:
        harness += '''
    val line = _root_.scala.io.StdIn.readLine()
    val scores = if (line == null || line.trim.isEmpty) Array.empty[Int]
                 else line.trim.split(\" \").filter(_.nonEmpty).map(_.toInt)
    val h = _root_.scala.io.StdIn.readLine().trim.toInt
    val isMax = _root_.scala.io.StdIn.readLine().trim.toBoolean
    val result = ''' + obj_name + '.' + scala_func_name + '''(0, 0, isMax, scores, h)
    println(result)
'''
else:
    raise SystemExit(2)

harness += '  }\n'
harness += '}\n'

with open('$harness_file', 'w') as f:
    f.write(harness)
" || status=$?
    if [ "${status:-0}" -ne 0 ]; then
        if [ "${status:-0}" -eq 2 ]; then
            SKIPPED=$((SKIPPED + 1))
            echo "[SKIP] $algo_name: Unsupported Scala signature for automated testing"
            return
        fi
        FAILED=$((FAILED + 1))
        ERRORS="$ERRORS\n  x $algo_name: Failed to generate test harness"
        return
    fi

    # Compile
    if ! "$SCALAC_BIN" -d "$class_dir" "$harness_file" 2>"$TEMP_DIR/compile_err.txt"; then
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
        local runtime_err_file="$TEMP_DIR/runtime_err_${algo_name##*/}_${i}.txt"
        case_name=$(echo "$test_data" | python3 -c "import json,sys; print(json.loads(sys.stdin.read())['test_cases'][$i]['name'])")
        input_str=$(echo "$test_data" | python3 -c "
import json, sys
data = json.loads(sys.stdin.read())
tc = data['test_cases'][$i]
inp = tc['input']
sig_inputs = data.get('function_signature', {}).get('input', [])

def normalize_inputs(raw):
    if isinstance(raw, dict):
        if isinstance(sig_inputs, list):
            ordered_keys = [key for key in sig_inputs if key in raw]
            if not ordered_keys:
                ordered_keys = list(raw.keys())
            elif len(ordered_keys) != len(raw):
                for key in raw.keys():
                    if key not in ordered_keys:
                        ordered_keys.append(key)
        else:
            ordered_keys = list(raw.keys())
        return [raw[key] for key in ordered_keys]
    if isinstance(raw, list):
        if (
            isinstance(sig_inputs, list)
            and len(sig_inputs) == 1
            and all(not isinstance(item, (list, dict)) for item in raw)
            and any(token in str(sig_inputs[0]) for token in ('array', 'list', 'matrix', 'grid', 'tree', 'points', 'interval'))
        ):
            return [raw]
        return raw
    return [raw]

def render_scalar(value):
    if isinstance(value, bool):
        return str(value).lower()
    return str(value)

parts = []
for v in normalize_inputs(inp):
    if isinstance(v, list):
        if all(not isinstance(item, (list, dict)) for item in v):
            parts.append(' '.join(render_scalar(x) for x in v))
        else:
            parts.append(json.dumps(v, separators=(',', ':')))
    elif isinstance(v, dict):
        parts.append(json.dumps(v, separators=(',', ':')))
    else:
        parts.append(render_scalar(v))
print('\n'.join(parts))
")
        expected_str=$(echo "$test_data" | python3 -c "
import json, sys
tc = json.loads(sys.stdin.read())['test_cases'][$i]
val = tc['expected']
if isinstance(val, list):
    print(' '.join(str(x) for x in val))
elif isinstance(val, bool):
    print(str(val).lower())
else:
    print(val)
")

        local actual
        if [ "$SCALA_IS_CLI" -eq 1 ]; then
            actual=$(printf '%s' "$input_str" | "$SCALA_BIN" run --server=false --main-class "$main_class" --classpath "$class_dir" 2>"$runtime_err_file") || {
                FAILED=$((FAILED + 1))
                local runtime_err
                runtime_err=$(format_error_excerpt "$runtime_err_file")
                ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error${runtime_err:+: $runtime_err}"
                i=$((i + 1))
                continue
            }
        else
            actual=$(printf '%s' "$input_str" | "$SCALA_BIN" -cp "$class_dir" "$main_class" 2>"$runtime_err_file") || {
                FAILED=$((FAILED + 1))
                local runtime_err
                runtime_err=$(format_error_excerpt "$runtime_err_file")
                ERRORS="$ERRORS\n  x $algo_name - $case_name: Runtime error${runtime_err:+: $runtime_err}"
                i=$((i + 1))
                continue
            }
        fi

        actual=$(echo "$actual" | tr -s ' ' | sed 's/^ *//;s/ *$//')
        expected_str=$(echo "$expected_str" | tr -s ' ' | sed 's/^ *//;s/ *$//')

        local special_match=1
        if [ "$algo_name" = "graph/hungarian-algorithm" ]; then
            TEST_DATA_JSON="$test_data" ACTUAL_OUTPUT="$actual" CASE_INDEX="$i" python3 -c "
import json, os, re, sys
data = json.loads(os.environ['TEST_DATA_JSON'])
expected = data['test_cases'][int(os.environ['CASE_INDEX'])]['expected']
actual = os.environ['ACTUAL_OUTPUT']
nums = [int(token) for token in re.findall(r'-?\d+', actual)]
assignment = expected.get('assignment', [])
if len(nums) != len(assignment) + 1:
    sys.exit(1)
if nums[:-1] != assignment or nums[-1] != expected.get('total_cost'):
    sys.exit(1)
" || special_match=0
        elif [ "$algo_name" = "graph/strongly-connected-graph" ]; then
            TEST_DATA_JSON="$test_data" ACTUAL_OUTPUT="$actual" CASE_INDEX="$i" python3 -c "
import json, os, re, sys
data = json.loads(os.environ['TEST_DATA_JSON'])
expected = data['test_cases'][int(os.environ['CASE_INDEX'])]['expected']
actual = os.environ['ACTUAL_OUTPUT']
groups = []
for chunk in re.findall(r'\[([^\]]*)\]', actual):
    values = [int(token) for token in re.findall(r'-?\d+', chunk)]
    groups.append(sorted(values))
if not groups and actual.strip():
    values = [int(token) for token in re.findall(r'-?\d+', actual)]
    if values:
        groups = [sorted(values)]
expected_groups = sorted(sorted(group) for group in expected)
if sorted(groups) != expected_groups:
    sys.exit(1)
" || special_match=0
        elif [ "$algo_name" = "graph/topological-sort" ]; then
            TEST_DATA_JSON="$test_data" ACTUAL_OUTPUT="$actual" CASE_INDEX="$i" python3 -c "
import json, os, re, sys
data = json.loads(os.environ['TEST_DATA_JSON'])
case = data['test_cases'][int(os.environ['CASE_INDEX'])]
adj = case['input'][0]
actual = [int(token) for token in re.findall(r'-?\d+', os.environ['ACTUAL_OUTPUT'])]
nodes = sorted(int(key) for key in adj.keys())
if sorted(actual) != nodes or len(actual) != len(nodes):
    sys.exit(1)
position = {node: idx for idx, node in enumerate(actual)}
for src, neighbors in adj.items():
    src_node = int(src)
    for dest in neighbors:
        if position[src_node] >= position[int(dest)]:
            sys.exit(1)
" || special_match=0
        else
            special_match=-1
        fi

        if [ "$actual" = "$expected_str" ] || [ "$special_match" -eq 1 ]; then
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
if [ $# -gt 0 ] && [ -n "${1:-}" ]; then
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
