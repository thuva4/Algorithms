# Partition Problem

## Overview

The partition problem determines whether a given array can be partitioned into two subsets with equal sum. This is a special case of the subset sum problem. It uses dynamic programming to check if a subset with sum equal to half the total sum exists. The partition problem is one of Karp's original 21 NP-complete problems (1972), making it a cornerstone of computational complexity theory. Despite being NP-complete in general, the pseudo-polynomial time DP solution is efficient when the sum of elements is not too large.

## How It Works

1. Calculate the total sum S. If S is odd, return 0 (impossible to split into two equal integer sums).
2. Set the target to S/2. The problem reduces to: does any subset sum to exactly S/2?
3. Use a 1D boolean DP array where `dp[j] = true` if a subset with sum j is achievable.
4. Initialize `dp[0] = true` (the empty subset has sum 0).
5. For each element `num` in the array, iterate j from S/2 down to `num`, setting `dp[j] = dp[j] OR dp[j - num]`.
6. The answer is `dp[S/2]`.

The reverse iteration in step 5 ensures each element is used at most once (0/1 knapsack style).

## Example

Given input: `[1, 5, 11, 5]`

Total sum = 22, target = 11.

Processing elements one by one (showing which sums become reachable):

| After element | Reachable sums                |
|---------------|-------------------------------|
| (initial)     | {0}                           |
| 1             | {0, 1}                        |
| 5             | {0, 1, 5, 6}                 |
| 11            | {0, 1, 5, 6, 11, 12, 16, 17} |
| 5             | {0, 1, 5, 6, 10, 11, ...}    |

Since 11 is reachable, the answer is **1** (can partition). Subsets: {1, 5, 5} and {11}.

Given input: `[1, 2, 3, 5]`

Total sum = 11, which is odd. Answer: **0** (cannot partition).

## Pseudocode

```
function canPartition(arr, n):
    S = sum(arr)
    if S is odd:
        return 0

    target = S / 2
    dp = boolean array of size target + 1, initialized to false
    dp[0] = true

    for each num in arr:
        for j from target down to num:
            dp[j] = dp[j] OR dp[j - num]

    return 1 if dp[target] else 0
```

## Complexity Analysis

| Case    | Time    | Space |
|---------|---------|-------|
| Best    | O(n*S)  | O(S)  |
| Average | O(n*S)  | O(S)  |
| Worst   | O(n*S)  | O(S)  |

Where S is the total sum of elements. The time complexity is pseudo-polynomial -- polynomial in the numeric value of the input but exponential in the number of bits needed to represent it. The 1D DP array reduces space from O(n*S) (2D table) to O(S).

## Applications

- **Load balancing:** Distributing tasks across two processors to minimize the difference in total workload.
- **Resource allocation:** Splitting a set of resources between two teams as fairly as possible.
- **Task scheduling:** Assigning jobs to two machines to equalize completion times.
- **Fair division problems:** Dividing assets in a way that both parties receive equal total value.
- **Cryptography:** The hardness of the subset sum problem (parent of partition) underlies certain cryptographic schemes.

## When NOT to Use

- **When the sum is very large:** The O(n*S) complexity becomes impractical if S is in the billions. Consider approximation algorithms or meet-in-the-middle approaches.
- **More than two partitions:** This algorithm only handles two-way partitioning. The k-way partition problem requires different techniques (e.g., dynamic programming over subsets for k=3).
- **Minimizing difference rather than exact equality:** If you want to minimize |sum1 - sum2| rather than requiring exact equality, a modified DP is needed.
- **Floating-point values:** The DP approach relies on integer indexing. Floating-point sums require different handling.

## Comparison

| Algorithm           | Time        | Space  | Notes                                    |
|---------------------|-------------|--------|------------------------------------------|
| DP (this)           | O(n*S)      | O(S)   | Pseudo-polynomial; exact answer           |
| Brute Force         | O(2^n)      | O(n)   | Exponential; checks all subsets           |
| Meet in the Middle  | O(2^(n/2))  | O(2^(n/2)) | Better for small n, large S           |
| Greedy (LPT)       | O(n log n)  | O(1)   | Heuristic; no exact guarantee             |
| Karmarkar-Karp      | O(n log n)  | O(n)   | Differencing heuristic; good in practice  |

## Implementations

| Language   | File |
|------------|------|
| Python     | [can_partition.py](python/can_partition.py) |
| Java       | [CanPartition.java](java/CanPartition.java) |
| C++        | [can_partition.cpp](cpp/can_partition.cpp) |
| C          | [can_partition.c](c/can_partition.c) |
| Go         | [can_partition.go](go/can_partition.go) |
| TypeScript | [canPartition.ts](typescript/canPartition.ts) |
| Rust       | [can_partition.rs](rust/can_partition.rs) |
| Kotlin     | [CanPartition.kt](kotlin/CanPartition.kt) |
| Swift      | [CanPartition.swift](swift/CanPartition.swift) |
| Scala      | [CanPartition.scala](scala/CanPartition.scala) |
| C#         | [CanPartition.cs](csharp/CanPartition.cs) |

## References

- Karp, R. M. (1972). "Reducibility among combinatorial problems." In *Complexity of Computer Computations*, pp. 85-103.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16: Dynamic Programming.
- [Partition problem -- Wikipedia](https://en.wikipedia.org/wiki/Partition_problem)
