# Parallel Topological Sort

## Overview

Parallel Topological Sort is a variant of Kahn's algorithm that identifies the maximum parallelism in a DAG. Instead of processing one node at a time, it processes all zero-indegree nodes simultaneously in each "round." The number of rounds represents the critical path length, or the minimum number of steps needed if unlimited parallelism is available. This is essential for scheduling tasks on multiple processors, determining build parallelism, and computing the longest path in a DAG.

Input format: [n, m, u1, v1, u2, v2, ...] where n = nodes, m = edges, followed by m directed edges (0-indexed). Output: number of rounds needed (or -1 if a cycle exists).

## How It Works

1. Compute the in-degree of every node.
2. Collect all nodes with in-degree 0 into the current round.
3. Process the entire round: remove all current nodes and decrement in-degrees of their neighbors.
4. Increment the round counter.
5. Repeat until all nodes are processed.
6. Return the number of rounds (or -1 if a cycle exists, detected when some nodes are never processed).

The key difference from standard Kahn's algorithm is that all available nodes are processed simultaneously in each round, rather than one at a time. This gives the round count, which equals the length of the longest path in the DAG plus one.

## Example

Consider a DAG with 6 vertices and edges:

```
0 -> 2,  1 -> 2,  2 -> 3,  2 -> 4,  3 -> 5,  4 -> 5
```

Input: `[6, 6, 0,2, 1,2, 2,3, 2,4, 3,5, 4,5]`

**In-degrees:** 0:0, 1:0, 2:2, 3:1, 4:1, 5:2

**Round-by-round processing:**

| Round | Nodes processed | Updated in-degrees         | Remaining |
|-------|----------------|---------------------------|-----------|
| 1     | {0, 1}         | 2: 2->0                   | {2,3,4,5} |
| 2     | {2}            | 3: 1->0, 4: 1->0         | {3,4,5}   |
| 3     | {3, 4}         | 5: 2->0                   | {5}       |
| 4     | {5}            | (none)                    | {}        |

Result: **4** rounds needed.

This means even with unlimited processors, the tasks require at least 4 sequential steps due to dependency chains (e.g., 0 -> 2 -> 3 -> 5).

## Pseudocode

```
function parallelTopologicalSort(n, edges):
    adj = adjacency list from edges
    in_degree = array of size n, computed from edges
    processed = 0
    rounds = 0

    queue = all vertices v where in_degree[v] == 0

    while queue is not empty:
        rounds++
        next_queue = empty list

        for each vertex v in queue:
            processed++
            for each neighbor w of v:
                in_degree[w] -= 1
                if in_degree[w] == 0:
                    next_queue.append(w)

        queue = next_queue

    if processed != n:
        return -1    // cycle detected
    return rounds
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(V + E) | O(V + E) |
| Average | O(V + E) | O(V + E) |
| Worst   | O(V + E) | O(V + E) |

Each vertex is enqueued and dequeued exactly once, and each edge is examined exactly once when its source vertex is processed. The space stores the adjacency list O(V + E), in-degree array O(V), and queues O(V). The number of rounds does not affect the asymptotic complexity -- it only determines how the work is partitioned across rounds.

## When to Use

- **Task scheduling with dependencies:** Determining the minimum makespan (total time) for a set of tasks with precedence constraints when unlimited workers are available.
- **Build system optimization:** Finding the critical path in a build dependency graph to estimate minimum build time with parallel compilation.
- **Pipeline depth analysis:** Computing the minimum number of pipeline stages needed to process a DAG of operations.
- **Critical path method (CPM):** In project management, the number of rounds corresponds to the critical path length, which determines the project duration.
- **Cycle detection in DAGs:** The algorithm naturally detects cycles (returns -1 if not all nodes are processed), serving double duty.

## When NOT to Use

- **When you need a single linear ordering:** Standard Kahn's or DFS-based topological sort is simpler if you just need one valid ordering without round information.
- **When parallelism is limited:** If you have a fixed number of processors (not unlimited), use list scheduling algorithms that respect processor count constraints.
- **Weighted tasks:** If tasks have different execution times, the round model (assuming unit-time tasks) is inadequate. Use the weighted critical path method instead.
- **Undirected or cyclic graphs:** Topological sorting only applies to DAGs.

## Comparison

| Algorithm                    | Time     | Space    | Output                             |
|------------------------------|----------|----------|------------------------------------|
| Parallel topo sort (this)    | O(V + E) | O(V + E) | Round count (critical path length) |
| Kahn's algorithm             | O(V + E) | O(V + E) | Single linear ordering             |
| DFS-based topological sort   | O(V + E) | O(V + E) | Single linear ordering             |
| All topological orderings    | O(V! * V)| O(V + E) | Count of all valid orderings       |
| Longest path in DAG          | O(V + E) | O(V + E) | Length of longest path             |

The parallel topological sort and longest-path-in-DAG computations are closely related: the number of rounds equals the longest path length plus one. The parallel sort computes this using a BFS-like approach, while the longest path typically uses DFS with memoization.

## Implementations

| Language   | File |
|------------|------|
| Python     | [topological_sort_parallel.py](python/topological_sort_parallel.py) |
| Java       | [TopologicalSortParallel.java](java/TopologicalSortParallel.java) |
| C++        | [topological_sort_parallel.cpp](cpp/topological_sort_parallel.cpp) |
| C          | [topological_sort_parallel.c](c/topological_sort_parallel.c) |
| Go         | [topological_sort_parallel.go](go/topological_sort_parallel.go) |
| TypeScript | [topologicalSortParallel.ts](typescript/topologicalSortParallel.ts) |
| Rust       | [topological_sort_parallel.rs](rust/topological_sort_parallel.rs) |
| Kotlin     | [TopologicalSortParallel.kt](kotlin/TopologicalSortParallel.kt) |
| Swift      | [TopologicalSortParallel.swift](swift/TopologicalSortParallel.swift) |
| Scala      | [TopologicalSortParallel.scala](scala/TopologicalSortParallel.scala) |
| C#         | [TopologicalSortParallel.cs](csharp/TopologicalSortParallel.cs) |

## References

- Kahn, A. B. (1962). "Topological sorting of large networks." *Communications of the ACM*. 5(11): 558-562.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22.4: Topological Sort; Chapter 24.2: Single-source shortest paths in DAGs.
- [Topological Sorting -- Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
