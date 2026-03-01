# Disjoint Sparse Table

## Overview

A Disjoint Sparse Table is a data structure for answering static range queries on an array in O(1) time per query after O(n log n) preprocessing. Unlike a standard sparse table that only works for idempotent operations (like min, max, or gcd), a disjoint sparse table supports any associative operation, including sum, product, and XOR. This makes it strictly more powerful than a standard sparse table while maintaining the same O(1) query performance.

The key insight is that instead of using overlapping intervals (where the idempotent property is needed to avoid double-counting), the disjoint sparse table partitions the array into non-overlapping blocks at each level of a binary hierarchy, so every element contributes to exactly one precomputed prefix at each level.

## How It Works

1. **Build Phase**: The array is organized into O(log n) levels. At each level, the array is divided into blocks of size 2^level. For each block, precompute prefix aggregates going rightward from the block's midpoint and suffix aggregates going leftward from the midpoint. This takes O(n) work per level and O(n log n) total.

2. **Query Phase**: For a range query [l, r]:
   - If l == r, return the element at that index.
   - Find the highest bit position where l and r differ: `level = MSB(l XOR r)`. This identifies the unique level where l and r are in different halves of some block.
   - The answer combines the precomputed suffix from l to the block's midpoint and the prefix from the midpoint+1 to r: `answer = combine(suffix[level][l], prefix[level][r])`.
   - This is O(1) because it involves a single bit operation and two table lookups.

3. **Correctness Guarantee**: For any pair (l, r) with l != r, there is exactly one level where l and r fall in different halves of the same block. At that level, the suffix from l to the midpoint and the prefix from midpoint+1 to r together cover exactly [l, r] with no overlap and no gaps.

## Worked Example

Array: `[3, 1, 4, 1, 5, 9, 2, 6]` (n = 8), operation: sum.

**Building (Level 1, block size 2):**

Blocks: [3,1], [4,1], [5,9], [2,6]
- Block [3,1]: suffix from mid=0: [3], prefix from mid+1=1: [1]. Suffix[1][0]=3, Prefix[1][1]=1.
- Block [4,1]: suffix from mid=2: [4], prefix from mid+1=3: [1]. Suffix[1][2]=4, Prefix[1][3]=1.
- Block [5,9]: suffix from mid=4: [5], prefix from mid+1=5: [9]. Suffix[1][4]=5, Prefix[1][5]=9.
- Block [2,6]: suffix from mid=6: [2], prefix from mid+1=7: [6]. Suffix[1][6]=2, Prefix[1][7]=6.

**Building (Level 2, block size 4):**

Blocks: [3,1,4,1], [5,9,2,6]
- Block [3,1,4,1]: mid=1. Suffix (rightward from 1): Suffix[2][1]=1, Suffix[2][0]=3+1=4. Prefix (from 2): Prefix[2][2]=4, Prefix[2][3]=4+1=5.
- Block [5,9,2,6]: mid=5. Suffix: Suffix[2][5]=9, Suffix[2][4]=5+9=14. Prefix: Prefix[2][6]=2, Prefix[2][7]=2+6=8.

**Query sum(2, 5)** (indices 2 to 5):
- l=2, r=5. l XOR r = 010 XOR 101 = 111. MSB position = 2 (level 2).
- Answer = Suffix[2][2] + Prefix[2][5]... Actually we look up: Suffix at l=2 from level 2 block midpoint, and Prefix at r=5 from level 2 block midpoint.
- The midpoint of the first block at level 2 is index 1. But l=2 is past the midpoint, so l and r are in different blocks. At level 2: 2 XOR 5 = 7, MSB = bit 2.
- Suffix[2][2] = 4 (sum from index 2 to block mid+1=2, which is just arr[2]=4) wait -- Prefix[2][3]=5 gives sum(2..3), Suffix[2][4]=14 gives sum(4..5). Answer = 5 + 14 = 19.
- Verify: 4 + 1 + 5 + 9 = 19. Correct.

## Pseudocode

```
function build(arr, n):
    levels = floor(log2(n)) + 1
    table = 2D array [levels][n]

    for level = 1 to levels:
        block_size = 1 << level
        half = block_size >> 1

        for block_start = 0 to n-1, step block_size:
            mid = block_start + half - 1
            if mid >= n: break

            // Build suffix from mid going left
            table[level][mid] = arr[mid]
            for i = mid - 1 downto block_start:
                table[level][i] = combine(arr[i], table[level][i + 1])

            // Build prefix from mid+1 going right
            if mid + 1 < n:
                table[level][mid + 1] = arr[mid + 1]
                for i = mid + 2 to min(block_start + block_size - 1, n - 1):
                    table[level][i] = combine(table[level][i - 1], arr[i])

function query(l, r):
    if l == r:
        return arr[l]
    level = MSB(l XOR r)
    return combine(table[level][l], table[level][r])
```

