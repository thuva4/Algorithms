# Heap Sort

## Overview

Heap Sort is an efficient, comparison-based sorting algorithm that uses a binary heap data structure to sort elements. It works by first building a max-heap from the input data, then repeatedly extracting the maximum element from the heap and placing it at the end of the array. The algorithm combines the best properties of Selection Sort (in-place) and Merge Sort (O(n log n) guaranteed performance).

Heap Sort provides a worst-case O(n log n) time guarantee with O(1) auxiliary space, making it an excellent choice when both predictable performance and minimal memory usage are required. However, it tends to be slower in practice than Quick Sort due to poor cache locality from the non-sequential memory access patterns inherent in heap operations.

## How It Works

Heap Sort operates in two main phases. First, it transforms the input array into a max-heap (a complete binary tree where each parent node is greater than or equal to its children) using the "heapify" procedure applied bottom-up. Then, it repeatedly swaps the root (maximum element) with the last unsorted element, reduces the heap size by one, and restores the heap property by sifting the new root down. This process continues until the heap is empty and the array is sorted.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Phase 1: Build Max-Heap**

The array represents a binary tree: index 0 is root, children of index `i` are at `2i+1` and `2i+2`.

| Step | Action | Array State | Heap Valid? |
|------|--------|-------------|-------------|
| 1 | Start with `[5, 3, 8, 1, 2]` | `[5, 3, 8, 1, 2]` | No |
| 2 | Heapify node at index 1 (`3`): children are `1`, `2`. `3 > 2` and `3 > 1`, no swap | `[5, 3, 8, 1, 2]` | Partial |
| 3 | Heapify node at index 0 (`5`): children are `3`, `8`. `8 > 5`, swap `5` and `8` | `[8, 3, 5, 1, 2]` | Yes |

Max-heap built: `[8, 3, 5, 1, 2]`

**Phase 2: Extract Elements**

**Extract 1:** Swap root `8` with last element `2`, reduce heap size

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Swap `8` and `2` | `[2, 3, 5, 1, | 8]` |
| 2 | Heapify root `2`: children `3`, `5`. `5 > 2`, swap | `[5, 3, 2, 1, | 8]` |

Sorted so far: `[8]`

**Extract 2:** Swap root `5` with last unsorted element `1`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Swap `5` and `1` | `[1, 3, 2, | 5, 8]` |
| 2 | Heapify root `1`: children `3`, `2`. `3 > 1`, swap | `[3, 1, 2, | 5, 8]` |

Sorted so far: `[5, 8]`

**Extract 3:** Swap root `3` with last unsorted element `2`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Swap `3` and `2` | `[2, 1, | 3, 5, 8]` |
| 2 | Heapify root `2`: child `1`. `2 > 1`, no swap needed | `[2, 1, | 3, 5, 8]` |

Sorted so far: `[3, 5, 8]`

**Extract 4:** Swap root `2` with last unsorted element `1`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Swap `2` and `1` | `[1, | 2, 3, 5, 8]` |
| 2 | Heap size is 1, no heapify needed | `[1, 2, 3, 5, 8]` |

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function heapSort(array):
    n = length(array)

    // Phase 1: Build max-heap (start from last non-leaf node)
    for i from (n / 2 - 1) down to 0:
        heapify(array, n, i)

    // Phase 2: Extract elements from heap one by one
    for i from n - 1 down to 1:
        swap(array[0], array[i])
        heapify(array, i, 0)

function heapify(array, heapSize, rootIndex):
    largest = rootIndex
    left = 2 * rootIndex + 1
    right = 2 * rootIndex + 2

    if left < heapSize and array[left] > array[largest]:
        largest = left

    if right < heapSize and array[right] > array[largest]:
        largest = right

    if largest != rootIndex:
        swap(array[rootIndex], array[largest])
        heapify(array, heapSize, largest)
