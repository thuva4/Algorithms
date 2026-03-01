# Connected Component Labeling

## Overview

Connected Component Labeling (CCL) is a graph algorithm that identifies and labels distinct connected components in a graph or grid. In image processing, it assigns a unique label to each group of connected pixels that share the same value, effectively segmenting the image into discrete regions. In general graph theory, it partitions vertices into groups where every vertex in a group can reach every other vertex in the same group via edges.

CCL is fundamental in image analysis, computer vision, and pattern recognition. It can be implemented using DFS/BFS traversal, Union-Find (disjoint set), or the classical two-pass algorithm for 2D grids. The algorithm runs in O(V+E) time, making it efficient for processing even large images and graphs.

## How It Works

The algorithm iterates through all vertices (or pixels). When an unlabeled vertex is found, it starts a BFS or DFS from that vertex, labeling all reachable vertices with the same component ID. The component counter is then incremented, and the scan continues. For grid-based images, the two-pass algorithm is commonly used: the first pass assigns provisional labels using Union-Find for equivalences, and the second pass replaces provisional labels with their final values.

### Example

Consider the following 5x5 binary grid (1 = foreground, 0 = background), with 4-connectivity:

```
Input Grid:              Labeled Output:
1 1 0 0 1               1 1 0 0 2
1 0 0 1 1               1 0 0 2 2
0 0 1 1 0               0 0 3 3 0
0 1 0 0 0               0 4 0 0 0
1 1 0 1 1               4 4 0 5 5
```

**Step-by-step labeling:**

| Step | Scan Position | Value | Action | Labels Assigned |
|------|--------------|-------|--------|-----------------|
| 1 | (0,0) | 1 | Unlabeled, start BFS. Label=1 | (0,0)=1, (0,1)=1, (1,0)=1 |
| 2 | (0,4) | 1 | Unlabeled, start BFS. Label=2 | (0,4)=2, (1,3)=2, (1,4)=2 |
| 3 | (2,2) | 1 | Unlabeled, start BFS. Label=3 | (2,2)=3, (2,3)=3 |
| 4 | (3,1) | 1 | Unlabeled, start BFS. Label=4 | (3,1)=4, (4,0)=4, (4,1)=4 |
| 5 | (4,3) | 1 | Unlabeled, start BFS. Label=5 | (4,3)=5, (4,4)=5 |

Result: 5 connected components identified and labeled.

## Pseudocode

```
function connectedComponentLabeling(grid, rows, cols):
    labels = grid-sized matrix, initialized to 0
    currentLabel = 0

    for row from 0 to rows - 1:
        for col from 0 to cols - 1:
            if grid[row][col] == 1 and labels[row][col] == 0:
                currentLabel += 1
                bfs(grid, labels, row, col, currentLabel, rows, cols)

    return labels, currentLabel

function bfs(grid, labels, startRow, startCol, label, rows, cols):
    queue = empty queue
    queue.enqueue((startRow, startCol))
    labels[startRow][startCol] = label

    while queue is not empty:
        (row, col) = queue.dequeue()

        for each (dr, dc) in [(1,0), (-1,0), (0,1), (0,-1)]:
            newRow = row + dr
            newCol = col + dc
            if inBounds(newRow, newCol, rows, cols)
               and grid[newRow][newCol] == 1
               and labels[newRow][newCol] == 0:
                labels[newRow][newCol] = label
                queue.enqueue((newRow, newCol))
```

The two-pass algorithm with Union-Find is more efficient for very large images because it avoids the overhead of BFS/DFS function calls, but the BFS-based approach is simpler and equally correct.

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

Where V is the number of vertices (or pixels) and E is the number of edges (or adjacency connections).

**Why these complexities?**

- **Best Case -- O(V+E):** Every vertex must be examined at least once to determine whether it belongs to a component. Every edge must be checked to establish connectivity. Even if all vertices are background (no components), scanning all V vertices takes O(V).

- **Average Case -- O(V+E):** Each vertex is visited exactly once during the scan and at most once during BFS/DFS. Each edge is examined at most twice (once from each endpoint in an undirected graph). The total work is O(V+E).

- **Worst Case -- O(V+E):** When all vertices are foreground and form a single large component, the BFS/DFS visits all V vertices and examines all E edges. For a 2D grid, E = O(V), so the complexity simplifies to O(V).

- **Space -- O(V):** The label matrix requires O(V) space. The BFS queue or DFS stack can hold at most O(V) entries in the worst case (single large component).

## When to Use

- **Image segmentation:** Identifying distinct objects or regions in binary or grayscale images is the primary application of CCL.
- **Blob detection:** Counting and measuring connected groups of pixels (blobs) in computer vision.
- **Graph analysis:** Finding connected components in social networks, communication networks, or any undirected graph.
- **Medical imaging:** Identifying tumors, cells, or anatomical structures in medical scans.
- **Document analysis:** Separating characters, words, or paragraphs in scanned documents.

## When NOT to Use

- **Directed graphs:** CCL finds connected components in undirected graphs. For directed graphs, use Tarjan's or Kosaraju's algorithm to find strongly connected components.
- **When only component count is needed:** If you just need to know how many components exist (not their labels), a simpler Union-Find approach may suffice.
- **Weighted connectivity:** If connectivity depends on edge weights or thresholds, standard CCL needs modification.
- **Very large 3D volumes:** For 3D volumetric data, memory-efficient streaming algorithms may be needed instead of storing the entire label volume.

## Comparison with Similar Algorithms

| Algorithm       | Time    | Space | Notes                                    |
|-----------------|---------|-------|------------------------------------------|
| CCL (BFS/DFS)   | O(V+E) | O(V)  | Simple; labels all components            |
| CCL (Two-Pass)  | O(V)   | O(V)  | Uses Union-Find; efficient for grids     |
| Flood Fill      | O(V)   | O(V)  | Fills one region; must call per component |
| Union-Find      | O(V * alpha(V)) | O(V) | Near-linear; good for dynamic graphs   |
| Tarjan's SCC    | O(V+E) | O(V)  | For directed graphs (strongly connected) |

## Implementations

| Language | File |
|----------|------|
| C        | [ConnectedComponentLabeling.cpp](c/ConnectedComponentLabeling.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22: Elementary Graph Algorithms.
- Shapiro, L. G., & Stockman, G. C. (2001). *Computer Vision*. Prentice Hall. Chapter 3: Binary Image Analysis.
- [Connected-component Labeling -- Wikipedia](https://en.wikipedia.org/wiki/Connected-component_labeling)
