# Bipartite Matching (Hopcroft-Karp)

## Overview

The Hopcroft-Karp algorithm finds the maximum cardinality matching in a bipartite graph in O(E * sqrt(V)) time. A matching is a set of edges with no shared vertices, and a maximum matching has the largest possible number of edges. This is faster than the naive augmenting path approach which runs in O(V * E).

## How It Works

1. Partition vertices into two sets U and V (left and right).
2. Use BFS to find all shortest augmenting paths simultaneously, creating layers of unmatched and matched vertices.
3. Use DFS to find vertex-disjoint augmenting paths along these layers.
4. Augment the matching along all found paths.
5. Repeat until no more augmenting paths exist.

The key insight is that finding multiple shortest augmenting paths at once reduces the number of BFS phases to O(sqrt(V)).

## Worked Example

Consider a bipartite graph with left vertices {L1, L2, L3} and right vertices {R1, R2, R3}:

```
L1 --- R1
L1 --- R2
L2 --- R1
L2 --- R3
L3 --- R2
```

**Phase 1 -- BFS finds shortest augmenting paths (length 1):**
- L1 -> R1 (augmenting path, length 1)
- L2 -> R3 (augmenting path, length 1)
- L3 -> R2 (augmenting path, length 1)

Current matching: {L1-R1, L2-R3, L3-R2}. Size = 3.

**Phase 2 -- BFS finds no more augmenting paths.** Algorithm terminates.

**Maximum matching size = 3**: {L1-R1, L2-R3, L3-R2}

## Pseudocode

```
function hopcroftKarp(graph, leftVertices, rightVertices):
    matchL = array of size |leftVertices|, initialized to NIL
    matchR = array of size |rightVertices|, initialized to NIL
    matching = 0

    while bfsLayers(graph, matchL, matchR):
        for each u in leftVertices:
            if matchL[u] == NIL:
                if dfsAugment(u, graph, matchL, matchR):
                    matching++

    return matching

function bfsLayers(graph, matchL, matchR):
    queue = []
    for each u in leftVertices:
        if matchL[u] == NIL:
            dist[u] = 0
            queue.enqueue(u)
        else:
            dist[u] = INFINITY

    found = false
    while queue is not empty:
        u = queue.dequeue()
        for each v in neighbors(u):
            next = matchR[v]
            if next == NIL:
                found = true
            else if dist[next] == INFINITY:
                dist[next] = dist[u] + 1
                queue.enqueue(next)
    return found

function dfsAugment(u, graph, matchL, matchR):
    for each v in neighbors(u):
        next = matchR[v]
        if next == NIL OR (dist[next] == dist[u] + 1 AND dfsAugment(next)):
            matchL[u] = v
            matchR[v] = u
            return true
    dist[u] = INFINITY
    return false
```

## Complexity Analysis

| Case    | Time              | Space |
|---------|-------------------|-------|
| Best    | O(E * sqrt(V))    | O(V)  |
| Average | O(E * sqrt(V))    | O(V)  |
| Worst   | O(E * sqrt(V))    | O(V)  |

## When to Use

- **Job assignment problems**: Matching workers to tasks with eligibility constraints
- **Student-course allocation**: Assigning students to courses with capacity limits
- **Resource allocation**: Pairing resources to consumers in bipartite settings
- **Pattern matching in images**: Matching feature points between two image frames
- **Network routing**: Assigning flows through bipartite relay structures

## When NOT to Use

- **Non-bipartite graphs**: Hopcroft-Karp only works on bipartite graphs; for general matching, use Edmonds' blossom algorithm
- **Weighted matching**: If edges have weights and you want maximum weight matching, use the Hungarian algorithm or auction algorithm
- **Online / streaming settings**: If edges arrive dynamically, consider online matching algorithms
- **Maximum matching in dense graphs**: When E is close to V^2, simpler O(V^3) algorithms like the Hungarian method may be easier to implement with comparable performance

## Comparison

| Algorithm | Time | Graph Type | Weighted |
|-----------|------|-----------|----------|
| Hopcroft-Karp | O(E * sqrt(V)) | Bipartite | No |
| Hungarian | O(V^3) | Bipartite | Yes |
| Naive Augmenting Paths | O(V * E) | Bipartite | No |
| Edmonds' Blossom | O(V^3) | General | No |
| Kuhn's Algorithm | O(V * E) | Bipartite | No |

## Implementations

| Language   | File |
|------------|------|
| Python     | [bipartite_matching.py](python/bipartite_matching.py) |
| Java       | [BipartiteMatching.java](java/BipartiteMatching.java) |
| C++        | [bipartite_matching.cpp](cpp/bipartite_matching.cpp) |
| C          | [bipartite_matching.c](c/bipartite_matching.c) |
| Go         | [bipartite_matching.go](go/bipartite_matching.go) |
| TypeScript | [bipartiteMatching.ts](typescript/bipartiteMatching.ts) |
| Rust       | [bipartite_matching.rs](rust/bipartite_matching.rs) |
| Kotlin     | [BipartiteMatching.kt](kotlin/BipartiteMatching.kt) |
| Swift      | [BipartiteMatching.swift](swift/BipartiteMatching.swift) |
| Scala      | [BipartiteMatching.scala](scala/BipartiteMatching.scala) |
| C#         | [BipartiteMatching.cs](csharp/BipartiteMatching.cs) |

## References

- Hopcroft, J. E., & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum matchings in bipartite graphs." SIAM Journal on Computing, 2(4), 225-231.
