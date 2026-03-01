# Segment Tree

## Overview

A Segment Tree is a binary tree data structure used for storing information about intervals or segments of an array. It allows efficient querying of aggregate information (such as sum, minimum, maximum, or GCD) over any contiguous range of elements, as well as efficient point or range updates. Both operations run in O(log n) time.

Segment Trees are one of the most versatile data structures in competitive programming and are used in computational geometry, database systems, and any application requiring dynamic range queries. They can be extended with lazy propagation to support range updates in O(log n) time.

## How It Works

The segment tree is built recursively. Each leaf node stores a single array element, and each internal node stores the aggregate (e.g., sum) of its children's ranges. To query a range [l, r], we traverse the tree and combine results from nodes whose ranges are completely contained within [l, r]. To update an element, we modify the corresponding leaf and propagate changes up to the root.

### Example

Given array: `A = [1, 3, 5, 7, 9, 11]`

**Segment tree structure (sum):**

```
                    [0-5] = 36
                   /        \
            [0-2] = 9      [3-5] = 27
            /     \         /      \
       [0-1] = 4  [2] = 5  [3-4] = 16  [5] = 11
       /    \              /      \
    [0]=1  [1]=3       [3]=7    [4]=9
```

**Query: sum of range [1, 4]:**

| Step | Node | Range | Action | Result |
|------|------|-------|--------|--------|
| 1 | Root | [0-5] | Partial overlap, go to children | - |
| 2 | Left child | [0-2] | Partial overlap, go to children | - |
| 3 | [0-1] | [0-1] | Partial overlap, go to children | - |
| 4 | [0] | [0] | Outside range, return 0 | 0 |
| 5 | [1] | [1] | Complete overlap, return 3 | 3 |
| 6 | [2] | [2] | Complete overlap, return 5 | 5 |
| 7 | Right child | [3-5] | Partial overlap, go to children | - |
| 8 | [3-4] | [3-4] | Complete overlap, return 16 | 16 |
| 9 | [5] | [5] | Outside range, return 0 | 0 |

Result: sum(1..4) = 3 + 5 + 16 = `24`

**Update: set A[2] = 10 (change by +5):**

| Step | Node | Action |
|------|------|--------|
| 1 | [2] (leaf) | Update: 5 -> 10 |
| 2 | [0-2] | Update: 9 -> 14 |
| 3 | [0-5] (root) | Update: 36 -> 41 |

## Pseudocode

```
function build(arr, tree, node, start, end):
    if start == end:
        tree[node] = arr[start]
    else:
        mid = (start + end) / 2
        build(arr, tree, 2*node, start, mid)
        build(arr, tree, 2*node+1, mid+1, end)
        tree[node] = tree[2*node] + tree[2*node+1]

function query(tree, node, start, end, l, r):
    if r < start or end < l:       // completely outside
        return 0
    if l <= start and end <= r:    // completely inside
        return tree[node]
    mid = (start + end) / 2
    left_sum = query(tree, 2*node, start, mid, l, r)
    right_sum = query(tree, 2*node+1, mid+1, end, l, r)
    return left_sum + right_sum

function update(tree, node, start, end, idx, val):
    if start == end:
        tree[node] = val
    else:
        mid = (start + end) / 2
        if idx <= mid:
            update(tree, 2*node, start, mid, idx, val)
        else:
            update(tree, 2*node+1, mid+1, end, idx, val)
        tree[node] = tree[2*node] + tree[2*node+1]
```

The tree is stored as an array of size 4n (to accommodate all levels). Node `i` has children at `2i` and `2i+1`.

## Complexity Analysis

| Case    | Time     | Space |
|---------|---------|-------|
| Best    | O(log n) | O(n)  |
| Average | O(log n) | O(n)  |
| Worst   | O(log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(log n):** A query or update traverses at most O(log n) levels of the tree. In the best case (querying a single node's exact range), it may return immediately, but the tree height bounds all operations.

- **Average Case -- O(log n):** Each query decomposes the range into at most 2 * log n nodes. Each update follows a single root-to-leaf path of length log n.

- **Worst Case -- O(log n):** The tree has height ceil(log n), and both query and update visit at most O(log n) nodes.

- **Space -- O(n):** The segment tree uses an array of size 4n to store all nodes. While this is 4x the input size, it is still O(n).

## When to Use

- **Dynamic range queries:** When you need to compute aggregate values (sum, min, max) over arbitrary ranges and the array changes frequently.
- **Range updates with lazy propagation:** Segment trees support updating entire ranges efficiently when combined with lazy propagation.
- **Competitive programming:** Segment trees are essential for problems involving range queries with modifications.
- **When you need support for various operations:** Unlike Fenwick Trees, segment trees can handle any associative operation (min, max, GCD, etc.).

## When NOT to Use

- **Static arrays:** If the array never changes, a sparse table (O(1) query) or prefix sum array is simpler and faster.
- **When only prefix sums are needed:** A Fenwick Tree is simpler to implement and uses less memory.
- **When memory is very tight:** Segment trees use 4n memory, which may be an issue for very large arrays.
- **Simple point queries:** If you only need to access individual elements, an array suffices.

## Comparison with Similar Algorithms

| Data Structure       | Query Time | Update Time | Space | Notes                                    |
|---------------------|-----------|-------------|-------|------------------------------------------|
| Segment Tree         | O(log n)  | O(log n)    | O(4n) | Most versatile; supports any assoc. op    |
| Fenwick Tree         | O(log n)  | O(log n)    | O(n)  | Simpler; limited to invertible operations |
| Sparse Table         | O(1)      | N/A         | O(n log n) | Static only; no updates               |
| Sqrt Decomposition   | O(sqrt n) | O(1)        | O(n)  | Simple but slower queries                 |

## Implementations

| Language | File |
|----------|------|
| C++      | [SegTreeSum.cpp](cpp/SegTreeSum.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 14: Augmenting Data Structures.
- Bentley, J. L. (1977). Solutions to Klee's rectangle problems. Unpublished manuscript.
- [Segment Tree -- Wikipedia](https://en.wikipedia.org/wiki/Segment_tree)
