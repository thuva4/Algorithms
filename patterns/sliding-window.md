---
name: Sliding Window
slug: sliding-window
category: array
difficulty: beginner
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves processing contiguous subarrays or sublists"
  - "Asked to find maximum, minimum, or average of subarrays of size K"
  - "Need to find the longest or shortest substring with certain properties"
  - "Problem deals with a sequence and you need to track a subset of consecutive elements"
commonVariations:
  - "Fixed-size window (window size K is given)"
  - "Variable-size window (find optimal window size)"
  - "Multiple windows sliding simultaneously"
relatedPatterns: []
keywords: [array, substring, subarray, contiguous, window]
estimatedTime: 2-3 hours
---

# Sliding Window Pattern

## Overview

The Sliding Window pattern is a technique for efficiently processing contiguous subsets of a sequential data structure (typically an array or string). Instead of recomputing results for every possible subarray from scratch — which would require O(n * k) time — you maintain a "window" that slides over the data one element at a time, incrementally updating your result as elements enter and leave the window.

The key insight is that adjacent windows share most of their elements. When the window moves forward by one position, only one element is added (the new right boundary) and one element is removed (the old left boundary). By tracking only these changes rather than reprocessing the entire window, many problems that seem to require nested loops can be solved in a single linear pass.

This pattern is particularly powerful in interviews because it converts brute-force O(n²) or O(n * k) solutions into O(n) solutions with minimal extra space. Once you recognize the pattern, the implementation is usually straightforward and easy to reason about under pressure.

## When to Use This Pattern

Recognize this pattern when you see:

- The input is a linear data structure: an array, string, or linked list
- The problem asks about a **contiguous** subset (subarray, substring, or sublist)
- You need to find the maximum, minimum, longest, shortest, or optimal window satisfying some condition
- The problem mentions a fixed window size K, or asks you to find the optimal window size
- A brute-force approach would examine every possible subarray, leading to O(n²) complexity
- The condition being tracked changes predictably as elements enter or leave the window (e.g., a sum, count, or frequency map)
- Keywords in the problem: "contiguous subarray", "substring", "sublist", "window", "consecutive"

## Core Technique

The pattern has two main variants. Choose based on whether the window size is fixed or variable.

**Fixed-size window:** The window size K is given. Slide a window of exactly K elements from left to right. At each step, add the incoming element and remove the outgoing element, then check or record your result.

**Variable-size window (two-pointer / shrink-expand):** You expand the right boundary to include new elements, and shrink the left boundary when the window violates a constraint. This finds the minimum or maximum window satisfying a condition.

### Pseudocode

**Fixed-size window:**

```
function fixedWindow(arr, k):
    windowResult = computeInitialWindow(arr[0..k-1])
    bestResult = windowResult

    for right from k to len(arr) - 1:
        left = right - k
        windowResult = update(windowResult, add=arr[right], remove=arr[left])
        bestResult = chooseBest(bestResult, windowResult)

    return bestResult
```

**Variable-size window (expand/shrink):**

```
function variableWindow(arr, condition):
    left = 0
    windowState = emptyState()
    bestResult = initialValue()

    for right from 0 to len(arr) - 1:
        # Expand: include arr[right] in the window
        windowState = expand(windowState, arr[right])

        # Shrink: move left forward while window violates condition
        while windowViolatesCondition(windowState):
            windowState = shrink(windowState, arr[left])
            left += 1

        # Record result for valid window [left, right]
        bestResult = chooseBest(bestResult, right - left + 1)

    return bestResult
```

The `windowState` is whatever you need to track: a running sum, a frequency map, a count of distinct elements, etc. The `condition` check and the `expand`/`shrink` update logic are problem-specific but always follow this same structural template.

## Example Walkthrough

### Problem

Given an integer array and a number K, find the maximum sum of any contiguous subarray of size K.

**Input:** `arr = [2, 1, 5, 1, 3, 2]`, `K = 3`
**Output:** `9` (subarray `[5, 1, 3]`)

### Solution Breakdown

**Step 1 — Initialize the first window `[0, K-1]`:**

Compute the sum of the first K elements: 2 + 1 + 5 = **8**. Set `maxSum = 8`.

```
arr:     [ 2,  1,  5,  1,  3,  2 ]
          ^________^
window:  [2, 1, 5]   sum = 8
```

**Step 2 — Slide right by 1 (right=3, remove arr[0]=2, add arr[3]=1):**

New sum = 8 - 2 + 1 = **7**. maxSum stays 8.

```
arr:     [ 2,  1,  5,  1,  3,  2 ]
              ^________^
window:  [1, 5, 1]   sum = 7
```

**Step 3 — Slide right by 1 (right=4, remove arr[1]=1, add arr[4]=3):**

