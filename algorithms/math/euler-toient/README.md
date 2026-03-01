# Euler's Totient Function

## Overview

Euler's Totient Function phi(n) counts the number of integers from 1 to n that are coprime to n (i.e., their greatest common divisor with n is 1). For example, phi(12) = 4, because the integers 1, 5, 7, and 11 are coprime to 12. For a prime p, phi(p) = p - 1 since all integers from 1 to p - 1 are coprime to p.

The totient function is a cornerstone of number theory with direct applications in RSA cryptography (where the private key is computed using phi), modular arithmetic (Euler's theorem states that a^phi(n) = 1 mod n for coprime a and n), and counting problems in abstract algebra.

## How It Works

The algorithm computes phi(n) by finding all prime factors of n and using the formula: phi(n) = n * product of (1 - 1/p) for each distinct prime factor p of n. To avoid floating-point issues, this is computed as: start with result = n, then for each prime factor p, update result = result - result/p. The prime factors are found by trial division up to sqrt(n).

### Example

Computing `phi(36)`:

**Step 1: Find prime factorization of 36:**
36 = 2^2 * 3^2

**Step 2: Apply the formula:**

| Step | Prime factor p | result before | result = result - result/p | result after |
|------|---------------|---------------|---------------------------|-------------|
| Start | - | 36 | - | 36 |
| 1 | 2 | 36 | 36 - 36/2 = 36 - 18 | 18 |
| 2 | 3 | 18 | 18 - 18/3 = 18 - 6 | 12 |

Result: `phi(36) = 12`

**Verification:** Numbers from 1 to 36 coprime to 36:
1, 5, 7, 11, 13, 17, 19, 23, 25, 29, 31, 35 -- exactly 12 numbers.

**Another example -- phi(30):**

30 = 2 * 3 * 5

| Step | Prime factor p | result |
|------|---------------|--------|
| Start | - | 30 |
| 1 | 2 | 30 - 15 = 15 |
| 2 | 3 | 15 - 5 = 10 |
| 3 | 5 | 10 - 2 = 8 |

Result: `phi(30) = 8`

## Pseudocode

```
function eulerTotient(n):
    result = n
    p = 2

    while p * p <= n:
        if n mod p == 0:
            // Remove all factors of p
            while n mod p == 0:
                n = n / p
            result = result - result / p
        p = p + 1

    // If n still has a prime factor greater than sqrt(original n)
    if n > 1:
        result = result - result / n

    return result
```

The algorithm performs trial division to find prime factors. For each distinct prime factor p, it applies the multiplicative formula. If after processing all factors up to sqrt(n), the remaining n is greater than 1, it is itself a prime factor.

## Complexity Analysis

| Case    | Time      | Space |
|---------|----------|-------|
| Best    | O(sqrt(n))| O(1)  |
| Average | O(sqrt(n))| O(1)  |
| Worst   | O(sqrt(n))| O(1)  |

**Why these complexities?**

- **Best Case -- O(sqrt(n)):** Even when n is prime (requiring trial division up to sqrt(n) to confirm no factors exist), the algorithm still runs in O(sqrt(n)) time.

- **Average Case -- O(sqrt(n)):** The trial division loop runs up to sqrt(n). Most composite numbers have small prime factors and are factored quickly, but the loop bound is sqrt(n).

- **Worst Case -- O(sqrt(n)):** The algorithm checks divisors from 2 to sqrt(n). For highly composite numbers with many small factors, the inner while loop runs more but the total work is still dominated by the outer loop.

- **Space -- O(1):** Only a result variable and loop counter are needed. No arrays or data structures are required.

## When to Use

- **RSA cryptography:** Computing the private key requires phi(n) where n = p * q for large primes p and q.
- **Modular exponentiation:** Euler's theorem allows reducing exponents modulo phi(n).
- **Counting coprime pairs:** phi(n) directly gives the count of integers coprime to n.
- **Group theory applications:** phi(n) gives the order of the multiplicative group of integers modulo n.

## When NOT to Use

- **Very large n without known factorization:** Computing phi(n) is as hard as factoring n. For cryptographic-size numbers, factoring is intractable.
- **When phi is needed for all numbers up to n:** Use a sieve-based approach (modify the Sieve of Eratosthenes) to compute phi for all values in O(n log log n).
- **When n is prime and already known to be prime:** Simply return n - 1 without the full algorithm.

## Comparison with Similar Algorithms

| Method                | Time           | Space | Notes                                        |
|----------------------|---------------|-------|----------------------------------------------|
| Trial Division Totient| O(sqrt(n))    | O(1)  | Standard approach for a single value          |
| Sieve-based Totient   | O(n log log n)| O(n)  | Computes phi for all values 1 to n            |
| Factorization-based   | O(sqrt(n))    | O(1)  | Same as trial division; uses product formula  |
| GCD counting (naive)  | O(n log n)    | O(1)  | Check GCD for each number 1..n; inefficient   |

## Implementations

| Language | File |
|----------|------|
| C++      | [toient.cpp](cpp/toient.cpp) |

## References

- Hardy, G. H., & Wright, E. M. (2008). *An Introduction to the Theory of Numbers* (6th ed.). Oxford University Press. Chapter 5: Arithmetical Functions.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31.3: Modular Arithmetic.
- [Euler's Totient Function -- Wikipedia](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
