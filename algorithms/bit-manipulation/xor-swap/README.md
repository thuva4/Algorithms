# XOR Swap

## Overview

The XOR Swap algorithm exchanges the values of two variables without using a temporary variable. It exploits three properties of the XOR operation: (1) a XOR a = 0 (self-inverse), (2) a XOR 0 = a (identity), and (3) XOR is commutative and associative. By applying XOR three times between the two variables, their values are swapped in place.

While historically used as a clever trick to save memory (one less variable), XOR swap is now primarily of academic and educational interest. Modern compilers typically optimize standard swaps (using a temporary variable) to be faster than XOR swap due to instruction-level parallelism and register renaming.

## How It Works

The algorithm performs three XOR operations in sequence:
1. `a = a XOR b` (a now contains a XOR b, b unchanged)
2. `b = a XOR b` (b now contains (a XOR b) XOR b = a, so b has a's original value)
3. `a = a XOR b` (a now contains (a XOR b) XOR a = b, so a has b's original value)

### Example

Swapping `a = 5` and `b = 9`:

```
a = 5 = 0101 (binary)
b = 9 = 1001 (binary)
```

| Step | Operation | a (binary) | b (binary) | a (decimal) | b (decimal) |
|------|-----------|-----------|-----------|-------------|-------------|
| Start | - | 0101 | 1001 | 5 | 9 |
| 1 | a = a XOR b | 1100 | 1001 | 12 | 9 |
| 2 | b = a XOR b | 1100 | 0101 | 12 | 5 |
| 3 | a = a XOR b | 1001 | 0101 | 9 | 5 |

Result: `a = 9`, `b = 5` -- values swapped successfully.

**Detailed bit-level trace for step 2:**
```
a (current) = 1100  (which is original_a XOR original_b)
b (current) = 1001  (which is original_b)
a XOR b     = 1100 XOR 1001 = 0101  (which is original_a!)
```

## Pseudocode

```
function xorSwap(a, b):
    if a == b:
        return    // important: XOR swap fails if a and b are the same variable

    a = a XOR b
    b = a XOR b
    a = a XOR b
```

The guard `if a == b` is important: if `a` and `b` refer to the **same memory location** (not just the same value), all three XOR operations produce 0, destroying the value. If they hold the same value but are different variables, the swap works correctly (both remain unchanged).

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The algorithm performs exactly 3 XOR operations regardless of input values.

- **Average Case -- O(1):** The same 3 operations are performed for all inputs. No loops or conditional branching (except the optional aliasing check).

- **Worst Case -- O(1):** The algorithm is always 3 XOR operations. No input can cause more or fewer operations.

- **Space -- O(1):** No temporary variable is used. The swap is performed entirely in the two existing variables.

## When to Use

- **Educational purposes:** XOR swap is an excellent exercise for understanding XOR properties and bitwise operations.
- **Extremely memory-constrained environments:** When even a single extra register or variable is not available (rare in modern systems).
- **Embedded systems with very limited registers:** Some microcontrollers may benefit, though this is increasingly uncommon.
- **Programming puzzles and interviews:** Understanding XOR swap demonstrates knowledge of bitwise operations.

## When NOT to Use

- **General-purpose programming:** A standard swap with a temporary variable is clearer, often faster, and less error-prone.
- **When the two variables might alias the same memory:** XOR swap zeroes out the value if both references point to the same location.
- **When readability matters:** XOR swap is less intuitive than `temp = a; a = b; b = temp` and can confuse code reviewers.
- **Modern compiled languages:** Compilers optimize `std::swap` or equivalent to use efficient register operations that outperform XOR swap.
- **Floating-point or non-integer types:** XOR is defined for integers only.

## Comparison with Similar Algorithms

| Method          | Time | Space | Notes                                          |
|----------------|------|-------|-------------------------------------------------|
| XOR Swap        | O(1) | O(1)  | No temp variable; aliasing danger; integers only |
| Temp Variable   | O(1) | O(1)  | Standard method; clear and safe                  |
| Arithmetic Swap | O(1) | O(1)  | a=a+b, b=a-b, a=a-b; overflow risk              |
| std::swap       | O(1) | O(1)  | Compiler-optimized; works with any type          |

## Implementations

| Language   | File |
|------------|------|
| Python     | [XorSwap.py](python/XorSwap.py) |
| Java       | [XorSwap.java](java/XorSwap.java) |
| C++        | [xorswap.cpp](cpp/xorswap.cpp) |
| C          | [XorSwap.c](c/XorSwap.c) |
| C#         | [XorSwap.cs](csharp/XorSwap.cs) |
| TypeScript | [index.js](typescript/index.js) |
| Scala      | [XorSwap.scala](scala/XorSwap.scala) |
| Swift      | [XorSwap.swift](swift/XorSwap.swift) |

## References

- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 1.3.2.
- Warren, H. S. (2012). *Hacker's Delight* (2nd ed.). Addison-Wesley. Chapter 2: Basics.
- [XOR Swap Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/XOR_swap_algorithm)
