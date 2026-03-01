# Counting Inversions

## Overview

An inversion in an array is a pair of elements (a[i], a[j]) where i < j but a[i] > a[j] -- that is, a larger element appears before a smaller one. The inversion count measures how far an array is from being sorted. A sorted array has 0 inversions, while a reverse-sorted array has the maximum number of inversions: n(n-1)/2. For example, the array [2, 4, 1, 3, 5] has 3 inversions: (2,1), (4,1), and (4,3).

Counting inversions has applications in ranking analysis (measuring disagreement between two rankings), computational biology (comparing gene orders), and recommendation systems (measuring similarity between user preferences). The divide-and-conquer approach counts inversions in O(n log n) time using a modified merge sort.

## How It Works

The algorithm is a modified merge sort. It divides the array in half, recursively counts inversions in each half, and then counts "split inversions" (where one element is in the left half and the other is in the right half) during the merge step. When merging, every time an element from the right half is placed before remaining elements from the left half, it indicates inversions equal to the number of remaining left-half elements.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Divide-and-conquer tree:**

```
                [5, 3, 8, 1, 2]
               /               \
         [5, 3, 8]          [1, 2]
         /      \            / \
      [5, 3]   [8]        [1] [2]
      /   \
    [5]   [3]
```

**Merge and count (bottom-up):**

| Step | Left | Right | Merge process | Split inversions | Result |
|------|------|-------|--------------|-----------------|--------|
| 1 | [5] | [3] | 3 < 5: pick 3 (1 inv), then 5 | 1 | [3, 5] |
| 2 | [3, 5] | [8] | 3, 5, 8 (no inversions) | 0 | [3, 5, 8] |
| 3 | [1] | [2] | 1, 2 (no inversions) | 0 | [1, 2] |
| 4 | [3, 5, 8] | [1, 2] | See below | 5 | [1, 2, 3, 5, 8] |

**Detailed merge of step 4: [3, 5, 8] and [1, 2]:**

| Compare | Pick | Inversions added | Reasoning |
|---------|------|-----------------|-----------|
| 3 vs 1 | 1 (from right) | +3 | 1 is less than 3 remaining left elements (3, 5, 8) |
| 3 vs 2 | 2 (from right) | +2 | 2 is less than 2 remaining left elements (3, 5... wait, 3 remaining: 3, 5, 8) |

Let me redo step 4 carefully:

| Step | Left pointer | Right pointer | Pick | Inversions | Remaining left |
|------|-------------|--------------|------|-----------|----------------|
| a | L=3 | R=1 | R: 1 | +3 (all 3 left elements) | [3, 5, 8] |
| b | L=3 | R=2 | R: 2 | +3 (all 3 left elements) | [3, 5, 8] |
| c | L=3 | Right exhausted | L: 3 | 0 | [5, 8] |
| d | L=5 | Right exhausted | L: 5 | 0 | [8] |
| e | L=8 | Right exhausted | L: 8 | 0 | [] |

Wait -- correcting: after picking 1, right pointer moves to 2. After picking 2, right is exhausted. So inversions from step 4 = 3 + 3 = 6? Let me recalculate.

Actually with [3, 5, 8] and [1, 2]:
- Pick 1 (right), remaining left = 3 elements, inversions += 3
- Pick 2 (right), remaining left = 3 elements, inversions += 3
- Pick 3, 5, 8 from left, no inversions

Split inversions in step 4 = 3 + 3 = 6? But that seems high. Let me verify:
Pairs with elements from left [3,5,8] and right [1,2]: (3,1), (3,2), (5,1), (5,2), (8,1), (8,2) -- that is 6 split inversions. But (3,2) IS an inversion since 3 > 2. Yes, all 6 are valid.

**Total inversions:** 1 (step 1) + 0 (step 2) + 0 (step 3) + 6 (step 4) = `7`

**Verification (brute force):** (5,3), (5,1), (5,2), (3,1), (3,2), (8,1), (8,2) = 7 inversions.

Result: Total inversions = `7`

## Pseudocode

```
function countInversions(arr, left, right):
    if left >= right:
        return 0

    mid = (left + right) / 2
    inversions = 0
    inversions += countInversions(arr, left, mid)
    inversions += countInversions(arr, mid + 1, right)
    inversions += mergeAndCount(arr, left, mid, right)

    return inversions

function mergeAndCount(arr, left, mid, right):
    leftArr = arr[left..mid]
    rightArr = arr[mid+1..right]
    i = 0, j = 0, k = left
    inversions = 0

    while i < length(leftArr) and j < length(rightArr):
        if leftArr[i] <= rightArr[j]:
            arr[k] = leftArr[i]
            i = i + 1
        else:
            arr[k] = rightArr[j]
            inversions += length(leftArr) - i    // key counting step
            j = j + 1
        k = k + 1

    // Copy remaining elements
    copy remaining leftArr and rightArr elements to arr

    return inversions
```

The key insight is that when an element from the right subarray is chosen during merging, it forms an inversion with all remaining elements in the left subarray (since the left subarray is already sorted).

## Complexity Analysis

| Case    | Time       | Space |
|---------|-----------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n log n):** Even if the array has 0 inversions (already sorted), the merge sort structure requires O(n log n) work to process all merge steps.

- **Average Case -- O(n log n):** The algorithm performs the same merge sort operations regardless of the number of inversions. Each of the O(log n) levels processes all n elements during merging.

- **Worst Case -- O(n log n):** A reverse-sorted array (maximum inversions) still takes O(n log n) time, which is vastly better than the O(n^2) brute-force approach.

- **Space -- O(n):** The merge step requires temporary arrays to hold the left and right halves, using O(n) additional space total.

## When to Use

- **Measuring array disorder:** Quantifying how far an array is from sorted order.
- **Ranking similarity:** Counting inversions between two rankings (e.g., Kendall tau distance).
- **When O(n^2) brute force is too slow:** For arrays with thousands or millions of elements.
- **As a sorting metric:** The inversion count directly relates to the number of swaps needed by insertion sort.

## When NOT to Use

- **Very small arrays:** For small n, the O(n^2) brute-force approach is simpler and has less overhead.
- **When you only need to know if the array is sorted:** A single linear scan suffices.
- **When you need inversions for specific pairs:** The merge-sort approach counts total inversions but does not enumerate specific pairs efficiently.
- **When the array must remain unmodified:** Merge sort modifies (sorts) the array. Make a copy first if the original order must be preserved.

## Comparison with Similar Algorithms

| Algorithm            | Time       | Space | Notes                                        |
|---------------------|-----------|-------|----------------------------------------------|
| Merge Sort Counting  | O(n log n) | O(n)  | Optimal; counts during merge sort             |
| Brute Force          | O(n^2)    | O(1)  | Simple nested loops; checks all pairs         |
| Fenwick Tree         | O(n log n) | O(n)  | Alternative approach; uses BIT for counting   |
| Divide and Conquer   | O(n log n) | O(n)  | Same as merge sort approach                   |

## Implementations

| Language | File |
|----------|------|
| C++      | [inversions_counter.cpp](cpp/inversions_counter.cpp) |
| Go       | [countinv.go](go/countinv.go) |
| Java     | [InversionsCounter.java](java/InversionsCounter.java) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 2-4: Inversions.
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Pearson. Chapter 5.3: Counting Inversions.
- [Inversion (discrete mathematics) -- Wikipedia](https://en.wikipedia.org/wiki/Inversion_(discrete_mathematics))
