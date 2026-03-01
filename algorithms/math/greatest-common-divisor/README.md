# Greatest Common Divisor

## Overview

The Greatest Common Divisor (GCD) of two integers is the largest positive integer that divides both numbers without a remainder. The Euclidean algorithm, one of the oldest known algorithms (dating back to 300 BC), computes the GCD efficiently by repeatedly replacing the larger number with the remainder of dividing the larger by the smaller. For example, GCD(48, 18) = 6.

The GCD is fundamental to number theory and has applications in simplifying fractions, cryptography (RSA depends on computing GCDs), modular arithmetic, and solving Diophantine equations. The Euclidean algorithm is remarkably efficient, running in O(log(min(a, b))) time.

## How It Works

The algorithm is based on the principle that GCD(a, b) = GCD(b, a mod b). Starting with two numbers, we repeatedly replace (a, b) with (b, a mod b) until b becomes 0. At that point, a holds the GCD. This works because any common divisor of a and b must also divide (a mod b), and vice versa.

### Example

Computing `GCD(252, 105)`:

| Step | a | b | a mod b | Action |
|------|-----|-----|---------|--------|
| 1 | 252 | 105 | 252 mod 105 = 42 | Replace (252, 105) with (105, 42) |
| 2 | 105 | 42 | 105 mod 42 = 21 | Replace (105, 42) with (42, 21) |
| 3 | 42 | 21 | 42 mod 21 = 0 | Replace (42, 21) with (21, 0) |
| 4 | 21 | 0 | - | b = 0, return a = 21 |

Result: `GCD(252, 105) = 21`

**Verification:** 252 = 21 * 12, 105 = 21 * 5. Both divide evenly by 21, and no larger number divides both.

## Pseudocode

```
function gcd(a, b):
    while b != 0:
        temp = b
        b = a mod b
        a = temp
    return a
```

Recursive version:

```
function gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a mod b)
```

The Euclidean algorithm reduces the problem size by at least half every two steps (since a mod b < a/2 when b <= a/2), guaranteeing logarithmic convergence.

## Complexity Analysis

| Case    | Time              | Space |
|---------|-------------------|-------|
| Best    | O(1)              | O(1)  |
| Average | O(log(min(a,b)))  | O(1)  |
| Worst   | O(log(min(a,b)))  | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** When one number divides the other evenly (e.g., GCD(10, 5)), the first modulo operation gives 0, and the algorithm terminates in a single step.

- **Average Case -- O(log(min(a,b))):** On average, each step reduces the larger number by roughly a factor of the golden ratio phi, giving approximately log_phi(min(a,b)) steps.

- **Worst Case -- O(log(min(a,b))):** The worst case occurs when the inputs are consecutive Fibonacci numbers (e.g., GCD(F(n), F(n-1))), which require the most steps. Even in this case, the number of steps is proportional to log(min(a,b)).

- **Space -- O(1):** The iterative version uses only a constant number of variables. The recursive version uses O(log(min(a,b))) stack space.

## When to Use

- **Simplifying fractions:** Divide numerator and denominator by their GCD to get the simplest form.
- **Cryptography (RSA):** Checking coprimality and computing modular inverses rely on GCD.
- **Solving Diophantine equations:** The extended Euclidean algorithm (based on GCD) solves ax + by = gcd(a, b).
- **Computing LCM:** LCM(a, b) = a * b / GCD(a, b).
- **When efficiency matters:** The Euclidean algorithm is vastly superior to trial division for computing GCD.

## When NOT to Use

- **GCD of more than two numbers:** Extend by computing GCD iteratively: GCD(a, b, c) = GCD(GCD(a, b), c). This is still efficient.
- **When you also need the Bezout coefficients:** Use the Extended Euclidean Algorithm, which computes GCD along with x and y such that ax + by = GCD(a, b).
- **Very large numbers in performance-critical code:** The Binary GCD (Stein's algorithm) avoids division operations, which can be faster on hardware.
- **Floating-point numbers:** GCD is defined for integers. Approximate GCD for real numbers requires different approaches.

## Comparison with Similar Algorithms

| Algorithm           | Time               | Space | Notes                                         |
|--------------------|-------------------|-------|-----------------------------------------------|
| Euclidean GCD       | O(log(min(a,b)))  | O(1)  | Simple division-based; most common              |
| Binary GCD (Stein)  | O(log(min(a,b))^2)| O(1)  | Uses only subtraction and bit shifts            |
| Extended Euclidean   | O(log(min(a,b)))  | O(1)  | Also computes Bezout coefficients               |
| Trial Division       | O(sqrt(min(a,b))) | O(1)  | Naive; checks all divisors up to sqrt           |

## Implementations

| Language   | File |
|------------|------|
| Python     | [GCD.py](python/GCD.py) |
| Java       | [EuclideanGCD.java](java/EuclideanGCD.java) |
| C++        | [GreatestCommonDivisior.cpp](cpp/GreatestCommonDivisior.cpp) |
| C          | [EuclideanGCD.c](c/EuclideanGCD.c) |
| Go         | [GCDEuclidean.go](go/GCDEuclidean.go) |
| TypeScript | [index.js](typescript/index.js) |
| Kotlin     | [EuclideanGCD.kt](kotlin/EuclideanGCD.kt) |
| C#         | [GCD.cs](csharp/GCD.cs) |
| Scala      | [GCD.scala](scala/GCD.scala) |

## References

- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 4.5.2: The Greatest Common Divisor.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 31.2: Greatest Common Divisor.
- [Euclidean Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Euclidean_algorithm)
