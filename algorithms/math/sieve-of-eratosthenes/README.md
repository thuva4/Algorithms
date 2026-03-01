# Sieve of Eratosthenes

## Overview

The Sieve of Eratosthenes is an ancient and efficient algorithm for finding all prime numbers up to a given limit n. It works by iteratively marking the multiples of each prime number as composite, starting from 2. After processing, all unmarked numbers are prime. The algorithm was attributed to the Greek mathematician Eratosthenes of Cyrene around 240 BC.

The sieve is remarkably efficient with O(n log log n) time complexity and is the standard method for generating prime tables. It is used in number theory, cryptography (generating large primes), and as a preprocessing step for algorithms that need to query primality.

## How It Works

The algorithm creates a boolean array of size n + 1, initially marking all entries as true (potentially prime). Starting from the first prime (2), it marks all multiples of 2 as composite. It then moves to the next unmarked number (3) and marks all its multiples. This process continues up to sqrt(n), since any composite number <= n must have a factor <= sqrt(n). The optimization of starting to mark from p^2 (rather than 2p) is used because smaller multiples have already been marked by smaller primes.

### Example

Finding all primes up to `n = 30`:

**Initial array:** All marked as prime (T)

```
2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T  T
```

| Step | Prime p | Mark multiples starting from p^2 | Numbers marked composite |
|------|---------|----------------------------------|--------------------------|
| 1 | 2 | 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 | 14 numbers |
| 2 | 3 | 9, 15, 21, 27 (6,12,18,24,30 already marked) | 4 new numbers |
| 3 | 5 | 25 (10,15,20,25,30 -- only 25 is new) | 1 new number |
| Done | sqrt(30) ~= 5.47, so stop after p = 5 | | |

**Final array (T = prime):**

```
2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
T  T  .  T  .  T  .  .  .  T  .  T  .  .  .  T  .  T  .  .  .  T  .  .  .  .  .  T  .
```

Result: Primes up to 30 = `{2, 3, 5, 7, 11, 13, 17, 19, 23, 29}`

## Pseudocode

```
function sieveOfEratosthenes(n):
    is_prime = array of size (n + 1), all set to true
    is_prime[0] = false
    is_prime[1] = false

    for p from 2 to sqrt(n):
        if is_prime[p]:
            // Mark all multiples of p starting from p^2
            for multiple from p * p to n, step p:
                is_prime[multiple] = false

    // Collect primes
    primes = empty list
    for i from 2 to n:
        if is_prime[i]:
            primes.append(i)

    return primes
```

The key optimization of starting the inner loop from p^2 means that for p = 5, we start marking at 25 rather than 10 (since 10 = 2*5 was already marked when processing p = 2).

## Complexity Analysis

| Case    | Time           | Space |
|---------|---------------|-------|
| Best    | O(n log log n) | O(n)  |
| Average | O(n log log n) | O(n)  |
| Worst   | O(n log log n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n log log n):** The algorithm always processes the same number of operations regardless of which numbers turn out to be prime. The total marking operations sum to n/2 + n/3 + n/5 + n/7 + ... (sum over primes up to n), which equals O(n log log n) by Mertens' theorem.

- **Average Case -- O(n log log n):** Same as best case. The sieve's work is determined by n, not by the distribution of primes.

- **Worst Case -- O(n log log n):** Identical to all cases. The algorithm is completely deterministic.

- **Space -- O(n):** The boolean array requires n + 1 entries. For very large n, bitwise storage can reduce this by a factor of 8 (1 bit per number instead of 1 byte).

## When to Use

- **Generating all primes up to n:** The primary use case -- creating a prime table for subsequent lookups.
- **When many primality queries are needed:** After sieving, checking if any number <= n is prime takes O(1).
- **As a preprocessing step:** Many number theory algorithms (factorization, Euler's totient) benefit from having a precomputed prime table.
- **When n is manageable (up to ~10^8):** The sieve fits in memory and runs quickly for these ranges.

## When NOT to Use

- **Very large ranges (n > 10^9):** The O(n) memory requirement becomes prohibitive. Use the Segmented Sieve instead.
- **Checking if a single number is prime:** A simple primality test (trial division up to sqrt(n) or Miller-Rabin) is more efficient.
- **When primes in a specific range [a, b] are needed:** The Segmented Sieve is more memory-efficient for windowed prime generation.
- **Generating primes on the fly:** If you need primes one at a time, incremental sieves or probabilistic tests may be better.

## Comparison with Similar Algorithms

| Algorithm           | Time             | Space      | Notes                                       |
|--------------------|-----------------|------------|---------------------------------------------|
| Sieve of Eratosthenes | O(n log log n) | O(n)      | Classic; simple and fast                     |
| Segmented Sieve     | O(n log log n)  | O(sqrt(n)) | Memory-efficient for large ranges            |
| Trial Division      | O(sqrt(n)) each | O(1)       | Per-number test; no preprocessing             |
| Miller-Rabin        | O(k log^2 n)   | O(1)       | Probabilistic; for very large individual numbers|
| Sieve of Atkin      | O(n)            | O(n)       | Theoretically faster; higher constant factor  |

## Implementations

| Language   | File |
|------------|------|
| Python     | [sieveOfEratosthenes.py](python/sieveOfEratosthenes.py) |
| Java       | [SieveofEratosthenes.java](java/SieveofEratosthenes.java) |
| C++        | [SieveofEratosthenes.cpp](cpp/SieveofEratosthenes.cpp) |
| C          | [Eratosthenes.c](c/Eratosthenes.c) |
| C#         | [SieveofEratosthenes.cs](csharp/SieveofEratosthenes.cs) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Hardy, G. H., & Wright, E. M. (2008). *An Introduction to the Theory of Numbers* (6th ed.). Oxford University Press.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31: Number-Theoretic Algorithms.
- [Sieve of Eratosthenes -- Wikipedia](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)
