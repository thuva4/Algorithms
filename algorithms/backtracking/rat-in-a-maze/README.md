# Rat in a Maze

## Overview

The Rat in a Maze problem determines whether a path exists from the top-left corner (0,0) to the bottom-right corner (n-1,n-1) in an NxN grid. Cells with value 1 are open and cells with value 0 are blocked. The rat can move in up to four directions: right, down, left, and up (though the simplest variant restricts movement to right and down only).

This is a classic backtracking problem that illustrates how recursive exploration with constraint checking can solve path-finding tasks. The algorithm systematically tries each possible direction from the current cell, marks cells as visited to prevent cycles, and backtracks when it reaches a dead end. The problem appears frequently in algorithm courses and coding interviews as an introduction to grid-based backtracking.

The Rat in a Maze problem is closely related to depth-first search on an implicit graph, where each open cell is a node and edges connect adjacent open cells. Unlike BFS-based shortest-path algorithms, the backtracking approach finds any valid path (not necessarily the shortest) and can be extended to find all paths.

## How It Works

1. Start at cell (0,0). If the starting cell is blocked (value 0), no path exists -- return failure immediately.
2. Mark the current cell as visited to prevent revisiting it during this path.
3. If the current cell is the destination (n-1, n-1), a path has been found -- return success.
4. Try each possible direction (right, down, left, up) from the current cell:
   - Compute the next cell coordinates.
   - Check that the next cell is within bounds, is open (value 1), and has not been visited.
   - If valid, recursively attempt to solve from the next cell.
   - If the recursive call succeeds, propagate success upward.
5. If no direction leads to a solution, unmark the current cell (backtrack) and return failure.
6. The caller then tries the next direction or backtracks further.

## Pseudocode

```
function solveMaze(maze, n):
    visited = new boolean[n][n], all false
    return backtrack(maze, 0, 0, n, visited)

function backtrack(maze, row, col, n, visited):
    // Base case: reached destination
    if row == n-1 and col == n-1:
        return true

    // Mark current cell as visited
    visited[row][col] = true

    // Try all four directions: right, down, left, up
    directions = [(0,1), (1,0), (0,-1), (-1,0)]

    for (dr, dc) in directions:
        newRow = row + dr
        newCol = col + dc

        if isValid(newRow, newCol, n, maze, visited):
            if backtrack(maze, newRow, newCol, n, visited):
                return true

    // Backtrack: unmark current cell
    visited[row][col] = false
    return false

function isValid(row, col, n, maze, visited):
    return row >= 0 and row < n
       and col >= 0 and col < n
       and maze[row][col] == 1
       and not visited[row][col]
```

## Example

Consider a 4x4 maze where 1 = open and 0 = blocked:

```
Maze:               Visited/Path:
1  0  0  0          *  .  .  .
1  1  0  1          *  *  .  .
0  1  0  0          .  *  .  .
1  1  1  1          .  *  *  *
```

**Step-by-step walkthrough:**

| Step | Position | Direction tried | Valid? | Action |
|------|----------|----------------|--------|--------|
| 1 | (0,0) | Right to (0,1) | No (blocked) | Try next direction |
| 2 | (0,0) | Down to (1,0) | Yes | Move to (1,0), recurse |
| 3 | (1,0) | Right to (1,1) | Yes | Move to (1,1), recurse |
| 4 | (1,1) | Right to (1,2) | No (blocked) | Try next direction |
| 5 | (1,1) | Down to (2,1) | Yes | Move to (2,1), recurse |
| 6 | (2,1) | Right to (2,2) | No (blocked) | Try next direction |
| 7 | (2,1) | Down to (3,1) | Yes | Move to (3,1), recurse |
| 8 | (3,1) | Right to (3,2) | Yes | Move to (3,2), recurse |
| 9 | (3,2) | Right to (3,3) | Yes | Destination reached! |

**Path found:** (0,0) -> (1,0) -> (1,1) -> (2,1) -> (3,1) -> (3,2) -> (3,3)
**Result:** 1 (path exists)

## Complexity Analysis

| Case    | Time        | Space  |
|---------|-------------|--------|
| Best    | O(n)        | O(n^2) |
| Average | O(4^(n^2))  | O(n^2) |
| Worst   | O(4^(n^2))  | O(n^2) |

**Why these complexities?**

- **Best Case -- O(n):** If the path follows a straight line (e.g., along the first column and last row), only 2n-1 cells are visited with no backtracking needed.

