# Counting Triangles

## Overview

Counting Triangles determines the number of triangles (3-cliques) in an undirected graph. A triangle is a set of three vertices that are all mutually connected. This problem has applications in social network analysis, clustering coefficient computation, and graph structure analysis.

## How It Works

1. Build an adjacency matrix from the edge list.
2. For every triple of vertices (i, j, k) where i < j < k:
   - Check if edges (i,j), (j,k), and (i,k) all exist.
   - If so, increment the triangle count.
3. Return the total count.

Input format: [n, m, u1, v1, u2, v2, ...] where n = nodes, m = edges, followed by m pairs of edges (0-indexed).

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(V^3) | O(V^2) |
| Average | O(V^3) | O(V^2) |
| Worst   | O(V^3) | O(V^2) |

## Worked Example

Consider a graph with 5 vertices and 7 edges:

```
    0 --- 1
    |\ /|
    | X  |
    |/ \|
    2 --- 3
     \  /
      4
```

Edges: 0-1, 0-2, 0-3, 1-2, 1-3, 2-3, 2-4.

**Check all triples (i < j < k):**

| Triple | (i,j)? | (j,k)? | (i,k)? | Triangle? |
|--------|--------|--------|--------|-----------|
| (0,1,2) | 0-1 yes | 1-2 yes | 0-2 yes | Yes |
| (0,1,3) | 0-1 yes | 1-3 yes | 0-3 yes | Yes |
| (0,1,4) | 0-1 yes | 1-4 no | -- | No |
| (0,2,3) | 0-2 yes | 2-3 yes | 0-3 yes | Yes |
| (0,2,4) | 0-2 yes | 2-4 yes | 0-4 no | No |
| (0,3,4) | 0-3 yes | 3-4 no | -- | No |
| (1,2,3) | 1-2 yes | 2-3 yes | 1-3 yes | Yes |
| (1,2,4) | 1-2 yes | 2-4 yes | 1-4 no | No |
| (1,3,4) | 1-3 yes | 3-4 no | -- | No |
| (2,3,4) | 2-3 yes | 3-4 no | -- | No |

**Total triangles = 4**: {0,1,2}, {0,1,3}, {0,2,3}, {1,2,3}.

## Pseudocode

```
function countTriangles(n, edges):
    // Build adjacency matrix
    adj = n x n matrix, initialized to false
    for each edge (u, v) in edges:
        adj[u][v] = true
        adj[v][u] = true

    count = 0
    for i = 0 to n-2:
        for j = i+1 to n-1:
            if not adj[i][j]: continue
            for k = j+1 to n-1:
                if adj[j][k] AND adj[i][k]:
                    count++

    return count
```

## When to Use

- **Social network analysis**: Computing the clustering coefficient of a network, which measures the tendency of nodes to cluster together
- **Community detection**: Triangles indicate tightly-knit communities in networks
- **Spam detection**: In web link graphs, spam farms tend to have unusual triangle density
- **Network motif analysis**: Triangles are the simplest non-trivial motif in network science
- **Small to medium graphs**: When the graph fits in memory as an adjacency matrix

## When NOT to Use

- **Very large sparse graphs**: The O(V^3) brute-force approach is too slow; use matrix multiplication-based methods (O(V^(2.373))) or edge-iterator methods (O(E^(3/2)))
- **Approximate counts suffice**: For very large graphs, sampling-based approximation (e.g., Doulion or TRIEST) provides estimates much faster
- **Streaming graphs**: For graphs arriving as edge streams, use streaming triangle counting algorithms
- **Directed graphs**: This algorithm counts triangles in undirected graphs; directed triangle counting requires tracking edge directions

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Brute-force triple check (this) | O(V^3) | O(V^2) | Simple, uses adjacency matrix |
| Edge-iterator | O(E * sqrt(E)) | O(V + E) | Better for sparse graphs |
| Matrix multiplication | O(V^(2.373)) | O(V^2) | Theoretically fastest, large constants |
| Node-iterator (sorted by degree) | O(E * d_max) | O(V + E) | Practical for power-law graphs |

## Implementations

| Language   | File |
|------------|------|
| Python     | [counting_triangles.py](python/counting_triangles.py) |
| Java       | [CountingTriangles.java](java/CountingTriangles.java) |
| C++        | [counting_triangles.cpp](cpp/counting_triangles.cpp) |
| C          | [counting_triangles.c](c/counting_triangles.c) |
| Go         | [counting_triangles.go](go/counting_triangles.go) |
| TypeScript | [countingTriangles.ts](typescript/countingTriangles.ts) |
| Rust       | [counting_triangles.rs](rust/counting_triangles.rs) |
| Kotlin     | [CountingTriangles.kt](kotlin/CountingTriangles.kt) |
| Swift      | [CountingTriangles.swift](swift/CountingTriangles.swift) |
| Scala      | [CountingTriangles.scala](scala/CountingTriangles.scala) |
| C#         | [CountingTriangles.cs](csharp/CountingTriangles.cs) |

## References

- [Triangle-free graph -- Wikipedia](https://en.wikipedia.org/wiki/Triangle-free_graph)
