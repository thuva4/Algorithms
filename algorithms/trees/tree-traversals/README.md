# Tree Traversals

## Overview

Tree traversals are systematic methods for visiting every node in a tree exactly once. The four main traversal orders are:

- **Inorder (Left, Root, Right):** Visits nodes in sorted order for a BST. Used for expression evaluation and producing sorted output.
- **Preorder (Root, Left, Right):** Visits the root before its children. Used for copying trees, serialization, and prefix expression generation.
- **Postorder (Left, Right, Root):** Visits the root after its children. Used for deleting trees, postfix expression generation, and computing subtree properties.
- **Level-order (BFS):** Visits nodes level by level from top to bottom, left to right. Used for breadth-first search, finding the shortest path in unweighted trees, and printing trees by level.

This implementation returns the inorder traversal of a binary tree given as a level-order array representation.

## How It Works

Given a level-order array representation of a binary tree (using -1 for null nodes):
- For a node at index `i`, its left child is at `2i + 1` and its right child is at `2i + 2`.
- **Inorder traversal** recursively visits the left subtree, then the current node, then the right subtree.
- **Preorder traversal** visits the current node first, then left and right subtrees.
- **Postorder traversal** visits left and right subtrees first, then the current node.
- **Level-order traversal** uses a queue: enqueue the root, then repeatedly dequeue a node, process it, and enqueue its children.

## Example

**Binary tree:**
```
        4
       / \
      2    6
     / \  / \
    1  3  5  7
```

Level-order array: `[4, 2, 6, 1, 3, 5, 7]`

**Inorder traversal (Left, Root, Right):**
- Visit left subtree of 4: visit left of 2 (node 1), then 2, then right of 2 (node 3).
- Visit root 4.
- Visit right subtree of 4: visit left of 6 (node 5), then 6, then right of 6 (node 7).
- **Result: [1, 2, 3, 4, 5, 6, 7]** (sorted order for BST).

**Preorder traversal (Root, Left, Right):**
- Visit 4, then left subtree (2, 1, 3), then right subtree (6, 5, 7).
- **Result: [4, 2, 1, 3, 6, 5, 7]**

**Postorder traversal (Left, Right, Root):**
- Visit left subtree (1, 3, 2), then right subtree (5, 7, 6), then root 4.
- **Result: [1, 3, 2, 5, 7, 6, 4]**

**Level-order traversal (BFS):**
- Level 0: 4. Level 1: 2, 6. Level 2: 1, 3, 5, 7.
- **Result: [4, 2, 6, 1, 3, 5, 7]**

**Expression tree example:**
```
        *
       / \
      +    -
     / \  / \
    3  4  8  2
```

- Inorder: `3 + 4 * 8 - 2` (infix expression, needs parentheses for correctness)
- Preorder: `* + 3 4 - 8 2` (prefix/Polish notation)
- Postorder: `3 4 + 8 2 - *` (postfix/Reverse Polish notation)

## Pseudocode

```
// Recursive traversals (linked tree)
function INORDER(node):
    if node is NULL: return
    INORDER(node.left)
    visit(node)
    INORDER(node.right)

function PREORDER(node):
    if node is NULL: return
    visit(node)
    PREORDER(node.left)
    PREORDER(node.right)

function POSTORDER(node):
    if node is NULL: return
    POSTORDER(node.left)
    POSTORDER(node.right)
    visit(node)

function LEVEL_ORDER(root):
    if root is NULL: return
    queue = [root]
    while queue is not empty:
        node = queue.dequeue()
        visit(node)
        if node.left is not NULL: queue.enqueue(node.left)
        if node.right is not NULL: queue.enqueue(node.right)

// Array-based inorder traversal (level-order array)
function INORDER_ARRAY(arr, index, result):
    if index >= len(arr) or arr[index] == -1:
        return
    INORDER_ARRAY(arr, 2 * index + 1, result)   // left child
    result.append(arr[index])
    INORDER_ARRAY(arr, 2 * index + 2, result)   // right child

// Iterative inorder using explicit stack (Morris traversal avoids stack)
function INORDER_ITERATIVE(root):
    stack = []
    current = root
    result = []
    while current is not NULL or stack is not empty:
        while current is not NULL:
            stack.push(current)
            current = current.left
        current = stack.pop()
        result.append(current.value)
        current = current.right
    return result

// Morris inorder traversal (O(1) space, O(n) time)
function MORRIS_INORDER(root):
    current = root
    result = []
    while current is not NULL:
        if current.left is NULL:
            result.append(current.value)
            current = current.right
        else:
            predecessor = current.left
            while predecessor.right != NULL and predecessor.right != current:
                predecessor = predecessor.right
            if predecessor.right is NULL:
                predecessor.right = current   // create thread
                current = current.left
            else:
                predecessor.right = NULL      // remove thread
                result.append(current.value)
                current = current.right
    return result
```

