# Matrix Chain Multiplication

## Overview

The Matrix Chain Multiplication problem determines the most efficient way to multiply a chain of matrices. The problem is not about performing the multiplications themselves, but about finding the optimal order (parenthesization) in which to multiply the matrices so that the total number of scalar multiplications is minimized.

Given a chain of n matrices A1, A2, ..., An, where matrix Ai has dimensions p[i-1] x p[i], the algorithm finds the minimum number of scalar multiplications needed to compute the product A1 * A2 * ... * An. Matrix multiplication is associative, so all parenthesizations yield the same result, but the computational cost varies dramatically depending on the order.

For example, given three matrices with dimensions 10x20, 20x30, and the dimension array [10, 20, 30], the only way to multiply them costs 10 * 20 * 30 = 6000 scalar multiplications. With more matrices, the difference between the best and worst parenthesization can be enormous.

## How It Works

The algorithm uses a bottom-up dynamic programming approach. It builds a 2D table `m[i][j]` where each entry represents the minimum cost of multiplying the subchain from matrix i to matrix j.

1. **Base case:** A single matrix requires zero multiplications, so `m[i][i] = 0` for all i.
2. **Chain length iteration:** For chain lengths from 2 to n, consider all possible subchains of that length.
3. **Split point:** For each subchain from i to j, try every possible split point k (where i <= k < j). Splitting at k means multiplying the subchain (Ai...Ak) and (Ak+1...Aj) separately, then combining the results.
4. **Cost formula:** `m[i][j] = min over all k of { m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j] }`
5. **Result:** `m[1][n]` contains the minimum number of scalar multiplications for the entire chain.

### Example

Given dimensions `[10, 20, 30, 40, 30]` (four matrices: 10x20, 20x30, 30x40, 40x30):

**Building the DP table (1-indexed):**

Chain length 2:
- m[1][2] = 10 * 20 * 30 = 6000
- m[2][3] = 20 * 30 * 40 = 24000
- m[3][4] = 30 * 40 * 30 = 36000

Chain length 3:
- m[1][3] = min(m[1][1] + m[2][3] + 10*20*40, m[1][2] + m[3][3] + 10*30*40) = min(0 + 24000 + 8000, 6000 + 0 + 12000) = min(32000, 18000) = 18000
- m[2][4] = min(m[2][2] + m[3][4] + 20*30*30, m[2][3] + m[4][4] + 20*40*30) = min(0 + 36000 + 18000, 24000 + 0 + 24000) = min(54000, 48000) = 48000

Chain length 4:
- m[1][4] = min over k=1,2,3 of:
  - k=1: m[1][1] + m[2][4] + 10*20*30 = 0 + 48000 + 6000 = 54000
  - k=2: m[1][2] + m[3][4] + 10*30*30 = 6000 + 36000 + 9000 = 51000
  - k=3: m[1][3] + m[4][4] + 10*40*30 = 18000 + 0 + 12000 = 30000
- m[1][4] = 30000

Result: **30000** scalar multiplications.

## Pseudocode

```
function matrixChainOrder(p):
    n = length(p) - 1           // number of matrices
    m = 2D array of size n x n, initialized to 0

    for chainLen from 2 to n:
        for i from 1 to n - chainLen + 1:
            j = i + chainLen - 1
            m[i][j] = infinity
            for k from i to j - 1:
                cost = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j]
                if cost < m[i][j]:
                    m[i][j] = cost

    return m[1][n]
```

## Complexity Analysis

| Case    | Time     | Space   |
|---------|----------|---------|
| Best    | O(n^3)   | O(n^2)  |
| Average | O(n^3)   | O(n^2)  |
| Worst   | O(n^3)   | O(n^2)  |

**Why these complexities?**

- **Time -- O(n^3):** There are O(n^2) subproblems (all pairs i, j), and for each subproblem we try up to O(n) split points. Each split point evaluation takes O(1) time, giving O(n^3) overall.

- **Space -- O(n^2):** The algorithm stores the 2D table `m[i][j]` of size n x n. An optional second table stores the optimal split points for reconstruction.

## Applications

- **Compiler optimization:** Optimizing the evaluation order of chained operations.
- **Database query optimization:** Finding the best order to join multiple tables.
- **Polygon triangulation:** The problem of finding the minimum-cost triangulation of a convex polygon has the same structure.
- **Parsing:** CYK (Cocke-Younger-Kasami) parsing algorithm for context-free grammars uses a similar DP structure.
- **Scientific computing:** Optimizing tensor contractions in physics and machine learning.

## When NOT to Use

- **Only two matrices:** With two matrices, there is only one way to multiply them.
- **Matrices of uniform dimension:** When all matrices are square and the same size, all parenthesizations have the same cost.
- **When approximate solutions suffice:** For very long chains, heuristic approaches may be faster.

## Comparison with Similar Algorithms

| Algorithm                     | Time     | Space   | Notes                                        |
|-------------------------------|----------|---------|----------------------------------------------|
| Matrix Chain Multiplication   | O(n^3)   | O(n^2)  | Finds optimal parenthesization               |
| Hu-Shing Algorithm            | O(n log n)| O(n)   | Specialized for this problem; more complex    |
| Rod Cutting                   | O(n^2)   | O(n)    | 1D variant of similar optimization structure  |
| Optimal BST                   | O(n^3)   | O(n^2)  | Same DP pattern for binary search trees       |

## Implementations

| Language   | File |
|------------|------|
| Python     | [matrix_chain_order.py](python/matrix_chain_order.py) |
| Java       | [MatrixChainMultiplication.java](java/MatrixChainMultiplication.java) |
| TypeScript | [matrixChainOrder.ts](typescript/matrixChainOrder.ts) |
| C++        | [matrix_chain_order.cpp](cpp/matrix_chain_order.cpp) |
| C          | [matrix_chain_order.c](c/matrix_chain_order.c) |
| Go         | [MatrixChainOrder.go](go/MatrixChainOrder.go) |
| Rust       | [matrix_chain_order.rs](rust/matrix_chain_order.rs) |
| Kotlin     | [MatrixChainMultiplication.kt](kotlin/MatrixChainMultiplication.kt) |
| Swift      | [MatrixChainMultiplication.swift](swift/MatrixChainMultiplication.swift) |
| Scala      | [MatrixChainMultiplication.scala](scala/MatrixChainMultiplication.scala) |
| C#         | [MatrixChainMultiplication.cs](csharp/MatrixChainMultiplication.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 15.2: Matrix-chain multiplication.
- Hu, T. C., & Shing, M. T. (1982). Computation of matrix chain products. Part I. *SIAM Journal on Computing*, 11(2), 362-373.
- [Matrix Chain Multiplication -- Wikipedia](https://en.wikipedia.org/wiki/Matrix_chain_multiplication)
