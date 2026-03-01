# N-Queens

## Overview

The N-Queens problem is a classic constraint-satisfaction puzzle that asks: how can N chess queens be placed on an NxN chessboard so that no two queens threaten each other? A queen can attack any piece that lies on the same row, column, or diagonal. Therefore, a valid solution requires that no two queens share the same row, column, or diagonal.

This problem was first posed in 1848 by chess composer Max Bezzel as the "Eight Queens Puzzle" and was later generalized to N queens on an NxN board. It is one of the most studied problems in combinatorial optimization and is often used to introduce backtracking algorithms. The problem has practical applications in VLSI testing, constraint satisfaction, parallel memory storage schemes, and deadlock prevention.

The N-Queens problem has solutions for all natural numbers n >= 1 except n = 2 and n = 3. The number of solutions grows rapidly: 1 solution for n=1, 0 for n=2, 0 for n=3, 2 for n=4, 10 for n=5, 4 for n=6, 40 for n=7, and 92 for n=8.

## How It Works

The backtracking approach builds a solution one queen at a time, placing one queen per row. At each row, the algorithm tries placing the queen in each column. If the placement is valid (no conflicts with previously placed queens), it recurses to the next row. If no valid column is found, it backtracks to the previous row and tries the next column.

### Steps:

1. Start with an empty board and begin at row 0.
2. For the current row, try placing a queen in each column (0 to N-1).
3. Check if the placement is safe: no other queen on the same column, same main diagonal, or same anti-diagonal.
4. If safe, place the queen and recurse to the next row.
5. If the next row equals N, a complete valid arrangement has been found -- increment the solution count.
6. After recursion returns, remove the queen (backtrack) and try the next column.
7. When all columns in the current row have been tried, return to the previous row.

## Pseudocode

```
function solveNQueens(n):
    solutions = []
    columns = {}          // set of occupied columns
    diagonals = {}        // set of occupied main diagonals (row - col)
    antiDiagonals = {}    // set of occupied anti-diagonals (row + col)
    queens = []           // list of column positions for each row

    function backtrack(row):
        if row == n:
            solutions.add(copy(queens))
            return

        for col in 0 to n-1:
            if col in columns:        continue
            if (row - col) in diagonals:    continue
            if (row + col) in antiDiagonals: continue

            // Place queen
            columns.add(col)
            diagonals.add(row - col)
            antiDiagonals.add(row + col)
            queens.append(col)

            backtrack(row + 1)

            // Remove queen (backtrack)
            columns.remove(col)
            diagonals.remove(row - col)
            antiDiagonals.remove(row + col)
            queens.removeLast()

    backtrack(0)
    return solutions
```

## Example Walkthrough (N=4)

Attempting to place 4 queens on a 4x4 board:

| Step | Row | Column tried | Board state         | Action                          |
|------|-----|-------------|---------------------|---------------------------------|
| 1    | 0   | 0           | Q . . .             | Place queen, go to row 1        |
| 2    | 1   | 0           | conflict (col 0)    | Try next column                 |
| 3    | 1   | 1           | conflict (diagonal) | Try next column                 |
| 4    | 1   | 2           | Q . . . / . . Q .   | Place queen, go to row 2        |
| 5    | 2   | 0-3         | all conflict         | Backtrack to row 1              |
| 6    | 1   | 3           | Q . . . / . . . Q   | Place queen, go to row 2        |
| 7    | 2   | 1           | Q . . . / . . . Q / . Q . . | Place, go to row 3     |
| 8    | 3   | 0-3         | all conflict         | Backtrack to row 2              |
| 9    | ...  | ...         | ...                 | Continue backtracking           |

The two valid solutions for N=4 are:

```
Solution 1:        Solution 2:
. Q . .            . . Q .
. . . Q            Q . . .
Q . . .            . . . Q
. . Q .            . Q . .
```

## Complexity Analysis

