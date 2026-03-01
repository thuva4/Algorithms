# Convex Hull

## Overview

The Convex Hull of a set of points is the smallest convex polygon that contains all the points. Intuitively, imagine stretching a rubber band around all the points and letting it snap tight -- the shape it forms is the convex hull.

This implementation uses Andrew's monotone chain algorithm, which builds the hull in two passes (lower and upper) after sorting the points. It is one of the most practical convex hull algorithms due to its simplicity and reliable O(n log n) performance.

## How It Works

Andrew's monotone chain algorithm constructs the convex hull in two halves:

1. **Sort** all points lexicographically by x-coordinate, breaking ties by y-coordinate.
2. **Build the lower hull:** Iterate through the sorted points left to right. For each point, while the last two points in the hull and the new point make a clockwise turn (or are collinear), remove the last point. Then append the new point.
3. **Build the upper hull:** Iterate through the sorted points right to left, applying the same procedure.
4. **Combine:** Concatenate the lower and upper hulls, removing the duplicate endpoints where they meet.

The turn direction is determined using the cross product of vectors formed by three consecutive points. If the cross product is negative (or zero for collinear), the middle point is removed to maintain convexity.

## Worked Example

**Input points:** (0,0), (2,0), (1,1), (0,2), (2,2), (1,3)

**Step 1 -- Sort:** (0,0), (0,2), (1,1), (1,3), (2,0), (2,2)

**Step 2 -- Lower hull (left to right):**

| Point Added | Hull State | Cross Product Check | Action |
|-------------|------------|---------------------|--------|
| (0,0) | [(0,0)] | -- | Append |
| (0,2) | [(0,0),(0,2)] | -- | Append |
| (1,1) | [(0,0),(1,1)] | (0,2)->(1,1) is CW | Remove (0,2), append (1,1) |
| (1,3) | [(0,0),(1,1),(1,3)] | CCW turn | Append |
| (2,0) | [(0,0),(2,0)] | Removes (1,3),(1,1) | CW turns, append (2,0) |
| (2,2) | [(0,0),(2,0),(2,2)] | CCW turn | Append |

**Step 3 -- Upper hull (right to left):**

Built similarly, yielding: (2,2), (1,3), (0,2), (0,0)

**Result:** The convex hull has 5 vertices: (0,0), (2,0), (2,2), (1,3), (0,2). The point (1,1) is interior and excluded. Count = 5.

## Pseudocode

```
function cross(O, A, B):
    return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)

function convexHull(points):
    n = length(points)
    if n <= 1:
        return n

    sort points by (x, then y)

    // Build lower hull
    lower = []
    for each point p in points (left to right):
        while length(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            remove last element from lower
        append p to lower

    // Build upper hull
    upper = []
    for each point p in points (right to left):
        while length(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            remove last element from upper
        append p to upper

    // Remove last point of each half because it is repeated
    hull = lower[0..-2] + upper[0..-2]
    return length(hull)
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** Dominated by the sorting step. The hull construction itself is O(n) because each point is added and removed from the stack at most once (amortized).
- **Space -- O(n):** Requires storage for the sorted points and the hull arrays.

## When to Use

- **Computer graphics and image processing:** Computing bounding shapes for objects.
- **Collision detection in games:** Testing if two convex objects overlap is much faster than testing arbitrary polygons.
- **Geographic information systems:** Finding the boundary of a set of geographic coordinates.
- **Robotics path planning:** Identifying obstacle boundaries for navigation.
- **Pattern recognition:** Computing shape descriptors and features from point clouds.
- **Statistics:** Computing the convex hull of data points for outlier detection or data enclosure.

## When NOT to Use

- **Concave boundaries needed:** If you need a shape that follows concavities in the point set (e.g., alpha shapes or concave hulls), the convex hull will lose interior detail.
- **Dynamic point sets with frequent insertions/deletions:** The monotone chain algorithm must re-sort and rebuild on each update. Dynamic convex hull data structures are better suited for this.
- **Very high dimensions:** The convex hull problem becomes exponentially harder in high dimensions (the number of facets can be O(n^(d/2))). Consider approximate methods instead.
- **Only need pairwise distances or nearest neighbors:** If the downstream task does not require the hull boundary itself, computing it is unnecessary overhead.

## Comparison

| Algorithm | Time | Output-Sensitive? | Notes |
|-----------|------|-------------------|-------|
| Andrew's Monotone Chain | O(n log n) | No | Simple, practical, sorts first |
| Graham Scan | O(n log n) | No | Similar to monotone chain, uses angular sort |
| Jarvis March (Gift Wrapping) | O(nh) | Yes | Better when h is very small |
| Quickhull | O(n log n) avg, O(n^2) worst | No | Fast in practice, divide-and-conquer |
| Chan's Algorithm | O(n log h) | Yes | Optimal output-sensitive algorithm |

Andrew's monotone chain and Graham scan are the most commonly used general-purpose algorithms. Jarvis march is preferred when the number of hull points h is known to be very small (h << n). Chan's algorithm achieves the theoretically optimal O(n log h) but is more complex to implement.

## Implementations

| Language   | File |
|------------|------|
| Python     | [convex_hull.py](python/convex_hull.py) |
| Java       | [ConvexHull.java](java/ConvexHull.java) |
| C++        | [convex_hull.cpp](cpp/convex_hull.cpp) |
| C          | [convex_hull.c](c/convex_hull.c) |
| Go         | [convex_hull.go](go/convex_hull.go) |
| TypeScript | [convexHull.ts](typescript/convexHull.ts) |
| Rust       | [convex_hull.rs](rust/convex_hull.rs) |
| Kotlin     | [ConvexHull.kt](kotlin/ConvexHull.kt) |
| Swift      | [ConvexHull.swift](swift/ConvexHull.swift) |
| Scala      | [ConvexHull.scala](scala/ConvexHull.scala) |
| C#         | [ConvexHull.cs](csharp/ConvexHull.cs) |

## References

- Andrew, A. M. (1979). "Another efficient algorithm for convex hulls in two dimensions." *Information Processing Letters*, 9(5), 216-219.
- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3rd ed.). Springer. Chapter 1.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 33: Computational Geometry.
- [Convex Hull -- Wikipedia](https://en.wikipedia.org/wiki/Convex_hull_algorithms)
