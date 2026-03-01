# Factorial

## Overview

The factorial of a non-negative integer n, denoted n!, is the product of all positive integers less than or equal to n. For example, 5! = 5 * 4 * 3 * 2 * 1 = 120. By convention, 0! = 1. Factorials grow extremely rapidly -- 20! = 2,432,902,008,176,640,000 already exceeds the range of a 64-bit integer.

Factorials are fundamental in combinatorics (permutations and combinations), probability theory, Taylor series expansions, and many areas of mathematics and computer science. Both iterative and recursive implementations are straightforward, making factorial computation an excellent introductory programming exercise.

## How It Works

The iterative approach starts with a result of 1 and multiplies it by each integer from 2 to n. The recursive approach uses the definition n! = n * (n-1)!, with the base case 0! = 1. Both approaches perform exactly n-1 multiplications.

### Example

Computing `5!`:

**Iterative approach:**

| Step | i | result = result * i |
|------|---|---------------------|
| Start| - | 1 |
| 1 | 2 | 1 * 2 = 2 |
| 2 | 3 | 2 * 3 = 6 |
| 3 | 4 | 6 * 4 = 24 |
| 4 | 5 | 24 * 5 = 120 |

Result: `5! = 120`

**Recursive call trace:**
```
factorial(5) = 5 * factorial(4)
             = 5 * (4 * factorial(3))
             = 5 * (4 * (3 * factorial(2)))
             = 5 * (4 * (3 * (2 * factorial(1))))
             = 5 * (4 * (3 * (2 * (1 * factorial(0)))))
             = 5 * (4 * (3 * (2 * (1 * 1))))
             = 5 * 4 * 3 * 2 * 1 = 120
```

## Pseudocode

```
function factorialIterative(n):
    result = 1
    for i from 2 to n:
        result = result * i
    return result

function factorialRecursive(n):
    if n <= 1:
        return 1
    return n * factorialRecursive(n - 1)
```

The iterative version is generally preferred because it avoids the O(n) stack space overhead of recursion.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** The algorithm always performs exactly n-1 multiplications. There is no input that allows fewer.

- **Average Case -- O(n):** Each multiplication is O(1) for fixed-precision integers. The total is n-1 multiplications, giving O(n). Note: for arbitrary-precision (big integer) arithmetic, each multiplication can take up to O(k) where k is the number of digits, making the true complexity higher.

- **Worst Case -- O(n):** Same as all cases. The loop from 2 to n executes exactly n-1 times.

- **Space -- O(1):** The iterative version uses only a single accumulator variable. The recursive version uses O(n) stack space due to n recursive calls.

## When to Use

- **Computing permutations and combinations:** n! is the core building block for nPr and nCr formulas.
- **Probability calculations:** Many probability distributions (Poisson, binomial) involve factorials.
- **Mathematical series:** Taylor/Maclaurin series for e^x, sin(x), cos(x) use factorials in denominators.
- **When exact values are needed for small n:** For n up to about 20 (64-bit integers) or 170 (double-precision floating point).

## When NOT to Use

- **Very large n:** Factorials overflow quickly. For n > 20, big integer libraries are needed. For n > 1000, consider Stirling's approximation.
- **When you only need log(n!):** Computing log(n!) directly (via summing logs or Stirling's approximation) avoids overflow.
- **When you need n! mod p:** Use modular arithmetic properties or Wilson's theorem instead of computing the full factorial.
- **Real-time systems with very large n:** Big integer multiplication for huge factorials can be slow.

## Comparison with Similar Algorithms

| Method               | Time   | Space | Notes                                         |
|---------------------|--------|-------|-----------------------------------------------|
| Iterative            | O(n)   | O(1)  | Simple loop; preferred approach                |
| Recursive            | O(n)   | O(n)  | Elegant but wastes stack space                 |
| Stirling Approximation| O(1)  | O(1)  | Approximate: n! ~ sqrt(2*pi*n) * (n/e)^n      |
| Gamma Function       | O(1)   | O(1)  | Generalization: n! = Gamma(n+1)                |
| Prime Factorization  | O(n log log n)| O(n)| Fastest for very large n; uses prime swing  |

## Implementations

| Language   | File |
|------------|------|
| Python     | [factorial.py](python/factorial.py) |
| Java       | [FactorialIterative.java](java/FactorialIterative.java) |
| C++        | [Factorial.cpp](cpp/Factorial.cpp) |
| C          | [Factorial.c](c/Factorial.c) |
| Go         | [Factorial.go](go/Factorial.go) |
| TypeScript | [index.js](typescript/index.js) |
| Rust       | [factorial.rs](rust/factorial.rs) |

## References

- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 1.2.5: Permutations and Factorials.
- Graham, R. L., Knuth, D. E., & Patashnik, O. (1994). *Concrete Mathematics* (2nd ed.). Addison-Wesley. Chapter 5: Binomial Coefficients.
- [Factorial -- Wikipedia](https://en.wikipedia.org/wiki/Factorial)
