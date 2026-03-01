# Interval Tree

## Overview

An Interval Tree is an augmented balanced binary search tree designed to efficiently find all intervals that overlap with a given point or interval. Each node stores an interval [lo, hi] and is augmented with the maximum endpoint in its subtree. This augmentation allows pruning of entire subtrees during search, achieving O(log n + k) time to report all k overlapping intervals. Interval trees are fundamental in computational geometry, scheduling, and genomics.

## How It Works

1. **Structure:** Intervals are inserted into a balanced BST (e.g., a Red-Black tree or AVL tree) keyed by their left endpoint (`lo`).
2. **Augmentation:** Each node stores an additional field `max`, which is the maximum right endpoint (`hi`) in the entire subtree rooted at that node. This is maintained during insertions and deletions.
3. **Overlap Query (point q):** To find all intervals containing a query point `q`:
   - If the current node's interval contains `q` (i.e., `lo <= q <= hi`), report it.
   - If the left child exists and `left.max >= q`, recurse into the left subtree (there may be overlapping intervals there).
   - If `q > node.lo`, recurse into the right subtree (intervals starting after the current node's `lo` may still contain `q`).
4. **Overlap Query (interval [qlo, qhi]):** Two intervals [a,b] and [c,d] overlap if and only if `a <= d` and `c <= b`. The search prunes using the `max` augmentation.

## Example

Insert intervals: `[15, 20], [10, 30], [17, 19], [5, 20], [12, 15], [30, 40]`

BST ordered by left endpoint (with max augmentation):

```
              [15, 20] max=40
             /               \
      [10, 30] max=30     [17, 19] max=40
       /      \                  \
  [5, 20]  [12, 15]         [30, 40]
  max=20   max=15            max=40
```

**Query: find all intervals containing point 19.**

1. Root [15, 20]: 15 <= 19 <= 20? Yes. Report [15, 20].
2. Left child [10, 30]: left.max = 30 >= 19, so recurse left.
   - [10, 30]: 10 <= 19 <= 30? Yes. Report [10, 30].
   - Left [5, 20]: max = 20 >= 19, recurse. 5 <= 19 <= 20? Yes. Report [5, 20].
   - Right [12, 15]: 12 <= 19 <= 15? No. max = 15 < 19, skip.
3. Right child [17, 19]: 17 <= 19 <= 19? Yes. Report [17, 19].
   - Right [30, 40]: 30 <= 19? No. Skip.

**Result:** [15, 20], [10, 30], [5, 20], [17, 19] -- 4 intervals contain point 19.

## Pseudocode

```
function INSERT(node, interval):
    if node is NULL:
        return new Node(interval, max = interval.hi)
    if interval.lo < node.interval.lo:
        node.left = INSERT(node.left, interval)
    else:
        node.right = INSERT(node.right, interval)
    node.max = max(node.max, interval.hi)
    // Rebalance if using AVL/Red-Black
    return node

function QUERY_POINT(node, q, results):
    if node is NULL:
        return
    if node.interval.lo <= q and q <= node.interval.hi:
        results.add(node.interval)
    if node.left is not NULL and node.left.max >= q:
        QUERY_POINT(node.left, q, results)
    if q >= node.interval.lo:
        QUERY_POINT(node.right, q, results)

function QUERY_OVERLAP(node, qlo, qhi, results):
    if node is NULL:
        return
    if node.interval.lo <= qhi and qlo <= node.interval.hi:
        results.add(node.interval)
    if node.left is not NULL and node.left.max >= qlo:
        QUERY_OVERLAP(node.left, qlo, qhi, results)
    if node.interval.lo <= qhi:
        QUERY_OVERLAP(node.right, qlo, qhi, results)

function DELETE(node, interval):
    // Standard BST delete, then update max for ancestors
    // max[node] = max(node.interval.hi, max[left], max[right])
```

## Complexity Analysis

| Operation | Time         | Space |
|-----------|-------------|-------|
| Build (n intervals) | O(n log n) | O(n) |
| Insert | O(log n) | O(1) |
| Delete | O(log n) | O(1) |
| Point query | O(log n + k) | O(k) for results |
| Interval overlap query | O(log n + k) | O(k) for results |
| Find any one overlap | O(log n) | O(1) |

Here k is the number of reported intervals. The O(log n + k) bound holds when the underlying BST is balanced.

## When to Use

- **Scheduling conflicts:** Finding all events that overlap with a given time window.
- **Computational geometry:** Window queries, detecting overlapping segments.
- **Genomics:** Finding all genes or features that overlap a chromosomal region.
- **Calendar applications:** Detecting conflicts with a proposed meeting time.
- **Network routing:** Finding all active connections during a given time interval.
- **Database query optimization:** Range predicates on temporal columns.

## When NOT to Use

- **Point data only (no intervals):** Use a standard BST, segment tree, or Fenwick tree for point queries and updates.
- **Static interval stabbing with known universe:** A simple sweep line or segment tree on a discretized range may be faster and simpler.
- **High-dimensional intervals:** Interval trees work for 1D intervals. For 2D or higher, use R-Trees, KD-Trees, or range trees.
- **Only need to count overlaps (not report them):** A segment tree or BIT with coordinate compression counts overlaps in O(log n) without enumerating them.

## Comparison

| Feature | Interval Tree | Segment Tree | Sweep Line | R-Tree |
|---------|--------------|-------------|------------|--------|
| Query type | Overlap/stabbing | Range aggregate | Event processing | Multi-dimensional |
| Insert/Delete | O(log n) | O(log n) static rebuild | N/A (offline) | O(log n) amortized |
| Point stabbing | O(log n + k) | O(log n + k) | O(n log n) offline | O(log n + k) |
| Interval overlap | O(log n + k) | Complex | Natural | O(log n + k) |
| Dimensions | 1D | 1D | 1D | Multi-D |
| Dynamic | Yes | Limited | No | Yes |

## References

- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Chapter 14: Augmenting Data Structures (Section 14.3: Interval Trees).
- de Berg, M.; Cheong, O.; van Kreveld, M.; Overmars, M. (2008). *Computational Geometry: Algorithms and Applications*, 3rd ed. Springer. Chapter 10.
- Edelsbrunner, H. (1980). "Dynamic data structures for orthogonal intersection queries." *Report F59*, Institute for Information Processing, Technical University of Graz.
- Preparata, F. P.; Shamos, M. I. (1985). *Computational Geometry: An Introduction*. Springer.

## Implementations

| Language   | File |
|------------|------|
| Python     | [interval_tree.py](python/interval_tree.py) |
| Java       | [IntervalTree.java](java/IntervalTree.java) |
| C++        | [interval_tree.cpp](cpp/interval_tree.cpp) |
| C          | [interval_tree.c](c/interval_tree.c) |
| Go         | [interval_tree.go](go/interval_tree.go) |
| TypeScript | [intervalTree.ts](typescript/intervalTree.ts) |
| Rust       | [interval_tree.rs](rust/interval_tree.rs) |
| Kotlin     | [IntervalTree.kt](kotlin/IntervalTree.kt) |
| Swift      | [IntervalTree.swift](swift/IntervalTree.swift) |
| Scala      | [IntervalTree.scala](scala/IntervalTree.scala) |
| C#         | [IntervalTree.cs](csharp/IntervalTree.cs) |
