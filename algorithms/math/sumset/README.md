# Sumset (Minkowski Sum of Sets)

## Overview

The sumset (also called the Minkowski sum) of two sets A and B is the set of all pairwise sums: A + B = {a + b : a in A, b in B}. It is a fundamental operation in additive combinatorics, computational geometry, and number theory. The naive approach computes all |A| * |B| sums and collects the distinct results. A faster approach uses polynomial multiplication: represent each set as a polynomial (with x^a terms for each element a), multiply the polynomials, and read off the nonzero exponents from the product.

## How It Works

### Polynomial Multiplication Approach

1. Create polynomial P_A(x) where the coefficient of x^a is 1 if a is in A, 0 otherwise.
2. Create polynomial P_B(x) similarly for set B.
3. Multiply P_A(x) * P_B(x). The product polynomial P_C(x) has nonzero coefficient at x^c if and only if c = a + b for some a in A, b in B.
4. Collect all exponents with nonzero coefficients in P_C to form the sumset.

### Naive Approach

1. For each element a in A and each element b in B, compute a + b.
2. Collect all results into a set (removing duplicates).

## Worked Example

Compute A + B where A = {1, 2, 3} and B = {10, 20}.

**Naive approach:**
- 1 + 10 = 11, 1 + 20 = 21
- 2 + 10 = 12, 2 + 20 = 22
- 3 + 10 = 13, 3 + 20 = 23

Sumset A + B = {11, 12, 13, 21, 22, 23}.

**Polynomial approach:**
- P_A(x) = x^1 + x^2 + x^3
- P_B(x) = x^10 + x^20
- P_A * P_B = x^11 + x^12 + x^13 + x^21 + x^22 + x^23

Nonzero exponents: {11, 12, 13, 21, 22, 23} -- same result.

## Pseudocode

```
function sumset(A, B):
    // Polynomial multiplication approach
    max_a = max(A)
    max_b = max(B)

    // Create indicator polynomials
    poly_A = array of size max_a + 1, all zeros
    poly_B = array of size max_b + 1, all zeros

    for a in A:
        poly_A[a] = 1
    for b in B:
        poly_B[b] = 1

    // Multiply polynomials (using FFT/NTT for large sets, or naive for small)
    poly_C = polynomialMultiply(poly_A, poly_B)

    // Extract nonzero positions
    result = {}
    for i from 0 to length(poly_C) - 1:
        if poly_C[i] != 0:
            result.add(i)

    return result
```

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(n * m) | O(n * m) |
| Average | O(n * m) | O(n * m) |
| Worst   | O(n * m) | O(n * m) |

Where n = |A| and m = |B|.

- **Naive approach:** O(n * m) time and space for storing all sums.
- **Polynomial approach with FFT/NTT:** O(S log S) where S = max(A) + max(B), which is faster when S << n * m.
- **Space:** Dominated by the polynomial arrays or the output set.

## Applications

- **Additive combinatorics:** Studying the structure of sumsets is central to Freiman's theorem and the Erdos-Ginzburg-Ziv theorem.
- **Computational geometry:** Minkowski sums of convex polygons are used for collision detection and path planning in robotics.
- **Knapsack-like problems:** Determining which sums are achievable from given sets.
- **Number theory:** Analyzing which numbers can be represented as sums of elements from specific sets (e.g., Goldbach-type conjectures).
- **Signal processing:** Convolution of discrete signals is equivalent to polynomial multiplication.

## When NOT to Use

- **When sets contain very large values:** The polynomial approach requires arrays of size proportional to max(A) + max(B), which is wasteful if the values are sparse but large.
- **When sets are tiny:** For |A| * |B| < 100, the naive double loop is simpler and faster than setting up polynomial multiplication.
- **When negative numbers are involved without preprocessing:** The polynomial approach assumes nonnegative indices. Negative elements require shifting all values to nonnegative range first.
- **When only the size of the sumset is needed:** There are direct combinatorial bounds (e.g., |A + B| >= |A| + |B| - 1 for sets of integers) that avoid computing the full sumset.

## Comparison

| Method                    | Time          | Space         | Notes                                    |
|---------------------------|---------------|---------------|------------------------------------------|
| Naive double loop         | O(n * m)      | O(n * m)      | Simplest; works for any element type     |
| Polynomial (FFT/NTT)     | O(S log S)    | O(S)          | Faster when S is small; exact with NTT   |
| Sorting + merge           | O(nm log(nm)) | O(n * m)      | Useful when sorted output is needed      |
| Hash set                  | O(n * m)      | O(n * m)      | Naive with deduplication; constant-time lookup |

Where S = max(A) + max(B).

## References

- Freiman, G. A. (1973). *Foundations of a Structural Theory of Set Addition*. AMS.
- Tao, T., & Vu, V. (2006). *Additive Combinatorics*. Cambridge University Press.
- [Minkowski addition -- Wikipedia](https://en.wikipedia.org/wiki/Minkowski_addition)
- [Sumset -- Wikipedia](https://en.wikipedia.org/wiki/Sumset)

## Implementations

| Language | File |
|----------|------|
| Python   | [Sumset.py](python/Sumset.py) |
