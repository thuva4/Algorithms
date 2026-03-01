# All-Pairs Shortest Path

## Overview

Computes the shortest paths between all pairs of vertices using the Floyd-Warshall algorithm. This dynamic programming approach considers each vertex as a potential intermediate node.

## How It Works

1. Initialize a distance matrix from the edge weights.
2. For each intermediate vertex k, for each pair (i, j), update dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).

Input format: `[n, m, u1, v1, w1, u2, v2, w2, ...]`
Output: shortest distance from vertex 0 to vertex n-1 (or -1 if unreachable).

## Complexity Analysis

| Case    | Time    | Space   |
|---------|---------|---------|
| Best    | O(V^3)  | O(V^2)  |
| Average | O(V^3)  | O(V^2)  |
| Worst   | O(V^3)  | O(V^2)  |

## Worked Example

Consider a directed weighted graph with 4 vertices (0-3):

```
Edges: 0->1 (3), 0->3 (7), 1->0 (8), 1->2 (2), 2->0 (5), 2->3 (1), 3->0 (2)
```

**Initial distance matrix:**

|   | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | 0 | 3 | INF | 7 |
| 1 | 8 | 0 | 2 | INF |
| 2 | 5 | INF | 0 | 1 |
| 3 | 2 | INF | INF | 0 |

**After k=0 (considering vertex 0 as intermediate):**

- dist[1][3] = min(INF, dist[1][0]+dist[0][3]) = min(INF, 8+7) = 15
- dist[2][1] = min(INF, dist[2][0]+dist[0][1]) = min(INF, 5+3) = 8
- dist[3][1] = min(INF, dist[3][0]+dist[0][1]) = min(INF, 2+3) = 5

**After k=1 (considering vertex 1):**

- dist[0][2] = min(INF, dist[0][1]+dist[1][2]) = min(INF, 3+2) = 5

**After k=2 (considering vertex 2):**

- dist[0][3] = min(7, dist[0][2]+dist[2][3]) = min(7, 5+1) = 6
- dist[1][3] = min(15, dist[1][2]+dist[2][3]) = min(15, 2+1) = 3

**After k=3 (considering vertex 3):**

- dist[1][0] = min(8, dist[1][3]+dist[3][0]) = min(8, 3+2) = 5

**Final distance matrix:**

|   | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | 0 | 3 | 5 | 6 |
| 1 | 5 | 0 | 2 | 3 |
| 2 | 3 | 6 | 0 | 1 |
| 3 | 2 | 5 | 7 | 0 |

## Pseudocode

```
function floydWarshall(n, edges):
    // Initialize distance matrix
    dist = matrix of size n x n, filled with INFINITY
    for i = 0 to n-1:
        dist[i][i] = 0

    for each edge (u, v, w) in edges:
        dist[u][v] = w

    // Main triple loop
    for k = 0 to n-1:          // intermediate vertex
        for i = 0 to n-1:      // source
            for j = 0 to n-1:  // destination
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    // Check for negative cycles: if dist[i][i] < 0 for any i
    return dist
```

## Applications

- Network routing (finding shortest paths between all routers)
- Transitive closure (reachability between all pairs)
- Detecting negative cycles (diagonal entries become negative)
- Computing the diameter of a graph
- Finding the center vertex of a graph

## When NOT to Use

- **Sparse graphs**: For sparse graphs, running Dijkstra's from each vertex gives O(V * E log V) which is much better than O(V^3) when E is much less than V^2
- **Single-source queries**: If you only need shortest paths from one source, Dijkstra's or Bellman-Ford is more efficient
- **Very large graphs**: The O(V^3) time and O(V^2) space make this impractical for graphs with thousands of vertices
- **Graphs with only non-negative weights**: Dijkstra's algorithm from each source is faster in this case

## Comparison

| Algorithm | Time | Space | Negative Weights | All Pairs |
|-----------|------|-------|-----------------|-----------|
| Floyd-Warshall | O(V^3) | O(V^2) | Yes (detects negative cycles) | Yes |
| Dijkstra (from each vertex) | O(V * E log V) | O(V + E) | No | Yes (repeated) |
| Bellman-Ford (from each vertex) | O(V^2 * E) | O(V + E) | Yes | Yes (repeated) |
| Johnson's Algorithm | O(V * E log V) | O(V + E) | Yes (with reweighting) | Yes |

## References

- Floyd, R. W. (1962). "Algorithm 97: Shortest Path." Communications of the ACM, 5(6), 345.
- Warshall, S. (1962). "A Theorem on Boolean Matrices." Journal of the ACM, 9(1), 11-12.
- [Floyd-Warshall Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [all_pairs_shortest_path.py](python/all_pairs_shortest_path.py) |
| Java       | [AllPairsShortestPath.java](java/AllPairsShortestPath.java) |
| C++        | [all_pairs_shortest_path.cpp](cpp/all_pairs_shortest_path.cpp) |
| C          | [all_pairs_shortest_path.c](c/all_pairs_shortest_path.c) |
| Go         | [all_pairs_shortest_path.go](go/all_pairs_shortest_path.go) |
| TypeScript | [allPairsShortestPath.ts](typescript/allPairsShortestPath.ts) |
| Rust       | [all_pairs_shortest_path.rs](rust/all_pairs_shortest_path.rs) |
| Kotlin     | [AllPairsShortestPath.kt](kotlin/AllPairsShortestPath.kt) |
| Swift      | [AllPairsShortestPath.swift](swift/AllPairsShortestPath.swift) |
| Scala      | [AllPairsShortestPath.scala](scala/AllPairsShortestPath.scala) |
| C#         | [AllPairsShortestPath.cs](csharp/AllPairsShortestPath.cs) |
