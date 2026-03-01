---
name: Two Heaps
slug: two-heaps
category: heap
difficulty: advanced
timeComplexity: O(log n)
spaceComplexity: O(n)
recognitionTips:
  - "Problem asks to find the median of a stream of numbers"
  - "Need to partition data into two halves and track their extremes"
  - "Problem involves balancing two groups of numbers"
  - "Need O(log n) insertions with O(1) median access"
commonVariations:
  - "Sliding window median"
  - "Find median from data stream"
  - "Schedule tasks to minimize latency"
relatedPatterns: []
keywords: [heap, median, stream, min-heap, max-heap, balance]
estimatedTime: 3-4 hours
---

# Two Heaps Pattern

## Overview

The Two Heaps pattern solves problems that require efficiently tracking the **median** or the **boundary between two halves** of a dynamic dataset. It uses exactly two priority queues working in tandem:

- A **max-heap** (`lowerHalf`) stores the smaller half of all numbers seen so far. Its root is the largest number in the lower half — the closest element to the median from the left.
- A **min-heap** (`upperHalf`) stores the larger half of all numbers seen so far. Its root is the smallest number in the upper half — the closest element to the median from the right.

After every insertion, a **rebalancing step** ensures the two heaps differ in size by at most one element. This invariant guarantees O(1) median access: if the heaps are equal in size, the median is the average of the two roots; if one heap is larger, its root is the median.

The key insight is that you never need to know the sorted order of all elements — you only ever need the middle one or two values. The two-heap structure gives you exactly that at heap-operation cost (O(log n) per insertion), making it far more efficient than sorting the entire dataset after each new element.

## When to Use This Pattern

Recognize this pattern when you see:

- The problem asks for a **running median** or median after each insertion in a stream
- You need to dynamically partition numbers into two groups (e.g., "lower half" and "upper half") and query the boundary
- The problem involves finding the median of a sliding window of size K (combine two heaps with a removal mechanism)
- You need to continuously balance two competing sets of elements, such as scheduling tasks to two processors to minimize max completion time
- The problem needs O(log n) insertions and O(1) or O(log n) reads of the partition boundary
- Keywords: "median", "stream", "running", "balance", "partition into two groups", "continuously adding numbers"

If sorting the full array after each insertion would solve the problem but is too slow, Two Heaps is the likely optimization path.

## Core Technique

**Insert + rebalance algorithm:**

Every insertion follows three steps:

1. **Route to the correct heap.** If the new number is less than or equal to the max-heap root (or the max-heap is empty), push to `lowerHalf` (max-heap). Otherwise push to `upperHalf` (min-heap).

2. **Rebalance.** After the push, check the size difference. If `lowerHalf.size > upperHalf.size + 1`, move the max-heap root to the min-heap. If `upperHalf.size > lowerHalf.size`, move the min-heap root to the max-heap. This step costs O(log n) and restores the invariant.

3. **Read the median.** If sizes are equal, median = `(lowerHalf.top + upperHalf.top) / 2`. If `lowerHalf` is one larger, median = `lowerHalf.top`.

### Pseudocode

```
class MedianFinder:
    lowerHalf = MaxHeap()   // stores the smaller half
    upperHalf = MinHeap()   // stores the larger half

    function insert(num):
        // Step 1: route
        if lowerHalf.isEmpty() or num <= lowerHalf.top():
            lowerHalf.push(num)
        else:
            upperHalf.push(num)

        // Step 2: rebalance
        if lowerHalf.size() > upperHalf.size() + 1:
            upperHalf.push(lowerHalf.pop())
        else if upperHalf.size() > lowerHalf.size():
            lowerHalf.push(upperHalf.pop())

    function getMedian():
        if lowerHalf.size() == upperHalf.size():
            return (lowerHalf.top() + upperHalf.top()) / 2.0
        else:
            return lowerHalf.top()   // lowerHalf always holds the extra element
```

**Sliding window median variant (remove from heap):**

```
    function remove(num):
        if num <= lowerHalf.top():
            lowerHalf.remove(num)     // O(log n) with lazy deletion or indexed heap
        else:
            upperHalf.remove(num)
        // Rebalance after removal using same logic as insert
```

Note: Direct heap removal is O(n) in most standard libraries. The efficient approach uses **lazy deletion**: mark elements as removed and skip them when they surface at the top of the heap.

## Example Walkthrough

### Problem

Process the stream `[1, 5, 2, 10, 6]` one element at a time. After each insertion, report the current median.

### Step-by-step trace

**Insert 1:**

- `lowerHalf` is empty, so push 1 to `lowerHalf`.
- Sizes: lowerHalf = [1], upperHalf = []. lowerHalf has 1 more element — valid (allowed).
- Median = `lowerHalf.top()` = **1**

```
lowerHalf (max-heap): [1]        upperHalf (min-heap): []
                       ^top
Median: 1
```

**Insert 5:**

- 5 > lowerHalf.top() (1), so push 5 to `upperHalf`.
- Sizes: lowerHalf = 1, upperHalf = 1. Balanced.
- Median = `(lowerHalf.top() + upperHalf.top()) / 2` = `(1 + 5) / 2` = **3.0**

```
lowerHalf (max-heap): [1]        upperHalf (min-heap): [5]
                       ^top                             ^top
Median: (1 + 5) / 2 = 3.0
```

**Insert 2:**

