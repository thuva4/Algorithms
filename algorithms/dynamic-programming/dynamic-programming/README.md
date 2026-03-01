# Max 1D Range Sum

## Overview

The Max 1D Range Sum problem finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum. This is one of the most fundamental dynamic programming problems and serves as an excellent introduction to the technique. The problem was first posed by Ulf Grenander in 1977 for pattern matching in digitized images, and a linear-time solution was devised by Jay Kadane in 1984.

Given an array of n integers (which may include negative values), the goal is to find the maximum sum obtainable by selecting a contiguous subarray. If all elements are negative, the maximum subarray sum is the largest single element (or 0, depending on the problem variant).

## How It Works

1. Traverse the array from left to right, maintaining two variables: `current_sum` and `max_sum`.
2. At each position i, decide whether to extend the current subarray or start a new one from position i. This is captured by: `current_sum = max(arr[i], current_sum + arr[i])`.
3. Update `max_sum = max(max_sum, current_sum)` after each step.
4. After processing all elements, `max_sum` holds the answer.

The key insight is the optimal substructure property: the maximum subarray ending at position i is either the element at position i alone, or the element at position i combined with the maximum subarray ending at position i-1. This eliminates the need to check all O(n^2) subarrays.

## Example

Given input: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| Index | Element | current_sum | max_sum |
|-------|---------|-------------|---------|
| 0     | -2      | -2          | -2      |
| 1     | 1       | 1           | 1       |
| 2     | -3      | -2          | 1       |
| 3     | 4       | 4           | 4       |
| 4     | -1      | 3           | 4       |
| 5     | 2       | 5           | 5       |
| 6     | 1       | 6           | 6       |
| 7     | -5      | 1           | 6       |
| 8     | 4       | 5           | 6       |

Result: **6** (subarray `[4, -1, 2, 1]`)

## Pseudocode

```
function maxSubarraySum(arr, n):
    current_sum = arr[0]
    max_sum = arr[0]

    for i from 1 to n - 1:
        current_sum = max(arr[i], current_sum + arr[i])
        max_sum = max(max_sum, current_sum)

    return max_sum
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

The algorithm makes a single pass through the array, examining each element exactly once. Only two extra variables are maintained regardless of input size, so the space complexity is constant.

## When to Use

- **Maximum profit/loss problems:** Finding the best time window to buy and sell, or the most profitable consecutive period.
- **Signal processing:** Identifying the strongest contiguous signal segment in noisy data.
- **Image processing:** Grenander's original motivation -- finding the maximum-likelihood estimate of a pattern in a 1D image.
- **As a subroutine:** The 1D solution is a building block for the 2D maximum subarray problem (maximum sum rectangle in a matrix).
- **Streaming data:** The O(1) space requirement makes it suitable for processing data streams where you cannot store the entire input.

## When NOT to Use

- **Non-contiguous subsets:** If you need the maximum sum of any subset (not necessarily contiguous), simply sum all positive elements. The contiguous constraint is what makes this problem interesting.
- **Circular arrays:** The standard algorithm does not handle wrap-around. A modified approach is needed for circular variants.
- **When you need the actual subarray indices:** The basic version only returns the sum. Tracking indices requires minor modifications.

## Comparison

| Algorithm              | Time     | Space | Constraint         |
|------------------------|----------|-------|--------------------|
| Kadane's (this)        | O(n)     | O(1)  | Contiguous subarray |
| Brute Force            | O(n^2)   | O(1)  | Contiguous subarray |
| Divide and Conquer     | O(n log n) | O(log n) | Contiguous subarray |
| Prefix Sum + Min Prefix | O(n)   | O(n)  | Contiguous subarray |

Kadane's algorithm is optimal for this problem. The divide-and-conquer approach, while educational, is strictly slower. The prefix-sum approach achieves the same time complexity but uses more space.

## Implementations

| Language | File |
|----------|------|
| Java     | [Max1DRangeSum.java](java/Max1DRangeSum.java) |

## References

- Kadane, J. (1984). Maximum sum of a contiguous subsequence. *CMU Technical Report*.
- Bentley, J. (1984). "Programming Pearls: Algorithm Design Techniques." *Communications of the ACM*. 27(9): 865-873.
- [Maximum subarray problem -- Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
