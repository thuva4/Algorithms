# Extended Euclidean Algorithm

## Overview

The Extended Euclidean Algorithm is an extension of the Euclidean algorithm that, in addition to computing the greatest common divisor (GCD) of two integers a and b, also finds integers x and y such that ax + by = GCD(a, b). This equation is known as Bezout's identity. For example, for a = 35 and b = 15, the algorithm finds GCD = 5 and coefficients x = 1, y = -2, since 35(1) + 15(-2) = 5.

The Extended Euclidean Algorithm is essential in cryptography (computing modular multiplicative inverses for RSA), solving linear Diophantine equations, and Chinese Remainder Theorem computations. The modular inverse of a modulo m exists if and only if GCD(a, m) = 1, and the extended algorithm computes it directly.

## How It Works

The algorithm works by running the Euclidean algorithm while tracking the coefficients at each step. Starting with (a, b) and initial coefficients, each step replaces (a, b) with (b, a mod b) and updates the coefficients accordingly. When b reaches 0, the current coefficients x and y satisfy ax + by = GCD(a, b).

### Example

Computing Extended GCD of `a = 35` and `b = 15`:

| Step | a | b | q = a/b | r = a mod b | x | y | Verification |
|------|---|---|---------|-------------|---|---|-------------|
| Init | 35 | 15 | - | - | 1, 0 | 0, 1 | - |
| 1 | 35 | 15 | 2 | 5 | 1 | -2 | 35(1) + 15(-2) = 5 |
| 2 | 15 | 5 | 3 | 0 | - | - | - |

**Detailed coefficient tracking:**

Starting values: x_prev = 1, x_curr = 0, y_prev = 0, y_curr = 1

| Step | q | x_new = x_prev - q*x_curr | y_new = y_prev - q*y_curr |
|------|---|--------------------------|--------------------------|
| 1 | 2 | 1 - 2*0 = 1 | 0 - 2*1 = -2 |

Result: `GCD(35, 15) = 5`, with `x = 1`, `y = -2`

Verification: 35 * 1 + 15 * (-2) = 35 - 30 = 5

**Application -- Finding modular inverse:**
To find the modular inverse of 35 mod 15:
Since GCD(35, 15) = 5 != 1, the modular inverse does not exist.

For a = 7, b = 11: GCD = 1, x = -3, y = 2 (7*(-3) + 11*2 = -21 + 22 = 1).
So 7^(-1) mod 11 = -3 mod 11 = 8.

## Pseudocode

```
function extendedGCD(a, b):
    if b == 0:
        return (a, 1, 0)    // GCD, x, y

    (gcd, x1, y1) = extendedGCD(b, a mod b)
    x = y1
    y = x1 - (a / b) * y1

    return (gcd, x, y)
```

Iterative version:

```
function extendedGCD(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r != 0:
        q = old_r / r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t

    return (old_r, old_s, old_t)    // GCD, x, y
```

The iterative version maintains two sets of coefficients and updates them at each step using the quotient q.

## Complexity Analysis

| Case    | Time              | Space |
|---------|-------------------|-------|
| Best    | O(1)              | O(1)  |
| Average | O(log(min(a,b)))  | O(1)  |
| Worst   | O(log(min(a,b)))  | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** When b = 0 or b divides a, the algorithm terminates in one step.

- **Average Case -- O(log(min(a,b))):** The number of iterations is the same as the Euclidean algorithm, which is O(log(min(a,b))). The coefficient updates add only O(1) work per iteration.

- **Worst Case -- O(log(min(a,b))):** Like the Euclidean algorithm, the worst case occurs with consecutive Fibonacci numbers, requiring O(log(min(a,b))) steps.

- **Space -- O(1):** The iterative version uses a constant number of variables. The recursive version uses O(log(min(a,b))) stack space.

## When to Use

- **Computing modular inverses:** Finding a^(-1) mod m when GCD(a, m) = 1. This is crucial for RSA decryption.
- **Solving linear Diophantine equations:** Finding integer solutions to ax + by = c (solvable when GCD(a, b) divides c).
- **Chinese Remainder Theorem:** The constructive proof uses extended GCD to combine modular equations.
- **Fraction arithmetic:** Finding common denominators and simplifying fractions.

## When NOT to Use

- **When you only need the GCD:** The standard Euclidean algorithm is simpler and sufficient.
- **When the modular inverse is guaranteed to exist and speed is critical:** Fermat's little theorem (a^(p-2) mod p for prime p) may be preferred with fast exponentiation.
- **Very large numbers without big-integer support:** The intermediate coefficients can grow large.
- **When inputs are always coprime:** Simpler methods may suffice for modular inverse in special cases.

## Comparison with Similar Algorithms

| Algorithm           | Time              | Space | Notes                                        |
|--------------------|-------------------|-------|----------------------------------------------|
| Extended Euclidean  | O(log(min(a,b)))  | O(1)  | Computes GCD + Bezout coefficients            |
| Euclidean GCD       | O(log(min(a,b)))  | O(1)  | GCD only; no coefficients                     |
| Binary GCD          | O(log(min(a,b))^2)| O(1)  | No division; harder to extend                  |
| Fermat Inverse      | O(log p)          | O(1)  | Modular inverse for prime modulus only         |

## Implementations

| Language   | File |
|------------|------|
| Python     | [ExtendedEuclidean.py](python/ExtendedEuclidean.py) |
| C++        | [ExtendedEuclidean.cpp](cpp/ExtendedEuclidean.cpp) |
| C          | [ExtendedEuclidean.c](c/ExtendedEuclidean.c) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31.2: Greatest Common Divisor.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.5.2.
- [Extended Euclidean Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm)