- 2 > lowerHalf.top() (1), so push 2 to `upperHalf`.
- Sizes: lowerHalf = 1, upperHalf = 2. `upperHalf` is larger — rebalance: pop 2 from `upperHalf`, push to `lowerHalf`.
- Sizes after rebalance: lowerHalf = 2, upperHalf = 1. lowerHalf has 1 more — valid.
- Median = `lowerHalf.top()` = **2**

```
lowerHalf (max-heap): [2, 1]     upperHalf (min-heap): [5]
                       ^top                             ^top
Median: 2
```

**Insert 10:**

- 10 > lowerHalf.top() (2), so push 10 to `upperHalf`.
- Sizes: lowerHalf = 2, upperHalf = 2. Balanced.
- Median = `(lowerHalf.top() + upperHalf.top()) / 2` = `(2 + 5) / 2` = **3.5**

```
lowerHalf (max-heap): [2, 1]     upperHalf (min-heap): [5, 10]
                       ^top                             ^top
Median: (2 + 5) / 2 = 3.5
```

**Insert 6:**

- 6 > lowerHalf.top() (2), so push 6 to `upperHalf`.
- Sizes: lowerHalf = 2, upperHalf = 3. `upperHalf` is larger — rebalance: pop 5 from `upperHalf`, push to `lowerHalf`.
- Sizes after rebalance: lowerHalf = 3, upperHalf = 2. lowerHalf has 1 more — valid.
- Median = `lowerHalf.top()` = **5**

```
lowerHalf (max-heap): [5, 2, 1]  upperHalf (min-heap): [6, 10]
                       ^top                             ^top
Median: 5
```

**Summary of results:** after each insertion, medians are `1, 3.0, 2, 3.5, 5`.

Verification: sorted stream at each step: `[1]` → `[1,5]` → `[1,2,5]` → `[1,2,5,10]` → `[1,2,5,6,10]`. Medians: 1, 3, 2, 3.5, 5. Matches.

## Common Pitfalls

1. **Inverting the routing direction**

   Routing a number larger than `lowerHalf.top()` into `lowerHalf` (the max-heap) corrupts the partition invariant: `lowerHalf` would contain elements from the upper half, making its root useless as a median boundary. Always route: numbers smaller than or equal to the current max-heap root go left; all others go right.

2. **Forgetting to rebalance after every insertion**

   The size invariant (sizes differ by at most 1) must hold before every median query. Skipping rebalance on any insertion can cause the size difference to grow unboundedly, making median reads incorrect. The rebalance step must run unconditionally after every push.

3. **Returning an integer median when the problem expects a float**

   When the total count is even, the median is the average of the two middle elements, which may be a non-integer. Returning integer division (e.g., `(3 + 4) / 2 = 3` instead of `3.5`) is a silent correctness bug. Always use floating-point division for the even-count case.

4. **Sliding window median: not handling heap removal correctly**

   Standard heaps do not support O(log n) arbitrary removal. Using a naive `remove` call on a `std::priority_queue` or Python `heapq` degrades performance to O(n) per deletion. For the sliding window variant, use lazy deletion: maintain a hash map of elements pending deletion, and skip them when they appear at the heap root during future pops.

5. **Allowing `upperHalf` to hold more elements than `lowerHalf`**

   Some implementations allow both heap sizes to be equal or `lowerHalf` to be one larger. Allowing `upperHalf` to be the larger heap (even by one) breaks the convention for the median read formula. Standardize on one convention and enforce it in the rebalance condition consistently.

## Interview Tips

1. **Name the heaps by their role, not their type.** Saying "I have a max-heap for the lower half and a min-heap for the upper half" communicates the invariant immediately. Saying "I have two heaps" forces the interviewer to ask follow-up questions. Lead with the conceptual partition.

2. **Draw the two heaps as two stacks pointing toward each other.** Visually, the max-heap grows upward (root at top) and the min-heap grows downward (root at bottom, closest to the median boundary). Sketching this diagram takes 20 seconds and makes the invariant and median-read formula obvious.

3. **State the three-step algorithm upfront before writing any code.** Say: "Every insertion does three things: route to the correct heap, rebalance so sizes differ by at most one, then read the median from the roots." Writing code before articulating this plan often leads to missing the rebalance step.

4. **Know your language's heap API.** Python's `heapq` is a min-heap only — simulate a max-heap by negating values on push and negating again on pop. Java has `PriorityQueue` (min by default; pass `Collections.reverseOrder()` for max). C++ has `std::priority_queue` (max by default). Clarify your language's convention to the interviewer before using it.

5. **For the sliding window variant, mention lazy deletion proactively.** If the interviewer asks about removing expired elements from the window, explain that naive removal is O(n) and describe lazy deletion as a known technique. Even if you do not fully implement it, showing awareness of this complexity tradeoff demonstrates depth.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `two-heaps` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a typical progression is: find the median from a data stream (core pattern), then sliding window median (adds removal/lazy deletion), then task scheduler with two groups (applies the balancing concept in a non-obvious context).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **K-way Merge** — Also heap-based, K-way Merge uses a single min-heap to merge multiple sorted sequences. Two Heaps uses two heaps to maintain a partition boundary. Both patterns share the discipline of heap-based O(log n) element routing.
- **Sliding Window** — The sliding window median problem combines Two Heaps with the sliding window technique: the window defines which elements are active, and Two Heaps maintains the median within that window efficiently.
