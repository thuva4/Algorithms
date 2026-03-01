# Cocktail Sort

## Overview

Cocktail Sort is a variation of Bubble Sort that traverses the array in both directions alternately. It is functionally identical to Cocktail Shaker Sort and is sometimes referred to by this shorter name. The algorithm performs a forward pass (left to right) to push the largest unsorted element to the end, followed by a backward pass (right to left) to push the smallest unsorted element to the beginning. This bidirectional approach mitigates the "turtle problem" in standard Bubble Sort, where small values near the end of the array take many passes to reach their correct position.

## How It Works

1. **Initialize** the left boundary at 0 and the right boundary at n-1.
2. **Forward pass:** Iterate from left to right, comparing adjacent elements and swapping if out of order. After this pass, the largest element is at the right boundary. Decrement the right boundary.
3. **Backward pass:** Iterate from right to left, comparing adjacent elements and swapping if out of order. After this pass, the smallest element is at the left boundary. Increment the left boundary.
4. **Termination:** If no swaps occurred in a complete forward+backward cycle, the array is sorted. Otherwise, repeat from step 2.

## Example

Given input: `[3, 0, 1, 8, 7, 2, 5, 4, 6, 9]`

**Iteration 1:**

*Forward pass (left to right):*
- Compares and swaps through the array, bubbling `9` to position 9.
- After: `[0, 1, 3, 7, 2, 5, 4, 6, 8, 9]`

*Backward pass (right to left):*
- Compares and swaps through the array, sinking `0` to position 0.
- After: `[0, 1, 2, 3, 5, 4, 6, 7, 8, 9]`

**Iteration 2:**

*Forward pass:* Bubbles `8` (already placed), fixes `5,4` swap.
- After: `[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`

*Backward pass:* No swaps needed -- array is sorted, algorithm terminates.

Result: `[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]`

## Pseudocode

```
function cocktailSort(array):
    n = length(array)
    left = 0
    right = n - 1
    swapped = true

    while swapped:
        swapped = false

        // Forward pass: bubble largest to the right
        for i from left to right - 1:
            if array[i] > array[i + 1]:
                swap(array[i], array[i + 1])
                swapped = true
        right = right - 1

        if not swapped:
            break

        swapped = false

        // Backward pass: sink smallest to the left
        for i from right down to left + 1:
            if array[i - 1] > array[i]:
                swap(array[i - 1], array[i])
                swapped = true
        left = left + 1

    return array
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** When the input is already sorted, the first forward pass performs n-1 comparisons with zero swaps and terminates.

- **Average Case -- O(n^2):** The bidirectional approach reduces the constant factor compared to Bubble Sort (approximately 2x fewer iterations in some distributions), but the quadratic bound holds.

- **Worst Case -- O(n^2):** Occurs when elements are in reverse order. The algorithm requires approximately n/2 full cycles, each with O(n) comparisons.

- **Space -- O(1):** Only a fixed number of extra variables are used (loop counters, swap flag, temp variable).

## When to Use

- **Nearly sorted data:** The early termination and bidirectional passes make it efficient for nearly sorted arrays.
- **Small arrays:** Acceptable performance for very small datasets (fewer than ~50 elements).
- **Teaching purposes:** Illustrates how bidirectional traversal improves upon naive Bubble Sort.
- **When stability matters:** Cocktail Sort is stable, preserving the relative order of equal elements.

## When NOT to Use

- **Medium to large datasets:** O(n^2) average time makes it too slow for datasets larger than a few dozen elements.
- **Performance-sensitive applications:** Even among O(n^2) sorts, Insertion Sort is generally faster in practice due to fewer comparisons and better cache behavior.
- **Parallel computing:** The sequential nature of the adjacent comparisons makes it poorly suited for parallelization. Consider Bitonic Sort or parallel merge sort instead.

## Comparison

| Algorithm      | Time (avg) | Time (best) | Space | Stable | Turtles Handled |
|----------------|-----------|-------------|-------|--------|-----------------|
| Cocktail Sort  | O(n^2)    | O(n)        | O(1)  | Yes    | Yes |
| Bubble Sort    | O(n^2)    | O(n)        | O(1)  | Yes    | No |
| Insertion Sort | O(n^2)    | O(n)        | O(1)  | Yes    | N/A |
| Shell Sort     | O(n^1.5)  | O(n log n)  | O(1)  | No     | N/A |
| Comb Sort      | O(n^2)    | O(n log n)  | O(1)  | No     | Yes (via gaps) |

## Implementations

| Language   | File |
|------------|------|
| Java       | [CocktailSort.java](java/CocktailSort.java) |
| C++        | [cocktail_sort.cpp](cpp/cocktail_sort.cpp) |
| C          | [cocktail_sort.c](c/cocktail_sort.c) |

## References

- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.2: Sorting by Exchanging.
- [Cocktail Shaker Sort -- Wikipedia](https://en.wikipedia.org/wiki/Cocktail_shaker_sort)
- Astrachan, O. (2003). "Bubble Sort: An Archaeological Algorithmic Analysis." *ACM SIGCSE Bulletin*, 35(1), 1-5.
