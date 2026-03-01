# Comb Sort

## Overview

Comb Sort is an improvement over Bubble Sort that eliminates "turtles" -- small values near the end of the array that slow Bubble Sort down because they can only move one position per pass. Comb Sort achieves this by comparing and swapping elements that are a certain gap apart, and gradually shrinking this gap by a shrink factor (typically 1.3) until it reaches 1, at which point the algorithm becomes a standard Bubble Sort pass.

Comb Sort was invented by Wlodzimierz Dobosiewicz in 1980 and later rediscovered and popularized by Stephen Lacey and Richard Box in 1991. The shrink factor of 1.3 was empirically determined to give the best performance for most inputs.

## How It Works

1. Initialize the gap to the array length.
2. Shrink the gap by dividing by the shrink factor (1.3), rounding down to the nearest integer.
3. If the gap becomes 0, set it to 1.
4. Iterate through the array, comparing and swapping elements separated by the gap.
5. Repeat steps 2-4 until the gap is 1 and no swaps occurred in the last pass.

## Worked Example

Given input: `[8, 4, 1, 56, 3, -44, 23, -6, 28, 0]` (length 10)

**Pass 1** (gap = floor(10/1.3) = 7):

| Compare indices | Elements    | Action  |
|----------------|-------------|---------|
| 0 and 7        | 8 and -6    | Swap    |
| 1 and 8        | 4 and 28    | No swap |
| 2 and 9        | 1 and 0     | Swap    |

Array: `[-6, 4, 0, 56, 3, -44, 23, 8, 28, 1]`

**Pass 2** (gap = floor(7/1.3) = 5):

| Compare indices | Elements     | Action  |
|----------------|-------------- |---------|
| 0 and 5        | -6 and -44   | Swap    |
| 1 and 6        | 4 and 23     | No swap |
| 2 and 7        | 0 and 8      | No swap |
| 3 and 8        | 56 and 28    | Swap    |
| 4 and 9        | 3 and 1      | Swap    |

Array: `[-44, 4, 0, 28, 1, -6, 23, 8, 56, 3]`

The algorithm continues shrinking the gap (3, 2, 1) until the array is fully sorted: `[-44, -6, 0, 1, 3, 4, 8, 23, 28, 56]`.

## Pseudocode

```
function combSort(array):
    n = length(array)
    gap = n
    shrink = 1.3
    sorted = false

    while not sorted:
        gap = floor(gap / shrink)
        if gap <= 1:
            gap = 1
            sorted = true    // will exit if no swaps occur

        for i from 0 to n - gap - 1:
            if array[i] > array[i + gap]:
                swap(array[i], array[i + gap])
                sorted = false

    return array
```

## Complexity Analysis

| Case    | Time           | Space |
|---------|---------------|-------|
| Best    | O(n log n)     | O(1)  |
| Average | O(n^2 / 2^p)  | O(1)  |
| Worst   | O(n^2)         | O(1)  |

**Why these complexities?**

- **Best Case -- O(n log n):** When the array is already nearly sorted, the large-gap passes require few or no swaps, and the number of gap values is O(log n). Each pass through the array is O(n), giving O(n log n).

- **Average Case -- O(n^2 / 2^p):** The shrink factor ensures that the algorithm makes multiple passes with decreasing gaps. The notation 2^p reflects the number of increments. In practice, Comb Sort performs significantly better than Bubble Sort, roughly on par with Shell Sort for random data.

- **Worst Case -- O(n^2):** When the gap sequence does not effectively eliminate inversions, the final gap-1 passes may still require O(n^2) comparisons, similar to Bubble Sort.

- **Space -- O(1):** Comb Sort is an in-place algorithm that only needs a constant amount of extra space for the gap variable and swap operations.

## When to Use

- **As a simple improvement over Bubble Sort:** If you need a straightforward sorting algorithm that is significantly faster than Bubble Sort with minimal additional complexity.
- **When in-place sorting is needed:** Comb Sort uses O(1) extra space.
- **Moderate-sized datasets:** For arrays of a few thousand elements, Comb Sort offers reasonable performance.
- **Educational contexts:** It clearly demonstrates how gap-based comparisons can dramatically improve exchange-based sorting.

## When NOT to Use

- **Large datasets:** For large arrays, O(n log n) algorithms like Quick Sort, Merge Sort, or Heap Sort are far superior.
- **When stability is required:** Comb Sort is not a stable sort; it may change the relative order of equal elements.
- **When guaranteed O(n log n) is needed:** Comb Sort's worst case is O(n^2), which is unacceptable for performance-critical applications.
- **When better Shell Sort gap sequences are available:** Shell Sort with a well-chosen gap sequence typically outperforms Comb Sort.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)    | Space | Stable | Notes                                          |
|----------------|--------------|-------|--------|-------------------------------------------------|
| Comb Sort      | O(n^2 / 2^p) | O(1)  | No     | Gap-based improvement over Bubble Sort           |
| Bubble Sort    | O(n^2)        | O(1)  | Yes    | Simpler but much slower                          |
| Shell Sort     | O(n^(4/3))    | O(1)  | No     | Similar gap concept; usually faster              |
| Insertion Sort | O(n^2)        | O(1)  | Yes    | Better for nearly sorted data                    |
| Quick Sort     | O(n log n)    | O(log n) | No  | Much faster for large datasets                   |

## Implementations

| Language   | File |
|------------|------|
| Python     | [comb_sort.py](python/comb_sort.py) |
| Java       | [CombSort.java](java/CombSort.java) |
| C++        | [comb_sort.cpp](cpp/comb_sort.cpp) |
| C          | [comb_sort.c](c/comb_sort.c) |
| Go         | [comb_sort.go](go/comb_sort.go) |
| TypeScript | [combSort.ts](typescript/combSort.ts) |
| Rust       | [comb_sort.rs](rust/comb_sort.rs) |
| Kotlin     | [CombSort.kt](kotlin/CombSort.kt) |
| Swift      | [CombSort.swift](swift/CombSort.swift) |
| Scala      | [CombSort.scala](scala/CombSort.scala) |
| C#         | [CombSort.cs](csharp/CombSort.cs) |

## References

- Lacey, S., & Box, R. (1991). "A fast, easy sort." *BYTE Magazine*, 16(4), 315-320.
- Dobosiewicz, W. (1980). "An efficient variation of bubble sort." *Information Processing Letters*, 11(1), 5-6.
- [Comb Sort -- Wikipedia](https://en.wikipedia.org/wiki/Comb_sort)
