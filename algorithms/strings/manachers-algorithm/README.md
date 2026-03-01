# Manacher's Algorithm

## Overview

Manacher's algorithm finds the longest palindromic substring (or subarray) in linear O(n) time. Published by Glenn Manacher in 1975, it is the optimal algorithm for this problem. The key insight is to reuse information from previously computed palindromes: if we already know a large palindrome exists, positions within it have "mirror" positions whose palindrome radii provide a lower bound, avoiding redundant comparisons.

The algorithm transforms the input by inserting sentinel values between elements to handle both odd and even length palindromes uniformly.

## How It Works

1. **Transform the input:** Insert a sentinel value (one not present in the array) between each element and at both ends. For input `[a, b, c]`, the transformed array becomes `[#, a, #, b, #, c, #]`. This ensures every palindrome in the original maps to an odd-length palindrome in the transformed array.
2. **Maintain state:** Track `center` (center of the rightmost palindrome found so far) and `right` (the right boundary of that palindrome).
3. **For each position i in the transformed array:**
   - If `i < right`, use the mirror position `mirror = 2 * center - i`. Initialize `P[i] = min(right - i, P[mirror])`, leveraging the palindrome at the mirror position.
   - Attempt to expand the palindrome at `i` by comparing elements at `i - P[i] - 1` and `i + P[i] + 1`.
   - If the palindrome at `i` extends beyond `right`, update `center = i` and `right = i + P[i]`.
4. The maximum value in `P` gives the length of the longest palindromic subarray in the original input.

## Worked Example

Given input: `[1, 2, 1, 2, 1]`

**Step 1 -- Transform:** `[#, 1, #, 2, #, 1, #, 2, #, 1, #]` (indices 0-10)

**Step 2 -- Compute P array:**

```
Index:     0  1  2  3  4  5  6  7  8  9  10
Transformed: #  1  #  2  #  1  #  2  #  1  #
P:         0  1  0  3  0  5  0  3  0  1  0
```

- At index 5 (element `1`): the palindrome expands to cover `[1,2,1,2,1]` giving P[5] = 5.
- Positions 7 and 9 use mirror information from positions 3 and 1 respectively.

**Step 3 -- Extract result:** max(P) = 5, so the longest palindrome has length 5: `[1, 2, 1, 2, 1]`.

**Result:** 5

## Pseudocode

```
function manacher(arr):
    // Transform: insert sentinels
    t = [SENTINEL]
    for each element e in arr:
        t.append(e)
        t.append(SENTINEL)
    n = length(t)

    P = array of n zeros
    center = 0
    right = 0

    for i from 0 to n - 1:
        mirror = 2 * center - i
        if i < right:
            P[i] = min(right - i, P[mirror])

        // Attempt expansion
        while i - P[i] - 1 >= 0 and i + P[i] + 1 < n
              and t[i - P[i] - 1] == t[i + P[i] + 1]:
            P[i] = P[i] + 1

        // Update center and right boundary
        if i + P[i] > right:
            center = i
            right = i + P[i]

    return max(P)
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

- **Time O(n):** Although there is an inner while loop for expansion, each element is visited at most twice as the `right` boundary only moves forward. The amortized work per element is O(1).
- **Space O(n):** The transformed array and the P array each use O(n) space.
- The linear time bound holds for all inputs, including worst-case inputs like all-same-elements arrays.

## When to Use

- Finding the longest palindromic substring or subarray in optimal linear time
- Competitive programming problems involving palindromes
- DNA sequence analysis where palindromic structures indicate biological features (restriction enzyme sites, hairpin loops)
- Text processing applications requiring palindrome detection on large inputs
- When the O(n^2) expand-around-center approach is too slow

## When NOT to Use

- **Small inputs (n < 1000):** The simpler expand-around-center approach is easier to implement and equally fast for small data.
- **When you need all palindromic substrings:** Manacher's finds the longest, but if you need to enumerate all distinct palindromes, consider the Eertree (palindromic tree) data structure.
- **When the problem is not about contiguous subsequences:** Manacher's works on contiguous subarrays/substrings. For longest palindromic subsequences (not necessarily contiguous), use dynamic programming in O(n^2).
- **When implementation simplicity is prioritized:** The mirror-based logic can be tricky to implement correctly. The expand-around-center method is more intuitive.

## Comparison

| Algorithm              | Time   | Space | What It Finds                        |
|------------------------|--------|-------|--------------------------------------|
| Manacher's Algorithm   | O(n)   | O(n)  | Longest palindromic substring        |
| Expand Around Center   | O(n^2) | O(1)  | Longest palindromic substring        |
| DP Table               | O(n^2) | O(n^2)| Longest palindromic substring/subseq |
| Eertree                | O(n)   | O(n)  | All distinct palindromic substrings  |
| Suffix Array + LCP     | O(n log n) | O(n) | Longest palindromic substring      |

Manacher's algorithm is the gold standard for the longest palindromic substring problem due to its optimal O(n) time. The expand-around-center approach trades speed for simplicity and zero extra space. The Eertree is more powerful if you need to count or enumerate all distinct palindromic substrings.

## References

- Manacher, G. (1975). "A New Linear-Time 'On-Line' Algorithm for Finding the Smallest Initial Palindrome of a String." *Journal of the ACM*, 22(3), 346-351.
- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences*, Section 9.2. Cambridge University Press.
- Jeuring, J. (1994). "The derivation of on-line algorithms, with an application to finding palindromes." *Algorithmica*, 11(2), 146-184.

## Implementations

| Language   | File |
|------------|------|
| Python     | [longest_palindrome_length.py](python/longest_palindrome_length.py) |
| Java       | [LongestPalindromeLength.java](java/LongestPalindromeLength.java) |
| C++        | [longest_palindrome_length.cpp](cpp/longest_palindrome_length.cpp) |
| C          | [longest_palindrome_length.c](c/longest_palindrome_length.c) |
| Go         | [longest_palindrome_length.go](go/longest_palindrome_length.go) |
| TypeScript | [longestPalindromeLength.ts](typescript/longestPalindromeLength.ts) |
| Rust       | [longest_palindrome_length.rs](rust/longest_palindrome_length.rs) |
| Kotlin     | [LongestPalindromeLength.kt](kotlin/LongestPalindromeLength.kt) |
| Swift      | [LongestPalindromeLength.swift](swift/LongestPalindromeLength.swift) |
| Scala      | [LongestPalindromeLength.scala](scala/LongestPalindromeLength.scala) |
| C#         | [LongestPalindromeLength.cs](csharp/LongestPalindromeLength.cs) |
