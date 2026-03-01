# Tim Sort

## Overview

Tim Sort is a hybrid sorting algorithm derived from merge sort and insertion sort. It was designed by Tim Peters in 2002 for use in the Python programming language. Tim Sort first divides the array into small runs and sorts them using insertion sort, then merges the runs using a modified merge sort. It is the default sorting algorithm in Python (`sorted()`, `list.sort()`), Java (`Arrays.sort()` for objects), and many other languages and libraries.

Tim Sort is specifically optimized for real-world data, which often contains pre-existing ordered subsequences (natural runs). By detecting and exploiting these runs, Tim Sort achieves O(n) performance on already-sorted or nearly-sorted data while maintaining O(n log n) worst-case guarantees.

## How It Works

1. **Compute the minimum run size:** Choose a run size (typically 32-64) such that the total number of runs is a power of 2 or close to it, optimizing the merge phase.
2. **Identify and extend runs:** Scan the array for natural ascending or descending runs. If a run is shorter than the minimum run size, extend it using binary insertion sort.
3. **Sort small runs:** Apply insertion sort to each run. Insertion sort is efficient for small arrays due to low overhead and good cache locality.
4. **Merge runs:** Push sorted runs onto a stack and merge them according to specific invariants (the "merge policy"). The invariants ensure that runs on the stack satisfy certain size relationships, preventing pathological merge patterns:
   - If there are 3 runs A, B, C on the stack: `|A| > |B| + |C|` and `|B| > |C|`
5. **Galloping mode:** During merging, if one run consistently "wins" comparisons (providing elements to the merged output), the algorithm switches to galloping mode, using exponential search to find the next merge point. This dramatically speeds up merges when runs have little interleaving.

### Example

Given input: `[29, 25, 3, 49, 9, 37, 21, 43]` with min run size 4:

**Step 1 -- Identify and sort runs:**
- Run 1: `[29, 25, 3, 49]` -- Sort with insertion sort: `[3, 25, 29, 49]`
- Run 2: `[9, 37, 21, 43]` -- Sort with insertion sort: `[9, 21, 37, 43]`

**Step 2 -- Merge runs:**
- Merge `[3, 25, 29, 49]` and `[9, 21, 37, 43]`:

| Compare | Take | Merged So Far |
|---------|------|---------------|
| 3 vs 9 | 3 | `[3]` |
| 25 vs 9 | 9 | `[3, 9]` |
| 25 vs 21 | 21 | `[3, 9, 21]` |
| 25 vs 37 | 25 | `[3, 9, 21, 25]` |
| 29 vs 37 | 29 | `[3, 9, 21, 25, 29]` |
| 49 vs 37 | 37 | `[3, 9, 21, 25, 29, 37]` |
| 49 vs 43 | 43 | `[3, 9, 21, 25, 29, 37, 43]` |
| 49 (remaining) | 49 | `[3, 9, 21, 25, 29, 37, 43, 49]` |

Result: `[3, 9, 21, 25, 29, 37, 43, 49]`

## Pseudocode

