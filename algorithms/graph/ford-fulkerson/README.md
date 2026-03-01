# Ford-Fulkerson

## Overview

The Ford-Fulkerson method computes maximum flow using DFS to find augmenting paths in the residual graph.

## How It Works

1. While there exists an augmenting path from source to sink (found by DFS):
   - Find the bottleneck capacity along the path.
   - Update residual capacities.
   - Add the bottleneck to total flow.

Input: `[n, m, src, sink, u1, v1, cap1, u2, v2, cap2, ...]`

## Worked Example

Consider a flow network with 4 vertices (source=0, sink=3):

```
       10       10
  0 -------> 1 -------> 3
  |                      ^
  | 10                   | 10
  v                      |
  2 -------------------->
```

Edges: 0->1(10), 0->2(10), 1->3(10), 2->3(10).

**Iteration 1 -- DFS finds path 0->1->3:**
- Bottleneck = min(10, 10) = 10
- Push 10 units. Residual: 0->1(0), 1->0(10), 1->3(0), 3->1(10).

**Iteration 2 -- DFS finds path 0->2->3:**
- Bottleneck = min(10, 10) = 10
- Push 10 units. Residual: 0->2(0), 2->0(10), 2->3(0), 3->2(10).

**Iteration 3 -- DFS finds no more augmenting paths from 0 to 3.**

**Maximum flow = 10 + 10 = 20.**

## Pseudocode

```
function fordFulkerson(graph, source, sink):
    // Build residual graph (adjacency matrix or adjacency list)
    residual = copy of capacity graph
    totalFlow = 0

    while true:
        // Find augmenting path using DFS
        visited = array of size V, initialized to false
        parent = array of size V, initialized to -1
        pathFlow = dfs(source, sink, INFINITY, visited, parent, residual)

        if pathFlow == 0:
            break   // no more augmenting paths

        totalFlow += pathFlow

    return totalFlow

function dfs(u, sink, flow, visited, parent, residual):
    if u == sink:
        return flow

    visited[u] = true
    for each vertex v:
        if not visited[v] AND residual[u][v] > 0:
            bottleneck = dfs(v, sink, min(flow, residual[u][v]), visited, parent, residual)
            if bottleneck > 0:
                residual[u][v] -= bottleneck
                residual[v][u] += bottleneck
                return bottleneck

    return 0
```

## Complexity Analysis

| Case    | Time             | Space  |
|---------|------------------|--------|
| Best    | O(E * max_flow)  | O(V^2) |
| Average | O(E * max_flow)  | O(V^2) |
| Worst   | O(E * max_flow)  | O(V^2) |

The time depends on the max flow value, making it pseudo-polynomial. With integer capacities, it always terminates. With irrational capacities, it may not converge.

## When to Use

- **Simple max flow problems with small capacities**: When the max flow value is small relative to the graph size
- **Educational purposes**: The algorithm is conceptually simple and illustrates augmenting paths clearly
- **Integer capacities with small values**: The pseudo-polynomial bound is acceptable when max_flow is small
- **Graphs with few augmenting paths**: When the number of iterations is naturally small

## When NOT to Use

- **Large capacity values**: The runtime depends on the max flow value; for large capacities, use Dinic's or push-relabel instead
- **Irrational capacities**: Ford-Fulkerson may not terminate with irrational edge capacities
- **Performance-critical applications**: For production use, Dinic's algorithm (O(V^2 * E)) or push-relabel (O(V^3)) provide strongly polynomial bounds
- **Unit-capacity networks**: Dinic's runs in O(E * sqrt(V)) on unit-capacity networks, much faster

## Comparison

| Algorithm | Time | Strongly Polynomial | Notes |
|-----------|------|-------------------|-------|
| Ford-Fulkerson (DFS) | O(E * max_flow) | No | Pseudo-polynomial; simplest |
| Edmonds-Karp (BFS) | O(V * E^2) | Yes | BFS guarantees polynomial time |
| Dinic's | O(V^2 * E) | Yes | Blocking flows on level graphs |
| Push-Relabel (FIFO) | O(V^3) | Yes | Best for dense graphs |
| Capacity Scaling | O(E^2 * log(max_cap)) | Yes | Good when capacities vary widely |

## References

- Ford, L. R., & Fulkerson, D. R. (1956). "Maximal flow through a network." Canadian Journal of Mathematics, 8, 399-404.
- [Ford-Fulkerson algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Ford%E2%80%93Fulkerson_algorithm)
- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 26.

## Implementations

| Language   | File |
|------------|------|
| Python     | [ford_fulkerson.py](python/ford_fulkerson.py) |
| Java       | [FordFulkerson.java](java/FordFulkerson.java) |
| C++        | [ford_fulkerson.cpp](cpp/ford_fulkerson.cpp) |
| C          | [ford_fulkerson.c](c/ford_fulkerson.c) |
| Go         | [ford_fulkerson.go](go/ford_fulkerson.go) |
| TypeScript | [fordFulkerson.ts](typescript/fordFulkerson.ts) |
| Rust       | [ford_fulkerson.rs](rust/ford_fulkerson.rs) |
| Kotlin     | [FordFulkerson.kt](kotlin/FordFulkerson.kt) |
| Swift      | [FordFulkerson.swift](swift/FordFulkerson.swift) |
| Scala      | [FordFulkerson.scala](scala/FordFulkerson.scala) |
| C#         | [FordFulkerson.cs](csharp/FordFulkerson.cs) |
