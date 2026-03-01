# Fibonacci

## Overview

The Fibonacci sequence is one of the most fundamental sequences in mathematics and computer science. Each number in the sequence is the sum of the two preceding numbers, starting from 0 and 1: 0, 1, 1, 2, 3, 5, 8, 13, 21, and so on. The dynamic programming approach computes Fibonacci numbers efficiently by storing previously computed values, avoiding the exponential redundancy of the naive recursive solution.

While the naive recursive approach has O(2^n) time complexity due to repeated subproblem computation, the DP approach (using either memoization or tabulation) reduces this to O(n) time, making it a classic example of how dynamic programming transforms an intractable problem into an efficient one.

## How It Works

The Fibonacci sequence is defined by the recurrence relation F(n) = F(n-1) + F(n-2), with base cases F(0) = 0 and F(1) = 1. The dynamic programming approach builds up the solution from the base cases, computing each Fibonacci number exactly once. An optimized version uses only two variables instead of an entire array, since each value depends only on the two previous values.

### Example

Computing `F(7)`:

**Tabulation (bottom-up) approach:**

| Step | i | F(i-2) | F(i-1) | F(i) = F(i-1) + F(i-2) |
|------|---|--------|--------|--------------------------|
| Base | 0 | - | - | 0 |
| Base | 1 | - | - | 1 |
| 1 | 2 | 0 | 1 | 1 |
| 2 | 3 | 1 | 1 | 2 |
| 3 | 4 | 1 | 2 | 3 |
| 4 | 5 | 2 | 3 | 5 |
| 5 | 6 | 3 | 5 | 8 |
| 6 | 7 | 5 | 8 | 13 |

Result: `F(7) = 13`

The space-optimized version only keeps track of the two most recent values at each step, using variables `prev2` and `prev1`, and updating them as it progresses.

## Pseudocode

```
function fibonacci(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1

    prev2 = 0
    prev1 = 1

    for i from 2 to n:
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current

    return prev1
```

The space-optimized version above uses O(1) space by maintaining only the two most recent values. A memoization-based approach would store all computed values in an array or hash map, using O(n) space but allowing random access to any previously computed Fibonacci number.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** Even in the best case (excluding trivial base cases), the algorithm must iterate from 2 to n, performing a constant amount of work at each step. There is no way to skip intermediate values since each depends on the two before it.

- **Average Case -- O(n):** The algorithm always performs exactly n - 1 additions regardless of the input value, giving consistent O(n) performance.

- **Worst Case -- O(n):** The algorithm performs a single linear pass through the values 2 to n. No input can cause worse-than-linear performance since there are no conditional branches or data-dependent operations.

- **Space -- O(1):** The space-optimized version uses only two variables (`prev1` and `prev2`) regardless of n. If the full table is stored (for memoization), space becomes O(n).

## When to Use

- **Learning dynamic programming:** Fibonacci is the canonical introductory example for understanding memoization and tabulation.
- **When you need Fibonacci numbers in sequence:** The iterative approach efficiently generates all Fibonacci numbers up to F(n) in a single pass.
- **Subproblem in larger algorithms:** Many problems in combinatorics, tiling, and counting reduce to Fibonacci-like recurrences.
- **When constant space is important:** The optimized version uses only O(1) extra space while still running in linear time.

## When NOT to Use

- **When you need F(n) for extremely large n:** For very large n (e.g., n > 10^18), the O(n) iterative approach is too slow. Matrix exponentiation computes F(n) in O(log n) time.
- **When you need arbitrary Fibonacci numbers without computing predecessors:** If you need F(1000) but not F(1) through F(999), the closed-form Binet's formula or matrix exponentiation is more appropriate.
- **When exact precision matters for very large results:** Fibonacci numbers grow exponentially, and big-integer arithmetic may become a bottleneck.

## Comparison with Similar Algorithms

| Approach               | Time       | Space | Notes                                          |
|------------------------|-----------|-------|-------------------------------------------------|
| Naive Recursion        | O(2^n)    | O(n)  | Exponential due to repeated subproblems         |
| Memoization (top-down) | O(n)      | O(n)  | Stores all values; recursive call overhead       |
| Tabulation (bottom-up) | O(n)      | O(n)  | Iterative; fills table from base cases           |
| Space-optimized DP     | O(n)      | O(1)  | Only keeps two previous values                   |
| Matrix Exponentiation  | O(log n)  | O(1)  | Best for very large n; uses 2x2 matrix power     |

## Implementations

| Language   | File |
|------------|------|
| C          | [fibonacci.c](c/fibonacci.c) |
| C#         | [Fibonacci.cs](csharp/Fibonacci.cs) |
| C++        | [fibonacci.cpp](cpp/fibonacci.cpp) |
| Go         | [fibonacci.go](go/fibonacci.go) |
| Java       | [Fibonacci.java](java/Fibonacci.java) |
| TypeScript | [Fibonacci.js](typescript/Fibonacci.js) |
| Kotlin     | [Fibonacci.kt](kotlin/Fibonacci.kt) |
| Python     | [Fibonacci.py](python/Fibonacci.py) |
| Rust       | [Fibonacci.rs](rust/Fibonacci.rs) |
| Scala      | [Fibonacci.scala](scala/Fibonacci.scala) |
| Swift      | [Fibonacci.swift](swift/Fibonacci.swift) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 1.2.8: Fibonacci Numbers.
- [Fibonacci Number -- Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)
