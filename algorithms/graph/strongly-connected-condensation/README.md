# Strongly Connected Condensation

## Overview

Strongly Connected Condensation contracts each strongly connected component (SCC) of a directed graph into a single node, producing a directed acyclic graph (DAG). This condensation DAG captures the high-level structure of the original graph and is useful for many applications including dependency analysis and reachability queries. A strongly connected component is a maximal set of vertices where every vertex is reachable from every other vertex in the set.

The condensation is unique for any given directed graph and always produces a DAG, because if two SCCs were mutually reachable, they would be a single SCC by definition.

## How It Works

1. Find all SCCs using Tarjan's or Kosaraju's algorithm.
2. Assign each vertex to its SCC identifier.
3. Create a new DAG where each node represents an SCC and edges connect different SCCs: for each edge (u, v) in the original graph where u and v belong to different SCCs, add an edge from SCC(u) to SCC(v) in the condensation.
4. Remove duplicate edges in the condensation DAG.

The output of this implementation is the number of nodes in the condensation DAG (i.e., the number of SCCs).

## Example

Consider the directed graph with 7 vertices and edges:

```
0 -> 1,  1 -> 2,  2 -> 0    (cycle: SCC A = {0, 1, 2})
3 -> 4,  4 -> 3              (cycle: SCC B = {3, 4})
2 -> 3                        (cross-edge from A to B)
5 -> 6                        (no cycle: SCC C = {5}, SCC D = {6})
5 -> 0                        (cross-edge from C to A)
```

Input: `[7, 8, 0,1, 1,2, 2,0, 3,4, 4,3, 2,3, 5,6, 5,0]`

**SCCs found:**
- SCC 0: {0, 1, 2}
- SCC 1: {3, 4}
- SCC 2: {5}
- SCC 3: {6}

**Condensation DAG:**
```
SCC2 ({5}) ---> SCC0 ({0,1,2}) ---> SCC1 ({3,4})
  |
  +---> SCC3 ({6})
```

Result: **4** (four SCCs, so four nodes in the condensation DAG)

## Pseudocode

```
function condensation(n, edges):
    // Step 1: Find SCCs (using Tarjan's algorithm)
    scc_id = array of size n, initially -1
    scc_count = 0
    tarjan(n, edges, scc_id, scc_count)

    // Step 2: Build condensation DAG
    dag_edges = empty set
    for each edge (u, v) in edges:
        if scc_id[u] != scc_id[v]:
            dag_edges.add( (scc_id[u], scc_id[v]) )

    // The condensation DAG has scc_count nodes and dag_edges edges
    return scc_count
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(V + E) | O(V + E) |
| Average | O(V + E) | O(V + E) |
| Worst   | O(V + E) | O(V + E) |

The complexity is dominated by the SCC-finding algorithm (Tarjan's or Kosaraju's), which runs in O(V + E). Building the condensation DAG requires one additional pass over all edges, also O(E). The space stores the original graph, SCC assignments, and the condensation edges.

## When to Use

- **Reachability queries:** After condensation, reachability between two vertices reduces to reachability between their SCC representatives in the DAG, which is simpler and faster to answer.
- **Dependency analysis:** Understanding the high-level dependency structure of a software system, where cycles within modules are collapsed.
- **2-SAT solving:** The condensation graph is used to determine satisfiability and variable assignments in 2-SAT problems.
- **Minimum vertex/edge additions:** Determining the minimum number of edges to add to make a graph strongly connected requires analyzing the condensation DAG.
- **Topological ordering of components:** The condensation DAG can be topologically sorted, enabling processing in dependency order.

## When NOT to Use

- **Undirected graphs:** SCCs are only defined for directed graphs. For undirected graphs, use connected components or biconnected components instead.
- **When you only need to detect cycles:** If you just need to know whether a cycle exists, a simple DFS with back-edge detection suffices without building the full condensation.
- **When the graph is already a DAG:** If the graph has no cycles, each vertex is its own SCC and the condensation is the graph itself.

## Comparison

| Algorithm         | Time     | Space    | What It Computes                          |
|-------------------|----------|----------|-------------------------------------------|
| Condensation      | O(V + E) | O(V + E) | DAG of SCCs (this algorithm)             |
| Tarjan's SCC      | O(V + E) | O(V)     | SCC membership only                      |
| Kosaraju's SCC    | O(V + E) | O(V + E) | SCC membership (two DFS passes)          |
| Path-based SCC    | O(V + E) | O(V)     | SCC membership (two stacks)              |

Condensation builds on top of any SCC algorithm. The choice of underlying SCC algorithm affects constant factors but not asymptotic complexity.

## Implementations

| Language   | File |
|------------|------|
| Python     | [strongly_connected_condensation.py](python/strongly_connected_condensation.py) |
| Java       | [StronglyConnectedCondensation.java](java/StronglyConnectedCondensation.java) |
| C++        | [strongly_connected_condensation.cpp](cpp/strongly_connected_condensation.cpp) |
| C          | [strongly_connected_condensation.c](c/strongly_connected_condensation.c) |
| Go         | [strongly_connected_condensation.go](go/strongly_connected_condensation.go) |
| TypeScript | [stronglyConnectedCondensation.ts](typescript/stronglyConnectedCondensation.ts) |
| Rust       | [strongly_connected_condensation.rs](rust/strongly_connected_condensation.rs) |
| Kotlin     | [StronglyConnectedCondensation.kt](kotlin/StronglyConnectedCondensation.kt) |
| Swift      | [StronglyConnectedCondensation.swift](swift/StronglyConnectedCondensation.swift) |
| Scala      | [StronglyConnectedCondensation.scala](scala/StronglyConnectedCondensation.scala) |
| C#         | [StronglyConnectedCondensation.cs](csharp/StronglyConnectedCondensation.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22.5: Strongly connected components.
- [Condensation Graph -- Wikipedia](https://en.wikipedia.org/wiki/Condensation_(graph_theory))
- [Strongly Connected Component -- CP-Algorithms](https://cp-algorithms.com/graph/strongly-connected-components.html)
