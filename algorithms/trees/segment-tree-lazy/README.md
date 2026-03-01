# Segment Tree with Lazy Propagation

## Overview

A Segment Tree with Lazy Propagation supports both range updates and range queries in O(log n) time per operation. When updating a range, instead of modifying every individual element, pending updates ("lazy" values) are stored at internal nodes and propagated to children only when those children are actually accessed. This implementation supports range addition and range sum queries, but the technique generalizes to any operation that is associative and distributes over the query operation (e.g., range set + range min, range add + range max).

## How It Works

1. **Build:** Construct a segment tree from the input array. Each node stores the aggregate value (e.g., sum) of its range, plus a lazy field initialized to zero.
2. **Range Update (add v to [l, r]):** Traverse the segment tree. For any node whose range is fully contained in [l, r], add `v * length` to its sum and add `v` to its lazy tag. Do not recurse further into its children. For partially overlapping nodes, push down any existing lazy value first, then recurse into children.
3. **Range Query (sum of [l, r]):** Before visiting children, push down any pending lazy values. Combine results from left and right children.
4. **Push Down:** When a node with a non-zero lazy tag needs its children examined, propagate the lazy value: add `lazy * child_length` to each child's sum, add `lazy` to each child's lazy tag, and reset the parent's lazy tag to zero.

## Example

Array: `A = [1, 3, 5, 7, 9, 11]` (indices 0-5, sum = 36)

**Initial segment tree (sums):**

```
              [36]             [0,5]
            /      \
         [9]       [27]        [0,2] [3,5]
        /   \     /    \
      [4]  [5]  [16]  [11]    [0,1] [2,2] [3,4] [5,5]
      / \       / \
    [1] [3]   [7] [9]
```

**Range Update: add 2 to [1, 4]**

1. Node [0,5]: partially overlaps. Push down (lazy=0, nothing to do). Recurse.
2. Node [0,2]: partially overlaps [1,4]. Push down. Recurse.
   - Node [0,1]: partially overlaps. Push down. Recurse.
     - Node [0,0]: outside range. Skip.
     - Node [1,1]: fully inside. sum = 3+2 = 5. lazy = 2.
   - Node [2,2]: fully inside. sum = 5+2 = 7. lazy = 2.
   - Update node [0,2]: sum = 1 + 5 + 7 = 13.
3. Node [3,5]: partially overlaps [1,4]. Push down. Recurse.
   - Node [3,4]: fully inside [1,4]. sum = 16 + 2*2 = 20. lazy = 2.
   - Node [5,5]: outside range. Skip.
   - Update node [3,5]: sum = 20 + 11 = 31.
4. Update root: sum = 13 + 31 = 44.

**After update, effective array: [1, 5, 7, 9, 11, 11], sum = 44.**

**Range Query: sum of [2, 4]**

1. Node [0,5]: recurse.
2. Node [0,2]: partially overlaps. Node [2,2] has lazy=2, already applied to sum=7. Return 7.
3. Node [3,5]: partially overlaps. Push down on [3,4] (lazy=2):
   - Child [3,3]: sum = 7+2 = 9, lazy = 2.
   - Child [4,4]: sum = 9+2 = 11, lazy = 2.
   - Clear lazy on [3,4].
   - Node [3,3]: fully in range. Return 9.
   - Node [4,4]: fully in range. Return 11.
4. **Answer: 7 + 9 + 11 = 27.** (Elements A[2..4] = {7, 9, 11} after update.)

## Pseudocode

```
function BUILD(tree, lazy, arr, node, lo, hi):
    lazy[node] = 0
    if lo == hi:
        tree[node] = arr[lo]
        return
    mid = (lo + hi) / 2
    BUILD(tree, lazy, arr, 2*node, lo, mid)
    BUILD(tree, lazy, arr, 2*node+1, mid+1, hi)
    tree[node] = tree[2*node] + tree[2*node+1]

function PUSH_DOWN(tree, lazy, node, lo, hi):
    if lazy[node] != 0:
        mid = (lo + hi) / 2
        // Propagate to left child
        tree[2*node] += lazy[node] * (mid - lo + 1)
        lazy[2*node] += lazy[node]
        // Propagate to right child
        tree[2*node+1] += lazy[node] * (hi - mid)
        lazy[2*node+1] += lazy[node]
        // Clear parent lazy
        lazy[node] = 0

function RANGE_UPDATE(tree, lazy, node, lo, hi, ql, qr, val):
    if qr < lo or hi < ql:
        return
    if ql <= lo and hi <= qr:
        tree[node] += val * (hi - lo + 1)
        lazy[node] += val
        return
    PUSH_DOWN(tree, lazy, node, lo, hi)
    mid = (lo + hi) / 2
    RANGE_UPDATE(tree, lazy, 2*node, lo, mid, ql, qr, val)
    RANGE_UPDATE(tree, lazy, 2*node+1, mid+1, hi, ql, qr, val)
    tree[node] = tree[2*node] + tree[2*node+1]

function RANGE_QUERY(tree, lazy, node, lo, hi, ql, qr):
    if qr < lo or hi < ql:
        return 0
    if ql <= lo and hi <= qr:
        return tree[node]
    PUSH_DOWN(tree, lazy, node, lo, hi)
    mid = (lo + hi) / 2
    return RANGE_QUERY(tree, lazy, 2*node, lo, mid, ql, qr)
         + RANGE_QUERY(tree, lazy, 2*node+1, mid+1, hi, ql, qr)
```

