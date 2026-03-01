# Strassen's Matrix Multiplication

## Overview

Strassen's algorithm multiplies two n x n matrices using 7 recursive multiplications instead of the naive 8, achieving O(n^2.807) time complexity compared to the O(n^3) of standard matrix multiplication. Published by Volker Strassen in 1969, it was the first algorithm to prove that matrix multiplication could be done faster than O(n^3), a result that was widely unexpected at the time. The algorithm divides each matrix into four quadrants and computes seven carefully chosen products whose sums and differences yield the result matrix.

While faster algorithms exist theoretically (the current best is approximately O(n^2.371)), Strassen's algorithm remains the most practical sub-cubic method and is used in numerical libraries for large matrix operations.

## How It Works

Given two n x n matrices A and B, to compute C = A * B:

1. **Divide** each matrix into four n/2 x n/2 submatrices:
   ```
   A = | A11  A12 |    B = | B11  B12 |    C = | C11  C12 |
       | A21  A22 |        | B21  B22 |        | C21  C22 |
   ```

2. **Compute 7 products** using specific combinations:
   - M1 = (A11 + A22) * (B11 + B22)
   - M2 = (A21 + A22) * B11
   - M3 = A11 * (B12 - B22)
   - M4 = A22 * (B21 - B11)
   - M5 = (A11 + A12) * B22
   - M6 = (A21 - A11) * (B11 + B12)
   - M7 = (A12 - A22) * (B21 + B22)

3. **Combine** the 7 products:
   - C11 = M1 + M4 - M5 + M7
   - C12 = M3 + M5
   - C21 = M2 + M4
   - C22 = M1 - M2 + M3 + M6

4. For small matrices (n <= threshold), use standard O(n^3) multiplication.

## Worked Example

Multiply two 2x2 matrices:

```
A = | 1  3 |    B = | 5  7 |
    | 2  4 |        | 6  8 |
```

Here A11=1, A12=3, A21=2, A22=4, B11=5, B12=7, B21=6, B22=8.

**Step 1: Compute the 7 products**
- M1 = (1 + 4) * (5 + 8) = 5 * 13 = 65
- M2 = (2 + 4) * 5 = 6 * 5 = 30
- M3 = 1 * (7 - 8) = 1 * (-1) = -1
- M4 = 4 * (6 - 5) = 4 * 1 = 4
- M5 = (1 + 3) * 8 = 4 * 8 = 32
- M6 = (2 - 1) * (5 + 7) = 1 * 12 = 12
- M7 = (3 - 4) * (6 + 8) = (-1) * 14 = -14

**Step 2: Combine**
- C11 = M1 + M4 - M5 + M7 = 65 + 4 - 32 + (-14) = **23**
- C12 = M3 + M5 = -1 + 32 = **31**
- C21 = M2 + M4 = 30 + 4 = **34**
- C22 = M1 - M2 + M3 + M6 = 65 - 30 + (-1) + 12 = **46**

```
C = | 23  31 |
    | 34  46 |
```

**Verification:** Standard multiplication gives C11 = 1*5 + 3*6 = 23, C12 = 1*7 + 3*8 = 31, C21 = 2*5 + 4*6 = 34, C22 = 2*7 + 4*8 = 46. Correct.

## Pseudocode

```
function strassen(A, B, n):
    if n <= THRESHOLD:
        return standardMultiply(A, B)

    // Split matrices into quadrants
    half = n / 2
    A11, A12, A21, A22 = splitQuadrants(A)
    B11, B12, B21, B22 = splitQuadrants(B)

    // 7 recursive multiplications
    M1 = strassen(A11 + A22, B11 + B22, half)
    M2 = strassen(A21 + A22, B11, half)
    M3 = strassen(A11, B12 - B22, half)
    M4 = strassen(A22, B21 - B11, half)
    M5 = strassen(A11 + A12, B22, half)
    M6 = strassen(A21 - A11, B11 + B12, half)
    M7 = strassen(A12 - A22, B21 + B22, half)

    // Combine results
    C11 = M1 + M4 - M5 + M7
    C12 = M3 + M5
    C21 = M2 + M4
    C22 = M1 - M2 + M3 + M6

    return combineQuadrants(C11, C12, C21, C22)
```

## Complexity Analysis

