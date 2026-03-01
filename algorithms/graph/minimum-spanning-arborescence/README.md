# Minimum Spanning Arborescence (Edmonds/Chu-Liu)

## Overview

The Edmonds/Chu-Liu algorithm finds the minimum cost rooted spanning tree (arborescence) of a directed graph. An arborescence is a directed tree rooted at a specified vertex where every other vertex is reachable from the root. Unlike undirected MST algorithms (Kruskal's, Prim's), this algorithm handles directed edges where the cost of reaching a vertex depends on which direction you approach from.

## How It Works

1. For each non-root vertex, select the minimum weight incoming edge.
2. If these edges form no cycle, they constitute the optimal arborescence.
3. If cycles exist, contract each cycle into a single supernode, adjusting edge weights to account for the edge replaced within the cycle.
4. Recursively solve the contracted graph.
5. Expand the solution back to the original graph by breaking each cycle at the appropriate edge.

Input format: [n, m, root, u1, v1, w1, u2, v2, w2, ...]. Output: total weight of the minimum spanning arborescence.

## Worked Example

```
Directed graph with 4 vertices, root = 0:
    0 --(1)--> 1
    0 --(5)--> 2
    1 --(2)--> 2
    2 --(3)--> 3
    1 --(6)--> 3
    3 --(4)--> 1
```

**Step 1: Select minimum incoming edges for non-root vertices:**
- Vertex 1: min incoming = edge 0->1 (weight 1) vs 3->1 (weight 4). Choose 0->1 (weight 1).
- Vertex 2: min incoming = edge 0->2 (weight 5) vs 1->2 (weight 2). Choose 1->2 (weight 2).
- Vertex 3: min incoming = edge 2->3 (weight 3) vs 1->3 (weight 6). Choose 2->3 (weight 3).

**Step 2: Check for cycles.**
Selected edges: 0->1, 1->2, 2->3. No cycle formed.

**Result: Arborescence weight = 1 + 2 + 3 = 6.**

The arborescence is: 0 -> 1 -> 2 -> 3.

Now consider a case with a cycle: if we added edge 3->2 (weight 1), vertex 2 would prefer 3->2 (weight 1) over 1->2 (weight 2). Selected edges: 0->1, 3->2, 2->3 form a cycle {2, 3}. The algorithm would contract this cycle, solve the smaller graph, and expand back.

## Pseudocode

```
function edmondsArborescence(edges, root, n):
    while true:
        // Step 1: For each non-root vertex, find minimum incoming edge
        minIn = array of size n, all INF
        minEdge = array of size n, all null
        for each edge (u, v, w) in edges:
            if v != root and w < minIn[v]:
                minIn[v] = w
                minEdge[v] = (u, v, w)

        if any non-root vertex has no incoming edge:
            return -1   // no arborescence exists

        // Step 2: Check for cycles in selected edges
        cycle = findCycle(minEdge, root, n)

        if cycle is empty:
            // No cycle: sum of min incoming edges is the answer
            return sum of minIn[v] for all v != root

        // Step 3: Contract cycle into supernode
        // Adjust edge weights: for edge (u, v, w) entering cycle node v,
        //   new weight = w - minIn[v]
        contractedEdges, mapping = contract(edges, cycle, minIn)
        newN = n - |cycle| + 1
        cycleWeight = sum of minIn[v] for v in cycle

        result = edmondsArborescence(contractedEdges, root, newN)
        return result + cycleWeight
```

## Complexity Analysis

| Case    | Time   | Space    |
|---------|--------|----------|
| Best    | O(EV)  | O(V + E) |
| Average | O(EV)  | O(V + E) |
| Worst   | O(EV)  | O(V + E) |

Each contraction step reduces the number of vertices by at least 1, so there are at most V contractions. Each step processes all edges in O(E) time. With more advanced data structures (Fibonacci heap), the algorithm can run in O(E + V log V).

## When to Use

- Finding optimal broadcast trees in directed networks
- Phylogenetic tree reconstruction in biology
- Optimal branching in dependency graphs
- Distributed systems where communication links are asymmetric
- Minimum cost routing in directed networks
- Compiler optimization (dominance trees)

## When NOT to Use

- For undirected graphs -- use Kruskal's or Prim's algorithm, which are simpler and more efficient.
- When the graph is not guaranteed to have a spanning arborescence from the root -- check reachability first.
- When you need a Steiner tree (spanning only a subset of vertices) -- different algorithms are required.
- For very dense graphs where E = O(V^2) -- the O(EV) = O(V^3) complexity may be slow; consider the Fibonacci heap variant.

## Comparison

| Algorithm | Time | Graph Type | Notes |
|-----------|------|------------|-------|
| Edmonds/Chu-Liu (this) | O(EV) | Directed, weighted | Handles directed MST; cycle contraction |
| Kruskal's | O(E log E) | Undirected, weighted | Greedy edge selection; Union-Find |
| Prim's | O(E log V) | Undirected, weighted | Grows tree from a vertex; priority queue |
| Edmonds + Fibonacci Heap | O(E + V log V) | Directed, weighted | Faster asymptotically; complex to implement |
| Tarjan's Arborescence | O(E + V log V) | Directed, weighted | Efficient variant using advanced data structures |

## References

- Edmonds, J. (1967). "Optimum Branchings". *Journal of Research of the National Bureau of Standards*. 71B: 233-240.
- Chu, Y. J., & Liu, T. H. (1965). "On the Shortest Arborescence of a Directed Graph". *Scientia Sinica*. 14: 1396-1400.
- [Edmonds' algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Edmonds%27_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [minimum_spanning_arborescence.py](python/minimum_spanning_arborescence.py) |
| Java       | [MinimumSpanningArborescence.java](java/MinimumSpanningArborescence.java) |
| C++        | [minimum_spanning_arborescence.cpp](cpp/minimum_spanning_arborescence.cpp) |
| C          | [minimum_spanning_arborescence.c](c/minimum_spanning_arborescence.c) |
| Go         | [minimum_spanning_arborescence.go](go/minimum_spanning_arborescence.go) |
| TypeScript | [minimumSpanningArborescence.ts](typescript/minimumSpanningArborescence.ts) |
| Rust       | [minimum_spanning_arborescence.rs](rust/minimum_spanning_arborescence.rs) |
| Kotlin     | [MinimumSpanningArborescence.kt](kotlin/MinimumSpanningArborescence.kt) |
| Swift      | [MinimumSpanningArborescence.swift](swift/MinimumSpanningArborescence.swift) |
| Scala      | [MinimumSpanningArborescence.scala](scala/MinimumSpanningArborescence.scala) |
| C#         | [MinimumSpanningArborescence.cs](csharp/MinimumSpanningArborescence.cs) |
