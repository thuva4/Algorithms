# Treap

## Overview

A Treap (tree + heap) is a randomized binary search tree that combines the properties of a BST (ordered by keys) and a heap (ordered by randomly assigned priorities). Each node has a key and a random priority; the tree maintains BST order on keys and max-heap order on priorities. Introduced by Raimund Seidel and Cecilia Aragon in 1989, the treap achieves expected O(log n) time for all operations and supports efficient split and merge operations, making it popular in competitive programming.

## How It Works

1. **Structure:** Each node stores a key, a random priority, and left/right child pointers. The tree is a BST with respect to keys and a max-heap with respect to priorities.
2. **Insert:** Insert the new node as a leaf (standard BST insertion). Then rotate it upward until the heap property is restored (the node's priority is less than or equal to its parent's priority).
3. **Delete:** Find the node to delete. Rotate it downward (always rotating with the child that has higher priority) until it becomes a leaf, then remove it.
4. **Split(key):** Split the treap into two treaps: one containing all keys < key, and one containing all keys >= key. This takes expected O(log n) time.
5. **Merge(left, right):** Merge two treaps where all keys in `left` are less than all keys in `right`. Compare priorities of roots; the one with higher priority becomes the root, and the other is recursively merged into the appropriate subtree.

## Example

Insert sequence: `[5, 2, 8, 1, 4]` with random priorities shown in parentheses.

```
Insert 5 (pri=90):     5(90)

Insert 2 (pri=70):     5(90)
                       /
                     2(70)

Insert 8 (pri=95):     8(95)         -- 8 has highest priority, rotates to root
                       /
                     5(90)
                     /
                   2(70)

Insert 1 (pri=50):     8(95)
                       /
                     5(90)
                     /
                   2(70)
                   /
                 1(50)

Insert 4 (pri=85):     8(95)
                       /
                     5(90)
                     /
                   4(85)         -- 4 inserted, priority 85 > 70, rotate up past 2
                   / \
                 2(70) (nil)
                 /
               1(50)
```

Final tree satisfies: BST order on keys (inorder = 1,2,4,5,8) and max-heap order on priorities (parent priority >= child priority).

**Split example -- Split(tree, 4):**

Result: Left treap has keys {1, 2}, Right treap has keys {4, 5, 8}.

**Merge example -- Merge(left, right):** Reconstructs the original tree.

## Pseudocode

```
function INSERT(root, key):
    node = new Node(key, random_priority())
    (left, right) = SPLIT(root, key)
    return MERGE(MERGE(left, node), right)

function DELETE(root, key):
    if root is NULL: return NULL
    if key < root.key:
        root.left = DELETE(root.left, key)
    elif key > root.key:
        root.right = DELETE(root.right, key)
    else:
        return MERGE(root.left, root.right)
    return root

function SPLIT(node, key):
    // Returns (left, right) where left has all keys < key
    if node is NULL:
        return (NULL, NULL)
    if node.key < key:
        (l, r) = SPLIT(node.right, key)
        node.right = l
        return (node, r)
    else:
        (l, r) = SPLIT(node.left, key)
        node.left = r
        return (l, node)

function MERGE(left, right):
    // All keys in left < all keys in right
    if left is NULL: return right
    if right is NULL: return left
    if left.priority > right.priority:
        left.right = MERGE(left.right, right)
        return left
    else:
        right.left = MERGE(left, right.left)
        return right

// Rotation-based insert (alternative)
function INSERT_ROTATE(root, key):
    if root is NULL:
        return new Node(key, random_priority())
    if key < root.key:
        root.left = INSERT_ROTATE(root.left, key)
        if root.left.priority > root.priority:
            root = RIGHT_ROTATE(root)
    else:
        root.right = INSERT_ROTATE(root.right, key)
        if root.right.priority > root.priority:
            root = LEFT_ROTATE(root)
    return root
```

## Complexity Analysis

