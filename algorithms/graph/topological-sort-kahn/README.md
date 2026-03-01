# Kahn's Topological Sort

## Overview

Kahn's algorithm finds a topological ordering of a directed acyclic graph (DAG) using an iterative approach based on in-degree reduction. A topological ordering is a linear ordering of vertices such that for every directed edge (u, v), vertex u comes before vertex v in the ordering.

Unlike the DFS-based topological sort, Kahn's algorithm uses BFS and provides a natural way to detect cycles: if the algorithm cannot process all vertices, the graph contains a cycle.

## How It Works

1. Compute the in-degree (number of incoming edges) of every vertex.
2. Add all vertices with in-degree 0 to a queue.
3. While the queue is not empty:
   a. Dequeue a vertex u and add it to the result.
   b. For each neighbor v of u, decrement v's in-degree by 1.
   c. If v's in-degree becomes 0, add v to the queue.
4. If the result contains all vertices, return it. Otherwise, the graph has a cycle; return an empty array.

### Example

Given input: `[4, 4, 0, 1, 0, 2, 1, 3, 2, 3]`

This encodes: 4 vertices, 4 edges: 0->1, 0->2, 1->3, 2->3

```
0 --> 1
|     |
v     v
2 --> 3
```

**Step-by-step:**

| Step | Queue | Action | In-degrees | Result |
|------|-------|--------|-----------|--------|
| Init | [0] | In-degrees: [0,1,1,2] | {0:0, 1:1, 2:1, 3:2} | [] |
| 1 | [] | Dequeue 0, decrement 1,2 | {1:0, 2:0, 3:2} | [0] |
| 2 | [1,2] | Enqueue 1,2 (in-degree=0) | {1:0, 2:0, 3:2} | [0] |
| 3 | [2] | Dequeue 1, decrement 3 | {2:0, 3:1} | [0,1] |
| 4 | [] | Dequeue 2, decrement 3 | {3:0} | [0,1,2] |
| 5 | [3] | Enqueue 3 (in-degree=0) | {} | [0,1,2] |
| 6 | [] | Dequeue 3 | {} | [0,1,2,3] |

Result: `[0, 1, 2, 3]` (all 4 vertices processed -- valid topological order)

## Pseudocode

```
function topologicalSortKahn(arr):
    numVertices = arr[0]
    numEdges = arr[1]

    adjacencyList = empty list of lists
    inDegree = array of zeros, size numVertices

    for i from 0 to numEdges - 1:
        u = arr[2 + 2*i]
        v = arr[2 + 2*i + 1]
        adjacencyList[u].add(v)
        inDegree[v] += 1

    queue = []
    for v from 0 to numVertices - 1:
        if inDegree[v] == 0:
            queue.add(v)

    result = []
    while queue is not empty:
        u = queue.dequeue()
        result.add(u)
        for each neighbor v of u:
            inDegree[v] -= 1
            if inDegree[v] == 0:
                queue.add(v)

    if length(result) == numVertices:
        return result
    else:
        return []  // cycle detected
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

- **Time -- O(V+E):** Each vertex is enqueued and dequeued exactly once (O(V)). Each edge is examined exactly once when reducing in-degrees (O(E)). Total: O(V+E).
- **Space -- O(V):** The in-degree array, queue, and result array each use O(V) space. The adjacency list uses O(V+E) space.

## Applications

- **Build systems:** Determining compilation order (e.g., Make, Gradle).
- **Task scheduling:** Ordering tasks with dependencies.
- **Course prerequisites:** Finding a valid course sequence.
- **Package managers:** Resolving dependency installation order.
- **Spreadsheet evaluation:** Computing cell values in dependency order.
- **Cycle detection:** Detecting circular dependencies in any directed graph.

## Implementations

| Language   | File |
|------------|------|
| Python     | [topological_sort_kahn.py](python/topological_sort_kahn.py) |
| Java       | [TopologicalSortKahn.java](java/TopologicalSortKahn.java) |
| C++        | [topological_sort_kahn.cpp](cpp/topological_sort_kahn.cpp) |
| C          | [topological_sort_kahn.c](c/topological_sort_kahn.c) |
| Go         | [topological_sort_kahn.go](go/topological_sort_kahn.go) |
| TypeScript | [topologicalSortKahn.ts](typescript/topologicalSortKahn.ts) |
| Kotlin     | [TopologicalSortKahn.kt](kotlin/TopologicalSortKahn.kt) |
| Rust       | [topological_sort_kahn.rs](rust/topological_sort_kahn.rs) |
| Swift      | [TopologicalSortKahn.swift](swift/TopologicalSortKahn.swift) |
| Scala      | [TopologicalSortKahn.scala](scala/TopologicalSortKahn.scala) |
| C#         | [TopologicalSortKahn.cs](csharp/TopologicalSortKahn.cs) |

## References

- Kahn, A. B. (1962). "Topological sorting of large networks." *Communications of the ACM*, 5(11), 558-562.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22.4: Topological Sort.
- [Topological Sorting -- Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
