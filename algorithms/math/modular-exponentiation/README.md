# Modular Exponentiation

## Overview

Modular exponentiation computes (base^exp) mod m efficiently using the binary exponentiation (square-and-multiply) method. Instead of computing base^exp first and then taking the modulus -- which would produce astronomically large intermediate values -- it takes the modulus at each multiplication step to keep numbers small. This is a fundamental building block for cryptographic algorithms (RSA, Diffie-Hellman), primality testing (Miller-Rabin, Fermat), and competitive programming.

## How It Works

1. Initialize result = 1.
2. Reduce base modulo m (base = base % m).
3. While exp > 0:
   - If exp is odd, multiply result by base and take mod m: result = (result * base) % m.
   - Square the base and take mod m: base = (base * base) % m.
   - Halve the exponent: exp = exp / 2 (integer division).
4. Return result.

The key insight is the binary representation of the exponent. For example, base^13 = base^(1101 in binary) = base^8 * base^4 * base^1. We process the exponent bit by bit, squaring the base at each step and multiplying into the result when the current bit is 1.

## Worked Example

Compute 3^13 mod 50.

exp = 13 = 1101 in binary. base = 3, result = 1, m = 50.

| Step | exp  | exp odd? | result                | base              |
|------|------|----------|-----------------------|-------------------|
| 1    | 13   | Yes      | (1 * 3) % 50 = 3     | (3 * 3) % 50 = 9  |
| 2    | 6    | No       | 3                     | (9 * 9) % 50 = 31 |
| 3    | 3    | Yes      | (3 * 31) % 50 = 43   | (31 * 31) % 50 = 11 |
| 4    | 1    | Yes      | (43 * 11) % 50 = 23  | (11 * 11) % 50 = 21 |
| 5    | 0    | --       | done                  | --                 |

Result: 3^13 mod 50 = **23**.

Verification: 3^13 = 1,594,323. 1,594,323 mod 50 = 23.

## Pseudocode

```
function modExp(base, exp, m):
    if m == 1:
        return 0
    result = 1
    base = base % m

    while exp > 0:
        if exp % 2 == 1:          // exp is odd
            result = (result * base) % m
        exp = exp / 2              // integer division (right shift)
        base = (base * base) % m

    return result
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(log exp) | O(1)  |
| Average | O(log exp) | O(1)  |
| Worst   | O(log exp) | O(1)  |

- **Time O(log exp):** The exponent is halved at each step, so the loop runs O(log exp) times. Each step performs at most two multiplications and two modular reductions.
- **Space O(1):** Only a constant number of variables (result, base, exp) are used.

## Applications

- **RSA cryptography:** Encryption (c = m^e mod n) and decryption (m = c^d mod n) rely entirely on modular exponentiation.
- **Diffie-Hellman key exchange:** Computing g^a mod p for secret key agreement.
- **Miller-Rabin primality test:** Each witness test requires computing a^d mod n.
- **Discrete logarithm:** Part of baby-step giant-step and Pohlig-Hellman algorithms.
- **Competitive programming:** Computing large powers modulo a prime (e.g., modular inverse via Fermat's little theorem: a^(p-2) mod p).

## When NOT to Use

- **When the exponent is very small (e.g., exp < 5):** Direct multiplication is simpler and has no overhead.
- **When working with floating-point numbers:** Modular arithmetic only applies to integers. For floating-point powers, use standard `pow` functions.
- **When the modulus is 1:** The result is always 0; no computation is needed.
- **When overflow is a concern with large moduli:** If m^2 can overflow your integer type, you need 128-bit multiplication or Montgomery reduction. Standard modular exponentiation will silently produce wrong results.

## Comparison

| Method                    | Time       | Space | Notes                                      |
|---------------------------|------------|-------|--------------------------------------------|
| Binary exponentiation     | O(log exp) | O(1)  | Standard approach; iterative or recursive   |
| Naive repeated multiply   | O(exp)     | O(1)  | Impractical for large exponents             |
| Montgomery multiplication | O(log exp) | O(1)  | Avoids division in modular reduction; faster for large moduli |
| Sliding window            | O(log exp) | O(2^w)| Reduces multiplications by ~25%; w = window size |
| Left-to-right binary      | O(log exp) | O(1)  | Same complexity; processes bits MSB-first   |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 31.6: Powers of an element.
- Knuth, D. E. (1997). *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.6.3.
- [Modular exponentiation -- Wikipedia](https://en.wikipedia.org/wiki/Modular_exponentiation)
- [Binary exponentiation -- CP-algorithms](https://cp-algorithms.com/algebra/binary-exp.html)

## Implementations

| Language   | File |
|------------|------|
| Python     | [mod_exp.py](python/mod_exp.py) |
| Java       | [ModExp.java](java/ModExp.java) |
| C++        | [mod_exp.cpp](cpp/mod_exp.cpp) |
| C          | [mod_exp.c](c/mod_exp.c) |
| Go         | [mod_exp.go](go/mod_exp.go) |
| TypeScript | [modExp.ts](typescript/modExp.ts) |
| Rust       | [mod_exp.rs](rust/mod_exp.rs) |
| Kotlin     | [ModExp.kt](kotlin/ModExp.kt) |
| Swift      | [ModExp.swift](swift/ModExp.swift) |
| Scala      | [ModExp.scala](scala/ModExp.scala) |
| C#         | [ModExp.cs](csharp/ModExp.cs) |
