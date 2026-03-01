# Suffix Tree (Count Distinct Substrings)

## Overview

A Suffix Tree is a compressed trie (prefix tree) containing all suffixes of a string. It is one of the most powerful data structures in string processing, enabling linear-time solutions to many problems including pattern matching, longest repeated substring, and counting distinct substrings.

This implementation counts the number of distinct substrings of a given array of integers. It does so by constructing a suffix array, computing the Longest Common Prefix (LCP) array using Kasai's algorithm, and applying the formula: `distinct substrings = n*(n+1)/2 - sum(LCP)`.

## How It Works

1. **Build the suffix array:** Sort all suffixes of the input lexicographically.
2. **Compute the LCP array:** Using Kasai's algorithm, compute the length of the longest common prefix between each pair of adjacent suffixes in the sorted order.
3. **Count distinct substrings:** The total number of substrings of a string of length n is `n*(n+1)/2`. Each LCP value represents shared prefixes that should not be double-counted. Subtracting the sum of all LCP values gives the count of distinct substrings.

## Worked Example

Given input: `[1, 2, 1]`

**Step 1 -- Suffix Array:**
- Suffix 0: `[1, 2, 1]`
- Suffix 1: `[2, 1]`
- Suffix 2: `[1]`

Sorted: `[1]` (idx 2), `[1, 2, 1]` (idx 0), `[2, 1]` (idx 1)
Suffix Array: `[2, 0, 1]`

**Step 2 -- LCP Array (Kasai's):**
- LCP between suffix 2 `[1]` and suffix 0 `[1, 2, 1]`: shared prefix `[1]`, length 1
- LCP between suffix 0 `[1, 2, 1]` and suffix 1 `[2, 1]`: no shared prefix, length 0

LCP Array: `[1, 0]`

**Step 3 -- Count:**
Total substrings = `3 * 4 / 2 = 6`: `[1]`, `[1,2]`, `[1,2,1]`, `[2]`, `[2,1]`, `[1]`
Subtract LCP sum = `1 + 0 = 1` (one duplicate `[1]`)
Distinct substrings = `6 - 1 = 5`

**Result:** 5

## Pseudocode

```
function countDistinctSubstrings(arr):
    n = length(arr)
    if n == 0: return 0

    // Build suffix array
    sa = buildSuffixArray(arr)

    // Build LCP array using Kasai's algorithm
    rank = array of size n
    for i from 0 to n - 1:
        rank[sa[i]] = i

    lcp = array of size n - 1
    k = 0
    for i from 0 to n - 1:
        if rank[i] == 0:
            k = 0
            continue
        j = sa[rank[i] - 1]
        while i + k < n and j + k < n and arr[i + k] == arr[j + k]:
            k = k + 1
        lcp[rank[i] - 1] = k
        if k > 0:
            k = k - 1

    // Count distinct substrings
    total = n * (n + 1) / 2
    return total - sum(lcp)
```

## Complexity Analysis

| Case    | Time          | Space |
|---------|---------------|-------|
| Best    | O(n log^2 n)  | O(n)  |
| Average | O(n log^2 n)  | O(n)  |
| Worst   | O(n log^2 n)  | O(n)  |

- **Time:** Dominated by suffix array construction. The LCP array computation with Kasai's algorithm is O(n), and the final summation is O(n). With the SA-IS suffix array construction algorithm, the overall time reduces to O(n).
- **Space O(n):** For the suffix array, rank array, and LCP array.
- Compared to building an explicit suffix tree (Ukkonen's algorithm), this approach uses significantly less memory.

## When to Use

- Counting the number of distinct substrings in a string
- Finding the longest repeated substring
- Pattern matching queries after one-time preprocessing
- String comparison tasks in bioinformatics (genome analysis)
- Building the Burrows-Wheeler Transform for data compression
- Solving competitive programming problems on string processing

## When NOT to Use

- **When you need online (incremental) construction:** Suffix arrays must be rebuilt from scratch when the string changes. Use Ukkonen's suffix tree for online construction.
- **Single pattern search:** Building a suffix array/tree for one search query is overkill. Use KMP or Boyer-Moore.
- **Very short strings (n < 20):** The overhead of construction is not justified; brute-force enumeration is simpler and fast enough.
- **When memory is extremely limited:** Although suffix arrays are more memory-efficient than suffix trees, they still require O(n) additional space. For streaming applications, consider online algorithms.

## Comparison

| Approach                    | Time (Build)   | Time (Count Distinct) | Space |
|-----------------------------|----------------|----------------------|-------|
| Suffix Array + LCP          | O(n log^2 n)*  | O(n)                 | O(n)  |
| Suffix Tree (Ukkonen's)     | O(n)           | O(n) via node count  | O(n)**|
| Brute Force (HashSet)       | O(n^2)         | O(n^2)               | O(n^2)|
| Suffix Automaton (SAM)      | O(n)           | O(n) via path count  | O(n)  |

*O(n) with SA-IS algorithm. **Suffix trees use 10-20x more memory than suffix arrays in practice.

The suffix array + LCP approach offers the best balance of simplicity, memory efficiency, and performance. Suffix automata (SAM) provide an elegant O(n) solution but are harder to implement. Brute force with a hash set works for small inputs but is impractical for large strings.

## References

- Manber, U. and Myers, G. (1993). "Suffix Arrays: A New Method for On-Line String Searches." *SIAM Journal on Computing*, 22(5), 935-948.
- Kasai, T., Lee, G., Arimura, H., Arikawa, S., and Park, K. (2001). "Linear-Time Longest-Common-Prefix Computation in Suffix Arrays and Its Applications." *CPM 2001*, LNCS 2089, 181-192.
- Ukkonen, E. (1995). "On-Line Construction of Suffix Trees." *Algorithmica*, 14(3), 249-260.
- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences*. Cambridge University Press.

## Implementations

| Language   | File |
|------------|------|
| Python     | [suffix_tree.py](python/suffix_tree.py) |
| Java       | [SuffixTree.java](java/SuffixTree.java) |
| C++        | [suffix_tree.cpp](cpp/suffix_tree.cpp) |
| C          | [suffix_tree.c](c/suffix_tree.c) |
| Go         | [suffix_tree.go](go/suffix_tree.go) |
| TypeScript | [suffixTree.ts](typescript/suffixTree.ts) |
| Rust       | [suffix_tree.rs](rust/suffix_tree.rs) |
| Kotlin     | [SuffixTree.kt](kotlin/SuffixTree.kt) |
| Swift      | [SuffixTree.swift](swift/SuffixTree.swift) |
| Scala      | [SuffixTree.scala](scala/SuffixTree.scala) |
| C#         | [SuffixTree.cs](csharp/SuffixTree.cs) |
