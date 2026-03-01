# Lowest Common Ancestor

## Overview

The Lowest Common Ancestor (LCA) of two nodes u and v in a rooted tree is the deepest node that is an ancestor of both u and v. The binary lifting technique preprocesses the tree in O(N log N) time and space, enabling each LCA query to be answered in O(log N) time. LCA is a fundamental building block in tree algorithms, used in distance computation, path queries, and various graph problems that reduce to tree problems.

## How It Works

1. **Root the tree** and compute the depth of each node using BFS or DFS.
2. **Precompute ancestors:** Build a table `up[v][k]` where `up[v][k]` is the 2^k-th ancestor of node v. Base case: `up[v][0]` is the parent of v. Transition: `up[v][k] = up[up[v][k-1]][k-1]`.
3. **Answer LCA(u, v):**
   - Bring both nodes to the same depth by lifting the deeper node using binary jumps.
   - If they are the same node, return it.
   - Otherwise, jump both nodes upward in decreasing powers of 2, always maintaining `up[u][k] != up[v][k]`. After the loop, u and v are children of the LCA, so return `up[u][0]`.

## Example

Consider the following rooted tree (root = 1):

```
         1
        / \
       2   3
      / \   \
     4   5   6
    /       / \
   7       8   9
```

Edges: (1,2), (1,3), (2,4), (2,5), (3,6), (4,7), (6,8), (6,9)

**Depths:** 1:0, 2:1, 3:1, 4:2, 5:2, 6:2, 7:3, 8:3, 9:3

**Binary lifting table (up[v][k]):**

| Node | up[v][0] (parent) | up[v][1] (2nd ancestor) |
|------|-------------------|-------------------------|
| 1    | -1 (root)         | -1                      |
| 2    | 1                 | -1                      |
| 3    | 1                 | -1                      |
| 4    | 2                 | 1                       |
| 5    | 2                 | 1                       |
| 6    | 3                 | 1                       |
| 7    | 4                 | 2                       |
| 8    | 6                 | 3                       |
| 9    | 6                 | 3                       |

**Query: LCA(7, 9)**

1. depth(7) = 3, depth(9) = 3. Same depth, proceed.
2. k = 1: up[7][1] = 2, up[9][1] = 3. Different, so jump: u = 2, v = 3.
3. k = 0: up[2][0] = 1, up[3][0] = 1. Same! Do not jump.
4. Return up[2][0] = **1**. LCA(7, 9) = 1.

**Query: LCA(7, 5)**

1. depth(7) = 3, depth(5) = 2. Lift 7 by 1: up[7][0] = 4. Now u = 4, v = 5, both at depth 2.
2. k = 0: up[4][0] = 2, up[5][0] = 2. Same! Do not jump.
3. Return up[4][0] = **2**. LCA(7, 5) = 2.

## Pseudocode

```
function PREPROCESS(tree, root, n):
    LOG = floor(log2(n)) + 1
    depth = array of size n
    up = 2D array [n][LOG], initialized to -1

    // BFS to compute depths and parents
    queue = [root]
    depth[root] = 0
    while queue is not empty:
        v = queue.dequeue()
        for u in tree[v]:
            if u != up[v][0]:      // u is not parent of v
                depth[u] = depth[v] + 1
                up[u][0] = v
                queue.enqueue(u)

    // Fill binary lifting table
    for k = 1 to LOG - 1:
        for v = 0 to n - 1:
            if up[v][k-1] != -1:
                up[v][k] = up[up[v][k-1]][k-1]

function LCA(u, v):
    // Step 1: Bring to same depth
    if depth[u] < depth[v]:
        swap(u, v)
    diff = depth[u] - depth[v]
    for k = LOG - 1 down to 0:
        if diff >= 2^k:
            u = up[u][k]
            diff -= 2^k

    if u == v:
        return u

    // Step 2: Binary lift both
    for k = LOG - 1 down to 0:
        if up[u][k] != up[v][k]:
            u = up[u][k]
            v = up[v][k]

    return up[u][0]

function DISTANCE(u, v):
    return depth[u] + depth[v] - 2 * depth[LCA(u, v)]
```

## Complexity Analysis

