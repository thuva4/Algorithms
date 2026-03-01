# Hamiltonian Path

## Overview

A Hamiltonian Path visits every vertex in a graph exactly once. A Hamiltonian Cycle is a Hamiltonian Path that returns to the starting vertex. Determining whether a Hamiltonian Path exists is NP-complete in general, but the dynamic programming approach with bitmask (Held-Karp style) solves it in O(2^n * n^2) time, which is significantly faster than the naive O(n!) brute-force approach for moderate values of n (up to about 20-25 vertices).

## How It Works

1. Use DP where `dp[mask][i]` is true if there is a path visiting exactly the vertices in `mask` ending at vertex `i`.
2. Initialize `dp[1 << i][i] = true` for all vertices (each vertex alone is a valid path of length 0).
3. For each mask and each vertex `i` in the mask, try to extend to vertex `j` adjacent to `i` that is not yet in the mask.
4. A Hamiltonian path exists if `dp[(1<<n)-1][i]` is true for any `i` (the full mask with all vertices visited).

Input format: `[n, m, u1, v1, u2, v2, ...]`

## Worked Example

Consider a graph with 4 vertices and 4 edges:

```
Vertices: 0, 1, 2, 3
Edges: 0-1, 1-2, 2-3, 0-3

    0 --- 1
    |     |
    3 --- 2
```

**DP Initialization:**
- dp[0001][0] = true (only vertex 0)
- dp[0010][1] = true (only vertex 1)
- dp[0100][2] = true (only vertex 2)
- dp[1000][3] = true (only vertex 3)

**Extending paths (selected transitions):**
- dp[0001][0] -> dp[0011][1] = true (0 -> 1)
- dp[0001][0] -> dp[1001][3] = true (0 -> 3)
- dp[0011][1] -> dp[0111][2] = true (0 -> 1 -> 2)
- dp[0111][2] -> dp[1111][3] = true (0 -> 1 -> 2 -> 3)

**Result:** dp[1111][3] = true, so a Hamiltonian Path exists: 0 -> 1 -> 2 -> 3.

## Pseudocode

```
function hamiltonianPath(n, adjacency):
    dp = 2D array of size [2^n][n], initialized to false

    for i = 0 to n-1:
        dp[1 << i][i] = true

    for mask = 1 to (2^n - 1):
        for i = 0 to n-1:
            if bit i is not set in mask: continue
            if dp[mask][i] is false: continue
            for each neighbor j of i:
                if bit j is set in mask: continue
                dp[mask | (1 << j)][j] = true

    fullMask = (1 << n) - 1
    for i = 0 to n-1:
        if dp[fullMask][i]: return true

    return false
```

## Complexity Analysis

| Case    | Time          | Space       |
|---------|---------------|-------------|
| Best    | O(2^n * n^2)  | O(2^n * n)  |
| Average | O(2^n * n^2)  | O(2^n * n)  |
| Worst   | O(2^n * n^2)  | O(2^n * n)  |

The bitmask DP explores all 2^n subsets of vertices. For each subset, it iterates over all n vertices and their neighbors. Space is dominated by the DP table.

## When to Use

- Route planning where every location must be visited exactly once
- Circuit board testing (visiting every test point)
- Genome sequencing and assembly
- Puzzle solving (e.g., knight's tour is a special case)
- Network topology verification

## When NOT to Use

- When n > 25, the exponential time and space become prohibitive. Consider heuristic or approximation methods instead.
- When you only need the shortest path (use TSP algorithms with distance optimization instead).
- When the graph is very sparse and structural properties can be exploited -- specialized algorithms may be faster.
- For undirected graphs where an Eulerian path (visiting every edge) is what you actually need.

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Bitmask DP (this) | O(2^n * n^2) | O(2^n * n) | Exact; practical for n <= 20-25 |
| Brute Force (backtracking) | O(n!) | O(n) | Simpler but much slower for n > 15 |
| Inclusion-Exclusion | O(2^n * n^2) | O(2^n) | Same asymptotic complexity, different constant |
| Heuristic (e.g., greedy, genetic) | Varies | Varies | No guarantee of finding a path; useful for large n |

## References

- Held, M., & Karp, R. M. (1962). "A Dynamic Programming Approach to Sequencing Problems." *Journal of the Society for Industrial and Applied Mathematics*, 10(1), 196-210.
- Bellman, R. (1962). "Dynamic Programming Treatment of the Travelling Salesman Problem." *Journal of the ACM*, 9(1), 61-63.
- [Hamiltonian path problem -- Wikipedia](https://en.wikipedia.org/wiki/Hamiltonian_path_problem)

## Implementations

| Language   | File |
|------------|------|
| Python     | [hamiltonian_path.py](python/hamiltonian_path.py) |
| Java       | [HamiltonianPath.java](java/HamiltonianPath.java) |
| C++        | [hamiltonian_path.cpp](cpp/hamiltonian_path.cpp) |
| C          | [hamiltonian_path.c](c/hamiltonian_path.c) |
| Go         | [hamiltonian_path.go](go/hamiltonian_path.go) |
| TypeScript | [hamiltonianPath.ts](typescript/hamiltonianPath.ts) |
| Rust       | [hamiltonian_path.rs](rust/hamiltonian_path.rs) |
| Kotlin     | [HamiltonianPath.kt](kotlin/HamiltonianPath.kt) |
| Swift      | [HamiltonianPath.swift](swift/HamiltonianPath.swift) |
| Scala      | [HamiltonianPath.scala](scala/HamiltonianPath.scala) |
| C#         | [HamiltonianPath.cs](csharp/HamiltonianPath.cs) |
