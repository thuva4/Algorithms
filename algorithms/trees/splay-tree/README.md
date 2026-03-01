# Splay Tree

## Overview

A Splay Tree is a self-adjusting binary search tree where recently accessed elements are moved to the root through a series of rotations called "splaying." Invented by Daniel Sleator and Robert Tarjan in 1985, it provides amortized O(log n) time for all operations without storing any balance information (no heights, colors, or weights). The key property is that frequently accessed elements naturally stay near the root, making splay trees optimal for workloads with temporal locality.

## How It Works

The splay operation moves a target node to the root using three types of double-rotation steps (plus a single rotation for the final step):

1. **Zig:** Simple rotation when the node is a direct child of the root. Performed only as the last step.
2. **Zig-Zig:** Two rotations in the same direction when the node and its parent are both left children (or both right children). First rotate the grandparent, then rotate the parent.
3. **Zig-Zag:** Two rotations in opposite directions when the node is a left child and its parent is a right child (or vice versa). First rotate the parent, then rotate the grandparent.

**Insertion:** Insert as in a standard BST, then splay the new node to the root.
**Search:** Search as in a standard BST, then splay the found node (or the last accessed node) to the root.
**Deletion:** Splay the node to delete to the root. Remove it. Splay the largest element in the left subtree to the root of the left subtree, then attach the right subtree as its right child.

## Example

Insert sequence: `[10, 20, 5, 15, 25]`

```
Insert 10:      10

Insert 20:      10          Splay 20:    20
                  \          zig          /
                  20                    10

Insert 5:       20          Splay 5:     5
                /            zig-zig       \
              10                           10
              /                              \
            5                                20

Insert 15:   5              Splay 15:    15
               \             zig-zag     /  \
               10                       5    20
                 \                       \
                 20                      10
                 /
               15

Insert 25:  15              Splay 25:    25
            /  \             zig-zig     /
           5    20                      20
            \     \                     /
            10    25                   15
                                      /  \
                                     5    (nil)
                                      \
                                      10
```

**Search for 10:** Traverse from root to find 10. Splay 10 to root:

```
Before:     25          After splay:    10
            /                          /   \
           20                         5     25
           /                               /
          15                              20
         /  \                            /
        5    (nil)                      15
         \
         10
```

## Pseudocode

```
function SPLAY(tree, x):
    while x.parent != NULL:
        p = x.parent
        g = p.parent
        if g == NULL:
            // Zig step
            if x == p.left:
                RIGHT_ROTATE(tree, p)
            else:
                LEFT_ROTATE(tree, p)
        elif x == p.left and p == g.left:
            // Zig-zig (both left)
            RIGHT_ROTATE(tree, g)
            RIGHT_ROTATE(tree, p)
        elif x == p.right and p == g.right:
            // Zig-zig (both right)
            LEFT_ROTATE(tree, g)
            LEFT_ROTATE(tree, p)
        elif x == p.right and p == g.left:
            // Zig-zag
            LEFT_ROTATE(tree, p)
            RIGHT_ROTATE(tree, g)
        else:
            // Zig-zag (symmetric)
            RIGHT_ROTATE(tree, p)
            LEFT_ROTATE(tree, g)

function INSERT(tree, key):
    node = BST_INSERT(tree, key)
    SPLAY(tree, node)

function SEARCH(tree, key):
    node = BST_SEARCH(tree.root, key)
    if node != NULL:
        SPLAY(tree, node)
    return node

function DELETE(tree, key):
    node = SEARCH(tree, key)     // splays node to root
    if node == NULL: return
    if node.left == NULL:
        tree.root = node.right
    else:
        right = node.right
        tree.root = node.left
        // Splay max of left subtree
        max_left = FIND_MAX(tree.root)
        SPLAY(tree, max_left)
        tree.root.right = right
```

## Complexity Analysis

