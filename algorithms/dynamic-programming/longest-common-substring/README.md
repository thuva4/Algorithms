# Longest Common Substring

## Overview

The Longest Common Substring problem finds the length of the longest contiguous sequence of elements that appears in both of two given sequences. Unlike the Longest Common Subsequence (LCS), which allows gaps, the Longest Common Substring requires that the matching elements be consecutive in both sequences.

For example, given arrays [1, 2, 3, 4, 5] and [3, 4, 5, 6, 7], the longest common substring (contiguous subarray) is [3, 4, 5] with length 3. This problem has applications in plagiarism detection, DNA sequence analysis, data deduplication, and file comparison tools.

## How It Works

The algorithm builds a 2D table `dp[i][j]` where each entry represents the length of the longest common suffix of the subarrays ending at index i-1 in the first array and index j-1 in the second array.

1. **Initialize:** Create a table of size (n+1) x (m+1) filled with zeros, where n and m are the lengths of the two arrays.
2. **Fill the table:** For each pair (i, j), if arr1[i-1] equals arr2[j-1], then `dp[i][j] = dp[i-1][j-1] + 1`. Otherwise, `dp[i][j] = 0`.
3. **Track maximum:** Keep track of the maximum value seen in the table.
4. **Result:** The maximum value in the table is the length of the longest common substring.

### Example

Given arr1 = [1, 2, 3, 2, 1] and arr2 = [3, 2, 1, 4, 7]:

**DP Table:**

|     |   | 3 | 2 | 1 | 4 | 7 |
|-----|---|---|---|---|---|---|
|     | 0 | 0 | 0 | 0 | 0 | 0 |
| 1   | 0 | 0 | 0 | 1 | 0 | 0 |
| 2   | 0 | 0 | 1 | 0 | 0 | 0 |
| 3   | 0 | 1 | 0 | 0 | 0 | 0 |
| 2   | 0 | 0 | 2 | 0 | 0 | 0 |
| 1   | 0 | 0 | 0 | 3 | 0 | 0 |

The maximum value is **3**, corresponding to the common substring [3, 2, 1] (indices 2-4 of arr1 and indices 0-2 of arr2).

## Pseudocode

```
function longestCommonSubstring(arr1, arr2):
    n = length(arr1)
    m = length(arr2)
    dp = 2D array of size (n+1) x (m+1), initialized to 0
    maxLen = 0

    for i from 1 to n:
        for j from 1 to m:
            if arr1[i-1] == arr2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                maxLen = max(maxLen, dp[i][j])
            else:
                dp[i][j] = 0

    return maxLen
```

## Complexity Analysis

| Case    | Time    | Space   |
|---------|---------|---------|
| Best    | O(n*m)  | O(n*m)  |
| Average | O(n*m)  | O(n*m)  |
| Worst   | O(n*m)  | O(n*m)  |

**Why these complexities?**

- **Time -- O(n*m):** The algorithm fills every cell of the (n+1) x (m+1) table exactly once, with O(1) work per cell.

- **Space -- O(n*m):** The full 2D table is stored. Note: space can be optimized to O(min(n, m)) by keeping only the previous row, since each cell depends only on the diagonal predecessor.

## Applications

- **Plagiarism detection:** Finding the longest copied passage between two documents.
- **DNA sequence analysis:** Identifying the longest common gene segment between two DNA sequences.
- **Data deduplication:** Finding repeated data blocks across files or storage systems.
- **Diff tools:** File comparison utilities use variants of this to find matching regions.
- **Version control:** Identifying unchanged regions between file revisions.

## When NOT to Use

- **When gaps are allowed:** Use Longest Common Subsequence instead if the common elements do not need to be contiguous.
- **Very long sequences:** For extremely long sequences, the O(n*m) time and space may be prohibitive. Suffix tree/array approaches achieve O(n+m) time.
- **Approximate matching:** When fuzzy or approximate matches are acceptable, edit distance or other similarity measures are more appropriate.

## Comparison with Similar Algorithms

| Algorithm                   | Time      | Space     | Notes                                    |
|-----------------------------|-----------|-----------|------------------------------------------|
| Longest Common Substring    | O(n*m)    | O(n*m)    | Contiguous match required                |
| Longest Common Subsequence  | O(n*m)    | O(n*m)    | Gaps allowed; more general               |
| Edit Distance               | O(n*m)    | O(n*m)    | Measures total difference                 |
| Suffix Tree approach        | O(n+m)    | O(n+m)    | Faster but more complex to implement      |
| Suffix Array approach       | O((n+m)log(n+m)) | O(n+m) | Good practical performance          |

## Implementations

| Language   | File |
|------------|------|
| Python     | [longest_common_substring.py](python/longest_common_substring.py) |
| Java       | [LongestCommonSubstring.java](java/LongestCommonSubstring.java) |
| TypeScript | [longestCommonSubstring.ts](typescript/longestCommonSubstring.ts) |
| C++        | [longest_common_substring.cpp](cpp/longest_common_substring.cpp) |
| C          | [longest_common_substring.c](c/longest_common_substring.c) |
| Go         | [LongestCommonSubstring.go](go/LongestCommonSubstring.go) |
| Rust       | [longest_common_substring.rs](rust/longest_common_substring.rs) |
| Kotlin     | [LongestCommonSubstring.kt](kotlin/LongestCommonSubstring.kt) |
| Swift      | [LongestCommonSubstring.swift](swift/LongestCommonSubstring.swift) |
| Scala      | [LongestCommonSubstring.scala](scala/LongestCommonSubstring.scala) |
| C#         | [LongestCommonSubstring.cs](csharp/LongestCommonSubstring.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences*. Cambridge University Press.
- [Longest Common Substring Problem -- Wikipedia](https://en.wikipedia.org/wiki/Longest_common_substring_problem)
