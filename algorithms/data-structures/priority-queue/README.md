# Priority Queue

## Overview

A Priority Queue is an abstract data type where each element has an associated priority. Elements with higher priority (lower value in a min-priority queue, or higher value in a max-priority queue) are served before elements with lower priority. Unlike a regular queue that follows FIFO ordering, a priority queue dequeues the element with the best priority regardless of insertion order.

The most common implementation uses a binary heap, which provides O(log n) insertion and extraction. Other implementations include Fibonacci heaps, binomial heaps, and simple sorted/unsorted arrays, each with different performance trade-offs. This implementation uses a binary min-heap to support efficient insert and extract-min operations.

## How It Works

A binary min-heap is a complete binary tree where every parent node has a value less than or equal to its children. It is stored as an array where for index `i`:
- Parent is at index `floor((i - 1) / 2)`
- Left child is at index `2i + 1`
- Right child is at index `2i + 2`

**Insert (Heap Push):**
1. Add the new element at the end of the array (next available position in the tree).
2. "Bubble up": Compare the element with its parent. If smaller, swap them.
3. Repeat until the element is larger than its parent or reaches the root.

**Extract-Min (Heap Pop):**
1. The minimum is at the root (index 0). Save it.
2. Move the last element in the array to the root position.
3. "Bubble down": Compare the root with its children. Swap with the smaller child if it is smaller.
4. Repeat until the element is smaller than both children or reaches a leaf.

Operations are encoded as a flat array: `[op_count, type, val, ...]` where type 1 = insert value, type 2 = extract-min (val ignored). The function returns the sum of all extracted values. Extract from an empty queue yields 0.

## Example

**Step-by-step trace** with input `[4, 1,5, 1,3, 1,8, 2,0]`:

```
Operation 1: INSERT 5
  Heap: [5]

Operation 2: INSERT 3
  Heap: [5, 3] -> bubble up 3 -> [3, 5]

Operation 3: INSERT 8
  Heap: [3, 5, 8]  (8 > 3, no swap needed)

Operation 4: EXTRACT-MIN
  Remove root (3), move last element (8) to root: [8, 5]
  Bubble down: 8 > 5, swap -> [5, 8]
  Extracted value: 3

Sum of extracted values = 3
```

**Another example** with input `[7, 1,10, 1,4, 1,15, 2,0, 1,2, 2,0, 2,0]`:

```
INSERT 10  -> Heap: [10]
INSERT 4   -> Heap: [4, 10]
INSERT 15  -> Heap: [4, 10, 15]
EXTRACT    -> Returns 4,  Heap: [10, 15]
INSERT 2   -> Heap: [2, 15, 10]
EXTRACT    -> Returns 2,  Heap: [10, 15]
EXTRACT    -> Returns 10, Heap: [15]

Sum = 4 + 2 + 10 = 16
```

## Pseudocode

```
function insert(heap, value):
    heap.append(value)
    i = heap.size - 1
    while i > 0:
        parent = (i - 1) / 2
        if heap[i] < heap[parent]:
            swap(heap[i], heap[parent])
            i = parent
        else:
            break

function extractMin(heap):
    if heap is empty:
        return 0
    min_val = heap[0]
    heap[0] = heap[heap.size - 1]
    heap.removeLast()
    i = 0
    while true:
        left = 2 * i + 1
        right = 2 * i + 2
        smallest = i
        if left < heap.size and heap[left] < heap[smallest]:
            smallest = left
        if right < heap.size and heap[right] < heap[smallest]:
            smallest = right
        if smallest != i:
            swap(heap[i], heap[smallest])
            i = smallest
        else:
            break
    return min_val
```

## Complexity Analysis

| Operation   | Time     | Space |
|-------------|----------|-------|
| Insert      | O(log n) | O(n)  |
| Extract-Min | O(log n) | O(n)  |
| Peek (Min)  | O(1)     | O(n)  |
| Build Heap  | O(n)     | O(n)  |

