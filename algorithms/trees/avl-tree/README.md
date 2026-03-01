# AVL Tree

## Overview

An AVL tree is a self-balancing binary search tree where the difference in heights between the left and right subtrees of any node (the balance factor) is at most 1. Named after its inventors Georgy Adelson-Velsky and Evgenii Landis (1962), it was the first self-balancing BST to be invented. After every insertion or deletion, the tree rebalances itself using rotations to maintain the height-balance property, guaranteeing O(log n) time for all dictionary operations in the worst case.

## How It Works

When inserting elements into an AVL tree, the algorithm performs a standard BST insertion and then checks the balance factor of each ancestor node. If any node becomes unbalanced (balance factor becomes -2 or +2), one of four rotation types is applied:

1. **Left-Left (LL):** Right rotation on the unbalanced node.
2. **Right-Right (RR):** Left rotation on the unbalanced node.
3. **Left-Right (LR):** Left rotation on the left child, then right rotation on the node.
4. **Right-Left (RL):** Right rotation on the right child, then left rotation on the node.

For deletion, the node is removed using standard BST deletion (replacing with the inorder successor or predecessor), and then the same rebalancing procedure is applied going up to the root.

## Example

Given input: `[5, 3, 7, 1, 4]`

- Insert 5: Tree = `5`
- Insert 3: Tree = `5(3, _)`
- Insert 7: Tree = `5(3, 7)` -- balanced
- Insert 1: Tree = `5(3(1, _), 7)` -- balanced
- Insert 4: Tree = `5(3(1, 4), 7)` -- balanced

Inorder traversal: `[1, 3, 4, 5, 7]`

For `[3, 2, 1]` (triggers LL rotation):

- Insert 3, then 2, then 1 causes LL imbalance at 3 (balance factor = +2).
- Right rotation produces: `2(1, 3)`
- Inorder: `[1, 2, 3]`

For `[10, 5, 15, 3, 7, 6]` (triggers LR rotation):

- After inserting `[10, 5, 15, 3, 7]`, the tree is balanced.
- Insert 6: node 5 has balance factor -2 (left child height 1, right child height 2). Left child 3 is right-heavy. This is an LR case at node 5.
- Left rotate on 3, then right rotate on 5 produces a subtree `5(3, 7(6, _))` under 10.

## Pseudocode

```
function INSERT(node, key):
    if node is NULL:
        return new Node(key)
    if key < node.key:
        node.left = INSERT(node.left, key)
    else if key > node.key:
        node.right = INSERT(node.right, key)
    else:
        return node  // duplicate

    node.height = 1 + max(HEIGHT(node.left), HEIGHT(node.right))
    balance = HEIGHT(node.left) - HEIGHT(node.right)

    // LL Case
    if balance > 1 and key < node.left.key:
        return RIGHT_ROTATE(node)
    // RR Case
    if balance < -1 and key > node.right.key:
        return LEFT_ROTATE(node)
    // LR Case
    if balance > 1 and key > node.left.key:
        node.left = LEFT_ROTATE(node.left)
        return RIGHT_ROTATE(node)
    // RL Case
    if balance < -1 and key < node.right.key:
        node.right = RIGHT_ROTATE(node.right)
        return LEFT_ROTATE(node)

    return node

function RIGHT_ROTATE(z):
    y = z.left
    T3 = y.right
    y.right = z
    z.left = T3
    z.height = 1 + max(HEIGHT(z.left), HEIGHT(z.right))
    y.height = 1 + max(HEIGHT(y.left), HEIGHT(y.right))
    return y

function DELETE(node, key):
    // Standard BST delete
    if node is NULL: return NULL
    if key < node.key:
        node.left = DELETE(node.left, key)
    else if key > node.key:
        node.right = DELETE(node.right, key)
    else:
        if node.left is NULL: return node.right
        if node.right is NULL: return node.left
        successor = MIN_NODE(node.right)
        node.key = successor.key
        node.right = DELETE(node.right, successor.key)

    node.height = 1 + max(HEIGHT(node.left), HEIGHT(node.right))
    balance = HEIGHT(node.left) - HEIGHT(node.right)

    // Rebalance (same 4 cases as insert)
    if balance > 1 and BALANCE(node.left) >= 0: return RIGHT_ROTATE(node)
    if balance > 1 and BALANCE(node.left) < 0:
        node.left = LEFT_ROTATE(node.left)
        return RIGHT_ROTATE(node)
    if balance < -1 and BALANCE(node.right) <= 0: return LEFT_ROTATE(node)
    if balance < -1 and BALANCE(node.right) > 0:
        node.right = RIGHT_ROTATE(node.right)
        return LEFT_ROTATE(node)

    return node
```

