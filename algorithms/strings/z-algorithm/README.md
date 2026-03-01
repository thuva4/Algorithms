# Z-Algorithm

## Overview

The Z-algorithm computes the Z-array for a given sequence in linear time. For a sequence S of length n, the Z-array is defined as: Z[i] is the length of the longest substring starting at position i that matches a prefix of S. By convention, Z[0] is set to 0 (or sometimes n). The algorithm runs in O(n) time by maintaining a window [L, R] representing the rightmost interval that matches a prefix of S, reusing previously computed Z-values to avoid redundant comparisons.

The Z-algorithm is a powerful tool for pattern matching: by concatenating `pattern + sentinel + text`, the Z-array will have values equal to the pattern length at every position where the pattern occurs in the text.

## How It Works

1. Initialize Z[0] = 0 (by convention), L = 0, R = 0.
2. For each position i from 1 to n-1:
   - If `i < R`, then position i is inside the current Z-box [L, R]. Its mirror position is `i - L`. Set `Z[i] = min(R - i, Z[i - L])` as a starting point.
   - Attempt to extend: while `i + Z[i] < n` and `S[Z[i]] == S[i + Z[i]]`, increment Z[i].
   - If `i + Z[i] > R`, update L = i and R = i + Z[i].
3. The Z-array is complete.

## Worked Example

Given input: `[1, 1, 2, 1, 1, 2, 1]`

**Computing the Z-array step by step:**

```
Index:  0  1  2  3  4  5  6
Value:  1  1  2  1  1  2  1
Z:      0  1  0  4  1  0  1
```

- Z[0] = 0 (by convention)
- Z[1]: Compare S[0]=1 with S[1]=1: match. Compare S[1]=1 with S[2]=2: mismatch. Z[1] = 1. Update L=1, R=2.
- Z[2]: i=2, i >= R=2. Compare S[0]=1 with S[2]=2: mismatch. Z[2] = 0.
- Z[3]: i=3, i >= R=2. Compare S[0]=1 with S[3]=1, S[1]=1 with S[4]=1, S[2]=2 with S[5]=2, S[3]=1 with S[6]=1. Then S[4]=1 but index 7 is out of bounds. Z[3] = 4. Update L=3, R=7.
- Z[4]: i=4, i < R=7. Mirror = 4-3 = 1. Z[1] = 1, R-i = 3. Z[4] = min(3, 1) = 1. Try to extend: S[1]=1 vs S[5]=2: mismatch. Z[4] = 1.
- Z[5]: i=5, i < R=7. Mirror = 5-3 = 2. Z[2] = 0, R-i = 2. Z[5] = 0.
- Z[6]: i=6, i < R=7. Mirror = 6-3 = 3. Z[3] = 4, R-i = 1. Z[6] = min(1, 4) = 1. Try to extend: index 7 out of bounds. Z[6] = 1.

**Result:** Z-array = `[0, 1, 0, 4, 1, 0, 1]`

**Pattern matching application:** To find pattern `[1, 1]` in text `[2, 1, 1, 2]`, compute the Z-array of `[1, 1, $, 2, 1, 1, 2]` (where $ is a sentinel). Z-values equal to pattern length (2) indicate match positions.

## Pseudocode

```
function zFunction(S):
    n = length(S)
    Z = array of n zeros
    L = 0
    R = 0

    for i from 1 to n - 1:
        if i < R:
            Z[i] = min(R - i, Z[i - L])

        while i + Z[i] < n and S[Z[i]] == S[i + Z[i]]:
            Z[i] = Z[i] + 1

        if i + Z[i] > R:
            L = i
            R = i + Z[i]

    return Z
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

- **Time O(n):** The inner while loop advances the R pointer. Since R only moves forward and is bounded by n, the total number of character comparisons across all iterations is at most 2n. This gives an amortized O(1) per position.
- **Space O(n):** The Z-array requires O(n) storage.
- The algorithm is optimal since computing the Z-array requires examining every character at least once.

## When to Use

- String pattern matching (by concatenating pattern + sentinel + text)
- Finding all occurrences of a pattern in a text in O(n + m) time
- Finding the period of a string (smallest repeating unit)
- String compression: determining if a string is a repetition of a smaller pattern
- Computing prefix function values (the Z-array and KMP failure function are closely related)
- Competitive programming problems involving string matching and periodicity

## When NOT to Use

- **When you only need the first match:** Boyer-Moore or even a naive search may be faster in practice for finding just the first occurrence, since they can stop early.
- **Multi-pattern matching:** For searching multiple patterns simultaneously, use Aho-Corasick. The Z-algorithm handles one pattern at a time.
- **When KMP failure function is already available:** The KMP algorithm solves the same pattern matching problem. If you already have a KMP implementation, using Z-algorithm adds no benefit.
- **Approximate matching:** The Z-algorithm is for exact matching only. For fuzzy matching, use edit distance or other approximate string matching algorithms.

## Comparison

| Algorithm   | Preprocessing | Search Time | Space | Best For                        |
|-------------|---------------|-------------|-------|---------------------------------|
| Z-Algorithm | O(n + m)      | O(n + m)    | O(n+m)| Exact matching, periodicity     |
| KMP         | O(m)          | O(n)        | O(m)  | Exact matching, streaming       |
| Boyer-Moore | O(m + k)      | O(n/m) avg  | O(k)  | Large alphabet, long patterns   |
| Rabin-Karp  | O(m)          | O(n+m) avg  | O(1)  | Multiple pattern matching       |

The Z-algorithm and KMP are closely related and solve the same core problem with the same asymptotic complexity. The Z-algorithm is often considered easier to understand and implement. KMP is better suited for streaming scenarios where the text arrives one character at a time. Boyer-Moore is fastest in practice for single-pattern search on natural text.

## References

- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences*, Chapter 1. Cambridge University Press.
- Cormen, T.H., Leiserson, C.E., Rivest, R.L., and Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 32. MIT Press.
- Crochemore, M. and Rytter, W. (2003). *Jewels of Stringology*. World Scientific.

## Implementations

| Language   | File |
|------------|------|
| Python     | [z_function.py](python/z_function.py) |
| Java       | [ZFunction.java](java/ZFunction.java) |
| C++        | [z_function.cpp](cpp/z_function.cpp) |
| C          | [z_function.c](c/z_function.c) |
| Go         | [z_function.go](go/z_function.go) |
| TypeScript | [zFunction.ts](typescript/zFunction.ts) |
| Rust       | [z_function.rs](rust/z_function.rs) |
| Kotlin     | [ZFunction.kt](kotlin/ZFunction.kt) |
| Swift      | [ZFunction.swift](swift/ZFunction.swift) |
| Scala      | [ZFunction.scala](scala/ZFunction.scala) |
| C#         | [ZFunction.cs](csharp/ZFunction.cs) |
