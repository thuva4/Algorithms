# Bidirectional A*

## Overview

Bidirectional A* simultaneously searches from both the source and destination, meeting in the middle. This reduces the search space compared to unidirectional A*. For testing, we operate on a grid where cells are either free or blocked, and the heuristic is the Manhattan distance.

Input format: [rows, cols, src_r, src_c, dst_r, dst_c, num_blocked, br1, bc1, br2, bc2, ...]. Output: shortest path length (number of steps) or -1 if unreachable.

## How It Works

1. Initialize two open sets (priority queues): one from source, one from destination.
2. Alternate expanding nodes from each direction.
3. Use Manhattan distance as a consistent heuristic.
4. When a node expanded from one direction has already been visited by the other, compute the total path length.
5. Continue until the best possible path is confirmed or both queues are exhausted.

## Worked Example

Consider a 4x4 grid with one blocked cell at (1,2). Find the shortest path from (0,0) to (3,3).

```
Grid:          Search expansion:
. . . .        S 2 . .       (S = source, D = dest)
. . X .        1 3 X .       (Numbers = expansion order)
. . . .        . 4 5 .       (X = blocked)
. . . .        . . 6 D
```

**Forward search** (from source (0,0)):
- Expand (0,0): g=0, h=6 (Manhattan to (3,3)), f=6
- Expand (1,0): g=1, h=5, f=6
- Expand (0,1): g=1, h=5, f=6

**Backward search** (from destination (3,3)):
- Expand (3,3): g=0, h=6 (Manhattan to (0,0)), f=6
- Expand (3,2): g=1, h=5, f=6
- Expand (2,2): g=2, h=4, f=6

The two frontiers meet. The shortest path length is **6 steps**.

Path: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2) -> (3,2) -> (3,3)

## Pseudocode

```
function bidirectionalAStar(grid, source, dest):
    openF = MinHeap()  // forward priority queue
    openB = MinHeap()  // backward priority queue
    gF[source] = 0
    gB[dest] = 0
    openF.insert(source, heuristic(source, dest))
    openB.insert(dest, heuristic(dest, source))
    bestPath = INFINITY

    while openF is not empty AND openB is not empty:
        // Check termination: if min(openF) + min(openB) >= bestPath, done
        if openF.peekPriority() + openB.peekPriority() >= bestPath:
            return bestPath

        // Expand from the direction with the smaller frontier
        if openF.size() <= openB.size():
            node = openF.extractMin()
            for each neighbor of node:
                newG = gF[node] + cost(node, neighbor)
                if newG < gF[neighbor]:
                    gF[neighbor] = newG
                    openF.insert(neighbor, newG + heuristic(neighbor, dest))
                    if neighbor in gB:
                        bestPath = min(bestPath, newG + gB[neighbor])
        else:
            // symmetric expansion from backward direction
            ...

    return bestPath (or -1 if INFINITY)
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(E) | O(V)  |
| Average | O(E) | O(V)  |
| Worst   | O(E) | O(V)  |

In practice, bidirectional A* explores roughly O(b^(d/2)) nodes instead of O(b^d), where b is the branching factor and d is the distance between source and goal.

## When to Use

- **Point-to-point shortest paths in large grids or road networks**: The bidirectional approach dramatically reduces explored nodes
- **Game pathfinding**: When both start and end positions are known and the map is large
- **Navigation and routing software**: GPS routing where origin and destination are fixed
- **Any scenario where a consistent heuristic is available**: The algorithm requires admissible and consistent heuristics for correctness

## When NOT to Use

- **Single-source all-destinations**: If you need distances to all nodes, use unidirectional Dijkstra or A* instead
- **Graphs without a good heuristic**: Without a consistent heuristic, bidirectional A* may not find optimal paths
- **Very small graphs**: The overhead of maintaining two priority queues is not worthwhile for small search spaces
- **Directed graphs with asymmetric costs**: Reversing edges for the backward search requires care; the heuristic must remain consistent in both directions
- **Dynamic graphs**: If edges change frequently, the precomputed heuristic may become invalid

## Comparison

| Algorithm | Time Complexity | Bidirectional | Heuristic Required | Weighted |
|-----------|----------------|---------------|-------------------|----------|
| Bidirectional A* | O(b^(d/2)) practical | Yes | Yes (consistent) | Yes |
| A* | O(b^d) practical | No | Yes (admissible) | Yes |
| Bidirectional BFS | O(b^(d/2)) practical | Yes | No | Unweighted only |
| Dijkstra's | O(E + V log V) | No | No | Yes |
| Bidirectional Dijkstra | O(E + V log V) | Yes | No | Yes |

## Implementations

| Language   | File |
|------------|------|
| Python     | [a_star_bidirectional.py](python/a_star_bidirectional.py) |
| Java       | [AStarBidirectional.java](java/AStarBidirectional.java) |
| C++        | [a_star_bidirectional.cpp](cpp/a_star_bidirectional.cpp) |
| C          | [a_star_bidirectional.c](c/a_star_bidirectional.c) |
| Go         | [a_star_bidirectional.go](go/a_star_bidirectional.go) |
| TypeScript | [aStarBidirectional.ts](typescript/aStarBidirectional.ts) |
| Rust       | [a_star_bidirectional.rs](rust/a_star_bidirectional.rs) |
| Kotlin     | [AStarBidirectional.kt](kotlin/AStarBidirectional.kt) |
| Swift      | [AStarBidirectional.swift](swift/AStarBidirectional.swift) |
| Scala      | [AStarBidirectional.scala](scala/AStarBidirectional.scala) |
| C#         | [AStarBidirectional.cs](csharp/AStarBidirectional.cs) |

## References

- Goldberg, A. V., & Harrelson, C. (2005). "Computing the shortest path: A* search meets graph theory."
- [Bidirectional Search -- Wikipedia](https://en.wikipedia.org/wiki/Bidirectional_search)
