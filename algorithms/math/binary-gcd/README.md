# Binary GCD

## Overview

The Binary GCD algorithm (also known as Stein's algorithm) computes the greatest common divisor of two non-negative integers using only subtraction, comparison, and bit shifting (division by 2). Unlike the Euclidean algorithm, which requires division operations, the Binary GCD relies exclusively on operations that are highly efficient on binary computers. It was discovered by Josef Stein in 1967.

The algorithm is particularly useful in contexts where division or modulo operations are expensive (such as big-integer arithmetic or hardware implementations), since bit shifts and subtractions are typically much faster than division.

## How It Works

The algorithm is based on four key observations: (1) If both numbers are even, GCD(a, b) = 2 * GCD(a/2, b/2). (2) If one is even and the other odd, GCD(a, b) = GCD(a/2, b) since 2 is not a common factor. (3) If both are odd, GCD(a, b) = GCD(|a - b|/2, min(a, b)). (4) GCD(a, 0) = a. These rules are applied repeatedly until one number reaches 0.

### Example

Computing `GCD(48, 18)`:

| Step | a | b | Rule applied | Action |
|------|---|---|-------------|--------|
| 1 | 48 | 18 | Both even, extract factor of 2 | shift = 1, a=24, b=9 |
| 2 | 24 | 9 | a even, b odd | a = 24/2 = 12 |
| 3 | 12 | 9 | a even, b odd | a = 12/2 = 6 |
| 4 | 6 | 9 | a even, b odd | a = 6/2 = 3 |
| 5 | 3 | 9 | Both odd, subtract | a = |3-9|/2 = 3, b = min(3,9) = 3 |
| 6 | 3 | 3 | Both odd, subtract | a = |3-3|/2 = 0, b = 3 |
| 7 | 0 | 3 | a = 0 | Return b * 2^shift = 3 * 2 = 6 |

Result: `GCD(48, 18) = 6`

## Pseudocode

```
function binaryGCD(a, b):
    if a == 0: return b
    if b == 0: return a

    // Find common factor of 2
    shift = 0
    while (a | b) & 1 == 0:    // both even
        a = a >> 1
        b = b >> 1
        shift = shift + 1

    // Remove remaining factors of 2 from a
    while a & 1 == 0:
        a = a >> 1

    while b != 0:
        // Remove factors of 2 from b
        while b & 1 == 0:
            b = b >> 1
        // Now both a and b are odd
        if a > b:
            swap(a, b)
        b = b - a

    return a << shift    // restore common factor of 2
```

The algorithm first extracts all common factors of 2, then repeatedly applies the subtraction rule for odd numbers until one reaches 0.

## Complexity Analysis

| Case    | Time                 | Space |
|---------|---------------------|-------|
| Best    | O(1)                | O(1)  |
| Average | O(log(min(a,b))^2)  | O(1)  |
| Worst   | O(log(min(a,b))^2)  | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** When one of the inputs is 0 or when one divides the other and both are powers of 2, the algorithm terminates immediately.

- **Average Case -- O(log(min(a,b))^2):** The outer loop runs O(log(min(a,b))) times (similar to Euclidean), but each iteration may involve multiple bit shifts (up to O(log n) shifts to remove factors of 2), giving O(log^2) total.

- **Worst Case -- O(log(min(a,b))^2):** The worst case occurs when the numbers are such that each subtraction produces a result requiring many bit shifts. The total number of bit operations is bounded by O(log(a) + log(b))^2.

- **Space -- O(1):** The algorithm modifies the input values in place using only a shift counter and temporary variables.

## When to Use

- **Big-integer arithmetic:** Division and modulo are expensive for arbitrary-precision numbers, but bit shifts and subtraction are fast. Binary GCD can be 60% faster than Euclidean for large numbers.
- **Hardware/embedded implementations:** When only adders and shifters are available (no divider circuit).
- **When avoiding division is important:** Some architectures have slow or missing division instructions.
- **Parallel computing:** The bit operations in Binary GCD can be parallelized more easily than division.

## When NOT to Use

- **Standard integer types:** For 32-bit or 64-bit integers, the Euclidean algorithm with hardware division is typically faster due to lower overhead.
- **When simplicity matters:** The Euclidean algorithm is simpler to implement and understand.
- **When you also need Bezout coefficients:** The Extended Euclidean Algorithm naturally computes these; extending Binary GCD is more complex.
- **Languages with optimized modulo:** In languages where `%` is a single efficient instruction, Euclidean GCD is preferred.

## Comparison with Similar Algorithms

| Algorithm           | Time                 | Space | Notes                                         |
|--------------------|---------------------|-------|-----------------------------------------------|
| Binary GCD (Stein)  | O(log(min(a,b))^2)  | O(1)  | No division; uses shifts and subtraction       |
| Euclidean GCD       | O(log(min(a,b)))    | O(1)  | Uses division; simpler; usually faster for native ints |
| Extended Euclidean   | O(log(min(a,b)))   | O(1)  | Also computes Bezout coefficients              |
| Lehmer's GCD        | O(n^2/log n)        | O(n)  | Best for very large multi-precision integers   |

## Implementations

| Language | File |
|----------|------|
| Python   | [BinaryGCD.py](python/BinaryGCD.py) |
| Java     | [BinaryGCD.java](java/BinaryGCD.java) |
| C++      | [BinaryGCD.cpp](cpp/BinaryGCD.cpp) |
| Go       | [binarygcd.go](go/binarygcd.go) |

## References

- Stein, J. (1967). Computational problems associated with Racah algebra. *Journal of Computational Physics*, 1(3), 397-405.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.5.2: The Greatest Common Divisor (Algorithm B).
- [Binary GCD Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Binary_GCD_algorithm)
