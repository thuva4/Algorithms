# Longest Palindromic Subsequence

## Overview

Given a sequence of integers (or characters), the Longest Palindromic Subsequence (LPS) problem finds the length of the longest subsequence that reads the same forwards and backwards. A subsequence is obtained by deleting zero or more elements without changing the order of the remaining elements. Unlike the longest palindromic substring, the elements in the subsequence need not be contiguous.

This problem is closely related to the Longest Common Subsequence (LCS): the LPS of a sequence is equivalent to the LCS of the sequence and its reverse. It has applications in computational biology, text analysis, and data compression.

## How It Works

Use a 2D DP table where `dp[i][j]` represents the LPS length for the subarray from index i to j.

1. **Base cases:**
   - `dp[i][i] = 1` (a single element is a palindrome of length 1)
   - `dp[i][i-1] = 0` (empty range, used for even-length palindrome computation)

2. **Recurrence (fill diagonally, by increasing length):**
   - If `arr[i] == arr[j]`: `dp[i][j] = dp[i+1][j-1] + 2` (both endpoints contribute to the palindrome)
   - Otherwise: `dp[i][j] = max(dp[i+1][j], dp[i][j-1])` (skip one endpoint)

3. **Answer:** `dp[0][n-1]`

## Worked Example

**Input:** `[1, 2, 3, 2, 1]`

**DP table (i = row, j = column):**

| i\j | 0 | 1 | 2 | 3 | 4 |
|-----|---|---|---|---|---|
| 0   | 1 | 1 | 1 | 3 | **5** |
| 1   |   | 1 | 1 | 3 | 3 |
| 2   |   |   | 1 | 1 | 1 |
| 3   |   |   |   | 1 | 1 |
| 4   |   |   |   |   | 1 |

**Step-by-step for key cells:**

- dp[3][4]: arr[3]=2, arr[4]=1. Not equal. max(dp[4][4], dp[3][3]) = max(1,1) = 1.
- dp[2][3]: arr[2]=3, arr[3]=2. Not equal. max(dp[3][3], dp[2][2]) = max(1,1) = 1.
- dp[1][3]: arr[1]=2, arr[3]=2. Equal! dp[2][2] + 2 = 1 + 2 = 3.
- dp[0][3]: arr[0]=1, arr[3]=2. Not equal. max(dp[1][3], dp[0][2]) = max(3,1) = 3.
- dp[0][4]: arr[0]=1, arr[4]=1. Equal! dp[1][3] + 2 = 3 + 2 = **5**.

**Answer: 5** -- the entire sequence [1, 2, 3, 2, 1] is a palindrome.

**Second example:** `[5, 1, 2, 1, 4]`
LPS = [1, 2, 1] with length 3 (or [5, 1, 5] is not valid since 5 appears only once; the correct LPS is [1, 2, 1]).

## Pseudocode

```
function longestPalindromicSubsequence(arr, n):
    dp = 2D array of size n x n, initialized to 0

    // Base case: single elements
    for i = 0 to n-1:
        dp[i][i] = 1

    // Fill by increasing subsequence length
    for len = 2 to n:
        for i = 0 to n - len:
            j = i + len - 1
            if arr[i] == arr[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])

    return dp[0][n-1]
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| All     | O(n^2) | O(n^2) |

**Why these complexities?**

- **Time -- O(n^2):** There are O(n^2) subproblems (one for each pair (i, j) where i <= j). Each subproblem is solved in O(1) time. Total: O(n^2).

- **Space -- O(n^2):** The full 2D DP table is stored. This can be optimized to O(n) by observing that dp[i][j] only depends on dp[i+1][j-1], dp[i+1][j], and dp[i][j-1], so we can use a single row with a rolling variable.

## When to Use

- **DNA/RNA sequence analysis:** Finding palindromic structures in biological sequences, which are important for understanding secondary structures in RNA.
- **Text processing:** Detecting palindromic patterns in strings or sequences for compression or pattern matching.
- **Data compression:** Palindromic subsequences reveal redundancy that can be exploited for compression.
- **When deletions are allowed:** Unlike the longest palindromic substring (contiguous), LPS allows gaps, making it suitable for noisy or gapped data.

## When NOT to Use

- **When contiguous palindromes are needed:** If the palindrome must be a substring (no gaps), use Manacher's algorithm in O(n) time instead.
- **Very long sequences:** For sequences of length > 10^4 to 10^5, the O(n^2) time and space may be prohibitive. Consider approximate or heuristic approaches.
- **Real-time processing:** The O(n^2) algorithm is not suitable for streaming or real-time applications on long inputs.
- **When only existence matters:** If you only need to know whether a palindrome of a certain length exists, faster methods may be available.

## Comparison

| Algorithm                | Time   | Space  | Notes                                       |
|-------------------------|--------|--------|---------------------------------------------|
| **LPS (interval DP)**   | **O(n^2)** | **O(n^2)** | **Finds longest non-contiguous palindrome** |
| LPS via LCS             | O(n^2) | O(n^2) | LCS of sequence and its reverse; equivalent |
| Manacher's Algorithm     | O(n)   | O(n)   | Longest palindromic **substring** only      |
| Expand Around Center     | O(n^2) | O(1)   | For palindromic substrings; simpler         |
| Suffix Array + LCP       | O(n)   | O(n)   | For palindromic substrings; complex         |

## Implementations

| Language   | File |
|------------|------|
| Python     | [longest_palindromic_subsequence.py](python/longest_palindromic_subsequence.py) |
| Java       | [LongestPalindromicSubsequence.java](java/LongestPalindromicSubsequence.java) |
| C++        | [longest_palindromic_subsequence.cpp](cpp/longest_palindromic_subsequence.cpp) |
| C          | [longest_palindromic_subsequence.c](c/longest_palindromic_subsequence.c) |
| Go         | [longest_palindromic_subsequence.go](go/longest_palindromic_subsequence.go) |
| TypeScript | [longestPalindromicSubsequence.ts](typescript/longestPalindromicSubsequence.ts) |
| Rust       | [longest_palindromic_subsequence.rs](rust/longest_palindromic_subsequence.rs) |
| Kotlin     | [LongestPalindromicSubsequence.kt](kotlin/LongestPalindromicSubsequence.kt) |
| Swift      | [LongestPalindromicSubsequence.swift](swift/LongestPalindromicSubsequence.swift) |
| Scala      | [LongestPalindromicSubsequence.scala](scala/LongestPalindromicSubsequence.scala) |
| C#         | [LongestPalindromicSubsequence.cs](csharp/LongestPalindromicSubsequence.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming (LCS-based approach).
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Pearson. Chapter 6: Dynamic Programming.
- [Longest Palindromic Subsequence -- Wikipedia](https://en.wikipedia.org/wiki/Longest_palindromic_subsequence)
- [Longest Palindromic Subsequence -- GeeksforGeeks](https://www.geeksforgeeks.org/longest-palindromic-subsequence-dp-12/)
