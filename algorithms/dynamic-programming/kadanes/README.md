# Kadane's Algorithm

## Overview

Kadane's Algorithm finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum. For example, given the array [-2, 1, -3, 4, -1, 2, 1, -5, 4], the maximum subarray sum is 6, corresponding to the subarray [4, -1, 2, 1]. The algorithm accomplishes this in a single pass through the array with O(n) time and O(1) space.

Invented by Jay Kadane in 1984, this algorithm is a beautiful example of dynamic programming where the optimal substructure is elegantly simple: at each position, the maximum subarray ending here is either the current element alone or the current element plus the maximum subarray ending at the previous position.

## How It Works

The algorithm maintains two variables: `current_max` (the maximum sum of any subarray ending at the current position) and `global_max` (the overall maximum sum found so far). At each element, we decide whether to extend the previous subarray by including the current element, or start a new subarray from the current element. This decision is made by comparing `current_max + arr[i]` with `arr[i]` alone.

### Example

Given input: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| Step | Index | Element | current_max + element | Start fresh? | current_max | global_max |
|------|-------|---------|-----------------------|-------------|-------------|------------|
| 1 | 0 | -2 | - | Start | -2 | -2 |
| 2 | 1 | 1 | -2 + 1 = -1 | Start (1 > -1) | 1 | 1 |
| 3 | 2 | -3 | 1 + (-3) = -2 | Extend (-2 > -3) | -2 | 1 |
| 4 | 3 | 4 | -2 + 4 = 2 | Start (4 > 2) | 4 | 4 |
| 5 | 4 | -1 | 4 + (-1) = 3 | Extend (3 > -1) | 3 | 4 |
| 6 | 5 | 2 | 3 + 2 = 5 | Extend (5 > 2) | 5 | 5 |
| 7 | 6 | 1 | 5 + 1 = 6 | Extend (6 > 1) | 6 | 6 |
| 8 | 7 | -5 | 6 + (-5) = 1 | Extend (1 > -5) | 1 | 6 |
| 9 | 8 | 4 | 1 + 4 = 5 | Extend (5 > 4) | 5 | 6 |

Result: Maximum subarray sum = `6` (subarray `[4, -1, 2, 1]` at indices 3 to 6)

## Pseudocode

```
function kadane(arr):
    n = length(arr)
    current_max = arr[0]
    global_max = arr[0]

    for i from 1 to n - 1:
        current_max = max(arr[i], current_max + arr[i])
        if current_max > global_max:
            global_max = current_max

    return global_max
```

The key decision at each step is captured by `max(arr[i], current_max + arr[i])`. If the accumulated sum becomes negative, it is better to start a fresh subarray from the current element rather than carry the negative sum forward.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** The algorithm always makes a single pass through the array, examining each element exactly once. Even if all elements are positive, every element must still be checked.

- **Average Case -- O(n):** Each element requires O(1) work (one comparison and one max operation). The total work is exactly n iterations.

- **Worst Case -- O(n):** The algorithm performs the same amount of work regardless of input values. There are no nested loops or recursive calls.

- **Space -- O(1):** Only two scalar variables (`current_max` and `global_max`) are maintained. No additional data structures are needed regardless of input size.

## When to Use

- **Maximum subarray sum problems:** The canonical use case -- finding the contiguous subarray with the largest sum.
- **Stock trading problems:** Finding the maximum profit from a single buy-sell transaction (by computing differences and applying Kadane's).
- **When linear time is required:** Kadane's is optimal -- no algorithm can solve the maximum subarray problem faster than O(n).
- **Streaming data:** The algorithm processes elements one at a time and needs only O(1) space, making it suitable for data streams.
- **As a subroutine:** Many problems (maximum submatrix, circular subarray) use Kadane's as a building block.

## When NOT to Use

- **When you need the actual subarray, not just the sum:** The basic algorithm returns only the sum. Tracking indices requires minor modifications.
- **Non-contiguous subsequences:** If elements need not be contiguous, the problem becomes different (just sum all positive elements).
- **2D maximum subarray:** While Kadane's can be extended to 2D, the resulting O(n^3) algorithm may be too slow for large matrices.
- **When all elements are negative and you want zero:** Some formulations allow an empty subarray with sum 0. The standard algorithm returns the least negative element.

## Comparison with Similar Algorithms

| Algorithm           | Time    | Space | Notes                                          |
|--------------------|--------|-------|-------------------------------------------------|
| Kadane's Algorithm  | O(n)   | O(1)  | Optimal for maximum subarray sum                |
| Brute Force         | O(n^3) | O(1)  | Check all subarrays; extremely slow              |
| Divide and Conquer  | O(n log n)| O(log n) | Recursive approach; slower than Kadane's    |
| Prefix Sum approach | O(n^2) | O(n)  | Compute all subarray sums via prefix sums        |

## Implementations

| Language   | File |
|------------|------|
| C          | [Kadanes.c](c/Kadanes.c) |
| C#         | [Kadanes.cs](csharp/Kadanes.cs) |
| C++        | [Kadanes.cpp](cpp/Kadanes.cpp) |
| Go         | [Kadanes.go](go/Kadanes.go) |
| Java       | [Kadane.java](java/Kadane.java) |
| TypeScript | [Kedanes.js](typescript/Kedanes.js) |
| Python     | [Kadane.py](python/Kadane.py) |

## References

- Bentley, J. (1984). Programming pearls: algorithm design techniques. *Communications of the ACM*, 27(9), 865-873.
- Kadane, J. B. (Original algorithm, 1984). As described in Bentley's column.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 4.1: The Maximum-Subarray Problem.
- [Maximum Subarray Problem -- Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
