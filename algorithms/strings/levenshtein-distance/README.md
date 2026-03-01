# Levenshtein Distance

## Overview

The Levenshtein distance (also known as edit distance) between two sequences is the minimum number of single-element edits -- insertions, deletions, or substitutions -- required to transform one sequence into the other. Introduced by Vladimir Levenshtein in 1965, it is a fundamental metric in computer science used to quantify how dissimilar two sequences are. The algorithm uses dynamic programming to efficiently compute this distance.

## How It Works

1. Create a matrix `dp` of size `(m+1) x (n+1)`, where `m` and `n` are the lengths of the two sequences.
2. Initialize the first row as `0, 1, 2, ..., n` (cost of inserting all elements of the second sequence) and the first column as `0, 1, 2, ..., m` (cost of deleting all elements of the first sequence).
3. Fill each cell `dp[i][j]` using the recurrence:
   - If `seq1[i-1] == seq2[j-1]`: `dp[i][j] = dp[i-1][j-1]` (no edit needed)
   - Otherwise: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])` (minimum of delete, insert, or substitute)
4. The answer is `dp[m][n]`.

Input format: `[len1, arr1..., len2, arr2...]`

## Worked Example

Given sequences A = `[1, 2, 3]` and B = `[1, 3, 4]`:

Build the DP matrix:

```
      ""  1   3   4
""  [  0,  1,  2,  3 ]
 1  [  1,  0,  1,  2 ]
 2  [  2,  1,  1,  2 ]
 3  [  3,  2,  1,  2 ]
```

- `dp[1][1] = 0`: elements match (1 == 1)
- `dp[2][2] = 1`: min(dp[1][2]+1, dp[2][1]+1, dp[1][1]+1) = min(2, 2, 1) = 1 (substitute 2 -> 3)
- `dp[3][3] = 2`: min(dp[2][3]+1, dp[3][2]+1, dp[2][2]+1) = min(3, 2, 2) = 2 (substitute 3 -> 4)

**Result:** 2 (substitute 2 -> 3, substitute 3 -> 4)

## Pseudocode

```
function levenshteinDistance(seq1, seq2):
    m = length(seq1)
    n = length(seq2)
    dp = matrix of size (m + 1) x (n + 1)

    for i from 0 to m:
        dp[i][0] = i
    for j from 0 to n:
        dp[0][j] = j

    for i from 1 to m:
        for j from 1 to n:
            if seq1[i - 1] == seq2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      // deletion
                    dp[i][j - 1],      // insertion
                    dp[i - 1][j - 1]   // substitution
                )

    return dp[m][n]
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(n * m) | O(n * m) |
| Average | O(n * m) | O(n * m) |
| Worst   | O(n * m) | O(n * m) |

- **Time O(n * m):** Every cell in the matrix must be filled, with each requiring O(1) work.
- **Space O(n * m):** The full DP matrix is stored. This can be optimized to O(min(n, m)) by keeping only two rows at a time if only the distance (not the edit sequence) is needed.
- Note: If the sequences are identical, the algorithm still fills the entire matrix, so there is no improved best case.

## When to Use

- Spell checking and autocorrect systems
- DNA and protein sequence alignment in bioinformatics
- Fuzzy string matching for search engines
- Plagiarism detection systems
- Record linkage and data deduplication
- Natural language processing for measuring word similarity
- Diff tools for comparing file versions

## When NOT to Use

- **Very long sequences (n, m > 10,000):** The O(n*m) time and space become prohibitive. Use approximate or heuristic methods like banded edit distance, or specialized algorithms like Myers' bit-parallel algorithm.
- **When only a similarity threshold matters:** If you only need to know whether the distance is below a threshold k, use the bounded Levenshtein distance which runs in O(n*k) time.
- **When operations have different costs:** Standard Levenshtein assigns cost 1 to all operations. If transpositions should also be allowed, use Damerau-Levenshtein distance. For weighted operations, use a generalized edit distance.
- **Comparing very similar long sequences:** Consider suffix arrays or longest common subsequence if the metric definition better fits your use case.

## Comparison

| Algorithm                | Operations Allowed                  | Time     | Space    |
|--------------------------|-------------------------------------|----------|----------|
| Levenshtein Distance     | Insert, Delete, Substitute          | O(n * m) | O(n * m) |
| Damerau-Levenshtein      | Insert, Delete, Substitute, Swap    | O(n * m) | O(n * m) |
| Longest Common Subsequence| Insert, Delete (no substitution)   | O(n * m) | O(n * m) |
| Hamming Distance         | Substitute only (equal-length only) | O(n)     | O(1)     |
| Jaro-Winkler             | Transpositions (similarity score)   | O(n * m) | O(n)     |

Levenshtein distance is the most general-purpose edit distance metric. Damerau-Levenshtein adds support for transpositions (swapping adjacent characters), which is useful for typo correction. Hamming distance is restricted to equal-length sequences but is much faster.

## References

- Levenshtein, V.I. (1966). "Binary codes capable of correcting deletions, insertions, and reversals." *Soviet Physics Doklady*, 10(8), 707-710.
- Wagner, R.A. and Fischer, M.J. (1974). "The String-to-String Correction Problem." *Journal of the ACM*, 21(1), 168-173.
- Cormen, T.H., Leiserson, C.E., Rivest, R.L., and Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 15 (Dynamic Programming). MIT Press.
- Navarro, G. (2001). "A Guided Tour to Approximate String Matching." *ACM Computing Surveys*, 33(1), 31-88.

## Implementations

| Language   | File |
|------------|------|
| Python     | [levenshtein_distance.py](python/levenshtein_distance.py) |
| Java       | [LevenshteinDistance.java](java/LevenshteinDistance.java) |
| C++        | [levenshtein_distance.cpp](cpp/levenshtein_distance.cpp) |
| C          | [levenshtein_distance.c](c/levenshtein_distance.c) |
| Go         | [levenshtein_distance.go](go/levenshtein_distance.go) |
| TypeScript | [levenshteinDistance.ts](typescript/levenshteinDistance.ts) |
| Rust       | [levenshtein_distance.rs](rust/levenshtein_distance.rs) |
| Kotlin     | [LevenshteinDistance.kt](kotlin/LevenshteinDistance.kt) |
| Swift      | [LevenshteinDistance.swift](swift/LevenshteinDistance.swift) |
| Scala      | [LevenshteinDistance.scala](scala/LevenshteinDistance.scala) |
| C#         | [LevenshteinDistance.cs](csharp/LevenshteinDistance.cs) |
