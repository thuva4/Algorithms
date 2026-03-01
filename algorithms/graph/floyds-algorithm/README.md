# Floyd-Warshall Algorithm

## Overview

The Floyd-Warshall Algorithm is a dynamic programming algorithm that finds the shortest paths between all pairs of vertices in a weighted graph. It works with both positive and negative edge weights (but not negative cycles) and computes the entire distance matrix in O(V^3) time. The algorithm systematically considers every vertex as a potential intermediate point on paths between every pair of vertices, progressively improving the shortest path estimates.

Floyd-Warshall is one of the most elegant graph algorithms, fitting in just a triple-nested loop. It is ideal for dense graphs and situations where all-pairs shortest path information is needed, such as in routing tables, transitive closure computation, and network analysis.

## How It Works

Floyd-Warshall uses a V x V distance matrix where `dist[i][j]` represents the shortest known distance from vertex i to vertex j. Initially, `dist[i][j]` is set to the weight of the edge from i to j (or infinity if no direct edge exists), and `dist[i][i] = 0`. The algorithm then considers each vertex k as an intermediate vertex. For every pair (i, j), it checks whether the path through k is shorter than the current best path: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.

### Example

Consider the following weighted directed graph:

```
        3        1
    1 -----> 2 -----> 3
    |                 ^
    |       7         |
    +-----------------+

    Also: 2 --(-2)--> 1 (edge with weight -2 from 2 to 1...
    Let's use a simpler example)
```

Let's use a 4-vertex graph:

```
    1 --3--> 2
    |        |
    7        1
    |        |
    v        v
    4 <--2-- 3

    Also: 1 --10--> 4 (direct edge)
```

Edge list: `(1,2,3), (1,4,10), (2,3,1), (3,4,2)`

**Initial distance matrix:**

|   | 1   | 2   | 3   | 4   |
|---|-----|-----|-----|-----|
| 1 | 0   | 3   | inf | 10  |
| 2 | inf | 0   | 1   | inf |
| 3 | inf | inf | 0   | 2   |
| 4 | inf | inf | inf | 0   |

**After k=1 (considering vertex 1 as intermediate):**

No improvements since vertex 1 has no incoming edges from other vertices (except itself).

**After k=2 (considering vertex 2 as intermediate):**

- dist[1][3] = min(inf, dist[1][2] + dist[2][3]) = min(inf, 3+1) = 4

|   | 1   | 2   | 3   | 4   |
|---|-----|-----|-----|-----|
| 1 | 0   | 3   | 4   | 10  |
| 2 | inf | 0   | 1   | inf |
| 3 | inf | inf | 0   | 2   |
| 4 | inf | inf | inf | 0   |

**After k=3 (considering vertex 3 as intermediate):**

- dist[1][4] = min(10, dist[1][3] + dist[3][4]) = min(10, 4+2) = 6
- dist[2][4] = min(inf, dist[2][3] + dist[3][4]) = min(inf, 1+2) = 3

|   | 1   | 2   | 3   | 4   |
|---|-----|-----|-----|-----|
| 1 | 0   | 3   | 4   | 6   |
| 2 | inf | 0   | 1   | 3   |
| 3 | inf | inf | 0   | 2   |
| 4 | inf | inf | inf | 0   |

**After k=4:** No further improvements.

Result: The shortest path from 1 to 4 is 6 (via 1->2->3->4), not the direct edge of weight 10.

## Pseudocode

```
function floydWarshall(graph, V):
    // Initialize distance matrix
    dist = V x V matrix, all infinity
    for each vertex v:
        dist[v][v] = 0
    for each edge (u, v, weight):
        dist[u][v] = weight

    // Main algorithm
    for k from 1 to V:
        for i from 1 to V:
            for j from 1 to V:
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    return dist
```

The order of the loops is critical: the outermost loop must iterate over the intermediate vertex k. This ensures that when considering vertex k, all paths using only vertices 1 through k-1 as intermediates have already been computed.

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(V^3) | O(V^2) |
| Average | O(V^3) | O(V^2) |
| Worst   | O(V^3) | O(V^2) |

**Why these complexities?**

- **Best Case -- O(V^3):** The algorithm always executes the triple-nested loop fully, regardless of the graph structure. There are V iterations for each of the three loops, giving exactly V^3 iterations.

- **Average Case -- O(V^3):** The number of iterations is always V^3, independent of the edge density or graph topology. Each iteration performs a constant amount of work (one addition and one comparison).

- **Worst Case -- O(V^3):** Same as the best and average cases. The algorithm is insensitive to input characteristics, always performing V^3 iterations.

- **Space -- O(V^2):** The distance matrix requires V^2 entries. The algorithm can be implemented in-place, modifying the matrix directly without needing additional space beyond the matrix itself.

## When to Use

- **All-pairs shortest paths:** When you need the shortest distance between every pair of vertices, Floyd-Warshall computes the entire matrix in one pass.
- **Dense graphs:** For dense graphs where E is close to V^2, Floyd-Warshall's O(V^3) is competitive with running Dijkstra's V times (O(V(V+E) log V)).
- **Graphs with negative weights:** Floyd-Warshall handles negative edge weights correctly (and can detect negative cycles by checking if any `dist[i][i] < 0`).
- **Transitive closure:** A boolean version of Floyd-Warshall determines reachability between all pairs of vertices.
- **Small to medium graphs:** For graphs with up to ~1000 vertices, Floyd-Warshall is simple, fast, and easy to implement correctly.

## When NOT to Use

- **Single-source shortest paths:** If you only need shortest paths from one source, Dijkstra's (O((V+E) log V)) or Bellman-Ford (O(VE)) is much more efficient than Floyd-Warshall's O(V^3).
- **Very large sparse graphs:** For sparse graphs with many vertices, Johnson's Algorithm (O(V^2 log V + VE)) is faster than Floyd-Warshall.
- **Memory-constrained environments:** The O(V^2) distance matrix can be prohibitive for very large graphs. A graph with 100,000 vertices would require ~80 GB for a 64-bit distance matrix.
- **Graphs with negative cycles:** Floyd-Warshall can detect negative cycles but does not produce meaningful shortest paths when they exist.

## Comparison with Similar Algorithms

| Algorithm      | Time              | Space  | All-Pairs | Negative Weights | Notes |
|----------------|-------------------|--------|-----------|-----------------|-------|
| Floyd-Warshall | O(V^3)            | O(V^2) | Yes       | Yes             | Simple; best for dense graphs |
| Dijkstra's (V times) | O(V(V+E) log V) | O(V) | Yes   | No              | Better for sparse, non-negative |
| Johnson's      | O(V^2 log V + VE) | O(V^2) | Yes       | Yes             | Best for sparse with negative weights |
| Bellman-Ford   | O(VE)             | O(V)   | No        | Yes             | Single-source only             |

## Implementations

| Language | File |
|----------|------|
| C        | [FloydsAlgo.c](c/FloydsAlgo.c) |
| C++      | [FloydsAlgorithm.cpp](cpp/FloydsAlgorithm.cpp) |
| Go       | [FlyodsAlgorithm.go](go/FlyodsAlgorithm.go) |
| Java     | [AllPairShortestPath.java](java/AllPairShortestPath.java) |
| Python   | [Python.py](python/Python.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 25: All-Pairs Shortest Paths (Section 25.2: The Floyd-Warshall Algorithm).
- Floyd, R. W. (1962). "Algorithm 97: Shortest path". *Communications of the ACM*. 5(6): 345.
- [Floyd-Warshall Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
