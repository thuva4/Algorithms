# Eulerian Path/Circuit

## Overview

An Eulerian circuit is a cycle that visits every edge exactly once and returns to the starting vertex. An undirected graph has an Eulerian circuit if and only if every vertex has even degree and all vertices with non-zero degree are connected.

## How It Works

1. Check that every vertex has even degree.
2. Check that all vertices with non-zero degree belong to a single connected component (using DFS/BFS).
3. If both conditions hold, an Euler circuit exists.

Input format: `[n, m, u1, v1, u2, v2, ...]` where n = vertices, m = edges, followed by m edge pairs (undirected).

## Complexity Analysis

| Case    | Time      | Space     |
|---------|-----------|-----------|
| Best    | O(V + E)  | O(V + E)  |
| Average | O(V + E)  | O(V + E)  |
| Worst   | O(V + E)  | O(V + E)  |

## Worked Example

Consider a graph with 5 vertices and 6 edges:

```
    0 --- 1
    |   / |
    |  /  |
    | /   |
    2 --- 3
     \   /
      \ /
       4
```

Edges: 0-1, 0-2, 1-2, 1-3, 2-3, 2-4, 3-4 (7 edges). Wait, let us use a simpler example:

```
    0 --- 1 --- 2
    |           |
    3 --------- 4
```

Edges: 0-1, 1-2, 2-4, 4-3, 3-0 (5 edges).

**Check degrees:**
- deg(0) = 2, deg(1) = 2, deg(2) = 2, deg(3) = 2, deg(4) = 2

All degrees are even. All vertices with non-zero degree are connected. An **Euler circuit exists**.

One valid Euler circuit: 0 -> 1 -> 2 -> 4 -> 3 -> 0

**Non-example:** If we add edge 0-2, then deg(0) = 3 and deg(2) = 3 (odd). No Euler circuit exists, but an **Euler path** exists between vertices 0 and 2 (the two odd-degree vertices).

## Pseudocode

```
function hasEulerCircuit(graph, n):
    // Step 1: Check all vertices have even degree
    for i = 0 to n-1:
        if degree(i) is odd:
            return false

    // Step 2: Check connectivity of non-isolated vertices
    start = -1
    for i = 0 to n-1:
        if degree(i) > 0:
            start = i
            break

    if start == -1:
        return true   // no edges, trivially Eulerian

    visited = BFS or DFS from start
    for i = 0 to n-1:
        if degree(i) > 0 AND i not in visited:
            return false   // disconnected non-isolated vertices

    return true

// To find the actual circuit (Hierholzer's algorithm):
function findEulerCircuit(graph, start):
    stack = [start]
    circuit = []

    while stack is not empty:
        u = stack.top()
        if u has unused edges:
            v = next unused neighbor of u
            mark edge (u,v) as used
            stack.push(v)
        else:
            stack.pop()
            circuit.append(u)

    return reverse(circuit)
```

## Applications

- Chinese Postman Problem (finding minimum-weight closed walk covering all edges)
- DNA fragment assembly (de Bruijn graphs in bioinformatics)
- Circuit design (single-stroke drawing of circuit traces)
- Network routing (traversing all links exactly once)
- Snow plow routing (ensuring every street is plowed exactly once)

## When NOT to Use

- **Visiting all vertices (not edges)**: If you need to visit every vertex exactly once, that is the Hamiltonian path problem, which is NP-complete
- **Directed graphs with mixed connectivity**: For directed Eulerian circuits, every vertex must have equal in-degree and out-degree; the undirected algorithm does not apply
- **Weighted optimization**: If you need the minimum-cost traversal of all edges, use the Chinese Postman algorithm which handles non-Eulerian graphs
- **Graphs with very few edges**: For sparse graphs, the existence check is trivial but the circuit itself may not be useful

## Comparison

| Problem | Condition | Time | NP-hard? |
|---------|-----------|------|----------|
| Euler Circuit (undirected) | All even degree + connected | O(V + E) | No |
| Euler Path (undirected) | Exactly 0 or 2 odd-degree vertices + connected | O(V + E) | No |
| Euler Circuit (directed) | All in-degree = out-degree + strongly connected | O(V + E) | No |
| Hamiltonian Circuit | Visit all vertices once | O(2^V * V) best known | Yes |
| Chinese Postman | Traverse all edges, minimize cost | O(V^3) | No |

## References

- Euler, L. (1741). "Solutio problematis ad geometriam situs pertinentis." Commentarii academiae scientiarum Petropolitanae, 8, 128-140.
- Hierholzer, C. (1873). "Ueber die Moglichkeit, einen Linienzug ohne Wiederholung und ohne Unterbrechung zu umfahren." Mathematische Annalen, 6, 30-32.
- [Eulerian path -- Wikipedia](https://en.wikipedia.org/wiki/Eulerian_path)

## Implementations

| Language   | File |
|------------|------|
| Python     | [euler_path.py](python/euler_path.py) |
| Java       | [EulerPath.java](java/EulerPath.java) |
| C++        | [euler_path.cpp](cpp/euler_path.cpp) |
| C          | [euler_path.c](c/euler_path.c) |
| Go         | [euler_path.go](go/euler_path.go) |
| TypeScript | [eulerPath.ts](typescript/eulerPath.ts) |
| Rust       | [euler_path.rs](rust/euler_path.rs) |
| Kotlin     | [EulerPath.kt](kotlin/EulerPath.kt) |
| Swift      | [EulerPath.swift](swift/EulerPath.swift) |
| Scala      | [EulerPath.scala](scala/EulerPath.scala) |
| C#         | [EulerPath.cs](csharp/EulerPath.cs) |