| Case    | Time       | Space  |
|---------|------------|--------|
| Best    | O(n^2.807) | O(n^2) |
| Average | O(n^2.807) | O(n^2) |
| Worst   | O(n^2.807) | O(n^2) |

**Why these complexities?**

- **Time -- O(n^log2(7)) = O(n^2.807):** The algorithm makes 7 recursive calls on matrices of size n/2 and performs O(n^2) work for matrix additions. By the Master Theorem, T(n) = 7T(n/2) + O(n^2) gives T(n) = O(n^log2(7)). Reducing from 8 to 7 multiplications changes the exponent from log2(8)=3 to log2(7)=2.807.

- **Space -- O(n^2):** Storing the intermediate matrices (M1 through M7 and their sums) requires O(n^2) space. The recursion depth is O(log n), and each level requires O(n^2) storage for intermediate matrices, but with careful implementation (freeing intermediates early), the total space is O(n^2).

## When to Use

- **Large dense matrices:** When n is large (typically n > 64-256 depending on the hardware), the savings from fewer multiplications outweigh the overhead of extra additions.
- **Scientific computing:** Large-scale simulations involving matrix operations in physics, engineering, and climate modeling.
- **Machine learning:** Matrix multiplications in deep learning frameworks for large weight matrices and batch operations.
- **Computer graphics:** Transformation pipelines involving repeated multiplication of large transformation matrices.
- **When multiplication is expensive:** If the scalar multiplication operation is much more expensive than addition (e.g., multiplying polynomials or matrices over complex fields), the benefit of fewer multiplications is amplified.

## When NOT to Use

- **Small matrices:** For n below a crossover point (typically 32-128), the overhead of 18 matrix additions and recursive calls makes Strassen slower than naive O(n^3) multiplication. All practical implementations switch to standard multiplication below a threshold.
- **Sparse matrices:** Specialized sparse matrix algorithms (e.g., CSR/CSC formats) are far more efficient when most entries are zero.
- **When numerical stability matters:** Strassen's algorithm has worse numerical stability than standard multiplication. The extra additions and subtractions can amplify rounding errors. For applications requiring high precision (e.g., solving ill-conditioned linear systems), standard multiplication or numerically stable variants are preferred.
- **Non-square or non-power-of-2 matrices:** Padding to the next power of 2 wastes computation. While workarounds exist (peeling, dynamic padding), they add complexity.

## Comparison

| Algorithm              | Time         | Space  | Notes                                          |
|-----------------------|-------------|--------|-------------------------------------------------|
| Standard (naive)       | O(n^3)      | O(n^2) | Simple; numerically stable; best for small n    |
| **Strassen**           | **O(n^2.807)** | **O(n^2)** | **Practical sub-cubic; used in BLAS libraries** |
| Coppersmith-Winograd   | O(n^2.376)   | O(n^2) | Theoretical; impractical due to huge constants  |
| Williams et al. (2024) | O(n^2.371)   | O(n^2) | Current best known; purely theoretical          |
| Sparse (CSR/CSC)       | O(nnz)      | O(nnz) | For sparse matrices; nnz = number of non-zeros  |

## Implementations

| Language   | File |
|------------|------|
| Python     | [strassens_matrix.py](python/strassens_matrix.py) |
| Java       | [StrassensMatrix.java](java/StrassensMatrix.java) |
| C++        | [strassens_matrix.cpp](cpp/strassens_matrix.cpp) |
| C          | [strassens_matrix.c](c/strassens_matrix.c) |
| Go         | [strassens_matrix.go](go/strassens_matrix.go) |
| TypeScript | [strassensMatrix.ts](typescript/strassensMatrix.ts) |
| Rust       | [strassens_matrix.rs](rust/strassens_matrix.rs) |
| Kotlin     | [StrassensMatrix.kt](kotlin/StrassensMatrix.kt) |
| Swift      | [StrassensMatrix.swift](swift/StrassensMatrix.swift) |
| Scala      | [StrassensMatrix.scala](scala/StrassensMatrix.scala) |
| C#         | [StrassensMatrix.cs](csharp/StrassensMatrix.cs) |

## References

- Strassen, V. (1969). "Gaussian Elimination is Not Optimal." *Numerische Mathematik*, 13, 354-356.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 4.2: Strassen's Algorithm for Matrix Multiplication.
- Skiena, S. S. (2008). *The Algorithm Design Manual* (2nd ed.). Springer. Section 13.5.
- [Strassen Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Strassen_algorithm)
