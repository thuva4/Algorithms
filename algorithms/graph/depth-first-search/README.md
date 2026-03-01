# Depth-First Search

## Overview

Depth-First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. Starting from a source vertex, DFS dives deep into the graph following a single path until it reaches a vertex with no unvisited neighbors, then backtracks to the most recent vertex with unexplored edges. It can be implemented using recursion (which uses the call stack implicitly) or with an explicit stack data structure.

DFS is one of the two foundational graph traversal techniques (alongside BFS) and is the basis for many advanced graph algorithms, including topological sorting, cycle detection, strongly connected components, and solving mazes.

## How It Works

DFS starts at a source vertex, marks it as visited, and then recursively visits each of its unvisited neighbors. When a vertex has no unvisited neighbors, the algorithm backtracks to the previous vertex and continues exploring its remaining unvisited neighbors. This depth-first strategy means the algorithm follows one path as deep as possible before trying alternative paths.

### Example

Consider the following undirected graph:

```
    A --- B --- E
    |     |
    C --- D --- F
```

Adjacency list (neighbors listed in alphabetical order):
```
A: [B, C]
B: [A, D, E]
C: [A, D]
D: [B, C, F]
E: [B]
F: [D]
```

**DFS starting from vertex `A` (recursive):**

| Step | Current | Action | Stack (implicit) | Visited |
|------|---------|--------|------------------|---------|
| 1 | `A` | Visit A, recurse on B | `[A]` | {A} |
| 2 | `B` | Visit B, recurse on D (A visited) | `[A, B]` | {A, B} |
| 3 | `D` | Visit D, recurse on C (B visited) | `[A, B, D]` | {A, B, D} |
| 4 | `C` | Visit C, A and D visited, backtrack | `[A, B, D, C]` | {A, B, C, D} |
| 5 | `D` | Recurse on F | `[A, B, D]` | {A, B, C, D} |
| 6 | `F` | Visit F, D visited, backtrack | `[A, B, D, F]` | {A, B, C, D, F} |
| 7 | `B` | Recurse on E | `[A, B]` | {A, B, C, D, F} |
| 8 | `E` | Visit E, B visited, backtrack | `[A, B, E]` | {A, B, C, D, E, F} |

DFS traversal order: `A, B, D, C, F, E`

Note: DFS traversal order depends on the order in which neighbors are visited. Different orderings produce different valid DFS traversals.

## Pseudocode

```
// Recursive version
function DFS(graph, vertex, visited):
    visited.add(vertex)
    process(vertex)

    for each neighbor of vertex in graph:
        if neighbor not in visited:
            DFS(graph, neighbor, visited)

// Iterative version
function DFS_iterative(graph, source):
    visited = empty set
    stack = empty stack
    stack.push(source)

    while stack is not empty:
        vertex = stack.pop()

        if vertex not in visited:
            visited.add(vertex)
            process(vertex)

            for each neighbor of vertex in graph:
                if neighbor not in visited:
                    stack.push(neighbor)
```

The recursive version is elegant and natural for tree-like structures. The iterative version is preferred for very deep graphs to avoid stack overflow.

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

Where V is the number of vertices and E is the number of edges.

**Why these complexities?**

- **Best Case -- O(V+E):** DFS visits every reachable vertex exactly once and examines every edge. Even in the best case, the full traversal requires processing all vertices and edges.

- **Average Case -- O(V+E):** Each vertex is visited exactly once (added to the visited set), and each edge is examined once (directed) or twice (undirected). The total work is linear in the size of the graph.

- **Worst Case -- O(V+E):** Like BFS, DFS processes each vertex and edge exactly once, giving consistent O(V+E) time regardless of graph structure. For an adjacency matrix representation, this becomes O(V^2).

- **Space -- O(V):** The visited set requires O(V) space. The recursion stack (or explicit stack) can grow to O(V) in the worst case -- for example, in a path graph where DFS descends through all V vertices before backtracking.

## When to Use

- **Cycle detection:** DFS can detect cycles in both directed and undirected graphs by tracking vertices currently on the recursion stack.
- **Topological sorting:** DFS naturally produces a topological ordering of a DAG by recording vertices in reverse finish order.
- **Finding connected/strongly connected components:** DFS is the basis for Kosaraju's and Tarjan's algorithms for finding SCCs.
- **Maze solving and puzzle exploration:** DFS explores one path completely before trying alternatives, which is natural for backtracking problems.
- **Path finding (existence, not shortest):** DFS efficiently determines whether a path exists between two vertices.

## When NOT to Use

- **Finding shortest paths:** DFS does not guarantee shortest paths. Use BFS for unweighted graphs or Dijkstra's for weighted graphs.
- **Level-order traversal:** BFS naturally provides level-order traversal; DFS does not.
- **Very deep graphs with recursion:** Recursive DFS can cause stack overflow on graphs with depth exceeding the recursion limit. Use iterative DFS or increase the stack size.
- **When you need to explore closest nodes first:** BFS is more appropriate when proximity to the source matters.

## Comparison with Similar Algorithms

| Algorithm       | Time    | Space | Strategy | Notes                                    |
|-----------------|---------|-------|----------|------------------------------------------|
| DFS             | O(V+E) | O(V)  | Depth-first | Good for cycle detection, topological sort |
| BFS             | O(V+E) | O(V)  | Breadth-first | Finds shortest paths in unweighted graphs |
| Topological Sort| O(V+E) | O(V)  | DFS-based | Orders DAG vertices by dependencies      |
| Tarjan's SCC    | O(V+E) | O(V)  | DFS-based | Finds strongly connected components      |

## Implementations

| Language   | File |
|------------|------|
| C          | [DepthFirstSearch.c](c/DepthFirstSearch.c) |
| C++        | [DFS(iterative).cpp](cpp/DFS(iterative).cpp) |
| C++        | [DFS(recursive).cpp](cpp/DFS(recursive).cpp) |
| Java       | [DFS_Iterative.java](java/DFS_Iterative.java) |
| Java       | [DFS_Recursive.java](java/DFS_Recursive.java) |
| Python     | [dfs.py](python/dfs.py) |
| Python     | [dfs_recursive.py](python/dfs_recursive.py) |
| Python     | [dfs_oop_rec.py](python/dfs_oop_rec.py) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22: Elementary Graph Algorithms (Section 22.3: Depth-First Search).
- Knuth, D. E. (2011). *The Art of Computer Programming, Volume 4A: Combinatorial Algorithms*. Addison-Wesley.
- [Depth-First Search -- Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search)
