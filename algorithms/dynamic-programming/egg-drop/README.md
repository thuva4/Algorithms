# Egg Drop Problem

## Overview

The Egg Drop Problem determines the minimum number of trials needed in the worst case to find the critical floor from which an egg breaks, given a certain number of eggs and floors. If an egg is dropped from above the critical floor, it breaks; if dropped from below, it survives. The challenge is to design a strategy that minimizes the worst-case number of drops needed to identify the exact critical floor.

This is a classic dynamic programming problem that models decision-making under uncertainty with limited resources. It generalizes binary search to the case where the "probe" can fail (the egg breaks), limiting further exploration.

## How It Works

Use dynamic programming where `dp[e][f]` represents the minimum number of trials needed with `e` eggs and `f` floors.

For each floor `x` from 1 to f, try dropping an egg:
- **If it breaks:** The critical floor is below x. Search floors 1 to x-1 with e-1 eggs: `dp[e-1][x-1]`.
- **If it survives:** The critical floor is at or above x. Search floors x+1 to f with e eggs: `dp[e][f-x]`.
- Take the **worst case** (max of break/survive) for each choice of x, and **minimize** over all choices.

Recurrence: `dp[e][f] = 1 + min over x in [1..f] of max(dp[e-1][x-1], dp[e][f-x])`

Base cases:
- `dp[e][0] = 0` (no floors means no trials needed)
- `dp[e][1] = 1` (one floor means one trial)
- `dp[1][f] = f` (one egg means linear search from floor 1)

## Worked Example

**2 eggs, 10 floors:**

Building the DP table (showing key entries):

| Eggs\Floors | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|-------------|---|---|---|---|---|---|---|---|---|---|-----|
| 1           | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10  |
| 2           | 0 | 1 | 2 | 2 | 3 | 3 | 3 | 4 | 4 | 4 | 4   |

For dp[2][10], the optimal first drop is at floor 4:
- **Breaks (floor 4):** Search floors 1-3 with 1 egg: dp[1][3] = 3 trials.
- **Survives (floor 4):** Search floors 5-10 with 2 eggs: dp[2][6] = 3 trials.
- Worst case: max(3, 3) = 3. Plus the current trial: 1 + 3 = **4**.

**Answer: dp[2][10] = 4.** The strategy: drop first egg at floor 4, then 7, then 9, then 10 (adjusting after breaks with linear search).

## Pseudocode

```
function eggDrop(eggs, floors):
    // dp[e][f] = min trials with e eggs and f floors
    dp = 2D array of size (eggs+1) x (floors+1)

    // Base cases
    for e = 1 to eggs:
        dp[e][0] = 0
        dp[e][1] = 1
    for f = 1 to floors:
        dp[1][f] = f

    // Fill table
    for e = 2 to eggs:
        for f = 2 to floors:
            dp[e][f] = infinity
            for x = 1 to f:
                worstCase = 1 + max(dp[e-1][x-1], dp[e][f-x])
                dp[e][f] = min(dp[e][f], worstCase)

    return dp[eggs][floors]
```

Note: The inner loop over x can be optimized to O(log f) using binary search on the crossover point where dp[e-1][x-1] >= dp[e][f-x], since dp[e-1][x-1] is increasing in x and dp[e][f-x] is decreasing in x.

## Complexity Analysis

| Case    | Time      | Space   |
|---------|-----------|---------|
| All     | O(e*f^2)  | O(e*f)  |

**Why these complexities?**

- **Time -- O(e * f^2):** For each of the e*f states, we try up to f possible floors, each in O(1). With the binary search optimization, this improves to O(e * f * log f).

- **Space -- O(e * f):** The 2D DP table has e rows and f columns. This can be reduced to O(f) by noting that dp[e] only depends on dp[e-1].

An alternative O(e * f) formulation exists: define `dp[t][e]` = maximum floors checkable with t trials and e eggs. Then `dp[t][e] = dp[t-1][e-1] + dp[t-1][e] + 1`. Binary search on t to find the smallest t where dp[t][eggs] >= floors.

## When to Use

- **Testing strategies with limited resources:** When destructive testing is involved and you want to minimize the number of tests in the worst case.
- **Software testing:** Determining a failure threshold (e.g., maximum load before a server crashes) with a limited number of test environments.
- **Reliability engineering:** Finding the breaking point of a component with limited test specimens.
- **Decision theory:** Any scenario where you make sequential decisions, each of which either "succeeds" or "fails," permanently consuming a resource on failure.
- **Binary search with fault tolerance:** Generalizing binary search to cases where failed probes eliminate the probe itself.

## When NOT to Use

- **Unlimited eggs:** With unlimited eggs, binary search finds the answer in O(log f) trials. No DP is needed.
- **Very large e and f:** When both parameters are very large, even the O(e * f * log f) approach may be too slow. Use the mathematical formulation with `dp[t][e]` and binary search on t for O(e * log f) time.
- **When the cost function is not uniform:** If different floors have different dropping costs, the standard formulation does not apply directly.
- **Probabilistic models:** If eggs break with some probability rather than deterministically above a threshold, different techniques (e.g., information-theoretic approaches) are needed.

## Comparison

| Algorithm                  | Time           | Space  | Notes                                    |
|---------------------------|----------------|--------|------------------------------------------|
| **Standard DP**            | **O(e*f^2)**   | **O(e*f)** | **Simple; direct recurrence**          |
| Binary Search Optimized DP | O(e*f*log f)   | O(e*f) | Uses monotonicity of optimal floor      |
| Inverse DP (dp[t][e])      | O(e*log f)     | O(e)   | Fastest; binary search on trials        |
| Binary Search (unlimited)  | O(log f)       | O(1)   | Only works with unlimited eggs          |
| Linear Search              | O(f)           | O(1)   | Only 1 egg needed; worst case           |

## Implementations

| Language   | File |
|------------|------|
| Python     | [egg_drop.py](python/egg_drop.py) |
| Java       | [EggDrop.java](java/EggDrop.java) |
| C++        | [egg_drop.cpp](cpp/egg_drop.cpp) |
| C          | [egg_drop.c](c/egg_drop.c) |
| Go         | [egg_drop.go](go/egg_drop.go) |
| TypeScript | [eggDrop.ts](typescript/eggDrop.ts) |
| Rust       | [egg_drop.rs](rust/egg_drop.rs) |
| Kotlin     | [EggDrop.kt](kotlin/EggDrop.kt) |
| Swift      | [EggDrop.swift](swift/EggDrop.swift) |
| Scala      | [EggDrop.scala](scala/EggDrop.scala) |
| C#         | [EggDrop.cs](csharp/EggDrop.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Problem 15-2.
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Pearson. Chapter 6: Dynamic Programming.
- [Egg Dropping Puzzle -- Wikipedia](https://en.wikipedia.org/wiki/Egg_dropping_puzzle)
- [Egg Drop Problem -- GeeksforGeeks](https://www.geeksforgeeks.org/egg-dropping-puzzle-dp-11/)
