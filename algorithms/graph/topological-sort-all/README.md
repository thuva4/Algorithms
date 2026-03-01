# All Topological Orderings

## Overview

This algorithm enumerates all valid topological orderings of a directed acyclic graph (DAG) using backtracking. Unlike standard topological sort which produces one ordering, this counts every possible linear extension of the partial order defined by the DAG. The number of topological orderings is an important measure of the flexibility or ambiguity in a scheduling problem: more orderings mean more scheduling freedom.

## How It Works

1. Compute in-degrees for all vertices.
2. At each step, choose any vertex with in-degree 0 that has not been placed yet.
3. Place it in the ordering, decrease in-degrees of its neighbors.
4. Recurse to place the next vertex.
5. Backtrack: restore in-degrees and try the next available vertex with in-degree 0.
6. Count complete orderings when all vertices are placed.

The algorithm explores all possible choices at each step using backtracking, systematically generating every valid ordering.

Input format: [n, m, u1, v1, ...]. Output: count of distinct topological orderings.

## Example

Consider a DAG with 4 vertices and edges:

```
0 -> 1,  0 -> 2,  1 -> 3,  2 -> 3
```

Input: `[4, 4, 0,1, 0,2, 1,3, 2,3]`

**In-degrees:** vertex 0: 0, vertex 1: 1, vertex 2: 1, vertex 3: 2

**Backtracking tree:**

```
Step 1: Only vertex 0 has in-degree 0. Place 0.
  Update in-degrees: vertex 1: 0, vertex 2: 0, vertex 3: 2

Step 2: Vertices 1 and 2 both have in-degree 0.
  Branch A: Place 1.
    Update: vertex 3: 1
    Step 3: Only vertex 2 has in-degree 0. Place 2.
      Update: vertex 3: 0
      Step 4: Place 3.  --> Ordering: [0, 1, 2, 3]

  Branch B: Place 2.
    Update: vertex 3: 1
    Step 3: Only vertex 1 has in-degree 0. Place 1.
      Update: vertex 3: 0
      Step 4: Place 3.  --> Ordering: [0, 2, 1, 3]
```

Result: **2** distinct topological orderings.

## Pseudocode

```
function countAllTopologicalOrders(n, edges):
    adj = adjacency list from edges
    in_degree = array of size n, computed from edges
    visited = array of size n, initialized to false
    count = 0

    function backtrack(placed):
        if placed == n:
            count++
            return

        for v from 0 to n - 1:
            if not visited[v] and in_degree[v] == 0:
                // Choose v
                visited[v] = true
                for each neighbor w of v:
                    in_degree[w] -= 1

                backtrack(placed + 1)

                // Undo (backtrack)
                visited[v] = false
                for each neighbor w of v:
                    in_degree[w] += 1

    backtrack(0)
    return count
```

## Complexity Analysis

| Case    | Time       | Space    |
|---------|------------|----------|
| Best    | O(V! * V)  | O(V + E) |
| Average | O(V! * V)  | O(V + E) |
| Worst   | O(V! * V)  | O(V + E) |

In the worst case (a graph with no edges), every permutation of V vertices is a valid topological ordering, so there are V! orderings to enumerate. At each step, we scan up to V vertices to find those with in-degree 0, giving O(V) per step and O(V * V!) total. In practice, edges constrain the choices heavily, and the actual number of orderings is typically much smaller than V!.

## When to Use

- **Schedule enumeration:** When you need to know all valid execution orders for a set of tasks with dependencies (e.g., course prerequisites, build systems).
- **Counting linear extensions:** In combinatorics, the number of topological orderings equals the number of linear extensions of the partial order, which is of theoretical interest.
- **Symmetry detection:** Comparing the count of orderings for different DAGs can reveal structural similarities.
- **Small DAGs in competitive programming:** Problems that ask for the count of valid orderings on small graphs (n <= 15-20).
- **Verification and testing:** Generating all valid orderings to verify that a particular ordering is indeed valid.

## When NOT to Use

- **Large graphs:** The factorial blowup makes this impractical for graphs with more than about 20 vertices. For large graphs, count topological orderings using DP over subsets (O(2^n * n)) or use approximation methods.
- **When only one ordering is needed:** Standard Kahn's algorithm or DFS-based topological sort in O(V + E) is far more efficient for finding a single ordering.
- **When an exact count is not needed:** If you only need an estimate of the number of orderings, sampling or approximation techniques are better suited.
- **Graphs with cycles:** Topological ordering is only defined for DAGs. The algorithm will produce zero orderings if the graph contains a cycle.

## Comparison

| Algorithm                    | Time          | Space    | Output                          |
|------------------------------|---------------|----------|---------------------------------|
| All orderings (this)         | O(V! * V)     | O(V + E) | Count of all valid orderings   |
| Kahn's algorithm             | O(V + E)      | O(V + E) | One valid ordering             |
| DFS-based topological sort   | O(V + E)      | O(V + E) | One valid ordering             |
| DP over subsets              | O(2^n * n)    | O(2^n)   | Exact count (no enumeration)   |
| Parallel topological sort    | O(V + E)      | O(V + E) | Layered ordering with rounds   |

For counting orderings on small graphs, this backtracking approach is straightforward. For larger graphs where only the count is needed (not enumeration), the DP-over-subsets approach with bitmask DP is exponential but avoids the factorial factor.

## Implementations

| Language   | File |
|------------|------|
| Python     | [topological_sort_all.py](python/topological_sort_all.py) |
| Java       | [TopologicalSortAll.java](java/TopologicalSortAll.java) |
| C++        | [topological_sort_all.cpp](cpp/topological_sort_all.cpp) |
| C          | [topological_sort_all.c](c/topological_sort_all.c) |
| Go         | [topological_sort_all.go](go/topological_sort_all.go) |
| TypeScript | [topologicalSortAll.ts](typescript/topologicalSortAll.ts) |
| Rust       | [topological_sort_all.rs](rust/topological_sort_all.rs) |
| Kotlin     | [TopologicalSortAll.kt](kotlin/TopologicalSortAll.kt) |
| Swift      | [TopologicalSortAll.swift](swift/TopologicalSortAll.swift) |
| Scala      | [TopologicalSortAll.scala](scala/TopologicalSortAll.scala) |
| C#         | [TopologicalSortAll.cs](csharp/TopologicalSortAll.cs) |

## References

- Knuth, D. E. (2005). *The Art of Computer Programming, Volume 4A: Combinatorial Algorithms, Part 1*. Addison-Wesley. Section 7.2.1.2: Generating all permutations.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 22.4: Topological Sort.
- [Topological sorting -- Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
