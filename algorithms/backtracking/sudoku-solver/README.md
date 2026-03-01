# Sudoku Solver

## Overview

Sudoku is a logic-based combinatorial number-placement puzzle. The objective is to fill a 9x9 grid with digits so that each column, each row, and each of the nine 3x3 sub-boxes (also called "boxes" or "regions") contains all of the digits from 1 to 9. The puzzle setter provides a partially completed grid, which for a well-posed puzzle has a single unique solution.

A backtracking-based Sudoku solver works by trying digits 1-9 in each empty cell, checking constraints, and recursively attempting to fill the rest of the grid. When a conflict is detected (a digit violates the row, column, or box constraint), the solver backtracks and tries the next digit. This approach guarantees finding a solution if one exists.

The solver presented here accepts a flattened 81-element array (with 0 representing empty cells) and returns the solved flattened array. This representation makes the interface uniform across all programming languages while preserving the full board state.

## How It Works

### Steps:

1. Scan the 81-cell board to find the first empty cell (value 0).
2. If no empty cell exists, the puzzle is solved -- return the board.
3. For the empty cell at position (row, col), try each digit from 1 to 9.
4. For each digit, check if it is valid: the digit must not already appear in the same row, same column, or same 3x3 box.
5. If the digit is valid, place it and recurse to solve the remaining empty cells.
6. If recursion succeeds, propagate the solution upward.
7. If recursion fails (no valid digit works), remove the digit (backtrack) and try the next one.
8. If no digit 1-9 works for a cell, return failure (trigger backtracking in the caller).

## Pseudocode

```
function solveSudoku(board):
    cell = findEmptyCell(board)
    if cell is null:
        return true          // all cells filled => solved

    row, col = cell

    for digit in 1 to 9:
        if isValid(board, row, col, digit):
            board[row][col] = digit

            if solveSudoku(board):
                return true

            board[row][col] = 0   // backtrack

    return false                  // trigger backtracking in caller

function findEmptyCell(board):
    for row in 0 to 8:
        for col in 0 to 8:
            if board[row][col] == 0:
                return (row, col)
    return null

function isValid(board, row, col, digit):
    // Check row
    for c in 0 to 8:
        if board[row][c] == digit: return false

    // Check column
    for r in 0 to 8:
        if board[r][col] == digit: return false

    // Check 3x3 box
    boxRow = (row / 3) * 3
    boxCol = (col / 3) * 3
    for r in boxRow to boxRow+2:
        for c in boxCol to boxCol+2:
            if board[r][c] == digit: return false

    return true
```

**Optimization:** Maintaining sets for each row, column, and box allows O(1) validity checks instead of O(9) scans. This reduces the constant factor significantly without changing the asymptotic complexity.

## Example

Given a partially filled Sudoku (0 = empty):

```
5 3 _ | _ 7 _ | _ _ _
6 _ _ | 1 9 5 | _ _ _
_ 9 8 | _ _ _ | _ 6 _
------+-------+------
8 _ _ | _ 6 _ | _ _ 3
4 _ _ | 8 _ 3 | _ _ 1
7 _ _ | _ 2 _ | _ _ 6
------+-------+------
_ 6 _ | _ _ _ | 2 8 _
_ _ _ | 4 1 9 | _ _ 5
_ _ _ | _ 8 _ | _ 7 9
```

| Step | Cell (row,col) | Digit tried | Valid? | Action               |
|------|---------------|-------------|--------|----------------------|
| 1    | (0,2)         | 1           | No     | 1 in box             |
| 2    | (0,2)         | 2           | No     | 2 not valid          |
| 3    | (0,2)         | 4           | Yes    | Place 4, recurse     |
| 4    | (0,3)         | 6           | Yes    | Place 6, recurse     |
| 5    | (0,5)         | 8           | Yes    | Place 8, recurse     |
| ...  | ...           | ...         | ...    | Continue solving     |

The solver fills all 51 empty cells to produce the unique solution:

```
5 3 4 | 6 7 8 | 9 1 2
6 7 2 | 1 9 5 | 3 4 8
1 9 8 | 3 4 2 | 5 6 7
------+-------+------
8 5 9 | 7 6 1 | 4 2 3
4 2 6 | 8 5 3 | 7 9 1
7 1 3 | 9 2 4 | 8 5 6
------+-------+------
9 6 1 | 5 3 7 | 2 8 4
2 8 7 | 4 1 9 | 6 3 5
3 4 5 | 2 8 6 | 1 7 9
```

## Complexity Analysis

| Case    | Time       | Space  |
|---------|------------|--------|
| Best    | O(1)       | O(81)  |
| Average | O(9^m)     | O(81)  |
| Worst   | O(9^81)    | O(81)  |

Where m is the number of empty cells.

**Why these complexities?**

- **Best Case -- O(1):** If the board is already complete and valid, no work is needed beyond validation.

