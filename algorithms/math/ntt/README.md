# Number Theoretic Transform (NTT)

## Overview

The Number Theoretic Transform (NTT) is the finite-field analog of the Fast Fourier Transform (FFT). While the FFT uses complex roots of unity and floating-point arithmetic, the NTT uses primitive roots of unity in the finite field Z/pZ (integers modulo a prime p), performing all operations with exact integer arithmetic. This eliminates floating-point errors entirely, making it ideal for polynomial multiplication modulo a prime. The standard NTT-friendly prime is 998244353 = 119 * 2^23 + 1, with primitive root 3.

## How It Works

1. **Pad** both input polynomials with zeros so their combined length is the next power of 2 >= (deg(A) + deg(B) + 1).
2. **Forward NTT:** Transform each polynomial from coefficient representation to point-value representation using the primitive root of unity w = g^((p-1)/n) mod p, where g is a primitive root of p and n is the padded length.
3. **Pointwise multiplication:** Multiply the two transformed arrays element by element, modulo p.
4. **Inverse NTT:** Transform the product back to coefficient representation using w^(-1) = w^(n-1) mod p, and divide each element by n (multiply by n^(-1) mod p).

The NTT butterfly operations mirror those of the Cooley-Tukey FFT but replace complex multiplication with modular multiplication.

## Worked Example

Multiply A(x) = 1 + 2x and B(x) = 3 + 4x, modulo p = 5 (a small prime for illustration).

Expected product: (1 + 2x)(3 + 4x) = 3 + 10x + 8x^2 = 3 + 0x + 3x^2 (mod 5).

**Step 1:** Pad to length 4 (next power of 2 >= 3):
- A = [1, 2, 0, 0], B = [3, 4, 0, 0]

**Step 2:** Find primitive 4th root of unity mod 5.
- w = 2 (since 2^4 = 16 = 1 mod 5, and 2^2 = 4 != 1 mod 5).

**Step 3:** Forward NTT of A at points {1, 2, 4, 3} (powers of w):
- A(1) = 1+2 = 3, A(2) = 1+4 = 0, A(4) = 1+8 = 4, A(3) = 1+6 = 2 (all mod 5)
- NTT(A) = [3, 0, 4, 2]

Forward NTT of B:
- B(1) = 3+4 = 2, B(2) = 3+8 = 1, B(4) = 3+16 = 4, B(3) = 3+12 = 0 (all mod 5)
- NTT(B) = [2, 1, 4, 0]

**Step 4:** Pointwise: [3*2, 0*1, 4*4, 2*0] mod 5 = [1, 0, 1, 0].

**Step 5:** Inverse NTT (using w^(-1) = 3, n^(-1) = 4^(-1) = 4 mod 5):
- Inverse transform then multiply by 4: result = [3, 0, 3, 0].

Product: 3 + 0x + 3x^2 (mod 5), which matches.

## Pseudocode

```
function ntt(a[], n, p, invert):
    // Bit-reversal permutation
    for i from 1 to n-1:
        j = bit_reverse(i, log2(n))
        if i < j:
            swap(a[i], a[j])

    // Butterfly operations
    for len from 2 to n (doubling):
        w = primitive_root^((p-1) / len) mod p
        if invert:
            w = modular_inverse(w, p)

        for i from 0 to n-1 step len:
            wn = 1
            for j from 0 to len/2 - 1:
                u = a[i + j]
                v = a[i + j + len/2] * wn % p
                a[i + j] = (u + v) % p
                a[i + j + len/2] = (u - v + p) % p
                wn = wn * w % p

    if invert:
        inv_n = modular_inverse(n, p)
        for i from 0 to n-1:
            a[i] = a[i] * inv_n % p

function polyMultiply(A[], B[], p):
    n = next_power_of_2(len(A) + len(B) - 1)
    pad A and B to length n with zeros
    ntt(A, n, p, false)
    ntt(B, n, p, false)
    C = [A[i] * B[i] % p for i in 0..n-1]
    ntt(C, n, p, true)   // inverse
    return C
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time O(n log n):** Same butterfly structure as the FFT; log n stages with n operations each.
- **Space O(n):** The padded arrays and output.
- All operations are exact modular arithmetic (no floating-point errors).

## Applications

- **Exact polynomial multiplication:** Multiplying polynomials mod a prime with zero rounding error.
- **Competitive programming:** Fast convolution for problems involving counting, DP optimization, and generating functions.
- **Big integer multiplication:** Combined with the Chinese Remainder Theorem, NTT enables exact multiplication of arbitrarily large integers.
- **Error-correcting codes:** Reed-Solomon codes use NTT over finite fields.
- **Cryptography:** Lattice-based schemes (e.g., NTRU, Kyber) rely on polynomial multiplication via NTT for efficiency.

## When NOT to Use

- **When the modulus is not NTT-friendly:** NTT requires a prime p such that p - 1 is divisible by a sufficiently large power of 2. If your problem's modulus does not satisfy this, you need multiple NTTs with CRT or should use FFT instead.
- **When results are needed in floating-point:** Use standard FFT with complex numbers.
- **For small polynomials (degree < ~64):** The overhead of NTT setup (bit-reversal, root computation) exceeds the benefit. Naive O(n^2) multiplication is faster.
- **When the modulus is not prime:** NTT requires a prime modulus. For composite moduli, use multiple NTT primes and reconstruct via CRT.

## Comparison

| Method                    | Time       | Exact? | Modular? | Notes                                        |
|---------------------------|------------|--------|----------|----------------------------------------------|
| NTT                       | O(n log n) | Yes    | Yes      | No rounding errors; requires NTT-friendly prime |
| FFT (complex)             | O(n log n) | No     | No       | General purpose; floating-point rounding errors |
| Karatsuba                 | O(n^1.585) | Yes    | Optional | Simpler; good for moderate sizes             |
| Naive multiplication      | O(n^2)     | Yes    | Optional | Simplest; best for small n                   |
| Schonhage-Strassen        | O(n log n log log n) | Yes | Yes | Asymptotically best for very large n         |

## References

- Cormen, T. H., et al. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 30: Polynomials and the FFT.
- von zur Gathen, J., & Gerhard, J. (2013). *Modern Computer Algebra* (3rd ed.). Cambridge University Press.
- [Number-theoretic transform -- Wikipedia](https://en.wikipedia.org/wiki/Number-theoretic_transform)
- [Number Theoretic Transform -- CP-algorithms](https://cp-algorithms.com/algebra/fft.html#number-theoretic-transform)

## Implementations

| Language   | File |
|------------|------|
| Python     | [ntt.py](python/ntt.py) |
| Java       | [Ntt.java](java/Ntt.java) |
| C++        | [ntt.cpp](cpp/ntt.cpp) |
| C          | [ntt.c](c/ntt.c) |
| Go         | [ntt.go](go/ntt.go) |
| TypeScript | [ntt.ts](typescript/ntt.ts) |
| Rust       | [ntt.rs](rust/ntt.rs) |
| Kotlin     | [Ntt.kt](kotlin/Ntt.kt) |
| Swift      | [Ntt.swift](swift/Ntt.swift) |
| Scala      | [Ntt.scala](scala/Ntt.scala) |
| C#         | [Ntt.cs](csharp/Ntt.cs) |
