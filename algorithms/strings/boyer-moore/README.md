# Boyer-Moore Search

## Overview

The Boyer-Moore algorithm is one of the most efficient string-matching algorithms in practice, developed by Robert S. Boyer and J Strother Moore in 1977. It searches for a pattern within a text by scanning the pattern from right to left, using two heuristics -- the bad-character rule and the good-suffix rule -- to skip large portions of the text. On natural-language text the algorithm often achieves sublinear performance, examining fewer characters than the length of the text.

This implementation uses the bad-character heuristic: when a mismatch occurs, the algorithm looks up the mismatched text character in a precomputed table to determine how far the pattern can safely be shifted forward.

## How It Works

1. **Build the bad-character table:** For each distinct value in the pattern, record the index of its rightmost occurrence. Values not in the pattern get a default shift equal to the full pattern length.
2. **Align the pattern** at the beginning of the text.
3. **Compare from right to left:** Start comparing at the last character of the pattern and move leftward.
4. **On a mismatch:** Look up the mismatched text character in the bad-character table. Shift the pattern so that the rightmost occurrence of that character in the pattern aligns with the mismatched position in the text. If no occurrence exists, shift the entire pattern past the mismatch point.
5. **On a full match:** Return the current alignment index.
6. **Repeat** until the pattern slides past the end of the text or a match is found.

Input format: `[text_len, ...text, pattern_len, ...pattern]`

## Worked Example

Given input: `[10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3, 4, 5, 6]`

- Text: `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, Pattern: `[4, 5, 6]`
- Bad-character table: `{4: 0, 5: 1, 6: 2}`

**Step 1:** Align pattern at index 0. Compare text[2] vs pattern[2]: `3 != 6`. Character `3` is not in the pattern, so shift by 3 (full pattern length). Pattern now at index 3.

**Step 2:** Align pattern at index 3. Compare text[5] vs pattern[2]: `6 == 6`. Compare text[4] vs pattern[1]: `5 == 5`. Compare text[3] vs pattern[0]: `4 == 4`. Full match found.

**Result:** 3

## Pseudocode

```
function boyerMooreSearch(text, pattern):
    n = length(text)
    m = length(pattern)
    if m == 0: return 0
    if m > n: return -1

    // Build bad-character table
    badChar = {}
    for i from 0 to m - 1:
        badChar[pattern[i]] = i

    // Search
    s = 0  // shift of pattern with respect to text
    while s <= n - m:
        j = m - 1
        while j >= 0 and pattern[j] == text[s + j]:
            j = j - 1
        if j < 0:
            return s  // match found
        else:
            charIndex = badChar.get(text[s + j], -1)
            shift = max(1, j - charIndex)
            s = s + shift

    return -1  // no match
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n/m) | O(k)  |
| Average | O(n)   | O(k)  |
| Worst   | O(n*m) | O(k)  |

Where `n` is the text length, `m` is the pattern length, and `k` is the alphabet size (number of distinct values).

- **Best case O(n/m):** When every mismatch involves a character not in the pattern, the algorithm can skip m positions at a time. This happens frequently with large alphabets and short patterns.
- **Average case O(n):** On typical inputs the algorithm performs linearly, often examining only a fraction of characters.
- **Worst case O(n*m):** Occurs with pathological inputs like text = "aaa...a" and pattern = "ba...a". The good-suffix rule (not implemented here) reduces the worst case to O(n+m).
- **Space O(k):** The bad-character table stores one entry per distinct value in the pattern.

## When to Use

- Searching for a single pattern in a large body of text, especially with a large alphabet (e.g., ASCII or Unicode text)
- When the pattern is relatively long compared to the alphabet size
- Real-time text editors and "find" functionality
- DNA sequence matching where the pattern is not extremely short
- Log file scanning and data stream pattern detection
- When you need a practical, fast pattern matcher without heavy preprocessing

## When NOT to Use

- **Multiple pattern search:** If you need to find many patterns simultaneously, use Aho-Corasick instead.
- **Very short patterns (1-3 characters):** The overhead of building the bad-character table outweighs the benefit; a naive scan or built-in string search is faster.
- **Small alphabets with repetitive text:** With binary data or very small alphabets, the bad-character heuristic provides minimal skipping. KMP is more predictable in these cases.
- **When guaranteed linear worst case is required:** Pure bad-character Boyer-Moore has O(n*m) worst case. Use KMP (always O(n+m)) or the full Boyer-Moore with the good-suffix rule for O(n+m) worst case.

## Comparison

| Algorithm     | Preprocessing | Search (avg) | Search (worst) | Multiple patterns |
|---------------|---------------|-------------|----------------|-------------------|
| Boyer-Moore   | O(m + k)      | O(n/m)      | O(n*m)*        | No                |
| KMP           | O(m)          | O(n)        | O(n)           | No                |
| Rabin-Karp    | O(m)          | O(n+m)      | O(n*m)         | Yes               |
| Naive         | O(1)          | O(n*m)      | O(n*m)         | No                |
| Aho-Corasick  | O(sum of m)   | O(n + z)    | O(n + z)       | Yes               |

*Full Boyer-Moore with good-suffix rule achieves O(n+m) worst case.

Boyer-Moore is typically the fastest single-pattern algorithm in practice for natural text due to its ability to skip characters. KMP provides stronger worst-case guarantees with simpler implementation. Rabin-Karp extends naturally to multiple patterns but uses hashing with potential for collisions.

## References

- Boyer, R.S. and Moore, J.S. (1977). "A Fast String Searching Algorithm." *Communications of the ACM*, 20(10), 762-772.
- Horspool, R.N. (1980). "Practical Fast Searching in Strings." *Software: Practice and Experience*, 10(6), 501-506.
- Cormen, T.H., Leiserson, C.E., Rivest, R.L., and Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 32. MIT Press.
- Sedgewick, R. and Wayne, K. (2011). *Algorithms* (4th ed.), Section 5.3. Addison-Wesley.

## Implementations

| Language   | File |
|------------|------|
| Python     | [boyer_moore_search.py](python/boyer_moore_search.py) |
| Java       | [BoyerMooreSearch.java](java/BoyerMooreSearch.java) |
| C++        | [boyer_moore_search.cpp](cpp/boyer_moore_search.cpp) |
| C          | [boyer_moore_search.c](c/boyer_moore_search.c) |
| Go         | [boyer_moore_search.go](go/boyer_moore_search.go) |
| TypeScript | [boyerMooreSearch.ts](typescript/boyerMooreSearch.ts) |
| Rust       | [boyer_moore_search.rs](rust/boyer_moore_search.rs) |
| Kotlin     | [BoyerMooreSearch.kt](kotlin/BoyerMooreSearch.kt) |
| Swift      | [BoyerMooreSearch.swift](swift/BoyerMooreSearch.swift) |
| Scala      | [BoyerMooreSearch.scala](scala/BoyerMooreSearch.scala) |
| C#         | [BoyerMooreSearch.cs](csharp/BoyerMooreSearch.cs) |
