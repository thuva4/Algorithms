#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CACHE_DIR="$REPO_ROOT/.cache/go-build"

mkdir -p "$CACHE_DIR"

exec env GO111MODULE=off GOCACHE="$CACHE_DIR" python3 "$SCRIPT_DIR/go_runner.py" "$@"
