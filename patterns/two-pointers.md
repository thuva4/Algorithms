---
name: Two Pointers
slug: two-pointers
category: array
difficulty: beginner
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves finding a pair or triplet in a sorted array"
  - "Need to find elements that sum to a target value"
  - "Problem involves comparing elements from both ends of an array"
  - "Need to remove duplicates or partition an array in-place"
  - "Problem involves palindrome checking or reversing"
commonVariations:
  - "Opposite direction (start and end, moving toward each other)"
  - "Same direction (slow and fast, or fixed gap)"
  - "Multiple arrays (one pointer per array)"
relatedPatterns: []
keywords: [array, pair, sorted, two-sum, palindrome, in-place]
estimatedTime: 2-3 hours
---

# Two Pointers Pattern

## Overview

The Two Pointers pattern uses two index variables that traverse a data structure simultaneously, allowing you to reduce problems that would naively require a nested loop — O(n²) — down to a single linear pass — O(n).

The core insight is that in many array problems, you do not need to examine every pair of indices independently. If the input has a useful property (typically that it is sorted, or that you only care about relative ordering of values), the relationship between the two pointers gives you enough information to skip large portions of the search space at each step. When the pointers together satisfy some condition, you record your answer. When they do not, you move whichever pointer will most likely bring you closer to satisfaction, guided by the array's structure.

Two fundamental configurations exist:

- **Opposite direction:** One pointer starts at the left end, one at the right end. They move toward each other. This is the classic "pair sum in a sorted array" setup. Because the array is sorted, if the sum of the two pointed values is too large you move the right pointer left (decreasing the sum), and if too small you move the left pointer right (increasing the sum). Each step eliminates at least one index from consideration, giving O(n).

- **Same direction (slow and fast):** Both pointers start at the left. The fast pointer advances to discover new elements; the slow pointer marks a boundary (e.g., the end of a valid partition, or the position of the last unique element). This is used for in-place duplicate removal, array partitioning, and related tasks.

Both variants achieve O(1) extra space because no auxiliary array is needed — the two integer indices are the only state maintained beyond the input.

## When to Use This Pattern

Recognize this pattern when you see:

- The input is a **sorted array** and you need to find a pair, triplet, or subset that satisfies a numeric condition (sum, difference, product)
- The problem asks you to find **two numbers that sum to a target** (Two Sum variant on sorted input)
- You need to **remove duplicates in-place** and the array is sorted, so duplicates are adjacent
- The problem requires **partitioning an array in-place** (e.g., Dutch National Flag, segregate negatives and positives)
- You are asked to **check whether a string is a palindrome**, or reverse a portion of an array without extra memory
- The problem involves **comparing characters or values at both ends** and narrowing inward
- A brute-force approach using two nested `for` loops over the same array seems natural — the two-pointer technique often converts exactly this pattern to O(n)
- The problem involves **three numbers summing to zero** (3Sum): reduce it to a pair-sum problem by fixing one element and running two pointers on the remainder

## Core Technique

### Opposite-Direction Variant

Both pointers start at opposite ends. At each step, examine the pair `(arr[left], arr[right])`. Use the comparison result to decide which pointer to move — this is what allows the technique to skip candidates efficiently.

#### Pseudocode

```
function twoPointerOpposite(arr, target):
    left = 0
    right = len(arr) - 1

    while left < right:
        current = arr[left] + arr[right]

        if current == target:
            return (left, right)          # Found a valid pair
        else if current < target:
            left += 1                     # Sum too small; increase by moving left forward
        else:
            right -= 1                    # Sum too large; decrease by moving right backward

    return NOT_FOUND
```

Key invariant: because the array is sorted, `arr[left]` is the smallest unused value and `arr[right]` is the largest. If the sum is too small, only moving `left` right can increase it. If too large, only moving `right` left can decrease it. This eliminates the need to try all pairs.

### Same-Direction Variant

Both pointers start at the left. `fast` scans through every element; `slow` marks the position where the next valid element should be written. This enables in-place processing without extra memory.

#### Pseudocode

```
function twoPointerSameDirection(arr):
    slow = 0

    for fast from 0 to len(arr) - 1:
        if isValid(arr[fast], arr[slow]):
            slow += 1
            arr[slow] = arr[fast]         # Write valid element to the slow position

    return slow + 1                       # slow + 1 is the length of the valid prefix
```

The `isValid` function is problem-specific. For duplicate removal in a sorted array it is `arr[fast] != arr[slow]`. For partition problems it might check whether `arr[fast]` belongs in the left partition.

## Example Walkthrough

### Problem: Two Sum II (Sorted Input)

Given the **sorted** array `[1, 2, 3, 4, 6]` and target `6`, find the indices (1-based) of the two numbers that add up to `6`.

**Expected output:** `[1, 4]` (values 2 and 4, at 1-based indices 1 and 4 — wait, let us be precise: values `2` and `4` at indices 2 and 4 one-based... actually the pair that sums to 6 is `2+4=6` at positions 2 and 4, or `1+? = no`, let us trace carefully below.)

The two numbers that sum to 6 are **2 and 4** (indices 2 and 4 in 1-based notation).

**Initial state:**

```
Index (1-based):  1    2    3    4    5
arr:            [ 1,   2,   3,   4,   6 ]
                  ^                   ^
                left=0             right=4   (0-based pointers)

sum = arr[0] + arr[4] = 1 + 6 = 7   > target (6)  -->  move right left
```

**Step 1 — sum is 7, too large, move right left:**

