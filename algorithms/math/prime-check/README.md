# Prime Check

## Overview

A prime check (or primality test) determines whether a given number n is prime -- that is, whether it has no positive divisors other than 1 and itself. The trial division method is the simplest approach: it tests whether n is divisible by any integer from 2 to sqrt(n). If no divisor is found, n is prime. For example, 37 is prime because no integer from 2 to 6 (the floor of sqrt(37)) divides it.

Prime checking is a fundamental operation in number theory and cryptography. While trial division is efficient for small numbers (up to about 10^12), larger numbers require probabilistic tests like Miller-Rabin.

## How It Works

The algorithm first handles small cases: numbers less than 2 are not prime, 2 and 3 are prime. It then checks divisibility by 2 and 3. For remaining candidates, it only tests divisors of the form 6k +/- 1 (since all primes greater than 3 are of this form), up to sqrt(n). This optimization reduces the number of checks by a factor of 3 compared to testing every integer.

### Example

Checking if `n = 97` is prime:

sqrt(97) ~= 9.85, so check divisors up to 9.

| Step | Divisor | 97 mod divisor | Divides? |
|------|---------|---------------|----------|
| 1 | 2 | 97 mod 2 = 1 | No |
| 2 | 3 | 97 mod 3 = 1 | No |
| 3 | 5 (6*1-1) | 97 mod 5 = 2 | No |
| 4 | 7 (6*1+1) | 97 mod 7 = 6 | No |

No divisor found up to sqrt(97). Result: `97 is prime`

Checking if `n = 91` is prime:

sqrt(91) ~= 9.54, so check divisors up to 9.

| Step | Divisor | 91 mod divisor | Divides? |
|------|---------|---------------|----------|
| 1 | 2 | 91 mod 2 = 1 | No |
| 2 | 3 | 91 mod 3 = 1 | No |
| 3 | 5 (6*1-1) | 91 mod 5 = 1 | No |
| 4 | 7 (6*1+1) | 91 mod 7 = 0 | Yes! |

Result: `91 is not prime` (91 = 7 * 13)

## Pseudocode

```
function isPrime(n):
    if n <= 1:
        return false
    if n <= 3:
        return true
    if n mod 2 == 0 or n mod 3 == 0:
        return false

    i = 5
    while i * i <= n:
        if n mod i == 0 or n mod (i + 2) == 0:
            return false
        i = i + 6

    return true
```

The loop checks divisors 5, 7, 11, 13, 17, 19, ... (i.e., 6k-1 and 6k+1). This skips all multiples of 2 and 3, checking only 1/3 of potential divisors.

## Complexity Analysis

| Case    | Time      | Space |
|---------|----------|-------|
| Best    | O(1)     | O(1)  |
| Average | O(sqrt(n))| O(1)  |
| Worst   | O(sqrt(n))| O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** If n is even (and > 2) or divisible by 3, the algorithm returns immediately after one or two checks.

- **Average Case -- O(sqrt(n)):** On average, composite numbers are detected relatively early (many have small prime factors), but the algorithm must check up to sqrt(n) for numbers that are prime or have large smallest prime factors.

- **Worst Case -- O(sqrt(n)):** When n is prime, the algorithm must test all candidates up to sqrt(n) before concluding. There are approximately sqrt(n)/3 candidates to check (using the 6k +/- 1 optimization).

- **Space -- O(1):** The algorithm uses only a loop counter and comparison variable. No arrays or data structures are needed.

## When to Use

- **Checking individual small numbers:** For numbers up to about 10^12, trial division is fast and simple.
- **When a deterministic answer is needed:** Unlike probabilistic tests, trial division gives a definitive answer.
- **As a subroutine:** Many algorithms (factorization, sieve verification) use trial division as a building block.
- **Educational contexts:** Trial division clearly demonstrates the concept of primality.

## When NOT to Use

- **Very large numbers (> 10^12):** Trial division becomes too slow. Use Miller-Rabin or AKS primality test.
- **Checking many numbers in a range:** Use the Sieve of Eratosthenes to precompute all primes up to n.
- **Cryptographic applications:** RSA key generation requires testing primes with hundreds of digits; probabilistic tests are essential.
- **When the number is guaranteed to be in a known range:** A precomputed lookup table may be faster.

## Comparison with Similar Algorithms

| Algorithm              | Time            | Space   | Notes                                     |
|-----------------------|----------------|---------|-------------------------------------------|
| Trial Division         | O(sqrt(n))     | O(1)    | Simple; deterministic; small numbers       |
| Sieve of Eratosthenes  | O(n log log n) | O(n)    | Batch; finds all primes up to n            |
| Miller-Rabin           | O(k log^2 n)  | O(1)    | Probabilistic; fast for very large n       |
| AKS                    | O(log^6 n)    | O(log^3 n)| Deterministic polynomial; impractical     |
| Fermat Test            | O(k log^2 n)  | O(1)    | Probabilistic; fooled by Carmichael numbers|

## Implementations

| Language | File |
|----------|------|
| Python   | [primecheck.py](python/primecheck.py) |
| C++      | [primecheck.cpp](cpp/primecheck.cpp) |
| C        | [primeCheck.c](c/primeCheck.c) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31: Number-Theoretic Algorithms.
- Hardy, G. H., & Wright, E. M. (2008). *An Introduction to the Theory of Numbers* (6th ed.). Oxford University Press. Chapter 22.
- [Primality Test -- Wikipedia](https://en.wikipedia.org/wiki/Primality_test)
