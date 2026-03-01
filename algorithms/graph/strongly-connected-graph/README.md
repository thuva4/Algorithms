# Strongly Connected Components

## Overview

A Strongly Connected Component (SCC) of a directed graph is a maximal set of vertices such that there is a directed path from every vertex in the set to every other vertex in the set. Finding all SCCs partitions the vertices of a directed graph into groups where every vertex in each group can reach every other vertex in the same group. This decomposition reveals the fundamental structure of directed graphs and is used in compiler optimization, social network analysis, and model checking.

Two classic algorithms find SCCs in O(V+E) time: Kosaraju's Algorithm (two-pass DFS) and Tarjan's Algorithm (single-pass DFS with a stack). Both exploit the deep connection between SCCs and the structure of the DFS tree.

## How It Works

**Tarjan's Algorithm** (implemented in this repository) performs a single DFS, maintaining a stack of vertices and tracking two values for each vertex: the discovery time and the lowest reachable discovery time (low-link value). A vertex is the root of an SCC if its low-link value equals its discovery time. When such a root is found, all vertices above it on the stack form an SCC.

**Kosaraju's Algorithm** performs two DFS passes: the first on the original graph to compute finish times, and the second on the transposed graph in reverse finish order to identify SCCs.

### Example

Consider the following directed graph:

```
    A -----> B -----> E -----> F
    ^        |        ^        |
    |        |        |        |
    |        v        |        v
    D <----- C        H <----- G

    Also: E --> F, F --> G, G --> H, H --> E
```

Adjacency list:
```
A: [B]
B: [C, E]
C: [D]
D: [A]
E: [F]
F: [G]
G: [H]
H: [E]
```

**Tarjan's Algorithm:**

DFS from `A`:

| Step | Visit | Discovery/Low | Stack | Action |
|------|-------|--------------|-------|--------|
| 1 | A | disc=0, low=0 | [A] | DFS to B |
| 2 | B | disc=1, low=1 | [A,B] | DFS to C |
| 3 | C | disc=2, low=2 | [A,B,C] | DFS to D |
| 4 | D | disc=3, low=3 | [A,B,C,D] | D->A: A on stack, low[D]=min(3,0)=0 |
| 5 | D done | low=0 | [A,B,C,D] | Backtrack, low[C]=min(2,0)=0 |
| 6 | C done | low=0 | [A,B,C,D] | Backtrack, low[B]=min(1,0)=0 |
| 7 | B | -- | [A,B,C,D] | DFS to E |
| 8 | E | disc=4, low=4 | [A,B,C,D,E] | DFS to F |
| 9 | F | disc=5, low=5 | [A,B,C,D,E,F] | DFS to G |
| 10 | G | disc=6, low=6 | [A,B,C,D,E,F,G] | DFS to H |
| 11 | H | disc=7, low=7 | [A,B,C,D,E,F,G,H] | H->E: E on stack, low[H]=min(7,4)=4 |
| 12 | H done | low=4 | Pop nothing (low!=disc) | low[G]=min(6,4)=4 |
| 13 | G done | low=4 | ... | low[F]=min(5,4)=4 |
| 14 | F done | low=4 | ... | low[E]=min(4,4)=4 |
| 15 | E done | low=4, disc=4 | Pop E,F,G,H | **SCC: {E, F, G, H}** |
| 16 | B done | low=0 | Backtrack | low[A]=min(0,0)=0 |
| 17 | A done | low=0, disc=0 | Pop A,B,C,D | **SCC: {A, B, C, D}** |

Result: Two SCCs: `{A, B, C, D}` and `{E, F, G, H}`

## Pseudocode

