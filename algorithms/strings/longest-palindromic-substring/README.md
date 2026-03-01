# Longest Palindromic Substring

## Overview

The Longest Palindromic Substring problem asks for the length of the longest contiguous subarray (or substring) that reads the same forwards and backwards. This implementation uses the expand-around-center approach: for each possible center position in the array, it expands outward as long as the palindrome condition holds, tracking the maximum length found. This is an intuitive O(n^2) method that uses O(1) extra space.

## How It Works

1. For each index `i` in the array, treat it as the center of an odd-length palindrome. Expand outward comparing elements at equal distances from `i`. Record the length.
2. For each pair of adjacent indices `(i, i+1)`, treat the gap between them as the center of an even-length palindrome. Expand outward similarly.
3. Track and return the maximum palindrome length found across all centers.

## Worked Example

Given input: `[1, 2, 3, 2, 1]`

**Odd-length expansions:**
- Center at index 0: `[1]` -- length 1
- Center at index 1: `[2]`, expand to `[1,2,3]` -- `1 != 3`, so length 1
- Center at index 2: `[3]`, expand to `[2,3,2]` -- match, expand to `[1,2,3,2,1]` -- match, length 5
- Center at index 3: `[2]`, expand to `[3,2,1]` -- `3 != 1`, so length 1
- Center at index 4: `[1]` -- length 1

**Even-length expansions:**
- Centers (0,1): `1 != 2`, length 0
- Centers (1,2): `2 != 3`, length 0
- Centers (2,3): `3 != 2`, length 0
- Centers (3,4): `2 != 1`, length 0

**Result:** 5 (the entire array `[1, 2, 3, 2, 1]` is a palindrome)

## Pseudocode

```
function longestPalindromicSubstring(arr):
    n = length(arr)
    if n == 0: return 0
    maxLen = 1

    function expandAroundCenter(left, right):
        while left >= 0 and right < n and arr[left] == arr[right]:
            left = left - 1
            right = right + 1
        return right - left - 1

    for i from 0 to n - 1:
        oddLen = expandAroundCenter(i, i)
        evenLen = expandAroundCenter(i, i + 1)
        maxLen = max(maxLen, oddLen, evenLen)

    return maxLen
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

- **Best case O(n):** When no palindrome longer than 1 exists (all elements distinct), each expansion terminates immediately after one comparison.
- **Average/Worst case O(n^2):** Each of the O(n) centers can expand up to O(n) positions. The worst case occurs with inputs like `[a, a, a, ..., a]` where every center expands fully.
- **Space O(1):** Only a few variables are needed beyond the input array.

## When to Use

- Finding palindromic substrings in text or genomic data
- DNA sequence analysis where palindromic regions have biological significance
- Text processing and computational linguistics
- When simplicity of implementation is valued over optimal time complexity
- When space is limited (this approach uses O(1) extra space)
- Interview problems and competitive programming

## When NOT to Use

- **When linear time is required:** For large inputs, use Manacher's algorithm which solves the same problem in O(n) time and O(n) space.
- **When you need all palindromic substrings:** Use Eertree (palindromic tree) to enumerate all distinct palindromic substrings efficiently.
- **When matching palindromes across two strings:** Use dynamic programming or suffix-based methods instead.
- **Very large inputs (n > 100,000):** The O(n^2) worst case becomes too slow; Manacher's algorithm is the better choice.

## Comparison

| Algorithm             | Time   | Space | Notes                                     |
|-----------------------|--------|-------|-------------------------------------------|
| Expand Around Center  | O(n^2) | O(1)  | Simple, practical, no extra space          |
| Manacher's Algorithm  | O(n)   | O(n)  | Optimal time, more complex to implement    |
| Dynamic Programming   | O(n^2) | O(n^2)| Stores full DP table, high memory usage    |
| Suffix Array + LCP    | O(n log n) | O(n) | Powerful but complex; overkill for this  |

The expand-around-center approach is the best choice when simplicity matters and input sizes are moderate. For competitive programming or large-scale applications, Manacher's algorithm is preferred for its guaranteed O(n) performance.

## References

- Manacher, G. (1975). "A New Linear-Time 'On-Line' Algorithm for Finding the Smallest Initial Palindrome of a String." *Journal of the ACM*, 22(3), 346-351.
- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences*. Cambridge University Press.
- Cormen, T.H., Leiserson, C.E., Rivest, R.L., and Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.

## Implementations

| Language   | File |
|------------|------|
| Python     | [longest_palindrome_subarray.py](python/longest_palindrome_subarray.py) |
| Java       | [LongestPalindromeSubarray.java](java/LongestPalindromeSubarray.java) |
| C++        | [longest_palindrome_subarray.cpp](cpp/longest_palindrome_subarray.cpp) |
| C          | [longest_palindrome_subarray.c](c/longest_palindrome_subarray.c) |
| Go         | [longest_palindrome_subarray.go](go/longest_palindrome_subarray.go) |
| TypeScript | [longestPalindromeSubarray.ts](typescript/longestPalindromeSubarray.ts) |
| Rust       | [longest_palindrome_subarray.rs](rust/longest_palindrome_subarray.rs) |
| Kotlin     | [LongestPalindromeSubarray.kt](kotlin/LongestPalindromeSubarray.kt) |
| Swift      | [LongestPalindromeSubarray.swift](swift/LongestPalindromeSubarray.swift) |
| Scala      | [LongestPalindromeSubarray.scala](scala/LongestPalindromeSubarray.scala) |
| C#         | [LongestPalindromeSubarray.cs](csharp/LongestPalindromeSubarray.cs) |
