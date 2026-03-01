# Tree Diameter

## Overview

The diameter of a tree is the length of the longest path between any two nodes. This path is also called the "longest path" or "eccentricity" of the tree. The two-BFS (or two-DFS) algorithm finds the diameter of an unweighted tree in O(V) time by exploiting the property that one endpoint of the diameter is always the farthest node from any arbitrary starting node. This algorithm works for both unweighted trees (counting edges) and weighted trees (summing edge weights).

## How It Works

1. **First BFS/DFS:** Start from any arbitrary node (e.g., node 0). Find the farthest node `u` from this starting point. Node `u` is guaranteed to be one endpoint of a diameter path.
2. **Second BFS/DFS:** Start from node `u`. Find the farthest node `v` from `u`. The distance from `u` to `v` is the diameter of the tree.
3. **Correctness proof sketch:** Suppose the diameter is the path from `a` to `b`. Starting BFS from any node `s`, the farthest node `u` must be either `a` or `b` (or another endpoint of an equally long path). This is because if `u` were not a diameter endpoint, we could construct a longer path, contradicting the definition.

## Example

**Tree:**
```
    0
   / \
  1   2
 / \
3   4
    |
    5
    |
    6
```

Edges: (0,1), (0,2), (1,3), (1,4), (4,5), (5,6)

**Step 1: BFS from node 0.**

| Node | Distance from 0 |
|------|-----------------|
| 0    | 0               |
| 1    | 1               |
| 2    | 1               |
| 3    | 2               |
| 4    | 2               |
| 5    | 3               |
| 6    | 4               |

Farthest node: **u = 6** (distance 4).

**Step 2: BFS from node 6.**

| Node | Distance from 6 |
|------|-----------------|
| 6    | 0               |
| 5    | 1               |
| 4    | 2               |
| 1    | 3               |
| 0    | 4               |
| 3    | 4               |
| 2    | 5               |

Farthest node: **v = 2** (distance 5).

**Diameter = 5** (path: 2 -- 0 -- 1 -- 4 -- 5 -- 6, which has 5 edges).

## Pseudocode

```
function BFS_FARTHEST(adj, start, n):
    dist = array of -1, size n
    dist[start] = 0
    queue = [start]
    farthest_node = start
    max_dist = 0
    while queue is not empty:
        v = queue.dequeue()
        for u in adj[v]:
            if dist[u] == -1:
                dist[u] = dist[v] + 1
                if dist[u] > max_dist:
                    max_dist = dist[u]
                    farthest_node = u
                queue.enqueue(u)
    return (farthest_node, max_dist)

function TREE_DIAMETER(adj, n):
    (u, _) = BFS_FARTHEST(adj, 0, n)       // any start node
    (v, diameter) = BFS_FARTHEST(adj, u, n)
    return diameter

// Alternative: DFS-based (useful for weighted trees)
function DFS_FARTHEST(adj, v, parent, dist):
    farthest = (v, dist)
    for (u, weight) in adj[v]:
        if u != parent:
            candidate = DFS_FARTHEST(adj, u, v, dist + weight)
            if candidate.dist > farthest.dist:
                farthest = candidate
    return farthest

// Alternative: Single DFS (compute diameter via subtree depths)
function DIAMETER_SINGLE_DFS(adj, root):
    diameter = 0

    function DEPTH(v, parent):
        max1 = 0, max2 = 0    // two longest depths among children
        for u in adj[v]:
            if u != parent:
                d = DEPTH(u, v) + 1
                if d > max1:
                    max2 = max1; max1 = d
                elif d > max2:
                    max2 = d
        diameter = max(diameter, max1 + max2)
        return max1

    DEPTH(root, -1)
    return diameter
```

## Complexity Analysis

| Algorithm | Time | Space |
|-----------|------|-------|
| Two-BFS | O(V + E) = O(V) for trees | O(V) |
| Two-DFS | O(V + E) = O(V) for trees | O(V) recursion stack |
| Single DFS | O(V + E) = O(V) for trees | O(V) recursion stack |
| Brute force (all pairs) | O(V^2) | O(V) |

Since a tree has exactly V - 1 edges, E = V - 1, so all linear-time algorithms run in O(V).

## When to Use

- **Finding the longest path in a tree:** The most basic use case -- network latency analysis, finding the critical path.
- **Tree center finding:** The center of a tree (node minimizing maximum distance to any other node) lies on the diameter path. Finding the diameter first enables finding the center in O(V).
- **Competitive programming:** Many tree problems involve the diameter as a subroutine (e.g., "find the two farthest nodes," "minimize the maximum distance after adding an edge").
- **Network design:** Finding the worst-case communication delay in a tree network.
- **Phylogenetic analysis:** Finding the most divergent pair of species in an evolutionary tree.

## When NOT to Use

- **Graphs with cycles:** The two-BFS trick relies on the tree structure (no cycles, unique paths). For general graphs, finding the diameter requires all-pairs shortest paths (Floyd-Warshall) or BFS from every node.
- **Directed trees:** The algorithm assumes undirected edges. For directed trees (rooted), the concept changes to "longest directed path."
- **When you need all eccentricities:** If you need the eccentricity (farthest distance) for every node, not just the global maximum, a single diameter computation is insufficient. Use a more comprehensive approach.
- **Weighted graphs with negative weights:** The BFS approach does not work with negative edge weights. Use DFS or modify the algorithm for weighted trees.

## Comparison

| Method | Time | Space | Works for | Notes |
|--------|------|-------|-----------|-------|
| Two-BFS | O(V) | O(V) | Unweighted trees | Simplest; iterative |
| Two-DFS | O(V) | O(V) stack | Weighted/unweighted trees | May hit recursion limits |
| Single DFS | O(V) | O(V) stack | Weighted/unweighted trees | Computes diameter without identifying endpoints |
| All-pairs BFS | O(V^2) | O(V) | Any graph | Brute force, general |
| DP on tree | O(V) | O(V) | Rooted trees | Works bottom-up |

## References

- Bulterman, R. W.; van der Sommen, F. W.; Zwaan, G.; Verhoeff, T.; van Gasteren, A. J. M.; Feijen, W. H. J. (2002). "On computing a longest path in a tree." *Information Processing Letters*, 81(2), 93-96.
- Cormen, T. H.; Leiserson, C. E.; Rivest, R. L.; Stein, C. (2009). *Introduction to Algorithms*, 3rd ed. MIT Press. Problem 22-2.
- Halim, S.; Halim, F. (2013). *Competitive Programming 3*. Section on Tree Diameter.
- "Tree Diameter." *CP-Algorithms*. https://cp-algorithms.com/

## Implementations

| Language   | File |
|------------|------|
| Python     | [tree_diameter.py](python/tree_diameter.py) |
| Java       | [TreeDiameter.java](java/TreeDiameter.java) |
| C++        | [tree_diameter.cpp](cpp/tree_diameter.cpp) |
| C          | [tree_diameter.c](c/tree_diameter.c) |
| Go         | [tree_diameter.go](go/tree_diameter.go) |
| TypeScript | [treeDiameter.ts](typescript/treeDiameter.ts) |
| Rust       | [tree_diameter.rs](rust/tree_diameter.rs) |
| Kotlin     | [TreeDiameter.kt](kotlin/TreeDiameter.kt) |
| Swift      | [TreeDiameter.swift](swift/TreeDiameter.swift) |
| Scala      | [TreeDiameter.scala](scala/TreeDiameter.scala) |
| C#         | [TreeDiameter.cs](csharp/TreeDiameter.cs) |