- **Average/Worst Case -- O(4^(n^2)):** In the worst case, the algorithm may explore all possible paths through the grid. At each of the n^2 cells, up to 4 directions can be tried. The visited array prevents revisiting cells on the current path, but different path orderings can still lead to exponential exploration. In practice, blocked cells and the visited check prune the search space significantly.

- **Space -- O(n^2):** The visited matrix requires n^2 space. The recursion depth is at most n^2 (the maximum path length through the grid), so the call stack also uses O(n^2) space.

**Note:** For finding the shortest path, BFS is preferred with O(n^2) time complexity. Backtracking is used here to find any valid path and to illustrate the backtracking paradigm.

## Applications

- **Maze solving and robotics:** Navigating a robot through a grid of obstacles to reach a target location.
- **Game level validation:** Verifying that a maze or dungeon level has a solvable path from start to finish.
- **Network routing:** Finding a route through a network where some links are down or congested.
- **Circuit board design:** Tracing connections on a PCB while avoiding occupied regions.
- **Image processing:** Connected component analysis and flood fill algorithms share the same recursive exploration pattern.

## When NOT to Use

- **When the shortest path is required:** Backtracking finds any path, not necessarily the shortest. Use BFS (breadth-first search) or Dijkstra's algorithm for shortest-path guarantees.
- **Large grids with many open paths:** The exponential worst case makes backtracking impractical for very large mazes (e.g., 1000x1000). BFS or A* search handle large grids efficiently in O(n^2) time.
- **Weighted grids:** If edges have different costs, Dijkstra's algorithm or A* is appropriate. Backtracking does not account for edge weights.
- **When all paths must be enumerated on large grids:** The number of paths can be exponential. If counting paths is the goal, dynamic programming is far more efficient for grid-based problems.
- **Real-time systems:** The unpredictable runtime of backtracking makes it unsuitable for applications requiring guaranteed response times.

## Comparison

| Algorithm | Time | Space | Finds Shortest? | Finds All Paths? | Notes |
|-----------|------|-------|-----------------|-----------------|-------|
| Backtracking (this) | O(4^(n^2)) | O(n^2) | No | Yes (with modification) | Simple to implement; good for small grids |
| BFS | O(n^2) | O(n^2) | Yes | No | Best for shortest path in unweighted grids |
| DFS (iterative) | O(n^2) | O(n^2) | No | No | Same traversal order as backtracking but without path recovery |
| A* Search | O(n^2 log n) | O(n^2) | Yes | No | Optimal for weighted grids with admissible heuristic |
| Dijkstra's | O(n^2 log n) | O(n^2) | Yes | No | Optimal for weighted grids without heuristic |
| DP (path counting) | O(n^2) | O(n^2) | N/A | Counts only | Efficient for counting paths in DAG-structured grids (right/down only) |

Backtracking is the preferred approach for educational purposes and for small grids where exploring all possible paths is acceptable. For production pathfinding in large grids, BFS or A* should be used instead.

## Implementations

| Language   | File |
|------------|------|
| Python     | [rat_in_a_maze.py](python/rat_in_a_maze.py) |
| Java       | [RatInAMaze.java](java/RatInAMaze.java) |
| C++        | [rat_in_a_maze.cpp](cpp/rat_in_a_maze.cpp) |
| C          | [rat_in_a_maze.c](c/rat_in_a_maze.c) |
| Go         | [rat_in_a_maze.go](go/rat_in_a_maze.go) |
| TypeScript | [ratInAMaze.ts](typescript/ratInAMaze.ts) |
| Rust       | [rat_in_a_maze.rs](rust/rat_in_a_maze.rs) |
| Kotlin     | [RatInAMaze.kt](kotlin/RatInAMaze.kt) |
| Swift      | [RatInAMaze.swift](swift/RatInAMaze.swift) |
| Scala      | [RatInAMaze.scala](scala/RatInAMaze.scala) |
| C#         | [RatInAMaze.cs](csharp/RatInAMaze.cs) |

## References

- Sedgewick, R., & Wayne, K. (2011). *Algorithms* (4th ed.). Addison-Wesley. Chapter on graph search.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22: Elementary Graph Algorithms.
- Skiena, S. S. (2008). *The Algorithm Design Manual* (2nd ed.). Springer. Section 7.1: Backtracking.
- [Rat in a Maze -- GeeksforGeeks](https://www.geeksforgeeks.org/rat-in-a-maze-backtracking-2/)
