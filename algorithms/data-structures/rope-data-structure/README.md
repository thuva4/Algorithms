# Rope Data Structure

## Overview

A Rope is a binary tree used to efficiently store and manipulate long sequences (strings or arrays). Each leaf holds a short segment of the sequence, and each internal node stores the total length of its left subtree (called the "weight"). Ropes allow O(log n) concatenation, indexing, and split operations, making them far superior to plain arrays for large-scale text editing where insertions, deletions, and concatenations are frequent.

While a flat array requires O(n) time to insert or delete in the middle, a balanced rope can perform these operations in O(log n) time by splitting and re-concatenating subtrees.

## How It Works

1. **Leaf nodes** store a contiguous array segment (typically up to some maximum leaf size, e.g., 8-64 characters).
2. **Internal nodes** store a `weight` equal to the total size of the left subtree. They do not store actual data.
3. **Concatenation** creates a new root node with the two ropes as its left and right children. The new root's weight is the total length of the left rope. This is O(1) or O(log n) if rebalancing is performed.
4. **Index lookup** at position `i`: start at the root. If `i < weight`, recurse into the left child. Otherwise, recurse into the right child with index `i - weight`. Continue until reaching a leaf, then index directly into the leaf's array.
5. **Split** at position `i` divides the rope into two ropes: one containing elements [0, i) and the other containing [i, n). This is done by walking down the tree, splitting at most one leaf node, and creating new internal nodes as needed.
6. **Insert** at position `i`: Split the rope at `i`, then concatenate: `left + new_segment + right`.
7. **Delete** range [i, j): Split at `i` and `j`, discard the middle rope, concatenate left and right.

### Input/Output Format

- Input: [n1, arr1..., n2, arr2..., query_index] -- two arrays to concatenate, then query an index.
- Output: element at the given index after concatenation.

## Example

**Building a rope from two arrays and querying an index:**

```
Array 1: [10, 20, 30]    (n1 = 3)
Array 2: [40, 50]        (n2 = 2)

Input: [3, 10, 20, 30, 2, 40, 50, 3]

Step 1: Build Rope for Array 1
        [weight=3]
        /
    [10, 20, 30]

Step 2: Build Rope for Array 2
        [weight=2]
        /
    [40, 50]

Step 3: Concatenate
            [weight=3]         <- new root, weight = size of left subtree
           /          \
    [weight=3]      [weight=2]
       /               /
  [10,20,30]       [40,50]

Step 4: Query index 3
  At root: index 3 >= weight 3, go right with index 3 - 3 = 0
  At right child: index 0 < weight 2, go left with index 0
  At leaf [40, 50]: return element at position 0 = 40

Output: 40
```

**Demonstrating a split operation:**

```
Rope contents: [A, B, C, D, E, F]

Split at index 4:
  Left rope:  [A, B, C, D]
  Right rope: [E, F]

To insert "XY" at position 4:
  1. Split at 4 -> [A,B,C,D] and [E,F]
  2. Concatenate: [A,B,C,D] + [X,Y] + [E,F]
  Result: [A, B, C, D, X, Y, E, F]
```

## Pseudocode

```
class RopeNode:
    weight   // size of left subtree (for internal nodes)
    left     // left child
    right    // right child
    data[]   // leaf data (only for leaf nodes)

function index(node, i):
    if node is a leaf:
        return node.data[i]
    if i < node.weight:
        return index(node.left, i)
    else:
        return index(node.right, i - node.weight)

function concatenate(left, right):
    newRoot = new RopeNode()
    newRoot.left = left
    newRoot.right = right
    newRoot.weight = totalLength(left)
    return newRoot

function split(node, i):
    if node is a leaf:
        leftLeaf  = new Leaf(node.data[0..i-1])
        rightLeaf = new Leaf(node.data[i..end])
        return (leftLeaf, rightLeaf)
    if i < node.weight:
        (leftPart, rightPart) = split(node.left, i)
        return (leftPart, concatenate(rightPart, node.right))
    else if i > node.weight:
        (leftPart, rightPart) = split(node.right, i - node.weight)
        return (concatenate(node.left, leftPart), rightPart)
    else:   // i == node.weight
        return (node.left, node.right)

function insert(rope, i, newSegment):
    (left, right) = split(rope, i)
    return concatenate(concatenate(left, newSegment), right)
```

## Complexity Analysis

| Operation     | Time       | Space |
|---------------|-----------|-------|
| Index (access)| O(log n)  | O(n)  |
| Concatenation | O(1)*     | O(1)  |
| Split         | O(log n)  | O(log n) |
| Insert        | O(log n)  | O(log n) |
| Delete        | O(log n)  | O(log n) |
| Report (print all) | O(n) | O(n) |

