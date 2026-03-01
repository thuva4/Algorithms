# Pollard's Rho Algorithm

## Overview

Pollard's Rho is a probabilistic integer factorization algorithm that finds a non-trivial factor of a composite number n. It was invented by John Pollard in 1975. The algorithm uses a pseudo-random sequence and Floyd's cycle detection to find a collision modulo a factor of n, achieving an expected running time of O(n^(1/4)) -- far faster than trial division's O(n^(1/2)). It is one of the most practical factorization algorithms for numbers up to about 60 digits.

## How It Works

1. Choose a pseudo-random function f(x) = (x^2 + c) mod n, where c is a randomly chosen constant (c != 0, c != -2).
2. Initialize two variables (tortoise and hare) to a starting value, say x = y = 2.
3. Use Floyd's cycle detection:
   - Advance the tortoise by one step: x = f(x).
   - Advance the hare by two steps: y = f(f(y)).
4. At each step, compute d = gcd(|x - y|, n).
5. If 1 < d < n, then d is a non-trivial factor of n. Return d.
6. If d == n, the algorithm has failed with this choice of c. Retry with a different c.
7. If d == 1, continue iterating.

The birthday paradox explains why this works: in a sequence modulo a factor p of n, we expect a collision after roughly O(sqrt(p)) = O(n^(1/4)) steps (when p is near sqrt(n)).

## Worked Example

Factor n = 8051.

Choose f(x) = (x^2 + 1) mod 8051, starting with x = y = 2.

| Step | x = f(x)         | y = f(f(y))       | gcd(\|x-y\|, n) |
|------|-------------------|--------------------|------------------|
| 1    | f(2) = 5          | f(f(2)) = f(5) = 26 | gcd(21, 8051) = 1 |
| 2    | f(5) = 26         | f(f(26)) = f(677) = 7474 | gcd(7448, 8051) = 1 |
| 3    | f(26) = 677       | f(f(7474)) = ...  | ...              |
| ...  | ...               | ...                | ...              |
| 8    | 4903              | 2218               | gcd(2685, 8051) = **97** |

Found factor d = 97. Verify: 8051 / 97 = 83. Indeed, 8051 = 83 * 97.

## Pseudocode

```
function pollardsRho(n):
    if n % 2 == 0:
        return 2
    if isPrime(n):
        return n

    while true:
        c = random(1, n-1)
        f(x) = (x * x + c) % n
        x = 2
        y = 2
        d = 1

        while d == 1:
            x = f(x)              // tortoise: one step
            y = f(f(y))           // hare: two steps
            d = gcd(|x - y|, n)

        if d != n:
            return d
        // else: retry with different c
```

### Brent's Improvement

Brent's variant replaces Floyd's cycle detection with a more efficient power-of-two stepping pattern, reducing the number of GCD computations and providing roughly 24% speedup in practice.

## Complexity Analysis

| Case    | Time        | Space |
|---------|-------------|-------|
| Best    | O(n^(1/4))  | O(1)  |
| Average | O(n^(1/4))  | O(1)  |
| Worst   | O(n^(1/2))  | O(1)  |

- **Expected O(n^(1/4)):** By the birthday paradox, a collision modulo a factor p occurs after O(sqrt(p)) steps. The smallest factor p is at most sqrt(n), giving O(n^(1/4)).
- **Worst case O(n^(1/2)):** If the function sequence happens to cycle without finding a factor, or n has a large smallest prime factor.
- **Space O(1):** Only the tortoise, hare, and a few auxiliary variables.

## Applications

- **Integer factorization:** The primary use case. Effective for numbers with a factor up to about 25-30 digits.
- **RSA cryptanalysis:** Factoring weak RSA moduli (small key sizes).
- **Competitive programming:** Finding prime factorizations of large numbers quickly.
- **As a subroutine:** Combined with Miller-Rabin primality testing and trial division for complete factorization.
- **Elliptic curve method (ECM):** Pollard's Rho inspired the ECM, which generalizes the approach to elliptic curves for larger factors.

## When NOT to Use

- **For very large numbers (> 60 digits):** The General Number Field Sieve (GNFS) or Elliptic Curve Method (ECM) are more effective for numbers with large factors.
- **When the number is prime:** Always check primality first (e.g., with Miller-Rabin) before attempting factorization.
- **For numbers with only small factors:** Trial division up to a bound or the Sieve of Eratosthenes is simpler and faster.
- **When deterministic factorization is required:** Pollard's Rho is probabilistic; it may take unpredictably long or require restarts.

## Comparison

| Algorithm              | Expected Time    | Space  | Factor size limit  | Notes                              |
|------------------------|------------------|--------|--------------------|------------------------------------|
| Pollard's Rho          | O(n^(1/4))       | O(1)   | ~25 digits         | Simple; practical; probabilistic   |
| Trial Division         | O(sqrt(n))       | O(1)   | ~10 digits         | Simplest; slow for large numbers   |
| Pollard's p-1          | O(B * log n)     | O(1)   | Smooth factors     | Fast when p-1 is smooth            |
| Elliptic Curve Method  | O(exp(sqrt(2 ln p ln ln p))) | O(1) | ~40 digits | Better for larger factors          |
| Quadratic Sieve        | O(exp(sqrt(ln n ln ln n))) | Large | ~100 digits | Sub-exponential; complex           |
| General Number Field Sieve | O(exp(c * (ln n)^(1/3) * (ln ln n)^(2/3))) | Large | 100+ digits | Fastest known for large n |

## References

- Pollard, J. M. (1975). "A Monte Carlo method for factorization." *BIT Numerical Mathematics*, 15(3), 331-334.
- Brent, R. P. (1980). "An improved Monte Carlo factorization algorithm." *BIT Numerical Mathematics*, 20(2), 176-184.
- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 31.9.
- [Pollard's rho algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Pollard%27s_rho_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [pollards_rho.py](python/pollards_rho.py) |
| Java       | [PollardsRho.java](java/PollardsRho.java) |
| C++        | [pollards_rho.cpp](cpp/pollards_rho.cpp) |
| C          | [pollards_rho.c](c/pollards_rho.c) |
| Go         | [pollards_rho.go](go/pollards_rho.go) |
| TypeScript | [pollardsRho.ts](typescript/pollardsRho.ts) |
| Rust       | [pollards_rho.rs](rust/pollards_rho.rs) |
| Kotlin     | [PollardsRho.kt](kotlin/PollardsRho.kt) |
| Swift      | [PollardsRho.swift](swift/PollardsRho.swift) |
| Scala      | [PollardsRho.scala](scala/PollardsRho.scala) |
| C#         | [PollardsRho.cs](csharp/PollardsRho.cs) |
