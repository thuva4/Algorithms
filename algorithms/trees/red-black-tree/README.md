# Red-Black Tree

## Overview

A Red-Black Tree is a self-balancing binary search tree where each node has an extra bit for color (red or black). The tree maintains balance through a set of color properties that ensure no path from root to leaf is more than twice as long as any other, guaranteeing O(log n) operations in the worst case. Introduced by Rudolf Bayer (1972) as "symmetric binary B-trees" and later refined by Leonidas Guibas and Robert Sedgewick (1978), Red-Black trees are the most widely used balanced BST in practice, underlying implementations like C++ `std::map`, Java `TreeMap`, and the Linux kernel's CFS scheduler.

## How It Works

Red-Black Trees maintain five properties:
1. Every node is either red or black.
2. The root is always black.
3. Every leaf (NIL sentinel) is black.
4. If a node is red, both its children are black (no two consecutive reds).
5. Every path from a node to its descendant NIL nodes has the same number of black nodes (the "black-height").

**Insertion:** Insert the new node as red (to preserve property 5). Then fix violations of property 4 using recoloring and at most 2 rotations.

**Deletion:** Remove the node using standard BST deletion. If the removed node was black, the black-height property is violated. Fix using recoloring and at most 3 rotations.

## Example

Given input: `[7, 3, 18, 10, 22, 8, 11, 26]`

```
Insert 7:     7(B)

Insert 3:     7(B)
             /
           3(R)

Insert 18:    7(B)
             / \
           3(R) 18(R)

Insert 10:   7(B)
             / \
           3(B) 18(B)     -- recolor parent and uncle to black, grandparent stays black (root)
                /
              10(R)

Insert 22:   7(B)
             / \
           3(B) 18(B)
                / \
              10(R) 22(R)

Insert 8:    7(B)
             / \
           3(B) 18(B)
                / \
              10(R) 22(R)
              /
            8(R)       -- uncle 22 is red: recolor 10,22 to black, 18 to red
                       -- then 18(R) under 7(B) is fine

Result:      7(B)
             / \
           3(B) 18(R)
                / \
              10(B) 22(B)
              /
            8(R)

Insert 11:   Causes rotation at node 10. Left-rotate 10, then
             adjust colors.

Insert 26:   Simple insertion under 22.

Final inorder traversal: [3, 7, 8, 10, 11, 18, 22, 26]
```

## Pseudocode

```
function INSERT(tree, key):
    node = BST_INSERT(tree, key)
    node.color = RED
    INSERT_FIXUP(tree, node)

function INSERT_FIXUP(tree, z):
    while z.parent.color == RED:
        if z.parent == z.parent.parent.left:
            uncle = z.parent.parent.right
            if uncle.color == RED:                 // Case 1: uncle is red
                z.parent.color = BLACK
                uncle.color = BLACK
                z.parent.parent.color = RED
                z = z.parent.parent
            else:
                if z == z.parent.right:            // Case 2: uncle black, z is right child
                    z = z.parent
                    LEFT_ROTATE(tree, z)
                z.parent.color = BLACK             // Case 3: uncle black, z is left child
                z.parent.parent.color = RED
                RIGHT_ROTATE(tree, z.parent.parent)
        else:
            // symmetric (swap left/right)
    tree.root.color = BLACK

function LEFT_ROTATE(tree, x):
    y = x.right
    x.right = y.left
    if y.left != NIL:
        y.left.parent = x
    y.parent = x.parent
    if x.parent == NIL:
        tree.root = y
    elif x == x.parent.left:
        x.parent.left = y
    else:
        x.parent.right = y
    y.left = x
    x.parent = y

function DELETE(tree, key):
    node = SEARCH(tree.root, key)
    y = node
    y_original_color = y.color
    if node.left == NIL:
        x = node.right
        TRANSPLANT(tree, node, node.right)
    elif node.right == NIL:
        x = node.left
        TRANSPLANT(tree, node, node.left)
    else:
        y = MINIMUM(node.right)        // inorder successor
        y_original_color = y.color
        x = y.right
        // ... replace node with y, adjust pointers
    if y_original_color == BLACK:
        DELETE_FIXUP(tree, x)
```

## Complexity Analysis

