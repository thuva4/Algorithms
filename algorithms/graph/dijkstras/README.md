# Dijkstra's Algorithm

## Overview

Dijkstra's Algorithm is a greedy graph algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights. Developed by Edsger W. Dijkstra in 1956 and published in 1959, it is one of the most important and widely used algorithms in computer science. The algorithm works by iteratively selecting the unvisited vertex with the smallest known distance, updating the distances of its neighbors, and marking it as visited.

When implemented with a priority queue (min-heap), Dijkstra's Algorithm achieves O((V+E) log V) time complexity, making it efficient for sparse graphs. It is the foundation for many real-world routing and navigation systems.

## How It Works

Dijkstra's Algorithm initializes the distance to the source as 0 and all other distances as infinity. It uses a priority queue to always process the vertex with the smallest tentative distance next. For each processed vertex, it examines all outgoing edges and relaxes them -- if a shorter path to a neighbor is found through the current vertex, the neighbor's distance is updated. Once a vertex is dequeued and processed, its shortest distance is finalized.

### Example

Consider the following weighted directed graph:

```
        2       3
    A -----> B -----> D
    |        ^        ^
    |  1     |  1     |
    +------> C -------+
         4        5
    A ---------> D (direct edge)
```

Adjacency list (with weights):
```
A: [(B, 2), (C, 1), (D, 4)]
B: [(D, 3)]
C: [(B, 1), (D, 5)]
D: []
```

**Dijkstra's from source `A`:**

Initial distances: `A=0, B=inf, C=inf, D=inf`

| Step | Dequeue (vertex, dist) | Relaxation | Updated Distances |
|------|----------------------|------------|-------------------|
| 1 | `(A, 0)` | A->B: 0+2=2 < inf, A->C: 0+1=1 < inf, A->D: 0+4=4 < inf | `A=0, B=2, C=1, D=4` |
| 2 | `(C, 1)` | C->B: 1+1=2 = 2 (no change), C->D: 1+5=6 > 4 (no change) | `A=0, B=2, C=1, D=4` |
| 3 | `(B, 2)` | B->D: 2+3=5 > 4 (no change) | `A=0, B=2, C=1, D=4` |
| 4 | `(D, 4)` | No outgoing edges | `A=0, B=2, C=1, D=4` |

Result: Shortest distances from A: `A=0, B=2, C=1, D=4`

Shortest paths: `A->A: 0`, `A->C: 1`, `A->B: 2` (via A->B or A->C->B), `A->D: 4` (via A->D)

## Pseudocode

```
function dijkstra(graph, source):
    dist = map of vertex -> infinity for all vertices
    dist[source] = 0
    priorityQueue = empty min-heap
    priorityQueue.insert(source, 0)

    while priorityQueue is not empty:
        (u, d) = priorityQueue.extractMin()

        if d > dist[u]:
            continue  // skip stale entries

        for each (v, weight) in graph[u]:
            newDist = dist[u] + weight
            if newDist < dist[v]:
                dist[v] = newDist
                priorityQueue.insert(v, newDist)

    return dist
```

The "skip stale entries" check handles the fact that we may insert the same vertex multiple times with different distances. Only the entry with the current shortest distance is processed.

## Complexity Analysis

| Case    | Time              | Space |
|---------|-------------------|-------|
| Best    | O((V+E) log V)    | O(V)  |
| Average | O((V+E) log V)    | O(V)  |
| Worst   | O((V+E) log V)    | O(V)  |

**Why these complexities?**

- **Best Case -- O((V+E) log V):** Even in the best case, every vertex must be extracted from the priority queue (V extractions, each O(log V)) and every edge must be examined for relaxation (E edge examinations, each potentially causing an O(log V) insertion). This gives O(V log V + E log V) = O((V+E) log V).

- **Average Case -- O((V+E) log V):** The analysis is the same. Each vertex is processed once, and each edge is relaxed at most once. The priority queue operations dominate the running time.

- **Worst Case -- O((V+E) log V):** In the worst case, every edge causes a priority queue insertion, leading to at most E insertions. With a binary heap, each insertion and extraction is O(log V). Using a Fibonacci heap improves this to O(V log V + E), but Fibonacci heaps are rarely used in practice due to high constant factors.

- **Space -- O(V):** The distance array and priority queue both require O(V) space. The priority queue may temporarily hold more than V entries (up to E in the worst case), but this is bounded by O(V) in practice with lazy deletion.

## When to Use

- **Single-source shortest paths with non-negative weights:** Dijkstra's is the standard algorithm for this problem and is used in GPS navigation, network routing (OSPF protocol), and more.
- **Sparse graphs:** With a priority queue implementation, Dijkstra's is efficient on sparse graphs where E is much smaller than V^2.
- **When only one source is needed:** If you need shortest paths from a single source, Dijkstra's is more efficient than all-pairs algorithms like Floyd-Warshall.
- **Real-time applications:** Dijkstra's algorithm can be stopped early once the target vertex is dequeued, providing the shortest path to a specific destination without processing the entire graph.

## When NOT to Use

- **Graphs with negative edge weights:** Dijkstra's Algorithm does not work correctly with negative weights because it assumes that once a vertex is processed, its distance is final. Use Bellman-Ford for graphs with negative weights.
- **All-pairs shortest paths:** If you need shortest paths between all pairs of vertices, Floyd-Warshall (O(V^3)) or Johnson's Algorithm may be more appropriate.
- **Unweighted graphs:** BFS is simpler and equally effective for finding shortest paths in unweighted graphs.
- **Dense graphs:** For very dense graphs (E close to V^2), a simple O(V^2) implementation without a priority queue may be faster than the O((V+E) log V) heap-based version.

## Comparison with Similar Algorithms

| Algorithm      | Time              | Space  | Handles Negative Weights | Notes                                    |
|----------------|-------------------|--------|-------------------------|------------------------------------------|
| Dijkstra's     | O((V+E) log V)    | O(V)   | No                      | Fast single-source; non-negative weights |
| Bellman-Ford   | O(VE)             | O(V)   | Yes                     | Detects negative cycles                  |
| Floyd-Warshall | O(V^3)            | O(V^2) | Yes                     | All-pairs shortest paths                 |
| A* Search      | O(E)              | O(V)   | No                      | Uses heuristic; faster with good heuristic |
| BFS            | O(V+E)            | O(V)   | N/A (unweighted)        | Optimal for unweighted graphs            |

## Implementations

| Language   | File |
|------------|------|
| C++        | [Dijkstras.cpp](cpp/Dijkstras.cpp) |
| C++        | [dijkstra_list.cc](cpp/dijkstra_list.cc) |
| C#         | [Dijkstras.cs](csharp/Dijkstras.cs) |
| Go         | [Dijkstra.go](go/Dijkstra.go) |
| Java       | [Dijkstra.java](java/Dijkstra.java) |
| Python     | [Dijakstra.py](python/Dijakstra.py) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 24: Single-Source Shortest Paths (Section 24.3: Dijkstra's Algorithm).
- Dijkstra, E. W. (1959). "A note on two problems in connexion with graphs". *Numerische Mathematik*. 1: 269-271.
- [Dijkstra's Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm)