## Complexity Analysis

| Traversal | Time | Space (recursive) | Space (iterative/stack) | Space (Morris) |
|-----------|------|-------------------|------------------------|----------------|
| Inorder   | O(n) | O(h) stack        | O(h) explicit stack    | O(1)           |
| Preorder  | O(n) | O(h) stack        | O(h) explicit stack    | O(1)           |
| Postorder | O(n) | O(h) stack        | O(h) explicit stack    | O(1)           |
| Level-order | O(n) | N/A             | O(w) queue             | N/A            |

Where n is the number of nodes, h is the height of the tree (O(log n) for balanced, O(n) for skewed), and w is the maximum width of the tree (up to n/2 for the last level of a complete tree).

## When to Use

- **Inorder:** Retrieving BST elements in sorted order; in-place BST validation; expression tree evaluation (infix).
- **Preorder:** Serialization/deserialization of trees; creating a copy of the tree; generating prefix expressions.
- **Postorder:** Safely deleting/freeing all nodes (children before parent); computing subtree aggregates (sizes, heights); generating postfix expressions.
- **Level-order:** Shortest path in unweighted tree; printing tree by levels; finding the minimum depth; connecting nodes at the same level.

## When NOT to Use

- **When only a subset of nodes is needed:** If you need to find a specific node, use targeted search (BST search, DFS with pruning) instead of a full traversal.
- **Very deep trees (recursive):** Recursive traversals may cause stack overflow on trees with height > ~10,000. Use iterative versions or Morris traversal.
- **Level-order on very wide trees:** The queue can grow to O(n/2) for the last level of a complete tree. If memory is constrained, use DFS-based traversals.
- **Graph traversal:** Tree traversals assume a tree structure (no cycles). For general graphs, use BFS/DFS with visited tracking.

## Comparison

| Feature | Inorder | Preorder | Postorder | Level-order |
|---------|---------|----------|-----------|-------------|
| Visit order | Left, Root, Right | Root, Left, Right | Left, Right, Root | Level by level |
| BST sorted output | Yes | No | No | No |
| Serialization | With structure info | Natural | With structure info | Natural (for complete trees) |
| Stack-based (iterative) | Yes | Yes | Yes (2 stacks or flag) | No (uses queue) |
| Morris (O(1) space) | Yes | Yes | Yes (complex) | Not applicable |
| Tree reconstruction | Needs preorder or postorder pair | With inorder gives unique tree | With inorder gives unique tree | Alone for complete trees |
| Expression notation | Infix | Prefix (Polish) | Postfix (RPN) | N/A |

## References

- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms*, 3rd ed. Addison-Wesley. Section 2.3.1: Traversing Binary Trees.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Section 12.1: What is a binary search tree?
- Morris, J. H. (1979). "Traversing binary trees simply and cheaply." *Information Processing Letters*, 9(5), 197-200.
- Sedgewick, R.; Wayne, K. (2011). *Algorithms*, 4th ed. Addison-Wesley. Section 3.2.

## Implementations

| Language   | File |
|------------|------|
| Python     | [tree_traversals.py](python/tree_traversals.py) |
| Java       | [TreeTraversals.java](java/TreeTraversals.java) |
| C++        | [tree_traversals.cpp](cpp/tree_traversals.cpp) |
| C          | [tree_traversals.c](c/tree_traversals.c) |
| Go         | [tree_traversals.go](go/tree_traversals.go) |
| TypeScript | [treeTraversals.ts](typescript/treeTraversals.ts) |
| Rust       | [tree_traversals.rs](rust/tree_traversals.rs) |
| Kotlin     | [TreeTraversals.kt](kotlin/TreeTraversals.kt) |
| Swift      | [TreeTraversals.swift](swift/TreeTraversals.swift) |
| Scala      | [TreeTraversals.scala](scala/TreeTraversals.scala) |
| C#         | [TreeTraversals.cs](csharp/TreeTraversals.cs) |
