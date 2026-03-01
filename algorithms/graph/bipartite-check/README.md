# Bipartite Check

## Overview

A graph is bipartite if its vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other. This is equivalent to checking if the graph is 2-colorable. The algorithm uses BFS to attempt a 2-coloring.

## How It Works

1. Start BFS from an unvisited vertex, coloring it with color 0.
2. For each neighbor, if uncolored, assign the opposite color. If already colored with the same color, the graph is not bipartite.
3. Repeat for all connected components.

### Example

Given input: `[4, 4, 0,1, 1,2, 2,3, 3,0]` (4-cycle)

The 4-cycle can be 2-colored: {0,2} and {1,3}. Result: 1 (bipartite)

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

## Pseudocode

```
function isBipartite(graph, n):
    color = array of size n, initialized to -1

    for each vertex s from 0 to n-1:
        if color[s] != -1: continue    // already colored

        // BFS from s
        queue = [s]
        color[s] = 0

        while queue is not empty:
            u = queue.dequeue()
            for each neighbor v of u:
                if color[v] == -1:
                    color[v] = 1 - color[u]   // opposite color
                    queue.enqueue(v)
                else if color[v] == color[u]:
                    return false               // odd cycle found

    return true
```

## Applications

- Matching problems (job assignment, stable marriage)
- Conflict-free scheduling (two-shift scheduling)
- Detecting odd cycles in graphs
- Verifying if a graph can be represented as an intersection of intervals
- Two-coloring problems in map design

## When NOT to Use

- **k-colorability for k >= 3**: Bipartiteness only checks 2-colorability; for k >= 3, the problem is NP-complete
- **Directed graphs**: Bipartiteness is defined for undirected graphs; directed graphs require different analysis
- **Weighted matching**: If you need optimal weighted matching, use the Hungarian algorithm after confirming bipartiteness
- **Multigraphs with self-loops**: A graph with a self-loop is never bipartite, which can be checked trivially without BFS

## Comparison

| Algorithm | Purpose | Time | Space |
|-----------|---------|------|-------|
| BFS 2-coloring | Check bipartiteness | O(V + E) | O(V) |
| DFS 2-coloring | Check bipartiteness | O(V + E) | O(V) |
| Union-Find | Check bipartiteness | O(V + E * alpha(V)) | O(V) |
| Odd Cycle Detection | Find witness of non-bipartiteness | O(V + E) | O(V) |

## References

- [Bipartite Graph -- Wikipedia](https://en.wikipedia.org/wiki/Bipartite_graph)
- Konig, D. (1931). "Graphs and Matrices." Matematikai es Fizikai Lapok, 38, 116-119.

## Implementations

| Language   | File |
|------------|------|
| Python     | [is_bipartite.py](python/is_bipartite.py) |
| Java       | [IsBipartite.java](java/IsBipartite.java) |
| C++        | [is_bipartite.cpp](cpp/is_bipartite.cpp) |
| C          | [is_bipartite.c](c/is_bipartite.c) |
| Go         | [is_bipartite.go](go/is_bipartite.go) |
| TypeScript | [isBipartite.ts](typescript/isBipartite.ts) |
| Rust       | [is_bipartite.rs](rust/is_bipartite.rs) |
| Kotlin     | [IsBipartite.kt](kotlin/IsBipartite.kt) |
| Swift      | [IsBipartite.swift](swift/IsBipartite.swift) |
| Scala      | [IsBipartite.scala](scala/IsBipartite.scala) |
| C#         | [IsBipartite.cs](csharp/IsBipartite.cs) |
