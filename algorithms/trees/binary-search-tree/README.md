# Binary Search Tree

## Overview

A Binary Search Tree (BST) is a rooted binary tree data structure where each node has at most two children. The key property that distinguishes a BST is the ordering invariant: for any node, all keys in its left subtree are less than or equal to the node's key, and all keys in its right subtree are greater than the node's key.

This ordering property enables efficient searching, insertion, and deletion operations that run in O(log n) time on average. BSTs form the foundation for more advanced self-balancing trees like AVL trees and Red-Black trees.

## How It Works

**Insertion:** Starting from the root, compare the new key with the current node. If the key is less than or equal to the current node, go left; otherwise, go right. When a null position is reached, insert the new node there.

**Inorder Traversal:** Visit the left subtree, then the current node, then the right subtree. For a BST, this always produces keys in sorted (non-decreasing) order.

### Example

Given input: `[5, 3, 7, 1, 4, 6, 8]`

**Building the BST:**

| Step | Insert | Tree Structure |
|------|--------|---------------|
| 1 | 5 | `5` (root) |
| 2 | 3 | `5` -> left: `3` |
| 3 | 7 | `5` -> left: `3`, right: `7` |
| 4 | 1 | `3` -> left: `1` |
| 5 | 4 | `3` -> right: `4` |
| 6 | 6 | `7` -> left: `6` |
| 7 | 8 | `7` -> right: `8` |

```
        5
       / \
      3   7
     / \ / \
    1  4 6  8
```

**Inorder traversal:** 1 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

Result: `[1, 3, 4, 5, 6, 7, 8]`

## Pseudocode

```
class Node:
    key, left, right

function insert(root, key):
    if root is null:
        return new Node(key)
    if key <= root.key:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
    return root

function inorder(root, result):
    if root is null:
        return
    inorder(root.left, result)
    result.append(root.key)
    inorder(root.right, result)

function bstInorder(arr):
    root = null
    for each key in arr:
        root = insert(root, key)
    result = []
    inorder(root, result)
    return result
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(log n) | O(n)  |
| Average | O(log n) | O(n)  |
| Worst   | O(n)     | O(n)  |

- **Best/Average Case -- O(log n):** When the tree is reasonably balanced, each insertion or search requires traversing at most O(log n) levels. The inorder traversal visits all n nodes in O(n).
- **Worst Case -- O(n):** When elements are inserted in sorted order, the tree degenerates into a linked list, and each operation requires O(n) time.
- **Space -- O(n):** The tree stores n nodes. The recursion stack for inorder traversal uses O(h) space, where h is the tree height (O(log n) for balanced, O(n) for degenerate).

## Applications

- **Database indexing:** BSTs underlie many database index structures.
- **Symbol tables:** Compilers use BSTs to store variable names and their attributes.
- **Priority queues:** Can implement dynamic priority queues with insert and delete-min.
- **Sorting:** Building a BST and performing inorder traversal yields a sorted sequence (tree sort).
- **Range queries:** Efficiently find all keys within a given range.
- **Autocompletion:** Foundation for more advanced structures like balanced BSTs used in text editors.

## Implementations

| Language   | File |
|------------|------|
| Python     | [bst_inorder.py](python/bst_inorder.py) |
| Java       | [BinarySearchTree.java](java/BinarySearchTree.java) |
| C++        | [bst_inorder.cpp](cpp/bst_inorder.cpp) |
| C          | [bst_inorder.c](c/bst_inorder.c) |
| Go         | [bst_inorder.go](go/bst_inorder.go) |
| TypeScript | [bstInorder.ts](typescript/bstInorder.ts) |
| Kotlin     | [BinarySearchTree.kt](kotlin/BinarySearchTree.kt) |
| Rust       | [bst_inorder.rs](rust/bst_inorder.rs) |
| Swift      | [BinarySearchTree.swift](swift/BinarySearchTree.swift) |
| Scala      | [BinarySearchTree.scala](scala/BinarySearchTree.scala) |
| C#         | [BinarySearchTree.cs](csharp/BinarySearchTree.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 12: Binary Search Trees.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.2.2.
- [Binary Search Tree -- Wikipedia](https://en.wikipedia.org/wiki/Binary_search_tree)
