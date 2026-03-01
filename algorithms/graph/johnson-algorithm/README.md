# Johnson's Algorithm

## Overview

Johnson's Algorithm finds the shortest paths between all pairs of vertices in a sparse, weighted, directed graph. It cleverly combines the Bellman-Ford Algorithm (for handling negative edge weights) with Dijkstra's Algorithm (for efficient single-source shortest paths) by reweighting all edges to be non-negative. This approach achieves O(V^2 log V + VE) time complexity, which is significantly faster than Floyd-Warshall's O(V^3) on sparse graphs where E is much less than V^2.

Developed by Donald B. Johnson in 1977, this algorithm is the preferred all-pairs shortest path algorithm for sparse graphs with negative edge weights.

## How It Works

Johnson's Algorithm proceeds in three phases:

1. **Add a virtual source vertex** `q` connected to every vertex with zero-weight edges.
2. **Run Bellman-Ford** from `q` to compute a potential function `h(v)` for each vertex. If a negative cycle is detected, report it and stop.
3. **Reweight all edges** using the formula: `w'(u,v) = w(u,v) + h(u) - h(v)`. This makes all edge weights non-negative.
4. **Run Dijkstra's** from each vertex using the reweighted edges to compute shortest paths.
5. **Convert results back** to original weights: `d(u,v) = d'(u,v) - h(u) + h(v)`.

### Example

Consider the following weighted directed graph:

```
        3       -2
    A -----> B ------> C
             ^         |
             |    4    |
             +-------- +
```

Adjacency list: `A: [(B, 3)], B: [(C, -2)], C: [(B, 4)]`

**Step 1:** Add virtual source `q` with edges to all vertices (weight 0).

```
q: [(A, 0), (B, 0), (C, 0)]
```

**Step 2:** Run Bellman-Ford from `q`:

| Vertex | h(v) |
|--------|------|
| q | 0 |
| A | 0 |
| B | 0 |
| C | -2 |

(Bellman-Ford finds: h(A)=0, h(B)=0, h(C)=0+(-2)=-2 via q->B->C)

Wait, let me recalculate. From q, all direct edges have weight 0, so initially h(A)=0, h(B)=0, h(C)=0. Then relaxing B->C: 0+(-2)=-2 < 0, so h(C)=-2. Then relaxing C->B: -2+4=2 > 0, no change. Final: h(A)=0, h(B)=0, h(C)=-2.

**Step 3:** Reweight edges: `w'(u,v) = w(u,v) + h(u) - h(v)`

| Edge | Original | Reweighted |
|------|----------|------------|
| (A,B) | 3 | 3 + 0 - 0 = 3 |
| (B,C) | -2 | -2 + 0 - (-2) = 0 |
| (C,B) | 4 | 4 + (-2) - 0 = 2 |

All reweighted edges are non-negative.

**Step 4:** Run Dijkstra's from each vertex on reweighted graph, then adjust.

Dijkstra from A (reweighted): A->B: 3, A->C: 3+0=3
Original distances: d(A,B) = 3 - h(A) + h(B) = 3 - 0 + 0 = 3, d(A,C) = 3 - h(A) + h(C) = 3 - 0 + (-2) = 1.

Dijkstra from B: B->C: 0, B->B (via C): 0+2=2
Original: d(B,C) = 0 - 0 + (-2) = -2, d(B,B) = 0.

Dijkstra from C: C->B: 2, C->C (via B): 2+0=2
Original: d(C,B) = 2 - (-2) + 0 = 4, d(C,C) = 0.

Result: All-pairs shortest distances computed correctly, including the negative edge B->C.

## Pseudocode

```
function johnson(graph, V):
    // Step 1: Add virtual source q
    for each vertex v in graph:
        add edge (q, v, 0)

    // Step 2: Run Bellman-Ford from q
    h = bellmanFord(graph, q, V + 1)
    if h == "negative cycle":
        report "Graph contains a negative-weight cycle"
        return

    // Step 3: Reweight edges
    for each edge (u, v, w) in graph:
        w' = w + h[u] - h[v]

    // Step 4: Run Dijkstra from each vertex
    dist = V x V matrix
    for each vertex u in graph:
        d' = dijkstra(reweighted_graph, u)
        for each vertex v:
            dist[u][v] = d'[v] - h[u] + h[v]  // convert back

    return dist
```

