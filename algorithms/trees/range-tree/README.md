# Range Tree

## Overview

A Range Tree is a multi-level balanced binary search tree for answering orthogonal range queries efficiently. In its 1D form, it answers range counting queries (how many points lie in [lo, hi]) in O(log n) time. In higher dimensions, a d-dimensional range tree answers d-dimensional orthogonal range queries in O(log^d n + k) time, where k is the number of reported points. The key idea is that each node of the primary tree stores a secondary (associated) structure for the next dimension, creating a layered tree-of-trees.

## How It Works

### 1D Range Tree
1. **Build:** Sort the points and store them in a balanced BST. Each node stores a point value, and the subtree rooted at each node represents a contiguous range of sorted values.
2. **Range Query [lo, hi]:** Search for `lo` and `hi` in the BST. The paths from the root to these two leaves split at some node. All subtrees hanging between these two paths are "canonical subsets" that lie entirely within [lo, hi]. Count or report them.

### 2D Range Tree
1. **Build:** Build a balanced BST on the x-coordinates (primary tree). Each internal node stores a secondary 1D range tree (or sorted array) containing all points in its subtree, sorted by y-coordinate.
2. **Query [x1, x2] x [y1, y2]:** Find the O(log n) canonical nodes in the primary tree whose x-ranges are contained in [x1, x2]. For each such node, query its secondary structure for y in [y1, y2].

### Fractional Cascading (optimization)
The O(log^2 n) query time for 2D can be reduced to O(log n + k) using fractional cascading, which avoids repeated binary searches in the secondary structures.

## Example

**1D Example:** Points = {2, 5, 8, 12, 15, 19, 23}

Build a balanced BST:
```
            12
          /     \
        5        19
       / \      /  \
      2   8   15   23
```

**Query: count points in [6, 20].**

1. Search for 6: go right from 5 (6 > 5), reach 8. Left boundary path: root -> 5 -> 8.
2. Search for 20: go right from 19 (20 > 19), reach 23. Right boundary path: root -> 19 -> 23.
3. Split node: root (12).
4. Canonical subsets: node 8 (in range), subtree rooted at 12 itself (12 is in range), node 19 (in range), node 15 (in range).
5. Points in [6, 20]: {8, 12, 15, 19}. **Count = 4.**

**2D Example:** Points = {(2,7), (5,3), (8,9), (12,1), (15,6)}

Query: find all points in [3, 13] x [2, 8].

1. Primary tree splits on x. Canonical nodes with x in [3, 13]: subtrees covering {5, 8, 12}.
2. For each canonical node, query secondary structure for y in [2, 8]:
   - Point (5, 3): y=3 in [2, 8]? Yes.
   - Point (8, 9): y=9 in [2, 8]? No.
   - Point (12, 1): y=1 in [2, 8]? No.
3. **Result: {(5, 3)}.** Count = 1.

## Pseudocode

```
// 1D Range Tree
function BUILD_1D(points):
    sort points
    return BUILD_BST(points, 0, len(points) - 1)

function BUILD_BST(points, lo, hi):
    if lo > hi: return NULL
    mid = (lo + hi) / 2
    node = new Node(points[mid])
    node.size = hi - lo + 1
    node.left = BUILD_BST(points, lo, mid - 1)
    node.right = BUILD_BST(points, mid + 1, hi)
    return node

function COUNT_IN_RANGE(node, lo, hi):
    if node is NULL: return 0
    if lo <= node.value <= hi:
        count = 1
        count += COUNT_IN_RANGE(node.left, lo, hi)
        count += COUNT_IN_RANGE(node.right, lo, hi)
        return count
    if node.value < lo:
        return COUNT_IN_RANGE(node.right, lo, hi)
    if node.value > hi:
        return COUNT_IN_RANGE(node.left, lo, hi)

// Optimized: decompose into O(log n) canonical subsets
function RANGE_COUNT(root, lo, hi):
    split = FIND_SPLIT(root, lo, hi)
    count = 0
    // Count from split to lo boundary
    node = split.left
    while node != NULL:
        if lo <= node.value:
            count += SIZE(node.right) + 1
            node = node.left
        else:
            node = node.right
    // Count from split to hi boundary (symmetric)
    // ... similar traversal on right side
    return count
```

