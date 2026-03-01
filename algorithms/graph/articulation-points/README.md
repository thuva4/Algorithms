# Articulation Points (Cut Vertices)

## Overview

An articulation point (or cut vertex) in an undirected graph is a vertex whose removal disconnects the graph (or increases the number of connected components). Finding articulation points is important for identifying vulnerabilities in networks. The algorithm uses a DFS-based approach with discovery times and low-link values.

## How It Works

1. Perform a DFS traversal assigning discovery times and computing low-link values.
2. A vertex u is an articulation point if:
   - u is the root of the DFS tree and has two or more children, OR
   - u is not the root and has a child v such that no vertex in the subtree rooted at v can reach an ancestor of u (i.e., low[v] >= disc[u]).

### Example

Given input: `[5, 5, 0,1, 1,2, 2,0, 1,3, 3,4]`

Vertices 1 and 3 are articulation points: removing vertex 1 disconnects {0,2} from {3,4}, and removing vertex 3 disconnects vertex 4.

Result: 2

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

## Pseudocode

```
function findArticulationPoints(graph, n):
    disc = array of size n, initialized to -1
    low = array of size n
    parent = array of size n, initialized to -1
    isAP = array of size n, initialized to false
    timer = 0

    function dfs(u):
        disc[u] = low[u] = timer++
        childCount = 0

        for each neighbor v of u:
            if disc[v] == -1:          // v not visited
                childCount++
                parent[v] = u
                dfs(v)
                low[u] = min(low[u], low[v])

                // u is root of DFS tree with 2+ children
                if parent[u] == -1 AND childCount > 1:
                    isAP[u] = true

                // u is not root and no back edge from subtree of v
                if parent[u] != -1 AND low[v] >= disc[u]:
                    isAP[u] = true

            else if v != parent[u]:    // back edge
                low[u] = min(low[u], disc[v])

    for i = 0 to n-1:
        if disc[i] == -1:
            dfs(i)

    return count of isAP[i] == true
```

## Applications

- Finding vulnerable nodes in computer networks
- Identifying critical points in transportation networks
- Biconnected component decomposition
- Power grid vulnerability analysis
- Social network analysis (identifying key connectors)

## When NOT to Use

- **Directed graphs**: Articulation points are defined for undirected graphs; for directed graphs, use strongly connected components instead
- **Edge vulnerability analysis**: If you need to find critical edges rather than vertices, use bridge-finding algorithms instead
- **Weighted reliability**: If you need to account for edge weights or probabilities, standard articulation point detection is insufficient; use network reliability models
- **Dynamic graphs**: If the graph changes frequently, recomputing from scratch is expensive; consider incremental connectivity algorithms

## Comparison

| Algorithm | Purpose | Time | Space |
|-----------|---------|------|-------|
| Articulation Points (Tarjan) | Find cut vertices | O(V + E) | O(V) |
| Bridge Finding (Tarjan) | Find cut edges | O(V + E) | O(V) |
| Biconnected Components | Decompose into 2-connected parts | O(V + E) | O(V + E) |
| Block-Cut Tree | Tree of biconnected components | O(V + E) | O(V + E) |

## References

- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." SIAM Journal on Computing, 1(2), 146-160.
- Hopcroft, J., & Tarjan, R. (1973). "Efficient algorithms for graph manipulation." Communications of the ACM, 16(6), 372-378.
- [Biconnected component -- Wikipedia](https://en.wikipedia.org/wiki/Biconnected_component)

## Implementations

| Language   | File |
|------------|------|
| Python     | [articulation_points.py](python/articulation_points.py) |
| Java       | [ArticulationPoints.java](java/ArticulationPoints.java) |
| C++        | [articulation_points.cpp](cpp/articulation_points.cpp) |
| C          | [articulation_points.c](c/articulation_points.c) |
| Go         | [articulation_points.go](go/articulation_points.go) |
| TypeScript | [articulationPoints.ts](typescript/articulationPoints.ts) |
| Rust       | [articulation_points.rs](rust/articulation_points.rs) |
| Kotlin     | [ArticulationPoints.kt](kotlin/ArticulationPoints.kt) |
| Swift      | [ArticulationPoints.swift](swift/ArticulationPoints.swift) |
| Scala      | [ArticulationPoints.scala](scala/ArticulationPoints.scala) |
| C#         | [ArticulationPoints.cs](csharp/ArticulationPoints.cs) |
