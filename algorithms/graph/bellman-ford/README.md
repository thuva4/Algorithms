# Bellman-Ford Algorithm

## Overview

The Bellman-Ford Algorithm computes the shortest paths from a single source vertex to all other vertices in a weighted directed graph. Unlike Dijkstra's Algorithm, Bellman-Ford can handle graphs with negative edge weights and is capable of detecting negative-weight cycles -- cycles whose total weight is negative, which would make shortest paths undefined. The algorithm works by repeatedly relaxing all edges, guaranteeing that after V-1 iterations (where V is the number of vertices), all shortest path distances have been correctly computed.

Named after Richard Bellman and Lester Ford Jr., this algorithm is fundamental in network routing (used in the distance-vector routing protocol RIP) and serves as a subroutine in Johnson's Algorithm for all-pairs shortest paths.

## How It Works

Bellman-Ford initializes all distances to infinity except the source (distance 0). It then performs V-1 iterations, where each iteration relaxes every edge in the graph. Relaxing an edge (u, v) with weight w means checking if `dist[u] + w < dist[v]`, and if so, updating `dist[v]`. After V-1 iterations, if any edge can still be relaxed, the graph contains a negative-weight cycle.

### Example

Consider the following weighted directed graph:

```
        6        -1
    A -----> B ------> C
    |        ^         |
    |  7     | -2      | 5
    v        |         v
    D -----> E <------ C
        8        5

    A --7--> D --8--> E ---(-2)--> B
```

Edge list (with weights):
```
(A, B, 6), (A, D, 7), (B, C, -1), (C, E, 5), (D, E, 8), (E, B, -2)
```

**Bellman-Ford from source `A`:**

Initial distances: `A=0, B=inf, C=inf, D=inf, E=inf`

**Iteration 1:** (Relax all edges)

| Edge | Check | Update? | Distances |
|------|-------|---------|-----------|
| (A,B,6) | 0+6=6 < inf | Yes, B=6 | `A=0, B=6, C=inf, D=inf, E=inf` |
| (A,D,7) | 0+7=7 < inf | Yes, D=7 | `A=0, B=6, C=inf, D=7, E=inf` |
| (B,C,-1) | 6+(-1)=5 < inf | Yes, C=5 | `A=0, B=6, C=5, D=7, E=inf` |
| (C,E,5) | 5+5=10 < inf | Yes, E=10 | `A=0, B=6, C=5, D=7, E=10` |
| (D,E,8) | 7+8=15 > 10 | No | `A=0, B=6, C=5, D=7, E=10` |
| (E,B,-2) | 10+(-2)=8 > 6 | No | `A=0, B=6, C=5, D=7, E=10` |

**Iteration 2:** (Relax all edges again)

| Edge | Check | Update? | Distances |
|------|-------|---------|-----------|
| All edges | No further improvements | No | `A=0, B=6, C=5, D=7, E=10` |

**Negative cycle check (Iteration V):** No edge can be relaxed further, so no negative cycle exists.

Result: Shortest distances from A: `A=0, B=6, C=5, D=7, E=10`

## Pseudocode

```
function bellmanFord(graph, source, V):
    dist = array of size V, initialized to infinity
    dist[source] = 0

    // Relax all edges V-1 times
    for i from 1 to V - 1:
        for each edge (u, v, weight) in graph:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight

    // Check for negative-weight cycles
    for each edge (u, v, weight) in graph:
        if dist[u] + weight < dist[v]:
            report "Negative-weight cycle detected"

    return dist
```

The V-1 iterations guarantee correctness because the shortest path from the source to any vertex contains at most V-1 edges. Each iteration extends the shortest paths by one more edge.

## Complexity Analysis

| Case    | Time  | Space |
|---------|-------|-------|
| Best    | O(VE) | O(V)  |
| Average | O(VE) | O(V)  |
| Worst   | O(VE) | O(V)  |

**Why these complexities?**

- **Best Case -- O(VE):** The standard algorithm always performs V-1 iterations, each examining all E edges, regardless of whether early termination is possible. An optimized version can terminate early if no relaxation occurs in an iteration, giving O(E) in the best case, but the standard version is O(VE).

- **Average Case -- O(VE):** On average, the algorithm still performs multiple iterations over all edges. While many practical graphs converge faster, the guaranteed bound is O(VE).

- **Worst Case -- O(VE):** The algorithm performs exactly V-1 iterations, each examining all E edges. This occurs when the shortest path to the last vertex requires V-1 edges and edges are processed in an unfavorable order.

- **Space -- O(V):** The algorithm uses a distance array of size V and optionally a predecessor array of size V for path reconstruction. No additional data structures are needed.

## When to Use

- **Graphs with negative edge weights:** Bellman-Ford correctly handles negative weights, unlike Dijkstra's Algorithm.
- **Negative cycle detection:** Bellman-Ford can detect if a negative-weight cycle is reachable from the source, which is critical in financial arbitrage detection and network analysis.
- **Distance-vector routing:** The algorithm is used in RIP (Routing Information Protocol) where each router maintains a distance table and shares it with neighbors.
- **As a subroutine in Johnson's Algorithm:** Johnson's Algorithm uses Bellman-Ford to reweight edges, enabling Dijkstra's to work on graphs with negative weights.
- **When simplicity matters:** Bellman-Ford is simpler to implement than Dijkstra's (no priority queue needed), making it easier to verify correctness.

## When NOT to Use

- **Graphs with only non-negative weights:** Dijkstra's Algorithm is significantly faster at O((V+E) log V) compared to O(VE).
- **Large, sparse graphs without negative weights:** The O(VE) complexity makes Bellman-Ford impractical for large graphs when faster alternatives exist.
- **All-pairs shortest paths:** Use Floyd-Warshall (O(V^3)) or Johnson's Algorithm instead of running Bellman-Ford from every vertex.
- **Real-time applications:** The O(VE) time is too slow for applications requiring near-instant responses on large graphs.

## Comparison with Similar Algorithms

| Algorithm      | Time              | Space  | Negative Weights | Negative Cycle Detection | Notes |
|----------------|-------------------|--------|-----------------|-------------------------|-------|
| Bellman-Ford   | O(VE)             | O(V)   | Yes             | Yes                     | Simple; handles negative weights |
| Dijkstra's     | O((V+E) log V)    | O(V)   | No              | No                      | Faster; non-negative weights only |
| Floyd-Warshall | O(V^3)            | O(V^2) | Yes             | Yes                     | All-pairs; dense graphs          |
| Johnson's      | O(V^2 log V + VE) | O(V^2) | Yes             | Yes                     | All-pairs; sparse graphs         |

## Implementations

| Language | File |
|----------|------|
| C++      | [bellmanford.cpp](cpp/bellmanford.cpp) |
| C++      | [bellmanford_robertpoziumschi.cpp](cpp/bellmanford_robertpoziumschi.cpp) |
| C#       | [BellmanFord.cs](csharp/BellmanFord.cs) |
| Java     | [BellmanFord.java](java/BellmanFord.java) |
| Python   | [BellmanFord.py](python/BellmanFord.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 24: Single-Source Shortest Paths (Section 24.1: The Bellman-Ford Algorithm).
- Bellman, R. (1958). "On a routing problem". *Quarterly of Applied Mathematics*. 16: 87-90.
- [Bellman-Ford Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
