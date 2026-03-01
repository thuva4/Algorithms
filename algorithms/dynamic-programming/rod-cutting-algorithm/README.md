# Rod Cutting Algorithm

## Overview

The Rod Cutting problem is a classic dynamic programming optimization problem. Given a rod of length n and a table of prices for each piece length from 1 to n, the goal is to determine the maximum revenue obtainable by cutting the rod into pieces and selling them. Each cut is free, and pieces of different lengths have different prices. The rod can also be sold without any cuts if that yields the best price.

This problem is a special case of the unbounded knapsack problem and is often the first example used to introduce dynamic programming in textbooks. It demonstrates the key DP concepts of optimal substructure and overlapping subproblems.

## How It Works

The algorithm builds a table where `dp[i]` represents the maximum revenue obtainable from a rod of length `i`. For each length, we try every possible first cut position (from 1 to i) and take the maximum of the price of that piece plus the optimal revenue from the remaining rod. The base case is `dp[0] = 0` (a rod of length 0 generates no revenue).

### Example

Given rod length `n = 5` and price table:

| Length | 1 | 2 | 3 | 4 | 5 |
|--------|---|---|---|---|---|
| Price  | 2 | 5 | 7 | 8 | 10|

**Building the DP table:**

| Rod Length | Try cut=1 | Try cut=2 | Try cut=3 | Try cut=4 | Try cut=5 | dp[i] |
|-----------|----------|----------|----------|----------|----------|-------|
| 0 | - | - | - | - | - | 0 |
| 1 | p[1]+dp[0]=2 | - | - | - | - | 2 |
| 2 | p[1]+dp[1]=4 | p[2]+dp[0]=5 | - | - | - | 5 |
| 3 | p[1]+dp[2]=7 | p[2]+dp[1]=7 | p[3]+dp[0]=7 | - | - | 7 |
| 4 | p[1]+dp[3]=9 | p[2]+dp[2]=10 | p[3]+dp[1]=9 | p[4]+dp[0]=8 | - | 10 |
| 5 | p[1]+dp[4]=12 | p[2]+dp[3]=12 | p[3]+dp[2]=12 | p[4]+dp[1]=10 | p[5]+dp[0]=10 | 12 |

Result: Maximum revenue = `12` (cut into lengths 2 + 2 + 1, or 1 + 2 + 2, priced at 5 + 5 + 2)

## Pseudocode

```
function rodCutting(prices, n):
    dp = array of size (n + 1), initialized to 0

    for i from 1 to n:
        max_val = -infinity
        for j from 1 to i:
            max_val = max(max_val, prices[j] + dp[i - j])
        dp[i] = max_val

    return dp[n]
```

For each rod length `i`, we try all possible first cut positions `j` (from 1 to i). The revenue from cutting a piece of length `j` is `prices[j] + dp[i - j]`, where `dp[i - j]` is the optimal revenue from the remaining rod of length `i - j`.

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n^2) | O(n)  |
| Average | O(n^2) | O(n)  |
| Worst   | O(n^2) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n^2):** The algorithm always evaluates all possible first-cut positions for each rod length. For length i, it tries i positions. The total work is 1 + 2 + ... + n = n(n+1)/2 = O(n^2).

- **Average Case -- O(n^2):** Same as best case. The double loop structure is fixed regardless of the price table values.

- **Worst Case -- O(n^2):** The algorithm performs exactly n(n+1)/2 iterations with O(1) work per iteration.

- **Space -- O(n):** The algorithm uses a 1D array of size n + 1 to store the optimal revenue for each rod length from 0 to n.

## When to Use

- **Cutting/partitioning optimization:** When you need to partition a resource into pieces to maximize total value.
- **When pieces can be reused:** Unlike the 0/1 knapsack, the same piece length can be used multiple times.
- **When the number of distinct piece sizes is manageable:** The algorithm is efficient when n is not excessively large.
- **Teaching dynamic programming:** Rod cutting is an excellent pedagogical example that clearly illustrates optimal substructure.

## When NOT to Use

- **When cuts have costs:** The standard formulation assumes free cuts. If each cut has an associated cost, the problem requires modification.
- **Very large rod lengths:** For n in the millions, the O(n^2) approach becomes slow. Consider problem-specific optimizations.
- **When only one cut is allowed:** Simpler algorithms suffice for the single-cut version of the problem.
- **Multi-dimensional cutting:** Cutting 2D sheets or 3D blocks requires more complex formulations.

## Comparison with Similar Algorithms

| Algorithm         | Time    | Space | Notes                                          |
|------------------|--------|-------|-------------------------------------------------|
| Rod Cutting (DP)  | O(n^2) | O(n)  | Bottom-up; tries all cut positions               |
| Rod Cutting (memo)| O(n^2) | O(n)  | Top-down with memoization; same complexity       |
| Unbounded Knapsack| O(nW)  | O(W)  | Generalization of rod cutting                    |
| 0/1 Knapsack      | O(nW)  | O(nW) | Each piece used at most once                     |
| Coin Change        | O(nS)  | O(S)  | Minimizes count instead of maximizing value      |

## Implementations

| Language | File |
|----------|------|
| Java     | [RodCuttingAlgorithm.java](java/RodCuttingAlgorithm.java) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15.1: Rod Cutting.
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Pearson. Chapter 6: Dynamic Programming.
- [Cutting Stock Problem -- Wikipedia](https://en.wikipedia.org/wiki/Cutting_stock_problem)
