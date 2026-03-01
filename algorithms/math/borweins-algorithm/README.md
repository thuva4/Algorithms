# Borwein's Algorithm

## Overview

Borwein's algorithm is a family of iterative methods for computing the mathematical constant pi, developed by Jonathan and Peter Borwein in the 1980s. The most well-known variant is the quartic (fourth-order) algorithm, which quadruples the number of correct digits with each iteration. Starting from carefully chosen initial values derived from algebraic identities, the algorithm converges to 1/pi extremely rapidly -- typically, 5 iterations yield over 600 correct decimal digits.

The algorithm belongs to the class of arithmetic-geometric mean (AGM) based methods and is closely related to Ramanujan-type series for pi. It is one of the fastest known algorithms for computing pi to arbitrary precision.

## How It Works

The Borwein quartic algorithm maintains two state variables, `a` and `y`, updated each iteration:

1. Initialize:
   - y_0 = sqrt(2) - 1
   - a_0 = 6 - 4 * sqrt(2)

2. At each iteration k, compute:
   - y_{k+1} = (1 - (1 - y_k^4)^(1/4)) / (1 + (1 - y_k^4)^(1/4))
   - a_{k+1} = a_k * (1 + y_{k+1})^4 - 2^(2k+3) * y_{k+1} * (1 + y_{k+1} + y_{k+1}^2)

3. After n iterations, 1/a_n approximates pi with approximately 4^n correct digits.

The quartic convergence means the number of accurate digits quadruples per iteration: ~1, 4, 16, 64, 256, 1024, ...

## Worked Example

Starting values:
- y_0 = sqrt(2) - 1 = 0.41421356...
- a_0 = 6 - 4*sqrt(2) = 0.34314575...

**Iteration 1:**
- y_0^4 = 0.02943725...
- (1 - y_0^4)^(1/4) = 0.99252568...
- y_1 = (1 - 0.99252568) / (1 + 0.99252568) = 0.00375128...
- a_1 = a_0 * (1 + y_1)^4 - 2^3 * y_1 * (1 + y_1 + y_1^2)
- a_1 = 0.31830988... (already ~8 correct digits of 1/pi)
- 1/a_1 = 3.14159265... (pi to ~8 digits)

**Iteration 2:**
- Produces ~32 correct digits of pi.

After just 5 iterations, over 600 digits are correct.

## Algorithm

```
function borweinPi(iterations):
    y = sqrt(2) - 1
    a = 6 - 4 * sqrt(2)

    for k = 0 to iterations - 1:
        fourth_root = (1 - y^4)^(1/4)
        y = (1 - fourth_root) / (1 + fourth_root)
        a = a * (1 + y)^4 - 2^(2*k + 3) * y * (1 + y + y^2)

    return 1 / a    // approximation of pi
```

Note: In practice, this requires arbitrary-precision arithmetic. The `2^(2k+3)` factor grows exponentially, so implementations typically use big-decimal libraries (e.g., Python's `mpmath`, Java's `BigDecimal`).

## Complexity Analysis

| Case    | Time                | Space |
|---------|---------------------|-------|
| Best    | O(n * M(d))         | O(d)  |
| Average | O(n * M(d))         | O(d)  |
| Worst   | O(n * M(d))         | O(d)  |

Where n is the number of iterations, d is the number of desired digits, and M(d) is the cost of multiplying two d-digit numbers.

**Why these complexities?**

- **Time:** Each iteration requires a constant number of arbitrary-precision multiplications and one fourth-root computation. With Schonhage-Strassen multiplication, M(d) = O(d log d log log d). Since 4^n digits are correct after n iterations, computing D digits requires n = O(log D) iterations, giving total time O(log(D) * M(D)).

- **Space:** The algorithm stores a constant number of variables, each with d digits of precision, so space is O(d).

## Applications

- **Computing pi to trillions of digits:** Borwein's algorithm (and closely related methods) have been used in several world-record pi computations.
- **Benchmarking arbitrary-precision libraries:** The algorithm's heavy use of multiplication makes it a good stress test.
- **Verifying other pi algorithms:** Used as an independent check against Chudnovsky or Bailey-Borwein-Plouffe results.
- **Mathematical research:** Studying convergence rates and algebraic relations between constants.

## When NOT to Use

- **Low precision (fewer than ~50 digits):** The overhead of arbitrary-precision arithmetic makes simpler series (Leibniz, Machin) or lookup tables more practical.
- **When you only need a few hundred digits:** The Chudnovsky algorithm converges faster per term (about 14 digits per term) and is simpler to implement with standard big-number libraries.
- **Streaming or digit-extraction:** If you need specific digits of pi without computing all prior digits, use the Bailey-Borwein-Plouffe (BBP) formula instead.
- **Embedded or memory-constrained systems:** Arbitrary-precision arithmetic requires significant memory allocation.

## Comparison with Similar Algorithms

| Algorithm          | Convergence Rate       | Digits per Iteration | Implementation Complexity |
|-------------------|------------------------|----------------------|--------------------------|
| Borwein Quartic   | Quartic (4th order)    | ~4x per iteration    | Moderate (needs nth root) |
| Chudnovsky        | ~14 digits per term    | 14 per term          | Moderate (factorial-heavy) |
| Gauss-Legendre    | Quadratic (2nd order)  | ~2x per iteration    | Simple (just +, *, sqrt)  |
| Machin-like       | Linear                 | ~1.4 per term        | Simple                    |
| BBP Formula       | Linear                 | ~1 hex digit/term    | Simple; allows digit extraction |

Borwein's quartic algorithm has a higher convergence order than Gauss-Legendre but requires computing fourth roots, which adds implementation complexity. In practice, the Chudnovsky algorithm is more commonly used for record-setting computations because it achieves more digits per unit of computation time despite its linear convergence per term.

## Implementations

| Language | File |
|----------|------|
| Python   | [borweins_algorithm.py](python/borweins_algorithm.py) |
| Java     | [BorweinsAlgorithm.java](java/BorweinsAlgorithm.java) |
| C++      | [borweins_algorithm.cpp](cpp/borweins_algorithm.cpp) |

## References

- Borwein, J. M., & Borwein, P. B. (1987). *Pi and the AGM: A Study in Analytic Number Theory and Computational Complexity*. Wiley-Interscience.
- Borwein, J. M., & Borwein, P. B. (1984). The arithmetic-geometric mean and fast computation of elementary functions. *SIAM Review*, 26(3), 351-366.
- Bailey, D. H., Borwein, J. M., Borwein, P. B., & Plouffe, S. (1997). The quest for pi. *Mathematical Intelligencer*, 19(1), 50-57.
- [Borwein's Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Borwein%27s_algorithm)
