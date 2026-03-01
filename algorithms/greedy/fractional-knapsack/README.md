# Fractional Knapsack

## Overview

The Fractional Knapsack problem is a classic optimization problem where the goal is to maximize the total value of items placed in a knapsack with a limited weight capacity. Unlike the 0/1 Knapsack problem, items can be broken into fractions, allowing you to take a portion of an item if the whole item does not fit.

Because fractional items are allowed, the greedy approach of always taking the item with the highest value-to-weight ratio is provably optimal. This makes the Fractional Knapsack problem one of the foundational examples of problems where a greedy strategy yields a globally optimal solution.

## How It Works

1. **Compute ratios:** For each item, calculate the value-to-weight ratio (value / weight).
2. **Sort by ratio:** Sort all items in descending order of their value-to-weight ratio.
3. **Greedy selection:** Iterate through the sorted items:
   a. If the item fits entirely in the remaining capacity, take all of it and reduce the remaining capacity.
   b. If the item does not fit entirely, take as much as possible (a fraction equal to remaining capacity / item weight) and fill the knapsack completely.
4. **Return** the total value accumulated.

The greedy choice property holds because taking the highest-ratio item first is always at least as good as any other choice. If we skip a high-ratio item in favor of a lower-ratio item, we can always swap them and improve or maintain the total value.

## Worked Example

**Input:** Capacity = 50, Items: [(value=60, weight=10), (value=100, weight=20), (value=120, weight=30)]

**Step 1 -- Compute ratios:**

| Item | Value | Weight | Ratio (V/W) |
|------|-------|--------|-------------|
| A    | 60    | 10     | 6.0         |
| B    | 100   | 20     | 5.0         |
| C    | 120   | 30     | 4.0         |

**Step 2 -- Sort by ratio (descending):** A(6.0), B(5.0), C(4.0)

**Step 3 -- Greedy selection:**

| Item | Remaining Capacity | Action | Value Gained | Running Total |
|------|--------------------|--------|-------------|---------------|
| A    | 50                 | Take all (weight=10) | 60.0 | 60.0 |
| B    | 40                 | Take all (weight=20) | 100.0 | 160.0 |
| C    | 20                 | Take 20/30 = 2/3 fraction | 120 * (2/3) = 80.0 | 240.0 |

**Result:** Maximum value = 240.00. We took all of A, all of B, and 2/3 of C.

## Pseudocode

```
function fractionalKnapsack(capacity, items):
    n = length(items)
    if n == 0 or capacity == 0:
        return 0

    // Compute value-to-weight ratio for each item
    for each item in items:
        item.ratio = item.value / item.weight

    // Sort by ratio in descending order
    sort items by ratio descending

    totalValue = 0.0
    remainingCapacity = capacity

    for each item in items:
        if remainingCapacity == 0:
            break

        if item.weight <= remainingCapacity:
            // Take the whole item
            totalValue += item.value
            remainingCapacity -= item.weight
        else:
            // Take a fraction of the item
            fraction = remainingCapacity / item.weight
            totalValue += item.value * fraction
            remainingCapacity = 0

    return totalValue
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** Dominated by the sorting step. The greedy selection itself is O(n).
- **Space -- O(n):** Requires storage for the items with their computed ratios and sorting overhead.

If the items are already sorted by ratio, the algorithm runs in O(n) time.

## When to Use

- **Resource allocation:** Distributing a limited budget, bandwidth, or capacity among competing demands where partial allocation is meaningful.
- **Investment portfolio optimization:** Allocating funds across investment opportunities where you can invest any fraction of available capital.
- **Loading cargo efficiently:** Filling a container with goods where items can be divided (e.g., bulk goods like grain, fuel, or ore).
- **Time budgeting:** Allocating limited time across tasks where partial completion yields proportional benefit.
- **Teaching greedy algorithms:** The Fractional Knapsack is a canonical example demonstrating when and why greedy strategies work.

## When NOT to Use

- **Indivisible items (0/1 Knapsack):** If items cannot be divided (e.g., discrete objects like laptops, tools, or packages), the greedy approach by ratio does not yield an optimal solution. Use dynamic programming for the 0/1 Knapsack instead.
- **Multiple constraints:** If there are additional constraints beyond weight (e.g., volume, count limits), the problem becomes a multi-dimensional knapsack, which is NP-hard and requires different approaches.
- **Non-linear value functions:** If the value of a partial item is not proportional to the fraction taken (e.g., diminishing returns or threshold effects), the greedy ratio-based approach does not apply.
- **Very small item counts:** For very few items, a brute-force enumeration of all possible fractions might be simpler and avoids sorting overhead.

## Comparison

| Problem Variant | Optimal Strategy | Time | Notes |
|----------------|-----------------|------|-------|
| Fractional Knapsack (this) | Greedy by ratio | O(n log n) | Items divisible, greedy is optimal |
| 0/1 Knapsack | Dynamic Programming | O(nW) | Items indivisible, pseudo-polynomial |
| Bounded Knapsack | DP with multiplicity | O(nW) | Limited copies of each item |
| Unbounded Knapsack | DP | O(nW) | Unlimited copies of each item |

| Greedy Approach | Correct for Fractional? | Correct for 0/1? |
|----------------|------------------------|-------------------|
| Sort by value/weight ratio | Yes (provably optimal) | No (counterexample exists) |
| Sort by value only | No | No |
| Sort by weight only | No | No |

The key distinction is that the fractional variant allows the greedy approach to work because any "gap" left by not taking the best-ratio item can always be filled with a fraction of it. In the 0/1 variant, this is not possible, and the greedy approach can fail dramatically.

## Implementations

| Language   | File |
|------------|------|
| Python     | [fractional_knapsack.py](python/fractional_knapsack.py) |
| Java       | [FractionalKnapsack.java](java/FractionalKnapsack.java) |
| C++        | [fractional_knapsack.cpp](cpp/fractional_knapsack.cpp) |
| C          | [fractional_knapsack.c](c/fractional_knapsack.c) |
| Go         | [fractional_knapsack.go](go/fractional_knapsack.go) |
| TypeScript | [fractionalKnapsack.ts](typescript/fractionalKnapsack.ts) |
| Rust       | [fractional_knapsack.rs](rust/fractional_knapsack.rs) |
| Kotlin     | [FractionalKnapsack.kt](kotlin/FractionalKnapsack.kt) |
| Swift      | [FractionalKnapsack.swift](swift/FractionalKnapsack.swift) |
| Scala      | [FractionalKnapsack.scala](scala/FractionalKnapsack.scala) |
| C#         | [FractionalKnapsack.cs](csharp/FractionalKnapsack.cs) |

## References

- Dantzig, G. B. (1957). "Discrete-variable extremum problems." *Operations Research*, 5(2), 266-288.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16: Greedy Algorithms.
- Kleinberg, J., & Tardos, E. (2006). *Algorithm Design*. Addison-Wesley. Chapter 4: Greedy Algorithms.
- [Continuous knapsack problem -- Wikipedia](https://en.wikipedia.org/wiki/Continuous_knapsack_problem)
