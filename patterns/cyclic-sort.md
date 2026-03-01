---
name: Cyclic Sort
slug: cyclic-sort
category: array
difficulty: intermediate
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves array containing numbers in range [1, n]"
  - "Need to find missing, duplicate, or misplaced numbers"
  - "Array elements should map to specific indices"
  - "Problem can be solved by placing each number at its correct index"
commonVariations:
  - "Find missing number in [1,n]"
  - "Find all missing numbers"
  - "Find duplicate number"
  - "Find all duplicates"
relatedPatterns: []
keywords: [array, sort, in-place, missing-number, duplicate, index-mapping]
estimatedTime: 2-3 hours
---

# Cyclic Sort Pattern

## Overview

Cyclic Sort is an in-place sorting algorithm specifically designed for arrays whose elements are integers in a known, contiguous range — typically `[1, n]` for an array of length `n`. Its key insight is elegantly simple: if the array contains exactly the values 1 through n, then the correct position for value `v` is index `v - 1`. By repeatedly placing each element at its correct index through a series of swaps, the entire array can be sorted in O(n) time using O(1) extra space.

The algorithm is called "cyclic" because of the cycle structure inherent in permutations. When an element is out of place, swapping it toward its correct position follows a chain of displacements that eventually cycles back — every element participates in at most one such cycle, which is why the total number of swaps is bounded by O(n) even though there is a nested-looking while loop.

The real power of this pattern in interviews is what it enables after the sort completes. Once the array is as sorted as it can be, any element that is still out of place reveals something important: a missing number, a duplicate, or a misplaced value. This makes cyclic sort the perfect tool for a whole family of missing-and-duplicate problems that would otherwise require extra hash space.

Without this pattern, finding the missing number or all duplicates in an unsorted array typically requires O(n) extra space (a hash set or a boolean array). With cyclic sort, you sort in-place first and then do a single linear scan — achieving O(n) time and O(1) space, which is the optimal complexity interviewers expect.

## When to Use

Reach for the Cyclic Sort pattern when you see these signals:

- The input array contains integers in a known range, most commonly `[1, n]` or `[0, n]`.
- The problem asks you to find missing number(s), duplicate number(s), or the number that appears in the wrong position.
- You are expected to solve the problem in O(n) time without using extra space (O(1) space).
- A brute-force hash-set approach works but uses O(n) space, and the interviewer asks you to optimize.

Common problem phrasings that signal cyclic sort:
- "Find the missing number in an array containing integers from 1 to n."
- "The array should contain all integers from 1 to n; find all numbers that are missing."
- "Find the duplicate number in an array where every number appears once except one."
- "Find all numbers that appear twice in the array."
- "Find the smallest missing positive integer."

If the range is not fixed (e.g., arbitrary integers, possibly negative), cyclic sort does not directly apply. Fall back to sorting with O(n log n) or use a hash set.

## Core Technique

The algorithm places each element at the index equal to its value minus one: element with value `v` belongs at index `v - 1`.

**High-level steps:**
1. Iterate through the array with index `i` starting at 0.
2. At each position `i`, check if `nums[i]` is already at its correct position (`nums[i] - 1 == i`).
3. If not, and if the target position is valid and not already occupied by the correct value, swap `nums[i]` with the element at `nums[i] - 1`.
4. After the swap, do NOT advance `i` — the new element at position `i` may also need to move.
5. If `nums[i]` is already in the right place (or a duplicate is blocking the swap), advance `i`.
6. After the loop, scan for positions where `nums[i] - 1 != i` to identify missing or duplicate values.

### Pseudocode

```
function cyclicSort(nums):
    i = 0
    while i < length(nums):
        // Correct position for nums[i] is index (nums[i] - 1)
        correctIndex = nums[i] - 1

        if nums[i] != nums[correctIndex]:
            // nums[i] is not in its correct spot AND
            // the correct spot doesn't already hold the right value
            swap(nums[i], nums[correctIndex])
            // Do NOT increment i; re-check the new value at position i
        else:
            // Either nums[i] is at its correct index, or it's a duplicate
            // of what's already at correctIndex — move forward
            i += 1

    return nums
```

