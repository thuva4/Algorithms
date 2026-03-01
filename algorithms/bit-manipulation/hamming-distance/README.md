# Hamming Distance

## Overview

The Hamming distance between two integers (or binary strings of equal length) is the number of positions at which the corresponding bits differ. For example, the Hamming distance between 1 (001) and 4 (100) is 2, because they differ in two bit positions. The concept was introduced by Richard Hamming in 1950 in the context of error-detecting and error-correcting codes.

Hamming distance is fundamental to information theory, coding theory, and telecommunications. It is used in error correction (Hamming codes), DNA sequence comparison, and similarity measurement between binary feature vectors in machine learning.

## How It Works

The algorithm computes the XOR of the two numbers, which produces a number where each 1-bit represents a position where the inputs differ. Then it counts the number of 1-bits (the population count or popcount) in the XOR result. The most efficient method for counting set bits uses Brian Kernighan's technique: repeatedly clearing the lowest set bit using `n = n & (n - 1)`.

### Example

Computing Hamming distance between `93` and `73`:

**Step 1: XOR the two numbers:**
```
93 in binary:  1 0 1 1 1 0 1
73 in binary:  1 0 0 1 0 0 1
XOR result:    0 0 1 0 1 0 0 = 20
```

**Step 2: Count 1-bits in 20 using Kernighan's method:**

| Step | n (binary) | n - 1 (binary) | n & (n-1) | Bits counted |
|------|-----------|----------------|-----------|-------------|
| 1 | 10100 | 10011 | 10000 | 1 |
| 2 | 10000 | 01111 | 00000 | 2 |
| 3 | 00000 | - | Done | 2 |

Result: Hamming distance = `2`

**Another example: distance between 7 (0111) and 14 (1110):**
```
XOR: 0111 ^ 1110 = 1001 (decimal 9)
Popcount of 9: two 1-bits
```

Hamming distance = `2`

## Pseudocode

```
function hammingDistance(a, b):
    xor = a XOR b
    count = 0

    while xor != 0:
        xor = xor AND (xor - 1)    // clear lowest set bit
        count = count + 1

    return count
```

Brian Kernighan's bit-counting trick iterates only as many times as there are set bits, making it faster than checking each bit position individually.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** If the two numbers are identical, the XOR is 0, and the loop does not execute. The computation requires only a single XOR operation.

- **Average Case -- O(1):** For fixed-width integers (32-bit or 64-bit), the loop runs at most 32 or 64 times, which is constant. On modern CPUs, a single POPCNT instruction computes the answer.

- **Worst Case -- O(1):** Even when all bits differ (e.g., comparing 0 and 2^32-1), the loop runs at most 32 times for 32-bit integers. This is O(1) with respect to the input magnitude.

- **Space -- O(1):** Only the XOR result and a counter variable are needed.

## When to Use

- **Error detection/correction:** Measuring how many bits were corrupted during transmission.
- **Similarity measurement:** Comparing binary feature vectors, hash codes, or fingerprints.
- **DNA analysis:** Measuring point mutations between aligned DNA sequences (when encoded as binary).
- **Network coding:** Determining the minimum number of bit flips needed to convert one codeword to another.
- **Locality-sensitive hashing:** Hamming distance on hash codes approximates true similarity.

## When NOT to Use

- **Strings of different lengths:** Hamming distance requires equal-length inputs. Use edit distance for unequal lengths.
- **When the semantic distance matters more than bit distance:** Euclidean or cosine distance may be more appropriate for real-valued data.
- **Large binary data:** For very long bitstrings (megabytes), specialized hardware-accelerated routines may be needed.
- **When insertions/deletions are possible:** Hamming distance only considers substitutions (bit flips), not insertions or deletions.

## Comparison with Similar Algorithms

| Distance Metric | Time | Space | Notes                                          |
|----------------|------|-------|-------------------------------------------------|
| Hamming Distance| O(1) | O(1)  | Counts differing bits; equal-length only         |
| Edit Distance   | O(mn)| O(mn) | Handles insertions, deletions, substitutions     |
| Jaccard Distance| O(n) | O(n)  | Set-based similarity measure                     |
| Euclidean Distance| O(n)| O(1) | For real-valued vectors                          |

## Implementations

| Language   | File |
|------------|------|
| Python     | [HammingDistance.py](python/HammingDistance.py) |
| Java       | [HammingDistance.java](java/HammingDistance.java) |
| C++        | [HammingDistance.cpp](cpp/HammingDistance.cpp) |
| C          | [HammingDistance.c](c/HammingDistance.c) |
| Go         | [hammingDistance.go](go/hammingDistance.go) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Hamming, R. W. (1950). Error detecting and error correcting codes. *Bell System Technical Journal*, 29(2), 147-160.
- Knuth, D. E. (2009). *The Art of Computer Programming, Volume 4A: Combinatorial Algorithms* (1st ed.). Addison-Wesley. Section 7.1.3.
- [Hamming Distance -- Wikipedia](https://en.wikipedia.org/wiki/Hamming_distance)
