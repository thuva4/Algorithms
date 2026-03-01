# Miller-Rabin Primality Test

## Overview

The Miller-Rabin primality test is a probabilistic algorithm to determine whether a number is prime. It is based on Fermat's Little Theorem and an observation about nontrivial square roots of 1 modulo a prime. For each "witness" tested, a composite number has at most a 1/4 chance of being falsely declared prime. By choosing specific deterministic witnesses, the test can be made exact for numbers up to certain bounds. For example, using witnesses {2, 3, 5, 7} guarantees correct results for all n < 3,215,031,751.

## How It Works

1. Handle edge cases: n < 2 is not prime; 2 and 3 are prime; even numbers > 2 are composite.
2. Write n - 1 = 2^r * d, where d is odd (factor out all powers of 2).
3. For each witness a in the chosen set:
   - Compute x = a^d mod n using modular exponentiation.
   - If x == 1 or x == n - 1, this witness passes. Continue to the next witness.
   - Otherwise, square x repeatedly up to r - 1 times:
     - x = x^2 mod n
     - If x == n - 1, this witness passes. Break.
   - If after all squarings x never became n - 1, then n is composite.
4. If all witnesses pass, n is (very likely) prime.

## Worked Example

Test whether n = 221 is prime, using witness a = 174.

**Step 1:** n - 1 = 220 = 2^2 * 55. So r = 2, d = 55.

**Step 2:** Compute x = 174^55 mod 221.
- Using repeated squaring: 174^55 mod 221 = 47.
- x = 47. This is neither 1 nor 220, so we continue squaring.

**Step 3:** Square once: x = 47^2 mod 221 = 2209 mod 221 = 220.
- x = 220 = n - 1, so this witness passes.

Now try witness a = 137:
- x = 137^55 mod 221 = 188. Not 1 or 220.
- Square: x = 188^2 mod 221 = 35344 mod 221 = 205. Not 220.
- After r - 1 = 1 squaring without reaching n - 1, n = 221 is declared **composite**.

Indeed, 221 = 13 * 17.

## Pseudocode

```
function millerRabin(n, witnesses):
    if n < 2: return false
    if n == 2 or n == 3: return true
    if n % 2 == 0: return false

    // Write n-1 as 2^r * d
    r = 0
    d = n - 1
    while d % 2 == 0:
        d = d / 2
        r = r + 1

    for a in witnesses:
        x = modularExponentiation(a, d, n)
        if x == 1 or x == n - 1:
            continue

        composite = true
        for i in 1 to r - 1:
            x = (x * x) % n
            if x == n - 1:
                composite = false
                break

        if composite:
            return false   // n is definitely composite

    return true   // n is probably prime
```

## Complexity Analysis

| Case    | Time          | Space |
|---------|---------------|-------|
| Best    | O(k log^2 n)  | O(1)  |
| Average | O(k log^2 n)  | O(1)  |
| Worst   | O(k log^2 n)  | O(1)  |

- **k** is the number of witnesses used.
- Each witness requires O(log n) modular squarings, and each squaring involves O(log n) bit operations, giving O(log^2 n) per witness.
- **Space O(1):** Only a constant number of variables are needed (beyond the input).

## Applications

- **RSA cryptography:** Generating large random primes for key pairs.
- **Random prime generation:** Quickly filtering candidates in probabilistic prime searches.
- **Competitive programming:** Fast primality checks on large numbers.
- **Primality certification pipeline:** Miller-Rabin as a fast probabilistic pre-filter before expensive deterministic tests.
- **Pollard's rho and other factoring algorithms:** Used as a subroutine to check if a factor is prime.

## When NOT to Use

- **When a deterministic proof of primality is required:** For cryptographic standards that mandate proven primes, use AKS or ECPP instead.
- **Very small numbers (n < 1000):** Trial division is simpler and equally fast.
- **When you need to factor the number:** Miller-Rabin only answers "prime or composite" -- it does not produce factors.
- **Numbers that are guaranteed prime by construction:** For numbers like Mersenne primes, specialized tests (Lucas-Lehmer) are more efficient.

## Comparison

| Algorithm                | Type            | Time              | Deterministic? | Notes                                     |
|--------------------------|-----------------|-------------------|----------------|-------------------------------------------|
| Miller-Rabin             | Probabilistic   | O(k log^2 n)      | With known witnesses* | Fast; standard in practice       |
| Trial Division           | Deterministic   | O(sqrt(n))         | Yes            | Simple; slow for large n                  |
| Fermat Test              | Probabilistic   | O(k log^2 n)      | No             | Fooled by Carmichael numbers              |
| AKS                      | Deterministic   | O(log^6 n)        | Yes            | Proven polynomial; slow in practice       |
| Baillie-PSW              | Probabilistic   | O(log^2 n)        | Conjectured*   | No known counterexample                   |
| Lucas-Lehmer             | Deterministic   | O(p^2 log p)      | Yes            | Only for Mersenne numbers 2^p - 1         |

\* Deterministic for n < 3.3 * 10^24 with witnesses {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}.

## References

- Rabin, M. O. (1980). "Probabilistic algorithm for testing primality." *Journal of Number Theory*, 12(1), 128-138.
- Miller, G. L. (1976). "Riemann's hypothesis and tests for primality." *Journal of Computer and System Sciences*, 13(3), 300-317.
- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 31.8.
- [Miller-Rabin primality test -- Wikipedia](https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test)

## Implementations

| Language   | File |
|------------|------|
| Python     | [miller_rabin.py](python/miller_rabin.py) |
| Java       | [MillerRabin.java](java/MillerRabin.java) |
| C++        | [miller_rabin.cpp](cpp/miller_rabin.cpp) |
| C          | [miller_rabin.c](c/miller_rabin.c) |
| Go         | [miller_rabin.go](go/miller_rabin.go) |
| TypeScript | [millerRabin.ts](typescript/millerRabin.ts) |
| Rust       | [miller_rabin.rs](rust/miller_rabin.rs) |
| Kotlin     | [MillerRabin.kt](kotlin/MillerRabin.kt) |
| Swift      | [MillerRabin.swift](swift/MillerRabin.swift) |
| Scala      | [MillerRabin.scala](scala/MillerRabin.scala) |
| C#         | [MillerRabin.cs](csharp/MillerRabin.cs) |
