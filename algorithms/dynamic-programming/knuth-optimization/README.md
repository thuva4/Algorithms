# Knuth's Optimization

## Overview

Knuth's Optimization reduces an O(n^3) interval DP recurrence to O(n^2) by exploiting the monotonicity of optimal split points. It applies when the cost function satisfies the quadrangle inequality, meaning the optimal split point opt[i][j] is monotone: `opt[i][j-1] <= opt[i][j] <= opt[i+1][j]`. This was first described by Donald Knuth in 1971 for the Optimal Binary Search Tree problem and later generalized by Yao (1980) to a broader class of problems.

The technique is demonstrated here with the Optimal Binary Search Tree problem: given n keys with search frequencies, construct a BST that minimizes the expected total search cost.

## How It Works

Given n keys with search frequencies, we want to build a BST minimizing total search cost. The standard DP is:

```
dp[i][j] = min over i <= k < j of (dp[i][k] + dp[k+1][j] + sum(freq[i..j]))
```

Without optimization, trying all k for each (i,j) pair takes O(n^3). Knuth's insight is that the optimal k for dp[i][j] is bounded:

```
opt[i][j-1] <= opt[i][j] <= opt[i+1][j]
```

By restricting the search range for k, the total work across all intervals of the same length sums to O(n), giving O(n^2) overall.

**Why does the quadrangle inequality hold?** For the OBST problem, the cost function w(i,j) = sum(freq[i..j]) satisfies:
- Monotonicity: w(a,c) <= w(b,d) if a <= b <= c <= d
- Quadrangle inequality: w(a,c) + w(b,d) <= w(a,d) + w(b,c) for a <= b <= c <= d

These properties guarantee the monotonicity of optimal split points.

## Worked Example

**Keys with frequencies:** keys = [1, 2, 3, 4], freq = [4, 2, 6, 3]

**Prefix sums:** sum[0..0]=4, sum[0..1]=6, sum[0..2]=12, sum[0..3]=15

**DP computation (filling by interval length):**

Length 1 (single keys): dp[i][i] = freq[i], opt[i][i] = i
- dp[0][0] = 4, opt[0][0] = 0
- dp[1][1] = 2, opt[1][1] = 1
- dp[2][2] = 6, opt[2][2] = 2
- dp[3][3] = 3, opt[3][3] = 3

Length 2:
- dp[0][1]: try k in [opt[0][0]..opt[1][1]] = [0..1]
  - k=0: dp[0][-1] + dp[1][1] + sum(0..1) = 0 + 2 + 6 = 8
  - k=1: dp[0][0] + dp[2][1] + sum(0..1) = 4 + 0 + 6 = 10
  - dp[0][1] = 8, opt[0][1] = 0
- dp[1][2]: try k in [opt[1][1]..opt[2][2]] = [1..2]
  - k=1: 0 + 6 + 8 = 14
  - k=2: 2 + 0 + 8 = 10
  - dp[1][2] = 10, opt[1][2] = 2
- dp[2][3]: try k in [opt[2][2]..opt[3][3]] = [2..3]
  - k=2: 0 + 3 + 9 = 12
  - k=3: 6 + 0 + 9 = 15
  - dp[2][3] = 12, opt[2][3] = 2

Length 3:
- dp[0][2]: try k in [opt[0][1]..opt[1][2]] = [0..2]
  - k=0: 0 + 10 + 12 = 22
  - k=1: 4 + 6 + 12 = 22
  - k=2: 8 + 0 + 12 = 20
  - dp[0][2] = 20, opt[0][2] = 2

Length 4:
- dp[0][3]: try k in [opt[0][2]..opt[1][3]] = restricted range
  - Compute to get the final answer.

**Answer: dp[0][3] = minimum expected search cost for the optimal BST.**

## Pseudocode

```
function knuthOptimization(freq, n):
    dp = 2D array of size n x n, initialized to 0
    opt = 2D array of size n x n
    prefixSum = prefix sum array of freq

    // Base case: single keys
    for i = 0 to n-1:
        dp[i][i] = freq[i]
        opt[i][i] = i

    // Fill by increasing interval length
    for len = 2 to n:
        for i = 0 to n - len:
            j = i + len - 1
            dp[i][j] = infinity
            w = prefixSum[j+1] - prefixSum[i]    // sum of freq[i..j]

            // Knuth's optimization: restrict k range
            for k = opt[i][j-1] to opt[i+1][j]:
                cost = dp[i][k-1] + dp[k+1][j] + w
                // (treat dp[i][i-1] = 0 and dp[j+1][j] = 0)
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    opt[i][j] = k

    return dp[0][n-1]
```