```
function timSort(array):
    n = length(array)
    minRun = computeMinRun(n)

    // Step 1: Sort individual runs using insertion sort
    for start from 0 to n - 1, step minRun:
        end = min(start + minRun - 1, n - 1)
        insertionSort(array, start, end)

    // Step 2: Merge runs, doubling the size each iteration
    size = minRun
    while size < n:
        for left from 0 to n - 1, step 2 * size:
            mid = min(left + size - 1, n - 1)
            right = min(left + 2 * size - 1, n - 1)
            if mid < right:
                merge(array, left, mid, right)
        size = size * 2

    return array

function computeMinRun(n):
    r = 0
    while n >= 64:
        r = r OR (n AND 1)
        n = n >> 1
    return n + r

function merge(array, left, mid, right):
    // Standard merge of two sorted subarrays
    leftArr = copy of array[left..mid]
    rightArr = copy of array[mid+1..right]
    // Merge leftArr and rightArr back into array[left..right]
    // (with optional galloping mode optimization)
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n)       | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n):** When the data is already sorted (or reverse sorted), Tim Sort detects the entire input as a single natural run. Only one pass is needed to identify the run, with no merging required. This gives O(n) time.

- **Average Case -- O(n log n):** The merge phase dominates. With O(n/minRun) runs, the merge tree has O(log(n/minRun)) = O(log n) levels, and each level processes all n elements. Galloping mode further reduces comparisons in practice.

- **Worst Case -- O(n log n):** Even with random data and no natural runs, Tim Sort degrades gracefully. The insertion sort phase is O(minRun^2) per run and O(n * minRun) total (where minRun is constant, e.g., 32), and the merge phase is O(n log n).

- **Space -- O(n):** The merge operation requires a temporary array. Tim Sort optimizes this by only copying the smaller of the two runs being merged, but worst case still requires O(n) auxiliary space.

## Applications

- Default sort in Python (`sorted()`, `list.sort()`)
- Default sort in Java (`Arrays.sort()` for objects)
- Default sort in Android, Swift, and Rust standard libraries
- General-purpose sorting where stability is required
- Sorting nearly sorted data efficiently (log files, time-series data, incrementally updated lists)

## When NOT to Use

- **Extremely memory-constrained environments:** Tim Sort requires O(n) auxiliary space. If memory is critical, use an in-place sort like heap sort or quicksort.
- **When stability is not needed and raw speed matters:** Quicksort (introsort) has lower constant factors on random data due to better cache locality and no merge buffer allocation.
- **Small fixed-size arrays:** For arrays of fewer than ~10 elements, a simple insertion sort or sorting network has less overhead.
- **Integer sorting with bounded range:** Non-comparison sorts like counting sort or radix sort are asymptotically faster (O(n)) for integer data.

## Comparison

| Algorithm      | Time (avg)  | Time (best) | Space  | Stable | Adaptive |
|----------------|------------|-------------|--------|--------|----------|
| Tim Sort       | O(n log n) | O(n)        | O(n)   | Yes    | Yes |
| Merge Sort     | O(n log n) | O(n log n)  | O(n)   | Yes    | No |
| Quick Sort     | O(n log n) | O(n log n)  | O(log n) | No   | No |
| Heap Sort      | O(n log n) | O(n log n)  | O(1)   | No     | No |
| Insertion Sort | O(n^2)     | O(n)        | O(1)   | Yes    | Yes |
| Introsort      | O(n log n) | O(n log n)  | O(log n) | No   | No |

## Implementations

| Language   | File |
|------------|------|
| Python     | [tim_sort.py](python/tim_sort.py) |
| Java       | [TimSort.java](java/TimSort.java) |
| C++        | [tim_sort.cpp](cpp/tim_sort.cpp) |
| C          | [tim_sort.c](c/tim_sort.c) |
| Go         | [tim_sort.go](go/tim_sort.go) |
| TypeScript | [timSort.ts](typescript/timSort.ts) |
| Rust       | [tim_sort.rs](rust/tim_sort.rs) |
| Kotlin     | [TimSort.kt](kotlin/TimSort.kt) |
| Swift      | [TimSort.swift](swift/TimSort.swift) |
| Scala      | [TimSort.scala](scala/TimSort.scala) |
| C#         | [TimSort.cs](csharp/TimSort.cs) |

## References

- Peters, T. (2002). "[Timsort] listsort.txt." CPython source code documentation. Available at: https://github.com/python/cpython/blob/main/Objects/listsort.txt
- Auger, N., Nicaud, C., & Pivoteau, C. (2018). "Merge Strategies: From Merge Sort to TimSort." *HAL Archives*.
- McIlroy, P. (1993). "Optimistic Sorting and Information Theoretic Complexity." *SODA*, 467-474.
- [Timsort -- Wikipedia](https://en.wikipedia.org/wiki/Timsort)
