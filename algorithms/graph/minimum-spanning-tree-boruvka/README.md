# Minimum Spanning Tree (Boruvka's Algorithm)

## Overview

Boruvka's algorithm finds the minimum spanning tree of a connected, weighted, undirected graph. It works by repeatedly finding the cheapest edge leaving each connected component and adding those edges to the MST. Each phase reduces the number of components by at least half, so after O(log V) phases, all vertices are connected. It is the oldest MST algorithm, proposed by Otakar Boruvka in 1926 for designing an efficient electrical network in Moravia.

## How It Works

1. Start with each vertex as its own component (using Union-Find).
2. In each phase, for every component find the lightest edge connecting it to a different component.
3. Add all such cheapest edges to the MST (using union operations to merge components).
4. Repeat until only one component remains.

Since each phase at least halves the number of components, there are at most O(log V) phases. Each phase scans all edges in O(E), giving total time O(E log V).

## Worked Example

```
Graph with 5 vertices:
    0 --(1)-- 1
    0 --(4)-- 3
    1 --(2)-- 2
    1 --(6)-- 3
    2 --(3)-- 4
    3 --(5)-- 4
```

**Phase 1:** Each vertex is its own component.
- Component {0}: cheapest edge = 0-1 (weight 1)
- Component {1}: cheapest edge = 0-1 (weight 1)
- Component {2}: cheapest edge = 1-2 (weight 2)
- Component {3}: cheapest edge = 0-3 (weight 4)
- Component {4}: cheapest edge = 2-4 (weight 3)

Add edges: 0-1 (1), 1-2 (2), 0-3 (4), 2-4 (3). Components merge into one.

**Result:** MST edges = {0-1, 1-2, 2-4, 0-3}, total weight = 1 + 2 + 3 + 4 = 10.

Only one phase was needed since all components merged.

## Pseudocode

```
function boruvkaMST(n, edges):
    parent = [0, 1, 2, ..., n-1]   // Union-Find
    rank = array of size n, all 0
    mstWeight = 0
    numComponents = n

    while numComponents > 1:
        cheapest = array of size n, all null

        for each edge (u, v, w) in edges:
            cu = find(parent, u)
            cv = find(parent, v)
            if cu == cv: continue

            if cheapest[cu] is null or w < cheapest[cu].weight:
                cheapest[cu] = (u, v, w)
            if cheapest[cv] is null or w < cheapest[cv].weight:
                cheapest[cv] = (u, v, w)

        for i = 0 to n-1:
            if cheapest[i] is not null:
                (u, v, w) = cheapest[i]
                cu = find(parent, u)
                cv = find(parent, v)
                if cu != cv:
                    union(parent, rank, cu, cv)
                    mstWeight += w
                    numComponents -= 1

    return mstWeight
```

## Complexity Analysis

| Case    | Time        | Space    |
|---------|-------------|----------|
| Best    | O(E log V)  | O(V + E) |
| Average | O(E log V)  | O(V + E) |
| Worst   | O(E log V)  | O(V + E) |

There are O(log V) phases since the number of components halves each phase. Each phase takes O(E * alpha(V)) where alpha is the inverse Ackermann function from Union-Find, which is effectively O(E).

## When to Use

- When parallel processing is available -- Boruvka's is naturally parallelizable since each component's cheapest edge can be found independently.
- For dense graphs where the edge list representation is natural.
- In distributed computing where each node independently finds its cheapest outgoing edge.
- As a building block in faster MST algorithms (e.g., the randomized linear-time MST algorithm).

## When NOT to Use

- For very sparse graphs -- Kruskal's with sorting is simpler and has good constant factors.
- When the graph is given as an adjacency list and you want simplicity -- Prim's with a priority queue is often easier to implement.
- When edge weights are already sorted -- Kruskal's can exploit this directly.
- For graphs that change dynamically -- none of the classic MST algorithms handle dynamic updates well.

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Boruvka's (this) | O(E log V) | O(V + E) | Parallelizable; good for distributed systems |
| Kruskal's | O(E log E) | O(V + E) | Sort edges first; uses Union-Find |
| Prim's (binary heap) | O(E log V) | O(V + E) | Grows from one vertex; good for dense graphs |
| Prim's (Fibonacci heap) | O(E + V log V) | O(V + E) | Theoretically fastest for sparse graphs |
| Randomized Linear | O(E) expected | O(V + E) | Uses Boruvka phases + random sampling |

## References

- Boruvka, O. (1926). "O jistem problemu minimalnim." *Prace Moravske Prirodovedecke Spolecnosti*, 3, 37-58.
- Nesetril, J., Milkova, E., & Nesetrilova, H. (2001). "Otakar Boruvka on minimum spanning tree problem." *Discrete Mathematics*, 233(1-3), 3-36.
- [Boruvka's algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Bor%C5%AFvka%27s_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [minimum_spanning_tree_boruvka.py](python/minimum_spanning_tree_boruvka.py) |
| Java       | [MinimumSpanningTreeBoruvka.java](java/MinimumSpanningTreeBoruvka.java) |
| C++        | [minimum_spanning_tree_boruvka.cpp](cpp/minimum_spanning_tree_boruvka.cpp) |
| C          | [minimum_spanning_tree_boruvka.c](c/minimum_spanning_tree_boruvka.c) |
| Go         | [minimum_spanning_tree_boruvka.go](go/minimum_spanning_tree_boruvka.go) |
| TypeScript | [minimumSpanningTreeBoruvka.ts](typescript/minimumSpanningTreeBoruvka.ts) |
| Rust       | [minimum_spanning_tree_boruvka.rs](rust/minimum_spanning_tree_boruvka.rs) |
| Kotlin     | [MinimumSpanningTreeBoruvka.kt](kotlin/MinimumSpanningTreeBoruvka.kt) |
| Swift      | [MinimumSpanningTreeBoruvka.swift](swift/MinimumSpanningTreeBoruvka.swift) |
| Scala      | [MinimumSpanningTreeBoruvka.scala](scala/MinimumSpanningTreeBoruvka.scala) |
| C#         | [MinimumSpanningTreeBoruvka.cs](csharp/MinimumSpanningTreeBoruvka.cs) |
