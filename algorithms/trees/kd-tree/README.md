# KD-Tree

## Overview

A KD-Tree (k-dimensional tree) is a binary space-partitioning tree for organizing points in k-dimensional space. At each level, the tree splits along one coordinate axis, cycling through dimensions. Introduced by Jon Bentley in 1975, it enables efficient nearest neighbor search, range search, and other spatial queries in multidimensional spaces, widely used in computer graphics, machine learning, and geographic information systems.

## How It Works

1. **Build:** Select a splitting dimension (cycling through 0, 1, ..., k-1 at each level). Choose the median point along the current splitting dimension. The left subtree contains points with coordinate values less than or equal to the median; the right subtree contains points with values greater. Recurse on each subtree, advancing the splitting dimension.
2. **Nearest Neighbor Search:** Start at the root and traverse down to the leaf region containing the query point. On the way back up, check if the other subtree could contain a closer point by comparing the perpendicular distance to the splitting hyperplane against the current best distance. If it could, recurse into that subtree.
3. **Range Search:** Traverse the tree, pruning any subtree whose bounding region does not intersect the query range.

## Example

Given 6 points in 2D: `(7,2), (5,4), (9,6), (2,3), (4,7), (8,1)`

**Build (splitting on x first, then y, alternating):**

1. Sort by x: `(2,3), (4,7), (5,4), (7,2), (8,1), (9,6)`. Median = `(5,4)` (or `(7,2)` -- pick `(7,2)` as median of 6 points).

Using median = `(7,2)`:
```
                (7,2) split=x
               /           \
        (5,4) split=y    (9,6) split=y
        /       \            /
    (2,3)     (4,7)      (8,1)
```

**Nearest neighbor query for point (6, 5):**

1. Traverse: root (7,2) splits on x. 6 < 7, go left to (5,4).
2. At (5,4), splits on y. 5 > 4, go right to (4,7).
3. At (4,7), leaf. Distance = sqrt((6-4)^2 + (5-7)^2) = sqrt(8) = 2.83. Best so far = (4,7).
4. Backtrack to (5,4). Distance = sqrt((6-5)^2 + (5-4)^2) = sqrt(2) = 1.41. New best = (5,4).
5. Check left child (2,3): perpendicular distance on y-axis = |5-4| = 1 < 1.41, so must check. Distance to (2,3) = sqrt(16+4) = sqrt(20) = 4.47. No improvement.
6. Backtrack to (7,2). Distance = sqrt(1+9) = sqrt(10) = 3.16. No improvement.
7. Check right subtree: perpendicular distance on x-axis = |6-7| = 1 < 1.41, so must check. (9,6): distance = sqrt(9+1) = sqrt(10) = 3.16. (8,1): distance = sqrt(4+16) = sqrt(20) = 4.47.

**Result:** Nearest neighbor is **(5,4)** with distance sqrt(2).

## Pseudocode

```
function BUILD(points, depth):
    if points is empty:
        return NULL
    axis = depth mod k
    sort points by coordinate[axis]
    median_index = len(points) / 2
    node = new Node(points[median_index])
    node.left = BUILD(points[0..median_index-1], depth + 1)
    node.right = BUILD(points[median_index+1..end], depth + 1)
    return node

function NEAREST_NEIGHBOR(node, query, depth, best):
    if node is NULL:
        return best
    dist = DISTANCE(node.point, query)
    if dist < best.distance:
        best = (node.point, dist)

    axis = depth mod k
    diff = query[axis] - node.point[axis]

    // Search the side containing the query point first
    if diff <= 0:
        near = node.left;  far = node.right
    else:
        near = node.right; far = node.left

    best = NEAREST_NEIGHBOR(near, query, depth + 1, best)

    // Check if the other side could have a closer point
    if |diff| < best.distance:
        best = NEAREST_NEIGHBOR(far, query, depth + 1, best)

    return best

function RANGE_SEARCH(node, range, depth, results):
    if node is NULL:
        return
    if node.point is inside range:
        results.add(node.point)
    axis = depth mod k
    if range.lo[axis] <= node.point[axis]:
        RANGE_SEARCH(node.left, range, depth + 1, results)
    if range.hi[axis] >= node.point[axis]:
        RANGE_SEARCH(node.right, range, depth + 1, results)
```

