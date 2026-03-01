# Matrix Exponentiation

## Overview

Matrix exponentiation is a technique for computing the n-th term of a linear recurrence relation in O(k^3 log n) time, where k is the order of the recurrence. By expressing the recurrence as a matrix multiplication and then using fast exponentiation (repeated squaring) on that matrix, we can solve problems like finding the n-th Fibonacci number for extremely large n (e.g., n = 10^18) modulo some value. The idea generalizes binary exponentiation from scalars to matrices.

## How It Works

Given a k-th order linear recurrence:

```
a[i] = c[1]*a[i-1] + c[2]*a[i-2] + ... + c[k]*a[i-k]   (for i > k)
```

with base values b[1], b[2], ..., b[k]:

1. **Construct the state vector F:** F = [b[1], b[2], ..., b[k]]^T.
2. **Construct the companion (transition) matrix T** of size k x k:
   ```
   T = | 0  1  0  ...  0  0 |
       | 0  0  1  ...  0  0 |
       | ...                 |
       | 0  0  0  ...  0  1 |
       | c[k] c[k-1] ... c[2] c[1] |
   ```
3. **Compute T^(n-1)** using matrix fast exponentiation (repeated squaring).
4. **Multiply T^(n-1) * F** to get the state vector at position n.
5. The first element of the resulting vector is a[n].

### Matrix Fast Exponentiation (Repeated Squaring)

```
If power is 1: return the matrix itself
If power is odd: return M * power(M, power-1)
If power is even: let H = power(M, power/2); return H * H
```

## Worked Example

**Fibonacci sequence:** a[1] = 0, a[2] = 1, a[i] = a[i-1] + a[i-2].

Here k = 2, b = [0, 1], c = [1, 1].

State vector: F = [0, 1]^T

Transition matrix:
```
T = | 0  1 |
    | 1  1 |
```

To find a[6] (the 6th Fibonacci number, which is 5):

Compute T^5:
- T^1 = [[0,1],[1,1]]
- T^2 = T*T = [[1,1],[1,2]]
- T^4 = T^2 * T^2 = [[2,3],[3,5]]
- T^5 = T^4 * T = [[2*0+3*1, 2*1+3*1], [3*0+5*1, 3*1+5*1]] = [[3,5],[5,8]]

Result: T^5 * F = [[3*0+5*1], [5*0+8*1]] = [5, 8].

The first element is 5, confirming a[6] = 5.

## Pseudocode

```
function matrixMultiply(A, B, k, mod):
    C = k x k zero matrix
    for i in 1 to k:
        for j in 1 to k:
            for z in 1 to k:
                C[i][j] = (C[i][j] + A[i][z] * B[z][j]) % mod
    return C

function matrixPower(M, p, k, mod):
    if p == 1:
        return M
    if p is odd:
        return matrixMultiply(M, matrixPower(M, p-1, k, mod), k, mod)
    else:
        half = matrixPower(M, p/2, k, mod)
        return matrixMultiply(half, half, k, mod)

function solve(n, b[], c[], k, mod):
    if n == 0: return 0
    if n <= k: return b[n-1]

    F = state vector from b[]
    T = build companion matrix from c[]
    T = matrixPower(T, n-1, k, mod)

    result = 0
    for i in 1 to k:
        result = (result + T[1][i] * F[i]) % mod
    return result
```

## Complexity Analysis

| Case    | Time          | Space  |
|---------|---------------|--------|
| Best    | O(k^3 log n)  | O(k^2) |
| Average | O(k^3 log n)  | O(k^2) |
| Worst   | O(k^3 log n)  | O(k^2) |

- **Time O(k^3 log n):** Each matrix multiplication takes O(k^3), and repeated squaring requires O(log n) multiplications.
- **Space O(k^2):** Storing the k x k matrices.

## When to Use

- Computing the n-th term of a linear recurrence for very large n (e.g., n = 10^18).
- Fibonacci and generalized Fibonacci sequences modulo a prime.
- Counting paths of length n in a graph with k nodes.
- Dynamic programming problems with linear transitions where n is too large for iterative DP.
- Competitive programming problems involving recurrence relations with tight time constraints.

## When NOT to Use

- **Small n:** Simple iterative DP in O(n * k) is faster and simpler when n is manageable.
- **Non-linear recurrences:** Matrix exponentiation only works for linear recurrences (a[i] is a linear combination of previous terms).
- **Large k:** When k is large, the O(k^3) cost per matrix multiplication dominates. For k > ~1000, consider other approaches.
- **When the exact formula is known:** Closed-form solutions (e.g., Binet's formula for Fibonacci) may be faster, though they can have precision issues.

## Comparison

| Method                   | Time         | Applicable to         | Notes                                   |
|--------------------------|--------------|------------------------|------------------------------------------|
| Matrix Exponentiation    | O(k^3 log n) | Linear recurrences     | Handles huge n efficiently               |
| Iterative DP             | O(n * k)     | Any recurrence         | Simpler; better when n is small          |
| Characteristic equation  | O(k log n)   | Linear recurrences     | Uses polynomial arithmetic; complex impl |
| Closed-form (Binet etc.) | O(1)*        | Specific recurrences   | Limited applicability; precision issues   |
| Kitamasa's method        | O(k^2 log n) | Linear recurrences     | Better for large k, complex to implement |

\* O(1) ignoring the cost of computing irrational powers.

## References

- Fiduccia, C. M. (1985). "An efficient formula for linear recurrences." *SIAM J. Comput.*, 14(1), 106-112.
- [Matrix Exponentiation -- CP-algorithms](https://cp-algorithms.com/algebra/matrix-binary-pow.html)
- [Matrix Exponentiation -- Wikipedia](https://en.wikipedia.org/wiki/Matrix_exponential)
- [Linear Recurrence -- Competitive Programming Handbook](https://cses.fi/book/book.pdf)

## Implementations

| Language | File |
|----------|------|
| C++      | [matrix_expo.cpp](cpp/matrix_expo.cpp) |
