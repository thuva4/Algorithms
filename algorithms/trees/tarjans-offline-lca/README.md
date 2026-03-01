# Tarjan's Offline LCA

## Overview

Tarjan's Offline Lowest Common Ancestor (LCA) algorithm answers multiple LCA queries on a rooted tree in nearly linear time. Given a tree and a batch of queries of the form "What is the LCA of nodes u and v?", the algorithm processes all queries together (offline) using a depth-first search combined with the Union-Find data structure. It achieves O(n + q * alpha(n)) time, where alpha is the inverse Ackermann function (effectively constant).

This algorithm is particularly efficient when all queries are known in advance. It was developed by Robert Tarjan and is one of the earliest applications of the Union-Find data structure to tree problems.

## How It Works

The algorithm performs a DFS traversal of the tree. When a node is fully processed (all its subtrees have been visited), it is unioned with its parent using Union-Find. For each query (u, v), when both u and v have been visited, the LCA is the current representative (find) of the earlier-visited node. The key insight is that after processing a subtree rooted at a node x, all nodes in that subtree point to x's ancestor that is currently being processed.

### Example

Given tree and queries:

```
        1
       / \
      2   3
     / \   \
    4   5   6
```

Queries: LCA(4, 5), LCA(4, 6), LCA(5, 6)

**DFS traversal with Union-Find operations:**

| Step | Action | Node state | Union-Find sets | Answered queries |
|------|--------|-----------|-----------------|-----------------|
| 1 | Visit 1 | 1: visited | {1}, {2}, {3}, {4}, {5}, {6} | - |
| 2 | Visit 2 | 2: visited | {1}, {2}, {3}, {4}, {5}, {6} | - |
| 3 | Visit 4 | 4: visited | {1}, {2}, {3}, {4}, {5}, {6} | - |
| 4 | Finish 4, union(4, 2) | 4: done | {1}, {2, 4}, {3}, {5}, {6} | - |
| 5 | Visit 5 | 5: visited | {1}, {2, 4}, {3}, {5}, {6} | - |
| 6 | Finish 5, union(5, 2) | 5: done | {1}, {2, 4, 5}, {3}, {6} | LCA(4,5)=find(4)=2 |
| 7 | Finish 2, union(2, 1) | 2: done | {1, 2, 4, 5}, {3}, {6} | - |
| 8 | Visit 3 | 3: visited | {1, 2, 4, 5}, {3}, {6} | - |
| 9 | Visit 6 | 6: visited | {1, 2, 4, 5}, {3}, {6} | - |
| 10 | Finish 6, union(6, 3) | 6: done | {1, 2, 4, 5}, {3, 6} | LCA(4,6)=find(4)=1, LCA(5,6)=find(5)=1 |
| 11 | Finish 3, union(3, 1) | 3: done | {1, 2, 3, 4, 5, 6} | - |

Results: LCA(4,5) = `2`, LCA(4,6) = `1`, LCA(5,6) = `1`

## Pseudocode

```
function tarjanLCA(root, queries):
    parent = Union-Find structure
    visited = set()
    answers = empty map

    function dfs(u):
        visited.add(u)

        for each child v of u:
            dfs(v)
            union(u, v)         // merge child's set into parent's
            // Set representative of merged set to u
            setRepresentative(find(u), u)

        // Answer queries involving u where the other node is already visited
        for each query (u, w) or (w, u):
            if w in visited:
                answers[(u, w)] = find(w)

    dfs(root)
    return answers
```

The crucial property: when node u finishes processing and we query (u, w) where w is already visited, `find(w)` returns the LCA of u and w. This works because w's representative has been progressively unioned up to the deepest common ancestor that has been fully processed.

## Complexity Analysis

| Case    | Time               | Space |
|---------|--------------------|-------|
| Best    | O(n + q)           | O(n)  |
| Average | O(n * alpha(n) + q)| O(n)  |
| Worst   | O(n * alpha(n) + q)| O(n)  |

**Why these complexities?**

- **Best Case -- O(n + q):** The DFS visits each of the n nodes once. Union-Find with path compression and union by rank gives nearly O(1) amortized per operation.

- **Average Case -- O(n * alpha(n) + q):** The DFS takes O(n), and n - 1 union operations plus q find operations on the Union-Find take O((n + q) * alpha(n)), where alpha(n) is the inverse Ackermann function and grows so slowly it is effectively constant for all practical n.

- **Worst Case -- O(n * alpha(n) + q):** The Union-Find operations dominate. The alpha(n) factor is at most 4 for any n up to 10^80, so this is effectively linear.

- **Space -- O(n):** The Union-Find structure uses O(n) space for parent and rank arrays. The DFS recursion stack uses O(n) in the worst case (skewed tree).

## When to Use

- **Batch LCA queries:** When all queries are known in advance and can be processed together.
- **When near-linear time is needed:** Tarjan's offline LCA is one of the fastest LCA algorithms for batch processing.
- **When implementation simplicity matters:** The algorithm is relatively straightforward with a standard Union-Find implementation.
- **Combined with other offline algorithms:** Works well when other parts of the solution also process data offline.

## When NOT to Use

- **Online LCA queries:** If queries arrive one at a time and must be answered immediately, use binary lifting (O(log n) per query) or sparse table on Euler tour (O(1) per query after O(n log n) preprocessing).
- **When the tree changes dynamically:** Tarjan's algorithm requires the tree to be static during processing.
- **Very deep recursion:** The DFS can cause stack overflow on very deep trees. Use iterative DFS or increase stack size.
- **When preprocessing time is acceptable:** Sparse table with Euler tour gives O(1) query time after O(n log n) preprocessing.

## Comparison with Similar Algorithms

| Algorithm                | Query Time | Preprocess Time | Space     | Notes                              |
|-------------------------|-----------|----------------|-----------|-------------------------------------|
| Tarjan's Offline LCA     | O(alpha(n))| O(n)           | O(n)      | Offline; batch processing            |
| Binary Lifting           | O(log n)  | O(n log n)     | O(n log n)| Online; simple implementation        |
| Euler Tour + Sparse Table| O(1)      | O(n log n)     | O(n log n)| Online; fastest query time           |
| HLD-based LCA            | O(log n)  | O(n)           | O(n)      | Online; also supports path queries   |

## Implementations

| Language | File |
|----------|------|
| C++      | [LCA.cpp](cpp/LCA.cpp) |

## References

- Tarjan, R. E. (1979). Applications of path compression on balanced trees. *Journal of the ACM*, 26(4), 690-715.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 21: Data Structures for Disjoint Sets.
- [Lowest Common Ancestor -- Wikipedia](https://en.wikipedia.org/wiki/Lowest_common_ancestor)
