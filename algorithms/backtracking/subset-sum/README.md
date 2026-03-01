# Subset Sum

## Overview

The Subset Sum problem asks whether there exists a subset of a given set of integers that sums to a specified target value. For example, given the set {3, 34, 4, 12, 5, 2} and target 9, the answer is yes because the subset {4, 3, 2} sums to 9. This is one of the fundamental problems in computer science and is known to be NP-complete.

The backtracking approach explores all possible subsets by making a binary choice at each element: include it or exclude it. At each step, if the remaining target becomes zero, a valid subset has been found. If the remaining target becomes negative or all elements have been considered without reaching zero, the algorithm backtracks. Pruning -- skipping branches that cannot possibly lead to a solution -- can significantly reduce the search space in practice.

The Subset Sum problem has deep connections to cryptography (knapsack-based cryptosystems), resource allocation (selecting items within a budget), and computational complexity theory (it is one of Karp's 21 NP-complete problems).

## How It Works

### Steps:

1. Start with the full array and the target sum.
2. For each element, make two recursive calls:
   - **Include** the element: subtract its value from the target and recurse on the remaining elements.
   - **Exclude** the element: keep the target unchanged and recurse on the remaining elements.
3. **Base cases:**
   - If the target equals 0, return true (a valid subset has been found -- the empty subset sums to 0).
   - If no elements remain and the target is not 0, return false.
4. If either branch returns true, the answer is true.

## Pseudocode

```
function subsetSum(arr, n, target):
    return backtrack(arr, n, 0, target)

function backtrack(arr, n, index, remaining):
    // Base case: target reached
    if remaining == 0:
        return true

    // Base case: no elements left or remaining became negative
    if index >= n or remaining < 0:
        return false

    // Pruning: if array is sorted and current element exceeds remaining,
    // no further elements can help either
    if arr[index] > remaining:
        return backtrack(arr, n, index + 1, remaining)   // skip (exclude)

    // Branch 1: include arr[index]
    if backtrack(arr, n, index + 1, remaining - arr[index]):
        return true

    // Branch 2: exclude arr[index]
    return backtrack(arr, n, index + 1, remaining)
```

**Optimization with sorting:** If the input array is sorted in ascending order before the search begins, the pruning condition `arr[index] > remaining` allows the algorithm to skip all remaining elements at once, since they are all at least as large. This can dramatically reduce the search space.

## Example

Array: [3, 34, 4, 12, 5, 2], Target: 9

| Step | Index | Element | Action   | Remaining target | Result     |
|------|-------|---------|----------|-----------------|------------|
| 1    | 0     | 3       | Include  | 9 - 3 = 6       | Recurse    |
| 2    | 1     | 34      | Exclude  | 6                | 34 > 6, skip |
| 3    | 2     | 4       | Include  | 6 - 4 = 2       | Recurse    |
| 4    | 3     | 12      | Exclude  | 2                | 12 > 2, skip |
| 5    | 4     | 5       | Exclude  | 2                | 5 > 2, skip  |
| 6    | 5     | 2       | Include  | 2 - 2 = 0       | Found!     |

Subset found: {3, 4, 2} sums to 9.

### Decision tree (abbreviated):

```
                        target=9, idx=0
                       /                \
              include 3                 exclude 3
             target=6, idx=1           target=9, idx=1
            /            \                  ...
      include 34      exclude 34
      (34>6, prune)   target=6, idx=2
                      /            \
               include 4        exclude 4
              target=2, idx=3   target=6, idx=3
                   ...              ...
              (eventually: include 2, target=0 -> FOUND)
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(n)  |
| Average | O(2^n) | O(n)  |
| Worst   | O(2^n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n):** If the target is 0, the algorithm immediately returns true (the empty subset). If a greedy path finds a solution without backtracking, only n elements are examined.

- **Average/Worst Case -- O(2^n):** Each element has two choices (include or exclude), creating a binary tree of depth n with up to 2^n leaf nodes. Without additional pruning or memoization, all subsets may need to be examined.

- **Space -- O(n):** The recursion depth is at most n (one level per element). No additional data structures beyond the call stack are needed.

**Note:** A dynamic programming approach can solve this in O(n * target) time using O(target) space, which is pseudo-polynomial. The backtracking approach presented here is more memory-efficient for large targets but slower in the worst case.

## Applications

- **Cryptography:** Knapsack-based public-key cryptosystems (Merkle-Hellman).
- **Resource allocation:** Selecting projects or tasks that fit within a budget.
- **Bin packing:** Determining if items can fill a container exactly.
- **Financial auditing:** Finding combinations of transactions that match a total.
- **Computational complexity:** Canonical NP-complete problem used in reductions.

## When NOT to Use

- **When the target value is small relative to n:** Dynamic programming (DP) solves the problem in O(n * target) time, which is far more efficient when the target is polynomially bounded. For example, with n=20 elements and target=100, DP performs ~2,000 operations versus up to 2^20 = ~1,000,000 for backtracking.
- **When approximate answers suffice:** Fully polynomial-time approximation schemes (FPTAS) can find a subset that sums close to the target in polynomial time, avoiding the exponential cost entirely.
- **Very large input sets (n > 40) without pruning opportunities:** Even with pruning, backtracking can be impractical for large n. Meet-in-the-middle splits the set into two halves and solves each in O(2^(n/2)) time, which is significantly faster.
- **When all subsets summing to the target are needed for large n:** Enumerating all solutions is inherently exponential and no algorithm can avoid this. However, DP-based counting can determine the number of solutions efficiently without listing them.
- **Negative numbers in the input:** The standard pruning technique (skipping elements larger than the remaining target) does not apply when negative numbers are present, as including a negative number can reduce the running sum. The backtracking approach must be modified or replaced with DP.

## Comparison

| Approach | Time | Space | Handles Negatives? | Notes |
|----------|------|-------|--------------------|-------|
| Backtracking (this) | O(2^n) | O(n) | Yes (but less pruning) | Simple; effective for small n with good pruning |
| Backtracking + sorting | O(2^n) | O(n) | No (requires non-negative) | Sorting enables early termination; practical speedup |
| Dynamic Programming | O(n * target) | O(target) | Yes (with offset) | Pseudo-polynomial; best when target is small |
| Meet-in-the-Middle | O(2^(n/2) * n) | O(2^(n/2)) | Yes | Splits problem in half; practical for n up to ~40 |
| Randomized / FPTAS | Polynomial | Polynomial | Depends | Approximation only; useful when exact answer is not required |

For most practical applications with moderate n (up to about 20-25), backtracking with sorting and pruning is simple and effective. For larger instances or when the target is bounded, dynamic programming is the standard choice.

## Implementations

| Language   | File |
|------------|------|
| Python     | [subset_sum.py](python/subset_sum.py) |
| Java       | [SubsetSum.java](java/SubsetSum.java) |
| C++        | [subset_sum.cpp](cpp/subset_sum.cpp) |
| C          | [subset_sum.c](c/subset_sum.c) |
| Go         | [subset_sum.go](go/subset_sum.go) |
| TypeScript | [subsetSum.ts](typescript/subsetSum.ts) |
| Rust       | [subset_sum.rs](rust/subset_sum.rs) |
| Kotlin     | [SubsetSum.kt](kotlin/SubsetSum.kt) |
| Swift      | [SubsetSum.swift](swift/SubsetSum.swift) |
| Scala      | [SubsetSum.scala](scala/SubsetSum.scala) |
| C#         | [SubsetSum.cs](csharp/SubsetSum.cs) |

## References

- Karp, R. M. (1972). Reducibility among Combinatorial Problems. In *Complexity of Computer Computations*, pp. 85-103. Plenum Press.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 35.5.
- [Subset sum problem -- Wikipedia](https://en.wikipedia.org/wiki/Subset_sum_problem)