**Why `nums[i] != nums[correctIndex]` and not just `correctIndex != i`?**

If the array has duplicates, `correctIndex` could differ from `i`, but `nums[correctIndex]` already holds the correct value. Swapping in that case would loop forever because you'd keep swapping two identical values. The guard `nums[i] != nums[correctIndex]` prevents infinite loops on duplicates.

### Finding Missing Numbers After Sorting

```
function findMissingNumbers(nums):
    cyclicSort(nums)      // sort in-place first

    missing = []
    for i from 0 to length(nums) - 1:
        if nums[i] - 1 != i:
            missing.append(i + 1)   // expected value is i+1; it's absent

    return missing
```

### Finding Duplicate Numbers After Sorting

```
function findDuplicates(nums):
    cyclicSort(nums)

    duplicates = []
    for i from 0 to length(nums) - 1:
        if nums[i] - 1 != i:
            duplicates.append(nums[i])   // nums[i] couldn't go home; it's a duplicate

    return duplicates
```

## Example Walkthrough

**Input:** `[3, 1, 5, 4, 2]` — array of length 5, values in range `[1, 5]`.

**Goal:** Sort the array in-place using cyclic sort.

**Correct positions:** value 1 at index 0, value 2 at index 1, value 3 at index 2, value 4 at index 3, value 5 at index 4.

---

**i = 0:** `nums[0] = 3`, correctIndex = 3 - 1 = 2.
- `nums[0]=3` vs `nums[2]=5` — they differ, so swap indices 0 and 2.
- Array: `[5, 1, 3, 4, 2]`
- Do not advance i (stay at i=0 to re-check the new value).

**i = 0:** `nums[0] = 5`, correctIndex = 5 - 1 = 4.
- `nums[0]=5` vs `nums[4]=2` — they differ, so swap indices 0 and 4.
- Array: `[2, 1, 3, 4, 5]`
- Do not advance i.

**i = 0:** `nums[0] = 2`, correctIndex = 2 - 1 = 1.
- `nums[0]=2` vs `nums[1]=1` — they differ, so swap indices 0 and 1.
- Array: `[1, 2, 3, 4, 5]`
- Do not advance i.

**i = 0:** `nums[0] = 1`, correctIndex = 1 - 1 = 0.
- `nums[0]=1` vs `nums[0]=1` — same value (element is at correct index). Advance i.
- i = 1.

**i = 1:** `nums[1] = 2`, correctIndex = 2 - 1 = 1.
- Already in place. Advance i.
- i = 2.

**i = 2:** `nums[2] = 3`, correctIndex = 3 - 1 = 2.
- Already in place. Advance i.
- i = 3.

**i = 3:** `nums[3] = 4`, correctIndex = 4 - 1 = 3.
- Already in place. Advance i.
- i = 4.

**i = 4:** `nums[4] = 5`, correctIndex = 5 - 1 = 4.
- Already in place. Advance i.
- i = 5 — loop ends.

**Result:** `[1, 2, 3, 4, 5]`

Total swaps performed: 3 (even though we iterated with a while loop that re-checked index 0 multiple times). Each element is swapped at most once to its correct position, giving O(n) total swaps and O(n) overall time.

## Common Pitfalls

1. **Forgetting to guard against infinite loops when duplicates are present.** If your swap condition is only `correctIndex != i` (rather than `nums[i] != nums[correctIndex]`), you will loop forever when the element at `correctIndex` is already the correct value. For example, with input `[1, 2, 2]`, when `i=2` and `correctIndex=1`, `nums[1]` is already 2 — swapping would exchange two 2s indefinitely. The correct guard is `nums[i] != nums[correctIndex]`, which short-circuits on duplicates.

