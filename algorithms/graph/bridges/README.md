# Bridges (Cut Edges)

## Overview

A bridge (or cut edge) in an undirected graph is an edge whose removal disconnects the graph (or increases the number of connected components). The algorithm uses a DFS-based approach similar to finding articulation points, utilizing discovery times and low-link values.

## How It Works

1. Perform a DFS traversal assigning discovery times and computing low-link values.
2. An edge (u, v) is a bridge if and only if low[v] > disc[u], meaning there is no back edge from the subtree rooted at v to u or any of its ancestors.

### Example

Given input: `[5, 5, 0,1, 1,2, 2,0, 1,3, 3,4]`

Edges 1-3 and 3-4 are bridges. Result: 2

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

## Pseudocode

```
function findBridges(graph, n):
    disc = array of size n, initialized to -1
    low = array of size n
    parent = array of size n, initialized to -1
    bridgeCount = 0
    timer = 0

    function dfs(u):
        disc[u] = low[u] = timer++

        for each neighbor v of u:
            if disc[v] == -1:             // tree edge
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])

                // Bridge condition: no back edge from subtree of v
                // reaches u or above
                if low[v] > disc[u]:
                    bridgeCount++

            else if v != parent[u]:       // back edge
                low[u] = min(low[u], disc[v])

    for i = 0 to n-1:
        if disc[i] == -1:
            dfs(i)

    return bridgeCount
```

## Applications

- Finding critical connections in networks
- Identifying vulnerable links in communication networks
- Network reliability analysis
- Decomposing graphs into 2-edge-connected components
- Internet backbone analysis (identifying single points of failure)

## When NOT to Use

- **Directed graphs**: Bridges are defined for undirected graphs; for directed graphs, use strong connectivity analysis
- **Vertex vulnerability**: If you need critical vertices rather than edges, use articulation point detection instead
- **Weighted reliability**: If edges have different failure probabilities, use network reliability models rather than simple bridge detection
- **Multigraphs**: If parallel edges exist between the same pair of vertices, none of them is a bridge; the algorithm needs modification to handle multi-edges

## Comparison

| Algorithm | Purpose | Time | Space |
|-----------|---------|------|-------|
| Bridge Detection (Tarjan) | Find cut edges | O(V + E) | O(V) |
| Articulation Points (Tarjan) | Find cut vertices | O(V + E) | O(V) |
| Chain Decomposition | Find bridges + 2-edge-connected components | O(V + E) | O(V + E) |
| Edge Connectivity (max flow) | Find minimum edge cut | O(V * E) | O(V^2) |

## References

- Tarjan, R. E. (1974). "A note on finding the bridges of a graph." Information Processing Letters, 2(6), 160-161.
- [Bridge (graph theory) -- Wikipedia](https://en.wikipedia.org/wiki/Bridge_(graph_theory))

## Implementations

| Language   | File |
|------------|------|
| Python     | [count_bridges.py](python/count_bridges.py) |
| Java       | [CountBridges.java](java/CountBridges.java) |
| C++        | [count_bridges.cpp](cpp/count_bridges.cpp) |
| C          | [count_bridges.c](c/count_bridges.c) |
| Go         | [count_bridges.go](go/count_bridges.go) |
| TypeScript | [countBridges.ts](typescript/countBridges.ts) |
| Rust       | [count_bridges.rs](rust/count_bridges.rs) |
| Kotlin     | [CountBridges.kt](kotlin/CountBridges.kt) |
| Swift      | [CountBridges.swift](swift/CountBridges.swift) |
| Scala      | [CountBridges.scala](scala/CountBridges.scala) |
| C#         | [CountBridges.cs](csharp/CountBridges.cs) |
