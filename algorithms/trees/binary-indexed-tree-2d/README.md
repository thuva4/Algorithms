# 2D Binary Indexed Tree (Fenwick Tree)

## Overview

A 2D Binary Indexed Tree (also called a 2D Fenwick Tree) extends the classic 1D Fenwick tree to two dimensions, supporting efficient point updates and prefix sum queries on a 2D grid. Each update and query takes O(log(R) * log(C)) time where R and C are the number of rows and columns. It is a simple and practical data structure for problems involving cumulative frequency tables or 2D prefix sums with dynamic updates.

## How It Works

1. **Structure:** The 2D BIT is conceptually a BIT of BITs. The outer BIT indexes rows, and for each row-index, an inner BIT indexes columns. In practice, it is stored as a 2D array `tree[R+1][C+1]`.
2. **Update (r, c, val):** Add `val` to position (r, c). Starting from row index `r`, iterate upward through all BIT row indices (using `r += r & (-r)`). For each such row index, iterate through all BIT column indices from `c` upward (using `c += c & (-c)`), adding `val` to each.
3. **Prefix Query (r, c):** Compute the prefix sum from (1,1) to (r,c). Starting from row index `r`, iterate downward through BIT row indices (using `r -= r & (-r)`). For each, iterate through BIT column indices from `c` downward, accumulating the sum.
4. **Rectangle Query:** The sum over a rectangle (r1, c1) to (r2, c2) is computed using inclusion-exclusion: `query(r2,c2) - query(r1-1,c2) - query(r2,c1-1) + query(r1-1,c1-1)`.

## Example

Consider a 4x4 grid, initially all zeros:

```
Grid:    0 0 0 0
         0 0 0 0
         0 0 0 0
         0 0 0 0
```

**Update(2, 3, 5):** Add 5 at position (2, 3).
**Update(1, 1, 3):** Add 3 at position (1, 1).
**Update(3, 2, 7):** Add 7 at position (3, 2).

```
Grid:    3 0 0 0
         0 0 5 0
         0 7 0 0
         0 0 0 0
```

**Query prefix sum (3, 3):** Sum of all elements from (1,1) to (3,3) = 3 + 5 + 7 = 15.
**Query rectangle (2,2) to (3,3):** = query(3,3) - query(1,3) - query(3,1) + query(1,1) = 15 - 3 - 3 + 3 = 12 (the 5 and 7).

## Pseudocode

```
function UPDATE(tree, r, c, val, R, C):
    i = r
    while i <= R:
        j = c
        while j <= C:
            tree[i][j] += val
            j += j & (-j)       // move to next BIT column index
        i += i & (-i)           // move to next BIT row index

function QUERY(tree, r, c):
    sum = 0
    i = r
    while i > 0:
        j = c
        while j > 0:
            sum += tree[i][j]
            j -= j & (-j)       // move to parent BIT column index
        i -= i & (-i)           // move to parent BIT row index
    return sum

function RANGE_QUERY(tree, r1, c1, r2, c2):
    return QUERY(tree, r2, c2)
         - QUERY(tree, r1-1, c2)
         - QUERY(tree, r2, c1-1)
         + QUERY(tree, r1-1, c1-1)
```

## Complexity Analysis

| Operation | Time               | Space    |
|-----------|--------------------|----------|
| Build (empty) | O(R * C)       | O(R * C) |
| Point Update | O(log R * log C) | O(1)     |
| Prefix Query | O(log R * log C) | O(1)     |
| Rectangle Query | O(log R * log C) | O(1)  |
| Build from data | O(R * C * log R * log C) | O(R * C) |

## When to Use

- **2D cumulative frequency tables:** Counting points in a rectangle on a grid with dynamic updates.
- **Image processing:** Maintaining running sums over 2D subregions (e.g., integral images with updates).
- **Competitive programming:** Problems involving 2D prefix sums with point updates.
- **Matrix manipulation:** Dynamic 2D range sum queries where updates are single-cell increments.

## When NOT to Use

- **Static 2D prefix sums:** If there are no updates after building, a simple 2D prefix sum array answers rectangle queries in O(1) time with O(R * C) preprocessing. No need for a BIT.
- **Range updates (not point updates):** A 2D BIT supports only point updates efficiently. For range updates combined with range queries, use a 2D segment tree with lazy propagation or a difference-array technique.
- **Sparse grids:** If the grid is very large but sparsely populated (e.g., 10^9 x 10^9 with 10^5 points), the O(R * C) space is prohibitive. Use coordinate compression or a different structure like a 2D merge sort tree.
- **High-dimensional data (3D+):** While Fenwick trees generalize to k dimensions, the constant factors grow as O(log^k n), and space is O(n^k). Consider other structures for k >= 3.

## Comparison

| Feature | 2D BIT | 2D Prefix Sum Array | 2D Segment Tree |
|---------|--------|---------------------|-----------------|
| Build time | O(R*C*logR*logC) | O(R*C) | O(R*C) |
| Point update | O(logR * logC) | O(R*C) rebuild | O(logR * logC) |
| Rectangle query | O(logR * logC) | O(1) | O(logR * logC) |
| Range update | Not supported | Not supported | O(logR * logC) with lazy |
| Space | O(R*C) | O(R*C) | O(R*C) with higher constant |
| Implementation | Simple | Trivial | Complex |

## References

- Fenwick, P. M. (1994). "A new data structure for cumulative frequency tables." *Software: Practice and Experience*, 24(3), 327-336.
- Mishra, S. (2013). "2D Binary Indexed Trees." *TopCoder tutorials*.
- Halim, S.; Halim, F. (2013). *Competitive Programming 3*. Section on Fenwick Trees.

## Implementations

| Language   | File |
|------------|------|
| Python     | [binary_indexed_tree_2d.py](python/binary_indexed_tree_2d.py) |
| Java       | [BinaryIndexedTree2D.java](java/BinaryIndexedTree2D.java) |
| C++        | [binary_indexed_tree_2d.cpp](cpp/binary_indexed_tree_2d.cpp) |
| C          | [binary_indexed_tree_2d.c](c/binary_indexed_tree_2d.c) |
| Go         | [binary_indexed_tree_2d.go](go/binary_indexed_tree_2d.go) |
| TypeScript | [binaryIndexedTree2D.ts](typescript/binaryIndexedTree2D.ts) |
| Rust       | [binary_indexed_tree_2d.rs](rust/binary_indexed_tree_2d.rs) |
| Kotlin     | [BinaryIndexedTree2D.kt](kotlin/BinaryIndexedTree2D.kt) |
| Swift      | [BinaryIndexedTree2D.swift](swift/BinaryIndexedTree2D.swift) |
| Scala      | [BinaryIndexedTree2D.scala](scala/BinaryIndexedTree2D.scala) |
| C#         | [BinaryIndexedTree2D.cs](csharp/BinaryIndexedTree2D.cs) |
