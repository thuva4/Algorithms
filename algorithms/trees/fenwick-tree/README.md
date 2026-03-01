# Fenwick Tree

## Overview

A Fenwick Tree (also known as a Binary Indexed Tree or BIT) is a data structure that efficiently supports two operations on an array of numbers: point updates (changing a single element) and prefix sum queries (computing the sum of the first k elements). Both operations run in O(log n) time, which is a significant improvement over the naive approach of O(1) update with O(n) query, or O(n) update with O(1) query.

The Fenwick Tree was proposed by Peter Fenwick in 1994 and is widely used in competitive programming, computational geometry, and any scenario requiring frequent updates and prefix sum queries. It uses roughly the same space as the original array and has lower constant factors than a segment tree.

## How It Works

The Fenwick Tree exploits the binary representation of indices. Each position `i` in the tree stores the sum of a range of elements determined by the lowest set bit of `i`. To query the prefix sum up to index `i`, we add `tree[i]` and then remove the lowest set bit from `i`, repeating until `i` becomes 0. To update index `i`, we add the value to `tree[i]` and then add the lowest set bit to `i`, repeating until `i` exceeds `n`.

### Example

Given array: `A = [0, 1, 3, 2, 5, 1, 4, 3]` (1-indexed for clarity)

**Tree structure showing responsibility ranges:**

```
Index (binary):  1(001)  2(010)  3(011)  4(100)  5(101)  6(110)  7(111)  8(1000)
Lowest set bit:    1       2       1       4       1       2       1       8
Range covered:   [1,1]   [1,2]   [3,3]   [1,4]   [5,5]   [5,6]   [7,7]   [1,8]
Tree value:        1       4       2      11       1       5       3      19
```

**Query: prefix sum of first 6 elements (sum A[1..6]):**

| Step | Index (binary) | Tree value | Running sum | Next index |
|------|---------------|------------|-------------|------------|
| 1 | 6 (110) | 5 | 5 | 6 - 2 = 4 |
| 2 | 4 (100) | 11 | 16 | 4 - 4 = 0 |
| Done | 0 | - | 16 | - |

Result: sum(1..6) = 1 + 3 + 2 + 5 + 1 + 4 = `16`

**Update: add 3 to index 3 (A[3] += 3):**

| Step | Index (binary) | Action | Next index |
|------|---------------|--------|------------|
| 1 | 3 (011) | tree[3] += 3 | 3 + 1 = 4 |
| 2 | 4 (100) | tree[4] += 3 | 4 + 4 = 8 |
| 3 | 8 (1000) | tree[8] += 3 | 8 + 8 = 16 > n |
| Done | - | - | - |

## Pseudocode

```
function update(tree, i, delta, n):
    while i <= n:
        tree[i] = tree[i] + delta
        i = i + (i & (-i))       // add lowest set bit

function prefixSum(tree, i):
    sum = 0
    while i > 0:
        sum = sum + tree[i]
        i = i - (i & (-i))       // remove lowest set bit
    return sum

function rangeQuery(tree, l, r):
    return prefixSum(tree, r) - prefixSum(tree, l - 1)
```

The expression `i & (-i)` isolates the lowest set bit of `i`. This bit manipulation is the key insight that makes Fenwick Trees efficient -- it determines both the range of elements each tree node is responsible for and the traversal pattern for queries and updates.

## Complexity Analysis

| Case    | Time     | Space |
|---------|---------|-------|
| Best    | O(log n) | O(n)  |
| Average | O(log n) | O(n)  |
| Worst   | O(log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(log n):** Even for index 1 (which has the fewest ancestors), the query traverses at least 1 step. For power-of-2 indices, the query completes in 1 step, but updates traverse O(log n) steps.

- **Average Case -- O(log n):** Both update and query traverse at most log n positions because each step either adds or removes the lowest set bit, and an n-bit number has at most log n bits.

- **Worst Case -- O(log n):** The maximum number of steps is bounded by the number of bits in n, which is floor(log n) + 1.

- **Space -- O(n):** The Fenwick Tree uses an array of size n + 1 (1-indexed), which is essentially the same space as the original array.

## When to Use

- **Frequent prefix sum queries with updates:** When you need to repeatedly compute prefix sums and modify array values.
- **Competitive programming:** Fenwick Trees are easy to implement and have low constant factors.
- **Counting inversions:** Combined with coordinate compression, Fenwick Trees efficiently count inversions in O(n log n).
- **When memory is a concern:** Fenwick Trees use less memory than segment trees (array of size n vs. 4n).
- **Range sum queries:** Computing the sum of any range [l, r] using two prefix sum queries.

## When NOT to Use

- **Complex range operations:** If you need range updates with range queries, lazy propagation on a segment tree is more appropriate.
- **Non-commutative operations:** Fenwick Trees work best with operations that have inverses (like addition/subtraction). They cannot efficiently support operations like max/min.
- **When the array is static:** If no updates are needed, a simple prefix sum array gives O(1) queries.
- **When you need range updates and point queries:** While Fenwick Trees can handle this with a difference array trick, segment trees are more straightforward.

## Comparison with Similar Algorithms

| Data Structure    | Query Time | Update Time | Space | Notes                                    |
|------------------|-----------|-------------|-------|------------------------------------------|
| Fenwick Tree      | O(log n)  | O(log n)    | O(n)  | Simple; point update + prefix query       |
| Segment Tree      | O(log n)  | O(log n)    | O(4n) | More versatile; supports any associative op|
| Prefix Sum Array  | O(1)      | O(n)        | O(n)  | Static arrays only; no efficient updates   |
| Sqrt Decomposition| O(sqrt n) | O(1)        | O(n)  | Simpler but slower queries                 |

## Implementations

| Language | File |
|----------|------|
| C++      | [FenwickTree.cpp](cpp/FenwickTree.cpp) |

## References

- Fenwick, P. M. (1994). A new data structure for cumulative frequency tables. *Software: Practice and Experience*, 24(3), 327-336.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Fenwick Tree -- Wikipedia](https://en.wikipedia.org/wiki/Fenwick_tree)
