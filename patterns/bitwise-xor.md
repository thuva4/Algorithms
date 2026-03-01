---
name: Bitwise XOR
slug: bitwise-xor
category: bit-manipulation
difficulty: intermediate
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves finding a single non-duplicate in a list of pairs"
  - "Need to swap values without extra variable"
  - "Problem involves toggling bits or finding differences"
  - "Need to find missing or extra number using bit properties"
commonVariations:
  - "Find single non-duplicate number"
  - "Find two non-duplicate numbers"
  - "Missing number in range"
  - "Flip and find"
relatedPatterns: []
keywords: [xor, bit-manipulation, duplicate, missing, toggle]
estimatedTime: 2-3 hours
---

# Bitwise XOR Pattern

## Overview

The Bitwise XOR pattern exploits three mathematical properties of the XOR (`^`) operation to solve problems involving duplicates, missing numbers, and bit toggling in O(n) time and O(1) space — with no hash maps or sorting required.

**The three foundational XOR properties:**

- `a ^ a = 0` — any number XORed with itself cancels to zero
- `a ^ 0 = a` — any number XORed with zero is itself (identity element)
- XOR is **commutative and associative**: `a ^ b = b ^ a` and `(a ^ b) ^ c = a ^ (b ^ c)`

These properties together mean that if you XOR all elements in a collection where every element appears an even number of times except one, all the even-count elements cancel out and only the odd-count element remains. This is the core mechanism behind "find the single non-duplicate in a list of pairs."

The pattern generalizes further: XOR of a range `1..n` can be computed in O(1), making it useful for finding missing numbers. Isolating the rightmost set bit of an XOR result allows splitting a mixed array into two independent sub-XOR problems, enabling "find two non-duplicate numbers" in a single pass.

## When to Use This Pattern

Recognize this pattern when you see:

- The input is an array where **every element appears exactly twice except one** (or except two)
- The problem asks for a **missing number** in a contiguous range, which would normally require a sum formula but XOR provides an elegant alternative
- You need to **swap two variables** without using a temporary variable
- The problem involves **toggling** individual bits in a bitmask (flip on, flip off idempotently)
- A brute-force solution would use a hash map for duplicate tracking — XOR avoids that O(n) space
- Keywords: "single number", "non-duplicate", "appear once", "missing in range", "unique", "find without extra space"

A key contraindication: if elements appear three or more times (not exactly twice), standard XOR cancellation does not apply and a different bit-counting approach is needed.

## Core Technique

**Finding a single non-duplicate:**

XOR all elements together. Duplicate pairs cancel to 0. Only the single element survives.

```
result = 0
for each num in array:
    result = result ^ num
return result
```

**Finding a missing number in `[0..n]`:**

XOR all indices `0..n` with all array values. Every index that has a matching value cancels. The missing index survives.

```
result = 0
for i from 0 to n:
    result = result ^ i ^ array[i]    // XOR index and value together
// Note: array has n elements, so array[n] is out of bounds — XOR i separately when i == n
return result
```

**Finding two non-duplicate numbers (the rightmost-set-bit trick):**

If two unique numbers `x` and `y` exist, `xor = x ^ y` is non-zero (they differ in at least one bit). Find the rightmost set bit of `xor`: `rightmostBit = xor & (-xor)`. This bit is 1 in `x` and 0 in `y` (or vice versa). Partition all array elements into two groups — those with this bit set and those without — and XOR each group independently to isolate `x` and `y`.

### Pseudocode

**Single non-duplicate:**

```
function findSingle(array):
    result = 0
    for num in array:
        result ^= num
    return result
```

**Two non-duplicates:**

```
function findTwoSingles(array):
    xor = 0
    for num in array:
        xor ^= num                        // xor = x ^ y

    rightmostBit = xor & (-xor)           // isolate lowest differing bit

    x = 0
    y = 0
    for num in array:
        if num & rightmostBit != 0:
            x ^= num                      // group A: bit is set
        else:
            y ^= num                      // group B: bit is not set

    return x, y
```

**Missing number in `[0..n]`:**

```
function missingNumber(array):
    n = len(array)
    xor = 0
    for i from 0 to n - 1:
        xor ^= i ^ array[i]
    xor ^= n                              // XOR in the final index n
    return xor
```

## Example Walkthrough

### Problem

Find the single non-duplicate number in `[1, 2, 3, 2, 1]`.

**Expected output:** `3`

### Step-by-step XOR trace

Initialize `result = 0`.

```
Step 1: result = 0 ^ 1  =  1
        (binary: 000 ^ 001 = 001)

Step 2: result = 1 ^ 2  =  3
        (binary: 001 ^ 010 = 011)

Step 3: result = 3 ^ 3  =  0
        (binary: 011 ^ 011 = 000)   <-- pair [3, 3]? No — see below.
```

Wait — `3` is the unique element, not a pair. Let us re-trace carefully in arrival order:

