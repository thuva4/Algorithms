# B-Tree

## Overview

A B-Tree is a self-balancing search tree designed for systems that read and write large blocks of data, such as databases and file systems. Unlike binary search trees, each node in a B-Tree can contain multiple keys and have multiple children, keeping the tree balanced and minimizing disk I/O operations. Introduced by Rudolf Bayer and Edward McCreight in 1972, the B-Tree guarantees that all leaves are at the same depth, ensuring worst-case O(log n) performance for all operations.

## How It Works

A B-Tree of order `t` (minimum degree) maintains these properties:
1. Every node has at most `2t - 1` keys and `2t` children.
2. Every non-root node has at least `t - 1` keys.
3. The root has at least 1 key (if non-empty).
4. All leaves appear at the same level.
5. Keys within each node are sorted in ascending order.

When inserting a key, if a node is full (has `2t - 1` keys), it is split into two nodes and the median key is promoted to the parent. This split may propagate up to the root, which is how the tree grows in height.

When deleting a key, if removing it would cause a node to have fewer than `t - 1` keys, the tree borrows a key from a sibling or merges with a sibling.

## Example

B-Tree of minimum degree `t = 2` (a 2-3-4 tree: each node has 1-3 keys, 2-4 children).

Insert sequence: `[10, 20, 5, 6, 12, 30, 7, 17]`

```
Insert 10:          [10]
Insert 20:          [10, 20]
Insert 5:           [5, 10, 20]
Insert 6:           Node full, split at median 10:
                        [10]
                       /    \
                   [5, 6]  [20]
Insert 12:              [10]
                       /    \
                   [5, 6]  [12, 20]
Insert 30:              [10]
                       /    \
                   [5, 6]  [12, 20, 30]
Insert 7:           Left child full, split at 6:
                        [6, 10]
                      /   |    \
                   [5]  [7]  [12, 20, 30]
Insert 17:          Right child full, split at 20:
                        [6, 10, 20]
                      /   |    |    \
                   [5]  [7]  [12, 17] [30]
```

## Pseudocode

```
function SEARCH(node, key):
    i = 0
    while i < node.n and key > node.keys[i]:
        i = i + 1
    if i < node.n and key == node.keys[i]:
        return (node, i)
    if node.is_leaf:
        return NULL
    return SEARCH(node.children[i], key)

function INSERT(tree, key):
    root = tree.root
    if root.n == 2t - 1:           // root is full
        new_root = allocate_node()
        new_root.children[0] = root
        SPLIT_CHILD(new_root, 0)
        tree.root = new_root
    INSERT_NONFULL(tree.root, key)

function INSERT_NONFULL(node, key):
    i = node.n - 1
    if node.is_leaf:
        // shift keys right and insert
        while i >= 0 and key < node.keys[i]:
            node.keys[i+1] = node.keys[i]
            i = i - 1
        node.keys[i+1] = key
        node.n = node.n + 1
    else:
        while i >= 0 and key < node.keys[i]:
            i = i - 1
        i = i + 1
        if node.children[i].n == 2t - 1:
            SPLIT_CHILD(node, i)
            if key > node.keys[i]:
                i = i + 1
        INSERT_NONFULL(node.children[i], key)

function SPLIT_CHILD(parent, i):
    full_child = parent.children[i]
    new_child = allocate_node()
    // Move upper t-1 keys to new_child
    // Promote median key to parent
    // Adjust children pointers
```

## Complexity Analysis

| Operation | Time     | Disk I/O   | Space |
|-----------|----------|------------|-------|
| Search    | O(log n) | O(log_t n) | O(n)  |
| Insert    | O(t log_t n) | O(log_t n) | O(n) |
| Delete    | O(t log_t n) | O(log_t n) | O(n) |
| Build (n keys) | O(n t log_t n) | O(n log_t n) | O(n) |

The base of the logarithm is t (the minimum degree), so the height is O(log_t n). For large t values (e.g., t = 1000), the tree is very shallow, minimizing disk seeks.

## When to Use

- **Database indexing:** MySQL (InnoDB), PostgreSQL, SQLite all use B-Trees or B+ Trees.
- **File systems:** NTFS, HFS+, ext4, Btrfs use B-Tree variants for directory indexing and metadata.
- **Key-value stores:** Systems like BerkeleyDB, LMDB, and LevelDB.
- **Any disk-based ordered data:** When data does not fit in memory and sequential disk access is important.
- **Range queries on disk:** B-Trees naturally support ordered iteration and range scans.

## When NOT to Use

- **Small in-memory datasets:** A simple balanced BST (AVL, Red-Black) or even a sorted array is more efficient due to lower constant factors and no node-splitting overhead.
- **Hash-based lookups:** If you only need exact-match queries (no range queries), a hash table provides O(1) average time.
- **Mostly-read workloads with fixed data:** A static sorted array with binary search is simpler and has better cache behavior.
- **High-dimensional data:** For multi-dimensional queries, use KD-Trees, R-Trees, or other spatial indices.

## Comparison

| Feature | B-Tree | B+ Tree | Red-Black Tree | Hash Table |
|---------|--------|---------|---------------|------------|
| Disk I/O per search | O(log_t n) | O(log_t n) | O(log2 n) | O(1) amortized |
| Range queries | Good | Excellent (linked leaves) | Good | Poor |
| Node fanout | High (2t) | High (2t) | 2 | N/A |
| All data in leaves | No | Yes | No | N/A |
| Sequential scan | Moderate | Excellent | Poor | Poor |
| Space utilization | >= 50% | >= 50% | 100% | Load factor dependent |
| Cache friendliness | Good (for disk) | Good (for disk) | Poor | Moderate |

## References

- Bayer, R.; McCreight, E. (1972). "Organization and maintenance of large ordered indexes." *Acta Informatica*, 1(3), 173-189.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Chapter 18: B-Trees.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching*, 2nd ed. Addison-Wesley. Section 6.2.4.
- Graefe, G. (2011). "Modern B-tree techniques." *Foundations and Trends in Databases*, 3(4), 203-402.

## Implementations

| Language   | File |
|------------|------|
| Python     | [b_tree.py](python/b_tree.py) |
| Java       | [BTree.java](java/BTree.java) |
| C++        | [b_tree.cpp](cpp/b_tree.cpp) |
| C          | [b_tree.c](c/b_tree.c) |
| Go         | [b_tree.go](go/b_tree.go) |
| TypeScript | [bTree.ts](typescript/bTree.ts) |
| Rust       | [b_tree.rs](rust/b_tree.rs) |
| Kotlin     | [BTree.kt](kotlin/BTree.kt) |
| Swift      | [BTree.swift](swift/BTree.swift) |
| Scala      | [BTree.scala](scala/BTree.scala) |
| C#         | [BTree.cs](csharp/BTree.cs) |
