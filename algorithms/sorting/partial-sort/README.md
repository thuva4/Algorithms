# Partial Sort

## Overview

Partial Sort is an algorithm that rearranges elements such that the first k elements of the array are the k smallest elements in sorted order, while the remaining elements are left in an unspecified order. This is more efficient than fully sorting the array when you only need the top-k or bottom-k elements. The most common implementation uses a max-heap of size k, achieving O(n log k) time. Partial sort is the algorithm behind C++'s `std::partial_sort` and is widely used in database query processing (ORDER BY ... LIMIT k), recommendation systems, and statistical computations.

## How It Works

**Heap-based approach (most common):**

1. Build a max-heap from the first k elements of the array.
2. For each remaining element (index k to n-1):
   - If the element is smaller than the heap's maximum (root), replace the root with this element and heapify down to restore the heap property.
3. Extract elements from the heap in order (or sort the heap) to get the k smallest elements in sorted order.

**Quickselect-based approach (alternative):**

1. Use the Quickselect algorithm to partition the array so that the k-th smallest element is at position k-1.
2. Sort only the first k elements using any efficient sorting algorithm.

## Example

Given input: `[7, 2, 9, 1, 5, 8, 3, 6]`, k = 3 (find the 3 smallest in sorted order)

**Heap-based approach:**

| Step | Action | Max-Heap (size 3) | Array State |
|------|--------|-------------------|-------------|
| 1 | Build heap from first 3 | `[9, 2, 7]` | -- |
| 2 | Process 1: 1 < 9, replace | `[7, 2, 1]` | -- |
| 3 | Process 5: 5 < 7, replace | `[5, 2, 1]` | -- |
| 4 | Process 8: 8 > 5, skip | `[5, 2, 1]` | -- |
| 5 | Process 3: 3 < 5, replace | `[3, 2, 1]` | -- |
| 6 | Process 6: 6 > 3, skip | `[3, 2, 1]` | -- |

Sort the heap: `[1, 2, 3]`

Result: `[1, 2, 3, ?, ?, ?, ?, ?]` -- first 3 elements are the 3 smallest in sorted order.

## Pseudocode

```
function partialSort(array, k):
    n = length(array)
    k = min(k, n)

    // Build max-heap from first k elements
    heap = maxHeap(array[0..k-1])

    // Process remaining elements
    for i from k to n - 1:
        if array[i] < heap.peek():
            heap.replaceRoot(array[i])
            heap.heapifyDown()

    // Extract sorted result
    result = array of size k
    for i from k - 1 down to 0:
        result[i] = heap.extractMax()

    // Place sorted elements back
    for i from 0 to k - 1:
        array[i] = result[i]

    return array
```

## Complexity Analysis

| Case    | Time         | Space |
|---------|-------------|-------|
| Best    | O(n + k log k) | O(k) |
| Average | O(n log k)  | O(k)  |
| Worst   | O(n log k)  | O(k)  |

**Why these complexities?**

- **Time -- O(n log k):** Building the initial heap of size k takes O(k) time. Processing each of the remaining n-k elements involves at most one heap operation costing O(log k). The final extraction of k sorted elements costs O(k log k). Total: O(k) + O((n-k) log k) + O(k log k) = O(n log k).

- **Best Case -- O(n + k log k):** When the first k elements happen to be the smallest, no replacements occur during the scan phase. Only the initial heap build O(k) and final sort O(k log k) are needed, plus the O(n) scan.

- **Space -- O(k):** The max-heap requires O(k) space. If performed in-place on the array (as in `std::partial_sort`), only O(1) extra space is needed beyond the input.

## When to Use

- **Top-k queries:** Finding the k largest or smallest elements in a dataset (e.g., "top 10 scores", "cheapest 5 flights").
- **Database LIMIT clauses:** Implementing `SELECT ... ORDER BY ... LIMIT k` efficiently without sorting the entire result set.
- **Streaming data:** Maintaining a running top-k over a data stream using a fixed-size heap.
- **Statistical measures:** Computing the median, percentiles, or trimmed means where only partial ordering is needed.
- **Recommendation systems:** Selecting the top-k most relevant items from a large candidate pool.

## When NOT to Use

- **When you need the full sorted order:** If k is close to n, a full sort (O(n log n)) is more efficient than partial sort since the overhead difference is minimal.
- **When you only need the k-th element:** If you do not need the elements in sorted order, Quickselect (O(n) average) is faster than partial sort.
- **When k = 1:** Simply finding the minimum or maximum in O(n) with a linear scan is much simpler.
- **When elements are already sorted:** A full sort check or binary search would be more appropriate.

## Comparison

| Algorithm | Finds | Time | Space | Sorted Output |
|-----------|-------|------|-------|---------------|
| Partial Sort (heap) | k smallest, sorted | O(n log k) | O(k) | Yes |
| Quickselect | k-th element only | O(n) avg | O(1) | No |
| Full Sort | All n elements | O(n log n) | O(n) or O(1) | Yes |
| Tournament Tree | k smallest | O(n + k log n) | O(n) | Yes |
| Introselect | k-th element | O(n) worst | O(1) | No |

## Implementations

| Language   | File |
|------------|------|
| Python     | [partial_sort.py](python/partial_sort.py) |
| Java       | [PartialSort.java](java/PartialSort.java) |
| C++        | [partial_sort.cpp](cpp/partial_sort.cpp) |
| C          | [partial_sort.c](c/partial_sort.c) |
| Go         | [partial_sort.go](go/partial_sort.go) |
| TypeScript | [partialSort.ts](typescript/partialSort.ts) |
| Kotlin     | [PartialSort.kt](kotlin/PartialSort.kt) |
| Rust       | [partial_sort.rs](rust/partial_sort.rs) |
| Swift      | [PartialSort.swift](swift/PartialSort.swift) |
| Scala      | [PartialSort.scala](scala/PartialSort.scala) |
| C#         | [PartialSort.cs](csharp/PartialSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 6: Heapsort; Chapter 9: Medians and Order Statistics.
- Musser, D. R. (1997). "Introspective Sorting and Selection Algorithms." *Software: Practice and Experience*, 27(8), 983-993.
- [Partial Sorting -- Wikipedia](https://en.wikipedia.org/wiki/Partial_sorting)