## Complexity Analysis

| Operation | Average | Worst | Space |
|-----------|---------|-------|-------|
| Build | O(n log n) | O(n log n) | O(n) |
| Nearest neighbor | O(log n) | O(n) | O(log n) stack |
| Range search | O(sqrt(n) + k) | O(n) | O(n) |
| Insert | O(log n) | O(n) | O(1) |
| Delete | O(log n) | O(n) | O(log n) |

The worst case for nearest neighbor occurs when the tree is poorly balanced or when many subtrees must be explored (common in high dimensions). Range search has an O(n^(1-1/k) + k) average bound for orthogonal range queries.

## When to Use

- **Nearest neighbor search in low dimensions (k <= 20):** Computer vision, recommendation systems, k-NN classifiers.
- **Range search:** Finding all points within a rectangular region in 2D/3D space.
- **Computer graphics:** Ray tracing, collision detection, photon mapping.
- **Geographic information systems:** Spatial queries on latitude/longitude data.
- **Robotics:** Motion planning, obstacle detection.
- **Point cloud processing:** 3D scanning, LiDAR data analysis.

## When NOT to Use

- **High-dimensional data (k > 20):** KD-Trees degrade to linear scan as dimensionality increases (the "curse of dimensionality"). Use approximate methods like Locality-Sensitive Hashing (LSH), random projection trees, or HNSW graphs instead.
- **Highly dynamic datasets:** Frequent insertions and deletions can unbalance the tree. Consider rebuilding periodically or using a balanced variant like a scapegoat KD-Tree.
- **Uniform density in high dimensions:** When points fill the space uniformly in many dimensions, nearly every subtree must be searched. Use ball trees or VP-trees, which adapt better to intrinsic dimensionality.
- **Exact range counting only:** If you only need counts (not the actual points), a range tree or fractional cascading structure may be more efficient.

## Comparison

| Feature | KD-Tree | Ball Tree | R-Tree | LSH |
|---------|---------|-----------|--------|-----|
| Best dimensions | Low (2-20) | Low-Medium | Low (2-3) | High (100+) |
| Nearest neighbor | O(log n) avg | O(log n) avg | O(log n) avg | O(1) approx |
| Exact results | Yes | Yes | Yes | Approximate |
| Dynamic insert/delete | Degrades | Moderate | Good | Good |
| Range search | Good | Moderate | Good | Poor |
| Build time | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Implementation | Simple | Moderate | Complex | Moderate |

## References

- Bentley, J. L. (1975). "Multidimensional binary search trees used for associative searching." *Communications of the ACM*, 18(9), 509-517.
- Friedman, J. H.; Bentley, J. L.; Finkel, R. A. (1977). "An algorithm for finding best matches in logarithmic expected time." *ACM Transactions on Mathematical Software*, 3(3), 209-226.
- de Berg, M.; Cheong, O.; van Kreveld, M.; Overmars, M. (2008). *Computational Geometry: Algorithms and Applications*, 3rd ed. Springer. Chapter 5.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press.

## Implementations

| Language   | File |
|------------|------|
| Python     | [kd_tree.py](python/kd_tree.py) |
| Java       | [KdTree.java](java/KdTree.java) |
| C++        | [kd_tree.cpp](cpp/kd_tree.cpp) |
| C          | [kd_tree.c](c/kd_tree.c) |
| Go         | [kd_tree.go](go/kd_tree.go) |
| TypeScript | [kdTree.ts](typescript/kdTree.ts) |
| Rust       | [kd_tree.rs](rust/kd_tree.rs) |
| Kotlin     | [KdTree.kt](kotlin/KdTree.kt) |
| Swift      | [KdTree.swift](swift/KdTree.swift) |
| Scala      | [KdTree.scala](scala/KdTree.scala) |
| C#         | [KdTree.cs](csharp/KdTree.cs) |
