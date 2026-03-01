# Convex Hull Trick

## Overview

The Convex Hull Trick (CHT) is an optimization technique for dynamic programming recurrences of the form `dp[i] = min(m_j * x_i + b_j)` over all j < i, where the objective is to find the minimum (or maximum) value from a set of linear functions evaluated at a given point. Instead of checking all previous lines for each query (O(n^2) total), CHT maintains a convex hull (lower envelope) of candidate lines, reducing the total time to O(n log n) or even O(n) when slopes or query points are monotone.

This technique appears frequently in competitive programming and in optimizing DP problems from computational geometry, economics, and operations research.

## How It Works

1. **Maintain a set of lines** y = mx + b organized as a convex hull (lower envelope for minimum queries, upper envelope for maximum queries).
2. **When adding a new line**, remove any lines that are no longer part of the envelope. A line L2 between L1 and L3 is redundant if the intersection of L1 and L3 gives a lower value than L2 at that intersection point.
3. **For each query x**, find the line on the hull that gives the minimum (or maximum) y value:
   - If queries come in sorted order: use a pointer that advances along the hull (amortized O(1)).
   - If queries are arbitrary: use binary search on the hull (O(log n)).
4. The redundancy check uses the intersection test: line L2 is redundant if `intersect(L1, L3).x <= intersect(L1, L2).x`.

## Worked Example

**Lines:** y = -1x + 5, y = -2x + 8, y = 0x + 3 (slopes: -1, -2, 0; intercepts: 5, 8, 3).

**Queries:** x = 1, x = 3, x = 5.

**Building the lower envelope (sorted by slope):**
- Add line y = -2x + 8 (slope -2)
- Add line y = -1x + 5 (slope -1). Intersection with previous: -2x+8 = -1x+5, x=3. Keep both.
- Add line y = 0x + 3 (slope 0). Intersection of -1x+5 and 0x+3: x=2. Intersection of -2x+8 and 0x+3: x=2.5. Since 2 < 2.5, line y=-1x+5 is NOT redundant. Keep all three.

**Answering queries:**
- x=1: min(-2*1+8, -1*1+5, 0*1+3) = min(6, 4, 3) = **3** (line y=0x+3)
- x=3: min(-2*3+8, -1*3+5, 0*3+3) = min(2, 2, 3) = **2** (line y=-2x+8 or y=-1x+5)
- x=5: min(-2*5+8, -1*5+5, 0*5+3) = min(-2, 0, 3) = **-2** (line y=-2x+8)

## Pseudocode

```
// For minimum queries with slopes in decreasing order
struct Line:
    m, b    // y = m*x + b

function bad(L1, L2, L3):
    // Returns true if L2 is redundant given L1 and L3
    return (L3.b - L1.b) * (L1.m - L2.m) <= (L2.b - L1.b) * (L1.m - L3.m)

function addLine(hull, line):
    while len(hull) >= 2 and bad(hull[-2], hull[-1], line):
        hull.removeLast()
    hull.append(line)

function query(hull, x):
    // Binary search for the optimal line
    lo = 0, hi = len(hull) - 1
    while lo < hi:
        mid = (lo + hi) / 2
        if hull[mid].m * x + hull[mid].b <= hull[mid+1].m * x + hull[mid+1].b:
            hi = mid
        else:
            lo = mid + 1
    return hull[lo].m * x + hull[lo].b

// Monotone pointer version (when queries are sorted):
function queryMonotone(hull, x, pointer):
    while pointer < len(hull) - 1 and
          hull[pointer+1].m * x + hull[pointer+1].b <= hull[pointer].m * x + hull[pointer].b:
        pointer += 1
    return hull[pointer].m * x + hull[pointer].b, pointer
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|-----------|-------|
| Best    | O(n)      | O(n)  |
| Average | O(n log n)| O(n)  |
| Worst   | O(n log n)| O(n)  |

**Why these complexities?**

- **Best -- O(n):** When both slopes and query points are monotonically sorted, the pointer-based approach processes each line and each query in amortized O(1), giving O(n) total.

- **Average/Worst -- O(n log n):** When query points are not sorted, each query requires O(log n) binary search on the hull. Adding all n lines takes amortized O(n) total (each line is added and removed at most once). So: O(n) for building + O(n log n) for queries.

- **Space -- O(n):** The hull stores at most n lines.

## When to Use

- **DP optimization:** When a DP recurrence has the form dp[i] = min/max(a_j * b_i + c_j) where the variables separate into terms depending on j and terms depending on i.
- **Batch line queries:** When you have a set of linear functions and need to find the minimum/maximum at multiple query points.
- **Computational geometry:** Finding the lower/upper envelope of a set of lines.
- **Economics and operations research:** Linear cost models where you choose the best supplier/strategy at different demand levels.
- **Competitive programming:** A frequently tested optimization technique in Codeforces, USACO, and IOI-style contests.

## When NOT to Use

- **Non-linear cost functions:** CHT only works when the objective is linear in the query variable. For quadratic or other non-linear functions, use the divide-and-conquer optimization or Li Chao tree.
- **When the DP does not separate variables:** The recurrence must factor into the form m_j * x_i + b_j. If the interaction between i and j is more complex, CHT does not apply.
- **Small input sizes:** For small n (< 1000), the naive O(n^2) approach is simpler and fast enough.
- **Dynamic insertions and deletions:** CHT supports efficient insertion but not deletion. If lines need to be removed dynamically, use a Li Chao tree or kinetic data structure.

## Comparison

| Technique                | Time          | Space | Notes                                        |
|-------------------------|--------------|-------|----------------------------------------------|
| Naive DP                 | O(n^2)       | O(n)  | Check all previous states for each state     |
| **Convex Hull Trick**    | **O(n) to O(n log n)** | **O(n)** | **Lines must be linear; slopes sorted helps** |
| Li Chao Tree             | O(n log n)    | O(n)  | Handles arbitrary insertion order; segment tree|
| Divide and Conquer Opt.  | O(n log n)    | O(n)  | For monotone minima; no linearity needed     |
| Knuth's Optimization     | O(n^2)        | O(n^2)| For quadrangle inequality; interval DP       |

## Implementations

| Language   | File |
|------------|------|
| Python     | [convex_hull_trick.py](python/convex_hull_trick.py) |
| Java       | [ConvexHullTrick.java](java/ConvexHullTrick.java) |
| C++        | [convex_hull_trick.cpp](cpp/convex_hull_trick.cpp) |
| C          | [convex_hull_trick.c](c/convex_hull_trick.c) |
| Go         | [convex_hull_trick.go](go/convex_hull_trick.go) |
| TypeScript | [convexHullTrick.ts](typescript/convexHullTrick.ts) |
| Rust       | [convex_hull_trick.rs](rust/convex_hull_trick.rs) |
| Kotlin     | [ConvexHullTrick.kt](kotlin/ConvexHullTrick.kt) |
| Swift      | [ConvexHullTrick.swift](swift/ConvexHullTrick.swift) |
| Scala      | [ConvexHullTrick.scala](scala/ConvexHullTrick.scala) |
| C#         | [ConvexHullTrick.cs](csharp/ConvexHullTrick.cs) |

## References

- Halim, S., & Halim, F. (2013). *Competitive Programming 3*. Chapter 9: Rare Topics.
- [Convex Hull Trick -- CP-Algorithms](https://cp-algorithms.com/geometry/convex_hull_trick.html)
- [Li Chao Tree -- CP-Algorithms](https://cp-algorithms.com/geometry/li-chao-tree.html)
- [Convex Hull Trick and Li Chao Tree -- Codeforces](https://codeforces.com/blog/entry/63823)
