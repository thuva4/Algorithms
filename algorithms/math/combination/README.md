# Combination

## Overview

A combination C(n, r) (also written as "n choose r" or nCr) counts the number of ways to select r items from a set of n items, where the order of selection does not matter. The formula is C(n, r) = n! / (r! * (n-r)!). For example, C(5, 2) = 10, meaning there are 10 ways to choose 2 items from 5.

Combinations are fundamental in combinatorics, probability theory, and statistics. They appear in the binomial theorem, Pascal's triangle, the binomial distribution, and countless counting problems. Efficient computation avoids the factorial overflow problem by canceling terms iteratively.

## How It Works

Rather than computing three factorials (which overflow quickly), the algorithm computes C(n, r) iteratively by multiplying and dividing in an interleaved fashion: C(n, r) = (n * (n-1) * ... * (n-r+1)) / (r * (r-1) * ... * 1). Using the optimization C(n, r) = C(n, n-r) when r > n-r further reduces the number of operations.

### Example

Computing `C(10, 3)`:

**Optimization:** Since 3 < 10 - 3 = 7, we use r = 3 (no change needed).

**Iterative computation:**

| Step | i | Numerator factor (n - r + i) | Denominator factor (i) | result = result * num / den |
|------|---|------------------------------|----------------------|---------------------------|
| Start | - | - | - | 1 |
| 1 | 1 | 10 - 3 + 1 = 8 | 1 | 1 * 8 / 1 = 8 |
| 2 | 2 | 10 - 3 + 2 = 9 | 2 | 8 * 9 / 2 = 36 |
| 3 | 3 | 10 - 3 + 3 = 10 | 3 | 36 * 10 / 3 = 120 |

Result: `C(10, 3) = 120`

**Verification using factorial formula:** C(10, 3) = 10! / (3! * 7!) = 3628800 / (6 * 5040) = 3628800 / 30240 = 120

**Pascal's Triangle relationship:**
```
C(n,r) = C(n-1,r-1) + C(n-1,r)

Row 0:                1
Row 1:              1   1
Row 2:            1   2   1
Row 3:          1   3   3   1
Row 4:        1   4   6   4   1
Row 5:      1   5  10  10   5   1
```

C(5, 2) = 10, readable directly from the triangle.

## Pseudocode

```
function combination(n, r):
    if r > n:
        return 0
    if r == 0 or r == n:
        return 1

    // Optimize: use smaller r
    if r > n - r:
        r = n - r

    result = 1
    for i from 1 to r:
        result = result * (n - r + i)
        result = result / i

    return result
```

The interleaved multiplication and division keeps intermediate values small. The division is always exact because C(n, r) is always an integer, and the product of i consecutive integers is divisible by i!.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(r) | O(1)  |
| Average | O(r) | O(1)  |
| Worst   | O(r) | O(1)  |

**Why these complexities?**

- **Best Case -- O(r):** With the optimization r = min(r, n-r), the loop runs at most n/2 iterations. For r = 0 or r = n, the function returns immediately in O(1).

- **Average Case -- O(r):** The loop performs exactly r iterations, each requiring one multiplication and one division. With the min(r, n-r) optimization, r <= n/2.

- **Worst Case -- O(r):** The loop always runs exactly min(r, n-r) iterations. The worst case is r = n/2, giving O(n/2) = O(n) iterations.

- **Space -- O(1):** Only a single result variable and loop counter are needed. No arrays are required.

## When to Use

- **Counting selections without order:** The canonical combinatorics application.
- **Binomial coefficients in polynomials:** Computing coefficients of (x + y)^n.
- **Probability calculations:** Computing probabilities in the binomial and hypergeometric distributions.
- **When avoiding overflow is important:** The iterative approach handles larger values than the factorial formula.

## When NOT to Use

- **When order matters:** Use permutations nPr = n! / (n-r)! instead.
- **When you need all binomial coefficients for a given n:** Build Pascal's triangle row by row instead of computing each independently.
- **Very large n and r with exact results:** For extremely large values, modular arithmetic (Lucas' theorem) or big-integer libraries are needed.
- **When repeated combination queries are needed:** Precompute Pascal's triangle for O(1) lookups.

## Comparison with Similar Algorithms

| Method                | Time | Space | Notes                                          |
|----------------------|------|-------|-------------------------------------------------|
| Iterative nCr         | O(r) | O(1)  | Efficient; avoids overflow via interleaving      |
| Factorial formula      | O(n) | O(1)  | Overflows for moderate n; needs big integers     |
| Pascal's Triangle      | O(n^2)| O(n^2)| Precomputes all C(n,r) up to n                 |
| Lucas' Theorem         | O(p log_p n)| O(p)| For C(n,r) mod prime p; handles very large n |

## Implementations

| Language | File |
|----------|------|
| C++      | [nCr1.cpp](cpp/nCr1.cpp) |

## References

- Graham, R. L., Knuth, D. E., & Patashnik, O. (1994). *Concrete Mathematics* (2nd ed.). Addison-Wesley. Chapter 5: Binomial Coefficients.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Appendix C: Counting and Probability.
- [Binomial Coefficient -- Wikipedia](https://en.wikipedia.org/wiki/Binomial_coefficient)
