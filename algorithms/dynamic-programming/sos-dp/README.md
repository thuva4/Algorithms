# Sum over Subsets DP (SOS DP)

## Overview

Sum over Subsets (SOS) DP computes, for every bitmask, the sum of function values over all its submasks. Given an array `f` of size 2^n indexed by bitmasks, it computes `sos[mask] = sum of f[sub] for all sub that are submasks of mask`. The naive approach of iterating over all submasks for each mask takes O(3^n) time, but SOS DP reduces this to O(n * 2^n) by iterating over bits one at a time.

This technique is fundamental in competitive programming and combinatorial optimization. It generalizes to any associative operation (min, max, OR, GCD) beyond just summation, and it is essentially a multi-dimensional prefix sum over the Boolean hypercube.

## How It Works

1. Initialize `sos[mask] = f[mask]` for all masks.
2. For each bit position i from 0 to n-1:
   - For each mask from 0 to 2^n - 1:
     - If bit i is set in mask: `sos[mask] += sos[mask ^ (1 << i)]`
3. After processing all bits, `sos[mask]` contains the sum over all submasks of mask.

The key insight is that each iteration "absorbs" one more dimension of the hypercube. After processing bit i, `sos[mask]` accounts for all submasks that differ from `mask` only in bits 0 through i.

## Example

n=2, f = [1, 2, 3, 4] (indexed as f[00]=1, f[01]=2, f[10]=3, f[11]=4)

**Initial state:** `sos = [1, 2, 3, 4]`

**After processing bit 0:**
- mask=00: bit 0 not set, skip. sos[00] = 1
- mask=01: bit 0 set, sos[01] += sos[00] = 2 + 1 = 3
- mask=10: bit 0 not set, skip. sos[10] = 3
- mask=11: bit 0 set, sos[11] += sos[10] = 4 + 3 = 7

State: `sos = [1, 3, 3, 7]`

**After processing bit 1:**
- mask=00: bit 1 not set, skip. sos[00] = 1
- mask=01: bit 1 not set, skip. sos[01] = 3
- mask=10: bit 1 set, sos[10] += sos[00] = 3 + 1 = 4
- mask=11: bit 1 set, sos[11] += sos[01] = 7 + 3 = 10

**Final result:** `sos = [1, 3, 4, 10]`

Verification:
- sos[00] = f[00] = 1
- sos[01] = f[00] + f[01] = 1 + 2 = 3
- sos[10] = f[00] + f[10] = 1 + 3 = 4
- sos[11] = f[00] + f[01] + f[10] + f[11] = 1 + 2 + 3 + 4 = 10

## Pseudocode

```
function sosDp(f, n):
    sos = copy of f    // sos has 2^n entries

    for i from 0 to n - 1:
        for mask from 0 to 2^n - 1:
            if mask AND (1 << i) != 0:
                sos[mask] += sos[mask XOR (1 << i)]

    return sos
```

For the **superset sum** variant (summing over all supermasks), the condition is inverted:

```
function supersetSum(f, n):
    sos = copy of f

    for i from 0 to n - 1:
        for mask from 0 to 2^n - 1:
            if mask AND (1 << i) == 0:
                sos[mask] += sos[mask OR (1 << i)]

    return sos
```

## Complexity Analysis

| Case    | Time          | Space    |
|---------|---------------|----------|
| Best    | O(n * 2^n)    | O(2^n)   |
| Average | O(n * 2^n)    | O(2^n)   |
| Worst   | O(n * 2^n)    | O(2^n)   |

The algorithm performs n passes over the array of 2^n elements, giving O(n * 2^n) time. This is a significant improvement over the naive O(3^n) approach. The space requirement is O(2^n) for the sos array. Note that 3^n grows much faster than n * 2^n: for n=20, 3^20 is about 3.5 billion, while 20 * 2^20 is about 21 million.

## When to Use

- **Counting subsets with specific properties:** When you need to aggregate values over all submasks of every mask, such as counting how many subsets of a set satisfy a condition.
- **Inclusion-exclusion computations:** SOS DP can replace explicit inclusion-exclusion, which would otherwise require iterating over all subsets.
- **Bitmask DP problems:** Problems involving sets represented as bitmasks where you need to combine information across subsets.
- **Competitive programming:** Appears in problems involving AND/OR convolutions, subset convolutions, and Mobius inversion over the subset lattice.
- **Combinatorial optimization:** Problems where you need to evaluate a function over all subsets efficiently.

## When NOT to Use

- **Large n (> 25):** The 2^n space requirement makes this impractical for n beyond about 25. For n=25, the array alone requires over 100 MB of memory.
- **Sparse data:** If only a small number of masks have non-zero values, iterating over submasks directly with the O(3^n) approach (or the O(2^k) per mask enumeration trick) may be faster in practice.
- **Non-subset relationships:** SOS DP works specifically with the subset/superset lattice. For other partial orders, different techniques are needed.
- **When only a single query is needed:** If you only need the sum over submasks for one specific mask, direct enumeration of its submasks in O(2^popcount(mask)) is more efficient.

## Comparison

| Approach                     | Time       | Space  | Notes                                       |
|------------------------------|------------|--------|---------------------------------------------|
| SOS DP (this)                | O(n * 2^n) | O(2^n) | Optimal for computing all submask sums      |
| Naive submask enumeration    | O(3^n)     | O(2^n) | Simpler but much slower                     |
| Single-mask enumeration      | O(2^k)     | O(1)   | Per query; k = popcount(mask)               |
| Zeta/Mobius transform        | O(n * 2^n) | O(2^n) | Same complexity; SOS DP is the zeta transform |

SOS DP is mathematically equivalent to the zeta transform on the Boolean lattice. The Mobius transform (inverse) can undo it to recover the original values.

## Implementations

| Language   | File                                  |
|------------|---------------------------------------|
| Python     | [sos_dp.py](python/sos_dp.py)         |
| Java       | [SosDp.java](java/SosDp.java)        |
| C++        | [sos_dp.cpp](cpp/sos_dp.cpp)         |
| C          | [sos_dp.c](c/sos_dp.c)              |
| Go         | [sos_dp.go](go/sos_dp.go)           |
| TypeScript | [sosDp.ts](typescript/sosDp.ts)      |
| Rust       | [sos_dp.rs](rust/sos_dp.rs)         |
| Kotlin     | [SosDp.kt](kotlin/SosDp.kt)        |
| Swift      | [SosDp.swift](swift/SosDp.swift)    |
| Scala      | [SosDp.scala](scala/SosDp.scala)   |
| C#         | [SosDp.cs](csharp/SosDp.cs)        |

## References

- [SOS DP -- Codeforces Tutorial](https://codeforces.com/blog/entry/45223)
- [Subset Sum over Subsets -- CP-Algorithms](https://cp-algorithms.com/algebra/all-submasks.html)
- Yates, F. (1937). "The Design and Analysis of Factorial Experiments." *Imperial Bureau of Soil Science*. (The original Yates's algorithm, which SOS DP generalizes.)