| Operation | Time       | Space      |
|-----------|------------|------------|
| Preprocessing | O(N log N) | O(N log N) |
| LCA query | O(log N) | O(1) |
| Distance query | O(log N) | O(1) |
| k-th ancestor | O(log N) | O(1) |

Alternative approaches and their trade-offs:

| Method | Preprocess | Query | Space |
|--------|-----------|-------|-------|
| Binary Lifting | O(N log N) | O(log N) | O(N log N) |
| Euler Tour + Sparse Table | O(N log N) | O(1) | O(N log N) |
| Euler Tour + Segment Tree | O(N) | O(log N) | O(N) |
| Tarjan's Offline LCA | O(N * alpha(N)) | O(1) offline | O(N) |

## When to Use

- **Distance between two nodes:** dist(u, v) = depth(u) + depth(v) - 2 * depth(LCA(u, v)).
- **Path queries on trees:** Decomposing a path u-v into u-LCA and LCA-v.
- **Phylogenetic trees:** Finding the most recent common ancestor of two species.
- **Network analysis:** Finding the point where two routes converge.
- **Competitive programming:** LCA is a fundamental subroutine in many tree problems.
- **Version control systems:** Finding the merge base of two branches (e.g., `git merge-base`).

## When NOT to Use

- **Unrooted trees with ad-hoc queries:** If the tree is unrooted and you only need one or two LCA queries, a simple DFS-based approach avoids the O(N log N) preprocessing.
- **DAGs (directed acyclic graphs):** LCA is defined for trees. For DAGs, you need the more general "lowest common ancestor in a DAG" problem, which is harder.
- **Dynamic trees (edges added/removed):** Binary lifting requires a static tree. For dynamic forests, use Link-Cut Trees or Euler Tour Trees.
- **When O(1) query time is essential:** Binary lifting gives O(log N) per query. If you need O(1), use the Euler tour reduction to Range Minimum Query (RMQ) with a sparse table.

## Comparison

| Feature | Binary Lifting | Euler Tour + Sparse Table | Tarjan's Offline |
|---------|---------------|--------------------------|-----------------|
| Query time | O(log N) | O(1) | O(1) batch |
| Preprocess time | O(N log N) | O(N log N) | O(N alpha(N)) |
| Online queries | Yes | Yes | No (offline) |
| k-th ancestor | Yes | No (separate structure) | No |
| Space | O(N log N) | O(N log N) | O(N) |
| Implementation | Simple | Moderate | Moderate |

## References

- Bender, M. A.; Farach-Colton, M. (2000). "The LCA problem revisited." *LATIN 2000*, LNCS 1776, pp. 88-94.
- Harel, D.; Tarjan, R. E. (1984). "Fast algorithms for finding nearest common ancestors." *SIAM Journal on Computing*, 13(2), 338-355.
- Berkman, O.; Vishkin, U. (1993). "Recursive star-tree parallel data structure." *SIAM Journal on Computing*, 22(2), 221-242.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press.
- "Lowest Common Ancestor - Binary Lifting." *CP-Algorithms*. https://cp-algorithms.com/

## Implementations

| Language   | File |
|------------|------|
| Python     | [lowest_common_ancestor.py](python/lowest_common_ancestor.py) |
| Java       | [LowestCommonAncestor.java](java/LowestCommonAncestor.java) |
| C++        | [lowest_common_ancestor.cpp](cpp/lowest_common_ancestor.cpp) |
| C          | [lowest_common_ancestor.c](c/lowest_common_ancestor.c) |
| Go         | [lowest_common_ancestor.go](go/lowest_common_ancestor.go) |
| TypeScript | [lowestCommonAncestor.ts](typescript/lowestCommonAncestor.ts) |
| Rust       | [lowest_common_ancestor.rs](rust/lowest_common_ancestor.rs) |
| Kotlin     | [LowestCommonAncestor.kt](kotlin/LowestCommonAncestor.kt) |
| Swift      | [LowestCommonAncestor.swift](swift/LowestCommonAncestor.swift) |
| Scala      | [LowestCommonAncestor.scala](scala/LowestCommonAncestor.scala) |
| C#         | [LowestCommonAncestor.cs](csharp/LowestCommonAncestor.cs) |