```

The `heapify` function restores the max-heap property by comparing a node with its children and swapping it with the larger child if necessary, then recursing on the affected subtree. Building the heap bottom-up is an O(n) operation, which is more efficient than inserting elements one at a time.

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(1)  |
| Average | O(n log n) | O(1)  |
| Worst   | O(n log n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n log n):** Even when all elements are equal or the array is already sorted, Heap Sort must still build the heap and perform n - 1 extract-max operations. Each extraction involves a swap and a heapify call that takes O(log n) time, giving O(n log n) total. The heap-building phase is O(n), but the extraction phase dominates.

- **Average Case -- O(n log n):** Building the max-heap takes O(n) time (proven by analyzing the sum of heights of all nodes). The extraction phase performs n - 1 heapify operations, each taking O(log n) time in the worst case, giving O(n log n). The total is O(n) + O(n log n) = O(n log n).

- **Worst Case -- O(n log n):** Unlike Quick Sort, Heap Sort's performance does not depend on the input order. Every heapify call traverses at most the height of the heap, which is always floor(log n). With n - 1 such calls, the worst case is O(n log n). There is no pathological input that degrades performance.

- **Space -- O(1):** Heap Sort is an in-place sorting algorithm. The binary heap is built directly within the input array using the implicit array representation of a complete binary tree. Only a constant number of temporary variables are needed for swapping. The recursive heapify can be implemented iteratively to avoid O(log n) stack space.

## When to Use

- **When worst-case O(n log n) is required with O(1) space:** Heap Sort is the only comparison-based sorting algorithm that guarantees O(n log n) time with constant auxiliary space.
- **Embedded systems or memory-constrained environments:** The O(1) space requirement makes Heap Sort ideal when memory is scarce.
- **Priority queue operations:** The underlying heap data structure naturally supports efficient priority queue operations, and Heap Sort can be viewed as repeated priority queue extractions.
- **When you need a guaranteed upper bound on sorting time:** Heap Sort has no pathological inputs, making it suitable for real-time or safety-critical systems where worst-case performance must be bounded.

## When NOT to Use

- **When average-case speed is the priority:** Quick Sort is typically 2-3x faster than Heap Sort in practice due to better cache locality and fewer comparisons on average.
- **When stability is required:** Heap Sort is not stable. The swapping of elements to distant positions in the array can change the relative order of equal elements.
- **Nearly sorted data:** Heap Sort cannot take advantage of existing order in the data. Unlike Insertion Sort, it always performs the same amount of work regardless of the initial arrangement.
- **Small datasets:** The overhead of building the heap structure makes Heap Sort slower than Insertion Sort for small inputs.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)  | Space    | Stable | Notes                                       |
|----------------|------------|----------|--------|---------------------------------------------|
| Heap Sort      | O(n log n) | O(1)     | No     | Guaranteed O(n log n) with O(1) space        |
| Quick Sort     | O(n log n) | O(log n) | No     | Faster in practice; O(n^2) worst case        |
| Merge Sort     | O(n log n) | O(n)     | Yes    | Stable; guaranteed O(n log n); needs extra space |
| Selection Sort | O(n^2)     | O(1)     | No     | Simpler but much slower; also selection-based |

## Implementations

| Language   | File |
|------------|------|
| Python     | [heap_sort.py](python/heap_sort.py) |
| Java       | [HeapSort.java](java/HeapSort.java) |
| C++        | [heap_sort.cpp](cpp/heap_sort.cpp) |
| C          | [heap_sort.c](c/heap_sort.c) |
| Go         | [heap_sort.go](go/heap_sort.go) |
| TypeScript | [heapSort.ts](typescript/heapSort.ts) |
| Kotlin     | [HeapSort.kt](kotlin/HeapSort.kt) |
| Rust       | [heap_sort.rs](rust/heap_sort.rs) |
| Swift      | [HeapSort.swift](swift/HeapSort.swift) |
| Scala      | [HeapSort.scala](scala/HeapSort.scala) |
| C#         | [HeapSort.cs](csharp/HeapSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 6: Heapsort.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.3: Sorting by Selection (Heapsort).
- Williams, J. W. J. (1964). "Algorithm 232: Heapsort." *Communications of the ACM*, 7(6), 347-349.
- [Heapsort -- Wikipedia](https://en.wikipedia.org/wiki/Heapsort)
