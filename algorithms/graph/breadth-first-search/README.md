# Breadth-First Search

## Overview

Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores all vertices at the current depth level before moving to vertices at the next depth level. It uses a queue data structure to maintain the order of exploration, visiting nodes in a layer-by-layer fashion radiating outward from the source vertex. BFS naturally finds the shortest path (in terms of number of edges) from the source to every reachable vertex.

BFS is one of the two foundational graph traversal algorithms (alongside DFS) and serves as a building block for many other graph algorithms, including shortest path in unweighted graphs, connected components, and level-order traversal.

## How It Works

BFS starts at a source vertex, marks it as visited, and adds it to a queue. It then repeatedly dequeues a vertex, processes it, and enqueues all of its unvisited neighbors. This ensures that vertices closer to the source are always processed before vertices farther away. The algorithm terminates when the queue is empty, meaning all reachable vertices have been visited.

### Example

Consider the following undirected graph:

```
    A --- B --- E
    |     |
    C --- D --- F
```

Adjacency list:
```
A: [B, C]
B: [A, D, E]
C: [A, D]
D: [B, C, F]
E: [B]
F: [D]
```

**BFS starting from vertex `A`:**

| Step | Dequeue | Process Neighbors | Queue State | Visited |
|------|---------|-------------------|-------------|---------|
| 1 | `A` | Enqueue B, C | `[B, C]` | {A, B, C} |
| 2 | `B` | Enqueue D, E (A visited) | `[C, D, E]` | {A, B, C, D, E} |
| 3 | `C` | D already visited, A visited | `[D, E]` | {A, B, C, D, E} |
| 4 | `D` | Enqueue F (B, C visited) | `[E, F]` | {A, B, C, D, E, F} |
| 5 | `E` | B already visited | `[F]` | {A, B, C, D, E, F} |
| 6 | `F` | D already visited | `[]` | {A, B, C, D, E, F} |

BFS traversal order: `A, B, C, D, E, F`

**Levels from source A:**
- Level 0: `A`
- Level 1: `B, C`
- Level 2: `D, E`
- Level 3: `F`

## Pseudocode

```
function BFS(graph, source):
    visited = empty set
    queue = empty queue

    visited.add(source)
    queue.enqueue(source)

    while queue is not empty:
        vertex = queue.dequeue()
        process(vertex)

        for each neighbor of vertex in graph:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.enqueue(neighbor)
```

The key invariant is that when a vertex is enqueued, it is immediately marked as visited. This prevents the same vertex from being added to the queue multiple times.

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

Where V is the number of vertices and E is the number of edges.

**Why these complexities?**

- **Best Case -- O(V+E):** Even in the best case, BFS must visit all reachable vertices and examine all their edges. Each vertex is enqueued and dequeued exactly once (O(V)), and each edge is examined once in a directed graph or twice in an undirected graph (O(E)).

- **Average Case -- O(V+E):** The same analysis applies. BFS is consistent in its performance regardless of graph structure, as it systematically explores every reachable vertex and edge exactly once.

- **Worst Case -- O(V+E):** The worst case matches the average case. The total work is proportional to the size of the graph representation (adjacency list). For an adjacency matrix, the worst case would be O(V^2).

- **Space -- O(V):** The queue can hold at most O(V) vertices (in the case of a star graph where all vertices are neighbors of the source). The visited set also requires O(V) space. Together, the space complexity is O(V).

## When to Use

- **Shortest path in unweighted graphs:** BFS naturally finds the minimum number of edges from the source to every reachable vertex.
- **Level-order traversal:** BFS processes nodes level by level, which is useful for tree traversal, printing levels, and computing depths.
- **Finding connected components:** Running BFS from each unvisited vertex identifies all connected components in an undirected graph.
- **Checking bipartiteness:** BFS can determine if a graph is bipartite by assigning alternating colors to levels.
- **Web crawling and social network analysis:** BFS explores neighbors before distant nodes, modeling "degrees of separation" naturally.

## When NOT to Use

- **Weighted graphs:** BFS does not account for edge weights. Use Dijkstra's algorithm for shortest paths in weighted graphs.
- **Deep, narrow graphs:** If the solution is deep in a narrow graph, DFS may find it faster with less memory.
- **Memory-constrained environments:** BFS requires O(V) space for the queue, which can be prohibitive for very large graphs. DFS uses O(V) space too but often less in practice.
- **When you need to explore all paths:** BFS finds shortest paths but does not enumerate all paths. Use DFS-based backtracking for that.

## Comparison with Similar Algorithms

| Algorithm   | Time      | Space | Finds Shortest Path | Notes                                    |
|-------------|----------|-------|--------------------|-----------------------------------------|
| BFS         | O(V+E)  | O(V)  | Yes (unweighted)   | Layer-by-layer exploration              |
| DFS         | O(V+E)  | O(V)  | No                 | Deep exploration; uses stack/recursion   |
| Dijkstra's  | O((V+E) log V) | O(V) | Yes (weighted) | Handles non-negative edge weights       |
| A* Search   | O(E)    | O(V)  | Yes (weighted)     | Uses heuristic to guide search          |

## Implementations

| Language   | File |
|------------|------|
| C++        | [BFS.cpp](cpp/BFS.cpp) |
| Java       | [BFS.java](java/BFS.java) |
| Python     | [BFS.py](python/BFS.py) |
| Python     | [BreadthFirstSearch.py](python/BreadthFirstSearch.py) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22: Elementary Graph Algorithms (Section 22.2: Breadth-First Search).
- Knuth, D. E. (2011). *The Art of Computer Programming, Volume 4A: Combinatorial Algorithms*. Addison-Wesley.
- [Breadth-First Search -- Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)