## Complexity Analysis

| Operation | Time    | Space |
|-----------|---------|-------|
| Build     | O(n)    | O(n)  |
| Range update (add v to [l, r]) | O(log n) | O(1) per call |
| Range query (sum of [l, r]) | O(log n) | O(1) per call |
| Point query | O(log n) | O(1) |
| Point update | O(log n) | O(1) |

The space is O(4n) in practice (array-based segment tree with 1-indexed nodes). The lazy tag adds O(n) additional space.

## When to Use

- **Range update + range query:** The classic scenario -- update all elements in a range and query aggregates over a range, both in O(log n).
- **Competitive programming:** Problems involving range additions, range assignments, range sums, range min/max with updates.
- **Simulation:** Maintaining a dynamic array where ranges are frequently modified and queried.
- **Interval scheduling with updates:** Adjusting availability across time ranges and querying total available time.

## When NOT to Use

- **Point updates only:** A standard segment tree (without lazy propagation) is simpler and has the same O(log n) time for point updates with range queries.
- **Immutable data:** If the array never changes, prefix sums answer range sum queries in O(1) with O(n) preprocessing.
- **Simple range sum with point updates:** A Fenwick tree (BIT) is simpler, faster in practice, and uses less memory than a segment tree with lazy propagation.
- **Non-composable operations:** Lazy propagation requires that the update operation distributes over the query operation. If this property does not hold, lazy propagation cannot be applied directly.

## Comparison

| Feature | Segment Tree + Lazy | Segment Tree (no lazy) | Fenwick Tree (BIT) | Sqrt Decomposition |
|---------|--------------------|-----------------------|--------------------|--------------------|
| Range update | O(log n) | O(n) | O(log n) with trick | O(sqrt(n)) |
| Range query | O(log n) | O(log n) | O(log n) | O(sqrt(n)) |
| Point update | O(log n) | O(log n) | O(log n) | O(1) |
| Point query | O(log n) | O(log n) | O(log n) | O(sqrt(n)) |
| Space | O(4n) | O(4n) | O(n) | O(n) |
| Implementation | Moderate | Simple | Simple | Simple |
| Supports range set | Yes (modified lazy) | No | No | Yes |
| Flexibility | Very high | High | Low (sum/XOR only) | High |

## References

- Bentley, J. L. (1977). "Solutions to Klee's rectangle problems." Carnegie Mellon University Technical Report.
- "Segment Tree with Lazy Propagation." *CP-Algorithms*. https://cp-algorithms.com/
- Halim, S.; Halim, F. (2013). *Competitive Programming 3*. Section on Segment Trees.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press.

## Implementations

| Language   | File |
|------------|------|
| Python     | [segment_tree_lazy.py](python/segment_tree_lazy.py) |
| Java       | [SegmentTreeLazy.java](java/SegmentTreeLazy.java) |
| C++        | [segment_tree_lazy.cpp](cpp/segment_tree_lazy.cpp) |
| C          | [segment_tree_lazy.c](c/segment_tree_lazy.c) |
| Go         | [segment_tree_lazy.go](go/segment_tree_lazy.go) |
| TypeScript | [segmentTreeLazy.ts](typescript/segmentTreeLazy.ts) |
| Rust       | [segment_tree_lazy.rs](rust/segment_tree_lazy.rs) |
| Kotlin     | [SegmentTreeLazy.kt](kotlin/SegmentTreeLazy.kt) |
| Swift      | [SegmentTreeLazy.swift](swift/SegmentTreeLazy.swift) |
| Scala      | [SegmentTreeLazy.scala](scala/SegmentTreeLazy.scala) |
| C#         | [SegmentTreeLazy.cs](csharp/SegmentTreeLazy.cs) |
