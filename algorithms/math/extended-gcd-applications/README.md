# Extended GCD Applications

## Overview

This algorithm computes the modular multiplicative inverse of `a` modulo `m` using the extended Euclidean algorithm. The modular inverse of a modulo m is the integer x such that a*x = 1 (mod m). The inverse exists if and only if gcd(a, m) = 1 (i.e., a and m are coprime).

The extended Euclidean algorithm finds integers x and y such that a*x + m*y = gcd(a, m). When gcd(a, m) = 1, this gives a*x + m*y = 1, meaning a*x = 1 (mod m), so x is the modular inverse of a modulo m.

## How It Works

1. Run the extended Euclidean algorithm on a and m to find gcd(a, m) and coefficient x such that a*x + m*y = gcd(a, m).
2. If gcd(a, m) != 1, the inverse does not exist. Return -1.
3. Otherwise, normalize x to be in the range [0, m) by computing ((x mod m) + m) mod m.
4. Return the normalized inverse.

Input format: `[a, m]`
Output: modular inverse of a mod m, or -1 if it does not exist.

## Worked Example

Find the modular inverse of 3 modulo 11.

We need x such that 3*x = 1 (mod 11).

**Extended Euclidean Algorithm on (3, 11):**

| Step | a  | b | q | x  | y  |
|------|----|---|---|----|----|
| 0    | 11 | 3 | - | 0  | 1  |
| 1    | 3  | 2 | 3 | 1  | -3 |
| 2    | 2  | 1 | 1 | -1 | 4  |
| 3    | 1  | 0 | 2 | -  | -  |

Result: gcd(3, 11) = 1, x = 4 (coefficient for a = 3).

**Verify:** 3 * 4 = 12 = 1 (mod 11). Correct.

Another example: Find the inverse of 6 modulo 9.
- gcd(6, 9) = 3 != 1, so the inverse does not exist. Return -1.

## Pseudocode

```
function modularInverse(a, m):
    (g, x, y) = extendedGCD(a, m)
    if g != 1:
        return -1        // inverse does not exist
    return ((x mod m) + m) mod m

function extendedGCD(a, b):
    if a == 0:
        return (b, 0, 1)
    (g, x1, y1) = extendedGCD(b mod a, a)
    x = y1 - (b / a) * x1
    y = x1
    return (g, x, y)
```

Alternative iterative version:

```
function extendedGCD_iterative(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1

    while r != 0:
        q = old_r / r
        (old_r, r) = (r, old_r - q * r)
        (old_s, s) = (s, old_s - q * s)
        (old_t, t) = (t, old_t - q * t)

    return (old_r, old_s, old_t)    // gcd, x, y
```

## Complexity Analysis

| Case    | Time               | Space              |
|---------|--------------------|--------------------|
| Best    | O(1)               | O(1)               |
| Average | O(log(min(a, m)))  | O(log(min(a, m)))  |
| Worst   | O(log(min(a, m)))  | O(log(min(a, m)))  |

**Why these complexities?**

- **Best Case -- O(1):** When a = 1, the inverse is trivially 1.
- **Average/Worst Case -- O(log(min(a, m))):** The extended Euclidean algorithm performs the same number of steps as the standard Euclidean algorithm. The number of divisions is bounded by the number of digits in the smaller input, which is O(log(min(a, m))). The worst case occurs for consecutive Fibonacci numbers.
- **Space:** The recursive version uses O(log(min(a, m))) stack frames. The iterative version uses O(1) space.

## Applications

- **RSA cryptography:** Computing the private key d = e^(-1) mod phi(n), where e is the public exponent and phi(n) is Euler's totient of the modulus.
- **Modular division:** In modular arithmetic, division by a is multiplication by a^(-1). This is essential in many number-theoretic algorithms.
- **Chinese Remainder Theorem:** CRT requires computing modular inverses to combine congruences.
- **Solving linear congruences:** The equation a*x = b (mod m) has solution x = b * a^(-1) (mod m) when gcd(a, m) = 1.
- **Finite field arithmetic:** Modular inverse is the multiplicative inverse operation in Z/pZ (integers modulo a prime p).
- **Error-correcting codes:** Reed-Solomon codes require field inversions over GF(p).

## When NOT to Use

- **When m is prime and a is small:** Fermat's little theorem gives a^(-1) = a^(m-2) mod m via modular exponentiation. This is simpler to implement (no extended GCD needed) but slower: O(log m) multiplications vs O(log a) divisions.
- **When gcd(a, m) != 1:** The inverse does not exist. Check this condition first before calling the algorithm.
- **When batch inverses are needed:** If you need the inverses of a[1], a[2], ..., a[n] modulo the same m, Montgomery's batch inversion trick computes all n inverses using only 1 extended GCD call and 3(n-1) multiplications, which is much faster than n separate inverse computations.
- **When working in a prime field with precomputed tables:** For small primes, a lookup table of inverses is faster.

## Comparison with Inverse Methods

| Method                 | Time             | Space | Requirements           |
|-----------------------|-----------------|-------|------------------------|
| Extended Euclidean    | O(log(min(a,m)))| O(1)* | gcd(a, m) = 1         |
| Fermat's Little Thm   | O(log m)        | O(1)  | m must be prime        |
| Euler's Theorem       | O(log phi(m))   | O(1)  | Need to know phi(m)   |
| Lookup Table          | O(1)            | O(m)  | Small m; precomputation|
| Montgomery Batch      | O(n + log m)    | O(n)  | For n inverses at once |

*O(1) for the iterative version; O(log(min(a,m))) for the recursive version.

The extended Euclidean approach is the most general and efficient method for computing a single modular inverse. It works for any modulus (not just primes) and is the standard building block for more complex algorithms.

## Implementations

| Language   | File |
|------------|------|
| Python     | [extended_gcd_applications.py](python/extended_gcd_applications.py) |
| Java       | [ExtendedGcdApplications.java](java/ExtendedGcdApplications.java) |
| C++        | [extended_gcd_applications.cpp](cpp/extended_gcd_applications.cpp) |
| C          | [extended_gcd_applications.c](c/extended_gcd_applications.c) |
| Go         | [extended_gcd_applications.go](go/extended_gcd_applications.go) |
| TypeScript | [extendedGcdApplications.ts](typescript/extendedGcdApplications.ts) |
| Rust       | [extended_gcd_applications.rs](rust/extended_gcd_applications.rs) |
| Kotlin     | [ExtendedGcdApplications.kt](kotlin/ExtendedGcdApplications.kt) |
| Swift      | [ExtendedGcdApplications.swift](swift/ExtendedGcdApplications.swift) |
| Scala      | [ExtendedGcdApplications.scala](scala/ExtendedGcdApplications.scala) |
| C#         | [ExtendedGcdApplications.cs](csharp/ExtendedGcdApplications.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 31.4: Solving modular linear equations.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.5.2, Algorithm X.
- Shoup, V. (2009). *A Computational Introduction to Number Theory and Algebra* (2nd ed.). Cambridge University Press. Chapter 4.
- [Extended Euclidean Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm)
