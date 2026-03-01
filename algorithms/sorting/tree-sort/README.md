# Tree Sort

## Overview

Tree Sort is a sorting algorithm that builds a Binary Search Tree (BST) from the elements, then performs an in-order traversal to extract the sorted sequence. The algorithm leverages the BST property that in-order traversal visits nodes in ascending order. When a self-balancing BST (such as an AVL tree or Red-Black tree) is used, Tree Sort guarantees O(n log n) worst-case performance. With a plain BST, the worst case degrades to O(n^2) on already-sorted input.

Tree Sort is conceptually elegant and naturally produces a sorted data structure that supports efficient insertion, deletion, and search operations, making it useful when the data needs to remain sorted after the initial sort.

## How It Works

1. **Create an empty BST.**
2. **Insert each element** of the input array into the BST. For each element:
   - Start at the root.
   - If the element is less than the current node, go left; otherwise, go right.
   - Insert at the first empty position found.
3. **Perform an in-order traversal** of the BST (left subtree, root, right subtree).
4. The in-order traversal produces the elements in sorted order.

## Example

Given input: `[5, 3, 7, 1, 4, 6, 8]`

**Step 1 -- Build BST (insert elements one by one):**

```
Insert 5:       5

Insert 3:       5
               /
              3

Insert 7:       5
               / \
              3   7

Insert 1:       5
               / \
              3   7
             /
            1

Insert 4:       5
               / \
              3   7
             / \
            1   4

Insert 6:       5
               / \
              3   7
             / \ /
            1  4 6

Insert 8:       5
               / \
              3   7
             / \ / \
            1  4 6  8
```

**Step 2 -- In-order traversal:** Visit left, root, right at each node.

```
1 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8
```

Result: `[1, 3, 4, 5, 6, 7, 8]`

## Pseudocode

```
function treeSort(array):
    root = null

    // Build BST
    for each element in array:
        root = insert(root, element)

    // In-order traversal
    result = []
    inOrderTraversal(root, result)
    return result

function insert(node, value):
    if node is null:
        return new Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node

function inOrderTraversal(node, result):
    if node is null:
        return
    inOrderTraversal(node.left, result)
    result.append(node.value)
    inOrderTraversal(node.right, result)
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n^2)     | O(n)  |

**Why these complexities?**

- **Best/Average Case -- O(n log n):** When elements are inserted in a random order, the BST is approximately balanced with height O(log n). Each of the n insertions takes O(log n) time, giving O(n log n) for the build phase. The in-order traversal is always O(n).

- **Worst Case -- O(n^2):** When the input is already sorted (ascending or descending), each insertion goes to the rightmost (or leftmost) leaf, creating a degenerate BST of height n. Each insertion then takes O(n) time, giving O(n^2) total. Using a self-balancing BST eliminates this worst case.

- **Space -- O(n):** Each of the n elements requires a tree node, and each node stores the value plus left and right pointers. The in-order traversal also uses O(h) stack space for recursion, where h is the tree height.

## When to Use

- **When the sorted data structure is needed after sorting:** If you need to perform subsequent insertions, deletions, or searches on the sorted data, the BST remains useful after the initial sort.
- **Online sorting:** Elements can be inserted into the BST as they arrive, and the sorted order can be read out at any time via in-order traversal.
- **When using self-balancing trees:** With an AVL or Red-Black tree, Tree Sort guarantees O(n log n) worst-case time and is a viable general-purpose sort.
- **Educational purposes:** Demonstrates the connection between binary search trees and sorting.

## When NOT to Use

- **Already-sorted or nearly-sorted data (with plain BST):** Creates a degenerate tree with O(n^2) performance. If you must use Tree Sort on such data, use a self-balancing BST.
- **Memory-constrained environments:** Each element requires a tree node with two pointers, using significantly more memory than in-place sorting algorithms (roughly 3x the memory of the raw data).
- **Cache-sensitive applications:** Tree nodes are typically allocated individually on the heap, resulting in poor cache locality compared to array-based algorithms like quicksort or merge sort.
- **When a simpler algorithm suffices:** For one-time sorting of an array, merge sort or quicksort achieve the same O(n log n) time with better constant factors and cache performance.

## Comparison

| Algorithm    | Time (avg)  | Time (worst) | Space  | Stable | In-Place | Notes |
|--------------|------------|-------------|--------|--------|----------|-------|
| Tree Sort    | O(n log n) | O(n^2)*     | O(n)   | Depends| No       | *O(n log n) with balanced BST |
| Merge Sort   | O(n log n) | O(n log n)  | O(n)   | Yes    | No       | Guaranteed performance |
| Quick Sort   | O(n log n) | O(n^2)      | O(log n)| No    | Yes      | Best cache locality |
| Heap Sort    | O(n log n) | O(n log n)  | O(1)   | No     | Yes      | Guaranteed; poor cache |
| AVL Tree Sort| O(n log n) | O(n log n)  | O(n)   | No     | No       | Balanced tree eliminates worst case |

## Implementations

| Language   | File |
|------------|------|
| Python     | [tree_sort.py](python/tree_sort.py) |
| Java       | [TreeSort.java](java/TreeSort.java) |
| C++        | [tree_sort.cpp](cpp/tree_sort.cpp) |
| C          | [tree_sort.c](c/tree_sort.c) |
| Go         | [tree_sort.go](go/tree_sort.go) |
| TypeScript | [treeSort.ts](typescript/treeSort.ts) |
| Rust       | [tree_sort.rs](rust/tree_sort.rs) |
| Kotlin     | [TreeSort.kt](kotlin/TreeSort.kt) |
| Swift      | [TreeSort.swift](swift/TreeSort.swift) |
| Scala      | [TreeSort.scala](scala/TreeSort.scala) |
| C#         | [TreeSort.cs](csharp/TreeSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 12: Binary Search Trees.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.2.2: Binary Tree Searching.
- [Tree Sort -- Wikipedia](https://en.wikipedia.org/wiki/Tree_sort)