\* O(1) without rebalancing; O(log n) with rebalancing.

- **Worst case** for all tree operations is O(n) if the rope becomes degenerate (a linked list). Balanced ropes (using B-tree style rebalancing or weight-balanced criteria) keep operations at O(log n).
- **Space**: O(n) for the data plus O(n) for internal nodes. In practice, the overhead is small because leaves store multiple characters.

## Applications

- **Text editors**: Ropes are used in editors like Xi Editor (by Google) and Visual Studio Code's text buffer. They handle frequent insertions, deletions, and cursor movements in large files efficiently.
- **Version control diff operations**: Rope-like structures help efficiently represent and merge text changes.
- **DNA sequence manipulation**: Bioinformatics operations on long genomic strings (insertions, deletions, substring extraction) benefit from rope-style structures.
- **Collaborative editing**: Operational transformation and CRDT-based editors use tree structures similar to ropes to represent shared documents.
- **Large file handling**: When files are too large to fit in a single contiguous buffer, ropes provide a natural way to represent them in pieces.

## When NOT to Use

- **Short strings or small arrays**: For sequences under a few hundred elements, a plain array is faster due to better cache locality and lower overhead. Rope node pointers and weight bookkeeping add constant-factor cost that outweighs the asymptotic benefit for small inputs.
- **Mostly read, rarely modified sequences**: If the sequence is built once and then only read sequentially, a flat array provides O(1) indexed access and superior cache performance. Ropes add O(log n) overhead per access.
- **When simplicity matters**: Ropes are significantly more complex to implement and debug than arrays. Unless the application specifically requires fast insertions/deletions in large sequences, the complexity is not justified.
- **Random access-heavy workloads**: If the dominant operation is random indexed reads with no modifications, arrays are strictly better.

## Comparison

| Operation       | Array     | Rope        | Gap Buffer  | Piece Table |
|-----------------|-----------|-------------|-------------|-------------|
| Index access    | O(1)      | O(log n)    | O(1)        | O(log n)    |
| Insert at pos   | O(n)      | O(log n)    | O(1)*       | O(log n)    |
| Delete at pos   | O(n)      | O(log n)    | O(1)*       | O(log n)    |
| Concatenation   | O(n)      | O(1)        | O(n)        | O(1)        |
| Split           | O(n)      | O(log n)    | O(n)        | O(log n)    |
| Cache locality  | Excellent | Poor        | Good        | Moderate    |

\* O(1) amortized when the gap is at the cursor position; O(n) when the gap must be moved.

**Rope vs. Gap Buffer**: Gap buffers are simpler and have better cache locality for sequential editing at a single cursor. Ropes are better when edits happen at many positions or when frequent concatenation/splitting is needed (e.g., multi-cursor editing).

**Rope vs. Piece Table**: Piece tables (used in VS Code) are similar in spirit to ropes but represent the document as a sequence of references to original and modification buffers. Both offer O(log n) editing, but piece tables are more memory-efficient for undo/redo since they never modify original text.

## References

- Boehm, H.-J., Atkinson, R., & Plass, M. (1995). "Ropes: an Alternative to Strings." *Software: Practice and Experience*, 25(12), 1315-1330.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Problem 14-1 discusses augmented trees for order-statistic operations.
- "Rope (data structure)." Wikipedia. https://en.wikipedia.org/wiki/Rope_(data_structure)

## Implementations

| Language   | File |
|------------|------|
| Python     | [rope_data_structure.py](python/rope_data_structure.py) |
| Java       | [RopeDataStructure.java](java/RopeDataStructure.java) |
| C++        | [rope_data_structure.cpp](cpp/rope_data_structure.cpp) |
| C          | [rope_data_structure.c](c/rope_data_structure.c) |
| Go         | [rope_data_structure.go](go/rope_data_structure.go) |
| TypeScript | [ropeDataStructure.ts](typescript/ropeDataStructure.ts) |
| Rust       | [rope_data_structure.rs](rust/rope_data_structure.rs) |
| Kotlin     | [RopeDataStructure.kt](kotlin/RopeDataStructure.kt) |
| Swift      | [RopeDataStructure.swift](swift/RopeDataStructure.swift) |
| Scala      | [RopeDataStructure.scala](scala/RopeDataStructure.scala) |
| C#         | [RopeDataStructure.cs](csharp/RopeDataStructure.cs) |
