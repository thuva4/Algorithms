# Conjugate Gradient Method

## Overview

The Conjugate Gradient (CG) method is an iterative algorithm for solving systems of linear equations Ax = b, where A is a symmetric positive-definite (SPD) matrix. Unlike direct methods such as Gaussian elimination, CG does not require explicit matrix factorization. It is particularly efficient for large, sparse systems where direct methods would be prohibitively expensive in both time and memory.

The method was originally proposed by Magnus Hestenes and Eduard Stiefel in 1952. It generates a sequence of search directions that are "conjugate" (A-orthogonal) to each other, ensuring that each step makes optimal progress toward the solution in a different direction. In exact arithmetic, CG converges in at most n iterations for an n-by-n system, but in practice it often converges much sooner when A is well-conditioned.

## How It Works

1. **Initialize:** Choose an initial guess x_0 (typically the zero vector). Compute the initial residual r_0 = b - A*x_0. Set the initial search direction p_0 = r_0.

2. **Iterate:** For k = 0, 1, 2, ...:
   - Compute the step size: alpha_k = (r_k^T * r_k) / (p_k^T * A * p_k)
   - Update the solution: x_{k+1} = x_k + alpha_k * p_k
   - Update the residual: r_{k+1} = r_k - alpha_k * A * p_k
   - Check convergence: if ||r_{k+1}|| < tolerance, stop
   - Compute the direction update factor: beta_k = (r_{k+1}^T * r_{k+1}) / (r_k^T * r_k)
   - Update the search direction: p_{k+1} = r_{k+1} + beta_k * p_k

3. **Return** x_{k+1} as the approximate solution.

The key insight is that conjugate directions ensure the algorithm never "revisits" a direction, making it maximally efficient among Krylov subspace methods for SPD systems.

## Worked Example

Solve Ax = b where:

```
A = | 4  1 |    b = | 1 |
    | 1  3 |        | 2 |
```

**Initialization:** x_0 = [0, 0]^T, r_0 = b - A*x_0 = [1, 2]^T, p_0 = [1, 2]^T

**Iteration 1:**
- A*p_0 = [4*1+1*2, 1*1+3*2] = [6, 7]
- alpha_0 = (1*1 + 2*2) / (1*6 + 2*7) = 5/20 = 0.25
- x_1 = [0, 0] + 0.25*[1, 2] = [0.25, 0.5]
- r_1 = [1, 2] - 0.25*[6, 7] = [-0.5, 0.25]
- beta_0 = (0.25 + 0.0625) / (1 + 4) = 0.3125/5 = 0.0625
- p_1 = [-0.5, 0.25] + 0.0625*[1, 2] = [-0.4375, 0.375]

**Iteration 2:**
- A*p_1 = [4*(-0.4375)+1*(0.375), 1*(-0.4375)+3*(0.375)] = [-1.375, 0.6875]
- alpha_1 = 0.3125 / ((-0.4375)*(-1.375) + 0.375*0.6875) = 0.3125 / (0.6016 + 0.2578) = 0.3125/0.8594 = 0.3636...
- x_2 = [0.25, 0.5] + 0.3636*[-0.4375, 0.375] = [0.0909, 0.6364]

Verify: A*x_2 = [4*0.0909+1*0.6364, 1*0.0909+3*0.6364] = [1.0, 2.0] = b. Converged in 2 iterations (as expected for a 2x2 system).

The exact solution is x = [1/11, 7/11] = [0.0909..., 0.6364...].

## Algorithm

```
function conjugateGradient(A, b, x0, tolerance, maxIter):
    x = x0
    r = b - A * x
    p = r
    rsOld = dot(r, r)

    for k = 0 to maxIter - 1:
        Ap = A * p
        alpha = rsOld / dot(p, Ap)
        x = x + alpha * p
        r = r - alpha * Ap
        rsNew = dot(r, r)

        if sqrt(rsNew) < tolerance:
            break

        beta = rsNew / rsOld
        p = r + beta * p
        rsOld = rsNew

    return x
```

Note: The matrix-vector product A*p is the most expensive operation per iteration. For sparse matrices, this is O(nnz) where nnz is the number of nonzero entries.

## Complexity Analysis