New sum = 7 - 1 + 3 = **9**. maxSum updates to 9.

```
arr:     [ 2,  1,  5,  1,  3,  2 ]
                  ^________^
window:  [5, 1, 3]   sum = 9
```

**Step 4 — Slide right by 1 (right=5, remove arr[2]=5, add arr[5]=2):**

New sum = 9 - 5 + 2 = **6**. maxSum stays 9.

```
arr:     [ 2,  1,  5,  1,  3,  2 ]
                      ^________^
window:  [1, 3, 2]   sum = 6
```

**Result:** Maximum sum is **9**, from subarray `[5, 1, 3]`.

**Visual summary:**

```
Index:   0    1    2    3    4    5
arr:   [ 2,   1,   5,   1,   3,   2 ]

Step 1: [----window----]               sum = 8   (best = 8)
Step 2:      [----window----]          sum = 7   (best = 8)
Step 3:           [----window----]     sum = 9   (best = 9) <-- answer
Step 4:                [----window---] sum = 6   (best = 9)
```

Each step is O(1): one addition, one subtraction, one comparison. Total: O(n).

## Common Pitfalls

1. **Off-by-one errors when computing window boundaries**

   When deriving the left index from the right index for a fixed-size window:

   - Problem: Using `left = right - k` instead of `left = right - k + 1`, or starting the loop at the wrong index.
   - Solution: For a window `[left, right]` of size k, `right - left + 1 = k`, so `left = right - k + 1`. Double-check by substituting the last valid right index.

2. **Forgetting to initialize the result with the first window**

   - Problem: Initializing `maxSum = 0` or `maxSum = -Infinity` but then starting the loop from index `k` without first computing the initial window sum, leading to an incorrect first comparison.
   - Solution: Always compute the initial window explicitly before entering the slide loop, or structure the loop so index 0 initializes the result correctly.

3. **Shrinking too aggressively in variable-size windows**

   - Problem: In the expand/shrink variant, moving `left` past the point where the window is still valid, potentially skipping optimal windows.
   - Solution: The `while` loop should only shrink until the window is valid again — not until it is "maximally shrunk." Check your loop condition carefully: stop as soon as the violation is resolved.

4. **Using the wrong data structure for window state**

   - Problem: Tracking distinct characters or frequencies with a simple integer when you need a hash map, causing incorrect "valid window" checks.
   - Solution: Identify upfront what state the window needs to track. For frequency-based problems, use a hash map. For sum problems, use a single integer.

5. **Applying sliding window to non-contiguous problems**

   - Problem: Trying to use a window when the optimal solution does not require a contiguous subarray (e.g., "max sum of any K elements" — those elements don't have to be adjacent).
   - Solution: Confirm the problem requires contiguity. If elements can be selected freely, sorting or a heap is likely the right approach.

## Interview Tips

1. **State the brute force first.** Before jumping to the sliding window, briefly describe the O(n * k) nested-loop approach. This demonstrates you understand the problem fully and makes your optimization feel earned and logical.

2. **Identify your window state early.** Ask yourself: "What do I need to track as the window moves?" For sum problems it's a single integer. For "at most K distinct characters" it's a frequency map plus a count. Naming this state clearly makes the rest of the implementation mechanical.

3. **Decide fixed vs. variable before writing code.** Ask: "Is the window size given?" If yes, use the fixed-window template. If you're finding the longest/shortest window meeting a condition, use the expand/shrink template. Writing the wrong variant and pivoting mid-implementation wastes time.

4. **Trace through a small example before coding.** Draw the array, show the window boundaries moving, and write the state values at each step. This usually reveals edge cases (empty array, K > n, all-negative values) before you hit them in code.

5. **Edge cases to mention:** empty input, K = 0 or K > n (fixed window), window that never becomes valid (variable window), all elements identical, and negative numbers (affects whether sum or max behaves as expected).

6. **Communicate the complexity clearly.** The answer should always be O(n) time — each element is added to and removed from the window at most once. Space is O(1) for simple tracking, or O(k) or O(alphabet size) when using a frequency map. State both and explain why.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `sliding-window` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, problems are typically ordered: maximum/minimum sum of subarray of size K (fixed window) before longest substring with K distinct characters (variable window), before minimum window substring (variable window with two frequency maps).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Two Pointers** — The variable-size sliding window is a specialization of the two-pointer technique. Two pointers is a broader approach for problems involving pairs or partitions in sorted arrays, while sliding window focuses specifically on contiguous subarrays or substrings with a maintained state.
- **Prefix Sums** — For problems involving subarray sums, prefix sums offer an alternative approach. Sliding window is preferred when you need the maximum/minimum window; prefix sums are preferred when you need to answer multiple range-sum queries on a static array.
