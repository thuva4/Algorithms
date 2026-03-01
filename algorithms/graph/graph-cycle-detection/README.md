# Graph Cycle Detection (DFS Coloring)

## Overview

This algorithm detects whether a directed graph contains a cycle using DFS with three-color marking (white/gray/black). A vertex colored white is unvisited, gray means it is currently being explored (on the recursion stack), and black means it is fully processed. A back edge to a gray vertex indicates a cycle.

## How It Works

1. Initialize all vertices as WHITE (0 = unvisited).
2. For each unvisited vertex, start a DFS.
3. Mark the current vertex GRAY (1 = in progress).
4. For each neighbor: if GRAY, a cycle is found; if WHITE, recurse.
5. After processing all neighbors, mark the vertex BLACK (2 = done).

Input format: [n, m, u1, v1, ...]. Output: 1 if cycle exists, 0 otherwise.

## Worked Example

Consider a directed graph with 4 vertices:

```
    0 ---> 1 ---> 2
           ^      |
           |      |
           +------+
           3 <----/
           (wait, let me redraw)
```

Actually:

```
    0 ---> 1 ---> 2
                  |
                  v
                  3 ---> 1    (back edge!)
```

Edges: 0->1, 1->2, 2->3, 3->1.

**DFS from vertex 0:**
1. Visit 0, mark GRAY. Explore neighbor 1.
2. Visit 1, mark GRAY. Explore neighbor 2.
3. Visit 2, mark GRAY. Explore neighbor 3.
4. Visit 3, mark GRAY. Explore neighbor 1.
5. Vertex 1 is **GRAY** (on current recursion stack). **Cycle detected!**

The cycle is: 1 -> 2 -> 3 -> 1.

**Counter-example (DAG):**

```
    0 ---> 1 ---> 3
    |             ^
    v             |
    2 ------------+
```

Edges: 0->1, 0->2, 1->3, 2->3.

DFS from 0: Visit 0(GRAY) -> 1(GRAY) -> 3(GRAY -> BLACK) -> back to 1(BLACK) -> back to 0, explore 2(GRAY) -> 3 is BLACK (not GRAY). 2 -> BLACK. 0 -> BLACK. No cycle found. Output: 0.

## Pseudocode

```
function hasCycle(graph, n):
    color = array of size n, initialized to WHITE (0)

    function dfs(u):
        color[u] = GRAY   // currently being explored

        for each neighbor v of u:
            if color[v] == GRAY:
                return true    // back edge = cycle
            if color[v] == WHITE:
                if dfs(v):
                    return true

        color[u] = BLACK       // fully processed
        return false

    for i = 0 to n-1:
        if color[i] == WHITE:
            if dfs(i):
                return true

    return false
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

## When to Use

- **Dependency resolution**: Detecting circular dependencies in build systems, package managers, or module imports
- **Deadlock detection**: Identifying cycles in wait-for graphs in operating systems or databases
- **Topological sort prerequisite**: Verifying that a DAG is indeed acyclic before performing topological sort
- **Course prerequisite validation**: Checking that a course prerequisite graph has no circular dependencies
- **Workflow validation**: Ensuring directed workflow graphs have no infinite loops

## When NOT to Use

- **Undirected graphs**: For undirected graphs, cycle detection is simpler (any back edge in DFS indicates a cycle, and a union-find approach also works); the three-color method is designed for directed graphs
- **Finding all cycles**: This algorithm only detects whether a cycle exists; to enumerate all cycles, use Johnson's algorithm
- **Weighted negative cycles**: For detecting negative-weight cycles (relevant to shortest paths), use Bellman-Ford instead
- **Very large graphs with known structure**: If the graph is known to be a tree or DAG, the check is unnecessary

## Comparison

| Algorithm | Graph Type | Detects | Time | Space |
|-----------|-----------|---------|------|-------|
| DFS 3-coloring (this) | Directed | Any cycle | O(V + E) | O(V) |
| Floyd's Tortoise-Hare | Linked list / functional graph | Cycle + start + length | O(n) | O(1) |
| Union-Find | Undirected | Any cycle | O(E * alpha(V)) | O(V) |
| DFS back-edge (undirected) | Undirected | Any cycle | O(V + E) | O(V) |
| Bellman-Ford | Weighted directed | Negative cycles | O(V * E) | O(V) |
| Topological Sort (Kahn's) | Directed | Cycle (if sort fails) | O(V + E) | O(V) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Section 22.3: Depth-first search.
- [Cycle detection -- Wikipedia](https://en.wikipedia.org/wiki/Cycle_(graph_theory)#Cycle_detection)
- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." SIAM Journal on Computing, 1(2), 146-160.

## Implementations

| Language   | File |
|------------|------|
| Python     | [graph_cycle_detection.py](python/graph_cycle_detection.py) |
| Java       | [GraphCycleDetection.java](java/GraphCycleDetection.java) |
| C++        | [graph_cycle_detection.cpp](cpp/graph_cycle_detection.cpp) |
| C          | [graph_cycle_detection.c](c/graph_cycle_detection.c) |
| Go         | [graph_cycle_detection.go](go/graph_cycle_detection.go) |
| TypeScript | [graphCycleDetection.ts](typescript/graphCycleDetection.ts) |
| Rust       | [graph_cycle_detection.rs](rust/graph_cycle_detection.rs) |
| Kotlin     | [GraphCycleDetection.kt](kotlin/GraphCycleDetection.kt) |
| Swift      | [GraphCycleDetection.swift](swift/GraphCycleDetection.swift) |
| Scala      | [GraphCycleDetection.scala](scala/GraphCycleDetection.scala) |
| C#         | [GraphCycleDetection.cs](csharp/GraphCycleDetection.cs) |
