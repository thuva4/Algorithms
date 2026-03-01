# Mobius Function

## Overview

The Mobius function mu(n) is a fundamental multiplicative function in number theory defined as:

- mu(1) = 1
- mu(n) = (-1)^k if n is a product of k distinct primes (square-free with k prime factors)
- mu(n) = 0 if n has any squared prime factor (i.e., p^2 divides n for some prime p)

It is central to the Mobius inversion formula, which allows recovering a function f from its summatory function F (where F(n) = sum of f(d) for d dividing n). The Mobius function also appears in the inclusion-exclusion principle, the Euler totient function identity, and analytic number theory.

## How It Works

### Sieve-Based Computation (for all values up to n)

1. Initialize an array mu[1..n] with mu[i] = 1 for all i.
2. Use a modified sieve of Eratosthenes:
   - For each prime p (found by sieving), for each multiple m of p, flip the sign: mu[m] = -mu[m].
   - For each multiple m of p^2, set mu[m] = 0 (has a squared factor).
3. After the sieve completes, mu[i] contains the correct Mobius function value for each i.

### Single-Value Computation

1. Factorize n into its prime factors.
2. If any prime factor appears with exponent >= 2, return 0.
3. Otherwise, count the number of distinct prime factors k and return (-1)^k.

## Worked Example

Compute mu(n) for n = 1 through 12:

| n  | Factorization | Squared factor? | Distinct primes | mu(n) |
|----|---------------|-----------------|-----------------|-------|
| 1  | 1             | No              | 0               | 1     |
| 2  | 2             | No              | 1               | -1    |
| 3  | 3             | No              | 1               | -1    |
| 4  | 2^2           | Yes             | --              | 0     |
| 5  | 5             | No              | 1               | -1    |
| 6  | 2 * 3         | No              | 2               | 1     |
| 7  | 7             | No              | 1               | -1    |
| 8  | 2^3           | Yes             | --              | 0     |
| 9  | 3^2           | Yes             | --              | 0     |
| 10 | 2 * 5         | No              | 2               | 1     |
| 11 | 11            | No              | 1               | -1    |
| 12 | 2^2 * 3       | Yes             | --              | 0     |

Sum of mu(i) for i = 1 to 12: 1 + (-1) + (-1) + 0 + (-1) + 1 + (-1) + 0 + 0 + 1 + (-1) + 0 = **-2**.

## Pseudocode

```
function mobiusSieve(n):
    mu = array of size n+1, all initialized to 1
    is_prime = array of size n+1, all initialized to true

    for p from 2 to n:
        if is_prime[p]:
            // p is prime; flip sign for all multiples
            for m from p to n step p:
                is_prime[m] = (m == p)  // mark composites
                mu[m] = mu[m] * (-1)

            // Zero out multiples of p^2
            p2 = p * p
            for m from p2 to n step p2:
                mu[m] = 0

    return mu
```

## Complexity Analysis

| Case    | Time            | Space |
|---------|-----------------|-------|
| Best    | O(n log log n)  | O(n)  |
| Average | O(n log log n)  | O(n)  |
| Worst   | O(n log log n)  | O(n)  |

- **Time O(n log log n):** Same as the sieve of Eratosthenes -- each prime marks its multiples.
- **Space O(n):** Arrays for mu and primality flags.
- For a single value, trial division gives O(sqrt(n)) time.

## Applications

- **Mobius inversion:** Recovering f(n) from its Dirichlet convolution sum F(n) = sum_{d|n} f(d).
- **Counting square-free numbers:** The count of square-free integers up to n is sum_{k=1}^{sqrt(n)} mu(k) * floor(n / k^2).
- **Euler's totient function:** phi(n) = sum_{d|n} mu(d) * (n/d).
- **Inclusion-exclusion in combinatorics:** The Mobius function on a poset generalizes the inclusion-exclusion principle.
- **Analytic number theory:** Appears in the relationship between the Riemann zeta function and prime counting.

## When NOT to Use

- **When only a single value is needed and n is small:** Direct trial factorization is simpler than running a full sieve.
- **When n is extremely large (> 10^9):** The sieve requires O(n) memory, which becomes impractical. Use segmented or sub-linear methods instead.
- **When a different arithmetic function suffices:** If you only need Euler's totient, compute it directly with a totient sieve rather than going through Mobius inversion.

## Comparison

| Method                    | Time             | Space  | Computes           |
|---------------------------|------------------|--------|--------------------|
| Mobius sieve              | O(n log log n)   | O(n)   | All mu(1..n)       |
| Linear sieve              | O(n)             | O(n)   | All mu(1..n) + primes |
| Trial division (single)   | O(sqrt(n))       | O(1)   | Single mu(n)       |
| Meissel-like sublinear    | O(n^(2/3))       | O(n^(1/3)) | Partial sums of mu |

## References

- Hardy, G. H., & Wright, E. M. (2008). *An Introduction to the Theory of Numbers* (6th ed.). Oxford University Press.
- Apostol, T. M. (1976). *Introduction to Analytic Number Theory*. Springer.
- [Mobius function -- Wikipedia](https://en.wikipedia.org/wiki/M%C3%B6bius_function)
- [Mobius function -- CP-algorithms](https://cp-algorithms.com/algebra/mobius-function.html)

## Implementations

| Language   | File |
|------------|------|
| Python     | [mobius_function.py](python/mobius_function.py) |
| Java       | [MobiusFunction.java](java/MobiusFunction.java) |
| C++        | [mobius_function.cpp](cpp/mobius_function.cpp) |
| C          | [mobius_function.c](c/mobius_function.c) |
| Go         | [mobius_function.go](go/mobius_function.go) |
| TypeScript | [mobiusFunction.ts](typescript/mobiusFunction.ts) |
| Rust       | [mobius_function.rs](rust/mobius_function.rs) |
| Kotlin     | [MobiusFunction.kt](kotlin/MobiusFunction.kt) |
| Swift      | [MobiusFunction.swift](swift/MobiusFunction.swift) |
| Scala      | [MobiusFunction.scala](scala/MobiusFunction.scala) |
| C#         | [MobiusFunction.cs](csharp/MobiusFunction.cs) |
