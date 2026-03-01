# Longest Increasing Subsequence

## Overview

The Longest Increasing Subsequence (LIS) problem asks for the length of the longest subsequence of a given sequence in which all elements are sorted in strictly increasing order. For example, given the array [10, 9, 2, 5, 3, 7, 101, 18], one LIS is [2, 3, 7, 101] with length 4. The elements need not be contiguous but must maintain their relative order.

LIS is a classic dynamic programming problem with an efficient O(n log n) solution using patience sorting with binary search. It appears in numerous applications including scheduling, bioinformatics, and as a subroutine in more complex algorithms.

## How It Works

The optimal O(n log n) approach maintains a list `tails` where `tails[i]` stores the smallest possible tail element of an increasing subsequence of length i+1. For each element in the array, we use binary search to find the position where it should be placed in the tails list. If the element is larger than all elements in tails, it extends the longest subsequence; otherwise, it replaces the first element in tails that is greater than or equal to it.

### Example

Given input: `[10, 9, 2, 5, 3, 7, 101, 18]`

**Building the tails array:**

| Step | Element | Binary Search | Action | Tails Array | LIS Length |
|------|---------|---------------|--------|-------------|------------|
| 1 | 10 | Empty list | Append | [10] | 1 |
| 2 | 9 | 9 < 10, pos 0 | Replace tails[0] | [9] | 1 |
| 3 | 2 | 2 < 9, pos 0 | Replace tails[0] | [2] | 1 |
| 4 | 5 | 5 > 2, append | Append | [2, 5] | 2 |
| 5 | 3 | 3 > 2, 3 < 5, pos 1 | Replace tails[1] | [2, 3] | 2 |
| 6 | 7 | 7 > 3, append | Append | [2, 3, 7] | 3 |
| 7 | 101 | 101 > 7, append | Append | [2, 3, 7, 101] | 4 |
| 8 | 18 | 18 > 7, 18 < 101, pos 3 | Replace tails[3] | [2, 3, 7, 18] | 4 |

Result: LIS length = `4`

Note: The tails array `[2, 3, 7, 18]` is not necessarily the actual LIS. It represents the smallest possible tail values for subsequences of each length. One valid LIS is `[2, 5, 7, 101]` or `[2, 3, 7, 101]`.

## Pseudocode

```
function lisLength(arr):
    n = length(arr)
    tails = empty array

    for i from 0 to n - 1:
        pos = binarySearch(tails, arr[i])  // find first element >= arr[i]

        if pos == length(tails):
            tails.append(arr[i])
        else:
            tails[pos] = arr[i]

    return length(tails)
```

The binary search finds the leftmost position in the sorted `tails` array where the current element should be placed. This ensures `tails` always remains sorted, enabling efficient O(log n) lookups at each step.

## Complexity Analysis

| Case    | Time       | Space |
|---------|-----------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n log n):** Even when the array is already sorted (every element extends the LIS), each element still requires a binary search on the tails array, giving O(log k) per element where k grows up to n.

- **Average Case -- O(n log n):** For each of the n elements, a binary search on the tails array (which has at most n elements) takes O(log n) time. Total: n * O(log n) = O(n log n).

- **Worst Case -- O(n log n):** The same as the average case. The binary search always takes O(log n) per element regardless of input order.

- **Space -- O(n):** The tails array can grow up to length n (when the entire input is sorted), requiring O(n) additional space. If the actual LIS must be recovered, additional parent pointers require O(n) space.

## When to Use

- **Finding the longest sorted subsequence:** The core use case -- determining the maximum number of elements that can be selected while maintaining sorted order.
- **Patience sorting applications:** LIS is related to patience sorting and has applications in card game analysis.
- **Box stacking and scheduling problems:** Many optimization problems reduce to LIS (e.g., longest chain of pairs, envelope nesting).
- **When O(n log n) efficiency is needed:** The binary search approach is significantly faster than the O(n^2) DP approach for large inputs.

## When NOT to Use

- **When you need the longest non-decreasing subsequence:** The standard algorithm finds strictly increasing subsequences. Modifications are needed for non-strict ordering.
- **When the actual subsequence is needed, not just the length:** Recovering the actual LIS requires additional bookkeeping with parent pointers.
- **Very small arrays:** For small inputs, the simpler O(n^2) DP approach may be clearer and has less implementation complexity.

## Comparison with Similar Algorithms

| Algorithm            | Time       | Space | Notes                                              |
|---------------------|-----------|-------|----------------------------------------------------|
| LIS (O(n^2) DP)     | O(n^2)    | O(n)  | Simpler; compares each pair of elements             |
| LIS (patience sort)  | O(n log n)| O(n)  | Optimal; uses binary search on tails array          |
| LCS                  | O(mn)     | O(mn) | More general; LIS can be reduced to LCS             |
| Longest Bitonic Subseq | O(n log n) | O(n) | Finds increasing-then-decreasing subsequence     |

## Implementations

| Language   | File |
|------------|------|
| C++        | [LIS.cpp](cpp/LIS.cpp) |
| Java       | [LIS.java](java/LIS.java) |
| TypeScript | [index.js](typescript/index.js) |
| Python     | [LIS.py](python/LIS.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 15-4: Longest Increasing Subsequence.
- Fredman, M. L. (1975). On computing the length of longest increasing subsequences. *Discrete Mathematics*, 11(1), 29-35.
- [Longest Increasing Subsequence -- Wikipedia](https://en.wikipedia.org/wiki/Longest_increasing_subsequence)
