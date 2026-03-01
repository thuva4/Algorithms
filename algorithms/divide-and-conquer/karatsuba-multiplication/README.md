# Karatsuba Multiplication

## Overview

Karatsuba multiplication is a fast multiplication algorithm that reduces the multiplication of two n-digit numbers to three multiplications of n/2-digit numbers, achieving O(n^1.585) time complexity instead of the naive O(n^2). Discovered by Anatoly Karatsuba in 1960 and published in 1962, it was the first algorithm to demonstrate that multiplication could be performed asymptotically faster than the schoolbook method. This breakthrough disproved Andrey Kolmogorov's conjecture that O(n^2) was optimal for multiplication, opening the door to an entire family of fast multiplication algorithms including Toom-Cook and Schonhage-Strassen.

## How It Works

The key insight is that multiplying two n-digit numbers can be decomposed into three, rather than four, half-size multiplications by cleverly reusing intermediate results.

Given two numbers x and y, each with n digits:

1. **Split** each number into two halves of approximately n/2 digits using a base B = 10^(n/2):
   - x = x1 * B + x0 (x1 is the high half, x0 is the low half)
   - y = y1 * B + y0

2. **Compute three products** (instead of the four products that naive expansion requires):
   - z0 = x0 * y0
   - z2 = x1 * y1
   - z1 = (x0 + x1) * (y0 + y1) - z0 - z2

3. **Combine** the results:
   - x * y = z2 * B^2 + z1 * B + z0

The trick is in computing z1: instead of computing x0*y1 + x1*y0 directly (which requires two multiplications), Karatsuba computes (x0+x1)*(y0+y1) - z0 - z2, which requires only one multiplication plus additions and subtractions. Since additions are O(n) while multiplications recurse, this saves significant work.

## Worked Example

Multiply **x = 1234** by **y = 5678** using Karatsuba:

**Step 1: Split (B = 10^2 = 100)**
- x1 = 12, x0 = 34
- y1 = 56, y0 = 78

**Step 2: Three recursive multiplications**
- z0 = 34 * 78 = 2652
- z2 = 12 * 56 = 672
- z1 = (34 + 12) * (78 + 56) - z0 - z2 = 46 * 134 - 2652 - 672 = 6164 - 2652 - 672 = 2840

**Step 3: Combine**
- result = z2 * 100^2 + z1 * 100 + z0
- result = 672 * 10000 + 2840 * 100 + 2652
- result = 6720000 + 284000 + 2652
- result = **7006652**

Verification: 1234 * 5678 = 7006652.

## Pseudocode

```
function karatsuba(x, y):
    // Base case: use direct multiplication for small numbers
    if x < 10 or y < 10:
        return x * y

    // Determine the size of the numbers
    n = max(number_of_digits(x), number_of_digits(y))
    half = floor(n / 2)
    B = 10^half

    // Split the digit sequences
    x1 = floor(x / B)    // high digits
    x0 = x mod B          // low digits
    y1 = floor(y / B)
    y0 = y mod B

    // Three recursive multiplications
    z0 = karatsuba(x0, y0)
    z2 = karatsuba(x1, y1)
    z1 = karatsuba(x0 + x1, y0 + y1) - z0 - z2

    return z2 * B^2 + z1 * B + z0
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n^1.585) | O(n)  |
| Average | O(n^1.585) | O(n)  |
| Worst   | O(n^1.585) | O(n)  |

**Why these complexities?**

- **Time -- O(n^log2(3)) = O(n^1.585):** The algorithm makes 3 recursive calls on inputs of half the size and performs O(n) work for additions and digit shifts. By the Master Theorem, T(n) = 3T(n/2) + O(n) gives T(n) = O(n^log2(3)).

- **Space -- O(n):** Each level of recursion requires O(n) space for intermediate results. Since the recursion depth is O(log n) and intermediate results can be freed after use, total space is O(n) with careful implementation, or O(n log n) with naive storage.

## When to Use

- **Big integer multiplication:** When numbers exceed the native word size of the processor (e.g., cryptographic key computations with 1024+ bit integers).
- **Polynomial multiplication:** The same splitting technique applies to multiplying polynomials with many coefficients.
- **Cryptographic computations:** RSA, Diffie-Hellman, and elliptic curve operations require multiplying very large numbers.
- **Scientific computing:** High-precision arithmetic in simulations or mathematical proofs.
- **Medium-sized numbers:** For numbers with roughly 100 to 10,000 digits, Karatsuba provides a good balance of speed and implementation simplicity.

## When NOT to Use

- **Small numbers:** For numbers that fit in a single machine word (32 or 64 bits), hardware multiplication in O(1) is far faster. The overhead of recursion and splitting makes Karatsuba slower for small inputs.
- **Extremely large numbers (millions of digits):** For very large numbers, the Schonhage-Strassen algorithm (O(n log n log log n)) or Harvey-Hoeven algorithm (O(n log n)) are asymptotically faster. Libraries like GMP switch from Karatsuba to Toom-Cook-3 to Schonhage-Strassen as number sizes increase.
- **When simplicity is paramount:** The schoolbook O(n^2) algorithm is much simpler to implement and debug.

## Comparison

| Algorithm            | Time                | Space  | Notes                                    |
|---------------------|---------------------|--------|------------------------------------------|
| Schoolbook          | O(n^2)              | O(n)   | Simple; best for small n                 |
| **Karatsuba**       | **O(n^1.585)**      | **O(n)** | **Good for medium n; easy to implement** |
| Toom-Cook-3         | O(n^1.465)          | O(n)   | Splits into 3 parts; more complex        |
| Schonhage-Strassen  | O(n log n log log n)| O(n)   | FFT-based; best for very large n         |
| Harvey-Hoeven (2019)| O(n log n)           | O(n)   | Theoretically optimal; impractical       |

## Implementations

| Language   | File |
|------------|------|
| Python     | [karatsuba.py](python/karatsuba.py) |
| Java       | [Karatsuba.java](java/Karatsuba.java) |
| C++        | [karatsuba.cpp](cpp/karatsuba.cpp) |
| C          | [karatsuba.c](c/karatsuba.c) |
| Go         | [karatsuba.go](go/karatsuba.go) |
| TypeScript | [karatsuba.ts](typescript/karatsuba.ts) |
| Rust       | [karatsuba.rs](rust/karatsuba.rs) |
| Kotlin     | [Karatsuba.kt](kotlin/Karatsuba.kt) |
| Swift      | [Karatsuba.swift](swift/Karatsuba.swift) |
| Scala      | [Karatsuba.scala](scala/Karatsuba.scala) |
| C#         | [Karatsuba.cs](csharp/Karatsuba.cs) |

## References

- Karatsuba, A., & Ofman, Y. (1962). "Multiplication of Many-Digital Numbers by Automatic Computers." *Proceedings of the USSR Academy of Sciences*, 145, 293-294.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 30.1.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.3.3.
- [Karatsuba Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Karatsuba_algorithm)
