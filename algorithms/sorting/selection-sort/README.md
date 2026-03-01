# Selection Sort

## Overview

Selection Sort is a simple comparison-based sorting algorithm that divides the input into a sorted and an unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted region and moves it to the end of the sorted region. The algorithm gets its name from this process of "selecting" the minimum element in each pass.

While Selection Sort is not efficient for large datasets, it has the notable property of making the minimum number of swaps (at most n - 1), which can be advantageous when the cost of writing to memory is high. It is straightforward to understand and implement, making it useful for educational purposes.

## How It Works

Selection Sort works by maintaining two regions in the array: a sorted region at the beginning (initially empty) and an unsorted region containing the rest. On each pass, the algorithm scans the entire unsorted region to find the minimum element, then swaps it with the first element of the unsorted region, thereby growing the sorted region by one element. This process repeats until the unsorted region is empty.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Pass 1:** Find the minimum in `[5, 3, 8, 1, 2]` and place it at position 0

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Scan positions 0-4 for minimum | Minimum is `1` at index 3 |
| 2 | Swap `5` (index 0) with `1` (index 3) | `[1, 3, 8, 5, 2]` |

End of Pass 1: `[1, 3, 8, 5, 2]` -- `1` is in its correct final position.

**Pass 2:** Find the minimum in `[3, 8, 5, 2]` and place it at position 1

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Scan positions 1-4 for minimum | Minimum is `2` at index 4 |
| 2 | Swap `3` (index 1) with `2` (index 4) | `[1, 2, 8, 5, 3]` |

End of Pass 2: `[1, 2, 8, 5, 3]` -- `2` is in its correct final position.

**Pass 3:** Find the minimum in `[8, 5, 3]` and place it at position 2

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Scan positions 2-4 for minimum | Minimum is `3` at index 4 |
| 2 | Swap `8` (index 2) with `3` (index 4) | `[1, 2, 3, 5, 8]` |

End of Pass 3: `[1, 2, 3, 5, 8]` -- `3` is in its correct final position.

**Pass 4:** Find the minimum in `[5, 8]` and place it at position 3

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Scan positions 3-4 for minimum | Minimum is `5` at index 3 |
| 2 | `5` is already in place, no swap needed | `[1, 2, 3, 5, 8]` |

End of Pass 4: `[1, 2, 3, 5, 8]` -- `5` is in its correct final position, and `8` is the only remaining element.

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function selectionSort(array):
    n = length(array)

    for i from 0 to n - 2:
        // Find the index of the minimum element in the unsorted region
        minIndex = i
        for j from i + 1 to n - 1:
            if array[j] < array[minIndex]:
                minIndex = j

        // Swap the minimum element with the first unsorted element
        if minIndex != i:
            swap(array[i], array[minIndex])

    return array
```

The optimization of checking `minIndex != i` before swapping avoids unnecessary writes when the minimum element is already in its correct position. However, this does not change the overall time complexity since the scanning step always requires the same number of comparisons.

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n^2) | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n^2):** Even when the array is already sorted, Selection Sort must scan the entire unsorted region on every pass to confirm that the minimum is already in place. The number of comparisons is always (n-1) + (n-2) + ... + 1 = n(n-1)/2, regardless of the initial order. This is why Selection Sort is not adaptive.

- **Average Case -- O(n^2):** The algorithm always performs exactly n(n-1)/2 comparisons. The number of swaps varies (on average about n - 1), but the dominant cost is the comparisons, giving O(n^2).

- **Worst Case -- O(n^2):** The comparison count is identical to the best and average cases: n(n-1)/2. The worst case for swaps occurs when every pass requires a swap, but this is still at most n - 1 swaps. The time complexity is O(n^2) regardless.

- **Space -- O(1):** Selection Sort is an in-place sorting algorithm. It only needs a constant amount of extra space for the `minIndex` variable and the temporary variable used for swapping. No additional data structures are required.

## When to Use

- **When memory writes are expensive:** Selection Sort performs at most n - 1 swaps, which is the minimum possible for any comparison-based sort. This makes it suitable for situations where writing to memory (e.g., flash memory or EEPROM) is costly.
- **Small datasets:** For very small arrays, the simplicity of Selection Sort makes it a reasonable choice.
- **Educational contexts:** Selection Sort clearly demonstrates the concept of finding extremes (minimum/maximum) and the distinction between comparisons and swaps.
- **When auxiliary space must be minimized:** Selection Sort is in-place with O(1) extra space.

## When NOT to Use

- **Large datasets:** The O(n^2) time complexity in all cases makes Selection Sort impractical for large inputs.
- **Nearly sorted data:** Unlike Insertion Sort, Selection Sort cannot take advantage of existing order in the data. It always performs n(n-1)/2 comparisons.
- **When stability is required:** The standard implementation of Selection Sort is not stable. Swapping distant elements can change the relative order of equal elements.
- **Performance-critical applications:** O(n log n) algorithms like Merge Sort, Quick Sort, or Heap Sort are vastly superior for any non-trivial input size.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space    | Stable | Notes                                       |
|----------------|-----------|----------|--------|---------------------------------------------|
| Selection Sort | O(n^2)    | O(1)     | No     | Fewest swaps; not adaptive                  |
| Bubble Sort    | O(n^2)    | O(1)     | Yes    | Adaptive with early termination; more swaps |
| Insertion Sort | O(n^2)    | O(1)     | Yes    | Adaptive; best for nearly sorted data       |
| Heap Sort      | O(n log n)| O(1)     | No     | Uses heap structure; much faster            |

## Implementations

| Language   | File |
|------------|------|
| Python     | [selectionSort.py](python/selectionSort.py) |
| Java       | [SelectionSort.java](java/SelectionSort.java) |
| C++        | [Selection-sort.cpp](cpp/Selection-sort.cpp) |
| C          | [selection.c](c/selection.c) |
| Go         | [selection_sort.go](go/selection_sort.go) |
| TypeScript | [index.js](typescript/index.js) |
| Kotlin     | [SelectionSort.kt](kotlin/SelectionSort.kt) |
| Rust       | [selection_sort.rs](rust/selection_sort.rs) |
| Swift      | [SelectionSort.swift](swift/SelectionSort.swift) |
| Scala      | [SelectionSort.scala](scala/SelectionSort.scala) |
| C#         | [SelectionSort.cs](csharp/SelectionSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started (Exercise 2.2-2: Selection Sort).
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.3: Sorting by Selection.
- [Selection Sort -- Wikipedia](https://en.wikipedia.org/wiki/Selection_sort)
