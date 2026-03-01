# Fibonacci Heap

## Overview

A Fibonacci Heap is a heap data structure consisting of a collection of heap-ordered trees. It supports amortized O(1) time for insert, find-min, decrease-key, and merge operations, and O(log n) amortized time for extract-min and delete. It was invented by Michael L. Fredman and Robert E. Tarjan in 1984 and is named after the Fibonacci numbers, which appear in the analysis of its structure.

Fibonacci heaps are theoretically optimal for graph algorithms that perform many decrease-key operations, such as Dijkstra's shortest path algorithm and Prim's minimum spanning tree algorithm. They achieve the best known asymptotic running times for these algorithms: O(E + V log V) for Dijkstra's and Prim's, compared to O(E log V) with binary heaps.

## How It Works

1. **Structure**: The heap is a collection of min-heap-ordered trees stored in a circular doubly-linked root list. A pointer to the minimum root is maintained. Each node stores its key, degree (number of children), a mark bit (used for cascading cuts), and pointers to its parent, one child, and siblings.

2. **Insert**: Create a new single-node tree and add it to the root list. Update the min pointer if the new key is smaller. This is O(1).

3. **Find-Min**: Return the node pointed to by the min pointer. O(1).

4. **Extract-Min**: Remove the minimum node, promote all its children to the root list, and then **consolidate**: merge trees of the same degree (number of children) until all roots have distinct degrees. Consolidation uses an auxiliary array indexed by degree, linking trees of the same degree by making the larger root a child of the smaller. The maximum degree is O(log n), bounded by the golden ratio through the Fibonacci sequence -- hence the name.

5. **Decrease-Key**: Decrease the key of a node. If the heap property is violated, cut the node from its parent and add it to the root list. If the parent was already marked (had already lost a child), perform a cascading cut: cut the parent as well, and continue up the tree. Mark any newly parentless node.

6. **Merge (Union)**: Concatenate the two root lists and update the min pointer. O(1).

### Simplified Version

This implementation processes an array of integer-encoded operations:
- Positive value: insert that value into the heap
- Zero (0): perform extract-min and record the result

The output is the list of values returned by extract-min operations in order.

## Worked Example

Operations: Insert 7, Insert 3, Insert 11, Insert 5, Extract-Min, Insert 2, Extract-Min.

**After insertions** (7, 3, 11, 5): Root list contains four single-node trees.
```
Root list: 7 <-> 3 <-> 11 <-> 5     min -> 3
```

**Extract-Min** (remove 3): Promote 3's children (none). Consolidate:
- Roots: 7 (degree 0), 11 (degree 0), 5 (degree 0)
- Merge 7 and 11 (same degree 0): 7 < 11, so 11 becomes child of 7. Now 7 has degree 1.
- Roots: 7 (degree 1), 5 (degree 0). All degrees distinct. Done.
```
Root list: 7 <-> 5     (7 has child 11)     min -> 5
```
Output so far: [3]

**Insert 2**: Add to root list.
```
Root list: 7 <-> 5 <-> 2     min -> 2
```

**Extract-Min** (remove 2): Promote 2's children (none). Consolidate:
- Roots: 7 (degree 1), 5 (degree 0)
- Merge 5 into 7? No, different degrees. All distinct. Done.
```
Root list: 7 <-> 5     (7 has child 11)     min -> 5
```
Output: [3, 2]

## Pseudocode

```
class FibonacciHeap:
    min = null
    n = 0              // total number of nodes

    insert(key):
        node = new Node(key)
        add node to root list
        if min == null or key < min.key:
            min = node
        n = n + 1

    findMin():
        return min.key

    extractMin():
        z = min
        if z != null:
            // Promote all children of z to root list
            for each child c of z:
                add c to root list
                c.parent = null
            remove z from root list
            if z == z.right:   // was the only node
                min = null
            else:
                min = z.right
                consolidate()
            n = n - 1
        return z.key

    consolidate():
        A = array of size (floor(log_phi(n)) + 1), all null
        for each node w in root list:
            x = w
            d = x.degree
            while A[d] != null:
                y = A[d]
                if x.key > y.key:
                    swap(x, y)
                link(y, x)       // make y a child of x
                A[d] = null
                d = d + 1
            A[d] = x
        // Rebuild root list from A
        min = null
        for each non-null entry in A:
            add entry to root list
            if min == null or entry.key < min.key:
                min = entry

    link(y, x):
        remove y from root list
        make y a child of x
        x.degree = x.degree + 1
        y.mark = false
```

## Complexity Analysis

| Operation    | Amortized Time | Worst-Case Time |
|-------------|---------------|----------------|
| Insert       | O(1)          | O(1)           |
| Find-Min     | O(1)          | O(1)           |
| Extract-Min  | O(log n)      | O(n)           |
| Decrease-Key | O(1)          | O(log n)       |
| Merge        | O(1)          | O(1)           |
| Delete       | O(log n)      | O(n)           |