| Operation | Amortized | Worst Case (single op) | Space |
|-----------|-----------|----------------------|-------|
| Search    | O(log n)  | O(n)                 | O(n)  |
| Insert    | O(log n)  | O(n)                 | O(n)  |
| Delete    | O(log n)  | O(n)                 | O(n)  |
| Splay     | O(log n)  | O(n)                 | O(1)  |
| Build (n keys) | O(n log n) | O(n^2) possible | O(n) |

The amortized analysis uses a potential function based on the sum of log(subtree sizes). Any sequence of m operations on a tree of n elements takes O((m + n) log n) total time.

**Static Optimality Property:** Over a sequence of accesses, a splay tree performs within a constant factor of the optimal static BST for that sequence.

## When to Use

- **Workloads with temporal locality:** Frequently accessed items stay near the root, yielding near-O(1) access for hot items. Ideal for caches, LRU-like structures, and network routers.
- **When simplicity of code matters:** No balance metadata (height, color, priority) needed. The splay operation is the only maintenance routine.
- **Adaptive data structures:** The tree self-optimizes for the access pattern without any tuning.
- **Garbage collectors and memory allocators:** Frequently freed/allocated sizes rise to the top.
- **Data compression:** Used in move-to-front variants for adaptive coding.
- **Competitive programming:** When you need a balanced BST with split/merge operations.

## When NOT to Use

- **Worst-case guarantees required:** Individual operations can take O(n) time. In real-time systems where per-operation latency matters, use AVL or Red-Black trees.
- **Uniform access patterns:** If every element is accessed equally often, splay trees add overhead (constant factor from rotations) without the locality benefit. A balanced BST is better.
- **Concurrent/multi-threaded access:** Every access modifies the tree (splaying), making concurrent access difficult. Reads become writes, defeating read-write lock optimizations. Use a concurrent skip list or lock-free structure.
- **Persistent/functional settings:** Splay trees are inherently imperative due to in-place splaying. Use Red-Black trees (Okasaki-style) for functional persistence.

## Comparison

| Feature | Splay Tree | AVL Tree | Red-Black Tree | Treap |
|---------|-----------|----------|---------------|-------|
| Search (worst) | O(n) | O(log n) | O(log n) | O(n) expected O(log n) |
| Search (amortized) | O(log n) | O(log n) | O(log n) | O(log n) |
| Adaptive to access pattern | Yes (optimal) | No | No | No |
| Balance metadata per node | None | Height (1 int) | Color (1 bit) | Priority (1 int) |
| Rotations per access | O(log n) amortized | 0 for search | 0 for search | 0 for search |
| Split / Merge | O(log n) amortized | Complex | Complex | O(log n) expected |
| Concurrent-friendly | No (reads mutate) | Yes | Yes | Yes |
| Implementation | Simple | Moderate | Hard | Simple |

## References

- Sleator, D. D.; Tarjan, R. E. (1985). "Self-adjusting binary search trees." *Journal of the ACM*, 32(3), 652-686.
- Tarjan, R. E. (1985). "Amortized computational complexity." *SIAM Journal on Algebraic and Discrete Methods*, 6(2), 306-318.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Problem 13-2.
- Goodrich, M. T.; Tamassia, R. (2014). *Data Structures and Algorithms in Java*, 6th ed. Chapter 11.

## Implementations

| Language   | File |
|------------|------|
| Python     | [splay_tree.py](python/splay_tree.py) |
| Java       | [SplayTree.java](java/SplayTree.java) |
| C++        | [splay_tree.cpp](cpp/splay_tree.cpp) |
| C          | [splay_tree.c](c/splay_tree.c) |
| Go         | [splay_tree.go](go/splay_tree.go) |
| TypeScript | [splayTree.ts](typescript/splayTree.ts) |
| Rust       | [splay_tree.rs](rust/splay_tree.rs) |
| Kotlin     | [SplayTree.kt](kotlin/SplayTree.kt) |
| Swift      | [SplayTree.swift](swift/SplayTree.swift) |
| Scala      | [SplayTree.scala](scala/SplayTree.scala) |
| C#         | [SplayTree.cs](csharp/SplayTree.cs) |