- **Insert**: In the worst case, the new element bubbles up from a leaf to the root, traversing the height of the tree which is O(log n).
- **Extract-Min**: The replacement element may bubble down from root to leaf, again O(log n).
- **Peek**: The minimum is always at the root, so accessing it is O(1).
- **Build Heap** (from an unordered array): Using the bottom-up heapify approach, this is O(n) -- not O(n log n) -- because most nodes are near the bottom and require little work.

## Applications

- **Task scheduling systems**: Operating systems use priority queues to schedule processes by priority level.
- **Dijkstra's shortest path algorithm**: The priority queue efficiently selects the unvisited vertex with the smallest tentative distance.
- **Huffman encoding**: Building the Huffman tree requires repeatedly extracting the two lowest-frequency nodes.
- **Event-driven simulation**: Events are processed in chronological order using a min-heap keyed by timestamp.
- **A* search algorithm**: The open set is maintained as a priority queue ordered by f(n) = g(n) + h(n).
- **Median maintenance**: Two heaps (a max-heap and a min-heap) can maintain a running median in O(log n) per element.

## When NOT to Use

- **When you need to search for arbitrary elements**: A priority queue only provides efficient access to the minimum (or maximum) element. Searching for a specific element requires O(n) time. Use a balanced BST or hash table instead.
- **When you need stable ordering**: A binary heap does not preserve insertion order among equal-priority elements. If FIFO behavior among same-priority items matters, use a stable priority queue (often implemented by adding a sequence number as a tiebreaker).
- **When the dataset is static and sorted**: If you just need the k smallest elements from a fixed, sorted array, direct indexing is O(1). A priority queue adds unnecessary overhead.
- **When the priority set is very small**: If there are only a few distinct priority levels, a multi-level queue (array of regular queues, one per priority) gives O(1) insert and O(1) extract.

## Comparison

| Data Structure     | Insert     | Extract-Min | Peek  | Search  | Merge      |
|--------------------|-----------|-------------|-------|---------|------------|
| Binary Heap        | O(log n)  | O(log n)    | O(1)  | O(n)    | O(n)       |
| Fibonacci Heap     | O(1)*     | O(log n)*   | O(1)  | O(n)    | O(1)       |
| Binomial Heap      | O(log n)  | O(log n)    | O(1)  | O(n)    | O(log n)   |
| Sorted Array       | O(n)      | O(1)        | O(1)  | O(log n)| O(n)       |
| Unsorted Array     | O(1)      | O(n)        | O(n)  | O(n)    | O(1)       |
| Balanced BST       | O(log n)  | O(log n)    | O(log n)| O(log n)| O(n log n)|

\* Fibonacci heap complexities are amortized.

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 6: Heapsort and Chapter 20: Fibonacci Heaps.
- Sedgewick, R. & Wayne, K. (2011). *Algorithms* (4th ed.), Section 2.4: Priority Queues.
- Fredman, M. L. & Tarjan, R. E. (1987). "Fibonacci heaps and their uses in improved network optimization algorithms." *Journal of the ACM*, 34(3), 596-615.
- Williams, J. W. J. (1964). "Algorithm 232: Heapsort." *Communications of the ACM*, 7(6), 347-348.

## Implementations

| Language   | File |
|------------|------|
| Python     | [priority_queue.py](python/priority_queue.py) |
| Java       | [PriorityQueueOps.java](java/PriorityQueueOps.java) |
| C++        | [priority_queue.cpp](cpp/priority_queue.cpp) |
| C          | [priority_queue.c](c/priority_queue.c) |
| Go         | [priority_queue.go](go/priority_queue.go) |
| TypeScript | [priorityQueue.ts](typescript/priorityQueue.ts) |
| Rust       | [priority_queue.rs](rust/priority_queue.rs) |
| Kotlin     | [PriorityQueueOps.kt](kotlin/PriorityQueueOps.kt) |
| Swift      | [PriorityQueueOps.swift](swift/PriorityQueueOps.swift) |
| Scala      | [PriorityQueueOps.scala](scala/PriorityQueueOps.scala) |
| C#         | [PriorityQueueOps.cs](csharp/PriorityQueueOps.cs) |
