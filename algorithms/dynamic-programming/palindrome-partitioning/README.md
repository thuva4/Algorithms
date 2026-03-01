# Palindrome Partitioning

## Overview

Palindrome Partitioning finds the minimum number of cuts needed to partition a sequence into palindromic subsequences. A palindrome reads the same forwards and backwards. Given a sequence of n elements, every single element is trivially a palindrome, so at most n-1 cuts are needed. The challenge is to find the fewest cuts such that every resulting segment is a palindrome. This problem appears in text processing, DNA sequence analysis, and compiler optimization.

## How It Works

The algorithm uses two layers of dynamic programming:

1. **Palindrome table:** Build a boolean table `isPalin[i][j]` indicating whether the subarray from index i to j is a palindrome. This is filled using the recurrence: `isPalin[i][j] = true` if `arr[i] == arr[j]` and either `j - i <= 1` or `isPalin[i+1][j-1]` is true.

2. **Minimum cuts:** Define `cuts[i]` as the minimum number of cuts needed for the subarray from index 0 to i. For each position i, if the entire prefix `arr[0..i]` is a palindrome, then `cuts[i] = 0`. Otherwise, try every possible last cut position j (from 0 to i-1): if `arr[j+1..i]` is a palindrome, then `cuts[i] = min(cuts[i], cuts[j] + 1)`.

Input format: array of integers
Output: minimum number of cuts

## Example

Given input: `[1, 2, 3, 2, 1]`

**Palindrome table (relevant entries):**
- `isPalin[0][4]` = true (the whole array `[1,2,3,2,1]` is a palindrome)
- `isPalin[1][3]` = true (`[2,3,2]` is a palindrome)
- Each single element is a palindrome

Since the entire array is already a palindrome, the minimum cuts = **0**.

Given input: `[1, 2, 3, 4, 5]`

No subarray of length > 1 is a palindrome, so every element must be its own partition. Minimum cuts = **4** (yielding `[1] [2] [3] [4] [5]`).

Given input: `[1, 2, 1, 2, 1]`

- `isPalin[0][4]` = true (`[1,2,1,2,1]` is a palindrome)
- Minimum cuts = **0**.

Given input: `[1, 2, 3, 1, 2]`

- No long palindromes span the entire array.
- `isPalin[0][0]` through `isPalin[4][4]` are all true (single elements).
- `cuts[0] = 0`, `cuts[1] = 1`, `cuts[2] = 2`, `cuts[3] = 3`, `cuts[4] = 4`.
- Minimum cuts = **4**.

## Pseudocode

```
function palindromePartition(arr, n):
    // Step 1: Build palindrome table
    isPalin[0..n-1][0..n-1] = false
    for i from 0 to n-1:
        isPalin[i][i] = true
    for length from 2 to n:
        for i from 0 to n - length:
            j = i + length - 1
            if arr[i] == arr[j]:
                if length == 2 or isPalin[i+1][j-1]:
                    isPalin[i][j] = true

    // Step 2: Find minimum cuts
    cuts[0..n-1] = infinity
    for i from 0 to n-1:
        if isPalin[0][i]:
            cuts[i] = 0
        else:
            for j from 0 to i-1:
                if isPalin[j+1][i] and cuts[j] + 1 < cuts[i]:
                    cuts[i] = cuts[j] + 1

    return cuts[n-1]
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^2) | O(n^2) |
| Average | O(n^2) | O(n^2) |
| Worst   | O(n^2) | O(n^2) |

The palindrome table requires O(n^2) time and space to construct. The minimum-cuts computation also takes O(n^2) time in the worst case (checking all possible cut positions for each index). The space is dominated by the n x n palindrome table.

## When to Use

- **Text segmentation:** Breaking a string into palindromic parts, useful in natural language processing and DNA analysis.
- **Compiler optimization:** Decomposing code patterns into symmetric structures.
- **String processing pipelines:** When downstream operations require palindromic segments.
- **Competitive programming:** A classic DP problem that appears frequently in contests.

## When NOT to Use

- **Enumerating all palindrome partitions:** This algorithm only counts minimum cuts, not all possible partitions. Use backtracking for enumeration.
- **Very long sequences where approximate answers suffice:** The O(n^2) space may be prohibitive for extremely large inputs. Consider Manacher's algorithm for palindrome detection combined with greedy heuristics.
- **When the input is guaranteed to already be a palindrome:** The answer is trivially 0 and no DP is needed.

## Comparison

| Approach                  | Time   | Space  | Notes                                  |
|---------------------------|--------|--------|----------------------------------------|
| DP (this algorithm)       | O(n^2) | O(n^2) | Optimal for exact minimum cuts         |
| Brute Force (recursion)   | O(2^n) | O(n)   | Exponential; impractical for large n   |
| Memoized recursion        | O(n^2) | O(n^2) | Same complexity, top-down approach     |
| Optimized Manacher + DP   | O(n^2) | O(n)   | Can reduce space using Manacher's      |

## Implementations

| Language   | File |
|------------|------|
| Python     | [palindrome_partitioning.py](python/palindrome_partitioning.py) |
| Java       | [PalindromePartitioning.java](java/PalindromePartitioning.java) |
| C++        | [palindrome_partitioning.cpp](cpp/palindrome_partitioning.cpp) |
| C          | [palindrome_partitioning.c](c/palindrome_partitioning.c) |
| Go         | [palindrome_partitioning.go](go/palindrome_partitioning.go) |
| TypeScript | [palindromePartitioning.ts](typescript/palindromePartitioning.ts) |
| Rust       | [palindrome_partitioning.rs](rust/palindrome_partitioning.rs) |
| Kotlin     | [PalindromePartitioning.kt](kotlin/PalindromePartitioning.kt) |
| Swift      | [PalindromePartitioning.swift](swift/PalindromePartitioning.swift) |
| Scala      | [PalindromePartitioning.scala](scala/PalindromePartitioning.scala) |
| C#         | [PalindromePartitioning.cs](csharp/PalindromePartitioning.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Palindrome Partitioning -- Wikipedia](https://en.wikipedia.org/wiki/Palindrome#Computation)
- [Palindrome Partitioning DP -- GeeksforGeeks](https://www.geeksforgeeks.org/palindrome-partitioning-dp-17/)
