# Primality Tests

## Overview

Primality tests are algorithms that determine whether a given number is prime. Probabilistic primality tests, such as the Fermat test and the Miller-Rabin test, can efficiently handle very large numbers (hundreds or thousands of digits) where trial division is impractical. These tests trade deterministic certainty for speed: they can declare a number "probably prime" with an arbitrarily small error probability by running multiple rounds.

The Miller-Rabin test is the industry standard for primality testing in cryptography. It is used in RSA key generation, Diffie-Hellman parameter selection, and any application requiring large random primes. With k rounds, the probability of a composite passing the test is at most 4^(-k).

## How It Works

**Fermat Test:** Based on Fermat's Little Theorem, which states that if p is prime and a is not divisible by p, then a^(p-1) = 1 (mod p). The test picks random bases a and checks this condition. If it fails, n is definitely composite. If it passes, n is "probably prime." The weakness is that Carmichael numbers fool this test for all bases.

**Miller-Rabin Test:** Writes n-1 as 2^s * d (where d is odd), then checks that for a random base a, either a^d = 1 (mod n) or a^(2^r * d) = -1 (mod n) for some 0 <= r < s. This is a stronger condition that eliminates Carmichael number false positives.

### Example

Testing if `n = 221` is prime using Miller-Rabin:

**Step 1: Express n - 1 = 220 = 2^2 * 55**, so s = 2, d = 55.

**Round 1: base a = 174:**

| Step | Computation | Result | Conclusion |
|------|------------|--------|------------|
| 1 | 174^55 mod 221 | 47 | Not 1 or 220, continue |
| 2 | 47^2 mod 221 | 220 | Found -1 (mod 221), pass this round |

**Round 2: base a = 137:**

| Step | Computation | Result | Conclusion |
|------|------------|--------|------------|
| 1 | 137^55 mod 221 | 188 | Not 1 or 220, continue |
| 2 | 188^2 mod 221 | 205 | Not 1 or 220, and no more squarings |
| 3 | - | - | Composite! (witness found) |

Result: `221 is composite` (221 = 13 * 17)

**Testing n = 97 (which is prime):**

n - 1 = 96 = 2^5 * 3, so s = 5, d = 3.

| Round | Base a | a^d mod 97 | Result |
|-------|--------|-----------|--------|
| 1 | 2 | 2^3 mod 97 = 8 | 8 -> 64 -> 22 -> 96 = -1, pass |
| 2 | 5 | 5^3 mod 97 = 28 | 28 -> 96 = -1, pass |
| 3 | 7 | 7^3 mod 97 = 52 | 52 -> 96 = -1, pass |

After k rounds with no composite witness: `97 is probably prime`

## Pseudocode

```
function millerRabin(n, k):
    if n < 2: return false
    if n == 2 or n == 3: return true
    if n mod 2 == 0: return false

    // Write n - 1 as 2^s * d
    s = 0
    d = n - 1
    while d mod 2 == 0:
        d = d / 2
        s = s + 1

    // Perform k rounds
    for round from 1 to k:
        a = random integer in [2, n - 2]
        x = modularExponentiation(a, d, n)

        if x == 1 or x == n - 1:
            continue    // pass this round

        for r from 1 to s - 1:
            x = (x * x) mod n
            if x == n - 1:
                break
        else:
            return false    // composite

    return true    // probably prime
```

Modular exponentiation (a^d mod n) is computed using the square-and-multiply method in O(log d) time.

## Complexity Analysis

| Case    | Time          | Space |
|---------|--------------|-------|
| Best    | O(k log^2 n) | O(1)  |
| Average | O(k log^2 n) | O(1)  |
| Worst   | O(k log^2 n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(k log^2 n):** Each round computes a modular exponentiation (O(log n) squarings, each costing O(log n) for the multiplication), giving O(log^2 n) per round and O(k log^2 n) total.

- **Average Case -- O(k log^2 n):** The same as best case. Each round performs the same amount of work regardless of whether the base is a witness or not.

- **Worst Case -- O(k log^2 n):** Each round performs exactly s - 1 additional squarings in the worst case, but s <= log n, so this is already accounted for.

- **Space -- O(1):** Only a few variables for the base, exponentiation result, and counters are needed. No arrays or data structures are required.

## When to Use

- **Testing very large numbers:** For numbers with hundreds of digits, trial division is impossible but Miller-Rabin runs in milliseconds.
- **Cryptographic key generation:** Generating large random primes for RSA, Diffie-Hellman, and other protocols.
- **When probabilistic answers are acceptable:** With 20-40 rounds, the error probability is less than 10^(-12).
- **When speed is critical:** Miller-Rabin is orders of magnitude faster than deterministic primality tests for large numbers.

## When NOT to Use

- **When a deterministic answer is required:** Use AKS primality test (polynomial time but slow in practice) or deterministic Miller-Rabin with specific base sets for bounded ranges.
- **Finding all primes in a range:** Use the Sieve of Eratosthenes instead.
- **Small numbers (< 10^6):** Trial division or a precomputed sieve is simpler and faster.
- **When the number is already known to be composite:** Factorization algorithms are more appropriate.

## Comparison with Similar Algorithms

| Algorithm           | Time          | Type           | Notes                                    |
|--------------------|--------------|----------------|------------------------------------------|
| Miller-Rabin        | O(k log^2 n) | Probabilistic  | Industry standard; error <= 4^(-k)        |
| Fermat Test         | O(k log^2 n) | Probabilistic  | Weaker; fooled by Carmichael numbers      |
| Trial Division      | O(sqrt(n))   | Deterministic  | Only practical for small n                |
| AKS                 | O(log^6 n)   | Deterministic  | Polynomial but impractically slow         |
| Solovay-Strassen    | O(k log^2 n) | Probabilistic  | Error <= 2^(-k); weaker than Miller-Rabin |

## Implementations

| Language | File |
|----------|------|
| C++ (Fermat) | [isPrimeFermat.cpp](cpp/isPrimeFermat.cpp) |
| C++ (Miller-Rabin) | [isPrimeMillerRabin.cpp](cpp/isPrimeMillerRabin.cpp) |

## References

- Miller, G. L. (1976). Riemann's hypothesis and tests for primality. *Journal of Computer and System Sciences*, 13(3), 300-317.
- Rabin, M. O. (1980). Probabilistic algorithm for testing primality. *Journal of Number Theory*, 12(1), 128-138.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31.8: Primality Testing.
- [Miller-Rabin Primality Test -- Wikipedia](https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test)
