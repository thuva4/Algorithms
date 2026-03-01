# Sequence Alignment

## Overview

Sequence Alignment is a dynamic programming algorithm that finds the optimal way to align two sequences by inserting gaps to maximize similarity (or minimize penalty). It generalizes edit distance by introducing gap penalties and match/mismatch scores. Sequence alignment is fundamental to bioinformatics, where it is used to compare DNA, RNA, and protein sequences to infer evolutionary relationships and functional similarity.

The Hirschberg variant of this algorithm achieves optimal alignment in O(mn) time with only O(m) space (linear in the shorter sequence length), making it practical for aligning long biological sequences that would otherwise exhaust memory.

## How It Works

The algorithm uses a scoring scheme: a positive score for matching characters, a negative score (penalty) for mismatches, and a gap penalty for insertions/deletions. It builds a 2D scoring matrix where `dp[i][j]` represents the optimal alignment score for the first `i` characters of sequence X and the first `j` characters of sequence Y. The Hirschberg algorithm uses divide-and-conquer on top of the DP to reduce space from O(mn) to O(m).

### Example

Given sequences `X = "AGTAC"` and `Y = "GTTCA"`:

Scoring: Match = +1, Mismatch = -1, Gap = -2

**Building the DP table:**

|   |   | G  | T  | T  | C  | A  |
|---|---|----|----|----|----|----|
|   | 0 | -2 | -4 | -6 | -8 | -10|
| A | -2| -1 | -3 | -5 | -7 | -7 |
| G | -4| -1 | -2 | -4 | -6 | -8 |
| T | -6| -3 | 0  | -1 | -3 | -5 |
| A | -8| -5 | -2 | -1 | -2 | -2 |
| C |-10| -7 | -4 | -3 | 0  | -1 |

**Key cell computations:**

| Cell | X[i] vs Y[j] | Diagonal | Up (gap in Y) | Left (gap in X) | Value |
|------|---------------|----------|---------------|-----------------|-------|
| (3,2) | T vs T | dp[2][1]+1=-1+1=0 | dp[2][2]-2=-2-2=-4 | dp[3][1]-2=-3-2=-5 | 0 |
| (5,4) | C vs C | dp[4][3]+1=-1+1=0 | dp[4][4]-2=-2-2=-4 | dp[5][3]-2=-3-2=-5 | 0 |

**Traceback yields the alignment:**

```
A G T _ A C
_ G T T C A
```

Result: Alignment score = `-1`

## Pseudocode

```
function sequenceAlignment(X, Y, matchScore, mismatchPenalty, gapPenalty):
    m = length(X)
    n = length(Y)
    dp = 2D array of size (m + 1) x (n + 1)

    // Initialize base cases
    for i from 0 to m:
        dp[i][0] = i * gapPenalty
    for j from 0 to n:
        dp[0][j] = j * gapPenalty

    // Fill the table
    for i from 1 to m:
        for j from 1 to n:
            if X[i-1] == Y[j-1]:
                diag = dp[i-1][j-1] + matchScore
            else:
                diag = dp[i-1][j-1] + mismatchPenalty
            up = dp[i-1][j] + gapPenalty
            left = dp[i][j-1] + gapPenalty
            dp[i][j] = max(diag, up, left)

    return dp[m][n]
```

For the Hirschberg linear-space variant, the algorithm uses divide-and-conquer: it finds the optimal split point using forward and reverse passes with only two rows, then recursively aligns each half.

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(mn)  | O(m)  |
| Average | O(mn)  | O(m)  |
| Worst   | O(mn)  | O(m)  |

**Why these complexities?**

- **Best Case -- O(mn):** The algorithm must fill the entire scoring matrix regardless of sequence content. Every cell requires O(1) computation.

- **Average Case -- O(mn):** Each of the m * n cells involves three comparisons (diagonal, up, left) and a max operation, all constant time. Total: O(mn).

- **Worst Case -- O(mn):** The computation is uniform. No input causes worse-than-quadratic behavior.

- **Space -- O(m):** The Hirschberg algorithm uses the divide-and-conquer technique to reduce space from O(mn) to O(min(m, n)) while maintaining O(mn) time. The standard approach without Hirschberg uses O(mn) space.

## When to Use

- **Bioinformatics:** Comparing DNA, RNA, or protein sequences to find homology and evolutionary relationships.
- **When gap penalties matter:** Unlike simple edit distance, sequence alignment allows customizable gap penalties (affine, linear, etc.).
- **Long sequences with memory constraints:** The Hirschberg variant is essential when aligning sequences too long for O(mn) space.
- **When you need the actual alignment, not just the score:** The traceback provides the character-by-character alignment.

## When NOT to Use

- **Simple string similarity:** Edit distance is simpler when you only need the number of edits without custom scoring.
- **Multiple sequence alignment:** Aligning three or more sequences simultaneously requires different algorithms (e.g., progressive alignment, MUSCLE).
- **When sequences are very long and time is critical:** For genome-scale comparisons, heuristic methods like BLAST or FASTA are preferred.
- **When approximate matching suffices:** Seed-and-extend methods are much faster for large-scale database searches.

## Comparison with Similar Algorithms

| Algorithm             | Time   | Space    | Notes                                          |
|----------------------|--------|---------|------------------------------------------------|
| Needleman-Wunsch     | O(mn)  | O(mn)   | Global alignment; standard DP approach          |
| Hirschberg           | O(mn)  | O(m)    | Global alignment; linear space via D&C          |
| Smith-Waterman       | O(mn)  | O(mn)   | Local alignment; finds best matching region     |
| Edit Distance        | O(mn)  | O(mn)   | Simpler; unit costs for all operations          |
| BLAST                | O(n)   | O(n)    | Heuristic; much faster but not guaranteed optimal|

## Implementations

| Language | File |
|----------|------|
| C++      | [seqalignlinearSpace.cpp](cpp/seqalignlinearSpace.cpp) |

## References

- Needleman, S. B., & Wunsch, C. D. (1970). A general method applicable to the search for similarities in the amino acid sequence of two proteins. *Journal of Molecular Biology*, 48(3), 443-453.
- Hirschberg, D. S. (1975). A linear space algorithm for computing maximal common subsequences. *Communications of the ACM*, 18(6), 341-343.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- [Sequence Alignment -- Wikipedia](https://en.wikipedia.org/wiki/Sequence_alignment)
