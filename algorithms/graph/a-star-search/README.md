# A* Search

## Overview

A* (pronounced "A-star") Search is a best-first graph search algorithm that finds the shortest path from a start node to a goal node. It combines the strengths of Dijkstra's Algorithm (which guarantees optimal paths) and Greedy Best-First Search (which is fast with a good heuristic) by using an evaluation function f(n) = g(n) + h(n), where g(n) is the actual cost from the start to node n, and h(n) is a heuristic estimate of the cost from n to the goal.

Developed by Peter Hart, Nils Nilsson, and Bertram Raphael in 1968, A* is the gold standard for pathfinding in games, robotics, and navigation systems. When the heuristic h(n) is admissible (never overestimates the true cost) and consistent, A* is guaranteed to find the optimal shortest path.

## How It Works

A* maintains an open set (priority queue) of nodes to explore, ordered by f(n) = g(n) + h(n). At each step, it extracts the node with the lowest f value. For each neighbor of the current node, it computes a tentative g value through the current node. If this is better than the neighbor's current g value, the neighbor's path is updated. Nodes are moved to a closed set once processed to avoid revisiting them.

### Example

Consider the following weighted graph with heuristic values (straight-line distances to goal G):

```
        1       4
    S -----> A -----> G
    |        |        ^
    |   2    |  3     |
    +------> B ------+
         5       2
    S ---------> C ---> G (no direct edge)
```

Adjacency list with weights:
```
S: [(A, 1), (B, 2)]
A: [(B, 2), (G, 4)]
B: [(G, 3)]
```

Heuristic h(n) to goal G: `h(S)=5, h(A)=3, h(B)=2, h(G)=0`

| Step | Open Set (node, f=g+h) | Extract | g values | Action |
|------|----------------------|---------|----------|--------|
| 1 | `[(S, 0+5=5)]` | `S` | S=0 | Add A(g=1, f=1+3=4), B(g=2, f=2+2=4) |
| 2 | `[(A, 4), (B, 4)]` | `A` | S=0, A=1 | Add G(g=1+4=5, f=5+0=5); B via A: g=1+2=3, f=3+2=5 (worse than g=2) |
| 3 | `[(B, 4), (G, 5)]` | `B` | S=0, A=1, B=2 | G via B: g=2+3=5, f=5+0=5 (same, no update) |
| 4 | `[(G, 5)]` | `G` | S=0, A=1, B=2, G=5 | Goal reached! |

Result: Shortest path: `S -> A -> G` with cost 5. (Or equivalently `S -> B -> G` also with cost 5.)

## Pseudocode

```
function aStarSearch(graph, start, goal, heuristic):
    openSet = PriorityQueue()
    openSet.insert(start, heuristic(start))

    gScore = map of vertex -> infinity
    gScore[start] = 0

    cameFrom = empty map

    while openSet is not empty:
        current = openSet.extractMin()

        if current == goal:
            return reconstructPath(cameFrom, current)

        for each (neighbor, weight) in graph[current]:
            tentativeG = gScore[current] + weight

            if tentativeG < gScore[neighbor]:
                cameFrom[neighbor] = current
                gScore[neighbor] = tentativeG
                fScore = tentativeG + heuristic(neighbor)
                openSet.insertOrUpdate(neighbor, fScore)

    return null  // no path exists

function reconstructPath(cameFrom, current):
    path = [current]
    while current in cameFrom:
        current = cameFrom[current]
        path.prepend(current)
    return path
```

The key insight of A* is the f = g + h evaluation. The g component ensures the algorithm accounts for actual path cost, while the h component guides the search toward the goal.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(E) | O(V)  |
| Average | O(E) | O(V)  |
| Worst   | O(E) | O(V)  |

Note: These are simplified. The actual complexity depends heavily on the quality of the heuristic.

**Why these complexities?**

- **Best Case -- O(E):** With a perfect heuristic (h(n) = actual cost to goal), A* expands only the nodes on the optimal path. In practice, this means only a small fraction of edges are examined.

- **Average Case -- O(E):** With a good admissible heuristic, A* examines significantly fewer nodes than Dijkstra's. The effective branching factor is reduced, and in many practical scenarios the algorithm runs in time proportional to the number of edges examined on the search frontier.

- **Worst Case -- O(E):** In the worst case (e.g., h(n) = 0 for all n), A* degenerates to Dijkstra's Algorithm with complexity O((V+E) log V). With a poor heuristic, it may explore the entire graph. The metadata lists O(E) as the worst case, which applies when the heuristic effectively limits the search to a subset of edges.

- **Space -- O(V):** The open and closed sets together may store all V vertices in the worst case. This is the primary limitation of A*, and memory-efficient variants like IDA* and SMA* address this.

## When to Use

- **Pathfinding in games and robotics:** A* is the industry standard for finding shortest paths on grids, navmeshes, and general graphs with spatial heuristics.
- **Navigation and routing:** GPS systems use A* (or variants) with geographic distance as the heuristic.
- **When a good heuristic is available:** A* dramatically outperforms uninformed search when the heuristic is informative (close to the true cost).
- **When optimality is required:** With an admissible and consistent heuristic, A* guarantees finding the shortest path.
- **Puzzle solving:** The 8-puzzle, 15-puzzle, and similar state-space search problems are classic A* applications.

## When NOT to Use

- **When no heuristic is available:** Without a meaningful heuristic, use Dijkstra's Algorithm instead. A* with h(n) = 0 is exactly Dijkstra's.
- **Memory-constrained environments:** A* stores all explored nodes, which can exhaust memory on very large search spaces. Use IDA* or beam search instead.
- **Graphs with negative edge weights:** A* does not handle negative edge weights. Use Bellman-Ford instead.
- **All-pairs shortest paths:** A* is designed for single source-to-target queries. Use Floyd-Warshall or Johnson's for all-pairs.

## Comparison with Similar Algorithms

| Algorithm         | Time              | Space  | Optimal | Heuristic | Notes                                    |
|-------------------|-------------------|--------|---------|-----------|------------------------------------------|
| A* Search         | O(E)*             | O(V)   | Yes**   | Yes       | Best with good heuristic                 |
| Dijkstra's        | O((V+E) log V)    | O(V)   | Yes     | No        | A* with h=0; explores more nodes         |
| Greedy Best-First | O(b^d)            | O(b^d) | No      | Yes       | Fast but not optimal                     |
| BFS               | O(V+E)            | O(V)   | Yes***  | No        | Optimal only for unweighted graphs       |

*Depends heavily on heuristic quality. **With admissible heuristic. ***Unweighted graphs only.

## Implementations

| Language | File |
|----------|------|
| C++      | [a_star.cpp](cpp/a_star.cpp) |
| Python   | [astar.py](python/astar.py) |
| Python   | [astar_demo.py](python/astar_demo.py) |

## References

- Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). "A formal basis for the heuristic determination of minimum cost paths". *IEEE Transactions on Systems Science and Cybernetics*. 4(2): 100-107.
- Russell, S. J., & Norvig, P. (2010). *Artificial Intelligence: A Modern Approach* (3rd ed.). Prentice Hall. Chapter 3: Solving Problems by Searching.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [A* Search Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/A*_search_algorithm)
