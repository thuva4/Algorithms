# Hungarian Algorithm

## Overview

The Hungarian Algorithm (also known as the Kuhn-Munkres algorithm) solves the assignment problem: given an n x n cost matrix, find a one-to-one assignment of workers to jobs that minimizes the total cost. It runs in O(n^3) time and is optimal for minimum cost perfect matching in bipartite graphs. The algorithm was developed by Harold Kuhn in 1955 based on earlier work by Hungarian mathematicians Denes Konig and Jeno Egervary.

## How It Works

1. Subtract the row minimum from each row, then the column minimum from each column.
2. Find a maximum matching using only zero-cost entries.
3. If the matching is perfect (n assignments), we are done.
4. Otherwise, use the concept of augmenting paths with a potential function: maintain row potentials (u) and column potentials (v) such that cost[i][j] >= u[i] + v[j] for all i, j, with equality defining "tight" edges.
5. For each unmatched row, perform a shortest-path search (Dijkstra-like) over the reduced costs to find an augmenting path, updating potentials along the way.
6. Repeat until all rows are matched.

## Worked Example

Consider assigning 3 workers to 3 jobs with cost matrix:

```
        Job 0   Job 1   Job 2
Worker 0:  9       2       7
Worker 1:  6       4       3
Worker 2:  5       8       1
```

**Step 1: Row reduction** (subtract row minimums: 2, 3, 1):
```
        Job 0   Job 1   Job 2
Worker 0:  7       0       5
Worker 1:  3       1       0
Worker 2:  4       7       0
```

**Step 2: Column reduction** (subtract column minimums: 3, 0, 0):
```
        Job 0   Job 1   Job 2
Worker 0:  4       0       5
Worker 1:  0       1       0
Worker 2:  1       7       0
```

**Step 3: Find matching on zeros:**
- Worker 0 -> Job 1 (cost 0)
- Worker 1 -> Job 0 (cost 0)
- Worker 2 -> Job 2 (cost 0)

All three workers are matched -- this is a perfect matching.

**Optimal assignment:** Worker 0 -> Job 1 (cost 2), Worker 1 -> Job 0 (cost 6), Worker 2 -> Job 2 (cost 1).
**Total cost:** 2 + 6 + 1 = 9.

## Pseudocode

```
function hungarian(cost[n][n]):
    u = array of size n+1, initialized to 0   // row potentials
    v = array of size n+1, initialized to 0   // column potentials
    match = array of size n+1, initialized to 0

    for i = 1 to n:
        // Find augmenting path from row i
        links = array of size n+1, initialized to 0
        mins = array of size n+1, initialized to INF
        visited = array of size n+1, initialized to false
        markedRow = i, markedCol = 0

        match[0] = i
        repeat:
            visited[markedCol] = true
            curRow = match[markedCol]
            delta = INF

            for j = 1 to n:
                if visited[j]: continue
                val = cost[curRow-1][j-1] - u[curRow] - v[j]
                if val < mins[j]:
                    mins[j] = val
                    links[j] = markedCol
                if mins[j] < delta:
                    delta = mins[j]
                    markedCol = j

            for j = 0 to n:
                if visited[j]:
                    u[match[j]] += delta
                    v[j] -= delta
                else:
                    mins[j] -= delta

        until match[markedCol] == 0

        // Unwind augmenting path
        while markedCol != 0:
            match[markedCol] = match[links[markedCol]]
            markedCol = links[markedCol]

    // Compute total cost
    total = 0
    for j = 1 to n:
        total += cost[match[j]-1][j-1]
    return total
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^3) | O(n^2) |
| Average | O(n^3) | O(n^2) |
| Worst   | O(n^3) | O(n^2) |

The algorithm performs n iterations, each involving a Dijkstra-like search over the n columns, giving O(n^2) per iteration and O(n^3) overall.

## When to Use

- Assigning workers to jobs with different costs
- Matching students to projects or courses
- Vehicle routing and fleet assignment
- Resource allocation in cloud computing
- Organ donor matching
- Weighted bipartite graph matching in image recognition

## When NOT to Use

- When the cost matrix is very large (n > 10,000) and approximate solutions are acceptable -- auction algorithms or linear programming relaxations may be more practical.
- When the problem is not a perfect matching (unequal number of workers and jobs) without padding -- use min-cost max-flow instead.
- When costs can be negative and you have not adjusted the formulation accordingly.
- For unweighted bipartite matching -- Hopcroft-Karp is faster at O(E * sqrt(V)).

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Hungarian (this) | O(n^3) | O(n^2) | Optimal for dense assignment problems |
| Auction Algorithm | O(n^3) in theory | O(n^2) | Better parallelism, good practical performance |
| Min-Cost Max-Flow | O(V^2 * E) | O(V + E) | More general, handles non-square matrices |
| Hopcroft-Karp | O(E * sqrt(V)) | O(V) | Unweighted only; much faster for cardinality matching |
| Brute Force | O(n!) | O(n) | Intractable for n > 12 |

## References

- Kuhn, H. W. (1955). "The Hungarian method for the assignment problem." *Naval Research Logistics Quarterly*, 2(1-2), 83-97.
- Munkres, J. (1957). "Algorithms for the assignment and transportation problems." *Journal of the Society for Industrial and Applied Mathematics*, 5(1), 32-38.
- [Hungarian algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Hungarian_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [hungarian_algorithm.py](python/hungarian_algorithm.py) |
| Java       | [HungarianAlgorithm.java](java/HungarianAlgorithm.java) |
| C++        | [hungarian_algorithm.cpp](cpp/hungarian_algorithm.cpp) |
| C          | [hungarian_algorithm.c](c/hungarian_algorithm.c) |
| Go         | [hungarian_algorithm.go](go/hungarian_algorithm.go) |
| TypeScript | [hungarianAlgorithm.ts](typescript/hungarianAlgorithm.ts) |
| Rust       | [hungarian_algorithm.rs](rust/hungarian_algorithm.rs) |
| Kotlin     | [HungarianAlgorithm.kt](kotlin/HungarianAlgorithm.kt) |
| Swift      | [HungarianAlgorithm.swift](swift/HungarianAlgorithm.swift) |
| Scala      | [HungarianAlgorithm.scala](scala/HungarianAlgorithm.scala) |
| C#         | [HungarianAlgorithm.cs](csharp/HungarianAlgorithm.cs) |
