# Topological Sort

## Overview

Topological Sort is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering. It is not possible to topologically sort a graph that contains a cycle. Topological sorting is essential for scheduling tasks with dependencies, resolving symbol dependencies in compilers, and determining the order of operations in build systems.

There are two primary approaches to topological sorting: DFS-based (recording vertices in reverse finish order) and BFS-based (Kahn's algorithm, repeatedly removing vertices with zero in-degree). Both produce valid topological orderings in O(V+E) time.

## How It Works

The DFS-based approach performs a depth-first search on the graph. When a vertex finishes (all its descendants have been fully explored), it is pushed onto a stack. At the end, the stack contains vertices in topological order. Kahn's algorithm (BFS-based) starts with all vertices that have no incoming edges, removes them from the graph, updates in-degrees, and repeats until all vertices are processed.

### Example

Consider the following DAG representing course prerequisites:

```
    A -----> C -----> E
    |        ^        |
    |        |        |
    v        |        v
    B -----> D -----> F
```

Adjacency list:
```
A: [B, C]
B: [D]
C: [E]
D: [C, F]
E: [F]
F: []
```

**Kahn's Algorithm (BFS-based):**

Initial in-degrees: `A=0, B=1, C=2, D=1, E=1, F=2`

| Step | Zero In-Degree Queue | Remove | Update In-Degrees | Result So Far |
|------|---------------------|--------|-------------------|---------------|
| 1 | `[A]` | `A` | B: 1->0, C: 2->1 | `[A]` |
| 2 | `[B]` | `B` | D: 1->0 | `[A, B]` |
| 3 | `[D]` | `D` | C: 1->0, F: 2->1 | `[A, B, D]` |
| 4 | `[C]` | `C` | E: 1->0 | `[A, B, D, C]` |
| 5 | `[E]` | `E` | F: 1->0 | `[A, B, D, C, E]` |
| 6 | `[F]` | `F` | -- | `[A, B, D, C, E, F]` |

Result: Topological order: `A, B, D, C, E, F`

This means: Take course A first, then B, then D, then C (which requires both A and D), then E, then F.

Note: Multiple valid topological orderings may exist. For example, `A, C, B, D, E, F` would not be valid because C depends on D.

## Pseudocode

```
// DFS-based Topological Sort
function topologicalSort(graph, V):
    visited = empty set
    stack = empty stack

    for each vertex v in graph:
        if v not in visited:
            dfs(graph, v, visited, stack)

    return stack  // pop elements for topological order

function dfs(graph, v, visited, stack):
    visited.add(v)

    for each neighbor u of v:
        if u not in visited:
            dfs(graph, u, visited, stack)

    stack.push(v)  // push after all descendants are processed

// Kahn's Algorithm (BFS-based)
function kahnTopologicalSort(graph, V):
    inDegree = compute in-degree for each vertex
    queue = all vertices with inDegree == 0
    result = empty list

    while queue is not empty:
        v = queue.dequeue()
        result.add(v)

        for each neighbor u of v:
            inDegree[u] -= 1
            if inDegree[u] == 0:
                queue.enqueue(u)

    if length(result) != V:
        report "Graph has a cycle"

    return result
```

Kahn's algorithm has the added benefit of detecting cycles: if the result contains fewer than V vertices, the graph has a cycle.

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

**Why these complexities?**

- **Best Case -- O(V+E):** Even in the simplest DAG, every vertex must be visited and every edge must be examined to compute in-degrees or perform DFS. This gives a minimum of O(V+E) work.

- **Average Case -- O(V+E):** Each vertex is processed exactly once (either through DFS or when its in-degree reaches zero), and each edge is examined exactly once. The total work is proportional to the graph size.

- **Worst Case -- O(V+E):** The algorithm systematically processes every vertex and edge regardless of graph topology. The time complexity is always linear in the size of the graph.

- **Space -- O(V):** The visited set (DFS) or in-degree array (Kahn's) requires O(V) space. The stack or result list also requires O(V) space. The queue in Kahn's algorithm holds at most V vertices.

## When to Use

- **Task scheduling with dependencies:** When tasks have prerequisite relationships and must be ordered such that all prerequisites are completed first.
- **Build systems:** Tools like Make, Gradle, and Bazel use topological sort to determine the order of compilation and linking.
- **Course planning:** Determining a valid order to take courses given prerequisite requirements.
- **Dependency resolution:** Package managers (npm, pip, apt) resolve dependency graphs using topological sorting.
- **Spreadsheet cell evaluation:** Cells that depend on other cells must be evaluated in a topologically sorted order.

## When NOT to Use

- **Graphs with cycles:** Topological sort is undefined for graphs containing cycles. First check for cycles, or use Kahn's algorithm which detects them automatically.
- **Undirected graphs:** Topological sort applies only to directed graphs. Undirected graphs do not have a notion of direction for ordering.
- **When you need the shortest/longest path directly:** While topological sort is a prerequisite for certain shortest/longest path algorithms on DAGs, it is not a pathfinding algorithm by itself.

## Comparison with Similar Algorithms

| Algorithm       | Time    | Space | Detects Cycles | Notes                                    |
|-----------------|---------|-------|---------------|------------------------------------------|
| Topological Sort (DFS) | O(V+E) | O(V) | Yes (with modification) | Uses reverse DFS finish order |
| Kahn's Algorithm | O(V+E) | O(V)  | Yes           | BFS-based; natural cycle detection       |
| DFS             | O(V+E) | O(V)  | Yes           | Foundation for DFS-based topological sort |
| BFS             | O(V+E) | O(V)  | No            | Does not produce topological order       |

## Implementations

| Language | File |
|----------|------|
| C++      | [topo_sort.cpp](cpp/topo_sort.cpp) |
| Java     | [TopologicalSort.java](java/TopologicalSort.java) |
| Python   | [TopologicalSort.py](python/TopologicalSort.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22: Elementary Graph Algorithms (Section 22.4: Topological Sort).
- Kahn, A. B. (1962). "Topological sorting of large networks". *Communications of the ACM*. 5(11): 558-562.
- [Topological Sorting -- Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
