# Heavy-Light Decomposition

## Overview

Heavy-Light Decomposition (HLD) is a technique for decomposing a tree into chains (paths) such that any path from a node to the root passes through at most O(log n) chains. This decomposition allows path queries and updates on trees to be answered efficiently by reducing them to a series of queries on a segment tree or other range data structure.

HLD is essential for solving advanced tree problems that require path queries (e.g., maximum edge weight on a path, sum of node values between two nodes) in O(log^2 n) time per query. It bridges the gap between simple tree traversals and efficient range query data structures.

## How It Works

The decomposition classifies each edge as "heavy" or "light." For each node, the edge to the child with the largest subtree is "heavy," and all other edges to children are "light." A "heavy chain" is a maximal path of heavy edges. After decomposition, each heavy chain is assigned contiguous positions in a flat array, which is then backed by a segment tree. To answer a path query between two nodes, we climb from both nodes toward their LCA, querying each chain segment along the way.

### Example

Given tree with node values:

```
           1 (val=5)
          / \
    (heavy) (light)
        2 (val=3)     3 (val=7)
       / \               \
  (heavy) (light)     (heavy)
    4 (val=1)  5 (val=8)   6 (val=2)
   /
(heavy)
  7 (val=4)
```

**Step 1: Compute subtree sizes:**

| Node | Subtree size | Heavy child |
|------|-------------|-------------|
| 1 | 7 | 2 (size 4) |
| 2 | 4 | 4 (size 2) |
| 3 | 2 | 6 (size 1) |
| 4 | 2 | 7 (size 1) |

**Step 2: Identify heavy chains:**

- Chain 1: 1 -> 2 -> 4 -> 7 (following heavy edges from root)
- Chain 2: 5 (single node, light edge from 2)
- Chain 3: 3 -> 6 (following heavy edge from 3)

**Step 3: Flat array assignment:**

| Position | 0 | 1 | 2 | 3 | 4 | 5 |
|----------|---|---|---|---|---|---|
| Node | 1 | 2 | 4 | 7 | 5 | 3 | 6 |
| Value | 5 | 3 | 1 | 4 | 8 | 7 | 2 |
| Chain | 1 | 1 | 1 | 1 | 2 | 3 | 3 |

**Query: sum on path from node 7 to node 6:**

| Step | Current nodes | Action | Query result |
|------|--------------|--------|-------------|
| 1 | 7 (chain 1), 6 (chain 3) | Different chains. Chain head of 6 is 3, deeper. Query chain 3: [3,6], climb to parent of 3 = 1 | sum(7,2) = 9 |
| 2 | 7 (chain 1), 1 (chain 1) | Same chain. Query segment [1, 7] in positions [0..3] | sum(5,3,1,4) = 13 |
| Total | - | - | 9 + 13 = 22 |

## Pseudocode

```
function decompose(node, chain_head):
    position[node] = current_position++
    head[node] = chain_head

    // Continue heavy chain with heavy child
    if node has a heavy child hc:
        decompose(hc, chain_head)

    // Start new chains for light children
    for each light child lc of node:
        decompose(lc, lc)

function pathQuery(u, v):
    result = identity
    while head[u] != head[v]:
        if depth[head[u]] < depth[head[v]]:
            swap(u, v)
        result = combine(result, segTree.query(position[head[u]], position[u]))
        u = parent[head[u]]
    if depth[u] > depth[v]:
        swap(u, v)
    result = combine(result, segTree.query(position[u], position[v]))
    return result
```

The key insight is that any root-to-node path crosses at most O(log n) light edges (because each light edge halves the subtree size), and heavy chains are handled efficiently as contiguous segments.

## Complexity Analysis

| Case    | Time       | Space |
|---------|-----------|-------|
| Best    | O(log^2 n) | O(n)  |
| Average | O(log^2 n) | O(n)  |
| Worst   | O(log^2 n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(log^2 n):** A path query decomposes into at most O(log n) chain segments (due to at most O(log n) light edges on any root-to-leaf path), and each segment query on the segment tree takes O(log n).

- **Average Case -- O(log^2 n):** The product of O(log n) chain segments and O(log n) per segment tree query gives O(log^2 n) per path query.

- **Worst Case -- O(log^2 n):** The bound of O(log n) chains per path is tight (consider a tree where subtree sizes decrease by half at each light edge). Each chain query is O(log n) on the segment tree.

- **Space -- O(n):** The decomposition stores O(n) metadata (chain heads, positions, depths) and the segment tree uses O(n) space.

## When to Use

- **Path queries on trees:** When you need to compute aggregate values (sum, max, min) along the path between any two nodes.
- **Path updates on trees:** Updating all nodes or edges along a path between two nodes.
- **When combined with segment trees:** HLD maps tree paths to array ranges, enabling the full power of segment trees on trees.
- **Competitive programming:** Many advanced tree problems are solved with HLD + segment tree.

## When NOT to Use

- **Simple tree queries:** If you only need LCA queries, a sparse table with Euler tour is simpler and faster.
- **Subtree queries only:** Euler tour + segment tree handles subtree queries without the complexity of HLD.
- **When O(log^2 n) is too slow:** Link-Cut Trees offer O(log n) amortized per path operation but are significantly more complex.
- **Static trees with offline queries:** Offline algorithms may provide simpler solutions.

## Comparison with Similar Algorithms

| Algorithm             | Query Time  | Update Time | Space | Notes                                    |
|----------------------|------------|-------------|-------|------------------------------------------|
| HLD + Segment Tree    | O(log^2 n) | O(log^2 n)  | O(n)  | Path queries/updates on trees             |
| Link-Cut Tree         | O(log n)*  | O(log n)*   | O(n)  | Amortized; supports tree structure changes|
| Euler Tour + Seg Tree | O(log n)   | O(log n)    | O(n)  | Subtree queries only; not path queries     |
| Centroid Decomposition| O(log n)   | O(log n)    | O(n)  | Different query types; offline-friendly    |

## Implementations

| Language | File |
|----------|------|
| C++      | [HeavyLightDecomposition.cpp](cpp/HeavyLightDecomposition.cpp) |

## References

- Sleator, D. D., & Tarjan, R. E. (1983). A data structure for dynamic trees. *Journal of Computer and System Sciences*, 26(3), 362-391.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Heavy-Light Decomposition -- Wikipedia](https://en.wikipedia.org/wiki/Heavy_path_decomposition)
