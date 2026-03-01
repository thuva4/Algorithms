# Point in Polygon

## Overview

The Point in Polygon (PIP) algorithm determines whether a given point lies inside, outside, or on the boundary of a polygon. This implementation uses the **Ray Casting** algorithm (also known as the even-odd rule or crossing number algorithm), which works by casting a ray from the test point in one direction and counting how many times the ray intersects the polygon's edges. An odd number of crossings means the point is inside; an even number means it is outside.

The ray casting method works for any simple polygon (non-self-intersecting), including both convex and concave polygons. It is one of the most widely used point-in-polygon algorithms due to its simplicity and generality.

## How It Works

1. Cast a horizontal ray from the test point toward positive infinity (rightward).
2. For each edge of the polygon (defined by consecutive vertex pairs):
   a. Check if the ray's y-coordinate falls between the y-coordinates of the edge's endpoints.
   b. If so, compute the x-coordinate where the ray intersects the line containing the edge.
   c. If this x-coordinate is to the right of the test point, count it as a crossing.
3. After checking all edges, if the crossing count is **odd**, the point is **inside**. If **even**, the point is **outside**.

Special care is needed for edge cases: the ray passing exactly through a vertex, or the point lying exactly on an edge. The standard implementation handles vertex-touching by counting an edge only if the ray crosses strictly between the two vertex y-values (one endpoint inclusive, the other exclusive).

## Worked Example

**Polygon vertices:** (0,0), (4,0), (4,4), (2,2), (0,4) -- a concave polygon (arrow shape)

**Test Point A: (1,1)**

| Edge | Vertices | Ray crosses? | Reason |
|------|----------|-------------|--------|
| 1 | (0,0)-(4,0) | No | y=0, ray at y=1 does not cross (y not between endpoints vertically) |
| 2 | (4,0)-(4,4) | Yes | y=1 is between 0 and 4; intersection at x=4, which is right of x=1 |
| 3 | (4,4)-(2,2) | No | Intersection x is left of test point |
| 4 | (2,2)-(0,4) | No | y=1 is not between 2 and 4 |
| 5 | (0,4)-(0,0) | No | Intersection at x=0, which is left of x=1 |

Crossings = 1 (odd). Result: **(1,1) is inside**.

**Test Point B: (3,3)**

| Edge | Vertices | Ray crosses? | Reason |
|------|----------|-------------|--------|
| 1 | (0,0)-(4,0) | No | y=3 not between 0 and 0 |
| 2 | (4,0)-(4,4) | Yes | Intersection at x=4, right of x=3 |
| 3 | (4,4)-(2,2) | No | Intersection at x ~2.67, left of x=3 |
| 4 | (2,2)-(0,4) | No | Intersection at x ~1, left of x=3 |
| 5 | (0,4)-(0,0) | No | Intersection at x=0, left of x=3 |

Crossings = 1 (odd). Result: **(3,3) is inside**.

**Test Point C: (5,5)**

No edges have y ranges that include y=5 except the top edges, and intersections are all to the left. Crossings = 0 (even). Result: **(5,5) is outside**.

## Pseudocode

```
function pointInPolygon(point, polygon):
    n = length(polygon)
    crossings = 0

    for i from 0 to n - 1:
        j = (i + 1) % n
        xi = polygon[i].x, yi = polygon[i].y
        xj = polygon[j].x, yj = polygon[j].y

        // Check if ray at point.y crosses this edge
        if (yi > point.y) != (yj > point.y):
            // Compute x-coordinate of intersection
            intersectX = xi + (point.y - yi) * (xj - xi) / (yj - yi)
            if point.x < intersectX:
                crossings += 1

    if crossings is odd:
        return INSIDE
    else:
        return OUTSIDE
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

Where n is the number of vertices (edges) of the polygon.

- **Time -- O(n):** Each edge is tested exactly once against the ray. No preprocessing is required.
- **Space -- O(1):** Only a crossing counter and a few temporary variables are needed beyond the input.

## When to Use

- **Geographic information systems (GIS):** Determining if a GPS coordinate falls within a city boundary, country border, or zoning region.
- **Computer graphics hit testing:** Detecting if a mouse click falls inside a UI element or sprite.
- **Game collision detection:** Checking if a character or projectile is inside a region.
- **Map applications:** Geofencing, determining service areas, or classifying locations.
- **CAD/CAM systems:** Testing if a point lies within a design boundary.

## When NOT to Use

- **Convex polygons only:** For convex polygons, a faster O(log n) algorithm exists using binary search on the polygon's angular ordering from a central point. The ray casting method does not exploit convexity.
- **Massive polygons with repeated queries:** If you need to test millions of points against the same polygon, preprocess the polygon into a spatial structure (e.g., trapezoidal decomposition) for O(log n) per query.
- **3D containment:** Ray casting in 2D does not directly extend to 3D point-in-polyhedron tests. Use a winding number approach or signed volume method instead.
- **Self-intersecting polygons:** The even-odd rule gives results that may not match geometric intuition for self-intersecting polygons. The winding number algorithm handles these more naturally.
- **On-boundary detection needed:** The standard ray casting algorithm may misclassify points exactly on edges. If precise boundary detection is required, add explicit on-segment checks.

## Comparison

| Algorithm | Time | Polygon Type | Notes |
|-----------|------|-------------|-------|
| Ray Casting (this) | O(n) | Any simple polygon | Simple, general purpose |
| Winding Number | O(n) | Any polygon (incl. self-intersecting) | More robust for complex polygons |
| Binary Search (convex) | O(log n) | Convex only | Much faster for convex polygons |
| Trapezoidal Decomposition | O(log n) query, O(n log n) build | Any simple polygon | Best for many queries on same polygon |
| Grid/Bitmap | O(1) query, O(n*m) build | Any | Approximate, good for rasterized contexts |

The ray casting algorithm is the standard choice for general-purpose point-in-polygon testing. The winding number algorithm is preferred when dealing with self-intersecting polygons or when a signed containment result is needed. For performance-critical applications with convex polygons, the binary search method is superior.

## Implementations

| Language   | File |
|------------|------|
| Python     | [point_in_polygon.py](python/point_in_polygon.py) |
| Java       | [PointInPolygon.java](java/PointInPolygon.java) |
| C++        | [point_in_polygon.cpp](cpp/point_in_polygon.cpp) |
| C          | [point_in_polygon.c](c/point_in_polygon.c) |
| Go         | [point_in_polygon.go](go/point_in_polygon.go) |
| TypeScript | [pointInPolygon.ts](typescript/pointInPolygon.ts) |
| Rust       | [point_in_polygon.rs](rust/point_in_polygon.rs) |
| Kotlin     | [PointInPolygon.kt](kotlin/PointInPolygon.kt) |
| Swift      | [PointInPolygon.swift](swift/PointInPolygon.swift) |
| Scala      | [PointInPolygon.scala](scala/PointInPolygon.scala) |
| C#         | [PointInPolygon.cs](csharp/PointInPolygon.cs) |

## References

- Shimrat, M. (1962). "Algorithm 112: Position of point relative to polygon." *Communications of the ACM*, 5(8), 434.
- Hormann, K., & Agathos, A. (2001). "The point in polygon problem for arbitrary polygons." *Computational Geometry*, 20(3), 131-144.
- O'Rourke, J. (1998). *Computational Geometry in C* (2nd ed.). Cambridge University Press. Chapter 7.
- [Point in polygon -- Wikipedia](https://en.wikipedia.org/wiki/Point_in_polygon)
