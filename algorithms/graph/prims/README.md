# Prim's Algorithm

## Overview

Prim's Algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a connected, undirected, weighted graph. Starting from an arbitrary vertex, it grows the MST one vertex at a time by always adding the cheapest edge that connects a vertex in the tree to a vertex outside the tree. This vertex-centric approach, combined with a priority queue, makes Prim's Algorithm particularly efficient for dense graphs.

Developed by Vojtech Jarnik in 1930 and independently rediscovered by Robert C. Prim in 1957 and Edsger W. Dijkstra in 1959, the algorithm is closely related to Dijkstra's shortest path algorithm in its structure and implementation.

## How It Works

Prim's Algorithm starts by adding an arbitrary vertex to the MST. It then maintains a priority queue of edges connecting MST vertices to non-MST vertices. At each step, it extracts the minimum-weight edge from the queue, adds the new vertex to the MST, and inserts all edges from the new vertex to its non-MST neighbors into the priority queue. The process repeats until all vertices are included in the MST.

### Example

Consider the following undirected weighted graph:

```
        1       4
    A ----- B ----- C
    |       |       |
    3       2       5
    |       |       |
    D ----- E ----- F
        6       7
```

**Prim's starting from vertex `A`:**

| Step | Add Vertex | Edge Added | Weight | Priority Queue (min edges to non-MST) | MST Vertices |
|------|-----------|------------|--------|---------------------------------------|--------------|
| 1 | `A` | -- | -- | `[(B,1), (D,3)]` | {A} |
| 2 | `B` | (A,B) | 1 | `[(E,2), (D,3), (C,4)]` | {A, B} |
| 3 | `E` | (B,E) | 2 | `[(D,3), (C,4), (D,6), (F,7)]` | {A, B, E} |
| 4 | `D` | (A,D) | 3 | `[(C,4), (F,7)]` | {A, B, D, E} |
| 5 | `C` | (B,C) | 4 | `[(F,5)]` | {A, B, C, D, E} |
| 6 | `F` | (C,F) | 5 | `[]` | {A, B, C, D, E, F} |

Result: MST edges: `(A,B,1), (B,E,2), (A,D,3), (B,C,4), (C,F,5)`. Total weight: 1+2+3+4+5 = 15.

```
MST:
        1       4
    A ----- B ----- C
    |       |       |
    3       2       5
    |       |       |
    D       E       F
```

## Pseudocode

```
function prim(graph, V):
    inMST = array of size V, initialized to false
    key = array of size V, initialized to infinity  // minimum edge weight to reach each vertex
    parent = array of size V, initialized to -1
    key[0] = 0  // start from vertex 0

    priorityQueue = min-heap
    priorityQueue.insert(0, 0)  // (vertex, key)

    while priorityQueue is not empty:
        u = priorityQueue.extractMin()

        if inMST[u]:
            continue
        inMST[u] = true

        for each (v, weight) in graph[u]:
            if not inMST[v] and weight < key[v]:
                key[v] = weight
                parent[v] = u
                priorityQueue.insert(v, weight)

    return parent  // MST represented by parent array
```

The algorithm is structurally almost identical to Dijkstra's Algorithm. The key difference is that Prim's uses edge weight directly as the priority, while Dijkstra's uses cumulative distance from the source.

## Complexity Analysis

| Case    | Time        | Space |
|---------|-------------|-------|
| Best    | O(E log V)  | O(V)  |
| Average | O(E log V)  | O(V)  |
| Worst   | O(E log V)  | O(V)  |

**Why these complexities?**

- **Best Case -- O(E log V):** Every edge is potentially examined once and may trigger a priority queue operation. With a binary heap, each insertion and extraction is O(log V). There are at most V extract-min operations and E decrease-key/insert operations, giving O((V+E) log V) = O(E log V) for connected graphs where E >= V-1.

- **Average Case -- O(E log V):** The analysis is the same. Each edge is examined exactly once (for undirected graphs, each edge is examined from both endpoints). The priority queue operations dominate.

- **Worst Case -- O(E log V):** With a binary heap, the worst case is O(E log V). Using a Fibonacci heap improves this to O(E + V log V), which is better for dense graphs but rarely used in practice due to high constant factors.

- **Space -- O(V):** The key array, parent array, and inMST array each require O(V) space. The priority queue holds at most V entries.

## When to Use

- **Dense graphs:** For dense graphs where E is close to V^2, Prim's O(E log V) is competitive, and with a Fibonacci heap, it achieves O(E + V log V).
- **When starting from a specific vertex:** Prim's naturally grows the MST from a chosen starting point, which can be useful when the starting location matters.
- **Adjacency list/matrix representation:** Prim's works well with both representations, though it is especially natural with adjacency lists.
- **Real-time MST construction:** Since Prim's builds the MST incrementally from one component, it can provide partial results during execution.
- **Network design with a starting hub:** When designing a network that must grow outward from a central node.

## When NOT to Use

- **Sparse graphs:** For very sparse graphs (E close to V), Kruskal's Algorithm with its O(E log E) complexity may be simpler and faster.
- **When edges are pre-sorted:** Kruskal's can take advantage of pre-sorted edges, while Prim's cannot.
- **Disconnected graphs:** Prim's Algorithm finds the MST of a single connected component. For disconnected graphs, it must be run on each component separately.
- **Directed graphs:** MST is defined for undirected graphs only. For directed graphs, use specialized arborescence algorithms.

## Comparison with Similar Algorithms

| Algorithm  | Time             | Space | Approach | Notes                                    |
|------------|------------------|-------|----------|------------------------------------------|
| Prim's     | O(E log V)       | O(V)  | Vertex-centric | Grows MST from a single vertex           |
| Kruskal's  | O(E log E)       | O(V)  | Edge-centric   | Sorts all edges; uses Union-Find         |
| Boruvka's  | O(E log V)       | O(V)  | Component-based | Contracts components iteratively         |
| Dijkstra's | O((V+E) log V)   | O(V)  | Vertex-centric | Same structure; finds shortest paths instead |

## Implementations

| Language | File |
|----------|------|
| C++      | [prims.cpp](cpp/prims.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 23: Minimum Spanning Trees (Section 23.2: The Algorithms of Kruskal and Prim).
- Prim, R. C. (1957). "Shortest connection networks and some generalizations". *Bell System Technical Journal*. 36(6): 1389-1401.
- [Prim's Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Prim%27s_algorithm)