## Complexity Analysis

| Case    | Time    | Space  |
|---------|---------|--------|
| Best    | O(n^2)  | O(n^2) |
| Average | O(n^2)  | O(n^2) |
| Worst   | O(n^2)  | O(n^2) |

**Why these complexities?**

- **Time -- O(n^2):** For a fixed interval length L, the sum of search ranges across all (i, j) pairs telescopes. Specifically, for intervals of length L, the total number of k values tried is at most O(n). Since there are n possible lengths, the total is O(n^2). This is a significant improvement over the naive O(n^3).

- **Space -- O(n^2):** Both the dp table and the opt table require n^2 entries.

## When to Use

- **Optimal Binary Search Tree:** The original application -- constructing a BST with minimum expected search cost given known access frequencies.
- **Optimal paragraph breaking:** Knuth's TeX line-breaking algorithm uses a similar optimization for minimizing the cost of paragraph formatting.
- **Matrix chain multiplication variants:** When the cost function satisfies the quadrangle inequality.
- **Any interval DP with monotone optimal splits:** The technique applies whenever you can prove opt[i][j-1] <= opt[i][j] <= opt[i+1][j].
- **Stone merging problem:** Merging n piles of stones where adjacent piles can be merged, and the cost is the sum of merged pile sizes.

## When NOT to Use

- **When the quadrangle inequality does not hold:** The optimization is incorrect if the cost function does not satisfy the required monotonicity property. Always verify the conditions before applying.
- **Non-interval DP problems:** This technique is specific to interval (range) DP recurrences of the form dp[i][j] = min over k of (dp[i][k] + dp[k+1][j] + w(i,j)).
- **When n is small:** For small n (< 100), the naive O(n^3) approach is simple and fast enough. The optimization adds implementation complexity.
- **When the cost function is not efficiently computable:** If computing w(i,j) is expensive, the overhead may negate the benefit.

## Comparison

| Algorithm              | Time    | Space  | Notes                                        |
|-----------------------|---------|--------|----------------------------------------------|
| Naive Interval DP      | O(n^3)  | O(n^2) | Try all split points for each interval       |
| **Knuth's Optimization** | **O(n^2)** | **O(n^2)** | **Requires quadrangle inequality**         |
| Divide and Conquer Opt.| O(n log n) | O(n) | For 1D DP with monotone optimal decisions    |
| Convex Hull Trick       | O(n log n) | O(n) | For linear cost functions; different structure|
| Hu-Shing Algorithm      | O(n log n) | O(n) | Specific to matrix chain multiplication      |

## Implementations

| Language   | File |
|------------|------|
| Python     | [knuth_optimization.py](python/knuth_optimization.py) |
| Java       | [KnuthOptimization.java](java/KnuthOptimization.java) |
| C++        | [knuth_optimization.cpp](cpp/knuth_optimization.cpp) |
| C          | [knuth_optimization.c](c/knuth_optimization.c) |
| Go         | [knuth_optimization.go](go/knuth_optimization.go) |
| TypeScript | [knuthOptimization.ts](typescript/knuthOptimization.ts) |
| Rust       | [knuth_optimization.rs](rust/knuth_optimization.rs) |
| Kotlin     | [KnuthOptimization.kt](kotlin/KnuthOptimization.kt) |
| Swift      | [KnuthOptimization.swift](swift/KnuthOptimization.swift) |
| Scala      | [KnuthOptimization.scala](scala/KnuthOptimization.scala) |
| C#         | [KnuthOptimization.cs](csharp/KnuthOptimization.cs) |

## References

- Knuth, D. E. (1971). "Optimum Binary Search Trees." *Acta Informatica*, 1(1), 14-25.
- Yao, F. F. (1980). "Efficient Dynamic Programming Using Quadrangle Inequalities." *Proceedings of the 12th ACM STOC*, 429-435.
- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 15.5: Optimal Binary Search Trees.
- [Knuth's Optimization -- CP-Algorithms](https://cp-algorithms.com/dynamic_programming/knuth-optimization.html)