The reweighting preserves shortest paths: if P is a shortest path from u to v in the original graph, it remains a shortest path in the reweighted graph. The proof relies on the fact that h(v) values satisfy the triangle inequality after Bellman-Ford.

## Complexity Analysis

| Case    | Time               | Space  |
|---------|--------------------|--------|
| Best    | O(V^2 log V + VE)  | O(V^2) |
| Average | O(V^2 log V + VE)  | O(V^2) |
| Worst   | O(V^2 log V + VE)  | O(V^2) |

**Why these complexities?**

- **Best Case -- O(V^2 log V + VE):** The algorithm runs Bellman-Ford once (O(VE)) and Dijkstra's V times (O(V * (V+E) log V) = O((V^2 + VE) log V)). The total is O(VE + V^2 log V + VE log V). For sparse graphs, this simplifies to O(V^2 log V + VE).

- **Average Case -- O(V^2 log V + VE):** The analysis is deterministic. Bellman-Ford contributes O(VE) and V runs of Dijkstra's contribute O(V * (V+E) log V). For sparse graphs where E = O(V), this is O(V^2 log V).

- **Worst Case -- O(V^2 log V + VE):** In the worst case (dense graphs, E = O(V^2)), this becomes O(V^3 log V), which is worse than Floyd-Warshall's O(V^3). However, on sparse graphs, Johnson's is much faster.

- **Space -- O(V^2):** The all-pairs distance matrix requires O(V^2) space. Bellman-Ford and each Dijkstra run require O(V) space. The total space is dominated by the output matrix.

## When to Use

- **Sparse graphs with negative edge weights:** Johnson's Algorithm excels here, achieving O(V^2 log V + VE) compared to Floyd-Warshall's O(V^3).
- **All-pairs shortest paths:** When you need the distance between every pair of vertices and the graph is sparse.
- **Financial networks:** Detecting arbitrage opportunities requires handling negative edge weights (log of exchange rates) and computing all-pairs distances.
- **When Dijkstra's cannot be applied directly:** The reweighting step transforms a graph with negative weights into one suitable for Dijkstra's.

## When NOT to Use

- **Dense graphs:** For dense graphs (E close to V^2), Floyd-Warshall is simpler and has comparable or better performance at O(V^3).
- **Single-source shortest paths:** If you only need shortest paths from one source, use Bellman-Ford directly (O(VE)) or Dijkstra's if weights are non-negative.
- **Graphs without negative weights:** If all weights are non-negative, simply run Dijkstra's from each vertex (O(V(V+E) log V)) without the Bellman-Ford reweighting overhead.
- **Graphs with negative cycles:** Johnson's Algorithm can detect negative cycles (via Bellman-Ford) but cannot compute meaningful shortest paths when they exist.

## Comparison with Similar Algorithms

| Algorithm      | Time               | Space  | Negative Weights | Best For |
|----------------|-------------------|--------|-----------------|----------|
| Johnson's      | O(V^2 log V + VE) | O(V^2) | Yes             | Sparse graphs, all-pairs |
| Floyd-Warshall | O(V^3)            | O(V^2) | Yes             | Dense graphs, all-pairs  |
| Dijkstra (V times) | O(V(V+E) log V) | O(V) | No           | Non-negative weights     |
| Bellman-Ford   | O(VE)             | O(V)   | Yes             | Single-source            |

## Implementations

| Language | File |
|----------|------|
| C++      | [Johnson Algorothm.cpp](cpp/Johnson%20Algorothm.cpp) |
| Python   | [Johnson_algorithm.py](python/Johnson_algorithm.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 25: All-Pairs Shortest Paths (Section 25.3: Johnson's Algorithm for Sparse Graphs).
- Johnson, D. B. (1977). "Efficient algorithms for shortest paths in sparse networks". *Journal of the ACM*. 24(1): 1-13.
- [Johnson's Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Johnson%27s_algorithm)
