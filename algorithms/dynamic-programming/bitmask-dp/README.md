# Bitmask DP

## Overview

Bitmask DP uses bitmasks to represent subsets of elements in DP states, enabling efficient solutions for problems involving subset enumeration. Each bit in an integer represents whether an element is included in the current subset. This technique is fundamental for problems like the Travelling Salesman Problem (TSP) and the Assignment Problem.

The classic problem solved here is the minimum cost assignment: given an n x n cost matrix, assign each worker to exactly one job (and vice versa) to minimize total cost. This is equivalent to finding a minimum weight perfect matching in a bipartite graph.

## How It Works

1. Represent the set of assigned jobs as a bitmask. Bit i is set if job i has been assigned.
2. State: `dp[mask]` = minimum cost to assign workers 0..popcount(mask)-1 to the jobs indicated by mask.
3. Base case: `dp[0] = 0` (no workers assigned, no jobs taken).
4. Transition: for worker = popcount(mask), try each unassigned job j, and update dp[mask | (1 << j)].
5. Answer: `dp[(1 << n) - 1]` (all jobs assigned).

The key insight is that the order in which we assign workers is fixed (worker 0 first, then worker 1, etc.), so the bitmask of assigned jobs uniquely determines the state.

## Worked Example

Given a 3x3 cost matrix (worker i assigned to job j costs `cost[i][j]`):

```
cost = | 9  2  7 |
       | 6  4  3 |
       | 5  8  1 |
```

**Processing (mask in binary):**

| mask (bin) | Worker | Try job | Cost                          | dp[new_mask] |
|-----------|--------|---------|-------------------------------|-------------|
| 000       | 0      | j=0     | dp[000]+cost[0][0] = 0+9 = 9 | dp[001] = 9 |
| 000       | 0      | j=1     | dp[000]+cost[0][1] = 0+2 = 2 | dp[010] = 2 |
| 000       | 0      | j=2     | dp[000]+cost[0][2] = 0+7 = 7 | dp[100] = 7 |
| 001       | 1      | j=1     | dp[001]+cost[1][1] = 9+4 = 13| dp[011] = 13|
| 001       | 1      | j=2     | dp[001]+cost[1][2] = 9+3 = 12| dp[101] = 12|
| 010       | 1      | j=0     | dp[010]+cost[1][0] = 2+6 = 8 | dp[011] = min(13,8) = 8 |
| 010       | 1      | j=2     | dp[010]+cost[1][2] = 2+3 = 5 | dp[110] = 5 |
| 100       | 1      | j=0     | dp[100]+cost[1][0] = 7+6 = 13| dp[101] = min(12,13) = 12 |
| 100       | 1      | j=1     | dp[100]+cost[1][1] = 7+4 = 11| dp[110] = min(5,11) = 5 |
| 011       | 2      | j=2     | dp[011]+cost[2][2] = 8+1 = 9 | dp[111] = 9 |
| 101       | 2      | j=1     | dp[101]+cost[2][1] = 12+8 = 20| dp[111] = min(9,20) = 9 |
| 110       | 2      | j=0     | dp[110]+cost[2][0] = 5+5 = 10| dp[111] = min(9,10) = 9 |

**Answer: dp[111] = 9** (worker 0 -> job 1, worker 1 -> job 2, worker 2 -> job 0: costs 2+3+5 = 10... wait, let me verify: worker 0 -> job 1 (cost 2), worker 1 -> job 2 (cost 3), worker 2 -> job 2 is taken. Tracing back: dp[011]=8 came from mask 010 (worker 0 did job 1, worker 1 did job 0), then worker 2 does job 2 (cost 1). Total: 2+6+1 = 9.)

## Pseudocode

```
function bitmaskDP(cost, n):
    dp = array of size 2^n, initialized to infinity
    dp[0] = 0

    for mask = 0 to (2^n - 1):
        worker = popcount(mask)
        if worker >= n:
            continue
        for job = 0 to n - 1:
            if mask & (1 << job) == 0:    // job not yet assigned
                new_mask = mask | (1 << job)
                dp[new_mask] = min(dp[new_mask], dp[mask] + cost[worker][job])

    return dp[(1 << n) - 1]
```

