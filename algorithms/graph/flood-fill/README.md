# Flood Fill

## Overview

Flood Fill is a graph traversal algorithm that determines and modifies the area connected to a given node in a multi-dimensional array (typically a 2D grid). Starting from a seed point, it explores all connected cells that share the same value (or color) and replaces them with a new value. The algorithm is the digital equivalent of the "paint bucket" tool found in image editing software, and it forms the basis for region detection in image processing.

Flood Fill can be implemented using either DFS (recursive or stack-based) or BFS (queue-based), and both approaches visit the same set of cells. The algorithm is simple, intuitive, and widely applicable to grid-based problems.

## How It Works

Starting from a seed cell, Flood Fill checks if the current cell matches the target color (the original color of the seed). If it does, the cell is filled with the replacement color, and the algorithm recursively (or iteratively) processes all adjacent cells (typically 4-connected: up, down, left, right). The process continues until all connected cells of the same original color have been filled. Cells that have already been filled (or have a different color) act as natural boundaries.

### Example

Given a 5x5 grid, seed point `(1, 1)`, original color = `0`, new color = `2`:

```
Initial Grid:          After Flood Fill:
1 1 1 1 1              1 1 1 1 1
1 0 0 0 1              1 2 2 2 1
1 0 1 0 1              1 2 1 2 1
1 0 0 0 1              1 2 2 2 1
1 1 1 1 1              1 1 1 1 1
```

**Step-by-step (BFS from (1,1)):**

| Step | Process Cell | Value | Action | Queue |
|------|-------------|-------|--------|-------|
| 1 | (1,1) | 0 | Fill with 2, enqueue neighbors | [(2,1), (1,2), (0,1), (1,0)] |
| 2 | (2,1) | 0 | Fill with 2, enqueue neighbors | [(1,2), (0,1), (1,0), (3,1)] |
| 3 | (1,2) | 0 | Fill with 2, enqueue neighbors | [(0,1), (1,0), (3,1), (1,3)] |
| 4 | (0,1) | 1 | Skip (not target color) | [(1,0), (3,1), (1,3)] |
| 5 | (1,0) | 1 | Skip | [(3,1), (1,3)] |
| 6 | (3,1) | 0 | Fill with 2, enqueue neighbors | [(1,3), (4,1), (3,2)] |
| 7 | (1,3) | 0 | Fill with 2, enqueue neighbors | [(4,1), (3,2), (1,4)] |
| ... | ... | ... | Continue until queue empty | ... |

Result: All `0`s connected to `(1,1)` are replaced with `2`. The `1`s form a border that stops the fill.

## Pseudocode

```
// Recursive DFS version
function floodFill(grid, row, col, targetColor, newColor):
    if row < 0 or row >= rows or col < 0 or col >= cols:
        return
    if grid[row][col] != targetColor:
        return
    if targetColor == newColor:
        return

    grid[row][col] = newColor

    floodFill(grid, row + 1, col, targetColor, newColor)  // down
    floodFill(grid, row - 1, col, targetColor, newColor)  // up
    floodFill(grid, row, col + 1, targetColor, newColor)  // right
    floodFill(grid, row, col - 1, targetColor, newColor)  // left

// BFS version
function floodFillBFS(grid, startRow, startCol, newColor):
    targetColor = grid[startRow][startCol]
    if targetColor == newColor:
        return

    queue = empty queue
    queue.enqueue((startRow, startCol))
    grid[startRow][startCol] = newColor

    while queue is not empty:
        (row, col) = queue.dequeue()

        for each (dr, dc) in [(1,0), (-1,0), (0,1), (0,-1)]:
            newRow = row + dr
            newCol = col + dc
            if inBounds(newRow, newCol) and grid[newRow][newCol] == targetColor:
                grid[newRow][newCol] = newColor
                queue.enqueue((newRow, newCol))
```

The check `if targetColor == newColor: return` prevents infinite recursion when the new color is the same as the original.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(V) | O(V)  |
| Average | O(V) | O(V)  |
| Worst   | O(V) | O(V)  |

Where V is the number of cells in the connected region (or the total grid size in the worst case).

**Why these complexities?**

- **Best Case -- O(V):** Even in the best case, the algorithm must visit every cell in the connected region to fill it. If the seed cell is isolated (surrounded by different colors), V = 1 and the algorithm terminates immediately.

- **Average Case -- O(V):** Each cell in the connected region is visited exactly once. The algorithm processes each cell in O(1) time (checking boundaries and color, then filling), giving O(V) total time where V is the number of cells filled.

- **Worst Case -- O(V):** If the entire grid has the same color, V equals the total number of cells (rows * cols). Every cell is visited exactly once, but V can be as large as the entire grid.

- **Space -- O(V):** The recursive DFS version uses O(V) stack space in the worst case (e.g., a long snake-like region). The BFS version uses O(V) queue space. For very large grids, the BFS approach is preferred to avoid stack overflow.

## When to Use

- **Image editing (paint bucket tool):** Filling a contiguous region of the same color with a new color is the classic application.
- **Region detection:** Identifying connected regions in binary or labeled images for computer vision applications.
- **Game development:** Determining territory in board games (e.g., Go, Minesweeper), revealing connected cells, or filling enclosed areas.
- **Map coloring:** Determining which areas are connected for map rendering and geographic analysis.
- **Solving maze/puzzle problems:** Finding all reachable cells from a starting position in a grid-based maze.

## When NOT to Use

- **Very large grids with deep recursion:** Recursive flood fill can cause stack overflow on large grids. Use the BFS (iterative) version or increase the recursion limit.
- **When edge detection is sufficient:** If you only need to find boundaries rather than fill regions, edge detection algorithms are more appropriate.
- **Weighted grids:** Flood fill does not account for weights or costs. Use Dijkstra's or A* for shortest path on weighted grids.
- **Complex connectivity patterns:** If connectivity is defined by more than simple adjacency (e.g., diagonal connections with different rules), a more general graph traversal may be needed.

## Comparison with Similar Algorithms

| Algorithm       | Time    | Space | Notes                                    |
|-----------------|---------|-------|------------------------------------------|
| Flood Fill (DFS)| O(V)    | O(V)  | Simple; risk of stack overflow on large grids |
| Flood Fill (BFS)| O(V)    | O(V)  | Iterative; no stack overflow risk        |
| Connected Components | O(V+E) | O(V) | Labels all components; more general   |
| Scanline Fill   | O(V)    | O(V)  | Optimized for raster graphics; fills row by row |

## Implementations

| Language | File |
|----------|------|
| C++      | [flood_fill.cpp](cpp/flood_fill.cpp) |
| Java     | [FloodFill.java](java/FloodFill.java) |
| Python   | [floodfill.py](python/floodfill.py) |
| Swift    | [FloodFill.swift](swift/FloodFill.swift) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. (BFS and DFS foundations in Chapter 22).
- Smith, A. R. (1979). "Tint fill". *SIGGRAPH '79: Proceedings of the 6th Annual Conference on Computer Graphics and Interactive Techniques*.
- [Flood Fill -- Wikipedia](https://en.wikipedia.org/wiki/Flood_fill)
