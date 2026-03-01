# Binary Tree

## Overview

A Binary Tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child. Binary trees are the foundation for many advanced data structures and algorithms, including binary search trees, heaps, and expression trees. The level-order traversal (also known as breadth-first traversal) visits all nodes level by level from top to bottom and left to right.

Binary trees are ubiquitous in computer science: they model hierarchical relationships, enable efficient searching and sorting, and form the basis for expression parsing, decision trees, and Huffman coding.

## How It Works

A binary tree is built by linking nodes, where each node contains a value and pointers to its left and right children. Level-order traversal uses a queue to visit nodes level by level. Starting with the root, we dequeue a node, process it, then enqueue its left and right children. This continues until the queue is empty.

### Example

Given the following binary tree:

```
        1
       / \
      2   3
     / \   \
    4   5   6
   /
  7
```

**Level-order traversal:**

| Step | Dequeue | Process | Enqueue | Queue State |
|------|---------|---------|---------|-------------|
| 0 | - | - | 1 | [1] |
| 1 | 1 | Visit 1 | 2, 3 | [2, 3] |
| 2 | 2 | Visit 2 | 4, 5 | [3, 4, 5] |
| 3 | 3 | Visit 3 | 6 | [4, 5, 6] |
| 4 | 4 | Visit 4 | 7 | [5, 6, 7] |
| 5 | 5 | Visit 5 | - | [6, 7] |
| 6 | 6 | Visit 6 | - | [7] |
| 7 | 7 | Visit 7 | - | [] |

Result: Level-order output = `[1, 2, 3, 4, 5, 6, 7]`

**Other common traversals of the same tree:**
- **In-order (left, root, right):** `[7, 4, 2, 5, 1, 3, 6]`
- **Pre-order (root, left, right):** `[1, 2, 4, 7, 5, 3, 6]`
- **Post-order (left, right, root):** `[7, 4, 5, 2, 6, 3, 1]`

## Pseudocode

```
function levelOrderTraversal(root):
    if root is null:
        return

    queue = empty queue
    queue.enqueue(root)

    while queue is not empty:
        node = queue.dequeue()
        visit(node)

        if node.left is not null:
            queue.enqueue(node.left)
        if node.right is not null:
            queue.enqueue(node.right)
```

The queue ensures nodes are processed in the correct order: all nodes at depth d are processed before any node at depth d + 1. This is the same mechanism used in breadth-first search on graphs.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n):** Every node must be visited exactly once during traversal. Even in a perfectly balanced tree, all n nodes are processed.

- **Average Case -- O(n):** Each node is enqueued and dequeued exactly once, with O(1) work per node. Total work is proportional to the number of nodes.

- **Worst Case -- O(n):** The traversal visits all n nodes regardless of tree shape.

- **Space -- O(n):** The queue can hold at most the number of nodes at the widest level of the tree. In a complete binary tree, the last level has up to n/2 nodes, so the queue size is O(n). For a skewed tree (essentially a linked list), the queue holds at most 1 node, giving O(1) space, but the recursion stack for other traversals would be O(n).

## When to Use

- **Level-by-level processing:** When you need to process nodes in order of their depth (e.g., printing a tree by levels, finding level averages).
- **Finding the shortest path in unweighted trees:** BFS/level-order naturally finds the shallowest occurrence of a value.
- **Serialization and deserialization:** Level-order traversal provides a natural format for serializing binary trees.
- **When tree depth is moderate:** Level-order traversal avoids the risk of stack overflow that recursive traversals face on deep trees.

## When NOT to Use

- **When you need sorted order:** Use in-order traversal on a BST instead.
- **When you need to process children before parents:** Use post-order traversal instead.
- **Memory-constrained environments with very wide trees:** The queue can be as large as the widest level.
- **When the tree is extremely deep but narrow:** Depth-first traversals (in-order, pre-order, post-order) use less memory for deep, narrow trees.

## Comparison with Similar Algorithms

| Traversal   | Time | Space        | Notes                                          |
|-------------|------|--------------|-------------------------------------------------|
| Level-order | O(n) | O(w) (width) | BFS-based; visits level by level                 |
| In-order    | O(n) | O(h) (height)| DFS; gives sorted order for BSTs                 |
| Pre-order   | O(n) | O(h) (height)| DFS; useful for tree copying/serialization        |
| Post-order  | O(n) | O(h) (height)| DFS; useful for deletion and expression evaluation|
| Morris      | O(n) | O(1)         | In-order without recursion or stack; modifies tree|

## Implementations

| Language | File |
|----------|------|
| C++      | [BinaryTree_LevelOrder.cpp](cpp/BinaryTree_LevelOrder.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 10: Elementary Data Structures, Chapter 12: Binary Search Trees.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 2.3: Trees.
- [Binary Tree -- Wikipedia](https://en.wikipedia.org/wiki/Binary_tree)
