# Longest Common Subsequence

## Overview

The Longest Common Subsequence (LCS) algorithm finds the longest subsequence that is common to two sequences. Unlike substrings, subsequences do not need to occupy consecutive positions in the original sequences -- they only need to maintain their relative order. For example, the LCS of "ABCBDAB" and "BDCAB" is "BCAB" with length 4.

LCS is a foundational dynamic programming problem with applications in bioinformatics (DNA sequence comparison), version control systems (diff tools), and natural language processing. It serves as the basis for more complex algorithms like edit distance and sequence alignment.

## How It Works

The algorithm builds a 2D table where `dp[i][j]` represents the length of the LCS of the first `i` characters of string X and the first `j` characters of string Y. For each cell, if the characters match, the value is one plus the diagonal value; otherwise, it is the maximum of the cell above or to the left. The actual subsequence can be recovered by backtracking through the table.

### Example

Given `X = "ABCB"` and `Y = "BDCAB"`:

**Building the DP table:**

|   |   | B | D | C | A | B |
|---|---|---|---|---|---|---|
|   | 0 | 0 | 0 | 0 | 0 | 0 |
| A | 0 | 0 | 0 | 0 | 1 | 1 |
| B | 0 | 1 | 1 | 1 | 1 | 1 |
| C | 0 | 1 | 1 | 2 | 2 | 2 |
| B | 0 | 1 | 1 | 2 | 2 | 3 |

**Filling process (key cells):**

| Step | Cell (i,j) | X[i] vs Y[j] | Action | Value |
|------|-----------|---------------|--------|-------|
| 1 | (1,1) | A vs B | No match, max(0,0) | 0 |
| 2 | (1,4) | A vs A | Match, dp[0][3]+1 | 1 |
| 3 | (2,1) | B vs B | Match, dp[1][0]+1 | 1 |
| 4 | (3,3) | C vs C | Match, dp[2][2]+1 | 2 |
| 5 | (4,5) | B vs B | Match, dp[3][4]+1 | 3 |

**Backtracking to find the LCS:** Starting from dp[4][5] = 3, trace back through matching characters: B, C, B -- the LCS is "BCB" with length 3.

Result: LCS = `"BCB"`, Length = `3`

## Pseudocode

```
function lcs(X, Y):
    m = length(X)
    n = length(Y)
    dp = 2D array of size (m + 1) x (n + 1), initialized to 0

    for i from 1 to m:
        for j from 1 to n:
            if X[i - 1] == Y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]
```

The table is filled row by row. When characters match, we extend the LCS found so far by one. When they do not match, we take the best LCS achievable by either excluding the current character from X or from Y.

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(mn)  | O(mn)  |
| Average | O(mn)  | O(mn)  |
| Worst   | O(mn)  | O(mn)  |

**Why these complexities?**

- **Best Case -- O(mn):** The algorithm always fills the entire m x n table regardless of the input. Even if the strings are identical, every cell must be computed.

- **Average Case -- O(mn):** Each cell requires O(1) work (a comparison and a max operation), and there are m * n cells to fill.

- **Worst Case -- O(mn):** The same as the average case. The algorithm performs exactly m * n iterations with constant work per iteration.

- **Space -- O(mn):** The algorithm maintains a 2D table of dimensions (m+1) x (n+1). If only the length is needed (not the actual subsequence), space can be optimized to O(min(m, n)) by keeping only two rows of the table.

## When to Use

- **Comparing two sequences for similarity:** LCS measures how similar two sequences are by finding their longest shared subsequence.
- **Diff tools and version control:** Tools like `diff` and `git diff` use LCS to identify unchanged lines between file versions.
- **Bioinformatics:** Comparing DNA, RNA, or protein sequences to find evolutionary relationships.
- **When you need the actual common subsequence:** Unlike edit distance, LCS directly gives the shared elements.

## When NOT to Use

- **When you need contiguous matches:** Use Longest Common Substring instead, which requires consecutive matching characters.
- **Very long sequences with memory constraints:** The O(mn) space can be prohibitive for sequences with millions of characters. Consider Hirschberg's algorithm for O(min(m,n)) space.
- **When approximate matching is sufficient:** Hashing-based or sampling approaches may be faster for large-scale approximate comparisons.
- **Real-time applications with very long strings:** The quadratic time complexity makes it impractical for very large inputs in time-sensitive scenarios.

## Comparison with Similar Algorithms

| Algorithm                  | Time     | Space    | Notes                                            |
|---------------------------|---------|----------|--------------------------------------------------|
| LCS (standard DP)         | O(mn)   | O(mn)    | Classic approach; can recover subsequence          |
| LCS (space-optimized)     | O(mn)   | O(min(m,n)) | Only computes length, not the subsequence       |
| Hirschberg's Algorithm     | O(mn)   | O(min(m,n)) | Recovers subsequence with linear space          |
| Edit Distance              | O(mn)   | O(mn)    | Counts operations to transform one string to another |
| Longest Common Substring   | O(mn)   | O(mn)    | Requires contiguous matches                       |

## Implementations

| Language   | File |
|------------|------|
| C          | [LCS.c](c/LCS.c) |
| C++        | [LCS.cpp](cpp/LCS.cpp) |
| Java       | [LCS.java](java/LCS.java) |
| TypeScript | [index.js](typescript/index.js) |
| Python     | [Longest_increasing _subsequence.py](python/Longest_increasing _subsequence.py) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15.4: Longest Common Subsequence.
- Hirschberg, D. S. (1975). A linear space algorithm for computing maximal common subsequences. *Communications of the ACM*, 18(6), 341-343.
- [Longest Common Subsequence Problem -- Wikipedia](https://en.wikipedia.org/wiki/Longest_common_subsequence_problem)
