# Persistent Data Structures

## Overview

A Persistent Data Structure preserves all previous versions of itself when modified. Instead of mutating the structure in place, each update operation creates a new version that shares most of its structure with previous versions through path copying. This allows efficient access to any historical version of the data structure at any point in time.

This implementation focuses on a Persistent Segment Tree, which supports point updates and range queries across multiple versions. Each update creates a new version by copying only the O(log n) nodes along the path from the root to the modified leaf, while sharing all other nodes with the previous version.

## How It Works

1. **Initial Build**: Construct a segment tree over the input array. This is version 0.

2. **Point Update (creating a new version)**: To update index i in version v:
   - Create a new root node.
   - At each level, copy only the node along the path to index i, linking unchanged children to the original version's nodes.
   - This creates a new tree (version v+1) that shares all nodes except the O(log n) nodes on the updated path.

3. **Range Query on any version**: To query version v for a range [l, r]:
   - Start from version v's root and traverse the segment tree as usual.
   - Since the tree structure is a standard segment tree (just with shared nodes), the query is identical to a regular segment tree query.

4. **Key Insight -- Path Copying**: When updating a node, instead of modifying it, create a new node with the same children except for the one that leads to the updated position. This new node points to the new child and shares the other child with the old version. Only O(log n) new nodes are created per update.

## Worked Example

Array: `[1, 2, 3, 4]` (n = 4).

**Version 0 (initial build):**
```
         [10]          sum of [0..3]
        /    \
     [3]      [7]      sums of [0..1] and [2..3]
    /   \    /   \
  [1]  [2] [3]  [4]    leaf nodes
```

**Version 1: Update index 1 to value 5** (arr becomes [1, 5, 3, 4]):
- Create new root, new left child (since index 1 is in left half), new leaf for index 1.
- Share the right subtree [7] -> [3], [4] from version 0.
```
Version 1:          Version 0 (shared nodes):
    [13]                [10]
   /    \              /    \
 [6]    [7] <--- shared     [7]
/   \                      /   \
[1]  [5]  (new leaf)     [3]  [4]
```
Only 3 new nodes created (root, left child, new leaf). The right subtree with nodes [7], [3], [4] is shared between versions.

**Query version 0, sum(0,3)**: Start from version 0's root. Answer = 10.
**Query version 1, sum(0,3)**: Start from version 1's root. Answer = 13.
**Query version 0, sum(0,1)**: Answer = 3 (original values 1+2).
**Query version 1, sum(0,1)**: Answer = 6 (values 1+5).

## Pseudocode

```
class Node:
    value, left, right

function build(arr, lo, hi):
    node = new Node()
    if lo == hi:
        node.value = arr[lo]
        return node
    mid = (lo + hi) / 2
    node.left = build(arr, lo, mid)
    node.right = build(arr, mid + 1, hi)
    node.value = node.left.value + node.right.value
    return node

function update(prev, lo, hi, index, newValue):
    if lo == hi:
        node = new Node()
        node.value = newValue
        return node
    node = new Node()
    mid = (lo + hi) / 2
    if index <= mid:
        node.left = update(prev.left, lo, mid, index, newValue)
        node.right = prev.right          // share right subtree
    else:
        node.left = prev.left            // share left subtree
        node.right = update(prev.right, mid + 1, hi, index, newValue)
    node.value = node.left.value + node.right.value
    return node

function query(node, lo, hi, queryL, queryR):
    if queryL <= lo and hi <= queryR:
        return node.value
    if queryR < lo or hi < queryL:
        return 0
    mid = (lo + hi) / 2
    return query(node.left, lo, mid, queryL, queryR)
         + query(node.right, mid + 1, hi, queryL, queryR)

// Usage:
roots[0] = build(arr, 0, n - 1)
roots[1] = update(roots[0], 0, n - 1, index, newValue)
answer = query(roots[v], 0, n - 1, l, r)  // query version v
```

## Complexity Analysis

| Operation    | Time     | Space (per operation) |
|-------------|---------|----------------------|
| Build        | O(n)    | O(n)                 |
| Update       | O(log n)| O(log n)             |
| Query        | O(log n)| O(1)                 |

**Why these complexities?**

- **Build -- O(n):** Standard segment tree construction visits each node once. A segment tree over n elements has 2n - 1 nodes.

- **Update -- O(log n) time and space:** Path copying creates exactly one new node at each level of the tree, from root to leaf. The tree has O(log n) levels, so O(log n) new nodes are created per update. All other nodes are shared with the previous version.

- **Query -- O(log n):** Identical to a standard segment tree query. The tree traversal visits O(log n) nodes regardless of version.

- **Total space for K updates:** O(n + K * log n). The initial tree uses O(n) nodes, and each of K updates adds O(log n) new nodes. This is dramatically more efficient than storing K complete copies of the array (which would require O(n * K) space).

## Applications

- **Version control for arrays**: Maintain a full history of an array, allowing queries on any past state. Useful in databases for multi-version concurrency control (MVCC).
- **Kth smallest in a range**: Build a persistent segment tree on the sorted rank of elements. Query version r minus version l-1 to find the kth smallest element in subarray [l, r].
- **Undo/redo functionality**: Editors and applications can maintain persistent versions to support arbitrary undo/redo without storing full copies.
- **Functional programming**: Persistent data structures are fundamental to functional languages (Haskell, Clojure, Scala) where immutability is the default. Clojure's vectors and maps use persistent tree structures internally.
- **Competitive programming**: Persistent segment trees appear in problems requiring queries across multiple array states, such as "count of values less than X in subarray [l, r]."

## When NOT to Use

- **When only the latest version matters**: If you never need to query past versions, a standard (ephemeral) segment tree is simpler and uses less memory.
- **Memory-constrained environments**: Each update creates O(log n) new nodes. After many updates, memory usage can be significant. Garbage collection of unreachable versions is possible but adds complexity.
- **When amortized structures suffice**: If you only need to access the most recent few versions, a simpler approach (like maintaining a stack of diffs) may be more practical.
- **Write-heavy workloads**: If updates vastly outnumber queries, the O(log n) space per update accumulates quickly. Consider periodic rebuilds or compression.

## Comparison with Similar Structures

| Structure                 | Update    | Query     | Space per Update | Version Access |
|--------------------------|----------|----------|-----------------|----------------|
| Persistent Segment Tree   | O(log n) | O(log n) | O(log n)        | Any version    |
| Standard Segment Tree     | O(log n) | O(log n) | O(1)            | Latest only    |
| Copy-on-Write Array       | O(n)     | O(1)     | O(n)            | Any version    |
| Diff-based Versioning     | O(1)     | O(K)     | O(1)            | Any version    |
| Persistent Treap          | O(log n) | O(log n) | O(log n)        | Any version    |

## Implementations

| Language | File |
|----------|------|
| C++      | [PersistentSegmentTree.cpp](cpp/PersistentSegmentTree.cpp) |

## References

- Driscoll, J. R., Sarnak, N., Sleator, D. D., & Tarjan, R. E. (1989). Making data structures persistent. *Journal of Computer and System Sciences*, 38(1), 86-124.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 13-1: Persistent Dynamic Sets.
- Okasaki, C. (1998). *Purely Functional Data Structures*. Cambridge University Press.
- [Persistent Data Structure -- Wikipedia](https://en.wikipedia.org/wiki/Persistent_data_structure)
