# Edmonds-Karp Algorithm

## Overview

The Edmonds-Karp Algorithm is an implementation of the Ford-Fulkerson method for computing the maximum flow in a flow network. It specifically uses Breadth-First Search (BFS) to find augmenting paths from the source to the sink, which guarantees polynomial time complexity of O(VE^2). The algorithm repeatedly finds the shortest augmenting path (in terms of number of edges), determines the bottleneck capacity along that path, and updates the residual graph until no more augmenting paths exist.

Developed by Jack Edmonds and Richard Karp in 1972, this algorithm is fundamental in network flow theory and has applications in bipartite matching, network routing, image segmentation, and project selection.

## How It Works

The Edmonds-Karp Algorithm operates on a residual graph that tracks remaining capacities. Starting from the source, BFS finds the shortest path (by edge count) to the sink in the residual graph. The bottleneck (minimum residual capacity along the path) determines how much flow can be pushed. The algorithm updates the residual graph by reducing forward edge capacities and increasing reverse edge capacities (to allow flow cancellation). This repeats until BFS can no longer find a path from source to sink.

### Example

Consider the following flow network (edges labeled with capacity):

```
        10       10
    S -------> A -------> T
    |          |          ^
    |   10     |  5       |
    v          v          |
    B -------> C -------> T
        5          10
```

Adjacency list with capacities:
```
S: [(A, 10), (B, 10)]
A: [(T, 10), (C, 5)]
B: [(C, 5)]
C: [(T, 10)]
```

**Iteration 1:** BFS finds path `S -> A -> T`

| Path | Bottleneck | Flow Pushed | Total Flow |
|------|-----------|-------------|------------|
| S -> A -> T | min(10, 10) = 10 | 10 | 10 |

Update residual: S->A capacity: 0, A->T capacity: 0

**Iteration 2:** BFS finds path `S -> B -> C -> T`

| Path | Bottleneck | Flow Pushed | Total Flow |
|------|-----------|-------------|------------|
| S -> B -> C -> T | min(10, 5, 10) = 5 | 5 | 15 |

Update residual: S->B capacity: 5, B->C capacity: 0, C->T capacity: 5

**Iteration 3:** BFS finds path `S -> A -> C -> T` (using remaining capacity on A->C)

| Path | Bottleneck | Flow Pushed | Total Flow |
|------|-----------|-------------|------------|
| S -> A -> C -> T | min(0, 5, 5) = 0 | 0 | 15 |

Actually, S->A has 0 residual. BFS tries `S -> B -> ...` but B->C is also 0. No more augmenting paths found.

Result: Maximum flow = 15.

## Pseudocode

```
function edmondsKarp(graph, source, sink, V):
    residual = copy of graph capacities
    maxFlow = 0

    while true:
        // BFS to find shortest augmenting path
        parent = array of size V, initialized to -1
        visited = array of size V, initialized to false
        queue = empty queue

        visited[source] = true
        queue.enqueue(source)

        while queue is not empty and not visited[sink]:
            u = queue.dequeue()
            for each vertex v adjacent to u:
                if not visited[v] and residual[u][v] > 0:
                    visited[v] = true
                    parent[v] = u
                    queue.enqueue(v)

        if not visited[sink]:
            break  // no augmenting path exists

        // Find bottleneck capacity
        pathFlow = infinity
        v = sink
        while v != source:
            u = parent[v]
            pathFlow = min(pathFlow, residual[u][v])
            v = u

        // Update residual capacities
        v = sink
        while v != source:
            u = parent[v]
            residual[u][v] -= pathFlow
            residual[v][u] += pathFlow
            v = u

        maxFlow += pathFlow

    return maxFlow
```

The reverse edges in the residual graph are crucial -- they allow the algorithm to "undo" previously pushed flow, enabling it to find the global optimum rather than getting stuck in a local optimum.

## Complexity Analysis

| Case    | Time    | Space  |
|---------|---------|--------|
| Best    | O(VE^2) | O(V^2) |
| Average | O(VE^2) | O(V^2) |
| Worst   | O(VE^2) | O(V^2) |

**Why these complexities?**

- **Best Case -- O(VE^2):** In the best case, the algorithm may terminate after very few BFS iterations if the network structure allows large bottleneck flows. However, the theoretical bound remains O(VE^2).

- **Average Case -- O(VE^2):** Each BFS takes O(E) time. The key insight of using BFS (shortest augmenting paths) is that the length of augmenting paths is non-decreasing. Since path length is at most V, and for each path length there are at most O(E) augmenting paths, the total number of augmentations is O(VE), giving O(VE) * O(E) = O(VE^2).

- **Worst Case -- O(VE^2):** The worst case occurs when many small augmentations are needed. Unlike the generic Ford-Fulkerson method (which can be non-polynomial with irrational capacities), Edmonds-Karp guarantees polynomial time.

- **Space -- O(V^2):** The residual graph is stored as an adjacency matrix (or equivalent structure) requiring O(V^2) space. The BFS queue and parent array require O(V) additional space.

## When to Use

- **Maximum flow problems:** Edmonds-Karp is a reliable algorithm for computing maximum flow in networks with reasonable size.
- **Bipartite matching:** Maximum bipartite matching can be reduced to a max-flow problem, and Edmonds-Karp provides a clean solution.
- **Minimum cut computation:** By the max-flow min-cut theorem, the maximum flow equals the minimum cut. After Edmonds-Karp terminates, vertices reachable from the source in the residual graph form one side of the minimum cut.
- **Network reliability analysis:** Determining the maximum throughput of a communication or transportation network.
- **Image segmentation:** Graph-cut based image segmentation uses max-flow algorithms to separate foreground from background.

## When NOT to Use

- **Very large networks:** For extremely large sparse networks, more advanced algorithms like Push-Relabel (O(V^2 * E)) or Dinic's Algorithm (O(V^2 * E) but often faster in practice) may be better.
- **When only connectivity matters:** If you just need to know whether a path exists, BFS or DFS is sufficient without the max-flow machinery.
- **Undirected graphs without flow semantics:** If the problem does not involve capacities or flow, simpler graph algorithms are more appropriate.
- **Real-time applications on large graphs:** The O(VE^2) complexity can be too slow for very large graphs. Consider Dinic's algorithm for better practical performance.

## Comparison with Similar Algorithms

| Algorithm      | Time       | Space  | Method | Notes                                    |
|----------------|-----------|--------|--------|------------------------------------------|
| Edmonds-Karp   | O(VE^2)   | O(V^2) | BFS augmentation | Polynomial; simple implementation    |
| Ford-Fulkerson | O(E * maxflow) | O(V^2) | Any path | May not terminate with irrational capacities |
| Dinic's        | O(V^2 * E) | O(V^2) | Blocking flows | Often faster in practice              |
| Push-Relabel   | O(V^2 * E) | O(V^2) | Local operations | Best for dense graphs                 |

## Implementations

| Language | File |
|----------|------|
| Java     | [EdmondsKarp.java](java/EdmondsKarp.java) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 26: Maximum Flow.
- Edmonds, J., & Karp, R. M. (1972). "Theoretical improvements in algorithmic efficiency for network flow problems". *Journal of the ACM*. 19(2): 248-264.
- [Edmonds-Karp Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm)
