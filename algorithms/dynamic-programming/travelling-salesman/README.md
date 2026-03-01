# Travelling Salesman Problem (TSP)

## Overview

The Travelling Salesman Problem asks for the minimum cost Hamiltonian cycle in a weighted graph -- that is, the shortest route that visits every city exactly once and returns to the starting city. This is one of the most studied problems in combinatorial optimization and is NP-hard. This implementation uses bitmask dynamic programming, known as the Held-Karp algorithm (1962), which provides an exact solution in O(2^n * n^2) time, a significant improvement over the O(n!) brute-force approach.

## How It Works

1. Represent the set of visited cities as a bitmask. `dp[mask][i]` stores the minimum cost to visit exactly the cities in `mask`, ending at city `i`, having started from city 0.
2. Initialize `dp[1][0] = 0` (start at city 0, only city 0 visited).
3. For each bitmask `mask` and each city `i` that is set in `mask`, try extending the path to each unvisited city `j`: `dp[mask | (1 << j)][j] = min(dp[mask | (1 << j)][j], dp[mask][i] + dist[i][j])`.
4. The answer is the minimum over all cities `i` of `dp[(1 << n) - 1][i] + dist[i][0]`, which represents completing the cycle back to city 0.

Input format: `[n, adj_matrix flattened row-major]` (n*n values).

## Example

Consider 4 cities with distance matrix:

```
     0    1    2    3
0  [ 0,  10,  15,  20 ]
1  [ 10,  0,  35,  25 ]
2  [ 15,  35,  0,  30 ]
3  [ 20,  25,  30,  0 ]
```

**Step-by-step (showing key DP transitions):**

Starting state: `dp[0001][0] = 0` (at city 0, visited {0})

Expand from city 0:
- `dp[0011][1] = 0 + 10 = 10` (visit city 1, cost 10)
- `dp[0101][2] = 0 + 15 = 15` (visit city 2, cost 15)
- `dp[1001][3] = 0 + 20 = 20` (visit city 3, cost 20)

Expand from city 1 (mask=0011):
- `dp[0111][2] = 10 + 35 = 45` (visit city 2 via 0->1->2)
- `dp[1011][3] = 10 + 25 = 35` (visit city 3 via 0->1->3)

Expand from city 2 (mask=0101):
- `dp[0111][1] = 15 + 35 = 50` -- but city 1 via 0->1 gave 45, so dp[0111][1] remains at a later-computed minimum
- `dp[1101][3] = 15 + 30 = 45`

...continuing for all states...

Final: minimum of `dp[1111][i] + dist[i][0]` for all i:
- `dp[1111][1] + dist[1][0]` = 45 + 10 = 55 -- but need to verify actual dp[1111][1]

The optimal tour is: 0 -> 1 -> 3 -> 2 -> 0 with cost 10 + 25 + 30 + 15 = **80**.

## Pseudocode

```
function tsp(dist, n):
    INF = infinity
    dp = 2D array [2^n][n], initialized to INF
    dp[1][0] = 0    // start at city 0

    for mask from 1 to 2^n - 1:
        for i from 0 to n - 1:
            if dp[mask][i] == INF: continue
            if bit i not set in mask: continue
            for j from 0 to n - 1:
                if bit j set in mask: continue    // already visited
                new_mask = mask | (1 << j)
                dp[new_mask][j] = min(dp[new_mask][j], dp[mask][i] + dist[i][j])

    // Close the cycle back to city 0
    full_mask = (1 << n) - 1
    result = INF
    for i from 1 to n - 1:
        result = min(result, dp[full_mask][i] + dist[i][0])

    return result
```

## Complexity Analysis

| Case    | Time          | Space       |
|---------|---------------|-------------|
| Best    | O(2^n * n^2)  | O(2^n * n)  |
| Average | O(2^n * n^2)  | O(2^n * n)  |
| Worst   | O(2^n * n^2)  | O(2^n * n)  |

