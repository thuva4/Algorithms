# Delaunay Triangulation

## Overview

Delaunay Triangulation is a triangulation of a set of points such that no point lies inside the circumcircle of any triangle in the triangulation. Named after Boris Delaunay who formalized it in 1934, this triangulation maximizes the minimum angle among all possible triangulations, thereby avoiding thin, elongated triangles (slivers) that cause numerical problems.

The Delaunay triangulation is the dual graph of the Voronoi diagram: each Delaunay edge connects two points whose Voronoi cells share a boundary. This duality makes it fundamental to many applications in mesh generation, interpolation, and spatial analysis.

This simplified implementation uses a brute-force approach that checks all triplets of points, verifying the empty circumcircle property for each. More efficient algorithms (incremental insertion, divide-and-conquer, or Fortune's sweep) achieve O(n log n) time.

## How It Works

The brute-force approach:

1. **Enumerate all triplets** of input points (there are C(n,3) = O(n^3) such triplets).
2. For each triplet (A, B, C):
   a. **Compute the circumcircle** -- the unique circle passing through all three points. The circumcenter is equidistant from A, B, and C.
   b. **Compute the circumradius** -- the distance from the circumcenter to any of the three points.
   c. **Check the empty circle property:** Verify that no other input point lies strictly inside this circumcircle.
3. If the circumcircle is empty (no other point inside), the triangle ABC is a valid Delaunay triangle.
4. **Count** all valid Delaunay triangles.

The circumcenter of three points (x1,y1), (x2,y2), (x3,y3) is found by solving the system of equations expressing equal distance from the center to each point, which reduces to a 2x2 linear system.

## Worked Example

**Input points:** A(0,0), B(4,0), C(2,3), D(2,1)

**Step 1 -- Enumerate triplets:** (A,B,C), (A,B,D), (A,C,D), (B,C,D)

**Step 2 -- Check each triplet:**

| Triplet | Circumcenter | Circumradius | Other Points Inside? | Delaunay? |
|---------|-------------|-------------|---------------------|-----------|
| (A,B,C) | (2.0, 1.17) | ~2.32 | D at dist ~0.17 -- YES, inside | No |
| (A,B,D) | (2.0, -0.75) | ~2.14 | C at dist ~3.75 -- no | Yes |
| (A,C,D) | (0.60, 1.60) | ~1.72 | B at dist ~3.75 -- no | Yes |
| (B,C,D) | (3.40, 1.60) | ~1.72 | A at dist ~3.75 -- no | Yes |

**Result:** 3 Delaunay triangles: (A,B,D), (A,C,D), (B,C,D). Triangle (A,B,C) is not Delaunay because point D lies inside its circumcircle.

## Pseudocode

```
function circumcenter(A, B, C):
    D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
    if D == 0: return null   // collinear points
    ux = ((A.x^2 + A.y^2) * (B.y - C.y) + (B.x^2 + B.y^2) * (C.y - A.y) + (C.x^2 + C.y^2) * (A.y - B.y)) / D
    uy = ((A.x^2 + A.y^2) * (C.x - B.x) + (B.x^2 + B.y^2) * (A.x - C.x) + (C.x^2 + C.y^2) * (B.x - A.x)) / D
    return (ux, uy)

function delaunayTriangulation(points):
    n = length(points)
    count = 0

    for i from 0 to n - 3:
        for j from i + 1 to n - 2:
            for k from j + 1 to n - 1:
                center = circumcenter(points[i], points[j], points[k])
                if center is null: continue

                radius = dist(center, points[i])
                isDelaunay = true

                for m from 0 to n - 1:
                    if m == i or m == j or m == k: continue
                    if dist(center, points[m]) < radius:
                        isDelaunay = false
                        break

                if isDelaunay:
                    count += 1

    return count
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^4) | O(n^2) |
| Average | O(n^4) | O(n^2) |
| Worst   | O(n^4) | O(n^2) |

- **Time -- O(n^4):** O(n^3) triplets are enumerated, and for each triplet, all remaining O(n) points are checked against the circumcircle.
- **Space -- O(n^2):** The Delaunay triangulation of n points has O(n) triangles and O(n) edges (by Euler's formula for planar graphs), but the brute-force approach may use O(n^2) auxiliary space for storing intermediate results.

**Optimal algorithms:** The randomized incremental algorithm and Fortune's sweep line algorithm both achieve O(n log n) expected or worst-case time, which is optimal for this problem.

## When to Use

- **Mesh generation for finite element analysis (FEA):** Delaunay triangulation produces well-shaped triangles, which is essential for numerical stability in FEA simulations.
- **Terrain modeling and GIS:** Triangulating elevation data points to create a Triangulated Irregular Network (TIN) for terrain visualization.
- **Natural neighbor interpolation:** The Delaunay triangulation defines the natural neighbors used in Sibson's interpolation method.
- **Computer graphics rendering:** Mesh generation for 3D surface reconstruction from point clouds.
- **Path planning:** Constructing navigation meshes for game AI and robotics.

## When NOT to Use

- **Large point sets with this brute-force approach:** The O(n^4) time is prohibitive for more than a few hundred points. Use the Bowyer-Watson incremental algorithm or Fortune's sweep line for O(n log n).
- **Regular grids:** If data is on a regular grid, a simple structured mesh (e.g., axis-aligned triangulation) is trivially constructable without Delaunay computation.
- **Anisotropic meshing needed:** Delaunay triangulation maximizes the minimum angle, producing near-equilateral triangles. If elongated triangles aligned to a feature are desired (e.g., boundary layers in CFD), constrained or anisotropic meshing is required.
- **Convex hull is sufficient:** If you only need the outer boundary and not internal triangulation, computing the convex hull is simpler and faster.

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Brute-force (this) | O(n^4) | O(n^2) | Simple, educational, impractical for large n |
| Bowyer-Watson (incremental) | O(n log n) expected | O(n) | Most commonly used in practice |
| Fortune's Sweep Line | O(n log n) | O(n) | Deterministic optimal, more complex to implement |
| Divide and Conquer | O(n log n) | O(n) | Efficient but complex merging step |
| Flipping algorithm | O(n^2) worst | O(n) | Start from any triangulation, flip edges |

For practical applications, the Bowyer-Watson incremental insertion algorithm is the most commonly used because it is relatively simple to implement and runs in O(n log n) expected time. Fortune's sweep line provides a deterministic O(n log n) guarantee but is significantly harder to implement correctly.

## Implementations

| Language   | File |
|------------|------|
| Python     | [delaunay_triangulation.py](python/delaunay_triangulation.py) |
| Java       | [DelaunayTriangulation.java](java/DelaunayTriangulation.java) |
| C++        | [delaunay_triangulation.cpp](cpp/delaunay_triangulation.cpp) |
| C          | [delaunay_triangulation.c](c/delaunay_triangulation.c) |
| Go         | [delaunay_triangulation.go](go/delaunay_triangulation.go) |
| TypeScript | [delaunayTriangulation.ts](typescript/delaunayTriangulation.ts) |
| Rust       | [delaunay_triangulation.rs](rust/delaunay_triangulation.rs) |
| Kotlin     | [DelaunayTriangulation.kt](kotlin/DelaunayTriangulation.kt) |
| Swift      | [DelaunayTriangulation.swift](swift/DelaunayTriangulation.swift) |
| Scala      | [DelaunayTriangulation.scala](scala/DelaunayTriangulation.scala) |
| C#         | [DelaunayTriangulation.cs](csharp/DelaunayTriangulation.cs) |

## References

- Delaunay, B. (1934). "Sur la sphere vide." *Bulletin de l'Academie des Sciences de l'URSS, Classe des sciences mathematiques et naturelles*, 6, 793-800.
- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3rd ed.). Springer. Chapter 9: Delaunay Triangulations.
- Bowyer, A. (1981). "Computing Dirichlet tessellations." *The Computer Journal*, 24(2), 162-166.
- Watson, D. F. (1981). "Computing the n-dimensional Delaunay tessellation with application to Voronoi polytopes." *The Computer Journal*, 24(2), 167-172.
- [Delaunay triangulation -- Wikipedia](https://en.wikipedia.org/wiki/Delaunay_triangulation)
