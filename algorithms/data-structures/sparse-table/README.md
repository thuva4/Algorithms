# Sparse Table

## Overview

A Sparse Table is a static data structure for answering range queries (minimum, maximum, GCD, etc.) in O(1) time after O(n log n) preprocessing. It exploits the **idempotent** property of certain functions: for an idempotent function f, f(a, a) = a, so overlapping ranges do not affect correctness. This allows queries to be answered by combining two precomputed overlapping ranges that together cover the query range.

Sparse tables are ideal when the input array does not change after construction. For dynamic arrays that require updates, segment trees or Fenwick trees are more appropriate.

## How It Works

### Build Phase

For each starting index `i` and each power of two `j` (where `2^j` is the range length), precompute `table[j][i]` = the minimum of the subarray starting at index `i` with length `2^j`.

1. **Base case (j = 0)**: `table[0][i] = arr[i]` for all i. Each element is the minimum of its range of length 1.
2. **Recurrence (j > 0)**: `table[j][i] = min(table[j-1][i], table[j-1][i + 2^(j-1)])`. The range of length `2^j` starting at `i` is split into two halves of length `2^(j-1)`.
3. The maximum `j` needed is `floor(log2(n))`.

### Query Phase

For a range [l, r] of length `len = r - l + 1`:

1. Compute `k = floor(log2(len))`.
2. Answer = `min(table[k][l], table[k][r - 2^k + 1])`.
3. The two ranges `[l, l + 2^k - 1]` and `[r - 2^k + 1, r]` overlap, but since min is idempotent, overlapping values do not cause errors.

## Example

**Array**: `arr = [7, 2, 3, 0, 5, 10, 3, 12, 18]` (n = 9)

**Build the sparse table:**

```
j=0 (ranges of length 1):
  table[0] = [7, 2, 3, 0, 5, 10, 3, 12, 18]

j=1 (ranges of length 2):
  table[1][0] = min(7, 2)  = 2
  table[1][1] = min(2, 3)  = 2
  table[1][2] = min(3, 0)  = 0
  table[1][3] = min(0, 5)  = 0
  table[1][4] = min(5, 10) = 5
  table[1][5] = min(10, 3) = 3
  table[1][6] = min(3, 12) = 3
  table[1][7] = min(12, 18)= 12
  table[1] = [2, 2, 0, 0, 5, 3, 3, 12]

j=2 (ranges of length 4):
  table[2][0] = min(table[1][0], table[1][2]) = min(2, 0) = 0
  table[2][1] = min(table[1][1], table[1][3]) = min(2, 0) = 0
  table[2][2] = min(table[1][2], table[1][4]) = min(0, 5) = 0
  table[2][3] = min(table[1][3], table[1][5]) = min(0, 3) = 0
  table[2][4] = min(table[1][4], table[1][6]) = min(5, 3) = 3
  table[2][5] = min(table[1][5], table[1][7]) = min(3, 12)= 3
  table[2] = [0, 0, 0, 0, 3, 3]

j=3 (ranges of length 8):
  table[3][0] = min(table[2][0], table[2][4]) = min(0, 3) = 0
  table[3][1] = min(table[2][1], table[2][5]) = min(0, 3) = 0
  table[3] = [0, 0]
```

**Query: minimum of arr[2..7] (elements: 3, 0, 5, 10, 3, 12)**

```
l = 2, r = 7, len = 6
k = floor(log2(6)) = 2, so 2^k = 4

answer = min(table[2][2], table[2][7 - 4 + 1])
       = min(table[2][2], table[2][4])
       = min(0, 3)
       = 0
```

This is correct: the minimum of [3, 0, 5, 10, 3, 12] is 0.

## Pseudocode

```
function build(arr, n):
    LOG = floor(log2(n)) + 1
    table = 2D array of size [LOG][n]

    // Base case: ranges of length 1
    for i = 0 to n - 1:
        table[0][i] = arr[i]

    // Fill for each power of 2
    for j = 1 to LOG - 1:
        for i = 0 to n - 2^j:
            table[j][i] = min(table[j-1][i], table[j-1][i + 2^(j-1)])

    // Precompute floor(log2) for all lengths
    log2_table = array of size n + 1
    log2_table[1] = 0
    for i = 2 to n:
        log2_table[i] = log2_table[i / 2] + 1

function query(l, r):
    length = r - l + 1
    k = log2_table[length]
    return min(table[k][l], table[k][r - 2^k + 1])
```

## Complexity Analysis

| Phase     | Time       | Space      |
|-----------|-----------|------------|
| Build     | O(n log n) | O(n log n) |
| Query     | O(1)       | -          |

