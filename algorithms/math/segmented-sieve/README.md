# Segmented Sieve

## Overview

The Segmented Sieve is a memory-efficient variant of the Sieve of Eratosthenes that finds all prime numbers in a range [L, R] using only O(sqrt(R)) space instead of O(R) space. It works by first sieving primes up to sqrt(R) using the standard sieve, then using those primes to mark composites in segments of the target range. This makes it practical for finding primes in ranges where the standard sieve would require prohibitive memory.

The Segmented Sieve is essential when dealing with large ranges (e.g., finding primes between 10^12 and 10^12 + 10^6) where allocating an array of size 10^12 is impossible, but the actual segment size is manageable.

## How It Works

The algorithm has two phases. First, it uses the standard Sieve of Eratosthenes to find all primes up to sqrt(R). Second, it processes the range [L, R] in segments of size approximately sqrt(R). For each segment, it marks multiples of each small prime as composite. The first multiple of prime p in the segment is computed as ceil(L / p) * p.

### Example

Finding primes in range `[20, 50]`:

**Step 1: Find primes up to sqrt(50) ~= 7 using standard sieve:**

Small primes: {2, 3, 5, 7}

**Step 2: Mark composites in segment [20, 50]:**

Initial segment (all marked as prime):

```
20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50
```

| Prime p | First multiple >= 20 | Multiples marked composite |
|---------|---------------------|---------------------------|
| 2 | 20 | 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50 |
| 3 | 21 | 21, 24, 27, 30, 33, 36, 39, 42, 45, 48 |
| 5 | 20 | 20, 25, 30, 35, 40, 45, 50 |
| 7 | 21 | 21, 28, 35, 42, 49 |

**After marking:**

```
20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41  42  43  44  45  46  47  48  49  50
 .   .   .   P   .   .   .   .   .   P   .   P   .   .   .   .   .   P   .   .   .   P   .   P   .   .   .   P   .   .   .
```

Result: Primes in [20, 50] = `{23, 29, 31, 37, 41, 43, 47}`

## Pseudocode

```
function segmentedSieve(L, R):
    // Step 1: Find small primes up to sqrt(R)
    limit = floor(sqrt(R))
    small_primes = sieveOfEratosthenes(limit)

    // Step 2: Process the segment [L, R]
    segment_size = R - L + 1
    is_prime = array of size segment_size, all set to true

    // Mark 0 and 1 as not prime if in range
    if L <= 1:
        for i from L to min(1, R):
            is_prime[i - L] = false

    for each prime p in small_primes:
        // Find the first multiple of p in [L, R]
        start = ceil(L / p) * p
        if start == p:
            start = start + p    // p itself is prime

        for multiple from start to R, step p:
            is_prime[multiple - L] = false

    // Collect primes
    primes = empty list
    for i from 0 to segment_size - 1:
        if is_prime[i]:
            primes.append(L + i)

    return primes
```

The key optimization is computing `ceil(L / p) * p` to find the first multiple of p in the range, avoiding iteration from 0.

## Complexity Analysis

| Case    | Time           | Space      |
|---------|---------------|------------|
| Best    | O(n log log n) | O(sqrt(n)) |
| Average | O(n log log n) | O(sqrt(n)) |
| Worst   | O(n log log n) | O(sqrt(n)) |

**Why these complexities?**

- **Best Case -- O(n log log n):** The total work across all segments is the same as the standard sieve: sum of n/p for each prime p up to sqrt(n), which equals O(n log log n).

- **Average Case -- O(n log log n):** Each number in the range is marked at most once for each of its prime factors. The analysis is identical to the standard sieve.

- **Worst Case -- O(n log log n):** The algorithm is deterministic and performs the same work regardless of which numbers are prime.

- **Space -- O(sqrt(n)):** The small primes array has O(sqrt(n) / ln(sqrt(n))) entries, and each segment requires O(sqrt(n)) space. At any time, only one segment is in memory.

## When to Use

- **Large ranges:** When the range [L, R] is too large for a standard sieve (e.g., R > 10^8).
- **Finding primes in a high range:** Finding primes near 10^12 is infeasible with a standard sieve but easy with a segmented sieve.
- **Memory-constrained environments:** When O(n) memory is not available but O(sqrt(n)) is.
- **When only a portion of the prime table is needed:** The segmented approach avoids computing unnecessary primes.

## When NOT to Use

- **Small ranges (n < 10^7):** The standard Sieve of Eratosthenes is simpler and has similar performance for small n.
- **When you need primes for multiple disjoint ranges:** Each range requires a separate segmented sieve pass.
- **Testing primality of a single number:** Use Miller-Rabin or trial division instead.
- **When the segment size is very large:** If R - L itself exceeds available memory, even the segmented approach needs further partitioning.

## Comparison with Similar Algorithms

| Algorithm              | Time           | Space      | Notes                                    |
|-----------------------|---------------|------------|------------------------------------------|
| Segmented Sieve        | O(n log log n) | O(sqrt(n)) | Memory-efficient; processes in segments   |
| Sieve of Eratosthenes  | O(n log log n) | O(n)       | Simpler; needs full array                 |
| Trial Division         | O(sqrt(n)) each| O(1)       | Per-number test; no preprocessing         |
| Miller-Rabin           | O(k log^2 n)  | O(1)       | Per-number probabilistic test              |

## Implementations

| Language | File |
|----------|------|
| Python   | [segmented-sieve.py](python/segmented-sieve.py) |
| Java     | [segmented-sieve.java](java/segmented-sieve.java) |
| C++      | [segmented_sieve.cpp](cpp/segmented_sieve.cpp) |
| C        | [segmented_sieve.cpp](c/segmented_sieve.cpp) |

## References

- Bays, C., & Hudson, R. H. (1977). The segmented sieve of Eratosthenes and primes in arithmetic progressions to 10^12. *BIT Numerical Mathematics*, 17(2), 121-127.
- Crandall, R., & Pomerance, C. (2005). *Prime Numbers: A Computational Perspective* (2nd ed.). Springer.
- [Sieve of Eratosthenes -- Wikipedia (Segmented Sieve section)](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes#Segmented_sieve)
