# Quick Sort

## Overview

Quick Sort is a highly efficient, comparison-based sorting algorithm that uses the divide-and-conquer strategy. It works by selecting a "pivot" element, partitioning the array into elements less than and greater than the pivot, and then recursively sorting the partitions. Developed by Tony Hoare in 1959, Quick Sort is one of the most widely used sorting algorithms in practice.

Quick Sort is generally the fastest comparison-based sorting algorithm in practice due to excellent cache locality and low constant factors, despite having a theoretical worst-case of O(n^2). With good pivot selection strategies (such as median-of-three or randomized pivots), the worst case is extremely rare.

## How It Works

Quick Sort selects a pivot element from the array, then partitions the remaining elements into two groups: those less than or equal to the pivot and those greater than the pivot. The pivot is placed in its final sorted position, and the algorithm recursively sorts the two partitions. Unlike Merge Sort, the work is done during the partitioning step rather than during the combining step.

### Example

Given input: `[5, 3, 8, 1, 2]` (using last element as pivot)

**Level 1:** Pivot = `2`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Compare `5` with pivot `2` | `5 > 2`, stays in right partition |
| 2 | Compare `3` with pivot `2` | `3 > 2`, stays in right partition |
| 3 | Compare `8` with pivot `2` | `8 > 2`, stays in right partition |
| 4 | Compare `1` with pivot `2` | `1 < 2`, swap `1` to left partition |
| 5 | Place pivot `2` in correct position | `[1, 2, 8, 3, 5]` |

After partition: `[1]` `2` `[8, 3, 5]` -- `2` is in its final position (index 1).

**Level 2a:** Left subarray `[1]` -- single element, already sorted.

**Level 2b:** Right subarray `[8, 3, 5]`, Pivot = `5`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Compare `8` with pivot `5` | `8 > 5`, stays in right partition |
| 2 | Compare `3` with pivot `5` | `3 < 5`, swap `3` to left partition |
| 3 | Place pivot `5` in correct position | `[3, 5, 8]` |

After partition: `[3]` `5` `[8]` -- `5` is in its final position.

**Level 3:** Both `[3]` and `[8]` are single elements, already sorted.

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function quickSort(array, low, high):
    if low < high:
        pivotIndex = partition(array, low, high)
        quickSort(array, low, pivotIndex - 1)
        quickSort(array, pivotIndex + 1, high)

function partition(array, low, high):
    pivot = array[high]
    i = low - 1

    for j from low to high - 1:
        if array[j] <= pivot:
            i = i + 1
            swap(array[i], array[j])

    swap(array[i + 1], array[high])
    return i + 1
```

This uses the Lomuto partition scheme with the last element as pivot. The Hoare partition scheme is an alternative that generally performs fewer swaps. Randomized pivot selection can be added by swapping a random element to the `high` position before partitioning.

## Complexity Analysis

| Case    | Time       | Space    |
|---------|------------|----------|
| Best    | O(n log n) | O(log n) |
| Average | O(n log n) | O(log n) |
| Worst   | O(n^2)     | O(log n) |

**Why these complexities?**

- **Best Case -- O(n log n):** When the pivot always divides the array into two roughly equal halves, the recursion tree has log n levels. Each level requires O(n) work for partitioning, giving O(n log n) total. This occurs when the pivot is consistently near the median.

- **Average Case -- O(n log n):** Even when partitions are not perfectly balanced, the expected depth of the recursion tree is O(log n). Mathematically, the average number of comparisons is approximately 1.39 * n * log2(n), which is only 39% more comparisons than the best case. Random pivot selection ensures this average case is achieved regardless of input order.

- **Worst Case -- O(n^2):** When the pivot is consistently the smallest or largest element (e.g., picking the first element of an already-sorted array), the partition produces one empty subarray and one of size n-1. This gives n levels of recursion with O(n) work each, resulting in n + (n-1) + ... + 1 = n(n-1)/2 comparisons, which is O(n^2). This is rare with good pivot selection strategies.

- **Space -- O(log n):** Quick Sort is in-place (it does not create copies of the array), but the recursion stack requires space. In the best and average case, the recursion depth is O(log n). In the worst case, the stack depth could be O(n), but tail-call optimization (sorting the smaller partition first) guarantees O(log n) stack space even in the worst case.

## When to Use

- **General-purpose sorting:** Quick Sort is the default choice for many standard library sort implementations (e.g., C's `qsort`, Java's `Arrays.sort` for primitives) due to its excellent average-case performance.
- **When average-case speed matters most:** Quick Sort's low constant factors and good cache locality make it faster in practice than Merge Sort or Heap Sort for most inputs.
- **In-place sorting with limited memory:** Quick Sort sorts in-place with only O(log n) auxiliary space for the recursion stack, unlike Merge Sort's O(n) extra space.
- **When data fits in memory:** Quick Sort's random access pattern works well with arrays in RAM.

## When NOT to Use

- **When worst-case guarantees are needed:** Quick Sort's O(n^2) worst case (however rare) is unacceptable in safety-critical or real-time systems. Use Merge Sort or Heap Sort instead.
- **When stability is required:** Standard Quick Sort is not stable. If preserving the relative order of equal elements matters, use Merge Sort.
- **Sorting linked lists:** Quick Sort's performance advantage relies on random access, which linked lists do not provide efficiently. Merge Sort is better for linked lists.
- **Adversarial inputs:** Without randomized pivot selection, a malicious input can trigger the O(n^2) worst case. This is a concern in web servers or other systems processing untrusted data.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)  | Space    | Stable | Notes                                       |
|----------------|------------|----------|--------|---------------------------------------------|
| Quick Sort     | O(n log n) | O(log n) | No     | Fastest in practice; O(n^2) worst case       |
| Merge Sort     | O(n log n) | O(n)     | Yes    | Guaranteed O(n log n); stable; needs extra space |
| Heap Sort      | O(n log n) | O(1)     | No     | In-place and guaranteed O(n log n); slower in practice |

## Implementations

| Language   | File |
|------------|------|
| Python     | [QuickSort.py](python/QuickSort.py) |
| Java       | [QuickSort.java](java/QuickSort.java) |
| C++        | [QuickSort.cpp](cpp/QuickSort.cpp) |
| C          | [QuickSort.c](c/QuickSort.c) |
| Go         | [QuickSort.go](go/QuickSort.go) |
| TypeScript | [index.js](typescript/index.js) |
| Kotlin     | [QuickSort.kt](kotlin/QuickSort.kt) |
| Rust       | [quicksort.rs](rust/quicksort.rs) |
| Swift      | [QuickSort.swift](swift/QuickSort.swift) |
| Scala      | [QuickSort.scala](scala/QuickSort.scala) |
| C#         | [QuickSort.cs](csharp/QuickSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 7: Quicksort.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.2: Sorting by Exchanging.
- Hoare, C. A. R. (1962). "Quicksort." *The Computer Journal*, 5(1), 10-16.
- [Quicksort -- Wikipedia](https://en.wikipedia.org/wiki/Quicksort)
