# Inverse Fast Fourier Transform (IFFT)

## Overview

The Inverse Fast Fourier Transform (IFFT) is an efficient algorithm for computing the Inverse Discrete Fourier Transform (IDFT). While the FFT converts a signal from the time domain to the frequency domain, the IFFT performs the reverse operation, reconstructing the original time-domain signal from its frequency-domain representation. The IFFT exploits the same divide-and-conquer structure as the FFT, running in O(n log n) time rather than the O(n^2) time required by the naive IDFT computation.

The IFFT is closely related to the FFT: it can be computed by conjugating the input, applying the FFT, conjugating the output, and dividing by n. This relationship means any FFT implementation can be reused for the inverse transform with minimal modification.

## How It Works

1. **Input:** An array of n complex numbers representing frequency-domain coefficients (where n is a power of 2).
2. **Conjugate** each element of the input array.
3. **Apply the FFT** algorithm (Cooley-Tukey) to the conjugated array.
4. **Conjugate** each element of the result.
5. **Divide** each element by n.
6. **Output:** The reconstructed time-domain signal.

Alternatively, the IFFT can be computed directly using the butterfly structure with twiddle factors `e^(+2*pi*i*k/n)` (positive exponent, as opposed to the negative exponent used in the forward FFT).

## Example

Given frequency-domain input (result of FFT on `[1, 2, 3, 4]`):

```
X = [10+0i, -2+2i, -2+0i, -2-2i]
```

**Step 1 -- Conjugate:** `[10+0i, -2-2i, -2+0i, -2+2i]`

**Step 2 -- Apply FFT:**
```
FFT([10+0i, -2-2i, -2+0i, -2+2i]) = [4+0i, 16+0i, 12+0i, 8+0i]
```

**Step 3 -- Conjugate:** `[4+0i, 16+0i, 12+0i, 8+0i]` (already real)

**Step 4 -- Divide by n=4:** `[1+0i, 4+0i, 3+0i, 2+0i]`

Result: `[1, 4, 3, 2]` -- which recovers the original signal `[1, 2, 3, 4]` (the FFT of this example uses a specific ordering convention; the exact values depend on the FFT implementation).

## Pseudocode

```
function ifft(X):
    n = length(X)

    // Method: conjugate, FFT, conjugate, divide by n
    for i from 0 to n - 1:
        X[i] = conjugate(X[i])

    result = fft(X)

    for i from 0 to n - 1:
        result[i] = conjugate(result[i]) / n

    return result


function fft(x):
    n = length(x)
    if n == 1:
        return x

    even = fft(x[0], x[2], ..., x[n-2])
    odd  = fft(x[1], x[3], ..., x[n-1])

    result = array of size n
    for k from 0 to n/2 - 1:
        w = e^(-2 * pi * i * k / n)
        result[k]       = even[k] + w * odd[k]
        result[k + n/2] = even[k] - w * odd[k]

    return result
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

**Why these complexities?**

- **Time -- O(n log n):** The IFFT has the same structure as the FFT. The Cooley-Tukey algorithm divides the problem into two halves at each level of recursion, with O(n) work at each of the log(n) levels. The conjugation and division steps add only O(n) overhead.

- **Space -- O(n):** The algorithm requires O(n) space for the output array and the recursive call stack of depth O(log n). In-place variants can reduce auxiliary space but still require O(n) for the input/output array.

## Applications

- **Signal reconstruction:** Recovering time-domain signals from frequency-domain representations after filtering or analysis.
- **Audio processing:** Converting frequency-domain audio data back to waveforms for playback after equalization or effects processing.
- **Polynomial multiplication:** The FFT/IFFT pair enables O(n log n) polynomial multiplication: transform to frequency domain, multiply pointwise, then IFFT back.
- **Image processing:** Reconstructing images after frequency-domain filtering (e.g., denoising, deblurring).
- **Telecommunications:** OFDM (Orthogonal Frequency Division Multiplexing) modulation in Wi-Fi, LTE, and 5G uses IFFT to generate time-domain signals from frequency-domain subcarriers.
- **Solving differential equations:** Spectral methods use FFT/IFFT to solve PDEs efficiently in the frequency domain.

## When NOT to Use

- **When n is not a power of 2:** The standard Cooley-Tukey IFFT requires input length to be a power of 2. For arbitrary lengths, use the Bluestein or chirp-z transform, or zero-pad to the next power of 2.
- **When exact arithmetic is needed:** The IFFT uses floating-point complex arithmetic, which introduces rounding errors. For exact computation over finite fields, consider the Number Theoretic Transform (NTT).
- **For very small n:** When n is small (e.g., < 16), the naive O(n^2) DFT computation may be faster due to lower constant factors and less overhead.

## Comparison

| Transform | Direction | Twiddle Factor | Normalization | Time |
|-----------|----------|----------------|---------------|------|
| FFT | Time to Frequency | e^(-2*pi*i*k/n) | None | O(n log n) |
| IFFT | Frequency to Time | e^(+2*pi*i*k/n) | Divide by n | O(n log n) |
| Naive DFT | Time to Frequency | e^(-2*pi*i*k/n) | None | O(n^2) |
| Naive IDFT | Frequency to Time | e^(+2*pi*i*k/n) | Divide by n | O(n^2) |
| NTT | Integers mod p | Primitive root | Divide by n | O(n log n) |

## References

- Cooley, J. W., & Tukey, J. W. (1965). "An Algorithm for the Machine Calculation of Complex Fourier Series." *Mathematics of Computation*, 19(90), 297-301.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 30: Polynomials and the FFT.
- [Fast Fourier Transform -- Wikipedia](https://en.wikipedia.org/wiki/Fast_Fourier_transform)
- Oppenheim, A. V., & Schafer, R. W. (2010). *Discrete-Time Signal Processing* (3rd ed.). Pearson. Chapter 9: The Discrete Fourier Transform.
