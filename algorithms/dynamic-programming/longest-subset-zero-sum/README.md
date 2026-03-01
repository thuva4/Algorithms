# Longest Subset with Zero Sum

## Overview

The Longest Subset with Zero Sum problem finds the length of the longest contiguous subarray whose elements sum to zero. For example, in the array [15, -2, 2, -8, 1, 7, 10, 23], the longest zero-sum subarray is [-2, 2, -8, 1, 7] with length 5. This problem appears in financial analysis (finding periods of net-zero change), signal processing, and data analysis.

The problem can be solved efficiently using prefix sums and hash maps in O(n) time, or with the straightforward O(n^2) approach that checks all subarrays. The hash map approach works by observing that if two prefix sums are equal, the subarray between them has a sum of zero.

## How It Works

The O(n^2) approach checks every possible subarray by computing running sums. For each starting position, it extends the subarray one element at a time, tracking the sum. Whenever the sum equals zero, we update the maximum length found. The algorithm systematically explores all subarrays without missing any potential solution.

### Example

Given input: `[1, -1, 3, 2, -2, -3, 3]`

**Checking subarrays (key iterations):**

| Start | End | Subarray | Sum | Zero-sum? | Length |
|-------|-----|----------|-----|-----------|--------|
| 0 | 0 | [1] | 1 | No | - |
| 0 | 1 | [1, -1] | 0 | Yes | 2 |
| 0 | 5 | [1, -1, 3, 2, -2, -3] | 0 | Yes | 6 |
| 1 | 1 | [-1] | -1 | No | - |
| 1 | 4 | [-1, 3, 2, -2] | 2 | No | - |
| 2 | 5 | [3, 2, -2, -3] | 0 | Yes | 4 |
| 3 | 5 | [2, -2, -3] | -3 | No | - |

**Maximum length tracking:**

| Step | Found subarray | Length | Max so far |
|------|---------------|--------|------------|
| 1 | [1, -1] (indices 0-1) | 2 | 2 |
| 2 | [3, 2, -2, -3] (indices 2-5) | 4 | 4 |
| 3 | [1, -1, 3, 2, -2, -3] (indices 0-5) | 6 | 6 |

Result: Longest zero-sum subarray length = `6` (subarray `[1, -1, 3, 2, -2, -3]`)

## Pseudocode

```
function longestZeroSumSubarray(arr):
    n = length(arr)
    max_length = 0

    for i from 0 to n - 1:
        sum = 0
        for j from i to n - 1:
            sum = sum + arr[j]
            if sum == 0:
                max_length = max(max_length, j - i + 1)

    return max_length
```

An optimized O(n) approach using hash maps:

```
function longestZeroSumOptimized(arr):
    prefix_sum = 0
    max_length = 0
    map = empty hash map    // stores first occurrence of each prefix sum

    for i from 0 to n - 1:
        prefix_sum = prefix_sum + arr[i]
        if prefix_sum == 0:
            max_length = i + 1
        else if prefix_sum exists in map:
            max_length = max(max_length, i - map[prefix_sum])
        else:
            map[prefix_sum] = i

    return max_length
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n^2) | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n^2):** The brute-force approach always checks all pairs of start and end indices. Even if a zero-sum subarray is found early, the algorithm continues to search for longer ones.

- **Average Case -- O(n^2):** The nested loops iterate over all O(n^2) subarrays, with O(1) work per subarray (maintaining a running sum).

- **Worst Case -- O(n^2):** The algorithm examines n * (n+1) / 2 subarrays in total. No input can cause worse performance, but no input allows better performance either.

- **Space -- O(1):** The brute-force version uses only a running sum and max-length variable. The optimized hash map version uses O(n) space but reduces time to O(n).

## When to Use

- **Finding periods of net-zero change:** In financial data, finding the longest period where gains and losses cancel out.
- **Signal analysis:** Identifying zero-crossings or balanced segments in signal data.
- **When the subarray must be contiguous:** Unlike subset sum, this problem requires consecutive elements.
- **When input size is manageable:** The O(n^2) approach is simple and works well for arrays up to a few thousand elements.

## When NOT to Use

- **Very large arrays:** For arrays with millions of elements, use the O(n) hash map approach instead.
- **When you need non-contiguous subsets:** The subset sum problem (NP-complete) is a different problem entirely.
- **When you need a specific target sum (not zero):** The problem generalizes to finding the longest subarray with sum equal to k, requiring the hash map approach.
- **When there are floating-point values:** Exact zero-sum comparison is unreliable with floating-point arithmetic.

## Comparison with Similar Algorithms

| Algorithm                 | Time   | Space | Notes                                        |
|--------------------------|--------|-------|----------------------------------------------|
| Brute Force Zero-Sum      | O(n^2) | O(1)  | Simple; checks all subarrays                 |
| Hash Map Zero-Sum         | O(n)   | O(n)  | Optimal time; uses prefix sum + hash map      |
| Kadane's Algorithm        | O(n)   | O(1)  | Maximum sum subarray; different objective      |
| Subset Sum (general)      | O(n*S) | O(S)  | Non-contiguous; NP-complete in general         |

## Implementations

| Language | File |
|----------|------|
| C++      | [longestSubsetZeroSum.cpp](cpp/longestSubsetZeroSum.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- [Largest subarray with 0 sum -- GeeksforGeeks](https://www.geeksforgeeks.org/find-the-largest-subarray-with-0-sum/)
- [Subarray Sum Equals K -- LeetCode](https://leetcode.com/problems/subarray-sum-equals-k/)
