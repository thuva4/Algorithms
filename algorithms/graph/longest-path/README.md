# Longest Path

## Overview

The Longest Path algorithm finds the longest path (by total edge weight or number of edges) in a Directed Acyclic Graph (DAG). While finding the longest path in a general graph is NP-hard, DAGs admit an efficient O(V+E) solution by leveraging topological sorting. The algorithm first topologically sorts the DAG, then processes vertices in topological order, relaxing edges in reverse (using maximum instead of minimum) to build up longest path distances.

This algorithm is essential for critical path analysis in project management (CPM/PERT), scheduling problems, and determining the minimum time to complete a set of dependent tasks.

## How It Works

The algorithm first performs a topological sort of the DAG. It initializes all distances to negative infinity (or zero for single-source) except the source vertex (distance 0). Then, processing vertices in topological order, for each vertex u it examines all outgoing edges (u, v, w) and updates the longest distance to v: `dist[v] = max(dist[v], dist[u] + w)`. Because vertices are processed in topological order, when we process vertex u, all paths leading to u have already been fully computed.

### Example

Consider the following DAG with edge weights representing task durations:

```
        3       2
    A -----> B -----> D
    |        |        ^
    |   1    |  4     |
    v        v        |
    C -----> E -----> D
        2       5
```

Adjacency list with weights:
```
A: [(B, 3), (C, 1)]
B: [(D, 2), (E, 4)]
C: [(E, 2)]
E: [(D, 5)]
D: []
```

**Step 1:** Topological sort: `A, B, C, E, D` (or `A, C, B, E, D`)

**Step 2:** Initialize distances from source `A`: `A=0, B=-inf, C=-inf, D=-inf, E=-inf`

**Step 3:** Process vertices in topological order:

| Step | Process | Outgoing Edges | Updates | Distances |
|------|---------|---------------|---------|-----------|
| 1 | `A` | A->B(3), A->C(1) | B=max(-inf, 0+3)=3, C=max(-inf, 0+1)=1 | `A=0, B=3, C=1, D=-inf, E=-inf` |
| 2 | `B` | B->D(2), B->E(4) | D=max(-inf, 3+2)=5, E=max(-inf, 3+4)=7 | `A=0, B=3, C=1, D=5, E=7` |
| 3 | `C` | C->E(2) | E=max(7, 1+2)=7 (no change) | `A=0, B=3, C=1, D=5, E=7` |
| 4 | `E` | E->D(5) | D=max(5, 7+5)=12 | `A=0, B=3, C=1, D=12, E=7` |
| 5 | `D` | (none) | -- | `A=0, B=3, C=1, D=12, E=7` |

Result: Longest path from A to D = 12, via `A -> B -> E -> D` (3 + 4 + 5 = 12).

The critical path is `A -> B -> E -> D`, which represents the minimum time to complete all tasks if they are executed with maximum parallelism.

## Pseudocode

```
function longestPath(graph, source, V):
    // Step 1: Topological sort
    topoOrder = topologicalSort(graph, V)

    // Step 2: Initialize distances
    dist = array of size V, initialized to -infinity
    dist[source] = 0

    // Step 3: Process vertices in topological order
    for each vertex u in topoOrder:
        if dist[u] != -infinity:
            for each (v, weight) in graph[u]:
                if dist[u] + weight > dist[v]:
                    dist[v] = dist[u] + weight

    return dist
```

The key insight is that topological order guarantees all predecessors of a vertex are processed before the vertex itself. This means when we relax edges from vertex u, the longest path to u is already finalized.

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

**Why these complexities?**

- **Best Case -- O(V+E):** The topological sort takes O(V+E). Processing all vertices and edges in the relaxation phase also takes O(V+E). Together, the total is O(V+E).

- **Average Case -- O(V+E):** Each vertex is processed exactly once during topological sort and once during the relaxation phase. Each edge is examined exactly once during relaxation. The total work is proportional to the graph size.

- **Worst Case -- O(V+E):** The algorithm always performs a full topological sort and a full relaxation pass, regardless of graph structure. The time is always linear in the size of the graph.

- **Space -- O(V):** The distance array and topological ordering each require O(V) space. The topological sort itself uses O(V) space for the visited set and stack.

## When to Use

- **Critical Path Method (CPM):** Determining the longest path in a project task graph gives the minimum project duration and identifies tasks that cannot be delayed without delaying the entire project.
- **PERT (Program Evaluation and Review Technique):** Similar to CPM, used for scheduling and analyzing tasks in a project network.
- **Scheduling with dependencies:** When tasks have prerequisites and you need to find the minimum completion time or the sequence of tasks that determines the overall schedule.
- **Pipeline optimization:** In processor pipelines and data flow graphs, the longest path determines the minimum clock period or throughput.
- **Any DAG optimization problem:** Many dynamic programming problems on DAGs reduce to finding the longest (or shortest) path.

## When NOT to Use

- **Graphs with cycles:** The longest path problem on general graphs (with cycles) is NP-hard. This algorithm only works on DAGs.
- **Undirected graphs:** Topological sorting and the longest path algorithm require directed edges. The longest path problem on undirected graphs is also NP-hard.
- **When shortest path is needed:** Use Dijkstra's, Bellman-Ford, or standard topological sort-based shortest path algorithms instead.
- **Graphs with negative weights where shortest path is desired:** While the longest path algorithm maximizes, do not confuse it with negating weights to find shortest paths (which is valid on DAGs but has dedicated algorithms).

## Comparison with Similar Algorithms

| Algorithm              | Time    | Space | Problem | Notes                                    |
|------------------------|---------|-------|---------|------------------------------------------|
| Longest Path (DAG)     | O(V+E) | O(V)  | Longest path | Only works on DAGs                |
| Shortest Path (DAG)    | O(V+E) | O(V)  | Shortest path | Same approach, minimize instead   |
| Dijkstra's             | O((V+E) log V) | O(V) | Shortest path | Non-negative weights; any graph  |
| Topological Sort       | O(V+E) | O(V)  | Ordering | Prerequisite for this algorithm   |
| Bellman-Ford (negated) | O(VE)  | O(V)  | Longest path | Slower; works by negating weights |

## Implementations

| Language | File |
|----------|------|
| C++      | [LongestPath.cpp](cpp/LongestPath.cpp) |
| Python   | [Longest_path.py](python/Longest_path.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 24: Single-Source Shortest Paths (Section 24.2: Single-Source Shortest Paths in Directed Acyclic Graphs).
- Sedgewick, R., & Wayne, K. (2011). *Algorithms* (4th ed.). Addison-Wesley. Chapter 4: Shortest Paths.
- [Longest Path Problem -- Wikipedia](https://en.wikipedia.org/wiki/Longest_path_problem)