```
Array: [1, 2, 3, 2, 1]

result = 0
result ^= 1   →  result = 0 ^ 1   = 1    (binary: 00001)
result ^= 2   →  result = 1 ^ 2   = 3    (binary: 00011)
result ^= 3   →  result = 3 ^ 3   = 0    -- Wait, that would be wrong.
```

Let us redo with correct values. `result` carries the running XOR, not the array value:

```
result = 0
 ^= arr[0]=1   →  0 ^ 1 = 1
 ^= arr[1]=2   →  1 ^ 2 = 3      (01 ^ 10 = 11)
 ^= arr[2]=3   →  3 ^ 3 = 0      (11 ^ 11 = 00)   ← result after seeing 1, 2, 3
 ^= arr[3]=2   →  0 ^ 2 = 2      (00 ^ 10 = 10)   ← pair mate of arr[1] cancels
 ^= arr[4]=1   →  2 ^ 1 = 3      (10 ^ 01 = 11)   ← pair mate of arr[0] cancels
```

**Result: `3`**. Correct — the pair (1, 1) and pair (2, 2) cancel; only the singleton 3 remains.

**Why it works — bit-level view at each step:**

```
Index:   0    1    2    3    4
Value:   1    2    3    2    1

Cumulative XOR:
After index 0: 1       = 001
After index 1: 1^2     = 011
After index 2: 1^2^3   = 000  (running result — this is NOT the answer yet)
After index 3: ...^2   = 010  (2's pair cancels the earlier 2)
After index 4: ...^1   = 011  (1's pair cancels the earlier 1)

Final: 011 (binary) = 3 (decimal)
```

The order of XOR operations does not matter (commutativity + associativity): logically `1^1^2^2^3 = (1^1) ^ (2^2) ^ 3 = 0 ^ 0 ^ 3 = 3`.

## Common Pitfalls

1. **Assuming XOR works when elements appear more than twice**

   XOR cancellation relies on pairs (even counts). If a number appears 3 times, `a ^ a ^ a = a` (one copy survives), which breaks the pattern. For "every element appears three times except one," a different algorithm based on counting bits modulo 3 is required. Always verify the problem guarantees exactly two copies of each duplicate.

2. **Forgetting the final index XOR in the missing-number variant**

   When finding a missing number in `[0..n]`, the array has `n` elements and the last index to XOR is `n` itself. A common bug is the loop `for i in range(n)` XORing indices `0` through `n-1` and array values `array[0]` through `array[n-1]`, but forgetting to XOR `n` at the end. This causes the result to be wrong by the missing number XOR'd with `n`.

3. **Integer overflow when using the sum formula instead of XOR**

   Some implementations find the missing number via `expectedSum - actualSum`. For large `n`, `n * (n + 1) / 2` can overflow a 32-bit integer. The XOR approach naturally avoids this because XOR operates bitwise and never overflows.

4. **Misidentifying the rightmost set bit in the two-singles problem**

   `xor & (-xor)` correctly isolates the rightmost set bit in two's complement arithmetic. A common mistake is using `xor & (xor - 1)`, which clears the rightmost set bit (leaving it zero, not isolated). Another mistake is looping to find the bit position when bitwise arithmetic suffices directly.

## Interview Tips

1. **State the three XOR properties before writing any code.** Write `a^a=0`, `a^0=a`, and "XOR is commutative and associative" on the whiteboard or in comments. This shows the interviewer you understand why the algorithm works, not just that you memorized it. It also gives you a reference to consult if your implementation stalls.

2. **Explain the cancellation intuition verbally.** Say: "Each pair XORs to zero, so after processing the entire array, only the element with no pair survives." This one sentence makes the algorithm immediately convincing without requiring the interviewer to trace through every bit.

3. **For the two-singles problem, explain the rightmost-set-bit partitioning.** This step is non-obvious. Say: "Since `x ^ y` is non-zero, they differ in at least one bit. I find that bit, then use it to split the array into two groups — `x` and `y` land in different groups because they differ on this bit. All other elements, being pairs, cancel within their group." Walk through this logic before coding; it earns significant interview credit.

4. **Know the language-specific XOR operator.** In Python, Java, C++, and JavaScript, XOR is the `^` operator. In Python, `~x` is bitwise NOT (produces `-(x+1)` due to two's complement). `-x` in the expression `x & (-x)` works correctly in Python because Python integers have arbitrary precision and `-x` is the two's complement negative. Confirm this briefly if using Python.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `bitwise-xor` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a typical progression is: single non-duplicate in an array of pairs (core pattern), then missing number in `[0..n]` (XOR with indices), then find two non-duplicate numbers (requires rightmost-set-bit partitioning), then complement of a base-10 integer (bit toggling with a mask).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Bitmask DP** — Both patterns operate at the bit level, but Bitmask DP uses bit fields to encode subset membership in dynamic programming state, while Bitwise XOR uses bit cancellation for O(1)-space duplicate detection. Understanding one strengthens intuition for the other.
- **Two Pointers** — For finding the single non-duplicate in a sorted array, a two-pointer or binary search approach is possible. XOR is preferred when the array is unsorted and no extra space is available.
