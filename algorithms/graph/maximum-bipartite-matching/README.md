# Maximum Bipartite Matching (Kuhn's Algorithm)

## Overview

Kuhn's algorithm finds the maximum matching in a bipartite graph using augmenting paths. A matching is a set of edges with no shared vertices. The maximum matching is the matching with the largest number of edges. The algorithm tries to find an augmenting path for each left vertex using DFS, greedily building a maximum matching.

## How It Works

1. For each vertex on the left side, attempt to find an augmenting path via DFS.
2. An augmenting path alternates between unmatched and matched edges, starting and ending at unmatched vertices.
3. If an augmenting path is found, flip the matching along the path (increasing matching size by 1).
4. The total number of successful augmentations is the maximum matching size.

Input format: [n_left, n_right, m, u1, v1, ...] where edges go from left vertices (0..n_left-1) to right vertices (0..n_right-1). Output: size of maximum matching.

## Worked Example

```
Left vertices: {0, 1, 2}    Right vertices: {0, 1, 2}
Edges: 0-0, 0-1, 1-0, 2-1, 2-2

    L0 --- R0
    L0 --- R1
    L1 --- R0
    L2 --- R1
    L2 --- R2
```

**Step 1:** Try to match L0. DFS finds R0 is free. Match L0-R0. Matching: {L0-R0}.
**Step 2:** Try to match L1. DFS tries R0, but R0 is matched to L0. Try to re-match L0: L0 can go to R1 (free). So match L0-R1, L1-R0. Matching: {L0-R1, L1-R0}.
**Step 3:** Try to match L2. DFS tries R1, but R1 is matched to L0. Try to re-match L0: L0 tries R0, but R0 is matched to L1. Try to re-match L1: L1 has no other neighbors. Back to L0: no alternative. Try R2 for L2: R2 is free. Match L2-R2. Matching: {L0-R1, L1-R0, L2-R2}.

**Maximum matching size = 3.**

## Pseudocode

```
function maxMatching(n_left, n_right, adj):
    matchRight = array of size n_right, all -1
    result = 0

    for u = 0 to n_left - 1:
        visited = array of size n_right, all false
        if dfs(u, adj, matchRight, visited):
            result += 1

    return result

function dfs(u, adj, matchRight, visited):
    for each v in adj[u]:
        if visited[v]: continue
        visited[v] = true

        if matchRight[v] == -1 or dfs(matchRight[v], adj, matchRight, visited):
            matchRight[v] = u
            return true

    return false
```

## Complexity Analysis

| Case    | Time    | Space    |
|---------|---------|----------|
| Best    | O(V * E) | O(V + E) |
| Average | O(V * E) | O(V + E) |
| Worst   | O(V * E) | O(V + E) |

For each of V left vertices, a DFS traversal of up to E edges is performed. In practice, the algorithm is much faster due to early termination.

## When to Use

- Assigning tasks to workers (each worker does one task)
- Matching applicants to positions
- Stable marriage / college admissions (as a subroutine)
- Vertex cover computation via Konig's theorem (min vertex cover = max matching in bipartite graphs)
- Resource allocation in operating systems
- Pattern matching in image recognition

## When NOT to Use

- For weighted matching -- use the Hungarian algorithm instead.
- For non-bipartite graphs -- use Edmonds' blossom algorithm.
- When the graph is very large -- Hopcroft-Karp runs in O(E * sqrt(V)) and is significantly faster.
- When you need all maximum matchings, not just one -- the algorithm finds only a single maximum matching.

## Comparison

| Algorithm | Time | Graph Type | Notes |
|-----------|------|------------|-------|
| Kuhn's (this) | O(V * E) | Bipartite, unweighted | Simple DFS-based; easy to implement |
| Hopcroft-Karp | O(E * sqrt(V)) | Bipartite, unweighted | Faster due to multi-path augmentation |
| Hungarian | O(n^3) | Bipartite, weighted | Solves minimum cost assignment |
| Edmonds' Blossom | O(V^3) | General, unweighted | Handles non-bipartite graphs |
| Max-Flow Reduction | O(VE^2) | Bipartite | Reduction to network flow; overkill for simple matching |

## References

- Kuhn, H. W. (1955). "The Hungarian method for the assignment problem." *Naval Research Logistics Quarterly*, 2(1-2), 83-97.
- Hopcroft, J. E., & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum matchings in bipartite graphs." *SIAM Journal on Computing*, 2(4), 225-231.
- [Matching (graph theory) -- Wikipedia](https://en.wikipedia.org/wiki/Matching_(graph_theory))

## Implementations

| Language   | File |
|------------|------|
| Python     | [maximum_bipartite_matching.py](python/maximum_bipartite_matching.py) |
| Java       | [MaximumBipartiteMatching.java](java/MaximumBipartiteMatching.java) |
| C++        | [maximum_bipartite_matching.cpp](cpp/maximum_bipartite_matching.cpp) |
| C          | [maximum_bipartite_matching.c](c/maximum_bipartite_matching.c) |
| Go         | [maximum_bipartite_matching.go](go/maximum_bipartite_matching.go) |
| TypeScript | [maximumBipartiteMatching.ts](typescript/maximumBipartiteMatching.ts) |
| Rust       | [maximum_bipartite_matching.rs](rust/maximum_bipartite_matching.rs) |
| Kotlin     | [MaximumBipartiteMatching.kt](kotlin/MaximumBipartiteMatching.kt) |
| Swift      | [MaximumBipartiteMatching.swift](swift/MaximumBipartiteMatching.swift) |
| Scala      | [MaximumBipartiteMatching.scala](scala/MaximumBipartiteMatching.scala) |
| C#         | [MaximumBipartiteMatching.cs](csharp/MaximumBipartiteMatching.cs) |
