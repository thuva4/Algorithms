#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 4 ]; then
    echo "Usage: bash tests/run_scoped_runner.sh <bash|python> <runner_path> <skip|subset|all> <algorithms_json> [extra args...]" >&2
    exit 1
fi

EXECUTOR="$1"
RUNNER_PATH="$2"
SCOPE="$3"
ALGORITHMS_JSON="$4"
shift 4

run_runner() {
    case "$EXECUTOR" in
        bash)
            bash "$RUNNER_PATH" "$@"
            ;;
        python)
            python3 "$RUNNER_PATH" "$@"
            ;;
        *)
            echo "Unsupported executor: $EXECUTOR" >&2
            exit 1
            ;;
    esac
}

case "$SCOPE" in
    skip)
        echo "No relevant algorithm or runner changes for $RUNNER_PATH. Skipping."
        exit 0
        ;;
    all)
        echo "Running full suite for $RUNNER_PATH."
        run_runner "$@"
        exit 0
        ;;
    subset)
        ;;
    *)
        echo "Unsupported scope: $SCOPE" >&2
        exit 1
        ;;
esac

mapfile -t TARGETS < <(
    python3 -c '
import json
import sys

for item in json.loads(sys.argv[1]):
    print(item)
' "$ALGORITHMS_JSON"
)

if [ "${#TARGETS[@]}" -eq 0 ]; then
    echo "No changed algorithms were detected for $RUNNER_PATH. Skipping."
    exit 0
fi

for target in "${TARGETS[@]}"; do
    normalized_target="$target"
    normalized_target="${normalized_target#./}"
    normalized_target="${normalized_target#/}"
    normalized_target="${normalized_target#algorithms/}"

    echo "Running $RUNNER_PATH for $normalized_target"
    run_runner "$normalized_target" "$@"
done
