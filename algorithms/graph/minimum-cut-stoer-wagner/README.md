# Minimum Cut (Stoer-Wagner)

## Overview

The Stoer-Wagner algorithm finds the minimum cut of an undirected weighted graph without using max-flow techniques. A minimum cut is a partition of the vertices into two non-empty sets such that the total weight of edges crossing the partition is minimized. The algorithm runs in O(V^3) time using an adjacency matrix representation and is conceptually simpler than max-flow based approaches for undirected graphs.

## How It Works

The algorithm performs V-1 phases. In each phase, it grows a set of vertices starting from an arbitrary vertex by repeatedly adding the most tightly connected vertex (the vertex with the highest total edge weight to vertices already in the set). The last two vertices added in a phase define a "cut of the phase" whose weight equals the total edge weight from the last vertex to all other vertices. After recording this cut weight, the last two vertices are merged. The global minimum cut is the minimum over all phase cuts.

## Worked Example

```
Graph with 4 vertices:
    0 --(2)-- 1
    |         |
   (3)      (3)
    |         |
    3 --(1)-- 2

    Also: 0--(1)--2
```

Adjacency matrix:
```
     0  1  2  3
 0 [ 0  2  1  3 ]
 1 [ 2  0  3  0 ]
 2 [ 1  3  0  1 ]
 3 [ 3  0  1  0 ]
```

**Phase 1:** Start with {0}. Most tightly connected: vertex 3 (weight 3). Add 3. Set = {0, 3}. Next: vertex 1 (weight to set = 2+0=2) vs vertex 2 (weight to set = 1+1=2). Tie-break, say vertex 1. Add 1. Set = {0, 3, 1}. Last vertex: 2. Cut-of-phase = w(2,0) + w(2,3) + w(2,1) = 1+1+3 = 5. Merge vertices 1 and 2.

**Phase 2:** Now 3 vertices: {0, {1,2}, 3}. Updated weights: 0-{1,2} = 2+1 = 3, 0-3 = 3, {1,2}-3 = 0+1 = 1. Start {0}. Most connected: 3 or {1,2} (both weight 3). Say {1,2}. Set = {0, {1,2}}. Last: 3. Cut-of-phase = w(3,0) + w(3,{1,2}) = 3+1 = 4. Merge {1,2} and 3.

**Phase 3:** Now 2 vertices: {0, {1,2,3}}. Weight = 3+3+1 = 7. Cut-of-phase = 7.

**Minimum cut = min(5, 4, 7) = 4.** The minimum cut separates {3} from {0, 1, 2}.

## Pseudocode

```
function stoerWagner(w, n):
    // w[i][j] = edge weight between i and j
    minCut = INF
    vertices = [0, 1, ..., n-1]

    for phase = 0 to n-2:
        // Minimum cut phase
        inA = array of size n, all false
        tightness = array of size n, all 0

        prev = -1
        last = vertices[0]

        for i = 0 to |vertices|-1:
            // Find most tightly connected vertex not in A
            inA[last] = true
            prev = last
            best = -1
            for each v in vertices:
                if not inA[v]:
                    tightness[v] += w[last][v]
                    if best == -1 or tightness[v] > tightness[best]:
                        best = v
            last = best

        cutWeight = tightness[last]
        minCut = min(minCut, cutWeight)

        // Merge prev and last
        for each v in vertices:
            w[prev][v] += w[last][v]
            w[v][prev] += w[v][last]

        remove last from vertices

    return minCut
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(V^3) | O(V^2) |
| Average | O(V^3) | O(V^2) |
| Worst   | O(V^3) | O(V^2) |

With a priority queue, the time can be improved to O(VE + V^2 log V), but the cubic version using an adjacency matrix is simpler and sufficient for moderate graph sizes.

## When to Use

- Finding minimum cuts in undirected graphs (network reliability)
- Image segmentation
- Clustering and community detection
- Network vulnerability analysis
- Circuit partitioning in VLSI design

## When NOT to Use

- For directed graphs -- use max-flow based min-cut (Edmonds-Karp, Dinic's) instead.
- When you need the s-t min-cut for specific source and sink -- max-flow is more direct.
- For very large sparse graphs -- the O(V^3) with adjacency matrix is wasteful; consider Karger's randomized algorithm.
- When you need multiple different cuts -- randomized contraction (Karger's) can enumerate near-minimum cuts.

## Comparison

| Algorithm | Time | Graph Type | Notes |
|-----------|------|------------|-------|
| Stoer-Wagner (this) | O(V^3) | Undirected, weighted | No source/sink needed; deterministic |
| Max-Flow (Edmonds-Karp) | O(VE^2) | Directed or undirected | Finds s-t min-cut; needs source and sink |
| Karger's Randomized | O(V^2 log^3 V) | Undirected | Randomized; can find all near-minimum cuts |
| Gomory-Hu Tree | O(V) max-flow calls | Undirected | Computes all pairwise min-cuts; uses max-flow as subroutine |

## References

- Stoer, M., & Wagner, F. (1997). "A Simple Min-Cut Algorithm". *Journal of the ACM*. 44(4): 585-591.
- [Stoer-Wagner Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Stoer%E2%80%93Wagner_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [minimum_cut_stoer_wagner.py](python/minimum_cut_stoer_wagner.py) |
| Java       | [MinimumCutStoerWagner.java](java/MinimumCutStoerWagner.java) |
| C++        | [minimum_cut_stoer_wagner.cpp](cpp/minimum_cut_stoer_wagner.cpp) |
| C          | [minimum_cut_stoer_wagner.c](c/minimum_cut_stoer_wagner.c) |
| Go         | [minimum_cut_stoer_wagner.go](go/minimum_cut_stoer_wagner.go) |
| TypeScript | [minimumCutStoerWagner.ts](typescript/minimumCutStoerWagner.ts) |
| Rust       | [minimum_cut_stoer_wagner.rs](rust/minimum_cut_stoer_wagner.rs) |
| Kotlin     | [MinimumCutStoerWagner.kt](kotlin/MinimumCutStoerWagner.kt) |
| Swift      | [MinimumCutStoerWagner.swift](swift/MinimumCutStoerWagner.swift) |
| Scala      | [MinimumCutStoerWagner.scala](scala/MinimumCutStoerWagner.scala) |
| C#         | [MinimumCutStoerWagner.cs](csharp/MinimumCutStoerWagner.cs) |
