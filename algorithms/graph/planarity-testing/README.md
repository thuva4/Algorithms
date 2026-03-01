# Planarity Testing (Euler's Formula)

## Overview

This is a simplified planarity test for simple connected graphs using Euler's formula for planar graphs. A planar graph is one that can be drawn on a plane without any edges crossing. For any simple connected planar graph: E <= 3V - 6 (and E <= 2V - 4 for triangle-free/bipartite graphs). If this necessary condition is violated, the graph is definitely non-planar. This is a one-sided test: passing does not guarantee planarity, but failing guarantees non-planarity.

For a complete test, algorithms like the Boyer-Myrvold or Left-Right planarity test are needed, but this Euler-based check is a practical and efficient first filter.

## How It Works

1. Parse the graph and remove duplicate edges and self-loops (ensure simple graph).
2. Check if the graph has n >= 3 (graphs with fewer than 3 vertices are always planar).
3. Apply the necessary condition: if E > 3V - 6, the graph is not planar.
4. Otherwise, report it as planar (note: this is a necessary but not sufficient condition).

Input format: [n, m, u1, v1, ...]. Output: 1 if planar (passes the test), 0 otherwise.

## Worked Example

**Example 1: Complete graph K4 (planar)**
```
Vertices: 4, Edges: 6
Edges: 0-1, 0-2, 0-3, 1-2, 1-3, 2-3

Check: E = 6, 3V - 6 = 3(4) - 6 = 6
6 <= 6? Yes -> Passes test (K4 is indeed planar)
```

**Example 2: Complete graph K5 (non-planar)**
```
Vertices: 5, Edges: 10
Edges: all pairs among {0, 1, 2, 3, 4}

Check: E = 10, 3V - 6 = 3(5) - 6 = 9
10 <= 9? No -> Fails test (K5 is non-planar by Kuratowski's theorem)
```

**Example 3: Petersen graph (non-planar but passes the test)**
```
Vertices: 10, Edges: 15

Check: E = 15, 3V - 6 = 3(10) - 6 = 24
15 <= 24? Yes -> Passes test
But the Petersen graph is actually non-planar (contains K3,3 subdivision).
This shows the test is necessary but not sufficient.
```

## Pseudocode

```
function isPlanar(n, edges):
    // Remove self-loops and duplicate edges
    edgeSet = empty set
    for each edge (u, v) in edges:
        if u == v: continue
        if u > v: swap(u, v)
        edgeSet.add((u, v))

    E = |edgeSet|

    if n < 3:
        return true     // trivially planar

    if E > 3 * n - 6:
        return false    // violates Euler's formula bound

    return true         // passes necessary condition
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(V + E) | O(V + E) |
| Average | O(V + E) | O(V + E) |
| Worst   | O(V + E) | O(V + E) |

The algorithm processes each edge once to remove duplicates, then performs a constant-time comparison. Linear in the input size.

## When to Use

- As a fast pre-filter before running a full planarity test
- When you need to quickly reject obviously non-planar graphs
- In graph theory courses to illustrate Euler's formula
- In circuit layout tools as a first pass before detailed embedding
- When analyzing graph density relative to planarity bounds

## When NOT to Use

- When you need a definitive planarity test -- this test has false positives (e.g., the Petersen graph passes but is non-planar). Use Boyer-Myrvold or the Left-Right planarity test instead.
- When you need the actual planar embedding -- this test only provides a yes/no answer.
- For disconnected graphs without modification -- the formula applies to connected graphs.
- When precision matters more than speed -- a full O(V) planarity test (Boyer-Myrvold) is still linear time.

## Comparison

| Algorithm | Time | Definitive? | Notes |
|-----------|------|-------------|-------|
| Euler's Formula (this) | O(V + E) | No (necessary only) | Fast filter; rejects dense non-planar graphs |
| Boyer-Myrvold | O(V) | Yes | Full planarity test; produces embedding |
| Left-Right Planarity | O(V) | Yes | Full planarity test; elegant DFS-based |
| Kuratowski Subdivision | O(V^2) or more | Yes | Finds K5 or K3,3 subdivision; mainly theoretical |
| de Fraysseix-Rosenstiehl | O(V) | Yes | Produces straight-line embedding |

## References

- [Planar graph -- Wikipedia](https://en.wikipedia.org/wiki/Planar_graph)
- Euler, L. (1758). "Elementa doctrinae solidorum". *Novi Commentarii academiae scientiarum Petropolitanae*.
- Boyer, J. M., & Myrvold, W. J. (2004). "On the cutting edge: simplified O(n) planarity by edge addition." *Journal of Graph Algorithms and Applications*, 8(3), 241-273.
- Kuratowski, K. (1930). "Sur le probleme des courbes gauches en Topologie." *Fundamenta Mathematicae*, 15(1), 271-283.

## Implementations

| Language   | File |
|------------|------|
| Python     | [planarity_testing.py](python/planarity_testing.py) |
| Java       | [PlanarityTesting.java](java/PlanarityTesting.java) |
| C++        | [planarity_testing.cpp](cpp/planarity_testing.cpp) |
| C          | [planarity_testing.c](c/planarity_testing.c) |
| Go         | [planarity_testing.go](go/planarity_testing.go) |
| TypeScript | [planarityTesting.ts](typescript/planarityTesting.ts) |
| Rust       | [planarity_testing.rs](rust/planarity_testing.rs) |
| Kotlin     | [PlanarityTesting.kt](kotlin/PlanarityTesting.kt) |
| Swift      | [PlanarityTesting.swift](swift/PlanarityTesting.swift) |
| Scala      | [PlanarityTesting.scala](scala/PlanarityTesting.scala) |
| C#         | [PlanarityTesting.cs](csharp/PlanarityTesting.cs) |