## Complexity Analysis

| Operation | 1D | 2D | 2D with Fractional Cascading |
|-----------|----|----|------------------------------|
| Build | O(n log n) | O(n log n) | O(n log n) |
| Range count | O(log n) | O(log^2 n) | O(log n) |
| Range report | O(log n + k) | O(log^2 n + k) | O(log n + k) |
| Space | O(n) | O(n log n) | O(n log n) |

For d dimensions: build O(n log^(d-1) n), query O(log^d n + k), space O(n log^(d-1) n). With fractional cascading, query improves to O(log^(d-1) n + k).

## When to Use

- **Multi-dimensional orthogonal range queries:** Finding or counting all points within a d-dimensional box [lo1, hi1] x [lo2, hi2] x ...
- **Computational geometry:** Windowing queries, geographic data retrieval.
- **Database indexing:** Multi-attribute range queries (e.g., "find all employees with salary between X and Y and age between A and B").
- **When query time must be polylogarithmic:** Range trees guarantee O(log^d n) time regardless of data distribution.
- **Static point sets:** When the point set does not change after construction.

## When NOT to Use

- **1D range queries with updates:** A segment tree or Fenwick tree is simpler and supports updates in O(log n).
- **Single-dimension range queries:** A simple sorted array with binary search answers 1D range counting in O(log n) with O(n) space -- no need for the complexity of a range tree.
- **High dimensions (d > 4):** The O(n log^(d-1) n) space and O(log^d n) query time become impractical. Consider KD-Trees (which degrade gracefully) or approximate methods.
- **Dynamic point sets:** Range trees do not efficiently support insertions and deletions. Use a dynamic structure like a balanced BST with augmentation or a KD-Tree with periodic rebuilding.

## Comparison

| Feature | Range Tree (2D) | KD-Tree | 2D Segment Tree | R-Tree |
|---------|----------------|---------|-----------------|--------|
| Range count | O(log^2 n) | O(sqrt(n)) avg | O(log^2 n) | O(log n + k) |
| Range report | O(log^2 n + k) | O(sqrt(n) + k) | O(log^2 n + k) | O(log n + k) |
| Space | O(n log n) | O(n) | O(n^2) naive | O(n) |
| Build | O(n log n) | O(n log n) | O(n^2) | O(n log n) |
| Dynamic | No | Degrades | No | Yes |
| Dimensions | Any d | Any d | 2D | Any d |
| Guaranteed bounds | Yes | Average case | Yes | Amortized |

## References

- Bentley, J. L. (1980). "Multidimensional divide-and-conquer." *Communications of the ACM*, 23(4), 214-229.
- Lueker, G. S. (1978). "A data structure for orthogonal range queries." *FOCS*, pp. 28-34.
- Chazelle, B. (1986). "Filtering search: A new approach to query-answering." *SIAM Journal on Computing*, 15(3), 703-724.
- de Berg, M.; Cheong, O.; van Kreveld, M.; Overmars, M. (2008). *Computational Geometry: Algorithms and Applications*, 3rd ed. Springer. Chapter 5: Orthogonal Range Searching.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press.

## Implementations

| Language   | File |
|------------|------|
| Python     | [range_tree.py](python/range_tree.py) |
| Java       | [RangeTree.java](java/RangeTree.java) |
| C++        | [range_tree.cpp](cpp/range_tree.cpp) |
| C          | [range_tree.c](c/range_tree.c) |
| Go         | [range_tree.go](go/range_tree.go) |
| TypeScript | [rangeTree.ts](typescript/rangeTree.ts) |
| Rust       | [range_tree.rs](rust/range_tree.rs) |
| Kotlin     | [RangeTree.kt](kotlin/RangeTree.kt) |
| Swift      | [RangeTree.swift](swift/RangeTree.swift) |
| Scala      | [RangeTree.scala](scala/RangeTree.scala) |
| C#         | [RangeTree.cs](csharp/RangeTree.cs) |
