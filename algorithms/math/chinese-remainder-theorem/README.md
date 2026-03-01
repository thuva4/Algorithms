# Chinese Remainder Theorem

## Overview

The Chinese Remainder Theorem (CRT) finds the smallest non-negative integer x that satisfies a system of simultaneous congruences: x = r_i (mod m_i) for pairwise coprime moduli. The algorithm uses the extended Euclidean algorithm to combine congruences two at a time.

The theorem dates back to the 3rd century CE, attributed to the Chinese mathematician Sun Tzu (Sunzi), who posed the problem: "Find a number that leaves remainder 2 when divided by 3, remainder 3 when divided by 5, and remainder 2 when divided by 7." The CRT guarantees a unique solution modulo the product of all moduli when the moduli are pairwise coprime.

## How It Works

1. Start with the first congruence x = r1 (mod m1).
2. For each subsequent congruence x = ri (mod mi), combine using the extended GCD to find x satisfying both congruences simultaneously.
3. The result is the smallest non-negative x satisfying all congruences.

Input format: `[n, r1, m1, r2, m2, ..., rn, mn]`

The combination step works as follows: given x = a (mod M) and x = r (mod m), use the extended Euclidean algorithm to find coefficients u, v such that u*M + v*m = gcd(M, m) = 1 (since M and m are coprime). Then x = a + M * (r - a) * u (mod M*m).

## Worked Example

Given input: `[3, 2, 3, 3, 5, 2, 7]`

Find x such that x = 2 (mod 3), x = 3 (mod 5), x = 2 (mod 7).

**Step 1:** Start with x = 2 (mod 3). So x = 2, M = 3.

**Step 2:** Combine with x = 3 (mod 5).
- Use extended GCD: find u, v such that 3u + 5v = 1. We get u = 2, v = -1.
- x = 2 + 3 * (3 - 2) * 2 = 2 + 6 = 8
- M = 3 * 5 = 15
- x = 8 (mod 15)
- Verify: 8 mod 3 = 2, 8 mod 5 = 3.

**Step 3:** Combine with x = 2 (mod 7).
- Use extended GCD: find u, v such that 15u + 7v = 1. We get u = 1, v = -2.
- x = 8 + 15 * (2 - 8) * 1 = 8 + 15 * (-6) = 8 - 90 = -82
- M = 15 * 7 = 105
- x = -82 mod 105 = 23
- Verify: 23 mod 3 = 2, 23 mod 5 = 3, 23 mod 7 = 2.

Result: x = 23.

## Pseudocode

```
function chineseRemainder(remainders[], moduli[], n):
    x = remainders[0]
    M = moduli[0]

    for i = 1 to n-1:
        r = remainders[i]
        m = moduli[i]
        (g, u, v) = extendedGCD(M, m)
        // g should be 1 since moduli are pairwise coprime
        x = x + M * ((r - x) * u mod m)
        M = M * m
        x = x mod M

    return ((x mod M) + M) mod M    // ensure non-negative

function extendedGCD(a, b):
    if b == 0:
        return (a, 1, 0)
    (g, x1, y1) = extendedGCD(b, a mod b)
    return (g, y1, x1 - (a / b) * y1)
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log M) | O(1)  |
| Average | O(n log M) | O(1)  |
| Worst   | O(n log M) | O(1)  |

Where n is the number of congruences and M is the product of all moduli.

**Why these complexities?**

- **Time -- O(n log M):** For each of the n congruences, we perform an extended GCD computation. The extended GCD of two numbers a and b runs in O(log(min(a, b))) time. Since the combined modulus grows toward M, the total work across all iterations is O(n log M).
- **Space -- O(1):** Only the running solution x and combined modulus M are maintained, plus temporary variables for the extended GCD.

## Applications

- **RSA decryption optimization:** CRT allows RSA decryption to be performed modulo p and q separately, then combined, yielding a 4x speedup over direct modular exponentiation.
- **Calendar calculations:** Finding dates that satisfy multiple cyclic constraints (e.g., day of week, day of month).
- **Scheduling and resource allocation:** Finding time slots satisfying periodic constraints with different periods.
- **Signal processing:** Reconstructing signals from residues in the Residue Number System (RNS).
- **Secret sharing:** Mignotte's and Asmuth-Bloom secret sharing schemes are based on CRT.
- **Large number arithmetic:** CRT enables parallel computation by decomposing operations across smaller moduli.

## When NOT to Use

- **When moduli are not pairwise coprime:** The standard CRT requires gcd(m_i, m_j) = 1 for all i != j. For non-coprime moduli, the generalized CRT is needed, and a solution may not exist.
- **When the product of moduli is too large:** The solution x can be as large as the product of all moduli minus 1. If this exceeds your integer type's range, big-integer arithmetic is required.
- **When only one congruence exists:** A single congruence x = r (mod m) is trivially solved without CRT.
- **When approximate solutions suffice:** If an exact solution is not required, numerical methods may be simpler.

## Comparison with Related Methods

| Method               | Requirements            | Time       | Notes                                    |
|---------------------|-------------------------|------------|------------------------------------------|
| CRT (iterative)     | Pairwise coprime moduli | O(n log M) | Combines two congruences at a time       |
| CRT (constructive)  | Pairwise coprime moduli | O(n log M) | Uses M_i = M/m_i and inverses directly   |
| Generalized CRT     | Any moduli              | O(n log M) | Checks compatibility; may have no solution|
| Garner's Algorithm   | Pairwise coprime moduli | O(n^2)     | Mixed-radix representation; avoids large products |
| Brute Force         | Any moduli              | O(M)       | Checks all values up to M; impractical for large M |

The iterative CRT approach used here is simple to implement and efficient. Garner's algorithm is preferred when the intermediate products would overflow, as it avoids computing the full product M directly.

## Implementations

| Language   | File |
|------------|------|
| Python     | [chinese_remainder.py](python/chinese_remainder.py) |
| Java       | [ChineseRemainder.java](java/ChineseRemainder.java) |
| C++        | [chinese_remainder.cpp](cpp/chinese_remainder.cpp) |
| C          | [chinese_remainder.c](c/chinese_remainder.c) |
| Go         | [chinese_remainder.go](go/chinese_remainder.go) |
| TypeScript | [chineseRemainder.ts](typescript/chineseRemainder.ts) |
| Rust       | [chinese_remainder.rs](rust/chinese_remainder.rs) |
| Kotlin     | [ChineseRemainder.kt](kotlin/ChineseRemainder.kt) |
| Swift      | [ChineseRemainder.swift](swift/ChineseRemainder.swift) |
| Scala      | [ChineseRemainder.scala](scala/ChineseRemainder.scala) |
| C#         | [ChineseRemainder.cs](csharp/ChineseRemainder.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 31.5: The Chinese remainder theorem.
- Shoup, V. (2009). *A Computational Introduction to Number Theory and Algebra* (2nd ed.). Cambridge University Press. Chapter 2.6.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.3.2.
- [Chinese Remainder Theorem -- Wikipedia](https://en.wikipedia.org/wiki/Chinese_remainder_theorem)
