# Voronoi Diagram

## Overview

A Voronoi diagram partitions a plane into regions based on proximity to a set of seed points (also called sites or generators). Each region, called a Voronoi cell, contains all points in the plane that are closer to its seed than to any other seed. The boundaries between cells consist of points equidistant from two or more seeds, and the vertices of the diagram (Voronoi vertices) are points equidistant from three or more seeds.

Named after Georgy Voronoi (1908), though the concept was studied earlier by Dirichlet (1850) and others, Voronoi diagrams are one of the most fundamental structures in computational geometry. They are the dual of the Delaunay triangulation: connecting seeds whose Voronoi cells share an edge yields the Delaunay triangulation.

This simplified implementation computes the number of Voronoi vertices by finding circumcenters of Delaunay triangles and counting those that satisfy the empty circumcircle property.

## How It Works

This implementation leverages the duality between Voronoi diagrams and Delaunay triangulations:

1. **Enumerate all triplets** of input points.
2. For each triplet, **compute the circumcenter** -- the center of the circle passing through all three points. This circumcenter is a candidate Voronoi vertex.
3. **Verify the empty circumcircle property:** Check that no other input point is strictly closer to the circumcenter than the three defining points. If the property holds, the triplet forms a Delaunay triangle and the circumcenter is a valid Voronoi vertex.
4. **Count unique Voronoi vertices** (accounting for numerical precision when comparing circumcenters).

Each valid Voronoi vertex is the meeting point of three or more Voronoi cell boundaries, corresponding to a point equidistant from three or more seeds.

## Worked Example

**Input sites:** A(0,0), B(4,0), C(2,4)

**Step 1:** There is only one triplet: (A, B, C).

**Step 2 -- Compute circumcenter:**
- The circumcenter of (0,0), (4,0), (2,4) is found by solving the perpendicular bisector equations.
- Midpoint of AB = (2,0), perpendicular bisector: x = 2.
- Midpoint of AC = (1,2), slope of AC = 2, perpendicular slope = -1/2, bisector: y - 2 = -1/2 * (x - 1).
- Solving: x = 2, y = 2 - 1/2 = 1.5. Circumcenter = (2, 1.5).

**Step 3 -- Verify:** No other points exist, so the circumcircle is trivially empty.

**Result:** 1 Voronoi vertex at (2, 1.5). The Voronoi diagram has 3 cells (one per site), separated by 3 edges meeting at this vertex. Each edge is a segment of the perpendicular bisector between two sites, extending to infinity.

**Larger example with 4 sites:** A(0,0), B(4,0), C(4,4), D(0,4)

Triplets: (A,B,C), (A,B,D), (A,C,D), (B,C,D)
- Circumcenter of (A,B,C) = (2,2), check if D is inside: dist(D,(2,2)) = sqrt(4+4) = 2.83, circumradius = sqrt(4+4) = 2.83. D is on the circle (not strictly inside), so this is a degenerate case.

For 4 co-circular points, the Voronoi diagram has a single vertex at (2,2) where all four cells meet.

## Pseudocode

