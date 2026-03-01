# Count Set Bits

## Overview

Counting set bits (also known as population count or popcount) determines how many 1-bits are present in the binary representation of an integer. This algorithm extends the concept to an array of integers, summing the set bit counts across all elements. The most efficient single-number approach uses Brian Kernighan's algorithm, which clears the lowest set bit in each iteration with the expression `n & (n - 1)`, running in O(k) time where k is the number of set bits rather than the total number of bits.

Population count is a fundamental primitive in computer science, with dedicated hardware instructions (POPCNT on x86, CNT on ARM) due to its wide applicability in cryptography, error correction, bioinformatics, and combinatorial algorithms.

## How It Works

For each number in the array:
1. Initialize a local counter to 0.
2. While the number is not zero:
   - Increment the counter.
   - Clear the lowest set bit using `n = n & (n - 1)`.
3. Add the local counter to the running total.

Brian Kernighan's trick works because subtracting 1 from a number flips its lowest set bit and all bits below it. ANDing with the original number thus zeroes out exactly one set bit per iteration.

## Example

**Single number: `n = 29`**

29 in binary is `11101`, which has 4 set bits.

| Step | n (binary) | n - 1 (binary) | n & (n-1) | Bits counted so far |
|------|-----------|----------------|-----------|---------------------|
| 1    | 11101     | 11100          | 11100     | 1                   |
| 2    | 11100     | 11011          | 11000     | 2                   |
| 3    | 11000     | 10111          | 10000     | 3                   |
| 4    | 10000     | 01111          | 00000     | 4                   |

Result: 4 set bits.

**Array: `[7, 3, 10]`**

- 7 = `111` has 3 set bits
- 3 = `11` has 2 set bits
- 10 = `1010` has 2 set bits

Total: 3 + 2 + 2 = **7**

## Pseudocode

```
function countSetBits(array):
    total = 0
    for each number in array:
        n = number
        while n != 0:
            n = n AND (n - 1)    // clear lowest set bit
            total = total + 1
    return total
```

An alternative approach checks each bit individually by shifting right and testing the least significant bit, but this always requires O(b) iterations where b is the bit width, regardless of how many bits are set.

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(n)     | O(1)  |
| Average | O(n * k) | O(1)  |
| Worst   | O(n * b) | O(1)  |

Where n is the array length, k is the average number of set bits per element, and b is the bit width (e.g., 32).

- **Best Case -- O(n):** Every element is 0, so the inner loop never executes. Only the outer loop runs.
- **Average Case -- O(n * k):** Each element contributes k iterations to the inner loop, where k is its set bit count. For random 32-bit integers, the expected value of k is 16.
- **Worst Case -- O(n * b):** Every element has all bits set (e.g., 0xFFFFFFFF), so each triggers b iterations.
- **Space -- O(1):** Only a counter and temporary variable are needed.

## When to Use

- **Bitwise population counting:** Counting active flags, permissions, or features represented as bit fields.
- **Error detection:** Measuring the weight of codewords in Hamming codes and other error-correcting codes.
- **Cryptography:** Computing Hamming weights as part of side-channel analysis or cipher operations.
- **Bioinformatics:** Counting mutations or matches in compressed binary representations of DNA sequences.
- **Network engineering:** Counting host bits in subnet masks.

## When NOT to Use

- **When hardware popcount is available:** On modern CPUs, a single POPCNT instruction is faster than any software loop. Use built-in intrinsics when performance matters.
- **When counting bits across very large arrays:** SIMD-accelerated approaches (e.g., Harley-Seal method) can process multiple integers simultaneously and outperform element-by-element Kernighan's method.
- **When only parity matters:** If you just need to know whether the count is odd or even, XOR folding is faster.

## Comparison with Similar Approaches

| Method                | Time per integer | Notes                                      |
|-----------------------|-----------------|--------------------------------------------|
| Kernighan's algorithm | O(k)            | Loops only k times (k = number of set bits)|
| Naive bit check       | O(b)            | Always checks all b bits                   |
| Lookup table (8-bit)  | O(b/8)          | Trades memory for speed                    |
| Hardware POPCNT       | O(1)            | Single instruction; fastest                |
| Parallel bit counting | O(log b)        | Divide-and-conquer with bitmasks           |

## Implementations

| Language   | File |
|------------|------|
| Python     | [count_set_bits.py](python/count_set_bits.py) |
| Java       | [CountSetBits.java](java/CountSetBits.java) |
| C++        | [count_set_bits.cpp](cpp/count_set_bits.cpp) |
| C          | [count_set_bits.c](c/count_set_bits.c) |
| Go         | [count_set_bits.go](go/count_set_bits.go) |
| TypeScript | [countSetBits.ts](typescript/countSetBits.ts) |
| Rust       | [count_set_bits.rs](rust/count_set_bits.rs) |
| Kotlin     | [CountSetBits.kt](kotlin/CountSetBits.kt) |
| Swift      | [CountSetBits.swift](swift/CountSetBits.swift) |
| Scala      | [CountSetBits.scala](scala/CountSetBits.scala) |
| C#         | [CountSetBits.cs](csharp/CountSetBits.cs) |

## References

- Kernighan, B. W., & Ritchie, D. M. (1988). *The C Programming Language* (2nd ed.). Prentice Hall. Exercise 2-9.
- Warren, H. S. (2012). *Hacker's Delight* (2nd ed.). Addison-Wesley. Chapter 5: Counting Bits.
- Knuth, D. E. (2009). *The Art of Computer Programming, Volume 4A: Combinatorial Algorithms*. Addison-Wesley. Section 7.1.3.
- [Hamming Weight -- Wikipedia](https://en.wikipedia.org/wiki/Hamming_weight)
