# Path-Based SCC Algorithm

## Overview

The path-based algorithm for finding Strongly Connected Components uses two explicit stacks instead of Tarjan's low-link values. One stack (S) tracks all vertices in the current DFS path, and another stack (P) tracks potential SCC roots (boundary markers). This approach, developed independently by Dijkstra (1976) and later refined by Gabow (2000), can be easier to understand and implement correctly than Tarjan's low-link bookkeeping, because the boundary information is managed explicitly through the stack structure rather than through integer comparisons.

## How It Works

1. Maintain two stacks: S (all vertices on current path) and P (boundary markers for SCCs).
2. On visiting a vertex v, push it onto both S and P, and record its preorder number.
3. For each successor w of v:
   - If w is unvisited, recurse.
   - If w is already on S (not yet assigned to an SCC), pop P until P's top has preorder <= preorder[w].
4. After processing all successors, if v is the top of P, pop an SCC from S down to v, and pop v from P.

Input format: [n, m, u1, v1, ...]. Output: number of SCCs.

## Example

Consider the directed graph with 5 vertices:

```
Edges: 0->1, 1->2, 2->0, 1->3, 3->4
```

Input: `[5, 5, 0,1, 1,2, 2,0, 1,3, 3,4]`

**Step-by-step traversal:**

| Step | Action            | Stack S         | Stack P     | Preorder |
|------|-------------------|-----------------|-------------|----------|
| 1    | Visit 0           | [0]             | [0]         | 0:0      |
| 2    | Visit 1           | [0, 1]          | [0, 1]      | 1:1      |
| 3    | Visit 2           | [0, 1, 2]       | [0, 1, 2]   | 2:2      |
| 4    | Edge 2->0, 0 on S | [0, 1, 2]       | [0]         | Pop P until preorder <= 0 |
| 5    | Backtrack to 1    | [0, 1, 2]       | [0]         | 1 != top(P), not a root |
| 6    | Visit 3           | [0, 1, 2, 3]    | [0, 3]      | 3:3      |
| 7    | Visit 4           | [0, 1, 2, 3, 4] | [0, 3, 4]   | 4:4      |
| 8    | 4 done, 4 == top(P)| Pop SCC {4}     | [0, 3]      | SCC found |
| 9    | 3 done, 3 == top(P)| Pop SCC {3}     | [0]         | SCC found |
| 10   | 0 done, 0 == top(P)| Pop SCC {0,1,2} | []          | SCC found |

**SCCs found:** {4}, {3}, {0, 1, 2} -- Result: **3**

## Pseudocode

```
function pathBasedSCC(n, edges):
    preorder = array of size n, initialized to -1
    on_stack = array of size n, initialized to false
    S = empty stack      // all vertices in current DFS tree
    P = empty stack      // boundary markers
    counter = 0
    scc_count = 0

    function dfs(v):
        preorder[v] = counter++
        S.push(v)
        P.push(v)
        on_stack[v] = true

        for each neighbor w of v:
            if preorder[w] == -1:
                dfs(w)
            else if on_stack[w]:
                // Pop P until top has preorder <= preorder[w]
                while preorder[P.top()] > preorder[w]:
                    P.pop()

        // If v is the root of an SCC
        if P.top() == v:
            P.pop()
            scc_count++
            // Pop S until we reach v (inclusive)
            while true:
                u = S.pop()
                on_stack[u] = false
                if u == v: break

    for v from 0 to n - 1:
        if preorder[v] == -1:
            dfs(v)

    return scc_count
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

Each vertex is pushed and popped from each stack at most once, giving O(V) total stack operations. Each edge is examined once during DFS, giving O(E) edge processing. The space is O(V) for the two stacks, preorder array, and on-stack flags.

## When to Use

- **When implementation simplicity is valued:** The two-stack approach avoids the subtle low-link bookkeeping of Tarjan's algorithm, making it easier to implement correctly.
- **Teaching and learning:** The explicit stacks make the algorithm's behavior more transparent and easier to trace through examples.
- **When you need SCCs in any directed graph:** Like Tarjan's algorithm, this works for all directed graphs and finds all SCCs in a single DFS pass.
- **Competitive programming:** Some programmers find this variant easier to code without bugs under time pressure.

## When NOT to Use

- **Undirected graphs:** SCCs are only meaningful for directed graphs. For undirected graphs, use standard connected components (BFS/DFS/Union-Find).
- **When you also need low-link values:** If downstream algorithms require low-link information (e.g., for finding bridges or articulation points in related problems), Tarjan's original algorithm provides this directly.
- **When constant factors matter:** The two-stack approach uses slightly more memory per vertex than Tarjan's algorithm, though both are O(V).

## Comparison

| Algorithm         | Time     | Space | DFS Passes | Key Data Structure          |
|-------------------|----------|-------|------------|-----------------------------|
| Path-based (this) | O(V + E) | O(V)  | 1          | Two explicit stacks         |
| Tarjan's          | O(V + E) | O(V)  | 1          | Stack + low-link values     |
| Kosaraju's        | O(V + E) | O(V + E) | 2       | Stack + reversed graph      |

All three algorithms have the same asymptotic time complexity. Tarjan's and path-based both use a single DFS pass, while Kosaraju's requires two passes and the transpose graph. The path-based approach trades low-link bookkeeping for an extra stack.

## Implementations

| Language   | File |
|------------|------|
| Python     | [strongly_connected_path_based.py](python/strongly_connected_path_based.py) |
| Java       | [StronglyConnectedPathBased.java](java/StronglyConnectedPathBased.java) |
| C++        | [strongly_connected_path_based.cpp](cpp/strongly_connected_path_based.cpp) |
| C          | [strongly_connected_path_based.c](c/strongly_connected_path_based.c) |
| Go         | [strongly_connected_path_based.go](go/strongly_connected_path_based.go) |
| TypeScript | [stronglyConnectedPathBased.ts](typescript/stronglyConnectedPathBased.ts) |
| Rust       | [strongly_connected_path_based.rs](rust/strongly_connected_path_based.rs) |
| Kotlin     | [StronglyConnectedPathBased.kt](kotlin/StronglyConnectedPathBased.kt) |
| Swift      | [StronglyConnectedPathBased.swift](swift/StronglyConnectedPathBased.swift) |
| Scala      | [StronglyConnectedPathBased.scala](scala/StronglyConnectedPathBased.scala) |
| C#         | [StronglyConnectedPathBased.cs](csharp/StronglyConnectedPathBased.cs) |

## References

- Dijkstra, E. W. (1976). *A Discipline of Programming*. Prentice-Hall.
- Gabow, H. N. (2000). "Path-based depth-first search for strong and biconnected components". *Information Processing Letters*. 74(3-4): 107-114.
- [Path-based strong component algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Path-based_strong_component_algorithm)