| Case    | Time  | Space |
|---------|-------|-------|
| Best    | O(n!) | O(n)  |
| Average | O(n!) | O(n)  |
| Worst   | O(n!) | O(n)  |

**Why these complexities?**

- **Time -- O(n!):** In the first row, there are n choices. In the second row, at least one column is blocked, leaving at most n-1 choices. This continues, giving an upper bound of n! placements to explore. Pruning via conflict detection reduces the actual work significantly, but the worst-case upper bound remains O(n!).

- **Space -- O(n):** The recursion depth is n (one call per row). The auxiliary data structures (columns set, diagonals set, anti-diagonals set) each hold at most n entries. No NxN board needs to be stored -- only the column positions of queens in each row.

## Applications

- **VLSI testing:** Placing test components so they do not interfere with each other.
- **Constraint satisfaction problems:** The N-Queens problem is a canonical CSP benchmark.
- **Parallel computing:** Memory storage schemes that avoid bank conflicts.
- **Deadlock prevention:** Modeling mutual exclusion constraints.
- **Teaching backtracking:** The most classic example of a backtracking algorithm.

## When NOT to Use

- **Very large N values (N > ~25) where all solutions are needed:** The number of solutions grows exponentially, and pure backtracking without symmetry exploitation becomes impractical. For N > 25, use specialized algorithms such as dancing links (Knuth's Algorithm X) or constraint propagation solvers.
- **When only one solution is needed for large N:** A constructive (non-search) approach exists that can directly place queens in O(n) time for most values of N, avoiding search altogether. For example, explicit formulae based on modular arithmetic can produce a valid placement without backtracking.
- **Real-time or latency-sensitive systems:** The worst-case exponential time makes backtracking unsuitable when a guaranteed response time is required.
- **Problems that are not constraint satisfaction:** If the underlying problem does not involve placing items under mutual exclusion constraints, N-Queens techniques are not applicable.

## Comparison

| Approach | Time Complexity | Space | Finds All Solutions? | Notes |
|----------|----------------|-------|---------------------|-------|
| Backtracking (this) | O(n!) | O(n) | Yes | Simple, widely taught; practical for N <= ~25 |
| Backtracking + bit manipulation | O(n!) | O(n) | Yes | Constant-factor speedup using bitwise conflict tracking |
| Dancing Links (Algorithm X) | O(n!) | O(n^2) | Yes | Faster in practice due to efficient cover/uncover operations |
| Constructive placement | O(n) | O(n) | No (one only) | Deterministic formula for most N; fails for small N |
| Min-conflicts (local search) | Avg O(n) | O(n) | No (one only) | Probabilistic; very fast on average but no worst-case guarantee |
| Constraint propagation + SAT | Varies | Varies | Yes | Encodes as Boolean SAT; powerful for large instances |

Backtracking is the best starting point for educational purposes and for problems where N is moderate (up to about 15-20). For larger instances or when only a single solution is needed, constructive or local search methods are preferred.

## Implementations

| Language   | File |
|------------|------|
| Python     | [n_queens.py](python/n_queens.py) |
| Java       | [NQueens.java](java/NQueens.java) |
| C++        | [n_queens.cpp](cpp/n_queens.cpp) |
| C          | [n_queens.c](c/n_queens.c) |
| Go         | [n_queens.go](go/n_queens.go) |
| TypeScript | [nQueens.ts](typescript/nQueens.ts) |
| Rust       | [n_queens.rs](rust/n_queens.rs) |
| Kotlin     | [NQueens.kt](kotlin/NQueens.kt) |
| Swift      | [NQueens.swift](swift/NQueens.swift) |
| Scala      | [NQueens.scala](scala/NQueens.scala) |
| C#         | [NQueens.cs](csharp/NQueens.cs) |

## References

- Bezzel, M. (1848). Schachfreund. *Berliner Schachzeitung*, 3, 363.
- Dijkstra, E. W. (1972). EWD316: A Short Introduction to the Art of Programming.
- [N-Queens problem -- Wikipedia](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