- **Build time**: There are O(log n) levels, and at each level we compute O(n) entries, giving O(n log n) total.
- **Query time**: A single query requires exactly two table lookups and one min operation -- O(1).
- **Space**: The table has O(n log n) entries. The log2 lookup table adds O(n) space.

### Why O(1) Queries Work

The key insight is that for idempotent functions like min, max, GCD, and bitwise AND/OR, overlapping ranges produce the correct result. For non-idempotent functions like sum, the overlapping ranges would double-count elements, so sparse tables cannot answer sum queries in O(1). (Sum queries require a different approach -- see Comparison section.)

## Applications

- **Range Minimum Query (RMQ)**: The classic application. Given a static array, answer "what is the minimum value in the range [l, r]?" in O(1).
- **Lowest Common Ancestor (LCA)**: By reducing LCA to RMQ on the Euler tour of a tree, sparse tables enable O(1) LCA queries after O(n log n) preprocessing.
- **Suffix arrays**: LCP (Longest Common Prefix) queries on suffix arrays use sparse tables for O(1) range minimum lookups.
- **Range GCD queries**: Since GCD is idempotent, sparse tables can answer range GCD queries in O(1).
- **Competitive programming**: Sparse tables are a popular tool in competitive programming due to their simplicity and O(1) query time.

## When NOT to Use

- **When the array is modified after construction**: Sparse tables are static. If elements are updated, the entire table must be rebuilt in O(n log n). Use a segment tree (O(log n) per update and query) or a Fenwick tree instead.
- **For range sum queries**: Since addition is not idempotent (overlapping ranges double-count), sparse tables cannot answer sum queries in O(1). Use a prefix sum array (O(1) query, O(n) build) or a Fenwick tree.
- **When memory is very limited**: The O(n log n) space can be significant for very large arrays. A segment tree uses only O(n) space while providing O(log n) queries.
- **When n is very small**: For arrays with a few dozen elements, a simple linear scan over the range is fast enough and avoids the overhead of building the table.

## Comparison

| Data Structure  | Build Time   | Query Time | Update Time | Space      | Supports Sum? |
|-----------------|-------------|------------|-------------|------------|---------------|
| Sparse Table    | O(n log n)  | O(1)       | O(n log n)* | O(n log n) | No            |
| Segment Tree    | O(n)        | O(log n)   | O(log n)    | O(n)       | Yes           |
| Fenwick Tree    | O(n)        | O(log n)   | O(log n)    | O(n)       | Yes           |
| Prefix Sums     | O(n)        | O(1)       | O(n)*       | O(n)       | Yes           |
| Sqrt Decomp.    | O(n)        | O(sqrt n)  | O(1)        | O(n)       | Yes           |
| Disjoint Sparse | O(n log n)  | O(1)       | O(n log n)* | O(n log n) | Yes           |

\* Requires full rebuild.

**Sparse Table vs. Segment Tree**: Sparse tables win on query time (O(1) vs. O(log n)) but lose on flexibility -- segment trees support updates and non-idempotent operations. Choose sparse tables when the array is static and you need the fastest possible queries.

**Sparse Table vs. Prefix Sums**: Both provide O(1) queries on static data. Prefix sums work for sum queries but not for min/max. Sparse tables work for min/max/GCD but not for sum. They are complementary tools.

## References

- Bender, M. A. & Farach-Colton, M. (2000). "The LCA Problem Revisited." *LATIN 2000*, LNCS 1776, pp. 88-94.
- Fischer, J. & Heun, V. (2006). "Theoretical and Practical Improvements on the RMQ-Problem, with Applications to LCA and LCE." *CPM 2006*.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Problem 14-2 on range queries.
- "Sparse table." CP-Algorithms. https://cp-algorithms.com/data_structures/sparse-table.html

## Implementations

| Language   | File |
|------------|------|
| Python     | [sparse_table.py](python/sparse_table.py) |
| Java       | [SparseTable.java](java/SparseTable.java) |
| C++        | [sparse_table.cpp](cpp/sparse_table.cpp) |
| C          | [sparse_table.c](c/sparse_table.c) |
| Go         | [sparse_table.go](go/sparse_table.go) |
| TypeScript | [sparseTable.ts](typescript/sparseTable.ts) |
| Rust       | [sparse_table.rs](rust/sparse_table.rs) |
| Kotlin     | [SparseTable.kt](kotlin/SparseTable.kt) |
| Swift      | [SparseTable.swift](swift/SparseTable.swift) |
| Scala      | [SparseTable.scala](scala/SparseTable.scala) |
| C#         | [SparseTable.cs](csharp/SparseTable.cs) |
