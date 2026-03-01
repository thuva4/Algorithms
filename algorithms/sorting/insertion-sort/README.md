# Insertion Sort

## Overview

Insertion Sort is a simple comparison-based sorting algorithm that builds the final sorted array one element at a time. It works similarly to how most people sort playing cards in their hands -- picking up each card and inserting it into its correct position among the cards already held. The algorithm iterates through the input, growing a sorted portion at the beginning of the array with each step.

While not efficient for large datasets, Insertion Sort is widely valued for its simplicity, stability, and excellent performance on small or nearly sorted data. It is often used as the base case for more advanced recursive sorting algorithms.

## How It Works

Insertion Sort divides the array into a "sorted" region (initially just the first element) and an "unsorted" region (the rest). On each iteration, it takes the next element from the unsorted region and scans backward through the sorted region, shifting elements to the right until it finds the correct position for insertion. This process repeats until every element has been inserted into the sorted region.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Pass 1:** Insert `3` into the sorted region `[5]`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Compare `3` with `5` | `3 < 5`, shift `5` right |
| 2 | Insert `3` at position 0 | `[3, 5, 8, 1, 2]` |

End of Pass 1: `[3, 5, 8, 1, 2]` -- Sorted region: `[3, 5]`

**Pass 2:** Insert `8` into the sorted region `[3, 5]`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Compare `8` with `5` | `8 > 5`, no shift needed |
| 2 | `8` stays in place | `[3, 5, 8, 1, 2]` |

End of Pass 2: `[3, 5, 8, 1, 2]` -- Sorted region: `[3, 5, 8]`

**Pass 3:** Insert `1` into the sorted region `[3, 5, 8]`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Compare `1` with `8` | `1 < 8`, shift `8` right |
| 2 | Compare `1` with `5` | `1 < 5`, shift `5` right |
| 3 | Compare `1` with `3` | `1 < 3`, shift `3` right |
| 4 | Insert `1` at position 0 | `[1, 3, 5, 8, 2]` |

End of Pass 3: `[1, 3, 5, 8, 2]` -- Sorted region: `[1, 3, 5, 8]`

**Pass 4:** Insert `2` into the sorted region `[1, 3, 5, 8]`

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Compare `2` with `8` | `2 < 8`, shift `8` right |
| 2 | Compare `2` with `5` | `2 < 5`, shift `5` right |
| 3 | Compare `2` with `3` | `2 < 3`, shift `3` right |
| 4 | Compare `2` with `1` | `2 > 1`, stop |
| 5 | Insert `2` at position 1 | `[1, 2, 3, 5, 8]` |

End of Pass 4: `[1, 2, 3, 5, 8]` -- Sorted region: `[1, 2, 3, 5, 8]`

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function insertionSort(array):
    n = length(array)

    for i from 1 to n - 1:
        key = array[i]
        j = i - 1

        // Shift elements of the sorted region that are greater than key
        while j >= 0 and array[j] > key:
            array[j + 1] = array[j]
            j = j - 1

        // Insert the key into its correct position
        array[j + 1] = key

    return array
```

The key insight is that shifting elements (rather than swapping) reduces the number of assignments. Each element in the sorted region that is larger than the key is moved one position to the right, and the key is placed into the gap left behind.

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** When the array is already sorted, each new element is compared once with the last element of the sorted region and found to be in the correct position. The inner while loop never executes, so the algorithm performs exactly `n - 1` comparisons and zero shifts, giving O(n) time.

- **Average Case -- O(n^2):** On average, each element must be compared with roughly half the elements in the sorted region before finding its correct position. The total number of comparisons is approximately 1/2 + 2/2 + 3/2 + ... + (n-1)/2 = n(n-1)/4, which is O(n^2).

- **Worst Case -- O(n^2):** When the array is sorted in reverse order, every new element must be compared with and shifted past every element in the sorted region. The total number of comparisons and shifts is 1 + 2 + 3 + ... + (n-1) = n(n-1)/2, which is O(n^2). For example, sorting `[5, 4, 3, 2, 1]` requires 4 + 3 + 2 + 1 = 10 comparisons.

- **Space -- O(1):** Insertion Sort is an in-place sorting algorithm. It only needs a single temporary variable (`key`) to hold the element being inserted. No additional data structures are required regardless of input size.

## When to Use

- **Small datasets (fewer than ~50 elements):** Insertion Sort has very low overhead and often outperforms more complex algorithms on small inputs. Many standard library sort implementations switch to Insertion Sort for small subarrays.
- **Nearly sorted data:** Insertion Sort is adaptive -- its running time approaches O(n) when the input has few inversions (elements out of order). It is one of the best algorithms for data that is already "almost sorted."
- **Online sorting (streaming data):** Insertion Sort can sort elements as they arrive one at a time, since each new element is inserted into an already-sorted sequence.
- **When stability is required:** Insertion Sort is a stable sort, preserving the relative order of equal elements.
- **As a building block:** Insertion Sort is commonly used as the base case in hybrid sorting algorithms like Timsort (Python's built-in sort) and Introsort.

## When NOT to Use

- **Large datasets:** With O(n^2) average and worst-case performance, Insertion Sort becomes impractically slow as input size grows. Sorting 10,000 elements could require up to 50 million comparisons.
- **Performance-critical applications with random data:** For randomly ordered data, O(n log n) algorithms such as Merge Sort, Quick Sort, or Heap Sort are far more efficient.
- **When data is sorted in reverse:** This triggers the worst-case O(n^2) behavior with maximum shifts, making Insertion Sort especially slow.
- **Datasets with many inversions:** The running time of Insertion Sort is proportional to the number of inversions in the input, so highly disordered data leads to poor performance.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space    | Stable | Notes                                       |
|----------------|-----------|----------|--------|---------------------------------------------|
| Insertion Sort | O(n^2)    | O(1)     | Yes    | Best for small or nearly sorted data        |
| Bubble Sort    | O(n^2)    | O(1)     | Yes    | Simpler but slower due to more swaps        |
| Selection Sort | O(n^2)    | O(1)     | No     | Fewer swaps but always O(n^2)               |
| Shell Sort     | O(n^(4/3))| O(1)     | No     | Generalization of Insertion Sort with gaps   |

## Implementations

| Language   | File |
|------------|------|
| Python     | [insertion_sort.py](python/insertion_sort.py) |
| Java       | [InsertionSort.java](java/InsertionSort.java) |
| C++        | [insertion_sort.cpp](cpp/insertion_sort.cpp) |
| C          | [insertion_sort.c](c/insertion_sort.c) |
| Go         | [insertion_sort.go](go/insertion_sort.go) |
| TypeScript | [insertionSort.ts](typescript/insertionSort.ts) |
| Rust       | [insertion_sort.rs](rust/insertion_sort.rs) |
| Swift      | [InsertionSort.swift](swift/InsertionSort.swift) |
| Kotlin     | [InsertionSort.kt](kotlin/InsertionSort.kt) |
| Scala      | [InsertionSort.scala](scala/InsertionSort.scala) |
| C#         | [InsertionSort.cs](csharp/InsertionSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started (Section 2.1: Insertion Sort).
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.1: Sorting by Insertion.
- [Insertion Sort -- Wikipedia](https://en.wikipedia.org/wiki/Insertion_sort)
