# Union-Find

## Overview

Union-Find (also known as Disjoint Set Union or DSU) is a data structure that maintains a collection of disjoint (non-overlapping) sets. It supports two primary operations: **Find** (determine which set an element belongs to) and **Union** (merge two sets into one). With the optimizations of path compression and union by rank, both operations run in nearly O(1) amortized time -- specifically O(alpha(n)), where alpha is the inverse Ackermann function.

Union-Find is essential for Kruskal's minimum spanning tree algorithm, detecting cycles in graphs, and maintaining connected components in dynamic graphs. Its near-constant time operations make it one of the most efficient data structures in computer science.

## How It Works

Each set is represented as a tree, with a root element serving as the set's representative. The **Find** operation follows parent pointers from an element to its root. The **Union** operation connects two trees by making one root point to the other. Two key optimizations ensure efficiency:

1. **Path compression:** During Find, all nodes on the path to the root are made to point directly to the root.
2. **Union by rank:** When merging, the shorter tree is attached under the root of the taller tree, preventing degenerate chains.

### Example

Operations on elements {0, 1, 2, 3, 4, 5}:

**Initial state (each element is its own set):**
```
{0} {1} {2} {3} {4} {5}
 0   1   2   3   4   5    (each is its own root)
```

**Union(0, 1):**
```
  0      {2} {3} {4} {5}
  |
  1
```

**Union(2, 3):**
```
  0    2    {4} {5}
  |    |
  1    3
```

**Union(0, 2):**
```
    0        {4} {5}
   / \
  1   2
      |
      3
```

**Find(3) with path compression:**

| Step | Current node | Parent | Action |
|------|-------------|--------|--------|
| 1 | 3 | 2 | Follow parent |
| 2 | 2 | 0 | Follow parent |
| 3 | 0 | 0 (root) | Found root |
| Compress | 3 -> 0 | - | 3 now points directly to 0 |
| Compress | 2 -> 0 | - | 2 already points to 0 |

**After path compression:**
```
      0          {4} {5}
    / | \
   1  2  3
```

**Union(4, 5), then Union(0, 4):**
```
        0
      / | \ \
     1  2  3  4
              |
              5
```

Sets: {0, 1, 2, 3, 4, 5} -- all connected.

## Pseudocode

```
function makeSet(x):
    parent[x] = x
    rank[x] = 0

function find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])    // path compression
    return parent[x]

function union(x, y):
    rootX = find(x)
    rootY = find(y)

    if rootX == rootY:
        return    // already in the same set

    // Union by rank
    if rank[rootX] < rank[rootY]:
        parent[rootX] = rootY
    else if rank[rootX] > rank[rootY]:
        parent[rootY] = rootX
    else:
        parent[rootY] = rootX
        rank[rootX] = rank[rootX] + 1
```

Path compression flattens the tree structure during Find, while union by rank ensures the tree height grows logarithmically. Together, they yield nearly constant amortized time.

## Complexity Analysis

| Case    | Time        | Space |
|---------|------------|-------|
| Best    | O(1)       | O(n)  |
| Average | O(alpha(n))| O(n)  |
| Worst   | O(alpha(n))| O(n)  |

**Why these complexities?**

- **Best Case -- O(1):** When an element's parent is already the root (common after path compression), Find returns immediately.

- **Average Case -- O(alpha(n)):** With both path compression and union by rank, the amortized cost per operation is O(alpha(n)), where alpha(n) is the inverse Ackermann function. For all practical purposes, alpha(n) <= 4 for n up to 10^80.

- **Worst Case -- O(alpha(n)):** The amortized analysis by Tarjan proves that any sequence of m operations on n elements takes O(m * alpha(n)) time total, giving O(alpha(n)) per operation.

- **Space -- O(n):** Two arrays are needed: `parent[n]` for tree structure and `rank[n]` for balancing heuristic.

## When to Use

- **Kruskal's MST algorithm:** Efficiently detecting cycles when adding edges in order of weight.
- **Dynamic connectivity queries:** Maintaining connected components as edges are added to a graph.
- **Equivalence class merging:** When elements need to be grouped and group membership queried.
- **Percolation problems:** Determining when a system becomes connected (used in physics and network analysis).
- **Image processing:** Connected component labeling in binary images.

## When NOT to Use

- **When sets need to be split:** Union-Find only supports merging, not splitting sets. The split operation is not efficiently supported.
- **When you need to enumerate all elements of a set:** Union-Find only identifies the representative; listing all members requires additional data structures.
- **When edge deletion is needed:** Removing edges from the union structure is not supported. Use link-cut trees for dynamic forests.
- **When the graph is static and known in advance:** BFS/DFS can compute connected components in O(V + E) without the overhead of Union-Find.

## Comparison with Similar Algorithms

| Data Structure | Find Time   | Union Time  | Space | Notes                                    |
|---------------|------------|------------|-------|------------------------------------------|
| Union-Find (optimized)| O(alpha(n))| O(alpha(n))| O(n) | Nearly constant; standard approach       |
| Union-Find (naive)| O(n) | O(1) | O(n) | No optimizations; can degenerate to chain |
| BFS/DFS Components| O(V+E) | N/A | O(V) | Static graphs only; one-time computation  |
| Link-Cut Tree  | O(log n)* | O(log n)* | O(n) | *Amortized; supports edge deletion        |

## Implementations

| Language | File |
|----------|------|
| Python   | [union_find.py](python/union_find.py) |
| Java     | [unionFind.java](java/unionFind.java) |
| C        | [union_find.c](c/union_find.c) |

## References

- Tarjan, R. E. (1975). Efficiency of a good but not linear set union algorithm. *Journal of the ACM*, 22(2), 215-225.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 21: Data Structures for Disjoint Sets.
- [Disjoint-set Data Structure -- Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
