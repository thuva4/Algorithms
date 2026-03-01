# Tarjan's Strongly Connected Components

## Overview

Tarjan's algorithm finds all strongly connected components (SCCs) in a directed graph in a single pass of depth-first search. A strongly connected component is a maximal set of vertices such that there is a path from each vertex to every other vertex in the set. The algorithm uses a stack and discovery/low-link values to efficiently identify SCCs. Published by Robert Tarjan in 1972, it remains one of the most elegant and widely used algorithms in graph theory.

## How It Works

The algorithm performs a DFS traversal, assigning each vertex a discovery index and a low-link value. The low-link value of a vertex is the smallest discovery index reachable from that vertex through the DFS tree and back edges. Vertices are pushed onto a stack as they are discovered. When the DFS finishes processing a vertex whose low-link value equals its discovery index, all vertices on the stack above it (including itself) form a strongly connected component.

Detailed steps:

1. Initialize a global counter, an empty stack, and arrays for discovery index, low-link value, and on-stack status.
2. For each unvisited vertex v, call DFS(v):
   a. Set disc[v] = low[v] = counter++, push v onto the stack.
   b. For each neighbor w of v:
      - If w is unvisited: recurse DFS(w), then low[v] = min(low[v], low[w]).
      - If w is on the stack: low[v] = min(low[v], disc[w]).
   c. If low[v] == disc[v]: pop vertices from the stack until v is popped; these form an SCC.

## Example

Given input: `[5, 5, 0,1, 1,2, 2,0, 3,4, 4,3]` (5 vertices, 5 edges)

Graph edges: 0->1, 1->2, 2->0, 3->4, 4->3

**DFS Trace:**

| Step | Vertex | disc | low | Stack         | Action                       |
|------|--------|------|-----|---------------|------------------------------|
| 1    | 0      | 0    | 0   | [0]           | Visit 0                     |
| 2    | 1      | 1    | 1   | [0, 1]        | Visit 1 (from 0)            |
| 3    | 2      | 2    | 2   | [0, 1, 2]     | Visit 2 (from 1)            |
| 4    | 2      | 2    | 0   | [0, 1, 2]     | Edge 2->0, 0 on stack: low[2]=min(2,0)=0 |
| 5    | 1      | 1    | 0   | [0, 1, 2]     | Backtrack: low[1]=min(1,0)=0 |
| 6    | 0      | 0    | 0   | [0, 1, 2]     | Backtrack: low[0]=min(0,0)=0 |
| 7    | 0      | 0    | 0   | []            | low[0]==disc[0]: pop SCC {2,1,0} |
| 8    | 3      | 3    | 3   | [3]           | Visit 3                     |
| 9    | 4      | 4    | 4   | [3, 4]        | Visit 4 (from 3)            |
| 10   | 4      | 4    | 3   | [3, 4]        | Edge 4->3, 3 on stack: low[4]=min(4,3)=3 |
| 11   | 3      | 3    | 3   | [3, 4]        | Backtrack: low[3]=min(3,3)=3 |
| 12   | 3      | 3    | 3   | []            | low[3]==disc[3]: pop SCC {4,3} |

SCCs found: {0, 1, 2} and {3, 4} -- Result: **2**

## Pseudocode

```
function tarjanSCC(n, edges):
    disc = array of size n, initialized to -1
    low = array of size n
    on_stack = array of size n, initialized to false
    stack = empty stack
    counter = 0
    scc_count = 0

    function dfs(v):
        disc[v] = low[v] = counter++
        stack.push(v)
        on_stack[v] = true

        for each neighbor w of v:
            if disc[w] == -1:       // w not yet visited
                dfs(w)
                low[v] = min(low[v], low[w])
            else if on_stack[w]:    // w is on the stack (in current SCC path)
                low[v] = min(low[v], disc[w])

        // If v is a root of an SCC
        if low[v] == disc[v]:
            scc_count++
            while true:
                u = stack.pop()
                on_stack[u] = false
                if u == v: break

    for v from 0 to n - 1:
        if disc[v] == -1:
            dfs(v)

    return scc_count
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(V + E) | O(V)  |
| Average | O(V + E) | O(V)  |
| Worst   | O(V + E) | O(V)  |

Each vertex is visited exactly once during DFS, and each edge is examined exactly once, giving O(V + E) time. Each vertex is pushed onto and popped from the stack exactly once. The space is O(V) for the stack, discovery, low-link, and on-stack arrays.

## Applications

- **Detecting cycles in directed graphs:** If the number of SCCs equals the number of vertices, the graph is a DAG (no cycles).
- **Solving 2-SAT problems:** The implication graph's SCC structure determines satisfiability and variable assignments.
- **Computing condensation graphs:** Collapsing each SCC into a single node produces a DAG useful for reachability and dependency analysis.
- **Analyzing dependencies in software modules:** Identifying circular dependencies in build systems, package managers, and import graphs.
- **Compiler optimization:** Detecting loops in control flow graphs for loop optimization passes.

## When NOT to Use

- **Undirected graphs:** For undirected graphs, use connected components (BFS/DFS/Union-Find) or biconnected components (also by Tarjan, but a different algorithm).
- **When only cycle detection is needed:** A simple DFS with back-edge detection is sufficient and simpler to implement.
- **Very large graphs that do not fit in memory:** The recursive DFS may cause stack overflow on extremely deep graphs. An iterative implementation or Kosaraju's algorithm (which uses explicit stacks) may be preferable.
- **Distributed or parallel settings:** Tarjan's algorithm is inherently sequential due to its DFS nature. For parallel SCC computation, consider parallel graph algorithms.

## Comparison

| Algorithm         | Time     | Space    | DFS Passes | Notes                              |
|-------------------|----------|----------|------------|------------------------------------|
| Tarjan's (this)   | O(V + E) | O(V)     | 1          | Most widely used; single DFS pass  |
| Kosaraju's        | O(V + E) | O(V + E) | 2          | Needs transpose graph              |
| Path-based        | O(V + E) | O(V)     | 1          | Two stacks; no low-link values     |
| Forward-backward  | O(V + E) | O(V + E) | varies     | Parallelizable; divide and conquer |

Tarjan's algorithm is generally preferred for its single-pass DFS and minimal space usage. Kosaraju's is simpler conceptually (just two DFS traversals) but requires building the transpose graph. The path-based approach has the same complexity as Tarjan's but uses two explicit stacks instead of low-link values.

## Implementations

| Language   | File |
|------------|------|
| Python     | [tarjans_scc.py](python/tarjans_scc.py) |
| Java       | [TarjansScc.java](java/TarjansScc.java) |
| C++        | [tarjans_scc.cpp](cpp/tarjans_scc.cpp) |
| C          | [tarjans_scc.c](c/tarjans_scc.c) |
| Go         | [tarjans_scc.go](go/tarjans_scc.go) |
| TypeScript | [tarjansScc.ts](typescript/tarjansScc.ts) |
| Rust       | [tarjans_scc.rs](rust/tarjans_scc.rs) |
| Kotlin     | [TarjansScc.kt](kotlin/TarjansScc.kt) |
| Swift      | [TarjansScc.swift](swift/TarjansScc.swift) |
| Scala      | [TarjansScc.scala](scala/TarjansScc.scala) |
| C#         | [TarjansScc.cs](csharp/TarjansScc.cs) |

## References

- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." *SIAM Journal on Computing*. 1(2): 146-160.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22.5: Strongly connected components.
- [Tarjan's strongly connected components algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Tarjan%27s_strongly_connected_components_algorithm)
