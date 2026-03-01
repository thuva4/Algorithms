# Kosaraju's Strongly Connected Components

## Overview

Kosaraju's algorithm finds all strongly connected components (SCCs) in a directed graph using two passes of depth-first search. A strongly connected component is a maximal set of vertices where every vertex is reachable from every other vertex. The algorithm relies on the fact that the transpose of a graph has the same SCCs as the original. It first computes a finishing-order of vertices, then processes vertices in reverse finishing order on the transposed graph.

## How It Works

1. Perform a DFS on the original graph, pushing each vertex onto a stack when it finishes (post-order).
2. Build the transpose (reverse) graph by reversing all edges.
3. Pop vertices from the stack and perform DFS on the transpose graph. Each DFS tree from this pass forms one SCC.

## Worked Example

Given a directed graph with 5 vertices and 5 edges:

```
Edges: 0->1, 1->2, 2->0, 3->4, 4->3

    0 --> 1       3 --> 4
    ^     |       ^     |
    |     v       |     v
    +---- 2       +-----+
```

**Pass 1 (DFS on original graph, record finish order):**
- Start at 0: visit 0 -> 1 -> 2 -> back to 0 (cycle). Finish order: 2, 1, 0
- Start at 3: visit 3 -> 4 -> back to 3 (cycle). Finish order: 4, 3
- Stack (top to bottom): [3, 4, 0, 1, 2]

**Pass 2 (DFS on transposed graph in reverse finish order):**
- Pop 3: DFS on transpose reaches {3, 4} -> SCC #1 = {3, 4}
- Pop 4: already visited
- Pop 0: DFS on transpose reaches {0, 2, 1} -> SCC #2 = {0, 1, 2}
- Pop 1, 2: already visited

**Result:** 2 SCCs: {0, 1, 2} and {3, 4}.

## Pseudocode

```
function kosaraju(graph, n):
    visited = array of size n, all false
    stack = empty

    // Pass 1: DFS on original graph
    for v = 0 to n-1:
        if not visited[v]:
            dfs1(v, graph, visited, stack)

    // Build transpose graph
    transpose = reverse all edges in graph

    // Pass 2: DFS on transposed graph
    visited = array of size n, all false
    sccCount = 0

    while stack is not empty:
        v = stack.pop()
        if not visited[v]:
            dfs2(v, transpose, visited)
            sccCount += 1

    return sccCount

function dfs1(v, graph, visited, stack):
    visited[v] = true
    for each neighbor w of v in graph:
        if not visited[w]:
            dfs1(w, graph, visited, stack)
    stack.push(v)

function dfs2(v, transpose, visited):
    visited[v] = true
    for each neighbor w of v in transpose:
        if not visited[w]:
            dfs2(w, transpose, visited)
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(V + E) | O(V + E) |
| Average | O(V + E) | O(V + E) |
| Worst   | O(V + E) | O(V + E) |

Both DFS passes traverse all vertices and edges. The transpose graph requires O(V + E) additional space.

## When to Use

- Finding strongly connected components in directed graphs
- Detecting mutual dependencies in software systems
- Computing the condensation DAG for reachability analysis
- Solving 2-SAT problems (SCCs of the implication graph)
- Analyzing web page link structures
- Identifying circular dependencies in build systems

## When NOT to Use

- For undirected graphs -- use Union-Find or simple DFS for connected components instead.
- When you need SCCs online (with dynamic edge insertions) -- Kosaraju's is a batch algorithm.
- When memory is very tight -- the transpose graph doubles the edge storage. Tarjan's algorithm avoids this overhead.
- When you need low-link values or articulation information -- Tarjan's provides these as a byproduct.

## Comparison

| Algorithm | Time | Space | Passes | Notes |
|-----------|------|-------|--------|-------|
| Kosaraju's (this) | O(V + E) | O(V + E) | 2 DFS | Requires transpose graph; conceptually simple |
| Tarjan's | O(V + E) | O(V) | 1 DFS | Single-pass; uses low-link values; no transpose needed |
| Path-Based (Gabow) | O(V + E) | O(V) | 1 DFS | Uses two stacks; avoids low-link bookkeeping |
| Kosaraju-Sharir | O(V + E) | O(V + E) | 2 DFS | Same as Kosaraju's with minor implementation differences |

## References

- Sharir, M. (1981). "A strong-connectivity algorithm and its applications in data flow analysis." *Computers & Mathematics with Applications*, 7(1), 67-72.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22.5.
- [Kosaraju's algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Kosaraju%27s_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [kosarajus_scc.py](python/kosarajus_scc.py) |
| Java       | [KosarajusScc.java](java/KosarajusScc.java) |
| C++        | [kosarajus_scc.cpp](cpp/kosarajus_scc.cpp) |
| C          | [kosarajus_scc.c](c/kosarajus_scc.c) |
| Go         | [kosarajus_scc.go](go/kosarajus_scc.go) |
| TypeScript | [kosarajusScc.ts](typescript/kosarajusScc.ts) |
| Rust       | [kosarajus_scc.rs](rust/kosarajus_scc.rs) |
| Kotlin     | [KosarajusScc.kt](kotlin/KosarajusScc.kt) |
| Swift      | [KosarajusScc.swift](swift/KosarajusScc.swift) |
| Scala      | [KosarajusScc.scala](scala/KosarajusScc.scala) |
| C#         | [KosarajusScc.cs](csharp/KosarajusScc.cs) |