| Operation | Expected | Worst Case | Space |
|-----------|----------|------------|-------|
| Search    | O(log n) | O(n)       | O(n)  |
| Insert    | O(log n) | O(n)       | O(log n) stack |
| Delete    | O(log n) | O(n)       | O(log n) stack |
| Split     | O(log n) | O(n)       | O(log n) stack |
| Merge     | O(log n) | O(n)       | O(log n) stack |
| Build     | O(n log n) expected | O(n^2) | O(n) |

The expected height of a treap with n nodes is O(log n), the same as a random BST. The worst case O(n) occurs with astronomically low probability due to the random priorities.

## When to Use

- **Competitive programming:** Treaps are the go-to balanced BST for contests due to simple split/merge operations that enable interval operations, implicit keys (implicit treap), and order statistics.
- **Implicit key arrays:** An implicit treap (where keys are not stored explicitly but inferred from subtree sizes) supports O(log n) insert-at-position, delete-at-position, reverse-subarray, and other sequence operations.
- **When simplicity and correctness matter:** Treaps are simpler to implement correctly than Red-Black trees or AVL trees, with the same expected performance.
- **Randomized algorithms:** When probabilistic guarantees are acceptable and worst-case guarantees are not required.

## When NOT to Use

- **Worst-case guarantees required:** Treaps have O(n) worst case for individual operations (though extremely unlikely). Use AVL or Red-Black trees for guaranteed O(log n).
- **Deterministic behavior required:** Treap behavior depends on random priorities. In settings where reproducibility is critical (e.g., embedded systems, formal verification), use deterministic balanced BSTs.
- **Concurrent access:** Like most BSTs, treaps require external synchronization for thread safety. Consider concurrent skip lists.
- **Cache-sensitive applications:** Like all pointer-based BSTs, treaps have poor cache locality compared to B-Trees or sorted arrays.

## Comparison

| Feature | Treap | AVL Tree | Red-Black Tree | Splay Tree | Skip List |
|---------|-------|----------|---------------|------------|-----------|
| Search | O(log n) exp. | O(log n) worst | O(log n) worst | O(log n) amort. | O(log n) exp. |
| Insert | O(log n) exp. | O(log n) worst | O(log n) worst | O(log n) amort. | O(log n) exp. |
| Split/Merge | O(log n) exp. | Complex | Complex | O(log n) amort. | O(log n) exp. |
| Implicit keys | Yes (implicit treap) | No | No | Yes | No |
| Deterministic | No | Yes | Yes | Yes | No |
| Balance metadata | Priority (1 int) | Height (1 int) | Color (1 bit) | None | Level per node |
| Implementation | Simple | Moderate | Hard | Simple | Simple |

## References

- Seidel, R.; Aragon, C. R. (1996). "Randomized search trees." *Algorithmica*, 16(4/5), 464-497. (Originally presented at FOCS 1989.)
- Vuillemin, J. (1980). "A unifying look at data structures." *Communications of the ACM*, 23(4), 229-239.
- Naor, M.; Nissim, K. (2000). "Certificate revocation and certificate update." *IEEE Journal on Selected Areas in Communications*, 18(4), 561-570. (Application of treaps.)
- Blelloch, G. E.; Reid-Miller, M. (1998). "Fast set operations using treaps." *SPAA*, pp. 16-26.

## Implementations

| Language   | File |
|------------|------|
| Python     | [treap.py](python/treap.py) |
| Java       | [Treap.java](java/Treap.java) |
| C++        | [treap.cpp](cpp/treap.cpp) |
| C          | [treap.c](c/treap.c) |
| Go         | [treap.go](go/treap.go) |
| TypeScript | [treap.ts](typescript/treap.ts) |
| Rust       | [treap.rs](rust/treap.rs) |
| Kotlin     | [Treap.kt](kotlin/Treap.kt) |
| Swift      | [Treap.swift](swift/Treap.swift) |
| Scala      | [Treap.scala](scala/Treap.scala) |
| C#         | [Treap.cs](csharp/Treap.cs) |
