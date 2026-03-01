# Centroid Tree (Centroid Decomposition)

## Overview

Centroid decomposition builds a hierarchical tree by repeatedly finding and removing the centroid of a tree. The centroid of a tree is a vertex whose removal results in no remaining subtree having more than half the vertices of the original tree. The resulting centroid tree has O(log V) depth and is useful for efficiently answering path queries on trees.

## How It Works

1. Compute subtree sizes using DFS.
2. Find the centroid: the vertex where no subtree has more than half the total vertices.
3. Mark the centroid as removed.
4. Recursively decompose each remaining subtree.
5. The centroid of each subtree becomes a child of the current centroid in the centroid tree.

Input format: [n, u1, v1, u2, v2, ...] representing an unweighted tree with n vertices and n-1 edges. Output: depth of the centroid tree (the maximum distance from the root centroid to any leaf centroid).

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(V log V) | O(V)  |
| Average | O(V log V) | O(V)  |
| Worst   | O(V log V) | O(V)  |

## Worked Example

Consider a tree with 7 vertices:

```
        0
       / \
      1   2
     / \
    3   4
       / \
      5   6
```

Edges: 0-1, 0-2, 1-3, 1-4, 4-5, 4-6. Total vertices = 7.

**Step 1 -- Find centroid of the full tree (size 7):**
- Subtree sizes from root 0: size[0]=7, size[1]=5, size[2]=1, size[3]=1, size[4]=3, size[5]=1, size[6]=1
- Centroid must have all subtrees <= 7/2 = 3
- Vertex 1: children subtrees are {3}(size 1), {4,5,6}(size 3), parent side {0,2}(size 2). All <= 3. Centroid = 1.

**Step 2 -- Remove vertex 1. Remaining subtrees: {3}, {4,5,6}, {0,2}.**

**Step 3 -- Recurse on each subtree:**
- Subtree {3}: centroid = 3 (single vertex)
- Subtree {4,5,6}: centroid = 4 (removing 4 leaves {5} and {6}, each size 1 <= 1)
- Subtree {0,2}: centroid = 0 (removing 0 leaves {2}, size 1 <= 1)

**Step 4 -- Continue recursion:**
- Subtree {5}: centroid = 5
- Subtree {6}: centroid = 6
- Subtree {2}: centroid = 2

**Centroid tree:**
```
        1
      / | \
     3  4   0
       / \   \
      5   6   2
```

Depth of centroid tree = 2.

## Pseudocode

```
function centroidDecomposition(tree, n):
    removed = array of size n, initialized to false
    subtreeSize = array of size n

    function computeSize(u, parent):
        subtreeSize[u] = 1
        for each neighbor v of u:
            if v != parent AND not removed[v]:
                computeSize(v, u)
                subtreeSize[u] += subtreeSize[v]

    function findCentroid(u, parent, treeSize):
        for each neighbor v of u:
            if v != parent AND not removed[v]:
                if subtreeSize[v] > treeSize / 2:
                    return findCentroid(v, u, treeSize)
        return u

    function decompose(u, depth):
        computeSize(u, -1)
        centroid = findCentroid(u, -1, subtreeSize[u])
        removed[centroid] = true
        maxChildDepth = depth

        for each neighbor v of centroid:
            if not removed[v]:
                childDepth = decompose(v, depth + 1)
                maxChildDepth = max(maxChildDepth, childDepth)

        return maxChildDepth

    return decompose(0, 0)
```

## When to Use

- **Path queries on trees**: Finding distances, counting paths with specific properties, or aggregating values along paths
- **Competitive programming**: Many tree problems reduce to centroid decomposition for efficient O(V log^2 V) or O(V log V) solutions
- **Closest marked vertex queries**: Quickly finding the nearest special vertex to any query vertex in a tree
- **Tree distance queries**: Answering "how many vertices are within distance k" from a given vertex
- **Offline tree queries**: Batch processing of path queries on static trees

## When NOT to Use

- **General graphs**: Centroid decomposition is strictly for trees; for general graphs, use other techniques
- **Dynamic trees**: If the tree structure changes with insertions and deletions, Link-Cut Trees or Euler Tour Trees are more appropriate
- **Simple path queries**: If you only need LCA (lowest common ancestor) or single path queries, binary lifting or HLD (Heavy-Light Decomposition) may be simpler
- **Small trees**: For small trees (V < 100), brute force approaches are simpler and fast enough

## Comparison

| Technique | Purpose | Construction | Query Time |
|-----------|---------|-------------|------------|
| Centroid Decomposition | Path queries, distance aggregation | O(V log V) | O(log V) per query |
| Heavy-Light Decomposition | Path queries with segment trees | O(V) | O(log^2 V) per query |
| Euler Tour + Sparse Table | LCA queries | O(V) | O(1) per query |
| Binary Lifting | LCA and k-th ancestor | O(V log V) | O(log V) per query |

## Implementations

| Language   | File |
|------------|------|
| Python     | [centroid_tree.py](python/centroid_tree.py) |
| Java       | [CentroidTree.java](java/CentroidTree.java) |
| C++        | [centroid_tree.cpp](cpp/centroid_tree.cpp) |
| C          | [centroid_tree.c](c/centroid_tree.c) |
| Go         | [centroid_tree.go](go/centroid_tree.go) |
| TypeScript | [centroidTree.ts](typescript/centroidTree.ts) |
| Rust       | [centroid_tree.rs](rust/centroid_tree.rs) |
| Kotlin     | [CentroidTree.kt](kotlin/CentroidTree.kt) |
| Swift      | [CentroidTree.swift](swift/CentroidTree.swift) |
| Scala      | [CentroidTree.scala](scala/CentroidTree.scala) |
| C#         | [CentroidTree.cs](csharp/CentroidTree.cs) |

## References

- [Centroid Decomposition -- CP-Algorithms](https://cp-algorithms.com/tree/centroid-decomposition.html)
