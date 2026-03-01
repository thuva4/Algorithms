# Euler Totient Sieve

## Overview

The Euler Totient Sieve computes Euler's totient function phi(k) for all integers from 1 to n simultaneously, using a modified Sieve of Eratosthenes approach. phi(k) counts the number of integers in [1, k] that are coprime to k.

Euler's totient function is one of the most important multiplicative functions in number theory. Computing phi for a single value requires factoring that value, but using a sieve we can compute phi for all values up to n in near-linear time without explicitly factoring each one. This is essential when many totient values are needed, such as in competitive programming or number-theoretic computations.

## How It Works

1. Initialize phi[i] = i for all i from 0 to n.
2. For each integer i from 2 to n: if phi[i] == i, then i is prime. For each prime p found this way, iterate through all multiples j of p (j = p, 2p, 3p, ...) and update phi[j] = phi[j] / p * (p - 1). This applies the multiplicative formula phi(n) = n * product of (1 - 1/p) for each prime p dividing n.
3. After the sieve completes, phi[k] contains the Euler totient of k for all k from 1 to n.

The formula works because phi is multiplicative: for n = p1^a1 * p2^a2 * ... * pk^ak, phi(n) = n * (1 - 1/p1) * (1 - 1/p2) * ... * (1 - 1/pk).

### Input/Output Format

- Input: [n]
- Output: sum of phi(i) for i from 1 to n.

## Worked Example

Compute phi(1) through phi(12) using the sieve.

**Initialize:** phi = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

**p = 2 (prime, since phi[2] == 2):**
Update all multiples of 2: phi[j] = phi[j] / 2 * 1
- phi[2] = 2/2*1 = 1, phi[4] = 4/2*1 = 2, phi[6] = 6/2*1 = 3
- phi[8] = 8/2*1 = 4, phi[10] = 10/2*1 = 5, phi[12] = 12/2*1 = 6

**p = 3 (prime, since phi[3] == 3):**
Update all multiples of 3: phi[j] = phi[j] / 3 * 2
- phi[3] = 3/3*2 = 2, phi[6] = 3/3*2 = 2, phi[9] = 9/3*2 = 6
- phi[12] = 6/3*2 = 4

**p = 5 (prime, since phi[5] == 5):**
- phi[5] = 5/5*4 = 4, phi[10] = 5/5*4 = 4

**p = 7 (prime):** phi[7] = 7/7*6 = 6

**p = 11 (prime):** phi[11] = 11/11*10 = 10

**Result:**

| k   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|-----|---|---|---|---|---|---|---|---|---|----|----|-----|
| phi(k) | 1 | 1 | 2 | 2 | 4 | 2 | 6 | 4 | 6 | 4  | 10 | 4  |

Sum from 1 to 12: 1+1+2+2+4+2+6+4+6+4+10+4 = 46.

## Pseudocode

```
function eulerTotientSieve(n):
    phi = array of size n+1
    for i = 0 to n:
        phi[i] = i

    for p = 2 to n:
        if phi[p] == p:          // p is prime
            for j = p to n step p:
                phi[j] = phi[j] / p * (p - 1)

    return phi
```

Note: The division `phi[j] / p` is exact (integer division) because we process each prime factor of j exactly once, and p divides phi[j] at the point it is processed (since phi[j] was initialized to j, which is a multiple of p).

## Complexity Analysis

| Case    | Time            | Space |
|---------|----------------|-------|
| Best    | O(n log log n) | O(n)  |
| Average | O(n log log n) | O(n)  |
| Worst   | O(n log log n) | O(n)  |

**Why these complexities?**

- **Time -- O(n log log n):** This is the same complexity as the Sieve of Eratosthenes. For each prime p, we visit n/p multiples. The sum n/2 + n/3 + n/5 + n/7 + ... (over all primes up to n) equals O(n log log n) by Mertens' theorem.
- **Space -- O(n):** We store the phi array of n+1 integers.

## Applications

- **Competitive programming:** Many problems require computing phi for a range of values, such as counting coprime pairs or summing GCDs.
- **Counting coprime pairs:** The number of pairs (a, b) with 1 <= a < b <= n and gcd(a, b) = 1 is (sum of phi(k) for k = 2 to n).
- **Farey sequence length:** The length of the Farey sequence F_n is 1 + sum of phi(k) for k = 1 to n.
- **RSA key generation:** phi(n) = phi(p*q) = (p-1)(q-1) is needed to compute the private key.
- **Order of elements in modular arithmetic:** The order of an element modulo n divides phi(n).
- **Mobius inversion:** phi is connected to the Mobius function via the identity phi(n) = sum of mu(d) * (n/d) for d dividing n.

## When NOT to Use

- **When you need phi for a single value:** Factoring n and applying the product formula directly is O(sqrt(n)), much faster than sieving up to n.
- **When n is extremely large (> 10^8):** The O(n) space requirement becomes a bottleneck. Segmented sieve techniques or individual computation may be necessary.
- **When you need phi for a single large prime p:** phi(p) = p - 1 by definition; no computation needed.
- **When only phi(n) modulo something is needed:** In some modular contexts, there are shortcuts that avoid computing the full totient.

## Comparison with Related Methods

| Method                  | Time            | Space | Computes                        |
|------------------------|----------------|-------|----------------------------------|
| Euler Totient Sieve    | O(n log log n) | O(n)  | phi(k) for all k in [1, n]     |
| Linear Sieve (Euler)   | O(n)           | O(n)  | phi(k) for all k in [1, n]; also finds primes |
| Single-value formula    | O(sqrt(n))     | O(1)  | phi(n) for one specific n       |
| Trial Division + formula| O(sqrt(n))    | O(1)  | phi(n) via prime factorization  |
| Sieve of Eratosthenes  | O(n log log n) | O(n)  | Primes only (not phi)           |

The Euler Totient Sieve is the standard approach when all totient values up to n are needed. The linear sieve variant computes phi in strict O(n) time but is more complex to implement. For a single value, direct factorization is preferable.

## Implementations

| Language   | File |
|------------|------|
| Python     | [euler_totient_sieve.py](python/euler_totient_sieve.py) |
| Java       | [EulerTotientSieve.java](java/EulerTotientSieve.java) |
| C++        | [euler_totient_sieve.cpp](cpp/euler_totient_sieve.cpp) |
| C          | [euler_totient_sieve.c](c/euler_totient_sieve.c) |
| Go         | [euler_totient_sieve.go](go/euler_totient_sieve.go) |
| TypeScript | [eulerTotientSieve.ts](typescript/eulerTotientSieve.ts) |
| Rust       | [euler_totient_sieve.rs](rust/euler_totient_sieve.rs) |
| Kotlin     | [EulerTotientSieve.kt](kotlin/EulerTotientSieve.kt) |
| Swift      | [EulerTotientSieve.swift](swift/EulerTotientSieve.swift) |
| Scala      | [EulerTotientSieve.scala](scala/EulerTotientSieve.scala) |
| C#         | [EulerTotientSieve.cs](csharp/EulerTotientSieve.cs) |

## References

- Hardy, G. H., & Wright, E. M. (2008). *An Introduction to the Theory of Numbers* (6th ed.). Oxford University Press. Chapter 5: Arithmetical Functions.
- Apostol, T. M. (1976). *Introduction to Analytic Number Theory*. Springer. Chapter 2: Arithmetical Functions and Dirichlet Multiplication.
- Bach, E., & Shallit, J. (1996). *Algorithmic Number Theory, Volume 1*. MIT Press. Section 8.8.
- [Euler's Totient Function -- Wikipedia](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
