# Fast Fourier Transform

## Overview

The Fast Fourier Transform (FFT) is an efficient algorithm for computing the Discrete Fourier Transform (DFT) of a sequence. Given a polynomial or signal represented as a sequence of n coefficients, the FFT converts it to its frequency-domain representation (point-value form) in O(n log n) time, compared to O(n^2) for the naive DFT computation.

The FFT was popularized by James Cooley and John Tukey in 1965, though the underlying idea was discovered much earlier by Carl Friedrich Gauss around 1805. The Cooley-Tukey algorithm works by recursively decomposing a DFT of size n into two interleaved DFTs of size n/2, exploiting the symmetry and periodicity of the complex roots of unity.

The FFT is one of the most important algorithms in computational science, enabling efficient polynomial multiplication, signal processing, image compression, and many other applications.

## How It Works

The DFT of a sequence a[0], a[1], ..., a[n-1] is defined as:

A[k] = sum(a[j] * omega^(j*k)) for j = 0 to n-1

where omega = e^(2*pi*i/n) is a primitive nth root of unity.

The Cooley-Tukey radix-2 FFT exploits the fact that:

1. **Divide:** Split the input into even-indexed and odd-indexed elements:
   - a_even = [a[0], a[2], a[4], ...]
   - a_odd = [a[1], a[3], a[5], ...]

2. **Conquer:** Recursively compute FFT(a_even) and FFT(a_odd), each of size n/2.

3. **Combine:** For k = 0, 1, ..., n/2 - 1:
   - t = omega^k * FFT(a_odd)[k]
   - A[k] = FFT(a_even)[k] + t
   - A[k + n/2] = FFT(a_even)[k] - t

This "butterfly" operation combines the two half-size transforms using the roots of unity.

## Worked Example

Compute the FFT of [1, 2, 3, 4] (n = 4, omega = e^(2*pi*i/4) = i).

**Split:**
- a_even = [1, 3] (indices 0, 2)
- a_odd = [2, 4] (indices 1, 3)

**FFT([1, 3])** (n = 2, omega = e^(2*pi*i/2) = -1):
- Even: [1], Odd: [3]
- A[0] = 1 + (-1)^0 * 3 = 1 + 3 = 4
- A[1] = 1 - (-1)^0 * 3 = 1 - 3 = -2

**FFT([2, 4])** (n = 2, omega = -1):
- A[0] = 2 + 4 = 6
- A[1] = 2 - 4 = -2

**Combine** (omega = i):
- k=0: t = i^0 * 6 = 6; A[0] = 4 + 6 = 10; A[2] = 4 - 6 = -2
- k=1: t = i^1 * (-2) = -2i; A[1] = -2 + (-2i) = -2-2i; A[3] = -2 - (-2i) = -2+2i

**Result:** FFT([1, 2, 3, 4]) = [10, -2-2i, -2, -2+2i]

**Verification:** DFT by definition:
- A[0] = 1 + 2 + 3 + 4 = 10
- A[1] = 1 + 2i + 3(-1) + 4(-i) = 1 + 2i - 3 - 4i = -2 - 2i
- A[2] = 1 + 2(-1) + 3(1) + 4(-1) = 1 - 2 + 3 - 4 = -2
- A[3] = 1 + 2(-i) + 3(-1) + 4(i) = 1 - 2i - 3 + 4i = -2 + 2i

## Algorithm

```
function FFT(a, n):
    if n == 1:
        return a

    omega = e^(2 * pi * i / n)
    w = 1

    a_even = [a[0], a[2], a[4], ..., a[n-2]]
    a_odd  = [a[1], a[3], a[5], ..., a[n-1]]

    y_even = FFT(a_even, n/2)
    y_odd  = FFT(a_odd, n/2)

    y = array of size n
    for k = 0 to n/2 - 1:
        t = w * y_odd[k]
        y[k]       = y_even[k] + t
        y[k + n/2] = y_even[k] - t
        w = w * omega

    return y
```

