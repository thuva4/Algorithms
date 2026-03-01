# Bubble Sort

## Overview

Bubble Sort is the simplest comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process is repeated until the list is sorted. The algorithm gets its name because smaller elements "bubble" to the top (beginning) of the list with each pass, much like air bubbles rising to the surface of water.

While Bubble Sort is not efficient for large datasets, it is widely used as an introductory algorithm for teaching sorting concepts due to its straightforward logic and ease of implementation.

## How It Works

Bubble Sort works by making multiple passes through the array. On each pass, it compares every pair of adjacent elements and swaps them if they are out of order. After each complete pass, the largest unsorted element is guaranteed to be in its correct final position at the end of the array. An optimized version tracks whether any swaps occurred during a pass -- if no swaps were made, the array is already sorted and the algorithm can terminate early.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Pass 1:** (Find the largest element and bubble it to position 4)

| Step | Comparison | Action | Array State |
|------|-----------|--------|-------------|
| 1 | Compare `5` and `3` | Swap (5 > 3) | `[3, 5, 8, 1, 2]` |
| 2 | Compare `5` and `8` | No swap (5 < 8) | `[3, 5, 8, 1, 2]` |
| 3 | Compare `8` and `1` | Swap (8 > 1) | `[3, 5, 1, 8, 2]` |
| 4 | Compare `8` and `2` | Swap (8 > 2) | `[3, 5, 1, 2, 8]` |

End of Pass 1: `[3, 5, 1, 2, 8]` -- `8` is now in its correct final position.

**Pass 2:** (Find the next largest and bubble it to position 3)

| Step | Comparison | Action | Array State |
|------|-----------|--------|-------------|
| 1 | Compare `3` and `5` | No swap (3 < 5) | `[3, 5, 1, 2, 8]` |
| 2 | Compare `5` and `1` | Swap (5 > 1) | `[3, 1, 5, 2, 8]` |
| 3 | Compare `5` and `2` | Swap (5 > 2) | `[3, 1, 2, 5, 8]` |

End of Pass 2: `[3, 1, 2, 5, 8]` -- `5` is now in its correct final position.

**Pass 3:** (Find the next largest and bubble it to position 2)

| Step | Comparison | Action | Array State |
|------|-----------|--------|-------------|
| 1 | Compare `3` and `1` | Swap (3 > 1) | `[1, 3, 2, 5, 8]` |
| 2 | Compare `3` and `2` | Swap (3 > 2) | `[1, 2, 3, 5, 8]` |

End of Pass 3: `[1, 2, 3, 5, 8]` -- `3` is now in its correct final position.

**Pass 4:** (Verify the remaining elements are sorted)

| Step | Comparison | Action | Array State |
|------|-----------|--------|-------------|
| 1 | Compare `1` and `2` | No swap (1 < 2) | `[1, 2, 3, 5, 8]` |

End of Pass 4: `[1, 2, 3, 5, 8]` -- No swaps occurred, so the algorithm terminates early.

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function bubbleSort(array):
    n = length(array)

    for i from 0 to n - 1:
        swapped = false

        for j from 0 to n - i - 2:
            if array[j] > array[j + 1]:
                swap(array[j], array[j + 1])
                swapped = true

        // If no swaps occurred in this pass, the array is already sorted
        if not swapped:
            break

    return array
```

The key optimization here is the `swapped` flag. Without it, Bubble Sort always performs `n - 1` passes even on an already-sorted array. With the flag, it detects a sorted array in a single pass, reducing the best-case time complexity from O(n^2) to O(n).

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** When the array is already sorted, the optimized version with the `swapped` flag completes a single pass through the array with no swaps and terminates immediately. This single pass performs `n - 1` comparisons, giving O(n) time.

- **Average Case -- O(n^2):** On average, each element is roughly halfway from its sorted position. The algorithm requires approximately n/2 passes, and each pass makes up to n comparisons. This gives roughly n/2 * n = n^2/2 comparisons, which is O(n^2).

- **Worst Case -- O(n^2):** When the array is sorted in reverse order, every pass requires the maximum number of swaps. The algorithm performs (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons and swaps, which is O(n^2). For example, sorting `[5, 4, 3, 2, 1]` requires 4 full passes with 4 + 3 + 2 + 1 = 10 comparisons.

- **Space -- O(1):** Bubble Sort is an in-place sorting algorithm. It only needs a single temporary variable for swapping elements and a boolean flag for the early termination optimization. No additional data structures are required regardless of input size.

## When to Use

- **Small datasets (fewer than ~100 elements):** The overhead of more complex algorithms outweighs their asymptotic advantage on tiny inputs.
- **Nearly sorted data:** With the early termination optimization, Bubble Sort performs very well on data that is already almost sorted, approaching O(n) time.
- **Educational contexts:** Bubble Sort is an excellent first sorting algorithm to learn because it clearly demonstrates the concepts of comparison, swapping, and iterative refinement.
- **When simplicity and correctness matter more than performance:** Bubble Sort is easy to implement correctly with minimal risk of off-by-one errors or other subtle bugs.
- **When stability is required:** Bubble Sort is a stable sort, meaning it preserves the relative order of equal elements.

## When NOT to Use

- **Large datasets:** With O(n^2) average and worst-case performance, Bubble Sort becomes impractically slow as input size grows. For example, sorting 10,000 elements could require up to 100 million operations.
- **Performance-critical applications:** When speed matters, O(n log n) algorithms such as Merge Sort, Quick Sort, or Heap Sort are vastly superior.
- **When better quadratic sorts exist for your use case:** Even among O(n^2) algorithms, Insertion Sort generally outperforms Bubble Sort in practice because it does fewer swaps and has better cache locality.
- **Real-time systems:** The unpredictable performance gap between best and worst case (O(n) vs O(n^2)) makes Bubble Sort unsuitable for systems with strict timing guarantees on arbitrary inputs.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space    | Stable | Notes                                       |
|----------------|-----------|----------|--------|---------------------------------------------|
| Bubble Sort    | O(n^2)    | O(1)     | Yes    | Simple but slow; good for learning          |
| Insertion Sort | O(n^2)    | O(1)     | Yes    | Better for small or nearly sorted data      |
| Selection Sort | O(n^2)    | O(1)     | No     | Fewer swaps than Bubble Sort                |
| Quick Sort     | O(n log n)| O(log n) | No     | Much faster in practice; preferred general-purpose sort |

## Implementations

| Language   | File |
|------------|------|
| Python     | [bubble_sort.py](python/bubble_sort.py) |
| Java       | [BubbleSort.java](java/BubbleSort.java) |
| C++        | [bubble_sort.cpp](cpp/bubble_sort.cpp) |
| C          | [bubble_sort.c](c/bubble_sort.c) |
| Go         | [bubble_sort.go](go/bubble_sort.go) |
| TypeScript | [bubbleSort.ts](typescript/bubbleSort.ts) |
| Kotlin     | [BubbleSort.kt](kotlin/BubbleSort.kt) |
| Rust       | [bubble_sort.rs](rust/bubble_sort.rs) |
| Swift      | [BubbleSort.swift](swift/BubbleSort.swift) |
| Scala      | [BubbleSort.scala](scala/BubbleSort.scala) |
| C#         | [BubbleSort.cs](csharp/BubbleSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.2: Sorting by Exchanging.
- [Bubble Sort -- Wikipedia](https://en.wikipedia.org/wiki/Bubble_sort)