```
// Tarjan's Algorithm
function tarjanSCC(graph, V):
    disc = array of size V, initialized to -1
    low = array of size V, initialized to -1
    onStack = array of size V, initialized to false
    stack = empty stack
    timer = 0
    sccs = empty list

    for each vertex v in graph:
        if disc[v] == -1:
            dfs(v, graph, disc, low, onStack, stack, timer, sccs)

    return sccs

function dfs(u, graph, disc, low, onStack, stack, timer, sccs):
    disc[u] = low[u] = timer++
    stack.push(u)
    onStack[u] = true

    for each neighbor v of u:
        if disc[v] == -1:
            dfs(v, graph, disc, low, onStack, stack, timer, sccs)
            low[u] = min(low[u], low[v])
        else if onStack[v]:
            low[u] = min(low[u], disc[v])

    // If u is a root of an SCC
    if low[u] == disc[u]:
        scc = empty list
        while true:
            v = stack.pop()
            onStack[v] = false
            scc.add(v)
            if v == u:
                break
        sccs.add(scc)
```

The low-link value tracks the earliest discovered vertex reachable from the subtree rooted at each vertex. When a vertex's low-link equals its discovery time, it is the root of an SCC.

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(V+E) | O(V)  |
| Average | O(V+E) | O(V)  |
| Worst   | O(V+E) | O(V)  |

**Why these complexities?**

- **Best Case -- O(V+E):** Tarjan's Algorithm performs a single DFS traversal, visiting each vertex and examining each edge exactly once. This is optimal since every vertex and edge must be examined to determine SCC membership.

- **Average Case -- O(V+E):** The algorithm always performs exactly one DFS traversal. Each vertex is pushed and popped from the stack exactly once. The total work is proportional to the graph size.

- **Worst Case -- O(V+E):** The worst case is the same as the best case. The algorithm processes every vertex and edge exactly once, regardless of the number or size of SCCs.

- **Space -- O(V):** The stack, discovery array, low-link array, and onStack array each require O(V) space. The total space is O(V), not counting the output (which can also be O(V)).

## When to Use

- **Analyzing directed graph structure:** SCC decomposition reveals the fundamental connectivity structure of directed graphs, showing which groups of vertices are mutually reachable.
- **Compiler optimization:** Identifying strongly connected components in call graphs and dependency graphs helps with optimization, dead code elimination, and register allocation.
- **2-SAT problem solving:** The standard algorithm for 2-SAT constructs an implication graph and uses SCC decomposition to determine satisfiability.
- **Social network analysis:** SCCs in follow/friendship graphs reveal tightly knit communities where information flows freely among all members.
- **Model checking:** SCC decomposition is used in verifying temporal logic properties of state-transition systems.

## When NOT to Use

- **Undirected graphs:** In undirected graphs, connected components (not SCCs) are the appropriate concept. Use BFS or DFS with Union-Find instead.
- **When only simple reachability is needed:** If you just need to know if vertex A can reach vertex B, a single BFS or DFS from A suffices.
- **When the graph is known to be a DAG:** A DAG has no cycles, so every vertex is its own SCC. Topological sort is more useful for DAGs.

## Comparison with Similar Algorithms

| Algorithm       | Time    | Space | Passes | Notes                                    |
|-----------------|---------|-------|--------|------------------------------------------|
| Tarjan's        | O(V+E) | O(V)  | 1 DFS  | Single pass; uses low-link values        |
| Kosaraju's      | O(V+E) | O(V)  | 2 DFS  | Two passes; simpler to understand        |
| Path-based SCC  | O(V+E) | O(V)  | 1 DFS  | Uses two stacks instead of low-link      |
| DFS (basic)     | O(V+E) | O(V)  | 1      | Traversal only; does not find SCCs       |

## Implementations

| Language | File |
|----------|------|
| C++      | [Tarjan.cpp](cpp/Tarjan.cpp) |
| C++      | [strongly_connected_graph.cpp](cpp/strongly_connected_graph.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22: Elementary Graph Algorithms (Section 22.5: Strongly Connected Components).
- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms". *SIAM Journal on Computing*. 1(2): 146-160.
- [Strongly Connected Component -- Wikipedia](https://en.wikipedia.org/wiki/Strongly_connected_component)
