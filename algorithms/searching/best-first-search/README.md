# Best-First Search

## Overview

Best-First Search is a heuristic graph traversal algorithm that explores the most promising node first, as determined by an evaluation function. It uses a priority queue to always expand the node with the lowest heuristic cost, making it a greedy approach to graph search. The algorithm is particularly useful in pathfinding and AI applications where a heuristic can estimate the distance or cost to the goal.

Best-First Search is a general framework that encompasses several specific algorithms. Greedy Best-First Search uses only the heuristic estimate to the goal, while A* Search combines the heuristic with the actual cost from the start. In its pure greedy form, Best-First Search is not guaranteed to find the optimal path, but it is often fast in practice.

## How It Works

Best-First Search maintains a priority queue (open list) of nodes to explore, ordered by their heuristic value. Starting from the source node, it dequeues the node with the best (lowest) heuristic value, marks it as visited, and adds its unvisited neighbors to the priority queue with their heuristic values. This continues until the goal is found or the priority queue is empty.

### Example

Consider the following graph with heuristic values h(n) estimating distance to the goal node `G`:

```
Graph:                  Heuristic h(n):
A --3-- B --4-- G       h(A) = 7
|       |               h(B) = 4
2       5               h(C) = 6
|       |               h(D) = 5
C --6-- D               h(G) = 0
```

**Goal:** Find a path from `A` to `G` using Greedy Best-First Search.

| Step | Priority Queue (node, h) | Dequeue | Action | Visited |
|------|-------------------------|---------|--------|---------|
| 1 | `[(A, 7)]` | `A` | Add neighbors B(h=4), C(h=6) | {A} |
| 2 | `[(B, 4), (C, 6)]` | `B` | Add neighbors D(h=5), G(h=0) | {A, B} |
| 3 | `[(G, 0), (D, 5), (C, 6)]` | `G` | Goal found! | {A, B, G} |

Result: Path found: `A -> B -> G` with cost 3 + 4 = 7.

Note: The greedy approach found a path quickly, but it may not always find the shortest path. In this case, the path happens to be optimal.

## Pseudocode

```
function bestFirstSearch(graph, start, goal, heuristic):
    openList = PriorityQueue()
    openList.insert(start, heuristic(start))
    visited = empty set

    while openList is not empty:
        current = openList.extractMin()

        if current == goal:
            return reconstructPath(current)

        visited.add(current)

        for each neighbor of current in graph:
            if neighbor not in visited:
                openList.insert(neighbor, heuristic(neighbor))

    return null  // no path found
```

The heuristic function guides the search toward the goal. The quality of the heuristic directly impacts the algorithm's efficiency and the quality of the path found.

## Complexity Analysis

| Case    | Time    | Space   |
|---------|---------|---------|
| Best    | O(1)    | O(b^d)  |
| Average | O(b^d)  | O(b^d)  |
| Worst   | O(b^d)  | O(b^d)  |

Where `b` is the branching factor and `d` is the depth of the solution.

**Why these complexities?**

- **Best Case -- O(1):** The start node is the goal, or the heuristic immediately guides the search to the goal in constant steps. This is rare but possible with a perfect heuristic.

- **Average Case -- O(b^d):** The algorithm explores nodes level by level in the direction the heuristic guides it. With a reasonable heuristic, this is often much better than exhaustive search, but in the worst case the heuristic provides no useful guidance and the algorithm degenerates to exploring all nodes up to depth d.

- **Worst Case -- O(b^d):** If the heuristic is misleading, the algorithm may explore an exponential number of nodes before finding the goal. In the worst case, it behaves like breadth-first search, visiting all nodes up to depth d, each of which has up to b children.

- **Space -- O(b^d):** The priority queue may need to store all nodes at the frontier of the search, which can grow exponentially with depth. This is the primary limitation of Best-First Search for deep search spaces.

## When to Use

- **Pathfinding with good heuristics:** When you have a reliable heuristic estimate (e.g., Euclidean distance for geographic routing), Best-First Search finds paths quickly.
- **AI and game playing:** Best-First Search is foundational in AI for state-space search problems where heuristics are available.
- **When speed matters more than optimality:** Greedy Best-First Search is often faster than A* because it does not track path costs, though it may find suboptimal paths.
- **Puzzle solving:** Problems like the 8-puzzle, 15-puzzle, and Rubik's Cube benefit from heuristic-guided search.
- **Exploring large state spaces:** When the state space is too large for exhaustive search, heuristics help focus the search on promising regions.

## When NOT to Use

- **When optimal paths are required:** Greedy Best-First Search does not guarantee the shortest path. Use A* Search instead for optimality with an admissible heuristic.
- **When no good heuristic is available:** Without a meaningful heuristic, Best-First Search degenerates and may perform worse than BFS or DFS.
- **Memory-constrained environments:** The O(b^d) space requirement can be prohibitive for deep searches. Consider IDA* or RBFS for memory-efficient alternatives.
- **Graphs with uniform costs:** If all edges have equal weight, BFS is simpler and guarantees the shortest path without needing a heuristic.

## Comparison with Similar Algorithms

| Algorithm          | Time (avg) | Space  | Optimal | Notes                                    |
|--------------------|-----------|--------|---------|------------------------------------------|
| Best-First Search  | O(b^d)    | O(b^d) | No      | Fast with good heuristic; not optimal    |
| A* Search          | O(b^d)    | O(b^d) | Yes*    | Optimal with admissible heuristic        |
| BFS                | O(V+E)    | O(V)   | Yes**   | Optimal for unweighted graphs            |
| Dijkstra's         | O((V+E) log V) | O(V) | Yes  | Optimal for non-negative weighted graphs |

*With admissible heuristic. **For unweighted graphs only.

## Implementations

| Language | File |
|----------|------|
| Java     | [BestFirstSearch.java](java/BestFirstSearch.java) |

## References

- Russell, S. J., & Norvig, P. (2010). *Artificial Intelligence: A Modern Approach* (3rd ed.). Prentice Hall. Chapter 3: Solving Problems by Searching.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Best-first Search -- Wikipedia](https://en.wikipedia.org/wiki/Best-first_search)
