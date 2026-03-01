#!/usr/bin/env python3

from __future__ import annotations

import json
import sys


LANGUAGE_RUNNERS = {
    "python": {"tests/runners/python_runner.py"},
    "java": {"tests/runners/java_runner.sh"},
    "cpp": {"tests/runners/cpp_runner.py"},
    "c": {"tests/runners/c_runner.sh"},
    "go": {"tests/runners/go_runner.py", "tests/runners/go_runner.sh"},
    "rust": {"tests/runners/rust_runner.py"},
    "kotlin": {"tests/runners/kotlin_runner.sh"},
    "swift": {"tests/runners/swift_runner.sh"},
    "scala": {"tests/runners/scala_runner.sh"},
    "csharp": {"tests/runners/csharp_runner.sh"},
}

FULL_MATRIX_FILES = {
    ".github/workflows/test.yml",
    "tests/determine_test_scope.py",
    "tests/run_scoped_runner.sh",
    "tests/runners/requirements.txt",
}


def collect_changed_files() -> list[str]:
    return [line.strip() for line in sys.stdin if line.strip()]


def collect_algorithms(changed_files: list[str]) -> list[str]:
    algorithms: set[str] = set()
    for path in changed_files:
        if not path.startswith("algorithms/"):
            continue
        parts = path.split("/")
        if len(parts) >= 3:
            algorithms.add("/".join(parts[:3]))
    return sorted(algorithms)


def unit_scope(changed_files: list[str]) -> str:
    if any(
        path.startswith("scripts/")
        or path in {"package.json", "package-lock.json", ".github/workflows/test.yml"}
        or path in {"tests/determine_test_scope.py", "tests/run_scoped_runner.sh"}
        for path in changed_files
    ):
        return "run"
    return "skip"


def typescript_scope(changed_files: list[str]) -> str:
    if any(
        path.startswith("tests/runners/ts/")
        or path in {"package.json", "package-lock.json", ".github/workflows/test.yml"}
        for path in changed_files
    ):
        return "run"
    return "skip"


def has_unclassified_runner_change(changed_files: list[str]) -> bool:
    known_runner_files = set().union(*LANGUAGE_RUNNERS.values())
    for path in changed_files:
        if not path.startswith("tests/runners/"):
            continue
        if path.startswith("tests/runners/ts/"):
            continue
        if path in known_runner_files:
            continue
        return True
    return False


def language_scope(
    changed_files: list[str], algorithms: list[str], language: str, run_all: bool
) -> str:
    if run_all:
        return "all"
    if LANGUAGE_RUNNERS[language].intersection(changed_files):
        return "all"
    if algorithms:
        return "subset"
    return "skip"


def emit_output(key: str, value: str) -> None:
    print(f"{key}={value}")


def main() -> int:
    changed_files = collect_changed_files()
    algorithms = collect_algorithms(changed_files)

    run_all = bool(FULL_MATRIX_FILES.intersection(changed_files)) or has_unclassified_runner_change(
        changed_files
    )

    emit_output("algorithms_json", json.dumps(algorithms))
    emit_output("unit_scope", unit_scope(changed_files))
    emit_output("typescript_scope", typescript_scope(changed_files))

    for language in LANGUAGE_RUNNERS:
        emit_output(
            f"{language}_scope",
            language_scope(changed_files, algorithms, language, run_all),
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
