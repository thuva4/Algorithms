# Quick Select

## Overview

Quick Select is a selection algorithm that finds the k-th smallest (or largest) element in an unordered list. It is closely related to Quick Sort and uses the same partitioning strategy, but instead of recursing into both halves, Quick Select only recurses into the half that contains the desired element. This optimization gives it an average-case linear time complexity of O(n), making it significantly faster than sorting the entire array just to find one element.

Quick Select was developed by Tony Hoare (the inventor of Quick Sort) in 1961 and is widely used in practice for order statistics problems, such as finding medians or percentiles.

## How It Works

Quick Select uses a partition function to rearrange elements around a pivot. After partitioning, the pivot is in its final sorted position. If the pivot's position matches k, the algorithm returns the pivot. If k is less than the pivot position, the algorithm recurses on the left partition. If k is greater, it recurses on the right partition. Unlike Quick Sort, only one recursive call is made per step.

### Example

Given input: `[7, 3, 1, 5, 9, 2, 8]`, find the 3rd smallest element (k = 2, 0-indexed)

**Step 1:** Choose pivot = `8` (last element), partition around it.

| Action | Array State |
|--------|-------------|
| Initial | `[7, 3, 1, 5, 9, 2, 8]` |
| After partitioning | `[7, 3, 1, 5, 2, 8, 9]` |
| Pivot index = 5 | `8` is at position 5 |

k = 2 < 5, so recurse on left partition: `[7, 3, 1, 5, 2]`

**Step 2:** Choose pivot = `2` (last element), partition around it.

| Action | Array State |
|--------|-------------|
| Initial subarray | `[7, 3, 1, 5, 2]` |
| After partitioning | `[1, 2, 7, 5, 3]` |
| Pivot index = 1 | `2` is at position 1 |

k = 2 > 1, so recurse on right partition: `[7, 5, 3]` (starting from index 2)

**Step 3:** Choose pivot = `3` (last element), partition around it.

| Action | Array State |
|--------|-------------|
| Initial subarray | `[7, 5, 3]` |
| After partitioning | `[3, 5, 7]` |
| Pivot index = 2 | `3` is at position 2 |

k = 2 == pivot index. Return `3`.

Result: The 3rd smallest element is `3`.

## Pseudocode

```
function quickSelect(array, low, high, k):
    if low == high:
        return array[low]

    pivotIndex = partition(array, low, high)

    if k == pivotIndex:
        return array[k]
    else if k < pivotIndex:
        return quickSelect(array, low, pivotIndex - 1, k)
    else:
        return quickSelect(array, pivotIndex + 1, high, k)

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

The key insight is that partitioning takes O(n), and we only recurse on one side, giving expected sizes of n, n/2, n/4, ..., which sum to approximately 2n = O(n).

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n)   | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** The pivot perfectly partitions the array such that the k-th element is found after the first partition. The partition operation itself scans all n elements once, giving O(n).

- **Average Case -- O(n):** With a random pivot, the expected partition splits the array roughly in half. The work done is n + n/2 + n/4 + ... = 2n, which is O(n). This is formally proven using expectation analysis similar to Quick Sort's average-case proof.

- **Worst Case -- O(n^2):** If the pivot is always the smallest or largest element (e.g., already sorted input with last-element pivot), the partition only reduces the problem size by 1 each time. This gives n + (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n^2). This can be mitigated by using randomized pivot selection or the Median of Medians algorithm for guaranteed O(n) worst case.

- **Space -- O(1):** Quick Select operates in-place, modifying the array directly. The iterative version uses constant space. The recursive version uses O(log n) stack space on average, or O(n) in the worst case.

## When to Use

- **Finding the k-th smallest/largest element:** Quick Select is the standard algorithm for this problem, faster than sorting the entire array.
- **Finding the median:** Quick Select with k = n/2 finds the median in expected O(n) time.
- **Computing percentiles and order statistics:** Any rank-based query on unsorted data benefits from Quick Select.
- **Partial sorting:** When you need the top-k or bottom-k elements without fully sorting.
- **When average-case performance is acceptable:** The O(n) average case makes Quick Select excellent for most practical inputs.

## When NOT to Use

- **When worst-case guarantees are needed:** The O(n^2) worst case can be problematic for adversarial inputs. Use Median of Medians (Introselect) for guaranteed O(n).
- **When the original array must not be modified:** Quick Select rearranges elements in-place. If the original order must be preserved, a copy is needed.
- **When multiple order statistics are needed simultaneously:** Sorting (O(n log n)) once and then looking up any rank in O(1) is better than running Quick Select multiple times.
- **Very small arrays:** For tiny arrays, simply sorting and indexing is simpler and has negligible performance difference.

## Comparison with Similar Algorithms

| Algorithm        | Time (avg) | Space | Notes                                    |
|------------------|-----------|-------|------------------------------------------|
| Quick Select     | O(n)      | O(1)  | Fast average case; O(n^2) worst case     |
| Median of Medians| O(n)      | O(n)  | Guaranteed O(n); higher constant factor  |
| Sort + Index     | O(n log n)| O(1)* | Simple but slower; full sort is wasteful |
| Heap-based       | O(n log k)| O(k)  | Good when k is small relative to n       |

## Implementations

| Language   | File |
|------------|------|
| Go         | [QuickSelect.go](go/QuickSelect.go) |
| Java       | [QuickSelect.java](java/QuickSelect.java) |
| Python     | [quickselect-python.py](python/quickselect-python.py) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 9: Medians and Order Statistics.
- Hoare, C. A. R. (1961). "Algorithm 65: Find". *Communications of the ACM*. 4(7): 321-322.
- [Quickselect -- Wikipedia](https://en.wikipedia.org/wiki/Quickselect)
