# Line Segment Intersection

## Overview

The Line Segment Intersection algorithm determines whether two line segments in the plane intersect. It uses the concept of orientation of ordered triplets of points to efficiently decide intersection without computing the actual intersection point. This is a fundamental primitive in computational geometry, serving as a building block for more complex algorithms such as polygon clipping, sweep line algorithms, and map overlay operations.

The algorithm handles both the general case (segments cross each other) and special collinear cases (segments overlap or touch at endpoints).

## How It Works

The algorithm relies on the **orientation test** for three ordered points (p, q, r):

- **Counterclockwise (CCW):** The points make a left turn.
- **Clockwise (CW):** The points make a right turn.
- **Collinear:** The points are on the same line.

The orientation is computed using the cross product of vectors (pq) and (qr):
`orientation = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)`

Two segments (p1,q1) and (p2,q2) intersect if and only if:

1. **General case:** The orientations of (p1,q1,p2) and (p1,q1,q2) are different AND the orientations of (p2,q2,p1) and (p2,q2,q1) are different. This means each segment straddles the line containing the other.
2. **Collinear special case:** If any triplet is collinear, check whether the corresponding endpoint lies on the other segment (using a bounding-box containment test).

## Worked Example

**Example 1 -- Intersecting segments:**

Segment A: (1,1) to (4,4), Segment B: (1,4) to (4,1)

| Triplet | Orientation | Value |
|---------|-------------|-------|
| (1,1), (4,4), (1,4) | Counterclockwise | positive |
| (1,1), (4,4), (4,1) | Clockwise | negative |
| (1,4), (4,1), (1,1) | Clockwise | negative |
| (1,4), (4,1), (4,4) | Counterclockwise | positive |

Orientations differ in both pairs: (CCW != CW) and (CW != CCW). Result: **segments intersect**.

**Example 2 -- Non-intersecting segments:**

Segment A: (1,1) to (2,2), Segment B: (3,3) to (4,4)

| Triplet | Orientation | Value |
|---------|-------------|-------|
| (1,1), (2,2), (3,3) | Collinear | 0 |
| (1,1), (2,2), (4,4) | Collinear | 0 |

All triplets are collinear. Check if any endpoint of one segment lies on the other: (3,3) is not between (1,1) and (2,2), and (1,1) is not between (3,3) and (4,4). Result: **segments do not intersect**.

**Example 3 -- Collinear overlapping segments:**

Segment A: (1,1) to (3,3), Segment B: (2,2) to (4,4)

All triplets are collinear. Point (2,2) lies on segment A (between (1,1) and (3,3)). Result: **segments intersect**.

## Pseudocode

```
function orientation(p, q, r):
    val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
    if val == 0: return COLLINEAR
    if val > 0:  return CLOCKWISE
    return COUNTERCLOCKWISE

function onSegment(p, q, r):
    // Check if q lies on segment pr (given p, q, r are collinear)
    if q.x <= max(p.x, r.x) and q.x >= min(p.x, r.x) and
       q.y <= max(p.y, r.y) and q.y >= min(p.y, r.y):
        return true
    return false

function doIntersect(p1, q1, p2, q2):
    o1 = orientation(p1, q1, p2)
    o2 = orientation(p1, q1, q2)
    o3 = orientation(p2, q2, p1)
    o4 = orientation(p2, q2, q1)

    // General case
    if o1 != o2 and o3 != o4:
        return true

    // Collinear special cases
    if o1 == COLLINEAR and onSegment(p1, p2, q1): return true
    if o2 == COLLINEAR and onSegment(p1, q2, q1): return true
    if o3 == COLLINEAR and onSegment(p2, p1, q2): return true
    if o4 == COLLINEAR and onSegment(p2, q1, q2): return true

    return false
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

- **Time -- O(1):** The algorithm performs a fixed number of arithmetic operations (cross products and comparisons) regardless of input. There is no dependence on any variable size.
- **Space -- O(1):** Only a constant number of variables are needed.

Note: When testing intersections among n segments (the segment intersection problem), the per-pair test is O(1), but a naive all-pairs check is O(n^2). The Bentley-Ottmann sweep line algorithm finds all k intersections among n segments in O((n + k) log n) time.

## When to Use

- **Collision detection in games and simulations:** Determining if moving objects (represented by line segments or edges) collide.
- **Computer graphics rendering:** Line clipping against viewport boundaries, polygon fill algorithms.
- **Geographic information systems:** Map overlay, determining if roads cross rivers, boundary intersections.
- **Computational geometry algorithms:** Building block for polygon intersection, triangulation, and Voronoi diagrams.
- **Robotics:** Path planning to check if a planned movement crosses an obstacle edge.

## When NOT to Use

- **Need the intersection point coordinates:** This algorithm only returns a boolean (intersect or not). To find the actual intersection point, you need to solve the parametric line equations.
- **Many-segment intersection problems:** For detecting all intersections among n segments, use the Bentley-Ottmann sweep line algorithm rather than checking all O(n^2) pairs.
- **Curved paths or arcs:** The orientation-based approach applies only to straight line segments. For curves, numerical or parametric methods are needed.
- **Floating-point precision concerns:** The cross product computation can suffer from numerical errors near collinear or near-touching configurations. Use exact arithmetic or epsilon-based comparisons for robust implementations.

## Comparison

| Method | Time per Test | Finds Point? | Handles Collinear? | Notes |
|--------|--------------|-------------|-------------------|-------|
| Orientation-based (this) | O(1) | No | Yes | Standard approach, robust with special-case handling |
| Parametric equations | O(1) | Yes | With care | Solves for t,u parameters; returns intersection coordinates |
| Cross product only | O(1) | No | No | Simpler but misses collinear overlaps |
| Bentley-Ottmann (n segments) | O((n+k) log n) total | Yes | Yes | Sweep line for batch processing |

The orientation-based approach is the standard choice for a boolean intersection test. If the intersection coordinates are needed, the parametric approach is better. For batch processing of many segments, the Bentley-Ottmann sweep line algorithm is far more efficient than pairwise testing.

## Implementations

| Language   | File |
|------------|------|
| Python     | [line_intersection.py](python/line_intersection.py) |
| Java       | [LineIntersection.java](java/LineIntersection.java) |
| C++        | [line_intersection.cpp](cpp/line_intersection.cpp) |
| C          | [line_intersection.c](c/line_intersection.c) |
| Go         | [line_intersection.go](go/line_intersection.go) |
| TypeScript | [lineIntersection.ts](typescript/lineIntersection.ts) |
| Rust       | [line_intersection.rs](rust/line_intersection.rs) |
| Kotlin     | [LineIntersection.kt](kotlin/LineIntersection.kt) |
| Swift      | [LineIntersection.swift](swift/LineIntersection.swift) |
| Scala      | [LineIntersection.scala](scala/LineIntersection.scala) |
| C#         | [LineIntersection.cs](csharp/LineIntersection.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 33.1: Line-segment properties.
- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3rd ed.). Springer. Chapter 2: Line Segment Intersection.
- O'Rourke, J. (1998). *Computational Geometry in C* (2nd ed.). Cambridge University Press. Chapter 1.
- [Line-line intersection -- Wikipedia](https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection)
