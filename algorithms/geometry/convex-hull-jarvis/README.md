# Convex Hull - Jarvis March (Gift Wrapping)

## Overview

Jarvis March, also known as the Gift Wrapping algorithm, finds the convex hull of a set of points by simulating the process of wrapping a piece of string around the point set. Starting from a point guaranteed to be on the hull (the leftmost point), the algorithm repeatedly selects the most counterclockwise point relative to the current direction, wrapping around until it returns to the starting point.

The algorithm has output-sensitive time complexity O(nh), where h is the number of hull vertices. This makes it especially efficient when the number of hull points is small relative to the total number of points.

## How It Works

1. **Find the starting point:** Select the leftmost point (lowest x-coordinate, breaking ties by lowest y-coordinate). This point is guaranteed to be on the hull.
2. **Initialize:** Set the current point to the starting point.
3. **Wrapping step:** From the current point, consider all other points. Select the point that makes the smallest counterclockwise angle (i.e., the point such that all other points lie to the left of the line from the current point to the candidate).
4. **Advance:** Move to the selected point and repeat step 3.
5. **Terminate:** Stop when the algorithm returns to the starting point.

The "most counterclockwise" test is performed using the cross product: for three points A, B, C, the cross product of vectors AB and AC determines whether C is to the left (positive), right (negative), or collinear (zero) with respect to the line from A to B.

## Worked Example

**Input points:** (0,0), (4,0), (4,4), (0,4), (2,2), (1,3)

**Step 1:** Find leftmost point: (0,0)

**Wrapping steps:**

| Current Point | Candidate Scan | Selected (Most CCW) | Reason |
|---------------|---------------|---------------------|--------|
| (0,0) | All points | (4,0) | All other points are left of line (0,0)->(4,0) |
| (4,0) | All points | (4,4) | All other points are left of line (4,0)->(4,4) |
| (4,4) | All points | (0,4) | All other points are left of line (4,4)->(0,4) |
| (0,4) | All points | (0,0) | All other points are left of line (0,4)->(0,0) |

**Result:** Hull = {(0,0), (4,0), (4,4), (0,4)}, h = 4 vertices. Points (2,2) and (1,3) are interior.

## Pseudocode

```
function orientation(p, q, r):
    val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
    if val == 0: return COLLINEAR
    if val > 0:  return CLOCKWISE
    return COUNTERCLOCKWISE

function jarvisMarch(points):
    n = length(points)
    if n < 3:
        return n

    // Find the leftmost point
    start = index of point with minimum x (then minimum y)
    hull = []
    current = start

    do:
        hull.append(points[current])
        candidate = (current + 1) % n

        for i from 0 to n - 1:
            if orientation(points[current], points[i], points[candidate]) == COUNTERCLOCKWISE:
                candidate = i

        current = candidate
    while current != start

    return length(hull)
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(nh)  | O(h)  |
| Average | O(nh)  | O(h)  |
| Worst   | O(n^2) | O(n)  |

Where h is the number of points on the convex hull.

- **Time -- O(nh):** Each of the h wrapping steps scans all n points to find the most counterclockwise candidate. In the worst case (all points on the hull), h = n, giving O(n^2).
- **Space -- O(h):** Only the hull vertices need to be stored.

## When to Use

- **Few hull points expected:** When h << n, Jarvis march runs much faster than O(n log n) algorithms.
- **Simple implementation needed:** The algorithm is straightforward to implement and debug.
- **Streaming or online contexts:** The algorithm processes one hull edge at a time, which can be useful when you can stop early (e.g., you only need part of the hull).
- **Computer graphics clipping:** Finding visible polygon edges.
- **Collision detection:** Computing hull boundaries of small clusters.

## When NOT to Use

- **Many points on the hull:** When h is close to n, the O(nh) = O(n^2) time is much worse than the O(n log n) achievable by algorithms like Graham scan or Andrew's monotone chain.
- **Performance-critical applications with unknown h:** If you cannot predict h in advance, an O(n log n) algorithm provides a safer worst-case guarantee.
- **Repeated computation on changing sets:** The algorithm does not benefit from preprocessing; each invocation starts from scratch.
- **High-dimensional data:** Gift wrapping generalizes to higher dimensions but becomes impractical due to the exponential growth of faces.

## Comparison

| Algorithm | Time | Output-Sensitive? | Notes |
|-----------|------|-------------------|-------|
| Jarvis March (Gift Wrapping) | O(nh) | Yes | Best when h is very small |
| Graham Scan | O(n log n) | No | Reliable worst case, angular sort |
| Andrew's Monotone Chain | O(n log n) | No | Practical and simple |
| Quickhull | O(n log n) avg, O(n^2) worst | No | Often fastest in practice |
| Chan's Algorithm | O(n log h) | Yes | Theoretically optimal, combines Jarvis + Graham |

Jarvis march is the simplest output-sensitive hull algorithm. Chan's algorithm improves upon it by combining Jarvis march with Graham scan to achieve O(n log h), which is optimal. For most practical purposes, Andrew's monotone chain or Graham scan are preferred unless h is known to be very small (e.g., O(log n) or constant).

## Implementations

| Language   | File |
|------------|------|
| Python     | [convex_hull_jarvis.py](python/convex_hull_jarvis.py) |
| Java       | [ConvexHullJarvis.java](java/ConvexHullJarvis.java) |
| C++        | [convex_hull_jarvis.cpp](cpp/convex_hull_jarvis.cpp) |
| C          | [convex_hull_jarvis.c](c/convex_hull_jarvis.c) |
| Go         | [convex_hull_jarvis.go](go/convex_hull_jarvis.go) |
| TypeScript | [convexHullJarvis.ts](typescript/convexHullJarvis.ts) |
| Rust       | [convex_hull_jarvis.rs](rust/convex_hull_jarvis.rs) |
| Kotlin     | [ConvexHullJarvis.kt](kotlin/ConvexHullJarvis.kt) |
| Swift      | [ConvexHullJarvis.swift](swift/ConvexHullJarvis.swift) |
| Scala      | [ConvexHullJarvis.scala](scala/ConvexHullJarvis.scala) |
| C#         | [ConvexHullJarvis.cs](csharp/ConvexHullJarvis.cs) |

## References

- Jarvis, R. A. (1973). "On the identification of the convex hull of a finite set of points in the plane." *Information Processing Letters*, 2(1), 18-21.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 33: Computational Geometry.
- Preparata, F. P., & Shamos, M. I. (1985). *Computational Geometry: An Introduction*. Springer-Verlag. Chapter 3.
- [Gift wrapping algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Gift_wrapping_algorithm)
