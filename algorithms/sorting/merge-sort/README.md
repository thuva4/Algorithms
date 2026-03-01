# Merge Sort

## Overview

Merge Sort is an efficient, stable, comparison-based sorting algorithm that follows the divide-and-conquer paradigm. It works by recursively dividing the array into two halves, sorting each half, and then merging the sorted halves back together. The algorithm was invented by John von Neumann in 1945 and remains one of the most important sorting algorithms in computer science.

Merge Sort guarantees O(n log n) performance in all cases (best, average, and worst), making it highly predictable. Its main trade-off is that it requires O(n) additional space for the merging step, unlike in-place algorithms such as Quick Sort or Heap Sort.

## How It Works

Merge Sort operates in two phases. In the **divide** phase, the array is recursively split in half until each subarray contains a single element (which is inherently sorted). In the **merge** phase, adjacent sorted subarrays are merged by comparing their elements one by one and building a new sorted array. The merge operation is the heart of the algorithm -- it combines two sorted sequences into one sorted sequence in linear time.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Divide Phase:**

```
                [5, 3, 8, 1, 2]
               /               \
          [5, 3, 8]           [1, 2]
          /      \            /    \
       [5, 3]   [8]        [1]   [2]
       /    \
     [5]   [3]
```

**Merge Phase (bottom-up):**

**Merge 1:** Merge `[5]` and `[3]`

| Step | Left | Right | Comparison | Action | Result So Far |
|------|------|-------|------------|--------|---------------|
| 1 | `5` | `3` | 3 < 5 | Take `3` from right | `[3]` |
| 2 | `5` | -- | Left remaining | Take `5` | `[3, 5]` |

Result: `[3, 5]`

**Merge 2:** Merge `[3, 5]` and `[8]`

| Step | Left | Right | Comparison | Action | Result So Far |
|------|------|-------|------------|--------|---------------|
| 1 | `3` | `8` | 3 < 8 | Take `3` from left | `[3]` |
| 2 | `5` | `8` | 5 < 8 | Take `5` from left | `[3, 5]` |
| 3 | -- | `8` | Right remaining | Take `8` | `[3, 5, 8]` |

Result: `[3, 5, 8]`

**Merge 3:** Merge `[1]` and `[2]`

| Step | Left | Right | Comparison | Action | Result So Far |
|------|------|-------|------------|--------|---------------|
| 1 | `1` | `2` | 1 < 2 | Take `1` from left | `[1]` |
| 2 | -- | `2` | Right remaining | Take `2` | `[1, 2]` |

Result: `[1, 2]`

**Merge 4:** Merge `[3, 5, 8]` and `[1, 2]`

| Step | Left | Right | Comparison | Action | Result So Far |
|------|------|-------|------------|--------|---------------|
| 1 | `3` | `1` | 1 < 3 | Take `1` from right | `[1]` |
| 2 | `3` | `2` | 2 < 3 | Take `2` from right | `[1, 2]` |
| 3 | `3` | -- | Left remaining | Take `3, 5, 8` | `[1, 2, 3, 5, 8]` |

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function mergeSort(array):
    if length(array) <= 1:
        return array

    mid = length(array) / 2
    left = mergeSort(array[0..mid])
    right = mergeSort(array[mid..end])

    return merge(left, right)

function merge(left, right):
    result = []
    i = 0
    j = 0

    while i < length(left) and j < length(right):
        if left[i] <= right[j]:
            append left[i] to result
            i = i + 1
        else:
            append right[j] to result
            j = j + 1

    // Append remaining elements
    append left[i..end] to result
    append right[j..end] to result

    return result
```

The `<=` comparison in the merge function (rather than `<`) ensures stability: when two elements are equal, the one from the left subarray is taken first, preserving their original relative order.

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n log n):** Even when the array is already sorted, Merge Sort still divides the array into halves (log n levels of recursion) and merges them back together. Each merge level processes all n elements. While the merge step may complete faster on sorted data (fewer comparisons), the overall work is still proportional to n log n.

- **Average Case -- O(n log n):** The array is divided into halves log n times, and at each level the merge operation processes all n elements. The total work is n * log n. This is consistent regardless of the input distribution because the divide step is always balanced.

- **Worst Case -- O(n log n):** Unlike Quick Sort, Merge Sort always divides the array exactly in half, so the recursion tree is always balanced with log n levels. Each level requires O(n) work for merging, giving O(n log n) total. There is no pathological input that degrades performance.

- **Space -- O(n):** The merge step requires a temporary array to hold the merged result. At any point during execution, the total extra space used is proportional to n. Although the recursion stack uses O(log n) space, the dominant space cost is the O(n) auxiliary array.

## When to Use

- **When guaranteed O(n log n) performance is required:** Merge Sort has no worst-case degradation, unlike Quick Sort's O(n^2) worst case. This makes it ideal for applications where predictable performance is critical.
- **When stability is required:** Merge Sort is a stable sort, preserving the relative order of equal elements. This is important when sorting by multiple keys.
- **Sorting linked lists:** Merge Sort is particularly well-suited for linked lists because the merge operation can be done in-place (without extra space) by relinking nodes, and random access (which linked lists lack) is not needed.
- **External sorting:** When data is too large to fit in memory, Merge Sort's sequential access pattern makes it ideal for sorting data on disk or tape.
- **Parallel computing:** The independent recursive calls make Merge Sort naturally parallelizable.

## When NOT to Use

- **When space is limited:** Merge Sort requires O(n) additional space for arrays, which can be prohibitive for very large datasets that barely fit in memory.
- **Small datasets:** The overhead of recursion and array copying makes Merge Sort slower than simpler algorithms like Insertion Sort on small inputs (typically fewer than 30-50 elements).
- **When in-place sorting is required:** Standard Merge Sort is not in-place. In-place merge sort variants exist but are significantly more complex and slower in practice.
- **When average-case speed is more important than worst-case guarantees:** Quick Sort is often faster in practice due to better cache locality and lower constant factors.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)  | Space    | Stable | Notes                                       |
|----------------|------------|----------|--------|---------------------------------------------|
| Merge Sort     | O(n log n) | O(n)     | Yes    | Guaranteed O(n log n); needs extra space     |
| Quick Sort     | O(n log n) | O(log n) | No     | Faster in practice; O(n^2) worst case        |
| Heap Sort      | O(n log n) | O(1)     | No     | In-place; poor cache locality                |

## Implementations

| Language   | File |
|------------|------|
| Python     | [merge_sort.py](python/merge_sort.py) |
| Java       | [MergeSort.java](java/MergeSort.java) |
| C++        | [merge_sort.cpp](cpp/merge_sort.cpp) |
| C          | [merge_sort.c](c/merge_sort.c) |
| Go         | [merge_sort.go](go/merge_sort.go) |
| TypeScript | [mergeSort.ts](typescript/mergeSort.ts) |
| Kotlin     | [MergeSort.kt](kotlin/MergeSort.kt) |
| Rust       | [merge_sort.rs](rust/merge_sort.rs) |
| Swift      | [MergeSort.swift](swift/MergeSort.swift) |
| Scala      | [MergeSort.scala](scala/MergeSort.scala) |
| C#         | [MergeSort.cs](csharp/MergeSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started (Section 2.3: Designing Algorithms -- Merge Sort).
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.4: Sorting by Merging.
- [Merge Sort -- Wikipedia](https://en.wikipedia.org/wiki/Merge_sort)
