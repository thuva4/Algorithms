# DP on Trees

## Overview

DP on Trees is a technique for solving optimization problems on tree structures by computing DP values bottom-up from leaves to root (or top-down from root to leaves via rerooting). A common application is finding the maximum path sum in a tree where each node has a value. The technique processes the tree via DFS, computing each node's DP value from its children's values.

The problem solved here: given a tree with N nodes each having an integer value, find the maximum sum obtainable by selecting a connected path starting at some node and going downward through the tree. For each node, we compute the best downward path sum starting at that node, and the global answer is the maximum across all nodes.

## How It Works

1. Root the tree at node 0 (or any arbitrary node).
2. Perform a post-order DFS traversal (process children before parent).
3. For each leaf node, its DP value is simply its own value.
4. For each internal node, its DP value is its own value plus the maximum of 0 and the best child DP value (we can choose not to extend to any child if all children have negative path sums).
5. The answer is the maximum DP value across all nodes.

The recurrence is: `dp[v] = value[v] + max(0, max(dp[child] for child in children[v]))`.

## Worked Example

**Tree structure with node values:**

```
        0 (val=1)
       / \
      1    2
   (val=2) (val=-3)
    / \
   3    4
(val=4) (val=5)
```

Edges: 0-1, 0-2, 1-3, 1-4

**Bottom-up DFS computation:**

| Node | Value | Children DP values | max(0, best child) | dp[node]      |
|------|-------|--------------------|---------------------|---------------|
| 3    | 4     | (leaf)             | 0 (no children)     | 4 + 0 = **4** |
| 4    | 5     | (leaf)             | 0 (no children)     | 5 + 0 = **5** |
| 2    | -3    | (leaf)             | 0 (no children)     | -3 + 0 = **-3** |
| 1    | 2     | dp[3]=4, dp[4]=5   | max(0, max(4,5)) = 5| 2 + 5 = **7** |
| 0    | 1     | dp[1]=7, dp[2]=-3  | max(0, max(7,-3)) = 7| 1 + 7 = **8** |

**Answer:** max(dp[0], dp[1], dp[2], dp[3], dp[4]) = max(8, 7, -3, 4, 5) = **8**

This corresponds to the path 0 -> 1 -> 4 with sum 1 + 2 + 5 = 8.

## Pseudocode

```
function dpOnTrees(tree, values, root):
    dp = array of size N
    answer = -infinity

    function dfs(node, parent):
        dp[node] = values[node]
        bestChild = 0    // 0 means we can choose not to extend

        for child in tree[node]:
            if child != parent:
                dfs(child, node)
                bestChild = max(bestChild, dp[child])

        dp[node] = values[node] + bestChild
        answer = max(answer, dp[node])

    dfs(root, -1)
    return answer
```

## Complexity Analysis

| Case    | Time  | Space |
|---------|-------|-------|
| Best    | O(n)  | O(n)  |
| Average | O(n)  | O(n)  |
| Worst   | O(n)  | O(n)  |

**Why these complexities?**

- **Time -- O(n):** Each node is visited exactly once during DFS. At each node, we iterate over its children, and across the entire tree, the total number of parent-child edge traversals is n-1. Total work is O(n).

- **Space -- O(n):** The DP array stores one value per node. The recursion stack can be O(n) in the worst case (a path graph), but for balanced trees it is O(log n).

## When to Use

- **Tree path problems:** Finding maximum/minimum weight paths, longest paths, or paths satisfying specific constraints in a tree.
- **Subtree aggregation:** Computing sums, counts, or other aggregates over subtrees (e.g., size of each subtree, sum of values in each subtree).
- **Rerooting problems:** When you need to compute a value "as if each node were the root," the rerooting technique builds on basic tree DP.
- **Independent set on trees:** Finding the maximum weight independent set (no two adjacent nodes selected) is a classic tree DP problem.
- **Network design:** Optimizing communication costs or signal routing in tree-structured networks.

## When NOT to Use

- **Graphs with cycles:** Tree DP requires a tree (connected acyclic graph). For general graphs, use graph DP or other techniques.
- **When the graph is not a tree:** If the structure has multiple paths between nodes, tree DP assumptions break down. Use BFS/DFS with visited arrays instead.
- **Problems requiring global information:** Some problems need information about the entire tree that cannot be decomposed into subtree-local computations. Heavy-light decomposition or centroid decomposition may be more appropriate.
- **Extremely deep trees in recursive implementations:** A path graph of length 10^6 will cause stack overflow. Use iterative DFS or increase the stack size.

## Comparison

| Technique             | Time   | Space  | Notes                                       |
|----------------------|--------|--------|---------------------------------------------|
| **Tree DP (DFS)**    | **O(n)** | **O(n)** | **Bottom-up; handles most tree problems**  |
| Rerooting DP          | O(n)   | O(n)   | Two-pass DFS; computes answer for all roots |
| Heavy-Light Decomp.   | O(n log n) per query | O(n) | For path queries on trees with updates |
| Centroid Decomp.      | O(n log n) | O(n) | For distance-related queries on trees      |
| BFS/DFS (no DP)       | O(n)   | O(n)   | For simple traversal without optimization   |

## Implementations

| Language   | File                                        |
|------------|---------------------------------------------|
| Python     | [dp_on_trees.py](python/dp_on_trees.py)     |
| Java       | [DpOnTrees.java](java/DpOnTrees.java)       |
| C++        | [dp_on_trees.cpp](cpp/dp_on_trees.cpp)      |
| C          | [dp_on_trees.c](c/dp_on_trees.c)           |
| Go         | [dp_on_trees.go](go/dp_on_trees.go)        |
| TypeScript | [dpOnTrees.ts](typescript/dpOnTrees.ts)     |
| Rust       | [dp_on_trees.rs](rust/dp_on_trees.rs)      |
| Kotlin     | [DpOnTrees.kt](kotlin/DpOnTrees.kt)        |
| Swift      | [DpOnTrees.swift](swift/DpOnTrees.swift)    |
| Scala      | [DpOnTrees.scala](scala/DpOnTrees.scala)   |
| C#         | [DpOnTrees.cs](csharp/DpOnTrees.cs)        |

## References

- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- [DP on Trees -- Codeforces](https://codeforces.com/blog/entry/20935)
- Laaksonen, A. (2017). *Competitive Programmer's Handbook*. Chapter 14: Tree Algorithms.
- [Tree DP -- USACO Guide](https://usaco.guide/gold/dp-trees)