- **Average Case -- O(9^m):** For each of the m empty cells, the solver may try up to 9 digits. In practice, constraint propagation and early pruning reduce this dramatically. Typical well-posed puzzles are solved in milliseconds.

- **Worst Case -- O(9^81):** In the theoretical worst case with an empty board and no pruning, every combination is tried. In practice this never occurs due to constraint checking.

- **Space -- O(81):** The board is a fixed 9x9 = 81 cells. The recursion depth is at most 81 (one call per empty cell). Auxiliary sets for constraint checking use O(27) space (9 rows + 9 columns + 9 boxes).

## Applications

- **Puzzle solving:** Automated Sudoku solvers for games and competitions.
- **Constraint satisfaction:** Sudoku is a canonical example of CSPs, used in AI education.
- **SAT solving:** Sudoku can be encoded as a Boolean satisfiability problem.
- **Combinatorial optimization:** Techniques from Sudoku solving generalize to scheduling and resource allocation.
- **Algorithm education:** Teaching backtracking, constraint propagation, and search.

## When NOT to Use

- **Puzzles with multiple solutions where all must be found:** While backtracking can be extended to enumerate all solutions, the exponential branching makes it slow for puzzles designed to have many solutions. Constraint propagation or SAT solvers handle multi-solution enumeration more efficiently.
- **Extremely hard or adversarial puzzles:** Some artificially constructed puzzles with many empty cells and minimal constraints can force backtracking into its worst-case O(9^81) behavior. For such instances, solvers based on constraint propagation (like Norvig's approach) or SAT encoding are orders of magnitude faster.
- **Non-standard Sudoku variants (larger grids):** For 16x16 or 25x25 Sudoku variants, the branching factor increases from 9 to 16 or 25, making pure backtracking impractical. Constraint-based or SAT-based methods scale better.
- **When generating puzzles (not solving):** Puzzle generation requires creating a full valid board and then removing clues while ensuring uniqueness. This is a different problem that benefits from randomized construction and uniqueness checking rather than pure backtracking.
- **Batch solving of thousands of puzzles:** If high throughput is needed (e.g., solving millions of puzzles per second for research), highly optimized solvers using bit manipulation, SIMD instructions, and dancing links far outperform textbook backtracking.

## Comparison

| Solver Approach | Avg Time per Puzzle | Worst Case | Implementation Complexity | Notes |
|----------------|-------------------|------------|--------------------------|-------|
| Backtracking (this) | ~1-10 ms | O(9^m) | Low | Simple and correct; sufficient for most puzzles |
| Backtracking + constraint propagation | ~0.01-1 ms | O(9^m) | Medium | Naked singles, hidden singles reduce search space dramatically |
| Norvig's solver | ~0.01-0.1 ms | O(9^m) | Medium | Combines constraint propagation with depth-first search |
| Dancing Links (DLX) | ~0.001-0.01 ms | O(9^m) | High | Knuth's Algorithm X; extremely fast exact cover solver |
| SAT solver encoding | ~0.01-1 ms | Varies | High (encoding) | Encodes as Boolean CNF; leverages industrial SAT solver optimizations |
| Stochastic / simulated annealing | Varies | No guarantee | Medium | Can get stuck; no completeness guarantee |

For educational purposes and standard 9x9 puzzles, simple backtracking is perfectly adequate. Adding constraint propagation (eliminating candidates before guessing) provides a major practical speedup with modest additional complexity. For competitive or research-level solving, dancing links or SAT encodings are the state of the art.

## Implementations

| Language   | File |
|------------|------|
| Python     | [sudoku_solve.py](python/sudoku_solve.py) |
| Java       | [SudokuSolver.java](java/SudokuSolver.java) |
| C++        | [sudoku_solve.cpp](cpp/sudoku_solve.cpp) |
| C          | [sudoku_solve.c](c/sudoku_solve.c) |
| Go         | [sudoku_solve.go](go/sudoku_solve.go) |
| TypeScript | [sudokuSolve.ts](typescript/sudokuSolve.ts) |
| Rust       | [sudoku_solve.rs](rust/sudoku_solve.rs) |
| Kotlin     | [SudokuSolver.kt](kotlin/SudokuSolver.kt) |
| Swift      | [SudokuSolver.swift](swift/SudokuSolver.swift) |
| Scala      | [SudokuSolver.scala](scala/SudokuSolver.scala) |
| C#         | [SudokuSolver.cs](csharp/SudokuSolver.cs) |

## References

- Norvig, P. (2006). Solving Every Sudoku Puzzle. https://norvig.com/sudoku.html
- Crook, J. F. (2009). A Pencil-and-Paper Algorithm for Solving Sudoku Puzzles. *Notices of the AMS*, 56(4), 460-468.
- [Sudoku solving algorithms -- Wikipedia](https://en.wikipedia.org/wiki/Sudoku_solving_algorithms)
