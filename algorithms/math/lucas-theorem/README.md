# Lucas' Theorem

## Overview

Lucas' Theorem provides an efficient way to compute binomial coefficients C(n, k) modulo a prime p. It decomposes n and k into their base-p representations and computes the product of binomial coefficients of corresponding digit pairs, all modulo p. This is particularly useful in competitive programming and combinatorics where n and k can be extremely large but p is a manageable prime.

The theorem was proved by Edouard Lucas in 1878 and remains one of the most elegant results connecting number theory and combinatorics.

## How It Works

1. Decompose n and k into base-p digits: `n = n_m * p^m + ... + n_1 * p + n_0` and `k = k_m * p^m + ... + k_1 * p + k_0`.
2. By Lucas' Theorem: `C(n, k) mod p = product of C(n_i, k_i) mod p` for each digit position i.
3. If any `k_i > n_i`, the result is 0 (since `C(a, b) = 0` when `b > a`).
4. Each `C(n_i, k_i)` with `n_i, k_i < p` can be computed using precomputed factorials modulo p.

### Mathematical Statement

For a prime p and non-negative integers n and k:

```
C(n, k) mod p = Product_{i=0}^{m} C(n_i, k_i) mod p
```

where `n_i` and `k_i` are the i-th digits in the base-p representations of n and k.

### Input/Output Format

- Input: `[n, k, p]`
- Output: `C(n, k) mod p`

## Example

**Compute C(10, 3) mod 3:**

**Step 1 -- Convert to base 3:**
- 10 in base 3: `101` (i.e., 1*9 + 0*3 + 1*1)
- 3 in base 3: `010` (i.e., 0*9 + 1*3 + 0*1)

**Step 2 -- Compute digit-wise binomial coefficients:**
- C(1, 0) mod 3 = 1
- C(0, 1) mod 3 = 0 (since 1 > 0, result is 0)

**Step 3 -- Multiply:** 1 * 0 = 0

**Result:** C(10, 3) mod 3 = **0**

**Verification:** C(10, 3) = 120, and 120 mod 3 = 0. Correct.

---

**Compute C(7, 3) mod 5:**

**Step 1 -- Convert to base 5:**
- 7 in base 5: `12` (1*5 + 2)
- 3 in base 5: `03` (0*5 + 3)

**Step 2 -- Compute digit-wise binomial coefficients:**
- C(1, 0) mod 5 = 1
- C(2, 3) mod 5 = 0 (since 3 > 2)

**Result:** C(7, 3) mod 5 = **0**

**Verification:** C(7, 3) = 35, and 35 mod 5 = 0. Correct.

## Pseudocode

```
function lucasTheorem(n, k, p):
    // Precompute factorials mod p
    fact = array of size p
    fact[0] = 1
    for i from 1 to p - 1:
        fact[i] = fact[i - 1] * i mod p

    result = 1
    while n > 0 or k > 0:
        n_i = n mod p
        k_i = k mod p

        if k_i > n_i:
            return 0

        // C(n_i, k_i) mod p = fact[n_i] * modInverse(fact[k_i] * fact[n_i - k_i]) mod p
        result = result * fact[n_i] mod p
        result = result * modInverse(fact[k_i], p) mod p
        result = result * modInverse(fact[n_i - k_i], p) mod p

        n = n / p    // integer division
        k = k / p    // integer division

    return result

function modInverse(a, p):
    // Using Fermat's little theorem: a^(-1) = a^(p-2) mod p
    return power(a, p - 2, p)
```

## Complexity Analysis

| Case    | Time             | Space |
|---------|-----------------|-------|
| Best    | O(p + log_p(n)) | O(p)  |
| Average | O(p + log_p(n)) | O(p)  |
| Worst   | O(p + log_p(n)) | O(p)  |

**Why these complexities?**

- **Time -- O(p + log_p(n)):** Precomputing factorials modulo p takes O(p) time. The main loop iterates once per base-p digit of n, which is O(log_p(n)) iterations. Each iteration performs O(log p) work for modular exponentiation, but since p is typically small, this is bounded by O(p + log_p(n)).

- **Space -- O(p):** The precomputed factorial table has p entries. All other variables use constant space.

## Applications

- **Competitive programming:** Rapidly computing large binomial coefficients modulo a prime in problems involving combinatorics.
- **Combinatorial identities:** Proving divisibility properties of binomial coefficients.
- **Pascal's triangle modulo p:** Lucas' theorem reveals the fractal (Sierpinski triangle) structure of Pascal's triangle mod p.
- **Coding theory:** Analyzing properties of error-correcting codes that depend on binomial coefficients modulo primes.
- **Polynomial arithmetic over finite fields:** Computing coefficients in GF(p).

## When NOT to Use

- **When the modulus is not prime:** Lucas' theorem only applies when p is prime. For composite moduli, use Andrew Granville's generalization or the Chinese Remainder Theorem with prime power factors.
- **When p is very large:** If p is comparable to n, the precomputation of factorials mod p becomes expensive, and the theorem provides little advantage over direct computation.
- **When you need C(n, k) without a modulus:** Lucas' theorem is specifically for modular arithmetic. For exact binomial coefficients, use Pascal's triangle or direct multiplication with BigInteger arithmetic.

## Comparison

| Method | Modulus Requirement | Time | Space | Notes |
|--------|-------------------|------|-------|-------|
| Lucas' Theorem | Prime p | O(p + log_p(n)) | O(p) | Best for large n, small prime p |
| Direct computation | Any | O(k) | O(1) | Overflow risk for large n |
| Pascal's Triangle | Any | O(n * k) | O(n * k) | Precomputes all C(i,j) up to n |
| Granville's generalization | Prime power p^a | O(p^a * log(n)) | O(p^a) | Extension for prime powers |

## Implementations

| Language   | File |
|------------|------|
| Python     | [lucas_theorem.py](python/lucas_theorem.py) |
| Java       | [LucasTheorem.java](java/LucasTheorem.java) |
| C++        | [lucas_theorem.cpp](cpp/lucas_theorem.cpp) |
| C          | [lucas_theorem.c](c/lucas_theorem.c) |
| Go         | [lucas_theorem.go](go/lucas_theorem.go) |
| TypeScript | [lucasTheorem.ts](typescript/lucasTheorem.ts) |
| Rust       | [lucas_theorem.rs](rust/lucas_theorem.rs) |
| Kotlin     | [LucasTheorem.kt](kotlin/LucasTheorem.kt) |
| Swift      | [LucasTheorem.swift](swift/LucasTheorem.swift) |
| Scala      | [LucasTheorem.scala](scala/LucasTheorem.scala) |
| C#         | [LucasTheorem.cs](csharp/LucasTheorem.cs) |

## References

- Lucas, E. (1878). "Theorie des Fonctions Numeriques Simplement Periodiques." *American Journal of Mathematics*, 1(2), 184-196.
- Granville, A. (1997). "Arithmetic Properties of Binomial Coefficients I: Binomial Coefficients Modulo Prime Powers." *Canadian Mathematical Society Conference Proceedings*, 20, 253-276.
- [Lucas' Theorem -- Wikipedia](https://en.wikipedia.org/wiki/Lucas%27_theorem)
