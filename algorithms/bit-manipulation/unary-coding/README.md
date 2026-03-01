# Unary Coding

## Overview

Unary coding is one of the simplest entropy encoding schemes. It represents a non-negative integer n as a sequence of n ones followed by a zero (or equivalently, n zeros followed by a one). For example, 4 is encoded as "11110" and 0 is encoded as "0". Despite its simplicity, unary coding is optimal for the geometric distribution and serves as a building block for more sophisticated codes like Elias gamma and Golomb-Rice codes.

Unary coding is used in data compression, information theory, and as a component of variable-length codes. It is space-efficient when small values are frequent (geometric distribution), but very wasteful for large values since the code length grows linearly with the value.

## How It Works

**Encoding:** To encode a non-negative integer n, output n one-bits followed by a single zero-bit. The total code length is n + 1 bits.

**Decoding:** Read bits from the input until a zero-bit is encountered. The number of one-bits read before the zero is the decoded value.

### Example

Encoding several values:

| Value | Unary Code | Code Length |
|-------|-----------|-------------|
| 0 | 0 | 1 bit |
| 1 | 10 | 2 bits |
| 2 | 110 | 3 bits |
| 3 | 1110 | 4 bits |
| 4 | 11110 | 5 bits |
| 5 | 111110 | 6 bits |

**Encoding a sequence [3, 1, 0, 4, 2]:**

| Step | Value | Unary Code | Accumulated bitstream |
|------|-------|-----------|----------------------|
| 1 | 3 | 1110 | 1110 |
| 2 | 1 | 10 | 111010 |
| 3 | 0 | 0 | 1110100 |
| 4 | 4 | 11110 | 111010011110 |
| 5 | 2 | 110 | 111010011110110 |

**Decoding the bitstream "111010011110110":**

| Step | Bits read | Zero found at | Value | Remaining bits |
|------|-----------|--------------|-------|----------------|
| 1 | 111 | Position 4 | 3 | 10011110110 |
| 2 | 1 | Position 2 | 1 | 011110110 |
| 3 | - | Position 1 | 0 | 11110110 |
| 4 | 1111 | Position 5 | 4 | 110 |
| 5 | 11 | Position 3 | 2 | (empty) |

Decoded: `[3, 1, 0, 4, 2]` -- matches the original.

## Pseudocode

```
function encode(n):
    code = ""
    for i from 1 to n:
        code = code + "1"
    code = code + "0"
    return code

function decode(bitstream):
    count = 0
    for each bit in bitstream:
        if bit == 1:
            count = count + 1
        else:
            return count    // zero-bit terminates the code
    return count
```

In practice, encoding and decoding are done with bitwise operations rather than string manipulation for efficiency.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(n)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n):** For encoding a single value n, the algorithm must write n + 1 bits. For encoding a sequence of k values summing to S, the total output is S + k bits.

- **Average Case -- O(n):** Each value requires linear time proportional to its magnitude. The total time for a sequence is proportional to the sum of all values plus the number of values.

- **Worst Case -- O(n):** Encoding a large value n requires writing n + 1 bits. There is no way to represent it more compactly in unary.

- **Space -- O(n):** The encoded representation of value n is n + 1 bits. For large values, this is very space-inefficient (e.g., 1000 requires 1001 bits).

## When to Use

- **Data following a geometric distribution:** Unary coding is the optimal prefix code when P(n) = (1/2)^(n+1), i.e., small values are exponentially more likely.
- **As a building block for other codes:** Elias gamma coding combines unary with binary to encode integers efficiently.
- **Very simple encoding needs:** When implementation simplicity is paramount and values are expected to be small.
- **Thermometer coding in hardware:** Unary representation is used in digital-to-analog converters and priority encoders.

## When NOT to Use

- **Large values:** Encoding the value 1000 requires 1001 bits. Binary coding would use only 10 bits.
- **Uniformly distributed data:** When all values are equally likely, fixed-length binary coding is more efficient.
- **When space efficiency matters:** For most real-world data distributions, Huffman coding, arithmetic coding, or Elias codes are vastly more efficient.
- **Negative numbers:** Unary coding only represents non-negative integers.

## Comparison with Similar Algorithms

| Encoding         | Code for n=10 | Length for n | Notes                                       |
|-----------------|--------------|-------------|----------------------------------------------|
| Unary            | 11111111110  | n + 1 bits  | Simplest; optimal for geometric distribution  |
| Binary           | 1010         | log(n) bits | Fixed-length; optimal for uniform distribution|
| Elias Gamma      | 0001011      | 2*floor(log n)+1 | Combines unary + binary; universal code  |
| Golomb-Rice      | varies       | varies      | Parameterized; optimal for geometric w/ param |

## Implementations

| Language   | File |
|------------|------|
| Python     | [UnaryCoding.py](python/UnaryCoding.py) |
| Java       | [UnaryCoding.java](java/UnaryCoding.java) |
| C++        | [UnaryCoding.cpp](cpp/UnaryCoding.cpp) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Sayood, K. (2017). *Introduction to Data Compression* (5th ed.). Morgan Kaufmann. Chapter 3: Huffman Coding.
- Cover, T. M., & Thomas, J. A. (2006). *Elements of Information Theory* (2nd ed.). Wiley. Chapter 5: Data Compression.
- [Unary Coding -- Wikipedia](https://en.wikipedia.org/wiki/Unary_coding)
