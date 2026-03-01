# Edit Distance

## Overview

Edit Distance (also known as Levenshtein Distance) measures the minimum number of single-character operations required to transform one string into another. The three permitted operations are insertion, deletion, and substitution. For example, the edit distance between "kitten" and "sitting" is 3: substitute 'k' with 's', substitute 'e' with 'i', and insert 'g' at the end.

Edit distance is widely used in spell checkers, DNA sequence analysis, natural language processing, and information retrieval. It provides a quantitative measure of how similar or different two strings are.

## How It Works

The algorithm builds a 2D table where `dp[i][j]` represents the minimum edit distance between the first `i` characters of string X and the first `j` characters of string Y. For each cell, we consider three operations: inserting a character into X (cost from cell above + 1), deleting a character from X (cost from cell to the left + 1), or substituting (cost from diagonal + 0 if characters match, or + 1 if they differ).

### Example

Given `X = "SUNDAY"` and `Y = "SATURDAY"`:

**Building the DP table:**

|   |   | S | A | T | U | R | D | A | Y |
|---|---|---|---|---|---|---|---|---|---|
|   | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| S | 1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| U | 2 | 1 | 1 | 2 | 2 | 3 | 4 | 5 | 6 |
| N | 3 | 2 | 2 | 2 | 3 | 3 | 4 | 5 | 6 |
| D | 4 | 3 | 3 | 3 | 3 | 4 | 3 | 4 | 5 |
| A | 5 | 4 | 3 | 4 | 4 | 4 | 4 | 3 | 4 |
| Y | 6 | 5 | 4 | 4 | 5 | 5 | 5 | 4 | 3 |

**Key cell computations:**

| Cell | X[i] vs Y[j] | Insert | Delete | Sub/Match | Min | Action |
|------|---------------|--------|--------|-----------|-----|--------|
| (1,1) | S vs S | dp[0][1]+1=2 | dp[1][0]+1=2 | dp[0][0]+0=0 | 0 | Match |
| (2,4) | U vs U | dp[1][4]+1=4 | dp[2][3]+1=3 | dp[1][3]+0=2 | 2 | Match |
| (4,6) | D vs D | dp[3][6]+1=5 | dp[4][5]+1=5 | dp[3][5]+0=3 | 3 | Match |
| (6,8) | Y vs Y | dp[5][8]+1=5 | dp[6][7]+1=5 | dp[5][7]+0=3 | 3 | Match |

Result: Edit Distance = `3` (insert 'A', insert 'T', substitute 'N' with 'R')

## Pseudocode

```
function editDistance(X, Y):
    m = length(X)
    n = length(Y)
    dp = 2D array of size (m + 1) x (n + 1)

    // Base cases: transforming empty string
    for i from 0 to m:
        dp[i][0] = i
    for j from 0 to n:
        dp[0][j] = j

    for i from 1 to m:
        for j from 1 to n:
            if X[i - 1] == Y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]       // no operation needed
            else:
                dp[i][j] = 1 + min(dp[i - 1][j],    // delete from X
                                   dp[i][j - 1],     // insert into X
                                   dp[i - 1][j - 1]) // substitute

    return dp[m][n]
```

The base cases represent transforming a string to/from the empty string, which requires exactly as many insertions or deletions as the string length.

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(mn)  | O(mn)  |
| Average | O(mn)  | O(mn)  |
| Worst   | O(mn)  | O(mn)  |

**Why these complexities?**

- **Best Case -- O(mn):** Even if the strings are identical, the algorithm must fill every cell of the m x n table to confirm that no edits are needed.

- **Average Case -- O(mn):** Each cell computation requires O(1) work (comparing characters and taking the minimum of three values). There are (m+1) * (n+1) cells total.

- **Worst Case -- O(mn):** The computation is uniform regardless of how different the strings are. Every cell is computed exactly once.

- **Space -- O(mn):** The standard implementation uses an (m+1) x (n+1) table. If only the distance is needed (not the edit sequence), space can be reduced to O(min(m, n)) by keeping only two rows.

## When to Use

- **Spell checking and autocorrect:** Finding the closest dictionary word to a misspelled word by computing edit distances.
- **DNA/protein sequence comparison:** Measuring the evolutionary distance between biological sequences.
- **Fuzzy string matching:** Finding approximate matches in search engines or databases.
- **Plagiarism detection:** Quantifying the similarity between documents at the character or word level.
- **When you need the exact minimum number of operations:** Edit distance gives an optimal answer, unlike heuristic similarity measures.

## When NOT to Use

- **When only checking equality:** A simple string comparison is O(n) and sufficient.
- **Very long strings with tight time constraints:** O(mn) can be slow for strings of length 10,000+. Consider approximate methods or banded edit distance.
- **When different operations have different costs:** Weighted edit distance requires modifications to the standard algorithm.
- **When you need substring matching:** Use pattern matching algorithms (KMP, Rabin-Karp) instead.

## Comparison with Similar Algorithms

| Algorithm           | Time   | Space   | Notes                                          |
|--------------------|--------|---------|------------------------------------------------|
| Edit Distance (DP) | O(mn)  | O(mn)   | Standard Levenshtein; insert, delete, substitute|
| LCS-based Distance | O(mn)  | O(mn)   | Distance = m + n - 2*LCS; no substitution       |
| Hamming Distance   | O(n)   | O(1)    | Only for equal-length strings; substitution only |
| Sequence Alignment  | O(mn)  | O(m)    | Generalized with gap penalties                   |
| Damerau-Levenshtein| O(mn)  | O(mn)   | Also allows transpositions                       |

## Implementations

| Language | File |
|----------|------|
| C++      | [edit_distance_backtracking.cpp](cpp/edit_distance_backtracking.cpp) |
| Python   | [edit_distance.py](python/edit_distance.py) |
| Swift    | [Edit_Distance.swift](swift/Edit_Distance.swift) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 15-5: Edit Distance.
- Levenshtein, V. I. (1966). Binary codes capable of correcting deletions, insertions, and reversals. *Soviet Physics Doklady*, 10(8), 707-710.
- Wagner, R. A., & Fischer, M. J. (1974). The string-to-string correction problem. *Journal of the ACM*, 21(1), 168-173.
- [Edit Distance -- Wikipedia](https://en.wikipedia.org/wiki/Edit_distance)
