# Shortest Path in DAG

## Overview

Finds shortest paths from a source vertex in a Directed Acyclic Graph (DAG) by processing vertices in topological order. This approach runs in O(V + E) time, which is faster than Dijkstra's algorithm and can also handle negative edge weights (which Dijkstra cannot). The key insight is that in a DAG, topological ordering guarantees that when we process a vertex, all paths leading to it have already been considered.

## How It Works

1. Compute a topological ordering of the DAG using DFS or Kahn's algorithm.
2. Initialize distances: source = 0, all others = infinity.
3. Process each vertex in topological order, relaxing all outgoing edges. For each edge (u, v) with weight w, if dist[u] + w < dist[v], update dist[v].

Input format: `[n, m, src, u1, v1, w1, u2, v2, w2, ...]`
Output: shortest distance from source to vertex n-1 (or -1 if unreachable).

## Worked Example

```
DAG with 6 vertices, source = 0:
    0 --(5)--> 1
    0 --(3)--> 2
    1 --(6)--> 3
    1 --(2)--> 2
    2 --(7)--> 3
    2 --(4)--> 4
    2 --(2)--> 5
    3 --(1)--> 4
    3 --(-1)-> 5
    4 --(-2)-> 5
```

**Topological order:** 0, 1, 2, 3, 4, 5

**Processing vertex 0 (dist=0):**
- dist[1] = min(INF, 0+5) = 5
- dist[2] = min(INF, 0+3) = 3

**Processing vertex 1 (dist=5):**
- dist[3] = min(INF, 5+6) = 11
- dist[2] = min(3, 5+2) = 3 (no change)

**Processing vertex 2 (dist=3):**
- dist[3] = min(11, 3+7) = 10
- dist[4] = min(INF, 3+4) = 7
- dist[5] = min(INF, 3+2) = 5

**Processing vertex 3 (dist=10):**
- dist[4] = min(7, 10+1) = 7 (no change)
- dist[5] = min(5, 10+(-1)) = 5 (no change)

**Processing vertex 4 (dist=7):**
- dist[5] = min(5, 7+(-2)) = 5 (no change)

**Final distances:** [0, 5, 3, 10, 7, 5]

Shortest path to vertex 5: 0 -> 2 -> 5 with distance 5.

## Pseudocode

```
function shortestPathDAG(n, adj, source):
    // Step 1: Topological sort
    order = topologicalSort(n, adj)

    // Step 2: Initialize distances
    dist = array of size n, all INF
    dist[source] = 0

    // Step 3: Relax edges in topological order
    for each u in order:
        if dist[u] == INF: continue
        for each (v, weight) in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight

    return dist

function topologicalSort(n, adj):
    visited = array of size n, all false
    stack = empty
    for v = 0 to n-1:
        if not visited[v]:
            dfs(v, adj, visited, stack)
    return stack reversed

function dfs(v, adj, visited, stack):
    visited[v] = true
    for each (w, _) in adj[v]:
        if not visited[w]:
            dfs(w, adj, visited, stack)
    stack.push(v)
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(V + E) | O(V + E) |
| Average | O(V + E) | O(V + E) |
| Worst   | O(V + E) | O(V + E) |

The topological sort takes O(V + E) and the relaxation phase processes each edge exactly once. This is optimal since we must read the entire input.

## When to Use

- Task scheduling with weighted dependencies (finding critical path)
- Critical path analysis in project management (PERT/CPM)
- Longest path in DAG (negate all weights, then find shortest path)
- Shortest paths when negative weights are present but no cycles exist
- Dynamic programming on DAGs (many DP problems can be viewed this way)
- Build system dependency resolution with cost estimation

## When NOT to Use

- When the graph has cycles -- topological sort is undefined for cyclic graphs. Use Bellman-Ford or Dijkstra instead.
- When the graph is not a DAG and you do not know in advance -- check for cycles first.
- When you need all-pairs shortest paths -- use Floyd-Warshall or repeated single-source algorithms.
- For undirected graphs -- they always have "trivial" cycles (a-b-a), so they cannot be DAGs.

## Comparison

| Algorithm | Time | Negative Weights? | Graph Type | Notes |
|-----------|------|-------------------|------------|-------|
| DAG Shortest Path (this) | O(V + E) | Yes | DAG only | Fastest; uses topological order |
| Dijkstra's | O(E log V) | No | Any (no negative) | Priority queue based; widely used |
| Bellman-Ford | O(VE) | Yes | Any | Handles negative weights; detects negative cycles |
| SPFA | O(E) avg, O(VE) worst | Yes | Any | Queue-optimized Bellman-Ford |
| Floyd-Warshall | O(V^3) | Yes | Any | All-pairs; uses adjacency matrix |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 24.2: Single-source shortest paths in directed acyclic graphs.
- Sedgewick, R., & Wayne, K. (2011). *Algorithms* (4th ed.). Addison-Wesley. Chapter 4.4.
- [Topological sorting -- Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)

## Implementations

| Language   | File |
|------------|------|
| Python     | [shortest_path_dag.py](python/shortest_path_dag.py) |
| Java       | [ShortestPathDag.java](java/ShortestPathDag.java) |
| C++        | [shortest_path_dag.cpp](cpp/shortest_path_dag.cpp) |
| C          | [shortest_path_dag.c](c/shortest_path_dag.c) |
| Go         | [shortest_path_dag.go](go/shortest_path_dag.go) |
| TypeScript | [shortestPathDag.ts](typescript/shortestPathDag.ts) |
| Rust       | [shortest_path_dag.rs](rust/shortest_path_dag.rs) |
| Kotlin     | [ShortestPathDag.kt](kotlin/ShortestPathDag.kt) |
| Swift      | [ShortestPathDag.swift](swift/ShortestPathDag.swift) |
| Scala      | [ShortestPathDag.scala](scala/ShortestPathDag.scala) |
| C#         | [ShortestPathDag.cs](csharp/ShortestPathDag.cs) |
