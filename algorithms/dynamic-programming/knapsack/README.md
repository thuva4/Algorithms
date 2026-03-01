# Knapsack (0/1)

## Overview

The 0/1 Knapsack problem is a classic combinatorial optimization problem. Given a set of items, each with a weight and a value, the goal is to determine which items to include in a collection so that the total weight does not exceed a given capacity W and the total value is maximized. The "0/1" constraint means each item can either be included entirely or excluded -- it cannot be split.

This problem is fundamental to resource allocation, portfolio optimization, and cutting stock problems. The dynamic programming approach solves it in pseudo-polynomial time O(nW), where n is the number of items and W is the knapsack capacity.

## How It Works

The algorithm builds a 2D table where `dp[i][w]` represents the maximum value achievable using the first `i` items with a knapsack capacity of `w`. For each item, we decide whether to include it or not: if including it yields a higher value than excluding it (and it fits), we include it; otherwise, we exclude it.

### Example

Given items and capacity `W = 7`:

| Item | Weight | Value |
|------|--------|-------|
| 1    | 1      | 1     |
| 2    | 3      | 4     |
| 3    | 4      | 5     |
| 4    | 5      | 7     |

**Building the DP table:**

| Item\Cap | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|----------|---|---|---|---|---|---|---|---|
| 0        | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 (w=1,v=1) | 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 2 (w=3,v=4) | 0 | 1 | 1 | 4 | 5 | 5 | 5 | 5 |
| 3 (w=4,v=5) | 0 | 1 | 1 | 4 | 5 | 6 | 6 | 9 |
| 4 (w=5,v=7) | 0 | 1 | 1 | 4 | 5 | 7 | 8 | 9 |

**Key decisions:**

| Cell | Decision | Reasoning |
|------|----------|-----------|
| dp[2][3] | Include item 2 | val(4) + dp[1][0](0) = 4 > dp[1][3](1) |
| dp[2][4] | Include item 2 | val(4) + dp[1][1](1) = 5 > dp[1][4](1) |
| dp[3][7] | Include item 3 | val(5) + dp[2][3](4) = 9 > dp[2][7](5) |
| dp[4][7] | Exclude item 4 | val(7) + dp[3][2](1) = 8 < dp[3][7](9) |

Result: Maximum value = `9` (items 2 and 3, total weight = 7)

## Pseudocode

```
function knapsack(weights, values, n, W):
    dp = 2D array of size (n + 1) x (W + 1), initialized to 0

    for i from 1 to n:
        for w from 1 to W:
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i - 1][w],
                               values[i - 1] + dp[i - 1][w - weights[i - 1]])
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W]
```

For each item, we compare two options: excluding the item (using the value from the row above) or including it (adding its value to the best solution for the remaining capacity). We take whichever yields the higher value.

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(nW)  | O(nW)  |
| Average | O(nW)  | O(nW)  |
| Worst   | O(nW)  | O(nW)  |

**Why these complexities?**

- **Best Case -- O(nW):** The algorithm always fills the entire table regardless of item weights or values. Every cell is computed exactly once.

- **Average Case -- O(nW):** Each of the n * W cells requires O(1) work (a comparison and possibly an addition), giving O(nW) total work.

- **Worst Case -- O(nW):** Same as best and average case. The table has fixed dimensions determined by the number of items and capacity.

- **Space -- O(nW):** The full 2D table requires (n+1) * (W+1) cells. This can be optimized to O(W) using a 1D array if only the maximum value is needed (not the item selection), by processing weights in reverse order within each row.

## When to Use

- **Resource allocation with discrete items:** When you must choose whole items with weight/cost constraints to maximize value.
- **Budget optimization:** Selecting projects, investments, or tasks to maximize return within a budget.
- **Cargo loading:** Determining which items to load onto a vehicle with weight capacity limits.
- **When item count and capacity are manageable:** The O(nW) approach is efficient when both n and W are not excessively large.

## When NOT to Use

- **Very large capacity values:** Since W appears in the complexity, capacities in the billions make the DP table impractically large. Consider approximation algorithms.
- **When items can be fractionally included:** Use the greedy Fractional Knapsack algorithm instead, which runs in O(n log n).
- **When there are additional constraints:** Multi-dimensional knapsack problems require more sophisticated approaches.
- **Very large number of items with small capacity:** Branch-and-bound or meet-in-the-middle may be more efficient.

## Comparison with Similar Algorithms

| Algorithm             | Time      | Space  | Notes                                           |
|----------------------|----------|--------|-------------------------------------------------|
| 0/1 Knapsack (DP)    | O(nW)    | O(nW)  | Exact solution; pseudo-polynomial time           |
| Fractional Knapsack   | O(n log n)| O(1)  | Greedy; allows partial items                     |
| Unbounded Knapsack    | O(nW)    | O(W)   | Each item can be used unlimited times            |
| Coin Change           | O(nS)   | O(S)   | Similar structure; minimizes count instead        |
| Rod Cutting           | O(n^2)  | O(n)   | Special case of unbounded knapsack                |

## Implementations

| Language   | File |
|------------|------|
| C          | [Knapsack.c](c/Knapsack.c) |
| C++        | [0-1Knapsack.cpp](cpp/0-1Knapsack.cpp) |
| Java       | [Knapsack.java](java/Knapsack.java) |
| TypeScript | [ZeroOneKnapsack.js](typescript/ZeroOneKnapsack.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16: Greedy Algorithms (Fractional), Problem 16-2 (0/1).
- Kellerer, H., Pferschy, U., & Pisinger, D. (2004). *Knapsack Problems*. Springer.
- [Knapsack Problem -- Wikipedia](https://en.wikipedia.org/wiki/Knapsack_problem)
