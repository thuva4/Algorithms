# Sqrt Decomposition

## Overview

Sqrt Decomposition (also called Square Root Decomposition or Mo's technique foundation) divides an array of n elements into blocks of size approximately sqrt(n). Each block stores a precomputed aggregate (e.g., sum, minimum, maximum). This allows range queries in O(sqrt(n)) time and point updates in O(1) time, offering a practical middle ground between naive approaches and more complex data structures like segment trees.

The technique is valued for its simplicity -- it is straightforward to implement and understand, making it a popular choice in competitive programming and situations where segment trees would be overkill.

## How It Works

### Build Phase

1. Choose a block size `B = floor(sqrt(n))`.
2. Divide the array into `ceil(n / B)` blocks.
3. For each block, precompute the aggregate value (e.g., the sum of all elements in the block).

### Range Query [l, r]

A query range [l, r] can span at most three kinds of segments:
1. **Left partial block**: Elements from `l` to the end of l's block.
2. **Complete middle blocks**: All blocks entirely contained within [l, r].
3. **Right partial block**: Elements from the start of r's block to `r`.

Sum the partial elements individually and add the precomputed block sums for complete blocks.

### Point Update (set arr[i] = new_value)

1. Compute the difference: `delta = new_value - arr[i]`.
2. Update `arr[i]`.
3. Update the block sum: `block_sum[i / B] += delta`.

## Example

**Array**: `arr = [1, 5, 2, 4, 6, 1, 3, 5, 7, 10, 2, 4]` (n = 12)

**Build:**

```
Block size B = floor(sqrt(12)) = 3

Block 0: arr[0..2]  = [1, 5, 2]    sum = 8
Block 1: arr[3..5]  = [4, 6, 1]    sum = 11
Block 2: arr[6..8]  = [3, 5, 7]    sum = 15
Block 3: arr[9..11] = [10, 2, 4]   sum = 16
```

**Query: sum of arr[2..9]**

```
l = 2, r = 9

Left partial block (Block 0): arr[2] = 2
  (only index 2 is in [2, 2] from Block 0)

Complete middle blocks:
  Block 1: sum = 11  (indices 3-5, fully within [2, 9])
  Block 2: sum = 15  (indices 6-8, fully within [2, 9])

Right partial block (Block 3): arr[9] = 10
  (only index 9 is in [9, 9] from Block 3)

Total = 2 + 11 + 15 + 10 = 38

Verification: 2 + 4 + 6 + 1 + 3 + 5 + 7 + 10 = 38  (correct)
```

**Point Update: set arr[5] = 8** (was 1, delta = +7)

```
arr[5] = 8
block_sum[5 / 3] = block_sum[1] += 7 => 11 + 7 = 18

Updated:
Block 1: arr[3..5] = [4, 6, 8]    sum = 18
```

## Pseudocode

```
B = floor(sqrt(n))
num_blocks = ceil(n / B)
block_sum = array of size num_blocks, all zeros

function build(arr):
    for i = 0 to n - 1:
        block_sum[i / B] += arr[i]

function query(l, r):
    total = 0
    // If l and r are in the same block, just sum directly
    if l / B == r / B:
        for i = l to r:
            total += arr[i]
        return total

    // Left partial block
    block_end = (l / B + 1) * B - 1
    for i = l to block_end:
        total += arr[i]

    // Complete middle blocks
    for b = l / B + 1 to r / B - 1:
        total += block_sum[b]

    // Right partial block
    block_start = (r / B) * B
    for i = block_start to r:
        total += arr[i]

    return total

function update(i, new_value):
    delta = new_value - arr[i]
    arr[i] = new_value
    block_sum[i / B] += delta
```

## Complexity Analysis

| Operation     | Time       | Space |
|---------------|-----------|-------|
| Build         | O(n)      | O(sqrt(n)) |
| Range Query   | O(sqrt(n))| -     |
| Point Update  | O(1)      | -     |
| Total Space   | -         | O(n)  |

**Range Query: Why O(sqrt(n))?**
- The left partial block has at most B elements: O(sqrt(n)).
- The number of complete middle blocks is at most n/B = sqrt(n): O(sqrt(n)).
- The right partial block has at most B elements: O(sqrt(n)).
- Total: O(3 * sqrt(n)) = O(sqrt(n)).

**Point Update**: Only the element and its block sum need updating: O(1).

**Choosing the block size**: B = sqrt(n) minimizes the worst-case query time. If B is too small, there are too many blocks to iterate. If B is too large, the partial blocks are too long. The optimal trade-off is at sqrt(n), where both terms are balanced.

## Applications

- **Range sum / range min with point updates**: When the problem requires both queries and updates but a segment tree feels like overkill.
- **Mo's algorithm**: A technique for answering offline range queries in O((n + q) * sqrt(n)) by sorting queries by blocks and maintaining a sliding window. This is the most famous application of sqrt decomposition.
- **Heavy-light decomposition alternative**: In some tree problems, sqrt decomposition on paths provides a simpler (though slower) alternative to heavy-light decomposition.
- **Batch updates with lazy propagation**: Sqrt decomposition can support range updates with lazy propagation by storing a "pending" value per block. Range update becomes O(sqrt(n)) and query remains O(sqrt(n)).
- **Competitive programming**: The simplicity and versatility of sqrt decomposition make it a go-to technique for problems that require both range queries and modifications.

## When NOT to Use

- **When O(log n) per operation is required**: For large n (say n > 10^6) with many queries, O(sqrt(n)) per query can be too slow. Segment trees provide O(log n) per operation with comparable implementation effort.
- **When only range queries are needed (no updates)**: For static arrays, a sparse table gives O(1) query time for min/max/GCD, and prefix sums give O(1) query time for sums. Both are faster and simpler.
- **When memory is extremely tight**: The additional O(sqrt(n)) array for block sums is small, but if the problem is purely about querying a static array, simpler approaches exist.
- **For associative-but-not-decomposable queries**: Some aggregate functions cannot be split across block boundaries easily (e.g., mode queries). Sqrt decomposition may still work but requires more complex bookkeeping.

## Comparison

| Data Structure    | Build    | Range Query | Point Update | Range Update | Space  | Complexity to Implement |
|-------------------|---------|-------------|--------------|--------------|--------|-------------------------|
| Sqrt Decomposition| O(n)    | O(sqrt(n))  | O(1)         | O(sqrt(n))   | O(n)   | Easy                    |
| Segment Tree      | O(n)    | O(log n)    | O(log n)     | O(log n)*    | O(n)   | Moderate                |
| Fenwick Tree (BIT)| O(n)    | O(log n)    | O(log n)     | O(log n)*    | O(n)   | Easy                    |
| Sparse Table      | O(n log n)| O(1)      | N/A (static) | N/A          | O(n log n)| Easy                 |
| Prefix Sums       | O(n)    | O(1)        | O(n) rebuild | N/A          | O(n)   | Trivial                 |

\* With lazy propagation.

**Sqrt Decomposition vs. Segment Tree**: Segment trees are strictly faster (O(log n) vs O(sqrt(n))), but sqrt decomposition is easier to implement and debug. For n = 10^5, sqrt(n) ~ 316, while log(n) ~ 17 -- a factor of ~18. For competitive programming with tight time limits and n > 10^5, a segment tree is usually preferred.

**Sqrt Decomposition vs. Fenwick Tree (BIT)**: Fenwick trees are also O(log n) per operation but are limited to operations with inverse (like sum). They cannot naturally handle min/max queries. Sqrt decomposition is more flexible.

## References

- "Sqrt decomposition." CP-Algorithms. https://cp-algorithms.com/data_structures/sqrt_decomposition.html
- "Mo's algorithm." CP-Algorithms. https://cp-algorithms.com/data_structures/sqrt_decomposition.html#mos-algorithm
- Harnik, D. & Naor, M. (2010). "On the Compressibility of NP Instances and Cryptographic Applications." *SIAM Journal on Computing*, 39(5).
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 14: Augmenting Data Structures.

## Implementations

| Language   | File |
|------------|------|
| Python     | [sqrt_decomposition.py](python/sqrt_decomposition.py) |
| Java       | [SqrtDecomposition.java](java/SqrtDecomposition.java) |
| C++        | [sqrt_decomposition.cpp](cpp/sqrt_decomposition.cpp) |
| C          | [sqrt_decomposition.c](c/sqrt_decomposition.c) |
| Go         | [sqrt_decomposition.go](go/sqrt_decomposition.go) |
| TypeScript | [sqrtDecomposition.ts](typescript/sqrtDecomposition.ts) |
| Rust       | [sqrt_decomposition.rs](rust/sqrt_decomposition.rs) |
| Kotlin     | [SqrtDecomposition.kt](kotlin/SqrtDecomposition.kt) |
| Swift      | [SqrtDecomposition.swift](swift/SqrtDecomposition.swift) |
| Scala      | [SqrtDecomposition.scala](scala/SqrtDecomposition.scala) |
| C#         | [SqrtDecomposition.cs](csharp/SqrtDecomposition.cs) |
