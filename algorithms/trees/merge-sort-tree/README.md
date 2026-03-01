# Merge Sort Tree

## Overview

A Merge Sort Tree is a segment tree where each node stores the sorted list of all elements in its range. This allows answering order-statistic queries like "count of elements <= k in range [l, r]" in O(log^2 n) time using binary search at each visited segment tree node. The tree uses O(n log n) space and is built in O(n log n) time. It is a simple yet powerful offline structure for range-based order statistic problems.

## How It Works

1. **Build:** Each leaf stores a single element as a one-element sorted list. Each internal node stores the sorted merge of its two children's lists. This is identical to the merge step of merge sort, hence the name.
2. **Query (count of elements <= k in [l, r]):** Decompose [l, r] into O(log n) canonical segment tree nodes. At each node whose range is fully contained in [l, r], perform a binary search (upper_bound) for k in its sorted list to count elements <= k. Sum up these counts.
3. **k-th smallest in range [l, r]:** Binary search on the answer. For a candidate value `mid`, count elements <= mid in [l, r]. Use this to narrow down the k-th smallest.

## Example

Array: `A = [3, 1, 4, 1, 5, 9, 2, 6]` (indices 0-7)

**Build the merge sort tree:**

```
Level 0 (leaves):   [3] [1] [4] [1] [5] [9] [2] [6]
Level 1:            [1,3]  [1,4]  [5,9]  [2,6]
Level 2:            [1,1,3,4]     [2,5,6,9]
Level 3 (root):     [1,1,2,3,4,5,6,9]
```

**Query: count of elements <= 4 in range [1, 6] (indices 1 through 6).**

Segment tree decomposes [1, 6] into canonical nodes:
- Node covering [1, 1]: sorted list = [1]. upper_bound(4) = 1. Count = 1.
- Node covering [2, 3]: sorted list = [1, 4]. upper_bound(4) = 2. Count = 2.
- Node covering [4, 5]: sorted list = [5, 9]. upper_bound(4) = 0. Count = 0.
- Node covering [6, 6]: sorted list = [2]. upper_bound(4) = 1. Count = 1.

**Total count = 1 + 2 + 0 + 1 = 4.** Elements in A[1..6] = {1, 4, 1, 5, 9, 2}; those <= 4 are {1, 4, 1, 2} = 4 elements. Correct.

## Pseudocode

```
function BUILD(tree, arr, node, lo, hi):
    if lo == hi:
        tree[node] = [arr[lo]]
        return
    mid = (lo + hi) / 2
    BUILD(tree, arr, 2*node, lo, mid)
    BUILD(tree, arr, 2*node+1, mid+1, hi)
    tree[node] = MERGE(tree[2*node], tree[2*node+1])

function COUNT_LEQ(tree, node, lo, hi, ql, qr, k):
    if qr < lo or hi < ql:
        return 0
    if ql <= lo and hi <= qr:
        return UPPER_BOUND(tree[node], k)  // binary search
    mid = (lo + hi) / 2
    return COUNT_LEQ(tree, 2*node, lo, mid, ql, qr, k)
         + COUNT_LEQ(tree, 2*node+1, mid+1, hi, ql, qr, k)

function KTH_SMALLEST(tree, n, ql, qr, k):
    lo = MIN_VALUE, hi = MAX_VALUE
    while lo < hi:
        mid = (lo + hi) / 2
        count = COUNT_LEQ(tree, 1, 0, n-1, ql, qr, mid)
        if count >= k:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Build | O(n log n) | O(n log n) |
| Count <= k in [l, r] | O(log^2 n) | O(1) |
| k-th smallest in [l, r] | O(log^3 n) | O(1) |
| Count in value range [a, b] in [l, r] | O(log^2 n) | O(1) |

Each element appears in exactly O(log n) segment tree nodes (one at each level), so total space and build time are O(n log n). Each query visits O(log n) nodes and performs O(log n) binary search at each.

## When to Use

- **Static range order statistics:** Count elements in a value range within an index range, find k-th smallest in a range.
- **Offline competitive programming:** When you need range-based counting queries without updates.
- **When simplicity matters:** Merge sort trees are conceptually simple compared to persistent segment trees or wavelet trees.
- **Range frequency queries:** Count occurrences of values in a specific range within a subarray.

## When NOT to Use

- **Dynamic arrays with updates:** Merge sort trees do not support efficient point updates (rebuilding a node's sorted list takes O(n) time). Use a persistent segment tree, wavelet tree, or BIT with coordinate compression.
- **When O(log n) per query is needed:** A persistent segment tree or wavelet tree answers k-th smallest queries in O(log n) instead of O(log^3 n).
- **Memory-constrained environments:** O(n log n) space can be significant for large n. A wavelet tree uses O(n log sigma) where sigma is the alphabet size.
- **Single-point queries:** For simple range sum/min/max, a regular segment tree is faster and uses less space.

## Comparison

| Feature | Merge Sort Tree | Persistent Segment Tree | Wavelet Tree | BIT + Coord. Compression |
|---------|----------------|------------------------|-------------|------------------------|
| Count <= k in [l, r] | O(log^2 n) | O(log n) | O(log n) | O(log^2 n) |
| k-th smallest | O(log^3 n) | O(log n) | O(log n) | O(log^3 n) |
| Point updates | Not efficient | O(log n) per version | Not efficient | O(log^2 n) |
| Space | O(n log n) | O(n log n) | O(n log sigma) | O(n log n) |
| Build time | O(n log n) | O(n log n) | O(n log n) | O(n log n) |
| Implementation | Simple | Moderate | Complex | Simple |

## References

- Bentley, J. L. (1980). "Multidimensional divide-and-conquer." *Communications of the ACM*, 23(4), 214-229.
- Halim, S.; Halim, F. (2013). *Competitive Programming 3*. Section on Merge Sort Trees.
- "Merge Sort Tree." *CP-Algorithms*. https://cp-algorithms.com/
- Vitter, J. S. (2001). "External memory algorithms and data structures." *ACM Computing Surveys*, 33(2), 209-271.

## Implementations

| Language   | File |
|------------|------|
| Python     | [merge_sort_tree.py](python/merge_sort_tree.py) |
| Java       | [MergeSortTree.java](java/MergeSortTree.java) |
| C++        | [merge_sort_tree.cpp](cpp/merge_sort_tree.cpp) |
| C          | [merge_sort_tree.c](c/merge_sort_tree.c) |
| Go         | [merge_sort_tree.go](go/merge_sort_tree.go) |
| TypeScript | [mergeSortTree.ts](typescript/mergeSortTree.ts) |
| Rust       | [merge_sort_tree.rs](rust/merge_sort_tree.rs) |
| Kotlin     | [MergeSortTree.kt](kotlin/MergeSortTree.kt) |
| Swift      | [MergeSortTree.swift](swift/MergeSortTree.swift) |
| Scala      | [MergeSortTree.scala](scala/MergeSortTree.scala) |
| C#         | [MergeSortTree.cs](csharp/MergeSortTree.cs) |
