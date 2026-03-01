# Newton's Method (Integer Square Root)

## Overview

Newton's method (also called the Newton-Raphson method) is an iterative numerical technique for finding roots of equations. Here it is applied to compute the integer square root: floor(sqrt(n)). Starting from an initial guess, the method iteratively refines the approximation using the formula x_new = (x + n/x) / 2, which is derived from applying Newton's method to the function f(x) = x^2 - n. The method converges quadratically, meaning the number of correct digits roughly doubles with each iteration.

## How It Works

1. Start with an initial guess x = n (or a smaller overestimate).
2. Iteratively update: x = (x + n/x) / 2, using integer (floor) division.
3. Stop when x no longer changes, i.e., x_new >= x_current. At that point, the sequence has converged.
4. Return the converged value, which equals floor(sqrt(n)).

The convergence is guaranteed because:
- By the AM-GM inequality, (x + n/x) / 2 >= sqrt(n) for all x > 0.
- The sequence is monotonically decreasing (after at most one step) and bounded below by floor(sqrt(n)).

## Worked Example

Compute floor(sqrt(27)).

Starting guess: x = 27.

| Iteration | x   | n/x (integer) | x_new = (x + n/x) / 2 |
|-----------|-----|----------------|------------------------|
| 1         | 27  | 27/27 = 1      | (27 + 1) / 2 = 14     |
| 2         | 14  | 27/14 = 1      | (14 + 1) / 2 = 7      |
| 3         | 7   | 27/7 = 3       | (7 + 3) / 2 = 5       |
| 4         | 5   | 27/5 = 5       | (5 + 5) / 2 = 5       |

x did not change (5 -> 5), so we stop. Result: floor(sqrt(27)) = **5**.

Verification: 5^2 = 25 <= 27 < 36 = 6^2.

## Pseudocode

```
function integerSqrt(n):
    if n < 0:
        error "Square root of negative number"
    if n < 2:
        return n

    x = n
    while true:
        x_new = (x + n / x) / 2    // integer division
        if x_new >= x:
            return x
        x = x_new
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(log n) | O(1)  |
| Average | O(log n) | O(1)  |
| Worst   | O(log n) | O(1)  |

- **Time O(log n):** Newton's method converges quadratically, so the number of iterations is O(log log n) for the precision to settle. However, each iteration involves integer division of an O(log n)-bit number, making the total work O(log n) in the bit-complexity model.
- **Space O(1):** Only a few variables are stored.

## Applications

- **Computing integer square roots** in languages or contexts without floating-point support.
- **Competitive programming:** Exact integer sqrt for large numbers (avoids floating-point precision issues).
- **Cryptography:** Square root computations in modular arithmetic (e.g., Tonelli-Shanks uses Newton-like iterations).
- **General root-finding:** The Newton-Raphson framework generalizes to finding roots of arbitrary differentiable functions (not just sqrt).
- **Numerical optimization:** Newton's method on the derivative finds extrema of functions.

## When NOT to Use

- **When a hardware sqrt instruction is available:** Built-in `sqrt` in IEEE 754 is typically faster and correct to 1 ULP for floating-point results.
- **For non-integer results:** If you need the fractional part of sqrt, use floating-point Newton-Raphson or built-in math libraries instead.
- **For functions without a good initial guess:** Newton's method can diverge if the initial guess is poor or the function is ill-behaved (e.g., has inflection points near the root). This is not an issue for integer sqrt (where x = n always works).
- **When the function's derivative is expensive or zero:** Newton's method requires evaluating f'(x); if the derivative is zero or undefined near the root, the method fails.

## Comparison

| Method                  | Time        | Exact integer? | Notes                                        |
|-------------------------|-------------|----------------|----------------------------------------------|
| Newton's method (int)   | O(log n)    | Yes            | Quadratic convergence; simple implementation |
| Binary search           | O(log^2 n)  | Yes            | Simpler; reliable but slower per iteration   |
| Floating-point sqrt     | O(1)*       | No             | Hardware instruction; may have rounding error|
| Digit-by-digit method   | O(log n)    | Yes            | Processes one digit at a time; low-level      |
| Karatsuba + Newton      | O(M(n))     | Yes            | For very large n; uses fast multiplication   |

\* O(1) assuming constant-time hardware FP sqrt; not exact for large integers.

## References

- Knuth, D. E. (1997). *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.1.
- Press, W. H., et al. (2007). *Numerical Recipes* (3rd ed.). Cambridge University Press. Chapter 9: Root Finding.
- [Integer square root -- Wikipedia](https://en.wikipedia.org/wiki/Integer_square_root)
- [Newton's method -- Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method)

## Implementations

| Language   | File |
|------------|------|
| Python     | [integer_sqrt.py](python/integer_sqrt.py) |
| Java       | [IntegerSqrt.java](java/IntegerSqrt.java) |
| C++        | [integer_sqrt.cpp](cpp/integer_sqrt.cpp) |
| C          | [integer_sqrt.c](c/integer_sqrt.c) |
| Go         | [integer_sqrt.go](go/integer_sqrt.go) |
| TypeScript | [integerSqrt.ts](typescript/integerSqrt.ts) |
| Rust       | [integer_sqrt.rs](rust/integer_sqrt.rs) |
| Kotlin     | [IntegerSqrt.kt](kotlin/IntegerSqrt.kt) |
| Swift      | [IntegerSqrt.swift](swift/IntegerSqrt.swift) |
| Scala      | [IntegerSqrt.scala](scala/IntegerSqrt.scala) |
| C#         | [IntegerSqrt.cs](csharp/IntegerSqrt.cs) |
