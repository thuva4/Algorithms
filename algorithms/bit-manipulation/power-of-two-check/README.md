# Power of Two Check

## Overview

Checking whether an integer is a power of two can be done in O(1) time using a bitwise trick. A power of two in binary has exactly one bit set (e.g., 1 = `1`, 2 = `10`, 4 = `100`, 8 = `1000`). The expression `n & (n - 1)` clears the lowest set bit, so if n is a positive power of two, this expression yields zero because there is only one set bit to clear.

This technique is one of the most commonly used bit manipulation idioms in systems programming, appearing in memory allocators, hash table implementations, and hardware drivers where power-of-two alignment is a frequent requirement.

## How It Works

1. Check that `n` is greater than zero. Zero and negative numbers are not powers of two.
2. Compute `n & (n - 1)`.
3. If the result is 0, then `n` has exactly one set bit and is therefore a power of two. Otherwise, it is not.

**Why does `n & (n - 1)` work?**

Subtracting 1 from a binary number flips the lowest set bit and all bits below it. For example:
- `8` in binary is `1000`. `8 - 1 = 7` is `0111`.
- `1000 & 0111 = 0000` -- the single set bit is cleared, confirming 8 is a power of two.
- `12` in binary is `1100`. `12 - 1 = 11` is `1011`.
- `1100 & 1011 = 1000` -- not zero, because 12 has more than one set bit.

## Example

**Checking `n = 16`:**
```
16 in binary:       10000
16 - 1 = 15:        01111
16 & 15:            00000  -->  Result is 0, so 16 IS a power of two
```

**Checking `n = 24`:**
```
24 in binary:       11000
24 - 1 = 23:        10111
24 & 23:            10000  -->  Result is not 0, so 24 is NOT a power of two
```

**Checking `n = 1`:**
```
1 in binary:        00001
1 - 1 = 0:          00000
1 & 0:              00000  -->  Result is 0, so 1 IS a power of two (2^0 = 1)
```

**Edge cases:**
- `n = 0`: Excluded by the positivity check. 0 is not a power of two.
- `n < 0`: Excluded by the positivity check. Negative numbers are not powers of two.

## Pseudocode

```
function isPowerOfTwo(n):
    if n <= 0:
        return false
    return (n AND (n - 1)) == 0
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

- **Time -- O(1):** The algorithm performs exactly one comparison, one subtraction, and one bitwise AND, regardless of the input value. No loops or recursion are involved.
- **Space -- O(1):** Only the input variable and the intermediate result are needed. No additional data structures are allocated.

## When to Use

- **Memory alignment checks:** Verifying that buffer sizes or memory addresses are aligned to power-of-two boundaries, which is required by many hardware interfaces and SIMD instructions.
- **Hash table sizing:** Hash tables often require power-of-two sizes so that modular arithmetic can be replaced with a fast bitwise AND (`index = hash & (size - 1)`).
- **Binary tree properties:** Checking if a complete binary tree has a specific structure (e.g., a perfect binary tree has 2^k - 1 nodes).
- **Game development:** Texture dimensions in graphics APIs are often required to be powers of two.
- **Competitive programming:** A quick utility check used in many bitwise manipulation problems.

## When NOT to Use

- **When you need the next power of two:** This algorithm only checks; it does not compute the nearest power of two. Use bit-shifting techniques or `ceil(log2(n))` to find the next power of two.
- **When working with floating-point numbers:** The bitwise trick only applies to integers. For floats, examine the exponent field of the IEEE 754 representation instead.
- **When n can be arbitrarily large (big integers):** The constant-time guarantee assumes fixed-width integers. For arbitrary-precision integers, the AND operation may take O(b) time where b is the number of digits.

## Comparison with Similar Approaches

| Method              | Time | Space | Notes                                        |
|---------------------|------|-------|----------------------------------------------|
| `n & (n - 1) == 0` | O(1) | O(1)  | Fastest; single bitwise operation            |
| Repeated division   | O(log n) | O(1) | Divide by 2 until remainder or 1             |
| Logarithm check     | O(1) | O(1)  | `log2(n)` is integer; floating-point errors  |
| Popcount == 1       | O(1) | O(1)  | Uses hardware POPCNT; equally fast           |
| Lookup table        | O(1) | O(n)  | Precomputed set; only for bounded range      |

## Implementations

| Language   | File |
|------------|------|
| Python     | [power_of_two_check.py](python/power_of_two_check.py) |
| Java       | [PowerOfTwoCheck.java](java/PowerOfTwoCheck.java) |
| C++        | [power_of_two_check.cpp](cpp/power_of_two_check.cpp) |
| C          | [power_of_two_check.c](c/power_of_two_check.c) |
| Go         | [power_of_two_check.go](go/power_of_two_check.go) |
| TypeScript | [powerOfTwoCheck.ts](typescript/powerOfTwoCheck.ts) |
| Rust       | [power_of_two_check.rs](rust/power_of_two_check.rs) |
| Kotlin     | [PowerOfTwoCheck.kt](kotlin/PowerOfTwoCheck.kt) |
| Swift      | [PowerOfTwoCheck.swift](swift/PowerOfTwoCheck.swift) |
| Scala      | [PowerOfTwoCheck.scala](scala/PowerOfTwoCheck.scala) |
| C#         | [PowerOfTwoCheck.cs](csharp/PowerOfTwoCheck.cs) |

## References

- Warren, H. S. (2012). *Hacker's Delight* (2nd ed.). Addison-Wesley. Chapter 2: Basics, Section 2-1.
- Anderson, S. E. (2005). Bit Twiddling Hacks. Stanford University. https://graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2
- [Power of Two -- Wikipedia](https://en.wikipedia.org/wiki/Power_of_two)
