# Centroid Decomposition

## Overview

Centroid Decomposition is a technique for decomposing a tree by repeatedly finding and removing centroids. The centroid of a tree is a node whose removal results in no remaining subtree having more than half the total nodes. By recursively decomposing each resulting subtree, a new "centroid decomposition tree" is formed with depth O(log N), enabling efficient divide-and-conquer solutions for path queries and distance-related problems on trees.

## How It Works

1. **Find the centroid** of the current tree by computing subtree sizes and selecting the node where the largest remaining subtree after removal has at most N/2 nodes.
2. **Remove the centroid** and mark it as processed.
3. **Recursively decompose** each resulting subtree, finding their centroids.
4. **Build the decomposition tree** by making the centroid the parent of the centroids of the subtrees.

The key insight is that every path in the original tree passes through the centroid of some level in the decomposition. This means path-related queries can be answered by considering at most O(log N) centroids.

## Example

Consider the tree with 7 nodes:

```
        1
       / \
      2   3
     / \   \
    4   5   6
    |
    7
```

Edges: (1,2), (1,3), (2,4), (2,5), (3,6), (4,7)

**Step 1:** Find the centroid of the entire tree (N=7). Computing subtree sizes from any root, node 2 has the property that removing it leaves subtrees of sizes {1, 1, 3} (subtree at 4 with child 7 has size 2, subtree at 5 has size 1, remaining tree {1,3,6} has size 3). But checking node 1: removing it leaves {4, 3} = max is 4. Node 2: removing it leaves {2, 1, 3} = max is 3 <= 7/2. So centroid = 2.

**Step 2:** Remove node 2. Remaining subtrees: {4, 7}, {5}, {1, 3, 6}.

**Step 3:** Recursively find centroids:
- Subtree {4, 7}: centroid = 4 (removing 4 leaves {7}, size 1 <= 1).
- Subtree {5}: centroid = 5.
- Subtree {1, 3, 6}: centroid = 3 (removing 3 leaves {1} and {6}, both size 1 <= 1).

**Centroid decomposition tree:**
```
        2
      / | \
     4  5  3
     |    / \
     7   1   6
```

Depth = 2 (O(log 7) ~ 2.8), confirming the logarithmic depth guarantee.

## Pseudocode

```
function CENTROID_DECOMPOSITION(adj, n):
    removed = array of false, size n
    subtree_size = array of 0, size n
    cd_parent = array of -1, size n

    function GET_SUBTREE_SIZE(v, parent):
        subtree_size[v] = 1
        for u in adj[v]:
            if u != parent and not removed[u]:
                GET_SUBTREE_SIZE(u, v)
                subtree_size[v] += subtree_size[u]

    function GET_CENTROID(v, parent, tree_size):
        for u in adj[v]:
            if u != parent and not removed[u]:
                if subtree_size[u] > tree_size / 2:
                    return GET_CENTROID(u, v, tree_size)
        return v

    function DECOMPOSE(v, parent_centroid):
        GET_SUBTREE_SIZE(v, -1)
        centroid = GET_CENTROID(v, -1, subtree_size[v])
        removed[centroid] = true
        cd_parent[centroid] = parent_centroid

        for u in adj[centroid]:
            if not removed[u]:
                DECOMPOSE(u, centroid)

    DECOMPOSE(0, -1)
    return cd_parent
```

## Complexity Analysis

| Operation | Time       | Space |
|-----------|------------|-------|
| Build decomposition | O(N log N) | O(N) |
| Depth of decomposition tree | O(log N) | - |
| Path query (using decomposition) | O(log^2 N) typical | O(N log N) |
| Point update + query | O(log N) per level, O(log^2 N) total | O(N log N) |

Building takes O(N log N) because each node appears in at most O(log N) levels of recursion, and at each level, computing subtree sizes takes linear time in the subtree.

## When to Use

- **Distance queries on trees:** Finding the number of paths of length <= K, or the sum of distances from a node to all other nodes.
- **Tree path queries with updates:** Point updates on nodes with queries about paths (e.g., "closest marked node" queries).
- **Competitive programming:** Problems on trees where brute force is O(N^2) and you need O(N log^2 N) or better.
- **Divide and conquer on trees:** Any problem that benefits from the property that every path passes through a centroid at some decomposition level.

## When NOT to Use

- **Path queries with range updates:** Heavy-Light Decomposition (HLD) combined with segment trees is often simpler and more straightforward for path update + path query problems.
- **Subtree queries only:** Euler tour + segment tree or BIT is simpler and more efficient for pure subtree aggregate queries.
- **When the tree structure changes dynamically:** Centroid decomposition is built once and does not support dynamic edge insertions/deletions efficiently. Use Link-Cut Trees instead.
- **Simple LCA queries:** Binary lifting or sparse table on Euler tour is simpler for just finding lowest common ancestors.

## Comparison

| Feature | Centroid Decomposition | Heavy-Light Decomposition | Euler Tour + Segment Tree |
|---------|----------------------|--------------------------|--------------------------|
| Build time | O(N log N) | O(N) | O(N) |
| Path query | O(log^2 N) | O(log^2 N) | N/A (subtree only) |
| Subtree query | Complex | O(log N) | O(log N) |
| Path update + query | Complex | Natural with seg tree | N/A |
| Distance queries | Natural | Possible but complex | N/A |
| Implementation | Moderate | Moderate | Easy |
| Conceptual basis | Divide and conquer | Chain decomposition | Flattening |

## References

- Bender, M. A.; Farach-Colton, M. (2000). "The LCA problem revisited." *LATIN*, 88-94.
- Brodal, G. S.; Fagerberg, R. (2006). "Cache-oblivious string dictionaries." *SODA*.
- Halim, S.; Halim, F. (2013). *Competitive Programming 3*. Section on Centroid Decomposition.
- "Centroid Decomposition of a Tree." *CP-Algorithms* (e-maxx). https://cp-algorithms.com/

## Implementations

| Language   | File |
|------------|------|
| Python     | [centroid_decomposition.py](python/centroid_decomposition.py) |
| Java       | [CentroidDecomposition.java](java/CentroidDecomposition.java) |
| C++        | [centroid_decomposition.cpp](cpp/centroid_decomposition.cpp) |
| C          | [centroid_decomposition.c](c/centroid_decomposition.c) |
| Go         | [centroid_decomposition.go](go/centroid_decomposition.go) |
| TypeScript | [centroidDecomposition.ts](typescript/centroidDecomposition.ts) |
| Rust       | [centroid_decomposition.rs](rust/centroid_decomposition.rs) |
| Kotlin     | [CentroidDecomposition.kt](kotlin/CentroidDecomposition.kt) |
| Swift      | [CentroidDecomposition.swift](swift/CentroidDecomposition.swift) |
| Scala      | [CentroidDecomposition.scala](scala/CentroidDecomposition.scala) |
| C#         | [CentroidDecomposition.cs](csharp/CentroidDecomposition.cs) |
