# Graph Coloring

## Overview

Graph coloring assigns colors to vertices such that no two adjacent vertices share the same color. The chromatic number is the minimum number of colors needed. This problem is NP-hard in general, but can be solved exactly for small graphs using backtracking or incremental checking.

## How It Works

The algorithm tries to color the graph with k colors, starting from k=1 and incrementing. For each k, it uses backtracking to attempt a valid coloring. The first k that succeeds is the chromatic number.

### Example

Given input: `[3, 3, 0,1, 1,2, 2,0]` (triangle)

A triangle requires 3 colors. Result: 3

## Complexity Analysis

| Case    | Time        | Space |
|---------|-------------|-------|
| Best    | O(V * 2^V)  | O(V)  |
| Average | O(V * 2^V)  | O(V)  |
| Worst   | O(V * 2^V)  | O(V)  |

## Pseudocode

```
function graphColoring(graph, n):
    for k = 1 to n:
        colors = array of size n, initialized to 0
        if tryColor(graph, n, k, colors, 0):
            return k
    return n  // worst case: n colors

function tryColor(graph, n, k, colors, vertex):
    if vertex == n:
        return true

    for c = 1 to k:
        if canAssign(graph, vertex, colors, c):
            colors[vertex] = c
            if tryColor(graph, n, k, colors, vertex + 1):
                return true
            colors[vertex] = 0

    return false

function canAssign(graph, vertex, colors, c):
    for each neighbor v of vertex:
        if colors[v] == c:
            return false
    return true
```

## Applications

- Register allocation in compilers (interference graph coloring)
- Scheduling problems (exam scheduling, meeting scheduling)
- Map coloring (coloring regions so no adjacent regions share a color)
- Frequency assignment in wireless networks (channel allocation)
- Sudoku solving (9-coloring of a constraint graph)

## When NOT to Use

- **Large graphs**: The exponential time makes exact coloring impractical for large graphs; use greedy heuristics (Welsh-Powell, DSatur) instead
- **When an approximation suffices**: Greedy coloring uses at most d+1 colors (d = max degree) in O(V + E) time
- **Planar graphs**: The Four Color Theorem guarantees 4 colors suffice; specialized algorithms exist
- **Interval or chordal graphs**: These special graph classes admit optimal polynomial-time coloring via perfect elimination orderings

## Comparison

| Algorithm | Time | Optimal | Notes |
|-----------|------|---------|-------|
| Backtracking (this) | O(V * 2^V) | Yes | Exact, practical for small graphs |
| Greedy (first-fit) | O(V + E) | No | At most d+1 colors |
| DSatur (saturation degree) | O(V^2) | No | Often near-optimal heuristic |
| Welsh-Powell | O(V^2) | No | Order by degree, greedy assign |
| Inclusion-Exclusion | O(2^V * V) | Yes | Faster exact method |

## References

- Brelaz, D. (1979). "New methods to color the vertices of a graph." Communications of the ACM, 22(4), 251-256.
- [Graph coloring -- Wikipedia](https://en.wikipedia.org/wiki/Graph_coloring)
- Lawler, E. L. (1976). "A Note on the Complexity of the Chromatic Number Problem." Information Processing Letters, 5(3), 66-67.

## Implementations

| Language   | File |
|------------|------|
| Python     | [chromatic_number.py](python/chromatic_number.py) |
| Java       | [ChromaticNumber.java](java/ChromaticNumber.java) |
| C++        | [chromatic_number.cpp](cpp/chromatic_number.cpp) |
| C          | [chromatic_number.c](c/chromatic_number.c) |
| Go         | [chromatic_number.go](go/chromatic_number.go) |
| TypeScript | [chromaticNumber.ts](typescript/chromaticNumber.ts) |
| Rust       | [chromatic_number.rs](rust/chromatic_number.rs) |
| Kotlin     | [ChromaticNumber.kt](kotlin/ChromaticNumber.kt) |
| Swift      | [ChromaticNumber.swift](swift/ChromaticNumber.swift) |
| Scala      | [ChromaticNumber.scala](scala/ChromaticNumber.scala) |
| C#         | [ChromaticNumber.cs](csharp/ChromaticNumber.cs) |
