# Swap Two Variables

## Overview

Swapping two variables is one of the most fundamental operations in programming. Given two variables a and b, the goal is to exchange their values so that a holds the original value of b and vice versa. The standard approach uses a temporary variable, which is clear, portable, and efficient. Alternative methods include XOR swap and arithmetic swap, which avoid the temporary variable but come with caveats.

## How It Works

### Temporary Variable Method (Standard)

1. Store the value of a in a temporary variable: temp = a.
2. Assign the value of b to a: a = b.
3. Assign the temporary value to b: b = temp.

### XOR Swap (No Temporary Variable)

1. a = a XOR b
2. b = a XOR b  (now b has the original value of a)
3. a = a XOR b  (now a has the original value of b)

**Caveat:** Fails if a and b refer to the same memory location (both become 0).

### Arithmetic Swap (No Temporary Variable)

1. a = a + b
2. b = a - b  (now b = original a)
3. a = a - b  (now a = original b)

**Caveat:** May overflow for large values.

## Worked Example

Swap a = 3 and b = 5 using the temporary variable method:

| Step | a | b | temp |
|------|---|---|------|
| Initial | 3 | 5 | -- |
| temp = a | 3 | 5 | 3 |
| a = b | 5 | 5 | 3 |
| b = temp | 5 | 3 | 3 |

Result: a = **5**, b = **3**.

XOR method with a = 3 (011), b = 5 (101):
- a = 3 XOR 5 = 6 (110)
- b = 6 XOR 5 = 3 (011)
- a = 6 XOR 3 = 5 (101)

Result: a = **5**, b = **3**.

## Pseudocode

```
// Method 1: Temporary variable (recommended)
function swap(a, b):
    temp = a
    a = b
    b = temp
    return (a, b)

// Method 2: XOR swap
function xorSwap(a, b):
    a = a XOR b
    b = a XOR b
    a = a XOR b
    return (a, b)

// Method 3: Arithmetic swap
function arithmeticSwap(a, b):
    a = a + b
    b = a - b
    a = a - b
    return (a, b)
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(1) | O(1)  |
| Worst   | O(1) | O(1)  |

- **Time O(1):** All three methods perform a fixed number of operations (3 assignments).
- **Space O(1):** The temporary variable method uses one extra variable; XOR and arithmetic methods use zero extra variables (but the temporary variable is typically register-allocated anyway).

## Applications

- **Sorting algorithms:** Nearly every comparison-based sort (bubble sort, quicksort, selection sort, heap sort) uses swap as a primitive operation.
- **In-place algorithms:** Array reversal, rotation, and permutation algorithms rely on swapping elements.
- **Memory-constrained environments:** XOR swap avoids allocating a temporary, useful in extremely memory-limited embedded systems (though modern compilers optimize the temp variable away).
- **Language features:** Many languages provide built-in swap (C++ `std::swap`, Python tuple swap `a, b = b, a`, Go multiple assignment).

## When NOT to Use

- **XOR swap on same variable:** If a and b point to the same memory location, XOR swap zeros out the value. Always guard with `if (&a != &b)`.
- **Arithmetic swap with overflow risk:** If a + b exceeds the integer range, arithmetic swap produces incorrect results. The temporary variable method has no such risk.
- **When the language provides a built-in:** In Python (`a, b = b, a`), Rust (`std::mem::swap`), or C++ (`std::swap`), use the idiomatic built-in rather than writing manual swap code.
- **Premature optimization:** Do not use XOR or arithmetic swap for "performance." Modern compilers optimize the temporary variable method to the same (or better) machine code. The temp method is more readable and less error-prone.

## Comparison

| Method             | Extra space | Overflow risk? | Aliasing safe? | Readability |
|--------------------|-------------|----------------|----------------|-------------|
| Temporary variable | 1 variable  | No             | Yes            | Best        |
| XOR swap           | 0           | No             | No             | Poor        |
| Arithmetic swap    | 0           | Yes            | Yes            | Moderate    |
| Language built-in  | 0*          | No             | Yes            | Best        |

\* Language built-ins may use a temporary internally.

## References

- Knuth, D. E. (1997). *The Art of Computer Programming, Vol. 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 1.1.
- [XOR swap algorithm -- Wikipedia](https://en.wikipedia.org/wiki/XOR_swap_algorithm)
- [Swap (computer programming) -- Wikipedia](https://en.wikipedia.org/wiki/Swap_(computer_programming))

## Implementations

| Language   | File |
|------------|------|
| C          | [swap.c](c/swap.c) |
| Go         | [swap.go](go/swap.go) |
| TypeScript | [swap.js](typescript/swap.js) |
| Scala      | [Swap.scala](scala/Swap.scala) |
