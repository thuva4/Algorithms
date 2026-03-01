# Max Flow (Edmonds-Karp)

## Overview

The Edmonds-Karp algorithm computes the maximum flow in a flow network using BFS to find augmenting paths. It is a specific implementation of the Ford-Fulkerson method that guarantees polynomial time complexity by always choosing the shortest augmenting path (in terms of number of edges). The Max-Flow Min-Cut Theorem states that the maximum flow from source to sink equals the minimum cut capacity separating them.

## How It Works

1. Initialize all flows to zero. Build a residual graph with forward edges (remaining capacity) and backward edges (flow that can be cancelled).
2. Use BFS to find the shortest augmenting path from source to sink in the residual graph.
3. Find the bottleneck capacity along the path (minimum residual capacity).
4. Update residual capacities: subtract bottleneck from forward edges, add to backward edges.
5. Add the bottleneck to total flow.
6. Repeat until no augmenting path exists.
7. Return the total max flow.

Input: `[n, m, src, sink, u1, v1, cap1, u2, v2, cap2, ...]`

## Worked Example

```
Graph with 4 vertices, source=0, sink=3:
    0 --(10)--> 1
    0 --(10)--> 2
    1 --(4)---> 2
    1 --(8)---> 3
    2 --(9)---> 3
```

**Iteration 1:** BFS finds path 0 -> 1 -> 3, bottleneck = min(10, 8) = 8. Flow = 8.
**Iteration 2:** BFS finds path 0 -> 2 -> 3, bottleneck = min(10, 9) = 9. Flow = 8 + 9 = 17.
**Iteration 3:** BFS finds path 0 -> 1 -> 2 -> 3, bottleneck = min(2, 4, 0) = 0. No more augmenting paths with positive capacity after adjusting.

Actually, let us trace more carefully:

After iteration 1: residual capacities: 0->1: 2, 1->3: 0, 1->0: 8, 3->1: 8
After iteration 2: residual capacities: 0->2: 1, 2->3: 0, 2->0: 9, 3->2: 9
Iteration 3: BFS finds 0 -> 1 -> 2 -> 3, bottleneck = min(2, 4, 0). 2->3 has 0 capacity remaining.
So BFS finds no more augmenting paths.

**Maximum flow = 17.**

The minimum cut separates {0, 1} from {2, 3} with edges 1->2 (cap 4 unused partly) and 0->2 (cap 10) and 1->3 (cap 8), but the minimum cut is actually {0} vs {1,2,3} with capacity 10+10 = 20 or the actual min-cut matching the flow of 17.

## Pseudocode

```
function edmondsKarp(capacity, source, sink, n):
    flow = 0
    residual = copy of capacity matrix

    while true:
        // BFS to find augmenting path
        parent = array of size n, all -1
        parent[source] = source
        queue = [source]

        while queue is not empty and parent[sink] == -1:
            u = queue.dequeue()
            for v = 0 to n-1:
                if parent[v] == -1 and residual[u][v] > 0:
                    parent[v] = u
                    queue.enqueue(v)

        if parent[sink] == -1:
            break   // no augmenting path

        // Find bottleneck
        bottleneck = INF
        v = sink
        while v != source:
            u = parent[v]
            bottleneck = min(bottleneck, residual[u][v])
            v = u

        // Update residual graph
        v = sink
        while v != source:
            u = parent[v]
            residual[u][v] -= bottleneck
            residual[v][u] += bottleneck
            v = u

        flow += bottleneck

    return flow
```

## Complexity Analysis

| Case    | Time     | Space  |
|---------|----------|--------|
| Best    | O(VE)    | O(V^2) |
| Average | O(VE^2)  | O(V^2) |
| Worst   | O(VE^2)  | O(V^2) |

Each BFS takes O(E) time. The number of augmenting paths is bounded by O(VE) because each shortest path length can increase at most V times, and at each distance level there are at most E augmenting paths.

## When to Use

- Network bandwidth optimization
- Bipartite matching (reduction to max-flow)
- Project selection and scheduling
- Image segmentation (graph cuts)
- Transportation and logistics flow planning
- Baseball elimination problem

## When NOT to Use

- When the graph is very large and dense -- Dinic's algorithm or Push-Relabel are faster in practice.
- When you need minimum cost flow -- use MCMF algorithms (Successive Shortest Paths, etc.).
- When the capacities are very large integers -- the algorithm may be slow; consider scaling-based approaches.
- For simple bipartite matching -- Hopcroft-Karp is more efficient than reducing to max-flow.

## Comparison

| Algorithm | Time | Notes |
|-----------|------|-------|
| Edmonds-Karp (this) | O(VE^2) | BFS-based; simple to implement |
| Ford-Fulkerson (DFS) | O(E * maxFlow) | Not polynomial; can be slow with large capacities |
| Dinic's | O(V^2 * E) | Faster in practice using level graphs and blocking flows |
| Push-Relabel | O(V^2 * E) or O(V^3) | Best for dense graphs; good practical performance |
| Capacity Scaling | O(E^2 * log(maxCap)) | Good when capacities vary widely |

## References

- Edmonds, J., & Karp, R. M. (1972). "Theoretical improvements in algorithmic efficiency for network flow problems." *Journal of the ACM*, 19(2), 248-264.
- Ford, L. R., & Fulkerson, D. R. (1956). "Maximal flow through a network." *Canadian Journal of Mathematics*, 8, 399-404.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 26.
- [Edmonds-Karp algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [max_flow_min_cut.py](python/max_flow_min_cut.py) |
| Java       | [MaxFlowMinCut.java](java/MaxFlowMinCut.java) |
| C++        | [max_flow_min_cut.cpp](cpp/max_flow_min_cut.cpp) |
| C          | [max_flow_min_cut.c](c/max_flow_min_cut.c) |
| Go         | [max_flow_min_cut.go](go/max_flow_min_cut.go) |
| TypeScript | [maxFlowMinCut.ts](typescript/maxFlowMinCut.ts) |
| Rust       | [max_flow_min_cut.rs](rust/max_flow_min_cut.rs) |
| Kotlin     | [MaxFlowMinCut.kt](kotlin/MaxFlowMinCut.kt) |
| Swift      | [MaxFlowMinCut.swift](swift/MaxFlowMinCut.swift) |
| Scala      | [MaxFlowMinCut.scala](scala/MaxFlowMinCut.scala) |
| C#         | [MaxFlowMinCut.cs](csharp/MaxFlowMinCut.cs) |
