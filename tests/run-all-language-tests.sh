#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PASSED=0
FAILED=0
SKIPPED=0
FAILED_LANGUAGES=()
SKIPPED_LANGUAGES=()

TARGET_ARGS=("$@")
LANGUAGES=(
  python
  typescript
  c
  cpp
  go
  java
  rust
  kotlin
  swift
  scala
  csharp
)

print_usage() {
  cat <<'EOF'
Run every language-specific algorithm test runner.

Usage:
  bash tests/run-all-language-tests.sh
  bash tests/run-all-language-tests.sh <category>/<algorithm-slug>

When an algorithm path is provided, it is forwarded to each runner so only that
algorithm is tested for each supported language.
EOF
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

missing_tool() {
  local language="$1"
  local tool="$2"

  echo "[SKIP] ${language}: missing '${tool}'"
  SKIPPED=$((SKIPPED + 1))
  SKIPPED_LANGUAGES+=("${language}")
}

ensure_prerequisites() {
  local language="$1"

  case "$language" in
    python)
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      ;;
    typescript)
      command_exists npm || { missing_tool "$language" "npm"; return 1; }
      ;;
    c)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists gcc || { missing_tool "$language" "gcc"; return 1; }
      ;;
    cpp)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists g++ || { missing_tool "$language" "g++"; return 1; }
      ;;
    go)
      command_exists go || { missing_tool "$language" "go"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      local go_smoke_dir
      local go_smoke_file
      go_smoke_dir="$(mktemp -d)"
      go_smoke_file="$go_smoke_dir/smoke.go"
      cat > "$go_smoke_file" <<'EOF'
package main

import "fmt"

func main() {
  fmt.Print("ok")
}
EOF
      if ! env GO111MODULE=off GOCACHE="$REPO_ROOT/.cache/go-build" go run "$go_smoke_file" >/dev/null 2>&1; then
        rm -rf "$go_smoke_dir"
        echo "[SKIP] ${language}: Go toolchain failed a smoke test"
        SKIPPED=$((SKIPPED + 1))
        SKIPPED_LANGUAGES+=("${language}")
        return 1
      fi
      rm -rf "$go_smoke_dir"
      ;;
    java)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists javac || { missing_tool "$language" "javac"; return 1; }
      command_exists java || { missing_tool "$language" "java"; return 1; }
      ;;
    rust)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists rustc || { missing_tool "$language" "rustc"; return 1; }
      ;;
    kotlin)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists kotlinc || { missing_tool "$language" "kotlinc"; return 1; }
      command_exists java || { missing_tool "$language" "java"; return 1; }
      ;;
    swift)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists swiftc || { missing_tool "$language" "swiftc"; return 1; }
      ;;
    scala)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists scalac || { missing_tool "$language" "scalac"; return 1; }
      command_exists scala || { missing_tool "$language" "scala"; return 1; }
      ;;
    csharp)
      command_exists bash || { missing_tool "$language" "bash"; return 1; }
      command_exists python3 || { missing_tool "$language" "python3"; return 1; }
      command_exists dotnet || { missing_tool "$language" "dotnet"; return 1; }
      ;;
    *)
      echo "[SKIP] ${language}: unsupported runner"
      SKIPPED=$((SKIPPED + 1))
      SKIPPED_LANGUAGES+=("${language}")
      return 1
      ;;
  esac

  return 0
}

run_language() {
  local language="$1"
  shift

  case "$language" in
    python)
      python3 "$REPO_ROOT/tests/runners/python_runner.py" "$@"
      ;;
    typescript)
      if [[ $# -gt 0 ]]; then
        ALGORITHM_PATH="$1" npm test --prefix "$REPO_ROOT/tests/runners/ts"
      else
        npm test --prefix "$REPO_ROOT/tests/runners/ts"
      fi
      ;;
    c)
      bash "$REPO_ROOT/tests/runners/c_runner.sh" "$@"
      ;;
    cpp)
      python3 "$REPO_ROOT/tests/runners/cpp_runner.py" "$@"
      ;;
    go)
      bash "$REPO_ROOT/tests/runners/go_runner.sh" "$@"
      ;;
    java)
      bash "$REPO_ROOT/tests/runners/java_runner.sh" "$@"
      ;;
    rust)
      python3 "$REPO_ROOT/tests/runners/rust_runner.py" "$@"
      ;;
    kotlin)
      bash "$REPO_ROOT/tests/runners/kotlin_runner.sh" "$@"
      ;;
    swift)
      bash "$REPO_ROOT/tests/runners/swift_runner.sh" "$@"
      ;;
    scala)
      bash "$REPO_ROOT/tests/runners/scala_runner.sh" "$@"
      ;;
    csharp)
      bash "$REPO_ROOT/tests/runners/csharp_runner.sh" "$@"
      ;;
  esac
}

if [[ ${#TARGET_ARGS[@]} -gt 0 ]]; then
  case "${TARGET_ARGS[0]}" in
    -h|--help)
      print_usage
      exit 0
      ;;
  esac
fi

cd "$REPO_ROOT"

for language in "${LANGUAGES[@]}"; do
  printf '\n[%s] Running tests\n' "$language"
  printf '%s\n' "----------------------------------------"

  if ! ensure_prerequisites "$language"; then
    continue
  fi

  if [[ ${#TARGET_ARGS[@]} -gt 0 ]]; then
    run_language "$language" "${TARGET_ARGS[@]}"
  else
    run_language "$language"
  fi

  if [[ $? -eq 0 ]]; then
    PASSED=$((PASSED + 1))
  else
    FAILED=$((FAILED + 1))
    FAILED_LANGUAGES+=("${language}")
  fi
done

printf '\nLanguage Test Summary\n'
printf '%s\n' "========================================"
printf 'Passed languages:  %d\n' "$PASSED"
printf 'Failed languages:  %d\n' "$FAILED"
printf 'Skipped languages: %d\n' "$SKIPPED"

if [[ ${#FAILED_LANGUAGES[@]} -gt 0 ]]; then
  printf 'Failures: %s\n' "${FAILED_LANGUAGES[*]}"
fi

if [[ ${#SKIPPED_LANGUAGES[@]} -gt 0 ]]; then
  printf 'Skipped:  %s\n' "${SKIPPED_LANGUAGES[*]}"
fi

if [[ $FAILED -gt 0 ]]; then
  exit 1
fi
