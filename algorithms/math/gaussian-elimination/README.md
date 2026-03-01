# Gaussian Elimination

## Overview

Gaussian Elimination is a fundamental algorithm in linear algebra for solving systems of linear equations, finding matrix rank, computing determinants, and calculating inverse matrices. It systematically transforms a system of equations into row echelon form using elementary row operations (swapping rows, multiplying a row by a scalar, and adding a multiple of one row to another). Back-substitution then yields the solution. The version with partial pivoting selects the largest available pivot element at each step to improve numerical stability.

## How It Works

1. **Forward Elimination:** For each column (pivot position):
   - **Partial Pivoting:** Find the row with the largest absolute value in the current column (at or below the pivot row) and swap it with the pivot row.
   - **Elimination:** For each row below the pivot, subtract a multiple of the pivot row to make the entry in the pivot column zero.
2. **Back-Substitution:** Starting from the last equation, solve for each variable by substituting already-known values into the equation.

### Input/Output Format

- Input: `[n, a11, a12, ..., a1n, b1, a21, ..., ann, bn]` -- the size n followed by the augmented matrix in row-major order.
- Output: The sum of all solution values (scaled to integers by multiplying by the common denominator).

## Example

Solve the system:
```
2x + y - z = 8
-3x - y + 2z = -11
-2x + y + 2z = -3
```

**Augmented matrix:**
```
[ 2   1  -1 |  8 ]
[-3  -1   2 | -11]
[-2   1   2 | -3 ]
```

**Step 1 -- Pivot on column 1 (largest |a_i1| is |-3| = 3, swap rows 1 and 2):**
```
[-3  -1   2 | -11]
[ 2   1  -1 |  8 ]
[-2   1   2 | -3 ]
```

Eliminate column 1 in rows 2 and 3:
- R2 = R2 + (2/3)*R1: `[0, 1/3, 1/3, 2/3]`
- R3 = R3 - (2/3)*R1: `[0, 5/3, 2/3, 13/3]`

**Step 2 -- Pivot on column 2 (largest is 5/3 in row 3, swap rows 2 and 3):**

Eliminate column 2 in row 3.

**Step 3 -- Back-substitution yields:** x = 2, y = 3, z = -1

**Result:** Sum = 2 + 3 + (-1) = 4

## Pseudocode

```
function gaussianElimination(A, b, n):
    // Form augmented matrix [A|b]
    M = augmented matrix of size n x (n+1)

    // Forward elimination with partial pivoting
    for col from 0 to n - 1:
        // Find pivot: row with max |M[row][col]| for row >= col
        pivotRow = row with maximum |M[row][col]| among rows col..n-1
        swap M[col] and M[pivotRow]

        if M[col][col] == 0:
            return "No unique solution"

        // Eliminate below
        for row from col + 1 to n - 1:
            factor = M[row][col] / M[col][col]
            for j from col to n:
                M[row][j] = M[row][j] - factor * M[col][j]

    // Back-substitution
    x = array of size n
    for i from n - 1 down to 0:
        x[i] = M[i][n]
        for j from i + 1 to n - 1:
            x[i] = x[i] - M[i][j] * x[j]
        x[i] = x[i] / M[i][i]

    return x
```

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(n^3) | O(n^2) |
| Average | O(n^3) | O(n^2) |
| Worst   | O(n^3) | O(n^2) |

**Why these complexities?**

- **Time -- O(n^3):** The forward elimination phase processes n columns. For each column, it performs elimination on up to n rows, with each row operation touching up to n elements. This gives n * n * n = n^3 operations. Back-substitution is O(n^2), dominated by the elimination phase.

- **Space -- O(n^2):** The augmented matrix requires n * (n+1) storage. The algorithm can operate in-place on this matrix, so no additional significant storage is needed beyond the solution vector of size n.

## Applications

- **Solving systems of linear equations:** The primary application; used throughout science and engineering.
- **Computing matrix inverses:** By augmenting with the identity matrix and reducing to reduced row echelon form.
- **Computing determinants:** The determinant equals the product of the pivot elements (with appropriate sign for row swaps).
- **Finding matrix rank:** The number of non-zero rows in the row echelon form gives the rank.
- **Circuit analysis:** Solving Kirchhoff's equations for voltages and currents in electrical circuits.
- **Computer graphics:** Solving transformation equations for rendering and coordinate system conversions.

## When NOT to Use

- **Very large sparse systems:** For large sparse matrices, iterative methods (Jacobi, Gauss-Seidel, conjugate gradient) are far more efficient in both time and memory.
- **Ill-conditioned matrices:** When the condition number is very high, Gaussian elimination can produce large numerical errors even with partial pivoting. Use SVD or QR decomposition instead.
- **Symmetric positive-definite systems:** Cholesky decomposition is roughly twice as fast and numerically more stable for this special case.
- **When only an approximate solution is needed:** Iterative methods can provide approximate solutions much faster for very large systems.

## Comparison

| Method | Time | Stability | Best For |
|--------|------|-----------|----------|
| Gaussian Elimination | O(n^3) | Good with partial pivoting | Dense general systems |
| LU Decomposition | O(n^3) | Good | Multiple right-hand sides |
| Cholesky Decomposition | O(n^3/3) | Excellent | Symmetric positive-definite |
| QR Decomposition | O(2n^3/3) | Very good | Least-squares problems |
| Conjugate Gradient | O(n*k) | Depends on conditioning | Large sparse SPD systems |

## Implementations

| Language   | File |
|------------|------|
| Python     | [gaussian_elimination.py](python/gaussian_elimination.py) |
| Java       | [GaussianElimination.java](java/GaussianElimination.java) |
| C++        | [gaussian_elimination.cpp](cpp/gaussian_elimination.cpp) |
| C          | [gaussian_elimination.c](c/gaussian_elimination.c) |
| Go         | [gaussian_elimination.go](go/gaussian_elimination.go) |
| TypeScript | [gaussianElimination.ts](typescript/gaussianElimination.ts) |
| Rust       | [gaussian_elimination.rs](rust/gaussian_elimination.rs) |
| Kotlin     | [GaussianElimination.kt](kotlin/GaussianElimination.kt) |
| Swift      | [GaussianElimination.swift](swift/GaussianElimination.swift) |
| Scala      | [GaussianElimination.scala](scala/GaussianElimination.scala) |
| C#         | [GaussianElimination.cs](csharp/GaussianElimination.cs) |

## References

- Golub, G. H., & Van Loan, C. F. (2013). *Matrix Computations* (4th ed.). Johns Hopkins University Press. Chapter 3: General Linear Systems.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 28: Matrix Operations.
- [Gaussian Elimination -- Wikipedia](https://en.wikipedia.org/wiki/Gaussian_elimination)