## Complexity Analysis

| Operation | Time       | Space |
|-----------|------------|-------|
| Search    | O(log n)   | O(1) iterative / O(log n) recursive |
| Insert    | O(log n)   | O(log n) for recursion stack |
| Delete    | O(log n)   | O(log n) for recursion stack |
| Build     | O(n log n) | O(n)  |
| Traversal | O(n)       | O(n)  |

The height of an AVL tree with n nodes is strictly bounded by 1.44 * log2(n), making it slightly more balanced than a Red-Black tree.

## When to Use

- Database indexing where frequent lookups and insertions are needed
- Memory management systems
- In-memory ordered dictionaries and sets
- Any application requiring guaranteed O(log n) search, insert, and delete in the worst case
- When lookup-heavy workloads justify slightly slower insertions (due to stricter balancing)

## When NOT to Use

- **Frequent insertions/deletions with few lookups:** Red-Black trees require fewer rotations on average per insertion/deletion (at most 2 rotations for insert, at most 3 for delete) compared to AVL trees (which may rotate up to O(log n) times on delete). Use a Red-Black tree instead.
- **Write-heavy concurrent workloads:** The strict balancing means more restructuring, which increases lock contention. Consider skip lists or concurrent hash maps.
- **When key ordering is not needed:** A hash table provides O(1) average-case lookups and insertions.
- **Disk-based storage:** B-Trees are far more efficient for external memory because they minimize disk I/O by having high branching factors.

## Comparison

| Feature | AVL Tree | Red-Black Tree | Splay Tree | Skip List |
|---------|----------|---------------|------------|-----------|
| Search (worst) | O(log n) | O(log n) | O(n) amortized O(log n) | O(n) expected O(log n) |
| Insert (worst) | O(log n) | O(log n) | O(n) amortized O(log n) | O(n) expected O(log n) |
| Max rotations (insert) | O(log n) | 2 | O(log n) amortized | N/A |
| Max rotations (delete) | O(log n) | 3 | O(log n) amortized | N/A |
| Height bound | 1.44 log n | 2 log n | unbounded | expected O(log n) |
| Implementation difficulty | Moderate | Hard | Easy | Easy |
| Best for | Lookup-heavy | Insert/delete-heavy | Temporal locality | Concurrent access |

## References

- Adelson-Velsky, G. M.; Landis, E. M. (1962). "An algorithm for the organization of information." *Doklady Akademii Nauk SSSR*, 146(2), 263-266.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching*, 2nd ed. Addison-Wesley. Section 6.2.3.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Problem 13-3.
- Sedgewick, R.; Wayne, K. (2011). *Algorithms*, 4th ed. Addison-Wesley.

## Implementations

| Language   | File |
|------------|------|
| Python     | [avl_tree.py](python/avl_tree.py) |
| Java       | [AvlTree.java](java/AvlTree.java) |
| C++        | [avl_tree.cpp](cpp/avl_tree.cpp) |
| C          | [avl_tree.c](c/avl_tree.c) |
| Go         | [avl_tree.go](go/avl_tree.go) |
| TypeScript | [avlTree.ts](typescript/avlTree.ts) |
| Rust       | [avl_tree.rs](rust/avl_tree.rs) |
| Kotlin     | [AvlTree.kt](kotlin/AvlTree.kt) |
| Swift      | [AvlTree.swift](swift/AvlTree.swift) |
| Scala      | [AvlTree.scala](scala/AvlTree.scala) |
| C#         | [AvlTree.cs](csharp/AvlTree.cs) |
