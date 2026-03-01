# Suffix Array

## Overview

A Suffix Array is a sorted array of all suffixes of a string (or array of integers), represented by their starting indices. Introduced by Udi Manber and Gene Myers in 1993 as a space-efficient alternative to suffix trees, it provides a foundation for many string processing tasks including pattern matching, longest common prefix computation, and data compression. Given an array of length n, the suffix array contains n starting indices sorted so that the corresponding suffixes are in lexicographic order.

## How It Works

1. **Generate all suffixes:** For an array of length n, create n suffixes where suffix i starts at position i and extends to the end of the array.
2. **Sort the suffixes lexicographically:** The naive approach sorts using string comparison (O(n^2 log n) total). The efficient approach uses iterative doubling:
   - First, sort suffixes by their first character.
   - Then, sort by first 2 characters (using the rank of the first character and the rank of position+1).
   - Then by first 4 characters, then 8, and so on, doubling each iteration.
   - Each sorting step uses the ranks from the previous step, requiring O(n log n) per step across O(log n) steps.
3. **Return the array of starting indices** in sorted order.

## Worked Example

Given input: `[3, 1, 2, 1]`

All suffixes:
- Suffix 0: `[3, 1, 2, 1]`
- Suffix 1: `[1, 2, 1]`
- Suffix 2: `[2, 1]`
- Suffix 3: `[1]`

Sorted lexicographically:
1. `[1]` (suffix 3)
2. `[1, 2, 1]` (suffix 1)
3. `[2, 1]` (suffix 2)
4. `[3, 1, 2, 1]` (suffix 0)

**Suffix Array:** `[3, 1, 2, 0]`

**Using the suffix array for pattern matching:** To find pattern `[1, 2]`, binary search the suffix array. Suffix 1 = `[1, 2, 1]` starts with `[1, 2]` -- match found at index 1.

## Pseudocode

```
function buildSuffixArray(arr):
    n = length(arr)
    sa = [0, 1, 2, ..., n-1]  // suffix indices
    rank = copy of arr         // initial ranks from element values
    tmp = array of size n

    gap = 1
    while gap < n:
        // Sort by (rank[i], rank[i + gap])
        // Using the pair as a comparison key
        sort sa by key: (rank[sa[i]], rank[sa[i] + gap] if sa[i] + gap < n else -1)

        // Recompute ranks
        tmp[sa[0]] = 0
        for i from 1 to n - 1:
            tmp[sa[i]] = tmp[sa[i-1]]
            if (rank[sa[i]], rank[sa[i]+gap]) != (rank[sa[i-1]], rank[sa[i-1]+gap]):
                tmp[sa[i]] = tmp[sa[i]] + 1
        rank = copy of tmp

        if rank[sa[n-1]] == n - 1:
            break   // all ranks are unique

        gap = gap * 2

    return sa
```

## Complexity Analysis

| Case    | Time          | Space |
|---------|---------------|-------|
| Best    | O(n log n)    | O(n)  |
| Average | O(n log^2 n)  | O(n)  |
| Worst   | O(n log^2 n)  | O(n)  |

- **Time O(n log^2 n):** There are O(log n) doubling iterations, each requiring O(n log n) for comparison-based sorting. Using radix sort at each step reduces this to O(n log n) total.
- **Best case O(n log n):** When all elements are distinct, the ranks become unique after the first doubling step and the algorithm terminates early.
- **Space O(n):** Storing the suffix array, rank array, and temporary array.
- The SA-IS algorithm by Nong, Zhang, and Chan (2009) constructs the suffix array in O(n) time.

## When to Use

- Pattern matching in a text that will be queried many times (build once, search many times in O(m log n))
- Computing the Longest Common Prefix (LCP) array (using Kasai's algorithm in O(n))
- Data compression algorithms based on the Burrows-Wheeler Transform (BWT)
- Bioinformatics: genome assembly, sequence alignment, finding repeated motifs
- Finding the longest repeated substring, longest common substring of two strings
- As a space-efficient alternative to suffix trees (uses 4-8x less memory)

## When NOT to Use

- **Single pattern search in a text queried only once:** Building the suffix array takes O(n log n) or more. For a one-time search, KMP or Boyer-Moore (O(n+m)) is faster.
- **When you need the full power of a suffix tree:** Some operations (like finding the longest palindromic substring or certain tree traversals) are more naturally expressed with suffix trees.
- **Very small strings:** The overhead of constructing the suffix array is not justified for strings shorter than a few hundred characters.
- **Dynamic text with frequent insertions/deletions:** Suffix arrays are static structures. Rebuilding after each modification is expensive. Consider a dynamic suffix tree or other online data structures.

## Comparison

| Data Structure     | Build Time     | Pattern Search | Space  | LCP Computation |
|--------------------|----------------|----------------|--------|-----------------|
| Suffix Array       | O(n log^2 n)*  | O(m log n)     | O(n)   | O(n) with Kasai |
| Suffix Tree        | O(n)           | O(m)           | O(n)** | Implicit        |
| Trie               | O(n^2)         | O(m)           | O(n^2) | N/A             |
| KMP (for search)   | O(n + m)       | O(n + m)       | O(m)   | N/A             |

*O(n) with SA-IS algorithm. **Suffix trees use 10-20x more memory than suffix arrays in practice.

Suffix arrays provide the best balance between space efficiency and query capability. Suffix trees are faster for some queries but consume far more memory. For repeated search on the same text, suffix arrays with LCP arrays match suffix trees in functionality at a fraction of the memory cost.

## References

- Manber, U. and Myers, G. (1993). "Suffix Arrays: A New Method for On-Line String Searches." *SIAM Journal on Computing*, 22(5), 935-948.
- Kasai, T., Lee, G., Arimura, H., Arikawa, S., and Park, K. (2001). "Linear-Time Longest-Common-Prefix Computation in Suffix Arrays and Its Applications." *CPM 2001*, LNCS 2089, 181-192.
- Nong, G., Zhang, S., and Chan, W.H. (2009). "Two Efficient Algorithms for Linear Time Suffix Array Construction." *IEEE Transactions on Computers*, 60(10), 1471-1484.
- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences*. Cambridge University Press.

## Implementations

| Language   | File |
|------------|------|
| Python     | [suffix_array.py](python/suffix_array.py) |
| Java       | [SuffixArray.java](java/SuffixArray.java) |
| C++        | [suffix_array.cpp](cpp/suffix_array.cpp) |
| C          | [suffix_array.c](c/suffix_array.c) |
| Go         | [suffix_array.go](go/suffix_array.go) |
| TypeScript | [suffixArray.ts](typescript/suffixArray.ts) |
| Rust       | [suffix_array.rs](rust/suffix_array.rs) |
| Kotlin     | [SuffixArray.kt](kotlin/SuffixArray.kt) |
| Swift      | [SuffixArray.swift](swift/SuffixArray.swift) |
| Scala      | [SuffixArray.scala](scala/SuffixArray.scala) |
| C#         | [SuffixArray.cs](csharp/SuffixArray.cs) |
