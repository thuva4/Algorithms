---
name: 0/1 Knapsack (Dynamic Programming)
slug: knapsack-dp
category: dynamic-programming
difficulty: advanced
timeComplexity: O(n × W)
spaceComplexity: O(n × W)
recognitionTips:
  - "Problem involves making binary choices (take it or leave it)"
  - "Need to maximize/minimize a value subject to a capacity constraint"
  - "Problem has overlapping subproblems and optimal substructure"
  - "Given a set of items, need to select a subset meeting constraints"
commonVariations:
  - "0/1 Knapsack (each item used at most once)"
  - "Unbounded Knapsack (items can be reused)"
  - "Subset sum (can we hit exactly W?)"
  - "Count of subsets (how many ways to hit W?)"
relatedPatterns: []
keywords: [dp, knapsack, subset-sum, optimization, capacity, memoization]
estimatedTime: 4-5 hours
---

# 0/1 Knapsack (Dynamic Programming) Pattern

## Overview

The 0/1 Knapsack pattern is one of the most fundamental and widely tested dynamic programming patterns in coding interviews. It models problems where you must select a subset of items — each chosen at most once — to maximize (or minimize) some value without exceeding a fixed capacity or constraint.

The name "0/1" comes from the binary choice for each item: you either include it (1) or exclude it (0). Unlike the greedy approach, you cannot take fractional items, and unlike unbounded knapsack, you cannot reuse an item once selected. This binary, non-repeating constraint is exactly what necessitates dynamic programming.

The DP table approach builds a 2D table `dp[i][w]` where `i` represents the first `i` items considered and `w` represents capacity from `0` to `W`. Each cell stores the maximum value achievable using the first `i` items with exactly `w` capacity available. By iterating through items and capacities systematically, you eliminate redundant recomputation and arrive at the global optimum in O(n x W) time.

This pattern is the backbone of a large family of interview problems. Subset sum, partition equal subset sum, target sum, count of subsets with a given sum, and minimum subset difference are all knapsack variants wearing different disguises. Mastering the core recurrence unlocks all of them.

## When to Use

Reach for the 0/1 Knapsack pattern when you observe these signals in a problem:

- You have a collection of items, each with a weight (or cost) and a value (or contribution).
- You are given a capacity (or budget or target) that cannot be exceeded.
- You must decide for each item whether to include or exclude it — no partial selections.
- The problem asks for a maximum, minimum, count, or feasibility answer over all valid subsets.
- A brute-force solution would enumerate all 2^n subsets, which is too slow for n > ~20.

Common problem phrasings that signal knapsack:
- "Given weights and values, maximize profit within capacity W."
- "Can you partition this array into two subsets of equal sum?"
- "Find the number of ways to reach target sum T using elements of the array."
- "What is the minimum number of elements needed to reach sum S?"

If the problem allows reusing items, shift to unbounded knapsack. If items have multiple dimensions of cost, extend the table to 3D. The core logic remains the same.

## Core Technique

The recurrence relation is the heart of the pattern. For each item `i` (1-indexed) with weight `wt[i]` and value `val[i]`, and for each capacity `w`:

```
if wt[i] > w:
    dp[i][w] = dp[i-1][w]          // item is too heavy; must skip it
else:
    dp[i][w] = max(
        dp[i-1][w],                 // option 1: skip item i
        val[i] + dp[i-1][w - wt[i]] // option 2: include item i
    )
```

The base cases are:
- `dp[0][w] = 0` for all `w` (no items means no value)
- `dp[i][0] = 0` for all `i` (zero capacity means no items can be taken)

### Pseudocode (2D Table Filling)

```
function knapsack(weights, values, W):
    n = length of weights
    dp = 2D array of size (n+1) x (W+1), initialized to 0

    for i from 1 to n:
        for w from 0 to W:
            // Option 1: skip item i
            dp[i][w] = dp[i-1][w]

            // Option 2: include item i (only if it fits)
            if weights[i-1] <= w:
                include = values[i-1] + dp[i-1][w - weights[i-1]]
                dp[i][w] = max(dp[i][w], include)

    return dp[n][W]
```

### Space-Optimized Variant (1D Rolling Array)

Because each row only depends on the previous row, you can compress the table to a single 1D array. You must iterate `w` from right to left to avoid using updated values from the current row accidentally:

```
function knapsackOptimized(weights, values, W):
    n = length of weights
    dp = array of size (W+1), initialized to 0

    for i from 0 to n-1:
        for w from W down to weights[i]:    // MUST go right-to-left
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])

    return dp[W]
```

This reduces space from O(n x W) to O(W). In interviews, start with the 2D version for clarity, then mention the optimization if asked.

## Example Walkthrough

**Problem:** Three items with (weight, value) pairs: `[(2, 3), (3, 4), (4, 5)]`. Knapsack capacity `W = 5`. Find the maximum value.

**Items (1-indexed):**
- Item 1: weight = 2, value = 3
- Item 2: weight = 3, value = 4
- Item 3: weight = 4, value = 5

**Build the DP table `dp[i][w]` for i = 0..3, w = 0..5:**

Initial state — all zeros (no items, any capacity = 0 value):

```
       w=0  w=1  w=2  w=3  w=4  w=5
i=0  [  0    0    0    0    0    0  ]
```

**Row i=1 (Item 1: wt=2, val=3):**
- w=0: wt(2) > 0, skip -> dp[1][0] = dp[0][0] = 0
- w=1: wt(2) > 1, skip -> dp[1][1] = dp[0][1] = 0
- w=2: wt(2) <= 2, max(dp[0][2], 3 + dp[0][0]) = max(0, 3) = 3
- w=3: wt(2) <= 3, max(dp[0][3], 3 + dp[0][1]) = max(0, 3) = 3
- w=4: wt(2) <= 4, max(dp[0][4], 3 + dp[0][2]) = max(0, 3) = 3
- w=5: wt(2) <= 5, max(dp[0][5], 3 + dp[0][3]) = max(0, 3) = 3