```
function circumcenter(A, B, C):
    D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y))
    if D == 0: return null   // collinear points
    ux = ((A.x^2 + A.y^2) * (B.y - C.y) + (B.x^2 + B.y^2) * (C.y - A.y) + (C.x^2 + C.y^2) * (A.y - B.y)) / D
    uy = ((A.x^2 + A.y^2) * (C.x - B.x) + (B.x^2 + B.y^2) * (A.x - C.x) + (C.x^2 + C.y^2) * (B.x - A.x)) / D
    return (ux, uy)

function countVoronoiVertices(sites):
    n = length(sites)
    vertices = []

    for i from 0 to n - 3:
        for j from i + 1 to n - 2:
            for k from j + 1 to n - 1:
                center = circumcenter(sites[i], sites[j], sites[k])
                if center is null: continue

                radius = dist(center, sites[i])
                isValid = true

                for m from 0 to n - 1:
                    if m == i or m == j or m == k: continue
                    if dist(center, sites[m]) < radius - epsilon:
                        isValid = false
                        break

                if isValid:
                    vertices.append(center)

    return countUnique(vertices)
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^4) | O(n^2) |
| Average | O(n^4) | O(n^2) |
| Worst   | O(n^4) | O(n^2) |

- **Time -- O(n^4):** O(n^3) triplets each requiring O(n) verification against all other points.
- **Space -- O(n^2):** Storing candidate Voronoi vertices. The actual Voronoi diagram has O(n) vertices, edges, and faces (by Euler's formula for planar subdivisions).

**Optimal algorithm:** Fortune's sweep line algorithm computes the full Voronoi diagram in O(n log n) time and O(n) space.

## When to Use

- **Nearest neighbor queries:** The Voronoi cell of a site contains all points nearest to that site, enabling efficient proximity lookups.
- **Facility location planning:** Determining service regions for hospitals, fire stations, or retail stores.
- **Natural neighbor interpolation:** The Voronoi diagram defines natural neighbors used in Sibson's interpolation.
- **Cell biology modeling:** Modeling cell boundaries and growth patterns.
- **Wireless network coverage:** Mapping coverage areas of cell towers or Wi-Fi access points.
- **Crystallography:** Modeling crystal structures via Wigner-Seitz cells (which are Voronoi cells).

## When NOT to Use

- **Large point sets with this brute-force approach:** O(n^4) is impractical for more than a few hundred points. Use Fortune's sweep line for O(n log n).
- **Only need nearest neighbor queries:** A kd-tree provides O(log n) nearest neighbor queries without constructing the full Voronoi diagram.
- **Dynamic point sets:** If sites are frequently added or removed, maintaining the Voronoi diagram incrementally is complex. Consider dynamic spatial indices instead.
- **Higher dimensions:** Voronoi diagrams in d dimensions have O(n^(d/2)) complexity, making them impractical for d > 3. Use approximate nearest neighbor methods instead.
- **Weighted or non-Euclidean distances:** Standard Voronoi algorithms assume Euclidean distance. For weighted or other distance metrics, specialized algorithms (power diagrams, additively weighted Voronoi) are needed.

## Comparison

| Algorithm | Time | Space | Output |
|-----------|------|-------|--------|
| Brute-force (this) | O(n^4) | O(n^2) | Voronoi vertex count |
| Fortune's Sweep Line | O(n log n) | O(n) | Full Voronoi diagram |
| Incremental (via Delaunay) | O(n log n) expected | O(n) | Full diagram via duality |
| Divide and Conquer | O(n log n) | O(n) | Full diagram, complex merge |

| Related Structure | Relationship | Use Case |
|-------------------|-------------|----------|
| Delaunay Triangulation | Dual graph of Voronoi | Meshing, interpolation |
| kd-tree | Alternative for NN queries | Dynamic nearest neighbor |
| R-tree | Spatial index | Range queries on rectangles |

Fortune's sweep line algorithm is the standard for computing Voronoi diagrams in practice. For applications that only need nearest-neighbor lookups, a kd-tree is simpler and often sufficient. The Delaunay triangulation can be converted to a Voronoi diagram (and vice versa) in O(n) time given one of them.

## Implementations

| Language   | File |
|------------|------|
| Python     | [voronoi_diagram.py](python/voronoi_diagram.py) |
| Java       | [VoronoiDiagram.java](java/VoronoiDiagram.java) |
| C++        | [voronoi_diagram.cpp](cpp/voronoi_diagram.cpp) |
| C          | [voronoi_diagram.c](c/voronoi_diagram.c) |
| Go         | [voronoi_diagram.go](go/voronoi_diagram.go) |
| TypeScript | [voronoiDiagram.ts](typescript/voronoiDiagram.ts) |
| Rust       | [voronoi_diagram.rs](rust/voronoi_diagram.rs) |
| Kotlin     | [VoronoiDiagram.kt](kotlin/VoronoiDiagram.kt) |
| Swift      | [VoronoiDiagram.swift](swift/VoronoiDiagram.swift) |
| Scala      | [VoronoiDiagram.scala](scala/VoronoiDiagram.scala) |
| C#         | [VoronoiDiagram.cs](csharp/VoronoiDiagram.cs) |

## References

- Voronoi, G. (1908). "Nouvelles applications des parametres continus a la theorie des formes quadratiques." *Journal fur die reine und angewandte Mathematik*, 134, 198-287.
- Fortune, S. (1987). "A sweepline algorithm for Voronoi diagrams." *Algorithmica*, 2(1), 153-174.
- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3rd ed.). Springer. Chapter 7: Voronoi Diagrams.
- Aurenhammer, F. (1991). "Voronoi diagrams -- a survey of a fundamental geometric data structure." *ACM Computing Surveys*, 23(3), 345-405.
- [Voronoi diagram -- Wikipedia](https://en.wikipedia.org/wiki/Voronoi_diagram)