## Complexity Analysis

| Case    | Time            | Space         |
|---------|-----------------|---------------|
| Best    | O(n^2 * 2^n)    | O(n * 2^n)    |
| Average | O(n^2 * 2^n)    | O(n * 2^n)    |
| Worst   | O(n^2 * 2^n)    | O(n * 2^n)    |

**Why these complexities?**

- **Time -- O(n^2 * 2^n):** There are 2^n possible masks. For each mask, we try up to n jobs for the current worker. Each transition is O(1). Total: O(n * 2^n). However, since we iterate over all masks and for each mask over all jobs, the bound is O(n * 2^n).

- **Space -- O(2^n):** We store one DP value per mask. With path reconstruction, O(n * 2^n) may be needed.

Practical for n up to about 20 (2^20 = ~1 million states).

## When to Use

- **Assignment problems:** Assigning n workers to n jobs with minimum cost, where n is small (up to ~20).
- **Travelling Salesman Problem:** Finding the shortest Hamiltonian cycle through all cities.
- **Subset selection problems:** When you need to enumerate subsets and the universe is small.
- **Competitive programming:** Many contest problems involve bitmask DP for problems on small sets (permutations, matchings, coverings).
- **Scheduling with constraints:** Scheduling tasks where each task has prerequisites or conflicts representable as sets.

## When NOT to Use

- **Large n (n > 25):** The 2^n factor makes this infeasible for large inputs. For assignment problems with large n, use the Hungarian algorithm (O(n^3)).
- **When polynomial algorithms exist:** Many problems solvable with bitmask DP have polynomial-time solutions for special cases (e.g., bipartite matching via Hopcroft-Karp, assignment via the Hungarian algorithm).
- **Sparse or structured inputs:** When the problem structure allows pruning or decomposition, specialized algorithms will outperform bitmask DP.
- **Approximation is acceptable:** For NP-hard problems like TSP on large inputs, approximation algorithms or heuristics (nearest neighbor, 2-opt, Christofides) are more practical.

## Comparison

| Algorithm           | Time          | Space      | Notes                                      |
|--------------------|---------------|------------|--------------------------------------------|
| **Bitmask DP**     | **O(n^2 * 2^n)** | **O(2^n)** | **Exact; practical for n <= 20**           |
| Hungarian Algorithm | O(n^3)        | O(n^2)    | Polynomial; best for assignment problems   |
| Brute Force         | O(n!)         | O(n)      | Try all permutations; infeasible for n > 12|
| Branch and Bound    | O(n!) worst   | O(n)      | Pruning helps in practice; no guarantee    |
| Greedy Heuristic    | O(n^2)        | O(n)      | Fast but not optimal                       |

## Implementations

| Language   | File                                        |
|------------|---------------------------------------------|
| Python     | [bitmask_dp.py](python/bitmask_dp.py)       |
| Java       | [BitmaskDp.java](java/BitmaskDp.java)       |
| C++        | [bitmask_dp.cpp](cpp/bitmask_dp.cpp)        |
| C          | [bitmask_dp.c](c/bitmask_dp.c)             |
| Go         | [bitmask_dp.go](go/bitmask_dp.go)          |
| TypeScript | [bitmaskDp.ts](typescript/bitmaskDp.ts)     |
| Rust       | [bitmask_dp.rs](rust/bitmask_dp.rs)        |
| Kotlin     | [BitmaskDp.kt](kotlin/BitmaskDp.kt)        |
| Swift      | [BitmaskDp.swift](swift/BitmaskDp.swift)    |
| Scala      | [BitmaskDp.scala](scala/BitmaskDp.scala)   |
| C#         | [BitmaskDp.cs](csharp/BitmaskDp.cs)        |

## References

- Halim, S., & Halim, F. (2013). *Competitive Programming 3*. Chapter 8: Advanced Topics.
- Held, M., & Karp, R. M. (1962). "A Dynamic Programming Approach to Sequencing Problems." *Journal of the Society for Industrial and Applied Mathematics*, 10(1), 196-210.
- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 15-4: Printing neatly (bitmask DP variant).
- [Bitmask DP -- CP-Algorithms](https://cp-algorithms.com/combinatorics/profile-dynamics.html)
