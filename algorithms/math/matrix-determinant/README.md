# Matrix Determinant

## Overview

The determinant of a square matrix is a scalar value that encodes important properties of the linear transformation the matrix represents. It indicates whether the matrix is invertible (nonzero determinant), the scaling factor of the transformation on volumes, and the orientation change (sign). This implementation computes the determinant via Gaussian elimination with partial pivoting, reducing the matrix to upper triangular form and multiplying the diagonal entries.

## How It Works

1. Read the matrix dimension n and the n x n entries.
2. Create a working copy of the matrix.
3. For each column i from 0 to n-1:
   - Find the pivot: the row with the largest absolute value in column i at or below row i (partial pivoting).
   - If the pivot is zero, the determinant is 0 (singular matrix).
   - Swap the pivot row with row i. Each swap flips the sign of the determinant.
   - For each row j below row i, eliminate the entry in column i by subtracting an appropriate multiple of row i.
4. The determinant is the product of all diagonal entries, multiplied by the accumulated sign from row swaps.

## Worked Example

Consider the 3x3 matrix:

```
A = | 2  3  1 |
    | 4  1  3 |
    | 1  2  4 |
```

**Step 1:** Pivot on column 0. Largest absolute value is 4 in row 1. Swap rows 0 and 1 (sign = -1):

```
    | 4  1  3 |
    | 2  3  1 |
    | 1  2  4 |
```

Eliminate below pivot: R1 = R1 - (2/4)*R0, R2 = R2 - (1/4)*R0:

```
    | 4    1     3   |
    | 0    2.5  -0.5 |
    | 0    1.75  3.25|
```

**Step 2:** Pivot on column 1. Largest value is 2.5 in row 1 (no swap needed).

Eliminate: R2 = R2 - (1.75/2.5)*R1:

```
    | 4   1     3    |
    | 0   2.5  -0.5  |
    | 0   0     3.6  |
```

**Step 3:** det = sign * d[0] * d[1] * d[2] = (-1) * 4 * 2.5 * 3.6 = -36.

Verification by cofactor expansion: 2(1*4 - 3*2) - 3(4*4 - 3*1) + 1(4*2 - 1*1) = 2(-2) - 3(13) + 1(7) = -4 - 39 + 7 = -36.

## Pseudocode

```
function determinant(matrix, n):
    sign = 1
    A = copy(matrix)

    for i in 0 to n-1:
        // Partial pivoting
        pivotRow = argmax(|A[j][i]| for j in i..n-1)
        if A[pivotRow][i] == 0:
            return 0

        if pivotRow != i:
            swap(A[i], A[pivotRow])
            sign = -sign

        // Elimination
        for j in i+1 to n-1:
            factor = A[j][i] / A[i][i]
            for k in i to n-1:
                A[j][k] = A[j][k] - factor * A[i][k]

    det = sign
    for i in 0 to n-1:
        det = det * A[i][i]
    return det
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^3) | O(n^2) |
| Average | O(n^3) | O(n^2) |
| Worst   | O(n^3) | O(n^2) |

- **Time O(n^3):** The three nested loops over matrix entries dominate.
- **Space O(n^2):** A copy of the n x n matrix is stored.

## When to Use

- Checking whether a system of linear equations has a unique solution (det != 0).
- Computing the volume scaling factor of a linear transformation.
- Evaluating characteristic polynomials for eigenvalue computation.
- Determining matrix invertibility before computing the inverse.
- Cramer's rule for solving small linear systems.

## When NOT to Use

- **Very large sparse matrices:** Specialized sparse solvers (e.g., LU with fill-in reduction) are far more efficient than dense Gaussian elimination.
- **When only invertibility is needed:** An LU factorization can determine invertibility without fully computing the determinant; rank-checking may be cheaper.
- **Symbolic or exact arithmetic:** Floating-point Gaussian elimination introduces rounding errors. For exact determinants over integers, use fraction-free approaches or modular arithmetic.
- **Ill-conditioned matrices:** The computed determinant may be wildly inaccurate due to numerical instability, even with partial pivoting.

## Comparison

| Method                  | Time    | Exact? | Notes                                      |
|-------------------------|---------|--------|---------------------------------------------|
| Gaussian Elimination    | O(n^3)  | No*    | Standard approach; partial pivoting helps    |
| Cofactor Expansion      | O(n!)   | Yes    | Only practical for n <= 10                   |
| LU Decomposition        | O(n^3)  | No*    | Essentially the same as Gaussian elimination |
| Bareiss Algorithm       | O(n^3)  | Yes    | Fraction-free; exact over integers           |
| Strassen-like methods   | O(n^~2.37)| No*  | Theoretical; rarely used in practice         |

\* Floating-point arithmetic introduces rounding.

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 28: Matrix Operations.
- Golub, G. H., & Van Loan, C. F. (2013). *Matrix Computations* (4th ed.). Johns Hopkins University Press.
- [Determinant -- Wikipedia](https://en.wikipedia.org/wiki/Determinant)
- [Gaussian elimination -- Wikipedia](https://en.wikipedia.org/wiki/Gaussian_elimination)

## Implementations

| Language   | File |
|------------|------|
| Python     | [matrix_determinant.py](python/matrix_determinant.py) |
| Java       | [MatrixDeterminant.java](java/MatrixDeterminant.java) |
| C++        | [matrix_determinant.cpp](cpp/matrix_determinant.cpp) |
| C          | [matrix_determinant.c](c/matrix_determinant.c) |
| Go         | [matrix_determinant.go](go/matrix_determinant.go) |
| TypeScript | [matrixDeterminant.ts](typescript/matrixDeterminant.ts) |
| Rust       | [matrix_determinant.rs](rust/matrix_determinant.rs) |
| Kotlin     | [MatrixDeterminant.kt](kotlin/MatrixDeterminant.kt) |
| Swift      | [MatrixDeterminant.swift](swift/MatrixDeterminant.swift) |
| Scala      | [MatrixDeterminant.scala](scala/MatrixDeterminant.scala) |
| C#         | [MatrixDeterminant.cs](csharp/MatrixDeterminant.cs) |
