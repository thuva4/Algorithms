# Chromatic Number

## Overview

The chromatic number of a graph is the minimum number of colors needed to properly color it (no two adjacent vertices share a color). This implementation finds the chromatic number by trying k = 1, 2, 3, ... colors and checking if a valid k-coloring exists using backtracking with pruning.

## How It Works

1. For k = 1, 2, 3, ..., attempt to k-color the graph.
2. Use backtracking: assign each vertex a color from 1..k.
3. Before assigning, check no neighbor has the same color.
4. If all vertices colored, k-coloring exists.
5. Return the smallest k that works.

Input format: [n, m, u1, v1, ...]. Output: chromatic number.

## Complexity Analysis

| Case    | Time   | Space    |
|---------|--------|----------|
| Best    | O(k^V) | O(V + E) |
| Average | O(k^V) | O(V + E) |
| Worst   | O(k^V) | O(V + E) |

Where k is the chromatic number. The problem is NP-hard in general.

## Worked Example

Consider a graph with 4 vertices and 5 edges:

```
    0 --- 1
    |   / |
    |  /  |
    | /   |
    2 --- 3
```

Edges: 0-1, 0-2, 1-2, 1-3, 2-3.

**Try k=1:** Assign color 1 to vertex 0. Vertex 1 is adjacent to 0, needs a different color. Fail.

**Try k=2:** Assign color 1 to vertex 0, color 2 to vertex 1. Vertex 2 is adjacent to both 0 (color 1) and 1 (color 2). No color available. Fail.

**Try k=3:**
- Vertex 0: color 1
- Vertex 1: adjacent to 0 (color 1), assign color 2
- Vertex 2: adjacent to 0 (color 1) and 1 (color 2), assign color 3
- Vertex 3: adjacent to 1 (color 2) and 2 (color 3), assign color 1

Valid coloring found. **Chromatic number = 3.**

## Pseudocode

```
function chromaticNumber(graph, n):
    for k = 1 to n:
        if canColor(graph, n, k):
            return k

function canColor(graph, n, k):
    colors = array of size n, initialized to 0
    return backtrack(graph, n, k, colors, 0)

function backtrack(graph, n, k, colors, vertex):
    if vertex == n:
        return true  // all vertices colored

    for c = 1 to k:
        if isSafe(graph, vertex, colors, c):
            colors[vertex] = c
            if backtrack(graph, n, k, colors, vertex + 1):
                return true
            colors[vertex] = 0   // undo

    return false

function isSafe(graph, vertex, colors, c):
    for each neighbor v of vertex:
        if colors[v] == c:
            return false
    return true
```

## When to Use

- **Register allocation**: Assigning CPU registers to variables where interference graphs are typically small
- **Scheduling examinations**: Assigning time slots to exams such that no student has two exams at the same time
- **Frequency assignment**: Allocating radio frequencies to transmitters so adjacent ones do not interfere
- **Small graphs**: When the graph is small enough for exact computation (up to ~20-30 vertices)
- **Proof of concept**: When you need the exact chromatic number, not an approximation

## When NOT to Use

- **Large graphs**: The exponential time complexity makes exact computation infeasible for large graphs; use greedy heuristics or approximation algorithms
- **When an approximation suffices**: Greedy coloring gives a reasonable upper bound in O(V + E) time
- **Planar graphs**: The Four Color Theorem guarantees that 4 colors suffice; use specialized planar graph coloring algorithms
- **Interval graphs or chordal graphs**: These graph classes have polynomial-time optimal coloring algorithms

## Comparison

| Algorithm | Time | Optimal | Graph Class |
|-----------|------|---------|-------------|
| Backtracking (this) | O(k^V) | Yes | General |
| Inclusion-Exclusion | O(2^V * V) | Yes | General |
| Greedy Coloring | O(V + E) | No (heuristic) | General |
| DSatur | O(V^2) | No (heuristic) | General |
| Perfect Elimination (chordal) | O(V + E) | Yes | Chordal graphs |

## References

- Lawler, E. L. (1976). "A Note on the Complexity of the Chromatic Number Problem." Information Processing Letters, 5(3), 66-67.
- [Graph coloring -- Wikipedia](https://en.wikipedia.org/wiki/Graph_coloring)
- Brelaz, D. (1979). "New methods to color the vertices of a graph." Communications of the ACM, 22(4), 251-256.

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