**Why these complexities?**

- **Insert -- O(1):** Simply adds a node to the root list and updates the min pointer. No structural changes to existing trees.

- **Extract-Min -- O(log n) amortized:** The consolidation step may process many trees, but the amortized analysis using a potential function (number of trees in the root list) shows that the total work across a sequence of operations is bounded. After consolidation, at most O(log n) trees remain because the maximum degree of any node is O(log n), bounded by log_phi(n) where phi is the golden ratio (1.618...). The Fibonacci number connection: a subtree rooted at a node of degree k contains at least F(k+2) nodes, where F is the Fibonacci sequence.

- **Decrease-Key -- O(1) amortized:** The cascading cut mechanism ensures that the number of cuts is bounded amortized. The mark bits track which nodes have already lost a child, limiting the cascade depth.

- **Space -- O(n):** Each node stores a constant number of pointers and fields. The total storage is proportional to the number of elements.

## Applications

- **Dijkstra's shortest path algorithm**: With a Fibonacci heap, Dijkstra's runs in O(E + V log V), improving on O(E log V) with a binary heap. The advantage comes from O(1) amortized decrease-key operations, since Dijkstra's may call decrease-key up to E times.
- **Prim's minimum spanning tree**: Similarly benefits from O(1) decrease-key, achieving O(E + V log V) time.
- **Network optimization**: Fibonacci heaps speed up any algorithm that uses a priority queue with frequent decrease-key operations, including network flow algorithms and A* search on dense graphs.

## When NOT to Use

- **In practice for small to moderate inputs**: Fibonacci heaps have large constant factors due to pointer-heavy node structures, high memory overhead, and poor cache locality. For most practical inputs, a binary heap or pairing heap is faster despite worse asymptotic bounds.
- **When decrease-key is rare**: If the algorithm primarily uses insert and extract-min (e.g., heap sort), a binary heap is simpler and faster. The advantage of Fibonacci heaps is specifically in the O(1) decrease-key.
- **When simplicity matters**: Fibonacci heaps are notoriously complex to implement correctly. A pairing heap offers similar practical performance with a much simpler implementation.
- **Memory-constrained environments**: Each node requires pointers to parent, child, left sibling, right sibling, plus degree and mark fields. This is significantly more overhead than a binary heap stored in a flat array.

## Comparison with Similar Structures

| Structure       | Insert | Extract-Min | Decrease-Key | Merge  | Practical? |
|----------------|--------|-------------|-------------|--------|-----------|
| Fibonacci Heap  | O(1)*  | O(log n)*   | O(1)*       | O(1)*  | No        |
| Binary Heap     | O(log n)| O(log n)   | O(log n)    | O(n)   | Yes       |
| Pairing Heap    | O(1)*  | O(log n)*   | O(log n)*   | O(1)*  | Yes       |
| Binomial Heap   | O(1)*  | O(log n)    | O(log n)    | O(log n)| Moderate |
| d-ary Heap      | O(log_d n)| O(d log_d n)| O(log_d n)| O(n)   | Yes       |

\* = amortized

## Implementations

| Language   | File |
|------------|------|
| Python     | [fibonacci_heap.py](python/fibonacci_heap.py) |
| Java       | [FibonacciHeap.java](java/FibonacciHeap.java) |
| C++        | [fibonacci_heap.cpp](cpp/fibonacci_heap.cpp) |
| C          | [fibonacci_heap.c](c/fibonacci_heap.c) |
| Go         | [fibonacci_heap.go](go/fibonacci_heap.go) |
| TypeScript | [fibonacciHeap.ts](typescript/fibonacciHeap.ts) |
| Rust       | [fibonacci_heap.rs](rust/fibonacci_heap.rs) |
| Kotlin     | [FibonacciHeap.kt](kotlin/FibonacciHeap.kt) |
| Swift      | [FibonacciHeap.swift](swift/FibonacciHeap.swift) |
| Scala      | [FibonacciHeap.scala](scala/FibonacciHeap.scala) |
| C#         | [FibonacciHeap.cs](csharp/FibonacciHeap.cs) |

## References

- Fredman, M. L., & Tarjan, R. E. (1987). Fibonacci heaps and their uses in improved network optimization algorithms. *Journal of the ACM*, 34(3), 596-615.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 19: Fibonacci Heaps.
- Fredman, M. L., & Tarjan, R. E. (1984). Fibonacci heaps and their uses in improved network optimization algorithms. *25th Annual Symposium on Foundations of Computer Science (FOCS)*, 338-346.
- [Fibonacci Heap -- Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_heap)