| Case    | Time          | Space |
|---------|---------------|-------|
| Best    | O(n * nnz)    | O(n)  |
| Average | O(sqrt(K) * nnz) | O(n) |
| Worst   | O(n * nnz)    | O(n)  |

Where n is the matrix dimension, nnz is the number of nonzero entries, and K = cond(A) is the condition number of A.

**Why these complexities?**

- **Best Case -- O(n * nnz):** In exact arithmetic, CG converges in at most n iterations. Each iteration costs O(nnz) for the matrix-vector product plus O(n) for vector operations.
- **Average Case -- O(sqrt(K) * nnz):** With a well-conditioned matrix, CG typically converges in O(sqrt(K)) iterations, where K is the condition number. Preconditioning can dramatically reduce K.
- **Space -- O(n):** CG only stores the current solution x, residual r, search direction p, and one auxiliary vector A*p, each of length n. The matrix A is accessed only through matrix-vector products.

## Applications

- **Finite element analysis:** Solving large sparse SPD systems arising from structural mechanics, heat transfer, and fluid dynamics.
- **Computer graphics:** Solving Poisson equations for image editing, mesh smoothing, and simulation.
- **Machine learning:** Solving normal equations in linear regression, natural gradient methods, and Hessian-free optimization.
- **Geophysics:** Seismic inversion and gravity field modeling.
- **Computational physics:** Solving discretized PDEs on large grids.

## When NOT to Use

- **Non-symmetric matrices:** CG requires A to be symmetric. For non-symmetric systems, use GMRES, BiCGSTAB, or other Krylov methods.
- **Non-positive-definite matrices:** CG requires A to be positive definite. For indefinite systems, use MINRES or SYMMLQ.
- **Small dense systems:** For matrices smaller than a few hundred dimensions, direct methods (LU, Cholesky) are faster due to lower overhead.
- **Ill-conditioned systems without preconditioning:** If the condition number K is very large and no good preconditioner is available, CG will converge slowly. Preconditioning is essential for practical performance.
- **When an exact solution is required:** CG is iterative and produces approximate solutions. For exact arithmetic, use direct methods.

## Comparison with Related Solvers

| Method                  | Matrix Requirements     | Time per Iteration | Convergence         | Storage  |
|------------------------|------------------------|--------------------|---------------------|----------|
| Conjugate Gradient     | SPD                    | O(nnz)             | O(sqrt(K)) iters    | O(n)     |
| Preconditioned CG      | SPD + preconditioner   | O(nnz + precon)    | O(sqrt(K')) iters   | O(n)     |
| GMRES                  | Any nonsingular        | O(k * nnz)         | At most n iters     | O(k * n) |
| Gaussian Elimination   | Any nonsingular        | O(n^3)             | Direct (exact)      | O(n^2)   |
| Cholesky Factorization | SPD                    | O(n^3/3)           | Direct (exact)      | O(n^2)   |
| Jacobi Iteration       | Diagonally dominant    | O(nnz)             | O(K) iters          | O(n)     |

CG is the method of choice for large sparse SPD systems. It requires far less memory than GMRES (which stores the full Krylov basis) and converges faster than simple iterative methods like Jacobi or Gauss-Seidel.

## Implementations

| Language | File |
|----------|------|
| Python   | [conjugate_gradient.py](python/conjugate_gradient.py) |
| C++      | [conjugate_gradient.cpp](cpp/conjugate_gradient.cpp) |

## References

- Hestenes, M. R., & Stiefel, E. (1952). Methods of conjugate gradients for solving linear systems. *Journal of Research of the National Bureau of Standards*, 49(6), 409-436.
- Shewchuk, J. R. (1994). An introduction to the conjugate gradient method without the agonizing pain. Technical Report, Carnegie Mellon University.
- Trefethen, L. N., & Bau, D. (1997). *Numerical Linear Algebra*. SIAM. Lecture 38: Conjugate Gradients.
- Golub, G. H., & Van Loan, C. F. (2013). *Matrix Computations* (4th ed.). Johns Hopkins University Press. Chapter 11.
- [Conjugate Gradient Method -- Wikipedia](https://en.wikipedia.org/wiki/Conjugate_gradient_method)
