# Persistent Segment Tree

## Overview

A Persistent Segment Tree preserves all previous versions of the tree after updates. When a point update is made, instead of modifying nodes in place, new nodes are created along the path from root to leaf, while sharing unchanged subtrees with previous versions. This allows querying any historical version in O(log n) time with only O(log n) extra space per update. Persistent segment trees are essential for problems like the online k-th smallest in a range and versioned data structures.

## How It Works

1. **Build (version 0):** Create the initial segment tree from the input array. Each internal node stores the aggregate (e.g., sum or count) of its range.
2. **Point Update (create new version):** Starting from the current version's root, create a new root. Walk down the path to the updated position, creating new copies of each node on the path. Unchanged children remain shared with the previous version. This creates a new version with only O(log n) new nodes.
3. **Query a version:** Given a version number, start from that version's root and traverse as in a normal segment tree query.
4. **Implicit persistence:** Since each version's root points to a complete tree (via shared subtrees), you can query any version at any time without reconstruction.

## Example

Array: `A = [1, 3, 5, 7, 9]` (indices 0-4)

**Version 0 (initial tree, storing sums):**

```
            [25]            range [0,4]
           /    \
        [4]     [21]        [0,1] [2,4]
        / \     / \
      [1] [3] [5] [16]      leaves and [3,4]
                  / \
                [7] [9]
```

**Version 1: Update index 2 from 5 to 10 (add 5).**

Create new nodes along the path [0,4] -> [2,4] -> [2,2]:

```
Version 0 root: [25]       Version 1 root: [30]  (new)
                             /            \
                          [4] (shared)  [26] (new)
                          / \           / \
                        [1] [3]     [10]  [16] (shared)
                       (shared)     (new)  / \
                                         [7] [9] (shared)
```

Only 3 new nodes created. Version 0 still has root [25] and answers queries on the original data.

**Query sum [0, 4] on version 0:** 25 (original).
**Query sum [0, 4] on version 1:** 30 (with update).
**Query sum [2, 2] on version 0:** 5.
**Query sum [2, 2] on version 1:** 10.

## Pseudocode

```
struct Node:
    left_child, right_child  // pointers (indices into node pool)
    value                    // aggregate value (sum, count, etc.)

function BUILD(arr, lo, hi):
    node = new Node()
    if lo == hi:
        node.value = arr[lo]
        return node
    mid = (lo + hi) / 2
    node.left_child = BUILD(arr, lo, mid)
    node.right_child = BUILD(arr, mid+1, hi)
    node.value = node.left_child.value + node.right_child.value
    return node

function UPDATE(prev, lo, hi, pos, val):
    node = new Node()           // create new node (persistence)
    if lo == hi:
        node.value = prev.value + val
        return node
    mid = (lo + hi) / 2
    if pos <= mid:
        node.left_child = UPDATE(prev.left_child, lo, mid, pos, val)
        node.right_child = prev.right_child    // share unchanged subtree
    else:
        node.left_child = prev.left_child      // share unchanged subtree
        node.right_child = UPDATE(prev.right_child, mid+1, hi, pos, val)
    node.value = node.left_child.value + node.right_child.value
    return node

function QUERY(node, lo, hi, ql, qr):
    if qr < lo or hi < ql:
        return 0
    if ql <= lo and hi <= qr:
        return node.value
    mid = (lo + hi) / 2
    return QUERY(node.left_child, lo, mid, ql, qr)
         + QUERY(node.right_child, mid+1, hi, ql, qr)

// K-th smallest in range [l, r] using persistent counting tree
function KTH_SMALLEST(root_l, root_r, lo, hi, k):
    if lo == hi:
        return lo
    mid = (lo + hi) / 2
    left_count = root_r.left_child.value - root_l.left_child.value
    if left_count >= k:
        return KTH_SMALLEST(root_l.left_child, root_r.left_child, lo, mid, k)
    else:
        return KTH_SMALLEST(root_l.right_child, root_r.right_child, mid+1, hi, k - left_count)
```

