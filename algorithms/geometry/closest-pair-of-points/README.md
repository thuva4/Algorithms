# Closest Pair of Points

## Overview

The Closest Pair of Points algorithm finds the two points in a set that are nearest to each other, measured by Euclidean distance. The naive brute-force approach checks all O(n^2) pairs, but the divide-and-conquer strategy achieves O(n log n) time by recursively splitting the point set and efficiently combining results using a strip-based approach.

This is a fundamental problem in computational geometry with direct applications in collision detection, geographic analysis, and clustering.

## How It Works

The divide-and-conquer algorithm proceeds as follows:

1. **Sort** all points by x-coordinate.
2. **Base case:** If there are 3 or fewer points, compute all pairwise distances directly.
3. **Divide:** Split the points into two halves at the median x-coordinate.
4. **Conquer:** Recursively find the closest pair in the left half (distance d_L) and right half (distance d_R).
5. **Combine:** Let d = min(d_L, d_R). Build a strip of points whose x-coordinate is within distance d of the dividing line.
6. **Strip check:** Sort strip points by y-coordinate. For each point, compare it with subsequent points in the strip whose y-coordinate difference is less than d. Due to a packing argument, at most 7 points need to be checked for each strip point.
7. **Return** the overall minimum distance.

The key insight is the sparsity property: within the strip of width 2d, at most a constant number of points can exist in any d-by-d square, limiting the strip check to O(n) comparisons.

## Worked Example

**Input points:** (2,3), (12,30), (40,50), (5,1), (12,10), (3,4)

**Step 1 -- Sort by x:** (2,3), (3,4), (5,1), (12,10), (12,30), (40,50)

**Step 2 -- Divide** at median: Left = {(2,3), (3,4), (5,1)}, Right = {(12,10), (12,30), (40,50)}

**Step 3 -- Left half (brute force, n=3):**
- dist((2,3),(3,4)) = sqrt(1+1) = 1.414
- dist((2,3),(5,1)) = sqrt(9+4) = 3.606
- dist((3,4),(5,1)) = sqrt(4+9) = 3.606
- d_L = 1.414

**Step 4 -- Right half (brute force, n=3):**
- dist((12,10),(12,30)) = 20.0
- dist((12,10),(40,50)) = sqrt(784+1600) = 48.83
- dist((12,30),(40,50)) = sqrt(784+400) = 34.41
- d_R = 20.0

**Step 5 -- Combine:** d = min(1.414, 20.0) = 1.414. Strip = points with |x - 5| < 1.414 = {(5,1), (3,4)} (midline at x~5). No cross-pair is closer than 1.414.

**Result:** Closest pair is (2,3) and (3,4) with distance 1.414.

## Pseudocode

```
function closestPair(points):
    sort points by x-coordinate
    return closestPairRec(points)

function closestPairRec(P):
    n = length(P)
    if n <= 3:
        return bruteForce(P)

    mid = n / 2
    midPoint = P[mid]
    leftHalf = P[0..mid-1]
    rightHalf = P[mid..n-1]

    dL = closestPairRec(leftHalf)
    dR = closestPairRec(rightHalf)
    d = min(dL, dR)

    // Build strip
    strip = []
    for each point p in P:
        if |p.x - midPoint.x| < d:
            strip.append(p)

    sort strip by y-coordinate

    // Check strip pairs
    for i from 0 to length(strip) - 1:
        for j from i+1 to length(strip) - 1:
            if strip[j].y - strip[i].y >= d:
                break
            d = min(d, dist(strip[i], strip[j]))

    return d
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** The recurrence is T(n) = 2T(n/2) + O(n log n) for the naive version (due to strip sorting at each level). Using a merge-sort style pre-sort, this reduces to T(n) = 2T(n/2) + O(n) = O(n log n).
- **Space -- O(n):** Linear space for the sorted arrays and strip storage. Recursion stack depth is O(log n).

## When to Use

- **Collision detection in computer graphics:** Quickly identifying the closest objects in a scene.
- **Geographic information systems (GIS):** Finding the nearest pair of facilities, landmarks, or data points.
- **Air traffic control:** Detecting aircraft that are dangerously close to each other.
- **Clustering algorithms:** As a subroutine in hierarchical clustering (single-linkage).
- **Molecular simulation:** Identifying closest atom pairs for force calculations.
- **Wireless networks:** Determining interference between closely placed transmitters.

## When NOT to Use

- **Small point sets (n < 50):** The brute-force O(n^2) approach has lower constant factors and is simpler. The overhead of the divide-and-conquer recursion is not worthwhile for small inputs.
- **Higher dimensions:** The strip-based merge step relies on a 2D geometric argument. In d dimensions, the constant in the strip check grows exponentially. Use kd-trees or other spatial index structures instead.
- **Dynamic point sets:** If points are frequently inserted or removed, rebuilding from scratch is wasteful. Use a kd-tree or a Voronoi diagram maintained incrementally.
- **Approximate answers suffice:** Randomized grid-based algorithms can find an approximate closest pair in expected O(n) time.

## Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute Force | O(n^2) | O(1) | Simple, best for small n |
| Divide and Conquer | O(n log n) | O(n) | Optimal comparison-based algorithm |
| Randomized (grid hashing) | O(n) expected | O(n) | Faster expected time but complex |
| kd-tree based | O(n log n) build, O(log n) query | O(n) | Best for repeated queries or dynamic sets |

The divide-and-conquer approach is the standard textbook algorithm and is optimal among comparison-based methods. For a single batch query on a static set, it is the best choice. For repeated queries or dynamic sets, spatial data structures like kd-trees are preferred.

## Implementations

| Language   | File |
|------------|------|
| Python     | [closest_pair.py](python/closest_pair.py) |
| Java       | [ClosestPair.java](java/ClosestPair.java) |
| C++        | [closest_pair.cpp](cpp/closest_pair.cpp) |
| C          | [closest_pair.c](c/closest_pair.c) |
| Go         | [closest_pair.go](go/closest_pair.go) |
| TypeScript | [closestPair.ts](typescript/closestPair.ts) |
| Rust       | [closest_pair.rs](rust/closest_pair.rs) |
| Kotlin     | [ClosestPair.kt](kotlin/ClosestPair.kt) |
| Swift      | [ClosestPair.swift](swift/ClosestPair.swift) |
| Scala      | [ClosestPair.scala](scala/ClosestPair.scala) |
| C#         | [ClosestPair.cs](csharp/ClosestPair.cs) |

## References

- Shamos, M. I., & Hoey, D. (1975). "Closest-point problems." *16th Annual Symposium on Foundations of Computer Science*, 151-162.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 33.4: Finding the closest pair of points.
- de Berg, M., Cheong, O., van Kreveld, M., & Overmars, M. (2008). *Computational Geometry: Algorithms and Applications* (3rd ed.). Springer. Chapter 5.
- [Closest pair of points problem -- Wikipedia](https://en.wikipedia.org/wiki/Closest_pair_of_points_problem)