2. **Off-by-one errors when the range is `[0, n]` instead of `[1, n]`.** Many problems (like LeetCode 268, "Missing Number") use the range `[0, n]` in an array of length `n+1`, or ask about `[1, n]` but map to indices differently. Always derive `correctIndex` explicitly from the problem's range. For `[1, n]`: `correctIndex = nums[i] - 1`. For `[0, n-1]`: `correctIndex = nums[i]`. Mixing these up produces a correctly-structured but wrong solution.

3. **Advancing `i` unconditionally inside the loop.** The while loop must only advance `i` when the element at position `i` is finalized — either because it is already in the right place or because it is a duplicate that cannot be placed. If you use a for loop or always increment `i` after a swap, the newly swapped element at position `i` is never checked, and the array will not be fully sorted. Always re-examine position `i` after a swap.

4. **Trying to apply cyclic sort when the range is not contiguous or known.** Cyclic sort only works when there is a direct formula mapping each value to its target index. If the values are arbitrary integers (possibly negative, very large, or non-contiguous), this mapping does not exist. In such cases, use a hash set or a different approach. Applying cyclic sort blindly to out-of-range values will produce index-out-of-bounds errors.

## Interview Tips

1. **State the key insight explicitly.** Before coding, say: "Since the array contains values in `[1, n]`, each value `v` has a natural home at index `v - 1`. I'll repeatedly swap elements to their correct positions, which sorts the array in O(n) with O(1) space." This framing immediately shows the interviewer you understand why the algorithm works, not just that you memorized it.

2. **Explain why the time complexity is O(n) despite the nested loop structure.** The outer while loop runs at most O(n) times per index advancement, and each swap moves at least one element permanently to its correct position. Since each element can be moved at most once, the total number of swaps is bounded by n. Thus the while loop does at most 2n iterations overall — O(n). Interviewers often probe this point because the loop looks quadratic at first glance.

3. **Separate the sort phase from the scan phase clearly.** In your explanation and code, make it obvious that there are two distinct steps: (1) cyclic sort to place every element at its correct index, and (2) a linear scan to identify anomalies. Conflating the two steps confuses both you and the interviewer. Name them explicitly: "First, I sort in-place. Then, I scan for positions where the value doesn't match."

4. **Recognize when cyclic sort is the optimal tool.** Hash-set solutions for missing/duplicate problems are O(n) time but O(n) space. Sorting-based solutions are O(n log n) time and O(1) space. Cyclic sort achieves O(n) time and O(1) space — the best of both worlds — specifically because of the bounded-range constraint. Mention this tradeoff comparison to demonstrate you understand the problem space.

5. **Know the range variations cold.** LeetCode problems use both `[1, n]` and `[0, n]` ranges, and sometimes the array has length `n` while the range is `[1, n]` (so one value is missing). Quickly sketch the mapping before you code: "array length is n, values are in `[1, n]`, correct index for value v is `v - 1`." Writing this down prevents the most common class of bugs.

## Practice Progression

Work through problems in this order to build mastery incrementally:

**Level 1 — Core algorithm:**
- Cyclic Sort (basic: sort array of [1,n] in-place)
- Missing Number (LeetCode 268) — find the one missing value in [0,n]

**Level 2 — Single anomaly detection:**
- Find the Missing Number in [1,n] — same idea, different range
- Find the Duplicate Number (LeetCode 287) — one duplicate, no extra space
- Find All Numbers Disappeared in an Array (LeetCode 448)

**Level 3 — Multiple anomalies:**
- Find All Duplicates in an Array (LeetCode 442)
- Set Mismatch (LeetCode 645) — find both the duplicate and the missing number
- Find the Duplicate and Missing Number (various platforms)

**Level 4 — Advanced variants:**
- First Missing Positive (LeetCode 41) — cyclic sort on arbitrary positive integers with filtering
- Find the Corrupt Pair — return the duplicate and missing together
- K Missing Positive Numbers — extend the scan phase to collect multiple answers

## Related Patterns

No directly linked patterns yet. Cyclic sort is a standalone in-place technique. It complements two-pointer and hash-map approaches as alternative ways to achieve O(n) time on array-range problems; understanding all three lets you choose the right tool when space constraints vary.
