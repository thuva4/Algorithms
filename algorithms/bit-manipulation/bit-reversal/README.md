# Bit Reversal

## Overview

Bit reversal reverses the order of bits in a fixed-width unsigned integer. For a 32-bit integer, the most significant bit becomes the least significant bit and vice versa. For example, the 32-bit representation of 1 is `00000000000000000000000000000001`, and its reversal is `10000000000000000000000000000000` (2,147,483,648 in decimal).

Bit reversal is a critical operation in the Cooley-Tukey Fast Fourier Transform (FFT) algorithm, where it determines the order in which input elements must be rearranged before the butterfly computations. It also appears in cryptographic algorithms, permutation networks, and digital signal processing.

## How It Works

The simplest approach iterates through all bit positions, extracting each bit from the input and placing it in the mirror position of the result:

1. Initialize `result` to 0.
2. For each of the 32 bit positions (i = 0 to 31):
   - Shift `result` left by 1 to make room for the next bit.
   - OR `result` with the lowest bit of `n` (obtained via `n & 1`).
   - Shift `n` right by 1 to expose the next bit.
3. After 32 iterations, `result` contains the bit-reversed value.

An alternative divide-and-conquer approach swaps adjacent bits, then pairs, then nibbles, then bytes, then half-words, achieving O(log b) operations where b is the bit width.

## Example

**Reversing `n = 13` (32-bit):**

```
13 in binary (32-bit):  00000000 00000000 00000000 00001101
Reversed:               10110000 00000000 00000000 00000000
```

Step-by-step (showing only the relevant low bits of n and growing result):

| Iteration | n (lowest bits) | Extracted bit | result (growing) |
|-----------|----------------|---------------|------------------|
| 1         | ...1101        | 1             | 1                |
| 2         | ...0110        | 0             | 10               |
| 3         | ...0011        | 1             | 101              |
| 4         | ...0001        | 1             | 1011             |
| 5-32      | ...0000        | 0             | 10110000...0     |

Decimal result: 2,952,790,016

**Reversing `n = 1`:**
```
1 in binary (32-bit):   00000000 00000000 00000000 00000001
Reversed:               10000000 00000000 00000000 00000000
```
Decimal result: 2,147,483,648

**Reversing `n = 0`:**
```
All bits are 0, so the reversal is also 0.
```

## Pseudocode

```
function reverseBits(n):
    result = 0
    for i from 0 to 31:
        result = result << 1         // shift result left
        result = result | (n & 1)    // append lowest bit of n
        n = n >> 1                   // shift n right
    return result
```

**Divide-and-conquer alternative (O(log b) operations):**
```
function reverseBits32(n):
    n = ((n & 0x55555555) << 1)  | ((n >> 1)  & 0x55555555)  // swap adjacent bits
    n = ((n & 0x33333333) << 2)  | ((n >> 2)  & 0x33333333)  // swap pairs
    n = ((n & 0x0F0F0F0F) << 4)  | ((n >> 4)  & 0x0F0F0F0F)  // swap nibbles
    n = ((n & 0x00FF00FF) << 8)  | ((n >> 8)  & 0x00FF00FF)  // swap bytes
    n = ((n & 0x0000FFFF) << 16) | ((n >> 16) & 0x0000FFFF)  // swap halves
    return n
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

- **Time -- O(1):** The loop always runs exactly 32 times for a 32-bit integer (or 5 mask-and-shift operations in the divide-and-conquer variant). The number of operations is fixed regardless of the input value.
- **Space -- O(1):** Only the result variable and loop counter are needed. No additional memory is allocated.

Note: If the bit width b is a parameter rather than fixed, the time complexity would be O(b) for the iterative approach or O(log b) for the divide-and-conquer approach.

## When to Use

- **Fast Fourier Transform (FFT):** The Cooley-Tukey radix-2 FFT requires bit-reversal permutation of the input array before performing butterfly operations.
- **Cryptographic algorithms:** Certain block ciphers and permutation-based constructions involve bit-level permutations.
- **Digital signal processing:** Converting between natural order and bit-reversed order for efficient computation of DFT.
- **Network permutation routing:** Bit-reversal routing is used in butterfly and hypercube interconnection networks.
- **Competitive programming:** A common subroutine in problems involving binary representations and transforms.

## When NOT to Use

- **When the bit width is not fixed:** If you need to reverse only the significant bits (e.g., reverse the 4 bits of the number 13 to get 11 rather than reversing all 32 bits), this algorithm must be adapted by shifting the result right to remove leading zeros.
- **When a lookup table is more efficient:** For high-throughput applications reversing millions of values, a precomputed byte-level lookup table (256 entries) combined with byte swapping can be faster than the loop-based approach.
- **When hardware support exists:** Some architectures provide a dedicated bit-reverse instruction (e.g., ARM's RBIT). Using the intrinsic is always faster than a software implementation.

## Comparison with Similar Approaches

| Method                  | Time    | Space | Notes                                          |
|------------------------|---------|-------|-------------------------------------------------|
| Iterative (loop)       | O(b)    | O(1)  | Simple; processes one bit per iteration          |
| Divide and conquer     | O(log b)| O(1)  | Five mask-and-shift steps for 32 bits            |
| Lookup table (per byte)| O(b/8)  | O(256)| Precomputed table; fast for repeated reversals   |
| Hardware RBIT          | O(1)    | O(1)  | Single instruction; architecture-dependent       |

Where b is the bit width (e.g., 32).

## Implementations

| Language   | File |
|------------|------|
| Python     | [bit_reversal.py](python/bit_reversal.py) |
| Java       | [BitReversal.java](java/BitReversal.java) |
| C++        | [bit_reversal.cpp](cpp/bit_reversal.cpp) |
| C          | [bit_reversal.c](c/bit_reversal.c) |
| Go         | [bit_reversal.go](go/bit_reversal.go) |
| TypeScript | [bitReversal.ts](typescript/bitReversal.ts) |
| Rust       | [bit_reversal.rs](rust/bit_reversal.rs) |
| Kotlin     | [BitReversal.kt](kotlin/BitReversal.kt) |
| Swift      | [BitReversal.swift](swift/BitReversal.swift) |
| Scala      | [BitReversal.scala](scala/BitReversal.scala) |
| C#         | [BitReversal.cs](csharp/BitReversal.cs) |

## References

- Cooley, J. W., & Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. *Mathematics of Computation*, 19(90), 297-301.
- Warren, H. S. (2012). *Hacker's Delight* (2nd ed.). Addison-Wesley. Chapter 7: Rearranging Bits and Bytes.
- Anderson, S. E. (2005). Bit Twiddling Hacks. Stanford University. https://graphics.stanford.edu/~seander/bithacks.html#BitReverseObvious
- [Bit-reversal permutation -- Wikipedia](https://en.wikipedia.org/wiki/Bit-reversal_permutation)
