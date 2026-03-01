# Wildcard Matching

## Overview

Wildcard Matching determines whether a given text matches a pattern that may contain wildcard characters. The `*` wildcard matches any sequence of zero or more elements, while `?` matches exactly one element. This problem is solved efficiently using dynamic programming and is fundamental in file system globbing, database query processing, and text search.

In this implementation, integers encode the pattern: 0 represents `*` (matches any sequence), -1 represents `?` (matches any single element), and positive integers represent literal matches.

## How It Works

The algorithm builds a 2D boolean DP table where `dp[i][j]` indicates whether the first `i` elements of the text match the first `j` elements of the pattern.

1. **Base case:** `dp[0][0] = true` (empty text matches empty pattern). For the first row, `dp[0][j] = true` only if all pattern elements up to j are `*` (since `*` can match zero elements).
2. **Transition rules** for each `(i, j)`:
   - If `pattern[j-1]` is a literal and equals `text[i-1]`: `dp[i][j] = dp[i-1][j-1]`
   - If `pattern[j-1]` is `?` (-1): `dp[i][j] = dp[i-1][j-1]` (matches any single element)
   - If `pattern[j-1]` is `*` (0): `dp[i][j] = dp[i][j-1] OR dp[i-1][j]`
     - `dp[i][j-1]`: the `*` matches zero elements
     - `dp[i-1][j]`: the `*` matches one more element (text[i-1])
3. The answer is `dp[n][m]` where n is the text length and m is the pattern length.

Input format: `[text_len, ...text, pattern_len, ...pattern]`
Output: 1 if matches, 0 otherwise

## Example

**Example 1:** Text = `[3, 4, 5]`, Pattern = `[0]` (just `*`)

| dp    | ""  | *   |
|-------|-----|-----|
| ""    | T   | T   |
| 3     | F   | T   |
| 3,4   | F   | T   |
| 3,4,5 | F   | T   |

Result: **1** (the `*` matches everything)

**Example 2:** Text = `[1, 2, 3]`, Pattern = `[1, -1, 3]` (literal 1, `?`, literal 3)

| dp      | ""  | 1   | ?   | 3   |
|---------|-----|-----|-----|-----|
| ""      | T   | F   | F   | F   |
| 1       | F   | T   | F   | F   |
| 1,2     | F   | F   | T   | F   |
| 1,2,3   | F   | F   | F   | T   |

Result: **1** (1 matches 1, `?` matches 2, 3 matches 3)

**Example 3:** Text = `[1, 2, 3]`, Pattern = `[1, 0, 3]` (literal 1, `*`, literal 3)

| dp      | ""  | 1   | *   | 3   |
|---------|-----|-----|-----|-----|
| ""      | T   | F   | F   | F   |
| 1       | F   | T   | T   | F   |
| 1,2     | F   | F   | T   | F   |
| 1,2,3   | F   | F   | T   | T   |

Result: **1** (1 matches 1, `*` matches [2], 3 matches 3)

## Pseudocode

```
function wildcardMatch(text, n, pattern, m):
    dp = 2D boolean array [n+1][m+1], initialized to false
    dp[0][0] = true

    // Handle leading '*' patterns that match empty text
    for j from 1 to m:
        if pattern[j-1] == STAR:
            dp[0][j] = dp[0][j-1]

    for i from 1 to n:
        for j from 1 to m:
            if pattern[j-1] == STAR:
                dp[i][j] = dp[i][j-1] OR dp[i-1][j]
            else if pattern[j-1] == QUESTION or pattern[j-1] == text[i-1]:
                dp[i][j] = dp[i-1][j-1]
            // else dp[i][j] remains false

    return 1 if dp[n][m] else 0
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(n * m) | O(n * m) |
| Average | O(n * m) | O(n * m) |
| Worst   | O(n * m) | O(n * m) |

Where n is the text length and m is the pattern length. Each cell in the DP table is computed in O(1) time. Space can be optimized to O(m) using a rolling array since each row only depends on the previous row and the current row.

## When to Use

- **File system globbing:** Matching filenames against patterns like `*.txt` or `data_??.csv`.
- **Database LIKE queries:** SQL LIKE with `%` (equivalent to `*`) and `_` (equivalent to `?`).
- **Search filters:** Implementing user-defined search patterns in applications.
- **Network access control lists:** Matching URLs or IP patterns against allow/deny rules.
- **Configuration matching:** Pattern matching in configuration files, routing rules, or log filtering.

## When NOT to Use

- **Full regular expression matching:** Wildcard matching only supports `*` and `?`. For complex patterns with alternation, grouping, or quantifiers, use a proper regex engine.
- **When the pattern has no wildcards:** Simple string comparison in O(n) is sufficient; the DP overhead is unnecessary.
- **Very long texts with very long patterns:** The O(n * m) time and space may be too expensive. For specific pattern types, more efficient algorithms exist (e.g., two-pointer approaches for patterns with limited `*` usage).
- **Streaming/incremental matching:** The DP approach requires the full text upfront. For streaming, consider NFA-based approaches.

## Comparison

| Approach              | Time     | Space    | Wildcards Supported     |
|-----------------------|----------|----------|-------------------------|
| DP (this algorithm)   | O(n * m) | O(n * m) | `*`, `?`               |
| DP (space-optimized)  | O(n * m) | O(m)     | `*`, `?`               |
| Two-pointer / Greedy  | O(n * m) | O(1)     | `*`, `?`               |
| Regex NFA             | O(n * m) | O(m)     | Full regex             |
| Regex backtracking    | O(2^n)   | O(n)     | Full regex (worst case) |

The two-pointer greedy approach can solve wildcard matching with O(1) space by tracking the last `*` position and backtracking when a mismatch occurs. It has the same worst-case time but is faster in practice for patterns with few `*` characters.

## Implementations

| Language   | File |
|------------|------|
| Python     | [wildcard_matching.py](python/wildcard_matching.py) |
| Java       | [WildcardMatching.java](java/WildcardMatching.java) |
| C++        | [wildcard_matching.cpp](cpp/wildcard_matching.cpp) |
| C          | [wildcard_matching.c](c/wildcard_matching.c) |
| Go         | [wildcard_matching.go](go/wildcard_matching.go) |
| TypeScript | [wildcardMatching.ts](typescript/wildcardMatching.ts) |
| Rust       | [wildcard_matching.rs](rust/wildcard_matching.rs) |
| Kotlin     | [WildcardMatching.kt](kotlin/WildcardMatching.kt) |
| Swift      | [WildcardMatching.swift](swift/WildcardMatching.swift) |
| Scala      | [WildcardMatching.scala](scala/WildcardMatching.scala) |
| C#         | [WildcardMatching.cs](csharp/WildcardMatching.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Wildcard Matching -- LeetCode Problem 44](https://leetcode.com/problems/wildcard-matching/)
- [Glob (programming) -- Wikipedia](https://en.wikipedia.org/wiki/Glob_(programming))
