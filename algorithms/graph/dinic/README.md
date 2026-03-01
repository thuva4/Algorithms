# Dinic's Algorithm

## Overview

Dinic's algorithm computes maximum flow using blocking flows on layered graphs. It alternates between BFS (to build level graph) and DFS (to find blocking flows).

## How It Works

1. Build a level graph using BFS from source.
2. Find blocking flows using DFS on the level graph.
3. Repeat until no augmenting path exists.

Input: `[n, m, src, sink, u1, v1, cap1, u2, v2, cap2, ...]`

## Worked Example

Consider a flow network with 6 vertices (source=0, sink=5):

```
       10      10
  0 -------> 1 -------> 3
  |          |           |
  | 10       | 4         | 10
  v          v           v
  2 -------> 4 -------> 5
       9           10
```

Edges: 0->1(10), 0->2(10), 1->3(10), 1->4(4), 2->4(9), 3->5(10), 4->5(10).

**Phase 1 -- BFS builds level graph:**
- Level 0: {0}
- Level 1: {1, 2}
- Level 2: {3, 4}
- Level 3: {5}

**Blocking flow via DFS:**
- Path 0->1->3->5: bottleneck = min(10,10,10) = 10. Push 10.
- Path 0->1->4->5: bottleneck = min(0,4,10) = 0. (edge 0->1 saturated)
- Path 0->2->4->5: bottleneck = min(10,9,10) = 9. Push 9.

Total flow after Phase 1: 19.

**Phase 2 -- BFS on residual graph:**
- Level 0: {0}
- Level 1: {1} (via residual edge, 0->1 has 0 remaining but residual 1->0 not useful here; actually 0->2 has 1 remaining)

Actually, 0->2 has capacity 1 remaining. BFS: 0->2(1)->4(1)->... but 4->5 has only 1 remaining. Path 0->2->4->5: push 1.

Total flow = 19 + 1 = **19** (wait -- let me recalculate: 4->5 capacity 10, used 9, remaining 1; 0->2 capacity 10, used 9, remaining 1). Push 1. Also check if 1->4 path helps: 0->... can we reach 1? 0->1 capacity 0 remaining. No.

**Maximum flow = 19.**

## Pseudocode

```
function dinic(graph, source, sink):
    totalFlow = 0

    while bfsLevelGraph(graph, source, sink):
        // Reset iteration pointers
        iter = array of size V, initialized to 0

        while true:
            pushed = dfsBlockingFlow(source, sink, INFINITY, iter)
            if pushed == 0: break
            totalFlow += pushed

    return totalFlow

function bfsLevelGraph(graph, source, sink):
    level = array of size V, initialized to -1
    level[source] = 0
    queue = [source]

    while queue is not empty:
        u = queue.dequeue()
        for each edge (u, v, capacity, flow) in graph[u]:
            if level[v] == -1 AND capacity - flow > 0:
                level[v] = level[u] + 1
                queue.enqueue(v)

    return level[sink] != -1

function dfsBlockingFlow(u, sink, pushed, iter):
    if u == sink: return pushed

    while iter[u] < len(graph[u]):
        edge = graph[u][iter[u]]
        v = edge.to
        if level[v] == level[u] + 1 AND edge.capacity - edge.flow > 0:
            d = dfsBlockingFlow(v, sink, min(pushed, edge.cap - edge.flow), iter)
            if d > 0:
                edge.flow += d
                reverseEdge.flow -= d
                return d
        iter[u]++

    return 0
```

## Complexity Analysis

| Case    | Time        | Space  |
|---------|-------------|--------|
| Best    | O(V^2 * E)  | O(V^2) |
| Average | O(V^2 * E)  | O(V^2) |
| Worst   | O(V^2 * E)  | O(V^2) |

For unit-capacity networks, the complexity improves to O(E * sqrt(V)).

## When to Use

- **Maximum flow problems**: The standard choice for computing max flow in practice
- **Bipartite matching**: Reduces to max flow and runs in O(E * sqrt(V)) on unit-capacity networks
- **Network connectivity**: Finding maximum edge-disjoint paths between two vertices
- **Competitive programming**: Preferred max flow algorithm due to strong practical performance
- **Image segmentation**: Min-cut / max-flow used in computer vision for binary labeling problems

## When NOT to Use

- **Minimum-cost flow**: Dinic's only computes maximum flow, not minimum cost flow; use SPFA-based algorithms or cost-scaling methods
- **Very dense graphs**: When V^2 * E is prohibitive, consider push-relabel (O(V^3)) which has better worst-case for dense graphs
- **Non-integer capacities**: With irrational capacities, the algorithm may not terminate; use push-relabel instead
- **Approximate solutions suffice**: For approximate max flow, nearly-linear-time algorithms exist

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Dinic's | O(V^2 * E) | O(V + E) | Best for sparse graphs and unit capacities |
| Edmonds-Karp | O(V * E^2) | O(V + E) | BFS-based Ford-Fulkerson; simpler but slower |
| Push-Relabel (FIFO) | O(V^3) | O(V + E) | Better worst-case for dense graphs |
| Ford-Fulkerson (DFS) | O(E * max_flow) | O(V + E) | Pseudo-polynomial; depends on capacity values |
| King-Rao-Tarjan | O(V * E) | O(V + E) | Theoretically optimal but complex to implement |

## References

- Dinic, E. A. (1970). "Algorithm for solution of a problem of maximum flow in networks with power estimation." Soviet Mathematics Doklady, 11, 1277-1280.
- Even, S., & Tarjan, R. E. (1975). "Network flow and testing graph connectivity." SIAM Journal on Computing, 4(4), 507-518.
- [Dinic's algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Dinic%27s_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [dinic.py](python/dinic.py) |
| Java       | [Dinic.java](java/Dinic.java) |
| C++        | [dinic.cpp](cpp/dinic.cpp) |
| C          | [dinic.c](c/dinic.c) |
| Go         | [dinic.go](go/dinic.go) |
| TypeScript | [dinic.ts](typescript/dinic.ts) |
| Rust       | [dinic.rs](rust/dinic.rs) |
| Kotlin     | [Dinic.kt](kotlin/Dinic.kt) |
| Swift      | [Dinic.swift](swift/Dinic.swift) |
| Scala      | [Dinic.scala](scala/Dinic.scala) |
| C#         | [Dinic.cs](csharp/Dinic.cs) |
