# Kruskal's Algorithm

## Overview

Kruskal's Algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a connected, undirected, weighted graph. A minimum spanning tree connects all vertices with the minimum total edge weight while forming no cycles. Kruskal's Algorithm works by sorting all edges by weight and greedily adding the lightest edge that does not create a cycle, using a Union-Find (Disjoint Set Union) data structure to efficiently detect cycles.

Developed by Joseph Kruskal in 1956, this algorithm is one of the two classic MST algorithms (alongside Prim's). It is particularly efficient for sparse graphs and is widely used in network design, clustering, and approximation algorithms.

## How It Works

Kruskal's Algorithm starts by sorting all edges in non-decreasing order of weight. It then iterates through the sorted edges, adding each edge to the MST if it connects two different components (i.e., does not create a cycle). The Union-Find data structure tracks which vertices belong to which component, allowing cycle detection in nearly O(1) amortized time. The algorithm terminates when the MST contains V-1 edges (connecting all V vertices).

### Example

Consider the following undirected weighted graph:

```
        2       3
    A ----- B ----- C
    |       |       |
    6       8       5
    |       |       |
    D ----- E ----- F
        9       7

    Also: A--D(6), B--E(8), C--F(5), D--E(9), E--F(7)
```

Edges sorted by weight: `(A,B,2), (B,C,3), (C,F,5), (A,D,6), (E,F,7), (B,E,8), (D,E,9)`

| Step | Edge | Weight | Creates Cycle? | Action | Components |
|------|------|--------|---------------|--------|------------|
| 1 | (A,B) | 2 | No | Add to MST | {A,B}, {C}, {D}, {E}, {F} |
| 2 | (B,C) | 3 | No | Add to MST | {A,B,C}, {D}, {E}, {F} |
| 3 | (C,F) | 5 | No | Add to MST | {A,B,C,F}, {D}, {E} |
| 4 | (A,D) | 6 | No | Add to MST | {A,B,C,D,F}, {E} |
| 5 | (E,F) | 7 | No | Add to MST | {A,B,C,D,E,F} |

MST has V-1 = 5 edges. Stop.

Result: MST edges: `(A,B,2), (B,C,3), (C,F,5), (A,D,6), (E,F,7)`. Total weight: 2+3+5+6+7 = 23.

```
MST:
        2       3
    A ----- B ----- C
    |               |
    6               5
    |               |
    D       E ----- F
                7
```

## Pseudocode

```
function kruskal(graph, V):
    edges = list of all edges in graph
    sort edges by weight in ascending order

    uf = UnionFind(V)
    mst = empty list

    for each edge (u, v, weight) in edges:
        if uf.find(u) != uf.find(v):
            mst.add(edge)
            uf.union(u, v)

        if length(mst) == V - 1:
            break

    return mst

// Union-Find with path compression and union by rank
class UnionFind:
    function find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])    // path compression
        return parent[x]

    function union(x, y):
        rootX = find(x)
        rootY = find(y)
        if rank[rootX] < rank[rootY]:
            parent[rootX] = rootY
        else if rank[rootX] > rank[rootY]:
            parent[rootY] = rootX
        else:
            parent[rootY] = rootX
            rank[rootX] += 1
```

The efficiency of Kruskal's Algorithm depends heavily on the Union-Find data structure. With path compression and union by rank, the amortized cost of each find/union operation is nearly O(1), specifically O(alpha(V)) where alpha is the inverse Ackermann function.

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(E log E) | O(V)  |
| Average | O(E log E) | O(V)  |
| Worst   | O(E log E) | O(V)  |

**Why these complexities?**

- **Best Case -- O(E log E):** The sorting step dominates, requiring O(E log E) time. Even in the best case, all edges must be sorted. The Union-Find operations contribute O(E * alpha(V)), which is effectively O(E) and dominated by the sorting step.

- **Average Case -- O(E log E):** Same as the best case. Sorting is the bottleneck regardless of graph structure. Since E <= V^2, O(E log E) = O(E log V^2) = O(2E log V) = O(E log V), so these are equivalent.

- **Worst Case -- O(E log E):** The algorithm always sorts all edges and may need to examine all of them before building the MST (e.g., if the last edge considered is the one that completes the tree).

- **Space -- O(V):** The Union-Find data structure requires O(V) space for the parent and rank arrays. The edge list requires O(E) space, but this is part of the input. The MST itself uses O(V) space (V-1 edges).

## When to Use

- **Sparse graphs:** When E is much smaller than V^2, Kruskal's O(E log E) is efficient and often faster than Prim's.
- **When edges are already sorted or nearly sorted:** If edges come pre-sorted, the algorithm runs in nearly O(E * alpha(V)) time.
- **Distributed systems:** Kruskal's edge-centric approach is naturally parallelizable -- edges can be sorted in parallel.
- **Clustering:** By stopping Kruskal's before the MST is complete (e.g., stopping after V-k edges for k clusters), you get a natural k-clustering of the data.
- **Network design:** Finding the cheapest way to connect all nodes in a communication or transportation network.

## When NOT to Use

- **Dense graphs:** For dense graphs (E close to V^2), Prim's Algorithm with a Fibonacci heap (O(E + V log V)) can be faster.
- **When you need to dynamically add edges:** Kruskal's requires all edges upfront for sorting. If edges arrive dynamically, consider an online MST algorithm.
- **Directed graphs:** MST is defined for undirected graphs. For directed graphs, use Edmonds'/Chu-Liu algorithm for minimum spanning arborescences.

## Comparison with Similar Algorithms

| Algorithm  | Time              | Space | Approach | Notes                                    |
|------------|-------------------|-------|----------|------------------------------------------|
| Kruskal's  | O(E log E)        | O(V)  | Edge-centric (greedy) | Best for sparse graphs; uses Union-Find |
| Prim's     | O(E log V)        | O(V)  | Vertex-centric (greedy) | Best for dense graphs; uses priority queue |
| Boruvka's  | O(E log V)        | O(V)  | Component-based | Parallelizable; historical interest      |

## Implementations

| Language | File |
|----------|------|
| C++      | [kruskals.cpp](cpp/kruskals.cpp) |
| Java     | [Kruskals.java](java/Kruskals.java) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 23: Minimum Spanning Trees (Section 23.2: The Algorithms of Kruskal and Prim).
- Kruskal, J. B. (1956). "On the shortest spanning subtree of a graph and the traveling salesman problem". *Proceedings of the American Mathematical Society*. 7(1): 48-50.
- [Kruskal's Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm)
