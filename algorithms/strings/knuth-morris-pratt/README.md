# Knuth-Morris-Pratt

## Overview

The Knuth-Morris-Pratt (KMP) algorithm is an efficient string matching algorithm that searches for occurrences of a pattern within a text in O(n + m) time, where n is the text length and m is the pattern length. Unlike the naive approach that backtracks in the text after a mismatch, KMP uses a precomputed "failure function" (also called the prefix function or partial match table) to skip unnecessary comparisons.

Developed by Donald Knuth, Vaughan Pratt, and James Morris in 1977, KMP was one of the first linear-time string matching algorithms. It is guaranteed to perform at most 2n comparisons in the search phase, making it ideal for applications where worst-case performance matters.

## How It Works

The algorithm has two phases. First, it builds a failure function for the pattern, where `fail[i]` is the length of the longest proper prefix of the pattern that is also a suffix of the pattern up to position i. During the search phase, when a mismatch occurs at position j in the pattern, the failure function tells us the next position in the pattern to compare, avoiding re-examination of text characters.

### Example

Pattern: `"ABABAC"`, Text: `"ABABABABAC"`

**Step 1: Build the failure function:**

| Position (i) | 0 | 1 | 2 | 3 | 4 | 5 |
|--------------|---|---|---|---|---|---|
| Pattern char | A | B | A | B | A | C |
| fail[i] | 0 | 0 | 1 | 2 | 3 | 0 |

- fail[2] = 1: "A" is both prefix and suffix of "ABA"
- fail[3] = 2: "AB" is both prefix and suffix of "ABAB"
- fail[4] = 3: "ABA" is both prefix and suffix of "ABABA"

**Step 2: Search in text:**

```
Text:    A B A B A B A B A C
Pattern: A B A B A C
```

| Step | Text pos (i) | Pattern pos (j) | Compare | Action |
|------|-------------|-----------------|---------|--------|
| 1 | 0 | 0 | A == A | Match, advance both |
| 2 | 1 | 1 | B == B | Match, advance both |
| 3 | 2 | 2 | A == A | Match, advance both |
| 4 | 3 | 3 | B == B | Match, advance both |
| 5 | 4 | 4 | A == A | Match, advance both |
| 6 | 5 | 5 | B != C | Mismatch! j = fail[4] = 3 |
| 7 | 5 | 3 | B == B | Match, advance both |
| 8 | 6 | 4 | A == A | Match, advance both |
| 9 | 7 | 5 | B != C | Mismatch! j = fail[4] = 3 |
| 10 | 7 | 3 | B == B | Match, advance both |
| 11 | 8 | 4 | A == A | Match, advance both |
| 12 | 9 | 5 | C == C | Match! Pattern found at index 4 |

Result: Pattern found at index `4` in the text.

## Pseudocode

```
function buildFailure(pattern):
    m = length(pattern)
    fail = array of size m, initialized to 0
    k = 0

    for i from 1 to m - 1:
        while k > 0 and pattern[k] != pattern[i]:
            k = fail[k - 1]
        if pattern[k] == pattern[i]:
            k = k + 1
        fail[i] = k

    return fail

function kmpSearch(text, pattern):
    n = length(text)
    m = length(pattern)
    fail = buildFailure(pattern)
    j = 0
    results = empty list

    for i from 0 to n - 1:
        while j > 0 and pattern[j] != text[i]:
            j = fail[j - 1]
        if pattern[j] == text[i]:
            j = j + 1
        if j == m:
            results.append(i - m + 1)
            j = fail[j - 1]

    return results
```

The failure function ensures that after a mismatch, we never re-examine a character of the text. The pointer into the text only moves forward, guaranteeing O(n) search time.

## Complexity Analysis

| Case    | Time     | Space |
|---------|---------|-------|
| Best    | O(n + m) | O(m)  |
| Average | O(n + m) | O(m)  |
| Worst   | O(n + m) | O(m)  |

**Why these complexities?**

- **Best Case -- O(n + m):** Building the failure function takes O(m). Even when the pattern is found immediately, the search must still examine text characters sequentially.

- **Average Case -- O(n + m):** The failure function is built in O(m) using a technique similar to the search itself. The search phase performs at most 2n comparisons: the text pointer advances n times, and the pattern pointer can be reset at most n times total.

- **Worst Case -- O(n + m):** Unlike the naive O(nm) approach, KMP never backtracks in the text. The amortized analysis shows that the total number of pattern pointer movements is bounded by 2n.

- **Space -- O(m):** The failure function array has size m. The algorithm does not need to store any additional data proportional to the text length.

## When to Use

- **When worst-case guarantees matter:** KMP provides O(n + m) in all cases, unlike Rabin-Karp which can degrade to O(nm).
- **Single pattern, single text:** KMP is optimal for searching one pattern in one text.
- **Real-time text processing:** The text is processed character by character with no backtracking, making KMP suitable for streaming input.
- **When the pattern has repeating structure:** The failure function leverages repetition in the pattern for maximum efficiency.

## When NOT to Use

- **Multiple patterns simultaneously:** Use Aho-Corasick, which handles multiple patterns in a single pass.
- **When average-case performance is sufficient:** Rabin-Karp with hashing is simpler to implement and works well in practice.
- **Very short patterns:** For patterns of length 1-3, a simple linear scan is just as fast and simpler.
- **Approximate matching:** KMP handles exact matching only. Use edit distance or bitap for fuzzy matching.

## Comparison with Similar Algorithms

| Algorithm      | Time (worst) | Space | Notes                                          |
|---------------|-------------|-------|-------------------------------------------------|
| KMP            | O(n + m)    | O(m)  | Deterministic; no backtracking in text           |
| Rabin-Karp     | O(nm)       | O(1)  | Hash-based; good average case, poor worst case   |
| Boyer-Moore    | O(nm)       | O(m + sigma)| Fastest in practice for natural text        |
| Aho-Corasick   | O(n + m + z)| O(m)  | Multi-pattern; builds automaton from all patterns|
| Naive          | O(nm)       | O(1)  | Simplest; no preprocessing                       |

## Implementations

| Language | File |
|----------|------|
| Python   | [KMP.py](python/KMP.py) |
| Java     | [KMP.java](java/KMP.java) |
| C++      | [KMP.cpp](cpp/KMP.cpp) |

## References

- Knuth, D. E., Morris, J. H., & Pratt, V. R. (1977). Fast pattern matching in strings. *SIAM Journal on Computing*, 6(2), 323-350.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 32.4: The Knuth-Morris-Pratt Algorithm.
- [Knuth-Morris-Pratt Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)
