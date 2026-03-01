# Catalan Numbers

## Overview

Catalan numbers form a sequence of natural numbers that appear in many counting problems in combinatorics. The nth Catalan number is given by C(n) = C(2n, n) / (n+1), where C(2n, n) is the central binomial coefficient. Equivalently, C(n) = (2n)! / ((n+1)! * n!). They can be computed iteratively using the recurrence: C(0) = 1, C(n) = C(n-1) * 2(2n-1) / (n+1). For large values, modular arithmetic with mod 1000000007 is used.

The first few Catalan numbers are: 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, ...

The sequence was named after the Belgian mathematician Eugene Charles Catalan, though it was discovered earlier by Leonhard Euler in the context of polygon triangulations.

## How It Works

1. Start with C(0) = 1.
2. Use the iterative formula: C(n) = C(n-1) * 2(2n-1) / (n+1).
3. For modular arithmetic, use modular inverse instead of division.
4. Return C(n) mod 1000000007.

The iterative approach avoids recomputing factorials and is numerically stable when combined with modular arithmetic.

## Worked Example

Compute C(5):

| Step | n | Formula                          | Value |
|------|---|----------------------------------|-------|
| 0    | 0 | C(0) = 1                         | 1     |
| 1    | 1 | C(1) = C(0) * 2(1) / 2 = 1*2/2  | 1     |
| 2    | 2 | C(2) = C(1) * 2(3) / 3 = 1*6/3  | 2     |
| 3    | 3 | C(3) = C(2) * 2(5) / 4 = 2*10/4 | 5     |
| 4    | 4 | C(4) = C(3) * 2(7) / 5 = 5*14/5 | 14    |
| 5    | 5 | C(5) = C(4) * 2(9) / 6 = 14*18/6| 42    |

Result: C(5) = 42.

Verification using the closed form: C(5) = 10! / (6! * 5!) = 3628800 / (720 * 120) = 3628800 / 86400 = 42.

## Pseudocode

```
function catalan(n):
    if n <= 1:
        return 1

    c = 1
    for i = 1 to n:
        c = c * 2 * (2*i - 1) / (i + 1)
    return c
```

For modular arithmetic (mod p where p is prime):

```
function catalanMod(n, p):
    if n <= 1:
        return 1

    c = 1
    for i = 1 to n:
        c = c * (2 * (2*i - 1)) mod p
        c = c * modInverse(i + 1, p) mod p
    return c

function modInverse(a, p):
    return modPow(a, p - 2, p)    // Fermat's little theorem
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Time -- O(n):** The iterative formula computes each C(k) from C(k-1) in O(1) arithmetic operations (or O(log p) if using modular inverse via Fermat's little theorem), giving O(n) total, or O(n log p) with modular arithmetic.
- **Space -- O(1):** Only the current Catalan number needs to be stored (plus loop variables). If a table of all values C(0)...C(n) is needed, space is O(n).

## Applications

- **Counting valid parenthesizations:** C(n) counts the number of ways to correctly match n pairs of parentheses.
- **Counting binary search trees:** C(n) is the number of structurally distinct BSTs with n keys.
- **Counting paths in grids:** C(n) counts monotonic lattice paths from (0,0) to (n,n) that do not cross the main diagonal.
- **Polygon triangulations:** C(n-2) counts the number of ways to triangulate a convex polygon with n sides.
- **Stack-sortable permutations:** C(n) counts permutations of {1,...,n} sortable by a single stack.
- **Full binary trees:** C(n) counts the number of full binary trees with n+1 leaves.

## When NOT to Use

- **When n is extremely large and exact values are needed:** Catalan numbers grow exponentially as C(n) ~ 4^n / (n^(3/2) * sqrt(pi)). For very large n without modular arithmetic, arbitrary-precision integers are required and memory becomes a bottleneck.
- **When a recursive definition is needed for dynamic programming:** In some DP problems, you may need the full recurrence C(n) = sum of C(i)*C(n-1-i) for i=0..n-1, which costs O(n^2). The direct formula is only useful when you need a specific C(n), not when the DP structure of the problem requires the convolution.
- **When the problem is not actually Catalan:** Many similar-looking counting problems have subtle differences. Verify the bijection before assuming a Catalan-number solution.

## Comparison with Similar Sequences

| Sequence         | Formula                        | Growth Rate     | Key Application                    |
|-----------------|--------------------------------|----------------|------------------------------------|
| Catalan C(n)    | C(2n,n)/(n+1)                  | O(4^n/n^1.5)  | Parenthesizations, BSTs, paths     |
| Binomial C(2n,n)| (2n)!/(n!)^2                   | O(4^n/n^0.5)  | Central binomial; lattice paths    |
| Motzkin M(n)    | Sum C(n,2k)*C(k)              | O(3^n/n^1.5)  | Paths with horizontal steps        |
| Bell B(n)       | Sum S(n,k) for k=0..n         | Superexponential| Set partitions                    |
| Fibonacci F(n)  | F(n-1)+F(n-2)                  | O(phi^n)       | Tiling, recurrences               |

Catalan numbers are closely related to central binomial coefficients. In fact, C(n) = C(2n,n) - C(2n,n+1), which gives the "ballot problem" interpretation: the excess of favorable over unfavorable sequences.

## Implementations

| Language   | File |
|------------|------|
| Python     | [catalan_numbers.py](python/catalan_numbers.py) |
| Java       | [CatalanNumbers.java](java/CatalanNumbers.java) |
| C++        | [catalan_numbers.cpp](cpp/catalan_numbers.cpp) |
| C          | [catalan_numbers.c](c/catalan_numbers.c) |
| Go         | [catalan_numbers.go](go/catalan_numbers.go) |
| TypeScript | [catalanNumbers.ts](typescript/catalanNumbers.ts) |
| Rust       | [catalan_numbers.rs](rust/catalan_numbers.rs) |
| Kotlin     | [CatalanNumbers.kt](kotlin/CatalanNumbers.kt) |
| Swift      | [CatalanNumbers.swift](swift/CatalanNumbers.swift) |
| Scala      | [CatalanNumbers.scala](scala/CatalanNumbers.scala) |
| C#         | [CatalanNumbers.cs](csharp/CatalanNumbers.cs) |

## References

- Stanley, R. P. (2015). *Catalan Numbers*. Cambridge University Press.
- Graham, R. L., Knuth, D. E., & Patashnik, O. (1994). *Concrete Mathematics* (2nd ed.). Addison-Wesley. Chapter 7.5.
- Koshy, T. (2009). *Catalan Numbers with Applications*. Oxford University Press.
- [Catalan Number -- Wikipedia](https://en.wikipedia.org/wiki/Catalan_number)
- [OEIS A000108](https://oeis.org/A000108)
