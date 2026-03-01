# Word Break (Can Sum)

## Overview

The Word Break problem, implemented here as the "Can Sum" numeric variant, determines whether a target value can be formed by summing any combination of elements from a given array. Elements may be used multiple times (with repetition). The function returns 1 if the target is achievable and 0 otherwise.

This is structurally equivalent to the classic Word Break problem from string processing: given a string and a dictionary of words, determine whether the string can be segmented into a space-separated sequence of dictionary words. In both cases, we ask whether a "whole" can be decomposed into "parts" drawn from a fixed set, with reuse allowed.

For example, given the array [2, 3] and target 7, the answer is 1 (yes) because 7 = 2 + 2 + 3. Given [2, 4] and target 7, the answer is 0 (no) because no combination of 2s and 4s sums to 7.

## How It Works

The algorithm uses a bottom-up dynamic programming approach with a 1D boolean table.

1. **Initialize:** Create a boolean array `dp` of size `target + 1`, initialized to false. Set `dp[0] = true` (base case: a target of 0 is always achievable with no elements).
2. **Fill the table:** For each value i from 1 to target, check each element in the array. If the element is no greater than i and `dp[i - element]` is true, then set `dp[i] = true`.
3. **Result:** `dp[target]` indicates whether the target is achievable. Return 1 if true, 0 if false.

### Example

Given arr = [2, 3] and target = 7:

**Building the DP table:**

| i | Check elem 2       | Check elem 3       | dp[i] |
|---|---------------------|---------------------|-------|
| 0 | -                   | -                   | true (base) |
| 1 | dp[1-2]? no         | dp[1-3]? no         | false |
| 2 | dp[2-2]=dp[0]=true  | -                   | true  |
| 3 | dp[3-2]=dp[1]=false | dp[3-3]=dp[0]=true  | true  |
| 4 | dp[4-2]=dp[2]=true  | -                   | true  |
| 5 | dp[5-2]=dp[3]=true  | -                   | true  |
| 6 | dp[6-2]=dp[4]=true  | -                   | true  |
| 7 | dp[7-2]=dp[5]=true  | -                   | true  |

Result: dp[7] = true, so return **1**.

For arr = [2, 4] and target = 7: all odd positions remain false because both 2 and 4 are even, and the sum of even numbers is always even. So dp[7] = false, return **0**.

## Pseudocode

```
function canSum(arr, target):
    dp = boolean array of size (target + 1), initialized to false
    dp[0] = true

    for i from 1 to target:
        for each elem in arr:
            if elem <= i and dp[i - elem] is true:
                dp[i] = true
                break   // no need to check further elements

    return 1 if dp[target] is true, else 0
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(n)     | O(n)  |
| Average | O(n*m)   | O(n)  |
| Worst   | O(n*m)   | O(n)  |

Where n = target and m = number of elements in the array.

**Why these complexities?**

- **Best Case -- O(n):** If the array contains 1, then every value from 1 to target is immediately reachable in one check per position, giving O(n) total.

- **Average/Worst Case -- O(n*m):** For each of the n positions (1 to target), we may check up to m elements. With early termination when a position is found reachable, the average case can be significantly faster than the worst case in practice.

- **Space -- O(n):** The algorithm uses a single 1D array of size target + 1.

## Applications

- **String segmentation:** The classic Word Break problem in natural language processing determines if a string can be broken into valid dictionary words.
- **Change-making feasibility:** Determining if an exact amount can be formed from given denominations (without counting minimum coins).
- **Resource allocation:** Checking if a resource requirement can be met exactly with available unit sizes.
- **Subset sum variants:** Problems asking whether a particular total is achievable from a multiset of values.
- **Knapsack feasibility:** Determining if a knapsack of exact capacity can be filled.

## When NOT to Use

- **When you need the minimum count:** Use Coin Change instead, which finds the minimum number of elements needed.
- **When you need all decompositions:** Use backtracking or Word Break II to enumerate all valid segmentations.
- **Without repetition:** If each element can be used at most once, this becomes the Subset Sum problem, requiring a different DP formulation.
- **Very large targets with large elements:** When the target is extremely large, the O(n) space and time may be prohibitive.

## Comparison with Similar Algorithms

| Algorithm           | Time     | Space | Notes                                      |
|---------------------|----------|-------|--------------------------------------------|
| Can Sum / Word Break| O(n*m)   | O(n)  | Feasibility check with repetition          |
| Coin Change         | O(n*m)   | O(n)  | Finds minimum count                        |
| Subset Sum (0/1)    | O(n*m)   | O(n)  | No repetition; each element used at most once |
| Unbounded Knapsack  | O(n*W)   | O(W)  | Maximizes value with repetition            |
| Word Break II       | O(2^n)   | O(2^n)| Enumerates all valid segmentations         |

## Implementations

| Language   | File |
|------------|------|
| Python     | [can_sum.py](python/can_sum.py) |
| Java       | [WordBreak.java](java/WordBreak.java) |
| TypeScript | [canSum.ts](typescript/canSum.ts) |
| C++        | [can_sum.cpp](cpp/can_sum.cpp) |
| C          | [can_sum.c](c/can_sum.c) |
| Go         | [CanSum.go](go/CanSum.go) |
| Rust       | [can_sum.rs](rust/can_sum.rs) |
| Kotlin     | [WordBreak.kt](kotlin/WordBreak.kt) |
| Swift      | [WordBreak.swift](swift/WordBreak.swift) |
| Scala      | [WordBreak.scala](scala/WordBreak.scala) |
| C#         | [WordBreak.cs](csharp/WordBreak.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- [Word Break Problem -- Wikipedia](https://en.wikipedia.org/wiki/Word_break_problem)
- [LeetCode 139: Word Break](https://leetcode.com/problems/word-break/)
- [LeetCode 322: Coin Change](https://leetcode.com/problems/coin-change/) (related problem)
