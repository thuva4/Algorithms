# Bidirectional BFS

## Overview

Bidirectional BFS searches simultaneously from the source and the target, meeting in the middle. This can significantly reduce the search space compared to unidirectional BFS, especially in large graphs with high branching factors. The algorithm terminates when the two search frontiers meet.

## How It Works

1. Maintain two queues: one expanding from the source, one from the target.
2. Alternate between expanding the smaller frontier.
3. When a vertex is visited by both searches, a path has been found.
4. The shortest distance is the sum of the distances from both directions to the meeting point.

Input format: [n, m, src, dst, u1, v1, u2, v2, ...] for an undirected unweighted graph. Output: shortest distance from src to dst, or -1 if unreachable.

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

In practice, bidirectional BFS explores roughly O(b^(d/2)) nodes instead of O(b^d) where b is the branching factor and d is the distance.

## Worked Example

Consider an undirected graph with 7 vertices:

```
    0 --- 1 --- 3 --- 5
    |     |           |
    2     4           6
```

Edges: 0-1, 0-2, 1-3, 1-4, 3-5, 5-6. Find shortest path from 0 to 6.

**Forward BFS (from vertex 0):**
- Layer 0: {0}
- Layer 1: {1, 2}

**Backward BFS (from vertex 6):**
- Layer 0: {6}
- Layer 1: {5}

**Forward BFS continues (smaller frontier):**
- Layer 2: {3, 4} (from vertex 1)

**Backward BFS continues:**
- Layer 2: {3} (from vertex 5)

Vertex 3 is visited by both searches. Forward distance to 3 = 2, backward distance to 3 = 2.

**Shortest path length = 2 + 2 = 4**: 0 -> 1 -> 3 -> 5 -> 6

Standard BFS would have expanded layers 0, 1, 2, 3, 4 from source before reaching vertex 6.

## Pseudocode

```
function bidirectionalBFS(graph, source, target):
    if source == target: return 0

    visitedF = {source: 0}    // forward visited with distances
    visitedB = {target: 0}    // backward visited with distances
    queueF = [source]
    queueB = [target]

    while queueF is not empty AND queueB is not empty:
        // Expand the smaller frontier
        if len(queueF) <= len(queueB):
            nextQueue = []
            for each node in queueF:
                for each neighbor of node:
                    if neighbor not in visitedF:
                        visitedF[neighbor] = visitedF[node] + 1
                        nextQueue.append(neighbor)
                        if neighbor in visitedB:
                            return visitedF[neighbor] + visitedB[neighbor]
            queueF = nextQueue
        else:
            // Symmetric expansion from backward direction
            nextQueue = []
            for each node in queueB:
                for each neighbor of node:
                    if neighbor not in visitedB:
                        visitedB[neighbor] = visitedB[node] + 1
                        nextQueue.append(neighbor)
                        if neighbor in visitedF:
                            return visitedF[neighbor] + visitedB[neighbor]
            queueB = nextQueue

    return -1  // unreachable
```

## When to Use

- **Shortest path in unweighted graphs with known source and target**: The primary use case where bidirectional search shines
- **Social network distance queries**: Finding degrees of separation between two people in a large social graph
- **Word ladder puzzles**: Transforming one word to another by changing one letter at a time
- **Large graphs with high branching factor**: The benefit of bidirectional BFS increases with larger branching factors
- **Real-time path queries**: When quick responses are needed for point-to-point distance

## When NOT to Use

- **Weighted graphs**: BFS only works for unweighted (or unit-weight) graphs; use bidirectional Dijkstra or bidirectional A* for weighted graphs
- **Single-source all-destinations**: If you need distances to all nodes from one source, standard BFS is more appropriate
- **Directed graphs without reverse edges**: Backward search requires traversing edges in reverse; if the reverse graph is not easily available, this adds complexity
- **Very short distances**: If the expected distance is small (d <= 3), standard BFS may be equally fast with less overhead

## Comparison

| Algorithm | Time (practical) | Space | Weighted | Bidirectional |
|-----------|-----------------|-------|----------|---------------|
| Bidirectional BFS | O(b^(d/2)) | O(b^(d/2)) | No | Yes |
| Standard BFS | O(b^d) | O(b^d) | No | No |
| Bidirectional Dijkstra | O(b^(d/2)) approx | O(b^(d/2)) | Yes | Yes |
| A* | O(b^d) practical | O(b^d) | Yes | No |

## Implementations

| Language   | File |
|------------|------|
| Python     | [bidirectional_bfs.py](python/bidirectional_bfs.py) |
| Java       | [BidirectionalBfs.java](java/BidirectionalBfs.java) |
| C++        | [bidirectional_bfs.cpp](cpp/bidirectional_bfs.cpp) |
| C          | [bidirectional_bfs.c](c/bidirectional_bfs.c) |
| Go         | [bidirectional_bfs.go](go/bidirectional_bfs.go) |
| TypeScript | [bidirectionalBfs.ts](typescript/bidirectionalBfs.ts) |
| Rust       | [bidirectional_bfs.rs](rust/bidirectional_bfs.rs) |
| Kotlin     | [BidirectionalBfs.kt](kotlin/BidirectionalBfs.kt) |
| Swift      | [BidirectionalBfs.swift](swift/BidirectionalBfs.swift) |
| Scala      | [BidirectionalBfs.scala](scala/BidirectionalBfs.scala) |
| C#         | [BidirectionalBfs.cs](csharp/BidirectionalBfs.cs) |

## References

- Pohl, I. (1971). "Bi-directional Search". *Machine Intelligence*. 6: 127-140.
