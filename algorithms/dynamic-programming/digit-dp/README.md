# Digit DP

## Overview

Digit DP is a technique for counting numbers within a range [0, N] (or [L, R]) that satisfy certain digit-based constraints. Instead of iterating over every number, it processes digits from the most significant to the least significant, tracking whether the number being built is still "tight" (bounded by N) or free to use any digit. This reduces the complexity from O(N) to O(D * S * 2), where D is the number of digits and S is the number of states.

A classic application is counting how many numbers in [1, N] have a digit sum equal to a given value. The technique generalizes to any constraint expressible in terms of individual digits: counting numbers with no repeated digits, numbers divisible by a given value, numbers whose digits are non-decreasing, and so on.

## How It Works

1. Convert the upper bound N into its digit representation (e.g., N=253 becomes [2, 5, 3]).
2. Define DP states: position (current digit index), accumulated state (e.g., digit sum so far), and a tight flag indicating whether previous digits exactly match N.
3. At each position, iterate over possible digits:
   - If tight: digits range from 0 to digit[pos] (matching N's digit at this position).
   - If free: digits range from 0 to 9.
4. Transition to the next position, updating the accumulated state and tight flag.
5. Base case: when all digits are placed, check if the accumulated state satisfies the constraint.

## Worked Example

**Problem:** Count numbers from 1 to 25 whose digit sum equals 5.

Represent 25 as digits [2, 5].

**DP table: dp[pos][sum][tight]**

Starting at position 0, sum=0, tight=true:

| First digit | Tight? | Remaining range | Second digit options | Valid completions |
|------------|--------|-----------------|---------------------|-------------------|
| 0          | free   | 0-9 for next    | digit sum needs 5   | d2=5: number "05"=5 |
| 1          | free   | 0-9 for next    | digit sum needs 4   | d2=4: number 14     |
| 2          | tight  | 0-5 for next    | digit sum needs 3   | d2=3: number 23     |

Numbers found: **5, 14, 23** --> Answer = **3**

Detailed trace for first digit = 2 (tight):
- d1=2, tight remains true. Need remaining sum = 5-2 = 3.
- d2 can be 0..5 (since tight and N's second digit is 5).
- d2=3: sum=2+3=5. Valid. Number = 23.
- d2=0,1,2,4,5: sums are 2,3,4,6,7. Only d2=3 gives sum=5.

## Pseudocode

```
function digitDP(N, targetSum):
    digits = toDigitArray(N)
    D = len(digits)
    memo = new HashMap()

    function solve(pos, currentSum, tight):
        if pos == D:
            return 1 if currentSum == targetSum else 0

        if (pos, currentSum, tight) in memo:
            return memo[(pos, currentSum, tight)]

        limit = digits[pos] if tight else 9
        count = 0

        for d = 0 to limit:
            newTight = tight AND (d == limit)
            count += solve(pos + 1, currentSum + d, newTight)

        memo[(pos, currentSum, tight)] = count
        return count

    // Subtract 1 because we want [1, N] not [0, N], and 0 has digit sum 0
    return solve(0, 0, true)
```

## Complexity Analysis

| Case    | Time           | Space          |
|---------|----------------|----------------|
| Best    | O(D * S * 2)   | O(D * S * 2)   |
| Average | O(D * S * 2)   | O(D * S * 2)   |
| Worst   | O(D * S * 2)   | O(D * S * 2)   |

Where D = number of digits in N, S = number of possible states for the constraint (e.g., max digit sum), and the factor of 2 accounts for the tight/free flag.

**Why these complexities?**

- **Time:** Each unique state (pos, sum, tight) is computed exactly once and cached. There are D positions, S possible accumulated state values, and 2 tight flag values. Each state iterates over at most 10 digits. Total: O(10 * D * S * 2) = O(D * S).

- **Space:** The memoization table stores one value per unique state: O(D * S * 2).

For counting numbers up to 10^18 with digit sum constraints, D=19 and S is at most 9*19=171, giving roughly 19 * 171 * 2 = 6,498 states -- trivially fast.

## When to Use

- **Range counting with digit constraints:** Count numbers in [L, R] satisfying properties based on individual digits (digit sum, digit product, specific digit patterns).
- **Numbers divisible by k:** Track remainder mod k as the state to count multiples of k in a range.
- **Numbers with non-repeating digits:** Use a bitmask of used digits as the state.
- **Competition problems:** Extremely common in competitive programming for problems involving counting numbers with specific digit properties.
- **Large ranges:** When N can be up to 10^18, iterating over all numbers is impossible, but digit DP handles it in microseconds.

## When NOT to Use

- **Constraints that span multiple numbers:** Digit DP works on individual numbers. If the constraint involves relationships between multiple numbers, other techniques are needed.
- **Non-digit-based properties:** Properties like "is prime" cannot be efficiently captured by digit DP alone (though primality testing combined with digit DP is possible for small ranges).
- **Small ranges:** When N is small enough to iterate directly (e.g., N < 10^6), a simple loop with a check may be simpler and just as fast.
- **Constraints requiring full number context:** If the validity of a digit depends on all other digits simultaneously (not just a running state), the state space may explode.

## Comparison

| Approach           | Time           | Space      | Notes                                      |
|-------------------|----------------|------------|--------------------------------------------|
| Brute Force        | O(N)           | O(1)       | Check each number; infeasible for large N  |
| **Digit DP**       | **O(D * S * 2)** | **O(D * S)** | **Logarithmic in N; very fast**           |
| Inclusion-Exclusion| Varies         | Varies     | Works for some combinatorial constraints   |
| Mathematical Formula| O(1) to O(D)  | O(1)       | Only for special cases (e.g., count of multiples) |

## Implementations

| Language   | File                                     |
|------------|------------------------------------------|
| Python     | [digit_dp.py](python/digit_dp.py)        |
| Java       | [DigitDp.java](java/DigitDp.java)        |
| C++        | [digit_dp.cpp](cpp/digit_dp.cpp)         |
| C          | [digit_dp.c](c/digit_dp.c)              |
| Go         | [digit_dp.go](go/digit_dp.go)           |
| TypeScript | [digitDp.ts](typescript/digitDp.ts)      |
| Rust       | [digit_dp.rs](rust/digit_dp.rs)         |
| Kotlin     | [DigitDp.kt](kotlin/DigitDp.kt)         |
| Swift      | [DigitDp.swift](swift/DigitDp.swift)     |
| Scala      | [DigitDp.scala](scala/DigitDp.scala)    |
| C#         | [DigitDp.cs](csharp/DigitDp.cs)         |

## References

- [Digit DP -- Competitive Programming](https://codeforces.com/blog/entry/77096)
- Halim, S., & Halim, F. (2013). *Competitive Programming 3*. Chapter 8: Advanced Topics.
- [Digit DP -- CP-Algorithms](https://cp-algorithms.com/)
- Laaksonen, A. (2017). *Competitive Programmer's Handbook*. Chapter 22: Combinatorics.