```
       w=0  w=1  w=2  w=3  w=4  w=5
i=1  [  0    0    3    3    3    3  ]
```

**Row i=2 (Item 2: wt=3, val=4):**
- w=0,1,2: wt(3) > w, skip -> copy from i=1: [0, 0, 3]
- w=3: max(dp[1][3], 4 + dp[1][0]) = max(3, 4+0) = 4
- w=4: max(dp[1][4], 4 + dp[1][1]) = max(3, 4+0) = 4
- w=5: max(dp[1][5], 4 + dp[1][2]) = max(3, 4+3) = 7

```
       w=0  w=1  w=2  w=3  w=4  w=5
i=2  [  0    0    3    4    4    7  ]
```

**Row i=3 (Item 3: wt=4, val=5):**
- w=0,1,2,3: wt(4) > w, skip -> copy from i=2: [0, 0, 3, 4]
- w=4: max(dp[2][4], 5 + dp[2][0]) = max(4, 5+0) = 5
- w=5: max(dp[2][5], 5 + dp[2][1]) = max(7, 5+0) = 7

```
       w=0  w=1  w=2  w=3  w=4  w=5
i=3  [  0    0    3    4    5    7  ]
```

**Answer: `dp[3][5] = 7`**

This corresponds to selecting Item 1 (wt=2, val=3) + Item 2 (wt=3, val=4) = total weight 5, total value 7. Item 3 cannot be added because total weight would exceed 5.

## Common Pitfalls

1. **Off-by-one errors in table indexing.** The most common source of bugs. Use 1-indexed items against 0-indexed weights array: `weights[i-1]` and `values[i-1]` when filling row `i`. Alternatively, shift your arrays and be consistent throughout.

2. **Iterating left-to-right in the space-optimized (1D) version.** If you go left-to-right, the updated `dp[w - wt[i]]` reflects the current row (item `i` already included), not the previous row. This accidentally allows using item `i` multiple times, turning the problem into unbounded knapsack. Always iterate right-to-left for the 0/1 variant.

3. **Forgetting the base case.** Assume the table is zero-initialized. If you allocate an uninitialized array or use a language where default values are not zero, explicitly set `dp[0][w] = 0` for all `w` and `dp[i][0] = 0` for all `i`. Failing this corrupts every subsequent calculation.

4. **Confusing "can we reach exactly W" with "can we reach at most W".** Subset sum problems typically ask for exact sum. Knapsack fills for all capacities 0..W. If the problem requires an exact target, your base case and final answer lookup change: only `dp[0] = true` (empty subset has sum 0), and you look up `dp[T]` at the end. Blurring these two interpretations leads to incorrect solutions.

5. **Not recognizing knapsack in disguise.** Problems phrased as "partition array into two subsets of equal sum" or "can you pick numbers summing to half the total" are 0/1 knapsack with `W = totalSum / 2`. Always check if the problem is really asking you to select a subset meeting a numeric constraint.

## Interview Tips

1. **Verbalize the recurrence before coding.** Say "for each item I have two choices: skip it, taking `dp[i-1][w]`, or include it if it fits, taking `val[i] + dp[i-1][w - wt[i]]`." Interviewers want to see that you understand the structure, not just that you have memorized the code.

2. **Start with the 2D table, then optimize.** Implement the full `(n+1) x (W+1)` table first. Once it is correct, mention "we can reduce space to O(W) by using a 1D array and iterating capacity right-to-left." This demonstrates depth without risking correctness in your initial solution.

3. **Trace through a small example on the whiteboard.** A 3-item, capacity-5 trace (like the example above) takes about two minutes and catches bugs early. It also shows the interviewer exactly how your recurrence works without requiring them to mentally simulate the code.

4. **Identify the variant before writing any code.** Ask: Is each item used at most once (0/1) or unlimited times (unbounded)? Is the goal to maximize value, check feasibility, or count combinations? Each variant has a slightly different recurrence or iteration direction. Clarifying this upfront prevents rewriting your solution mid-way.

5. **Know the space-time tradeoffs.** O(n x W) time is usually unavoidable for the general case (it is pseudo-polynomial, not polynomial, because W can be exponentially large in the number of bits). Mention this if asked about complexity. For W up to ~10^6 and n up to ~10^3 the 2D table is feasible; for larger W you may need meet-in-the-middle or other techniques.

## Practice Progression

Work through problems in this order to build mastery incrementally:

**Level 1 — Core pattern recognition:**
- 0/1 Knapsack (classic, with weights and values)
- Subset Sum (feasibility version: can we reach exactly W?)

**Level 2 — Single-constraint variants:**
- Count of Subsets with Given Sum (change max to count)
- Minimum Subset Sum Difference (partition array to minimize difference of two halves)
- Partition Equal Subset Sum (LeetCode 416)

**Level 3 — Problem disguises:**
- Target Sum (LeetCode 494 — assign +/- to each number)
- Last Stone Weight II (LeetCode 1049 — reframe as partition)
- Ones and Zeroes (LeetCode 474 — 2D knapsack with two constraints)

**Level 4 — Extensions:**
- Unbounded Knapsack (items can repeat)
- Coin Change — Minimum Coins (LeetCode 322)
- Coin Change II — Count Ways (LeetCode 518)
- Rod Cutting Problem

## Related Patterns

No directly linked patterns yet. Knapsack is foundational to nearly all bounded-resource DP problems. Once you master it, explore interval DP, bitmask DP, and DP on trees for further depth.
