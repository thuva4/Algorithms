# Optimal Binary Search Tree

## Overview

The Optimal BST problem constructs a binary search tree that minimizes the expected search cost given known search frequencies for each key. Unlike a balanced BST which minimizes worst-case depth, an optimal BST places frequently accessed keys closer to the root, trading off balance for reduced average access time. This is solved using dynamic programming by considering all possible root choices for each subproblem and selecting the one with minimum cost.

The problem was first studied by Knuth (1971), who also showed that the optimal split points are monotone, leading to an O(n^2) optimization (see Knuth's Optimization). The standard DP approach presented here runs in O(n^3).

## How It Works

1. Let freq[i] be the search frequency of key i (i = 0, 1, ..., n-1).
2. Define `cost[i][j]` as the minimum expected search cost for a BST containing keys i through j.
3. For each subproblem (i, j), try every key r in [i, j] as the root:
   - Left subtree: keys i to r-1 with cost cost[i][r-1]
   - Right subtree: keys r+1 to j with cost cost[r+1][j]
   - When a subtree becomes a child, all its nodes go one level deeper, adding sum(freq[i..j]) to the total cost.
4. `cost[i][j] = min over r in [i..j] of (cost[i][r-1] + cost[r+1][j]) + sum(freq[i..j])`.
5. The answer is `cost[0][n-1]`.

## Worked Example

**Keys:** [10, 20, 30] with frequencies **freq = [3, 4, 2]**

**Prefix sums:** W(0,0)=3, W(1,1)=4, W(2,2)=2, W(0,1)=7, W(1,2)=6, W(0,2)=9

**Base cases:** cost[0][0]=3, cost[1][1]=4, cost[2][2]=2

**Interval [0,1]** (keys 10, 20):
- r=0 (root=10): cost[-1][-1] + cost[1][1] + W(0,1) = 0 + 4 + 7 = 11
- r=1 (root=20): cost[0][0] + cost[2][1] + W(0,1) = 3 + 0 + 7 = 10
- cost[0][1] = min(11, 10) = **10** (root=20)

**Interval [1,2]** (keys 20, 30):
- r=1 (root=20): 0 + 2 + 6 = 8
- r=2 (root=30): 4 + 0 + 6 = 10
- cost[1][2] = min(8, 10) = **8** (root=20)

**Interval [0,2]** (all keys):
- r=0 (root=10): 0 + 8 + 9 = 17
- r=1 (root=20): 3 + 2 + 9 = 14
- r=2 (root=30): 10 + 0 + 9 = 19
- cost[0][2] = min(17, 14, 19) = **14** (root=20)

**Optimal BST:**
```
    20 (freq=4)
   /  \
  10    30
(f=3) (f=2)
```

Expected cost = 4*1 + 3*2 + 2*2 = 4 + 6 + 4 = **14** (depths: root=1, children=2).

## Pseudocode

```
function optimalBST(freq, n):
    cost = 2D array of size n x n, initialized to 0
    prefixSum = prefix sum array of freq

    function W(i, j):    // sum of freq[i..j]
        return prefixSum[j+1] - prefixSum[i]

    // Base case: single keys
    for i = 0 to n-1:
        cost[i][i] = freq[i]

    // Fill by increasing interval length
    for len = 2 to n:
        for i = 0 to n - len:
            j = i + len - 1
            cost[i][j] = infinity

            for r = i to j:
                leftCost = (r > i) ? cost[i][r-1] : 0
                rightCost = (r < j) ? cost[r+1][j] : 0
                total = leftCost + rightCost + W(i, j)
                cost[i][j] = min(cost[i][j], total)

    return cost[0][n-1]
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^3) | O(n^2) |
| Average | O(n^3) | O(n^2) |
| Worst   | O(n^3) | O(n^2) |

**Why these complexities?**

- **Time -- O(n^3):** There are O(n^2) subproblems (one for each interval [i, j]). For each subproblem, we try up to O(n) possible roots. Total: O(n^3). With Knuth's optimization (monotone optimal splits), this can be reduced to O(n^2).

- **Space -- O(n^2):** The cost table stores one value per interval [i, j].

## When to Use

- **Static dictionaries with known access patterns:** When you have a fixed set of keys and know how often each will be searched, an optimal BST minimizes average lookup time.
- **Compiler symbol tables:** Frequently used identifiers should be placed near the root of the lookup structure.
- **Database indexing:** When query patterns are known a priori, the index structure can be optimized accordingly.
- **Huffman-like coding:** The optimal BST structure is related to optimal prefix codes for non-uniform distributions.
- **Auto-complete systems:** Words searched more frequently should be found faster.

## When NOT to Use

- **Dynamic key sets:** If keys are inserted and deleted frequently, self-balancing BSTs (AVL, Red-Black, Splay trees) adapt automatically and are more practical.
- **Unknown access patterns:** Without frequency data, balanced BSTs provide O(log n) worst-case guarantee.
- **Large n with real-time constraints:** The O(n^3) construction time (or O(n^2) with Knuth's optimization) may be too slow for very large key sets.
- **When a hash table suffices:** If O(1) average-case lookup is acceptable and order does not matter, hash tables are faster.
- **Uniform access frequencies:** If all keys are accessed equally often, a balanced BST is already optimal.

## Comparison

| Data Structure        | Build Time | Lookup (avg) | Notes                                   |
|----------------------|-----------|-------------|------------------------------------------|
| **Optimal BST**       | **O(n^3)** | **O(weighted depth)** | **Best average case for known frequencies** |
| Balanced BST (AVL)    | O(n log n)| O(log n)    | Self-balancing; no frequency info needed |
| Splay Tree            | O(n)      | O(log n) amortized | Adapts to access patterns dynamically   |
| Hash Table            | O(n)      | O(1) avg    | No ordering; worst case O(n)            |
| Skip List             | O(n log n)| O(log n)    | Probabilistic; simpler than balanced BST|

## Implementations

| Language   | File |
|------------|------|
| Python     | [optimal_bst.py](python/optimal_bst.py) |
| Java       | [OptimalBST.java](java/OptimalBST.java) |
| C++        | [optimal_bst.cpp](cpp/optimal_bst.cpp) |
| C          | [optimal_bst.c](c/optimal_bst.c) |
| Go         | [optimal_bst.go](go/optimal_bst.go) |
| TypeScript | [optimalBst.ts](typescript/optimalBst.ts) |
| Rust       | [optimal_bst.rs](rust/optimal_bst.rs) |
| Kotlin     | [OptimalBST.kt](kotlin/OptimalBST.kt) |
| Swift      | [OptimalBST.swift](swift/OptimalBST.swift) |
| Scala      | [OptimalBST.scala](scala/OptimalBST.scala) |
| C#         | [OptimalBST.cs](csharp/OptimalBST.cs) |

## References

- Knuth, D. E. (1971). "Optimum Binary Search Trees." *Acta Informatica*, 1(1), 14-25.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 15.5: Optimal Binary Search Trees.
- Mehlhorn, K. (1975). "Nearly Optimal Binary Search Trees." *Acta Informatica*, 5(4), 287-295.
- [Optimal Binary Search Tree -- Wikipedia](https://en.wikipedia.org/wiki/Optimal_binary_search_tree)
