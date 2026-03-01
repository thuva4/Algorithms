# Longest Bitonic Subsequence

## Overview

A bitonic subsequence is a subsequence that first increases and then decreases. The Longest Bitonic Subsequence (LBS) problem asks for the length of the longest such subsequence in a given array. For example, in the array [1, 11, 2, 10, 4, 5, 2, 1], one longest bitonic subsequence is [1, 2, 10, 4, 2, 1] with length 6. A purely increasing or purely decreasing subsequence is also considered bitonic.

This problem is an elegant extension of the Longest Increasing Subsequence (LIS) problem. It combines forward and backward LIS computations to find the peak element around which the subsequence transitions from increasing to decreasing.

## How It Works

The algorithm computes two arrays: `lis[i]` stores the length of the longest increasing subsequence ending at index `i` (computed left to right), and `lds[i]` stores the length of the longest decreasing subsequence starting at index `i` (computed right to left, equivalently the LIS from the right). The length of the longest bitonic subsequence with peak at index `i` is `lis[i] + lds[i] - 1` (subtracting 1 because the peak element is counted in both). The answer is the maximum over all indices.

### Example

Given input: `[1, 11, 2, 10, 4, 5, 2, 1]`

**Step 1: Compute LIS (left to right):**

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|-------|---|---|---|---|---|---|---|---|
| Value | 1 | 11| 2 | 10| 4 | 5 | 2 | 1 |
| lis[] | 1 | 2 | 2 | 3 | 3 | 4 | 2 | 1 |

- lis[3] = 3: subsequence [1, 2, 10]
- lis[5] = 4: subsequence [1, 2, 4, 5]

**Step 2: Compute LDS (right to left, i.e., LIS from right):**

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|-------|---|---|---|---|---|---|---|---|
| Value | 1 | 11| 2 | 10| 4 | 5 | 2 | 1 |
| lds[] | 1 | 5 | 2 | 4 | 3 | 3 | 2 | 1 |

- lds[1] = 5: subsequence [11, 10, 5, 2, 1]
- lds[3] = 4: subsequence [10, 4, 2, 1]

**Step 3: Compute LBS at each position:**

| Index | lis[i] | lds[i] | lis[i]+lds[i]-1 |
|-------|--------|--------|-----------------|
| 0 | 1 | 1 | 1 |
| 1 | 2 | 5 | 6 |
| 2 | 2 | 2 | 3 |
| 3 | 3 | 4 | 6 |
| 4 | 3 | 3 | 5 |
| 5 | 4 | 3 | 6 |
| 6 | 2 | 2 | 3 |
| 7 | 1 | 1 | 1 |

Result: Maximum LBS = `6` (at indices 1, 3, or 5 as peak)

## Pseudocode

```
function longestBitonicSubsequence(arr):
    n = length(arr)
    lis = array of size n, all initialized to 1
    lds = array of size n, all initialized to 1

    // Compute LIS for each index (left to right)
    for i from 1 to n - 1:
        for j from 0 to i - 1:
            if arr[j] < arr[i] and lis[j] + 1 > lis[i]:
                lis[i] = lis[j] + 1

    // Compute LDS for each index (right to left)
    for i from n - 2 down to 0:
        for j from n - 1 down to i + 1:
            if arr[j] < arr[i] and lds[j] + 1 > lds[i]:
                lds[i] = lds[j] + 1

    // Find maximum bitonic subsequence length
    max_len = 0
    for i from 0 to n - 1:
        max_len = max(max_len, lis[i] + lds[i] - 1)

    return max_len
```

The algorithm runs LIS twice (once forward, once backward) and combines the results. Using the binary search optimization for LIS, each pass can be done in O(n log n).

## Complexity Analysis

| Case    | Time       | Space |
|---------|-----------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n log n):** Using the binary search optimization for LIS, each of the two passes (forward LIS and backward LIS) takes O(n log n). The final combination step is O(n).

- **Average Case -- O(n log n):** The two LIS computations dominate. Each processes n elements with O(log n) binary search per element.

- **Worst Case -- O(n log n):** The binary search approach maintains consistent O(n log n) performance regardless of input ordering. The naive O(n^2) LIS approach would give O(n^2) overall.

- **Space -- O(n):** Two arrays of size n (for lis and lds values) plus the tails arrays for binary search LIS, all of which are O(n).

## When to Use

- **Finding mountain-shaped patterns:** When you need to find the longest subsequence that rises then falls in data.
- **Signal processing:** Identifying the longest unimodal trend in time series data.
- **As a building block:** The bitonic subsequence concept extends to problems involving convex hull tricks and optimization.
- **When the input may have both increasing and decreasing trends:** LBS captures the longest combined trend.

## When NOT to Use

- **When you only need increasing or decreasing subsequences:** Use LIS directly for simpler and faster results.
- **When the subsequence must be contiguous:** Use sliding window or other array-based approaches instead.
- **When the definition of bitonic includes multiple peaks:** The standard LBS only handles single-peak sequences.

## Comparison with Similar Algorithms

| Algorithm                    | Time       | Space | Notes                                         |
|-----------------------------|-----------|-------|-----------------------------------------------|
| Longest Bitonic Subsequence  | O(n log n)| O(n)  | Combines forward and backward LIS              |
| Longest Increasing Subseq   | O(n log n)| O(n)  | Only increasing; simpler problem               |
| Longest Decreasing Subseq   | O(n log n)| O(n)  | Reverse of LIS                                 |
| Kadane's Algorithm           | O(n)      | O(1)  | Maximum subarray sum; different problem         |

## Implementations

| Language | File |
|----------|------|
| C++      | [LongestBitonicSubsequence.cpp](cpp/LongestBitonicSubsequence.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- [Longest Bitonic Subsequence -- GeeksforGeeks](https://www.geeksforgeeks.org/longest-bitonic-subsequence-dp-15/)
- [Bitonic Sequence -- Wikipedia](https://en.wikipedia.org/wiki/Bitonic_sorter)