For polynomial multiplication of two polynomials A and B:
```
function polyMultiply(A, B):
    n = next power of 2 >= len(A) + len(B) - 1
    pad A and B with zeros to length n

    FA = FFT(A, n)
    FB = FFT(B, n)
    FC = pointwise multiply FA and FB
    C = IFFT(FC, n)    // inverse FFT

    return real parts of C, rounded to nearest integer
```

## Complexity Analysis

| Case    | Time         | Space |
|---------|-------------|-------|
| Best    | O(n log n)  | O(n)  |
| Average | O(n log n)  | O(n)  |
| Worst   | O(n log n)  | O(n)  |

**Why these complexities?**

- **Time -- O(n log n):** The algorithm splits the problem in half at each level (log n levels) and does O(n) work per level (the butterfly operations). This gives T(n) = 2*T(n/2) + O(n), which solves to O(n log n) by the Master Theorem.
- **Space -- O(n):** The algorithm needs O(n) space for the output array. In-place variants (iterative FFT with bit-reversal permutation) use O(n) total space. The recursive version additionally uses O(log n) stack space.

## Applications

- **Polynomial multiplication:** Multiplying two degree-n polynomials in O(n log n) instead of O(n^2).
- **Big integer multiplication:** Schonhage-Strassen algorithm uses FFT to multiply large integers in O(n log n log log n).
- **Signal processing:** Spectral analysis, filtering, convolution, and correlation of digital signals.
- **Image processing:** JPEG compression, image filtering, and pattern recognition.
- **Audio processing:** MP3 encoding, noise reduction, pitch detection.
- **Solving PDEs:** Spectral methods for solving partial differential equations.
- **String matching:** Computing convolutions for pattern matching.

## When NOT to Use

- **For very small inputs (n < 32):** The overhead of complex arithmetic and recursion makes naive O(n^2) DFT or direct polynomial multiplication faster for small n.
- **When exact integer arithmetic is required:** Standard FFT uses floating-point complex numbers, introducing rounding errors. For exact results, use the Number Theoretic Transform (NTT) which works over finite fields.
- **When n is not a power of 2:** The basic Cooley-Tukey radix-2 FFT requires n to be a power of 2. Mixed-radix FFT or Bluestein's algorithm handles arbitrary n, but with more complexity.
- **When the input is sparse:** If most coefficients are zero, sparse polynomial multiplication methods may be more efficient.

## Comparison with Related Transforms

| Algorithm          | Time         | Exact? | Domain                        | Notes                       |
|-------------------|-------------|--------|-------------------------------|-----------------------------|
| FFT (Cooley-Tukey) | O(n log n) | No     | Complex numbers               | Most common; floating-point |
| NTT               | O(n log n)  | Yes    | Finite field Z/pZ             | Exact; for modular arithmetic|
| Naive DFT         | O(n^2)      | No     | Complex numbers               | Simple but slow             |
| Karatsuba          | O(n^1.585)  | Yes    | Integers                      | For medium-size multiplication|
| Schoolbook Multiply| O(n^2)     | Yes    | Integers/polynomials          | Simple; best for small n    |

The FFT is the standard choice for large polynomial multiplication and signal processing. The NTT is preferred when exact modular arithmetic is needed (e.g., competitive programming problems with mod 998244353).

## Implementations

| Language   | File |
|------------|------|
| Python     | [fast_fourier_transform.py](python/fast_fourier_transform.py) |
| Java       | [FastFourierTransform.java](java/FastFourierTransform.java) |
| C++        | [fast_fourier_transform.cpp](cpp/fast_fourier_transform.cpp) |
| C          | [fast_fourier_transform.c](c/fast_fourier_transform.c) |
| TypeScript | [fastFourierTransform.ts](typescript/fastFourierTransform.ts) |

## References

- Cooley, J. W., & Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. *Mathematics of Computation*, 19(90), 297-301.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 30: Polynomials and the FFT.
- Press, W. H., Teukolsky, S. A., Vetterling, W. T., & Flannery, B. P. (2007). *Numerical Recipes* (3rd ed.). Cambridge University Press. Chapter 12.
- [Fast Fourier Transform -- Wikipedia](https://en.wikipedia.org/wiki/Fast_Fourier_transform)