| Operation | Time       | Space |
|-----------|------------|-------|
| Search    | O(log n)   | O(1) iterative |
| Insert    | O(log n)   | O(1) — at most 2 rotations |
| Delete    | O(log n)   | O(1) — at most 3 rotations |
| Build (n keys) | O(n log n) | O(n) |
| Min / Max | O(log n)   | O(1) |
| Successor / Predecessor | O(log n) | O(1) |

The height of a Red-Black tree is at most 2 * log2(n + 1), which is less strict than AVL trees (1.44 * log2(n)) but guarantees fewer structural changes per operation.

## When to Use

- **Standard library implementations:** When you need an ordered map/set with guaranteed O(log n) operations (C++ `std::map`/`std::set`, Java `TreeMap`/`TreeSet`).
- **Operating system kernels:** Linux CFS scheduler, virtual memory management, process scheduling.
- **When insertions and deletions are frequent:** Red-Black trees perform at most 2 rotations per insert and 3 per delete, making them efficient for write-heavy workloads.
- **Concurrent data structures:** The bounded number of rotations per operation simplifies lock-based synchronization.
- **Persistent and functional variants:** Red-Black trees have clean functional implementations (e.g., Okasaki's purely functional Red-Black trees).

## When NOT to Use

- **Lookup-heavy workloads:** AVL trees have stricter balance (height <= 1.44 log n vs. 2 log n), resulting in fewer comparisons per search. If reads vastly outnumber writes, prefer AVL.
- **Simple ordered data without updates:** A sorted array with binary search is simpler and has better cache locality for static data.
- **When key ordering is not needed:** Hash tables provide O(1) average lookup and insertion.
- **Disk-based storage:** B-Trees are designed for block-oriented I/O and are far more efficient for databases and file systems.
- **When implementation simplicity matters:** Red-Black tree deletion is notoriously complex. Consider treaps or skip lists for simpler alternatives with similar guarantees.

## Comparison

| Feature | Red-Black Tree | AVL Tree | B-Tree | Splay Tree | Skip List |
|---------|---------------|----------|--------|------------|-----------|
| Search (worst) | O(log n) | O(log n) | O(log n) | Amortized O(log n) | Expected O(log n) |
| Insert rotations | <= 2 | O(log n) | 0 (splits instead) | Amortized O(log n) | N/A |
| Delete rotations | <= 3 | O(log n) | 0 (merges instead) | Amortized O(log n) | N/A |
| Height | <= 2 log n | <= 1.44 log n | O(log_t n) | Unbounded | Expected O(log n) |
| Practical use | std::map, TreeMap | Databases (in-memory) | Databases (disk) | Caches | ConcurrentSkipListMap |
| Implementation | Hard | Moderate | Hard | Easy | Easy |

## References

- Bayer, R. (1972). "Symmetric binary B-trees: Data structure and maintenance algorithms." *Acta Informatica*, 1, 290-306.
- Guibas, L. J.; Sedgewick, R. (1978). "A dichromatic framework for balanced trees." *FOCS*, pp. 8-21.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Chapter 13: Red-Black Trees.
- Sedgewick, R. (2008). "Left-leaning Red-Black Trees." *Dagstuhl Workshop on Data Structures*.
- Okasaki, C. (1998). *Purely Functional Data Structures*. Cambridge University Press. Chapter 3.3.

## Implementations

| Language   | File |
|------------|------|
| Python     | [red_black_tree.py](python/red_black_tree.py) |
| Java       | [RedBlackTree.java](java/RedBlackTree.java) |
| C++        | [red_black_tree.cpp](cpp/red_black_tree.cpp) |
| C          | [red_black_tree.c](c/red_black_tree.c) |
| Go         | [red_black_tree.go](go/red_black_tree.go) |
| TypeScript | [redBlackTree.ts](typescript/redBlackTree.ts) |
| Rust       | [red_black_tree.rs](rust/red_black_tree.rs) |
| Kotlin     | [RedBlackTree.kt](kotlin/RedBlackTree.kt) |
| Swift      | [RedBlackTree.swift](swift/RedBlackTree.swift) |
| Scala      | [RedBlackTree.scala](scala/RedBlackTree.scala) |
| C#         | [RedBlackTree.cs](csharp/RedBlackTree.cs) |
