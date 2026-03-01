# Binary Heap

## Overview

A Binary Heap is a complete binary tree stored in an array that satisfies the heap property: in a min-heap, every parent node is less than or equal to its children; in a max-heap, every parent is greater than or equal to its children. This array-based representation is compact and cache-friendly, making it the most practical implementation of a priority queue.

Binary heaps support efficient insertion and extraction of the minimum (or maximum) element. This implementation builds a min-heap from an array of integers and extracts all elements in sorted order, effectively performing heap sort.

## How It Works

1. **Array Representation**: A complete binary tree is stored in a flat array where for element at index i:
   - Parent: floor((i - 1) / 2)
   - Left child: 2i + 1
   - Right child: 2i + 2

2. **Sift Up (for insertion)**: After placing a new element at the end of the array, compare it with its parent and swap upward until the heap property is restored.

3. **Sift Down (for extract-min)**: After removing the root (minimum), move the last element to the root and swap it downward with its smaller child until the heap property is restored.

4. **Build Heap**: Start from the last non-leaf node and sift down each node. This bottom-up approach runs in O(n), which is faster than inserting elements one by one (O(n log n)).

## Worked Example

Build a min-heap from `[4, 1, 3, 2, 5]`:

**Step 1 -- Initial array layout as a tree:**
```
        4
       / \
      1    3
     / \
    2    5
```

**Step 2 -- Build heap (bottom-up sift-down):**

Process index 1 (value 1): children are 2 and 5. 1 < 2, heap property satisfied.
Process index 0 (value 4): children are 1 and 3. Swap 4 and 1.
```
        1
       / \
      4    3
     / \
    2    5
```
Now sift down 4 at index 1: children are 2 and 5. Swap 4 and 2.
```
        1
       / \
      2    3
     / \
    4    5
```
Array: `[1, 2, 3, 4, 5]`

**Step 3 -- Extract elements:**
- Extract 1 (swap with last, sift down): yields 1, heap becomes [2, 4, 3, 5]
- Extract 2: yields 2, heap becomes [3, 4, 5]
- Extract 3: yields 3, heap becomes [4, 5]
- Extract 4: yields 4, heap becomes [5]
- Extract 5: yields 5

Result: `[1, 2, 3, 4, 5]`

## Pseudocode

```
function buildMinHeap(arr, n):
    for i = (n / 2) - 1 downto 0:
        siftDown(arr, i, n)

function siftDown(arr, i, n):
    smallest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] < arr[smallest]:
        smallest = left
    if right < n and arr[right] < arr[smallest]:
        smallest = right

    if smallest != i:
        swap(arr[i], arr[smallest])
        siftDown(arr, smallest, n)

function siftUp(arr, i):
    while i > 0:
        parent = (i - 1) / 2
        if arr[i] < arr[parent]:
            swap(arr[i], arr[parent])
            i = parent
        else:
            break

function extractMin(arr, n):
    min = arr[0]
    arr[0] = arr[n - 1]
    siftDown(arr, 0, n - 1)
    return min
```

## Complexity Analysis

| Operation   | Time       | Space |
|-------------|------------|-------|
| Build Heap  | O(n)       | O(n)  |
| Insert      | O(log n)   | O(1)  |
| Extract-Min | O(log n)   | O(1)  |
| Peek-Min    | O(1)       | O(1)  |
| Heap Sort   | O(n log n) | O(1)  |

**Why these complexities?**

- **Build Heap -- O(n):** Although sift-down is O(log n), most nodes are near the bottom of the tree and need very few swaps. The sum over all levels is: n/4 * 1 + n/8 * 2 + n/16 * 3 + ... = O(n), by the convergence of the geometric series.

- **Insert -- O(log n):** Sift-up traverses from a leaf to the root, a path of length at most log(n) in a complete binary tree.

- **Extract-Min -- O(log n):** Sift-down traverses from the root to a leaf, at most log(n) levels.

- **Space -- O(n):** The heap is stored in a flat array with no additional pointers. This is one of the most space-efficient tree representations.

## Applications

- **Priority queues**: The standard implementation of a priority queue in most standard libraries (e.g., Python's `heapq`, Java's `PriorityQueue`, C++'s `priority_queue`).
- **Heap sort**: Extract all elements to produce a sorted array in O(n log n) time and O(1) extra space.
- **Finding k smallest/largest elements**: Extract k elements from a heap of size n in O(n + k log n) time.
- **Median maintenance**: Use two heaps (a max-heap for the lower half and a min-heap for the upper half) to maintain the running median in O(log n) per insertion.
- **Dijkstra's algorithm**: Binary heaps are the standard priority queue for Dijkstra's in practice, giving O((V + E) log V) time.

## When NOT to Use

- **When O(1) decrease-key is needed**: Binary heaps require O(log n) for decrease-key. If your algorithm calls decrease-key frequently (e.g., dense graph Dijkstra's), consider a Fibonacci heap for better asymptotic performance.
- **When merge operations are needed**: Merging two binary heaps takes O(n) time. If you need efficient merge, use a binomial or Fibonacci heap (O(log n) or O(1)).
- **When sorted traversal is needed**: A binary heap is not sorted; in-order traversal does not yield sorted output. Use a balanced BST if sorted iteration is required.
- **When all elements need to be accessed**: A binary heap only efficiently accesses the min (or max). Searching for an arbitrary element is O(n).

## Comparison with Similar Structures

| Structure      | Insert     | Extract-Min | Decrease-Key | Merge  | Space  |
|---------------|-----------|-------------|-------------|--------|--------|
| Binary Heap    | O(log n)  | O(log n)    | O(log n)    | O(n)   | O(n)   |
| Fibonacci Heap | O(1)*     | O(log n)*   | O(1)*       | O(1)*  | O(n)   |
| Binomial Heap  | O(1)*     | O(log n)    | O(log n)    | O(log n)| O(n)  |
| Sorted Array   | O(n)      | O(1)        | O(n)        | O(n)   | O(n)   |
| Unsorted Array | O(1)      | O(n)        | O(1)        | O(1)   | O(n)   |

\* = amortized

## Implementations

| Language   | File |
|------------|------|
| Python     | [heap_operations.py](python/heap_operations.py) |
| Java       | [HeapOperations.java](java/HeapOperations.java) |
| C++        | [heap_operations.cpp](cpp/heap_operations.cpp) |
| C          | [heap_operations.c](c/heap_operations.c) |
| Go         | [heap_operations.go](go/heap_operations.go) |
| TypeScript | [heapOperations.ts](typescript/heapOperations.ts) |
| Rust       | [heap_operations.rs](rust/heap_operations.rs) |
| Kotlin     | [HeapOperations.kt](kotlin/HeapOperations.kt) |
| Swift      | [HeapOperations.swift](swift/HeapOperations.swift) |
| Scala      | [HeapOperations.scala](scala/HeapOperations.scala) |
| C#         | [HeapOperations.cs](csharp/HeapOperations.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 6: Heapsort.
- Williams, J. W. J. (1964). Algorithm 232: Heapsort. *Communications of the ACM*, 7(6), 347-348.
- Floyd, R. W. (1964). Algorithm 245: Treesort. *Communications of the ACM*, 7(12), 701.
- [Binary Heap -- Wikipedia](https://en.wikipedia.org/wiki/Binary_heap)