## Complexity Analysis

| Operation | Time     | Space (per operation) |
|-----------|----------|----------------------|
| Build     | O(n)     | O(n)                 |
| Point update (new version) | O(log n) | O(log n) new nodes |
| Range query (any version)  | O(log n) | O(1) |
| k-th smallest in [l, r]   | O(log n) | O(1) |
| Total space for m updates  | -        | O(n + m log n) |

After m updates, the total number of nodes is O(n + m * log n) since each update creates O(log n) new nodes.

## When to Use

- **k-th smallest element in a range:** Build a persistent counting segment tree over sorted values; query uses version subtraction.
- **Versioned data structures:** When you need to access or query historical states of an array.
- **Functional programming paradigms:** Persistence fits naturally in immutable data structure designs.
- **Online queries with prefix versions:** Problems where queries depend on versions formed by prefix insertions.
- **Competitive programming:** Problems involving offline range order statistics.

## When NOT to Use

- **Range updates needed:** Persistent segment trees with lazy propagation are significantly more complex and memory-hungry. Consider offline approaches or other structures.
- **Memory-constrained problems:** O(n + m log n) nodes can be substantial. If memory is tight, consider wavelet trees or offline approaches like merge sort tree.
- **When only the latest version matters:** A standard segment tree uses O(n) space and is simpler. Persistence adds complexity for no benefit if history is not needed.
- **Dynamic k-th smallest with updates:** While possible, persistent trees with updates are complex. Consider a balanced BST with order statistics (e.g., order-statistic tree) for simpler dynamic k-th smallest.

## Comparison

| Feature | Persistent Segment Tree | Merge Sort Tree | Wavelet Tree | BIT + Offline |
|---------|------------------------|----------------|-------------|--------------|
| k-th smallest in [l, r] | O(log n) | O(log^3 n) | O(log n) | O(n log n) offline |
| Count <= k in [l, r] | O(log n) | O(log^2 n) | O(log n) | O(log^2 n) |
| Space | O(n + m log n) | O(n log n) | O(n log sigma) | O(n) |
| Online queries | Yes | Yes | Yes | No |
| Point updates | O(log n) new version | Not efficient | Not efficient | O(log^2 n) |
| Implementation | Moderate | Simple | Complex | Simple |

## References

- Driscoll, J. R.; Sarnak, N.; Sleator, D. D.; Tarjan, R. E. (1989). "Making data structures persistent." *Journal of Computer and System Sciences*, 38(1), 86-124.
- Sarnak, N.; Tarjan, R. E. (1986). "Planar point location using persistent search trees." *Communications of the ACM*, 29(7), 669-679.
- "Persistent Segment Tree." *CP-Algorithms*. https://cp-algorithms.com/
- Halim, S.; Halim, F. (2013). *Competitive Programming 3*. Section on Persistent Data Structures.

## Implementations

| Language   | File |
|------------|------|
| Python     | [persistent_segment_tree.py](python/persistent_segment_tree.py) |
| Java       | [PersistentSegmentTree.java](java/PersistentSegmentTree.java) |
| C++        | [persistent_segment_tree.cpp](cpp/persistent_segment_tree.cpp) |
| C          | [persistent_segment_tree.c](c/persistent_segment_tree.c) |
| Go         | [persistent_segment_tree.go](go/persistent_segment_tree.go) |
| TypeScript | [persistentSegmentTree.ts](typescript/persistentSegmentTree.ts) |
| Rust       | [persistent_segment_tree.rs](rust/persistent_segment_tree.rs) |
| Kotlin     | [PersistentSegmentTree.kt](kotlin/PersistentSegmentTree.kt) |
| Swift      | [PersistentSegmentTree.swift](swift/PersistentSegmentTree.swift) |
| Scala      | [PersistentSegmentTree.scala](scala/PersistentSegmentTree.scala) |
| C#         | [PersistentSegmentTree.cs](csharp/PersistentSegmentTree.cs) |
