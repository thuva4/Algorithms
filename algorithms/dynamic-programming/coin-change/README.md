# Coin Change

## Overview

The Coin Change problem asks for the minimum number of coins needed to make a given amount of money, using coins of specified denominations. Each coin denomination can be used an unlimited number of times. For example, given coins [1, 5, 10, 25] and amount 36, the minimum is 3 coins (25 + 10 + 1). If it is impossible to make the amount with the given denominations, the algorithm returns -1.

This is a foundational dynamic programming problem that models many real-world optimization scenarios, including making change, resource allocation, and integer partition problems. The greedy approach (always using the largest coin) does not always yield the optimal solution, making DP necessary.

## How It Works

The algorithm builds a 1D table where `dp[s]` represents the minimum number of coins needed to make amount `s`. Starting from the base case `dp[0] = 0` (zero coins for zero amount), for each amount from 1 to S, we try every coin denomination and take the minimum result. If a coin fits (its value does not exceed the current amount), we check whether using it leads to fewer total coins.

### Example

Given coins `[1, 3, 4]` and amount `S = 6`:

**Building the DP table:**

| Amount | Try coin 1 | Try coin 3 | Try coin 4 | dp[amount] |
|--------|-----------|-----------|-----------|------------|
| 0 | - | - | - | 0 (base) |
| 1 | dp[0]+1=1 | - | - | 1 |
| 2 | dp[1]+1=2 | - | - | 2 |
| 3 | dp[2]+1=3 | dp[0]+1=1 | - | 1 |
| 4 | dp[3]+1=2 | dp[1]+1=2 | dp[0]+1=1 | 1 |
| 5 | dp[4]+1=2 | dp[2]+1=3 | dp[1]+1=2 | 2 |
| 6 | dp[5]+1=3 | dp[3]+1=2 | dp[2]+1=3 | 2 |

Result: Minimum coins = `2` (coins 3 + 3, or coins 4 + 2 is not valid, so 3 + 3)

Note: At amount 6, using coin 3 twice gives 2 coins, which is optimal. The greedy approach of using coin 4 first would give 4 + 1 + 1 = 3 coins, which is suboptimal.

## Pseudocode

```
function coinChange(coins, S):
    dp = array of size (S + 1), initialized to infinity
    dp[0] = 0

    for amount from 1 to S:
        for each coin in coins:
            if coin <= amount and dp[amount - coin] + 1 < dp[amount]:
                dp[amount] = dp[amount - coin] + 1

    if dp[S] == infinity:
        return -1    // impossible to make amount S
    return dp[S]
```

The key insight is that the optimal solution for amount `s` can be built from the optimal solution for `s - coin` for some coin. By trying all coins and taking the minimum, we guarantee optimality.

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(nS)  | O(S)  |
| Average | O(nS)  | O(S)  |
| Worst   | O(nS)  | O(S)  |

**Why these complexities?**

- **Best Case -- O(nS):** The algorithm iterates over all amounts from 1 to S, and for each amount, checks all n coin denominations. There is no early termination.

- **Average Case -- O(nS):** Each of the S amounts requires checking n coins, with O(1) work per check. Total work is exactly n * S constant-time operations.

- **Worst Case -- O(nS):** Same as all cases. The algorithm structure is uniform regardless of input values.

- **Space -- O(S):** The algorithm uses a 1D array of size S + 1. This is optimal since we need to store the result for every amount from 0 to S.

## When to Use

- **Making change optimally:** When the greedy approach fails (e.g., coins [1, 3, 4] and amount 6), DP guarantees the minimum number of coins.
- **When coin denominations are arbitrary:** Unlike standard currency systems designed for greedy optimality, arbitrary denominations require DP.
- **Counting the number of ways to make change:** A slight modification counts all possible combinations instead of the minimum.
- **Resource allocation with discrete units:** Problems where resources come in fixed sizes and must be combined to meet a target.

## When NOT to Use

- **Standard currency systems:** For well-designed currency denominations (e.g., US coins), the greedy approach is correct and faster at O(n).
- **Very large target amounts:** When S is extremely large (billions), the O(nS) approach is impractical. Consider mathematical approaches or approximation.
- **When items cannot be reused:** Use the 0/1 Knapsack formulation instead.
- **Continuous amounts:** This algorithm works only with integer amounts and denominations.

## Comparison with Similar Algorithms

| Algorithm        | Time    | Space | Notes                                        |
|-----------------|--------|-------|----------------------------------------------|
| Coin Change (DP) | O(nS)  | O(S)  | Finds minimum coins; handles any denominations|
| Greedy Change    | O(n)   | O(1)  | Fast but only correct for canonical systems   |
| 0/1 Knapsack     | O(nW)  | O(nW) | Each item used at most once                   |
| Unbounded Knapsack| O(nW) | O(W)  | Same structure; maximizes value                |
| Rod Cutting      | O(n^2) | O(n)  | Special case with sequential piece sizes       |

## Implementations

| Language | File |
|----------|------|
| C++      | [CoinChange.cpp](cpp/CoinChange.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Pearson. Chapter 6: Dynamic Programming.
- [Change-making Problem -- Wikipedia](https://en.wikipedia.org/wiki/Change-making_problem)