## Complexity Analysis

| Case    | Time (query) | Time (build) | Space      |
|---------|-------------|-------------|------------|
| Best    | O(1)        | O(n log n)  | O(n log n) |
| Average | O(1)        | O(n log n)  | O(n log n) |
| Worst   | O(1)        | O(n log n)  | O(n log n) |

**Why these complexities?**

- **Build -- O(n log n):** There are O(log n) levels. At each level, every element is processed exactly once (computing one prefix value and one suffix value), giving O(n) work per level for O(n log n) total.

- **Query -- O(1):** A query computes l XOR r (O(1)), finds the most significant bit (O(1) with hardware instructions like `__builtin_clz` or a lookup table), and combines two precomputed values from the table (O(1)). No loops or recursion.

- **Space -- O(n log n):** The table stores one value per element per level, giving n * O(log n) entries.

## Applications

- **Competitive programming**: Answering static range sum, range product, or range XOR queries in O(1), which is useful for problems with tight time limits and many queries.
- **Range GCD/LCM queries**: When the operation is associative but not idempotent, the disjoint sparse table provides O(1) queries where a standard sparse table would require a segment tree with O(log n) per query.
- **Offline range queries**: When the array does not change and queries are known in advance, the disjoint sparse table offers the best query performance.
- **String hashing**: Computing hash values of arbitrary substrings in O(1) by combining prefix polynomial hashes using the disjoint sparse table structure.

## When NOT to Use

- **When updates are needed**: The disjoint sparse table is a static structure. If elements are updated, use a segment tree (O(log n) per query and update) or a binary indexed tree (Fenwick tree) for prefix-based operations.
- **When the operation is idempotent**: If the operation is min, max, or gcd, a standard sparse table achieves O(1) queries with the same preprocessing and space, and is simpler to implement.
- **When memory is tight**: The O(n log n) space may be prohibitive for very large arrays. A segment tree uses only O(n) space at the cost of O(log n) per query.

## Comparison with Similar Structures

| Structure                | Build Time   | Query Time | Space      | Supports Updates | Operations          |
|-------------------------|-------------|-----------|------------|-----------------|---------------------|
| Disjoint Sparse Table   | O(n log n)  | O(1)      | O(n log n) | No              | Any associative      |
| Sparse Table            | O(n log n)  | O(1)      | O(n log n) | No              | Idempotent only      |
| Segment Tree            | O(n)        | O(log n)  | O(n)       | Yes             | Any associative      |
| Fenwick Tree (BIT)      | O(n)        | O(log n)  | O(n)       | Yes             | Invertible only      |
| Sqrt Decomposition      | O(n)        | O(sqrt n) | O(n)       | Yes             | Any associative      |

## Implementations

| Language   | File |
|------------|------|
| Python     | [disjoint_sparse_table.py](python/disjoint_sparse_table.py) |
| Java       | [DisjointSparseTable.java](java/DisjointSparseTable.java) |
| C++        | [disjoint_sparse_table.cpp](cpp/disjoint_sparse_table.cpp) |
| C          | [disjoint_sparse_table.c](c/disjoint_sparse_table.c) |
| Go         | [disjoint_sparse_table.go](go/disjoint_sparse_table.go) |
| TypeScript | [disjointSparseTable.ts](typescript/disjointSparseTable.ts) |
| Rust       | [disjoint_sparse_table.rs](rust/disjoint_sparse_table.rs) |
| Kotlin     | [DisjointSparseTable.kt](kotlin/DisjointSparseTable.kt) |
| Swift      | [DisjointSparseTable.swift](swift/DisjointSparseTable.swift) |
| Scala      | [DisjointSparseTable.scala](scala/DisjointSparseTable.scala) |
| C#         | [DisjointSparseTable.cs](csharp/DisjointSparseTable.cs) |

## References

- Gusfield, D. (1997). *Algorithms on Strings, Trees, and Sequences: Computer Science and Computational Biology*. Cambridge University Press.
- [Disjoint Sparse Table -- CP-Algorithms](https://cp-algorithms.com/data_structures/disjoint_sparse_table.html)
- [Disjoint Sparse Table -- Codeforces Tutorial](https://codeforces.com/blog/entry/79108)