```
arr:            [ 1,   2,   3,   4,   6 ]
                  ^              ^
                left=0        right=3

sum = arr[0] + arr[3] = 1 + 4 = 5   < target (6)  -->  move left right
```

**Step 2 — sum is 5, too small, move left right:**

```
arr:            [ 1,   2,   3,   4,   6 ]
                       ^         ^
                    left=1    right=3

sum = arr[1] + arr[3] = 2 + 4 = 6   == target (6)  -->  FOUND
```

**Result:** The pair is at 0-based indices `[1, 3]`, which are values `2` and `4`. The algorithm took 3 comparisons instead of the 10 that a brute-force nested loop would require on a 5-element array.

**Pointer movement summary:**

```
Step   left  right  arr[left]  arr[right]  sum  Action
----   ----  -----  ---------  ----------  ---  ------
  0      0     4        1           6       7   right--
  1      0     3        1           4       5   left++
  2      1     3        2           4       6   FOUND
```

Each step eliminates at least one candidate index permanently. Because the array is sorted, we can prove no skipped pair could be the answer: after step 0 we know `arr[0] + arr[4] = 7 > 6`, so `arr[4]` paired with any element >= `arr[0]` will only produce sums >= 7. `arr[4]` can never be part of the answer, so discarding it is safe.

## Common Pitfalls

1. **Using two pointers on an unsorted array when opposite-direction is required**

   - Problem: The opposite-direction variant relies on the sorted order to make elimination decisions. If `arr[left] + arr[right] > target`, you can safely discard `arr[right]` only because everything to its left is smaller. In an unsorted array this reasoning breaks down entirely.
   - Solution: Always sort the array first (O(n log n)) if the problem does not guarantee sorted input, then apply two pointers. Note that sorting changes indices, so if you need to return original indices, store `(value, originalIndex)` pairs before sorting.

2. **Off-by-one in the loop condition**

   - Problem: Using `while left <= right` instead of `while left < right` in the opposite-direction variant. When `left == right`, both pointers point to the same element; using it to form a "pair" produces an incorrect result unless the problem explicitly allows using the same element twice.
   - Solution: Use `while left < right` for pair problems. Verify your loop exit condition against the problem statement: does it allow reusing the same element?

3. **Not advancing both pointers after finding a match in multi-answer problems**

   - Problem: In problems like 3Sum that require all unique pairs, once you find a valid pair you must skip duplicate values for both `left` and `right` before continuing. Forgetting this leads to duplicate triplets in the output.
   - Solution: After recording a match, advance `left` while `arr[left] == arr[left - 1]` and decrement `right` while `arr[right] == arr[right + 1]`, then do the normal `left++; right--`. Alternatively, de-duplicate in a set, but the in-place skipping is O(1) space and O(n) time.

4. **Confusing same-direction slow/fast with the cycle-detection variant**

   - Problem: The same-direction two-pointer variant for array problems (slow writes, fast reads) looks superficially similar to fast-and-slow pointers on linked lists, but the invariants and termination conditions are different. Mixing up the two leads to incorrect index arithmetic.
   - Solution: For array in-place problems, `slow` is always a write cursor and `fast` always advances by exactly 1 each iteration. For cycle detection on linked lists, fast advances by 2. Keep the problem domain (array vs. linked list) clearly in mind.

## Interview Tips

1. **Confirm the input is sorted before applying opposite-direction two pointers.** If the problem does not say "sorted", ask the interviewer. If sorting is not allowed (e.g., you need original indices), consider whether a hash map solution (O(n) time, O(n) space) is more appropriate, since it does not require sorted order.

2. **Verbalize your pointer-movement logic.** When tracing through an example during the interview, say out loud: "The sum is too large, so I move the right pointer left to decrease it." This demonstrates you understand the invariant, not just the mechanics, and makes it easy for the interviewer to follow your reasoning.

3. **Handle duplicates explicitly for 3Sum and similar problems.** Before starting to code, mention that you will de-duplicate. Interviewers often probe this: "What if there are duplicate numbers?" Having a ready answer shows experience with the pattern's edge cases.

4. **Draw the pointer positions, not just the values.** During your example trace, physically mark where `left` and `right` are in the array. This prevents index-confusion errors and gives the interviewer a clear visual artifact to refer to when asking follow-up questions.

5. **State the complexity improvement explicitly.** A common interview expectation is that you articulate: "The brute-force approach is O(n²) because we try all pairs. Two pointers reduces this to O(n) because each pointer moves at most n times and we never backtrack." Saying this unprompted signals pattern mastery.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `two-pointers` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a recommended ordering is: Two Sum II on a sorted array (simplest opposite-direction case) before Remove Duplicates from Sorted Array (same-direction case) before 3Sum (outer loop plus opposite-direction inner two pointers) before Container With Most Water (opposite-direction with a different decision rule) before Trapping Rain Water (opposite-direction with additional state).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Sliding Window** — The variable-size sliding window pattern is a specialization of same-direction two pointers. In sliding window, `left` and `right` together define a contiguous window whose state (sum, frequency map, etc.) is incrementally maintained. Two pointers is the more general technique; sliding window adds the constraint that the subarray between the pointers is the unit of interest.
- **Fast and Slow Pointers** — Also known as Floyd's algorithm, this pattern applies same-direction two pointers to linked list problems. The fast pointer advances at twice the speed of the slow pointer. This divergence in speed is what allows cycle detection and middle-finding, tasks that are not achievable with a fixed-gap or write-cursor approach. See the Fast and Slow Pointers pattern for details.