**Why O(2^n * n^2)?** There are 2^n possible subsets, each with up to n possible "last city" states. For each state, we try extending to up to n cities. This gives 2^n * n * n = O(2^n * n^2) total work. While still exponential, this is vastly better than the O(n!) brute-force: for n=20, 2^20 * 400 is about 400 million, while 20! is about 2.4 * 10^18.

**Space:** The DP table has 2^n * n entries.

## Applications

- **Logistics and route optimization:** Planning delivery routes, garbage collection, and postal delivery.
- **Circuit board drilling:** Minimizing the travel distance of a drill head visiting all drill points.
- **DNA sequencing:** Finding the shortest superstring that contains all given fragments.
- **Telescope observation scheduling:** Minimizing slew time between target observations.
- **Vehicle routing:** The TSP is a building block for more complex vehicle routing problems (VRP).
- **Genome assembly:** Ordering DNA fragments to reconstruct a genome.

## When NOT to Use

- **Large n (> 25):** The O(2^n) space and time make the Held-Karp algorithm impractical beyond about 25 cities. For larger instances, use heuristics or approximation algorithms.
- **When an approximate solution suffices:** Algorithms like Christofides' (1.5-approximation for metric TSP), nearest-neighbor heuristic, or 2-opt local search are much faster and provide good solutions.
- **Asymmetric or non-metric instances with special structure:** Certain special cases (e.g., Euclidean TSP, Bitonic TSP) have more efficient exact or approximate solutions.
- **Online/dynamic settings:** If cities are added or removed over time, the entire DP must be recomputed.

## Comparison

| Algorithm           | Time           | Space       | Exact? | Notes                                |
|---------------------|----------------|-------------|--------|--------------------------------------|
| Held-Karp (this)    | O(2^n * n^2)   | O(2^n * n)  | Yes    | Best known exact for small n         |
| Brute Force         | O(n!)          | O(n)        | Yes    | Impractical for n > 12              |
| Branch and Bound    | O(2^n) avg     | O(n^2)      | Yes    | Practical with good bounds          |
| Nearest Neighbor    | O(n^2)         | O(n)        | No     | Greedy; can be up to log(n) * OPT   |
| Christofides        | O(n^3)         | O(n^2)      | No     | 1.5-approx for metric TSP           |
| 2-opt               | O(n^2) per iter | O(n)       | No     | Local search; good in practice       |
| Lin-Kernighan       | O(n^2.2)       | O(n)        | No     | State-of-the-art heuristic          |

## Implementations

| Language   | File |
|------------|------|
| Python     | [travelling_salesman.py](python/travelling_salesman.py) |
| Java       | [TravellingSalesman.java](java/TravellingSalesman.java) |
| C++        | [travelling_salesman.cpp](cpp/travelling_salesman.cpp) |
| C          | [travelling_salesman.c](c/travelling_salesman.c) |
| Go         | [travelling_salesman.go](go/travelling_salesman.go) |
| TypeScript | [travellingSalesman.ts](typescript/travellingSalesman.ts) |
| Rust       | [travelling_salesman.rs](rust/travelling_salesman.rs) |
| Kotlin     | [TravellingSalesman.kt](kotlin/TravellingSalesman.kt) |
| Swift      | [TravellingSalesman.swift](swift/TravellingSalesman.swift) |
| Scala      | [TravellingSalesman.scala](scala/TravellingSalesman.scala) |
| C#         | [TravellingSalesman.cs](csharp/TravellingSalesman.cs) |

## References

- Held, M., & Karp, R. M. (1962). "A Dynamic Programming Approach to Sequencing Problems." *Journal of the Society for Industrial and Applied Mathematics*. 10(1): 196-210.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 34: NP-Completeness (TSP as NP-hard).
- [Travelling Salesman Problem -- Wikipedia](https://en.wikipedia.org/wiki/Travelling_salesman_problem)
- [Held-Karp Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Held%E2%80%93Karp_algorithm)
