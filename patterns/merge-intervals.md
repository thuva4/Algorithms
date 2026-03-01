---
name: Merge Intervals
slug: merge-intervals
category: array
difficulty: intermediate
timeComplexity: O(n log n)
spaceComplexity: O(n)
recognitionTips:
  - "Problem involves a list of intervals with start and end times"
  - "Need to find overlapping intervals or gaps between intervals"
  - "Problem asks to merge, insert, or remove intervals"
  - "Scheduling problems (meeting rooms, task scheduling)"
commonVariations:
  - "Merge overlapping intervals"
  - "Insert interval into sorted list"
  - "Find minimum meeting rooms needed"
  - "Find free time slots"
relatedPatterns: []
keywords: [intervals, overlap, merge, scheduling, sort]
estimatedTime: 2-3 hours
---

# Merge Intervals Pattern

## Overview

The Merge Intervals pattern is a technique for processing a collection of intervals — each defined by a start and an end — by first sorting them and then making a single linear pass to combine overlapping or adjacent ranges. The fundamental insight is that two intervals `[a, b]` and `[c, d]` overlap whenever `c <= b` (assuming `a <= c` after sorting). If they overlap, they can be merged into `[a, max(b, d)]`. If they do not overlap, the current interval is complete and you start a new one.

Without sorting, determining which intervals interact requires comparing every pair, giving O(n²) time. Sorting by start time costs O(n log n) but reduces the subsequent merge pass to O(n), because once intervals are sorted you only ever need to compare each new interval against the most recently extended merged interval. The merged interval's end extends as far right as needed, so no interval to the left can ever conflict with one to the right.

This pattern appears across scheduling, calendar, and range-query problems. Recognizing it immediately and applying the sort-then-sweep structure lets you write clean, provably correct solutions under interview pressure without resorting to complex data structures.

## When to Use

Recognize this pattern when you see:

- The input is a list of pairs `[start, end]` (or equivalent objects with a start and end attribute)
- The problem asks you to reduce, combine, or eliminate overlapping ranges
- You need to insert a new interval into an already sorted or unsorted list and re-merge
- The problem involves resources over time: meeting rooms, CPU tasks, calendar events, server load windows
- You need to find gaps (free time slots) between a set of busy intervals
- A brute-force approach would compare every interval against every other interval, giving O(n²) time
- Keywords in the problem: "merge", "overlap", "conflict", "collision", "schedule", "available time", "cover"

## Core Technique

**Step 1 — Sort by start time.** Sort all intervals ascending by their start value. After sorting, any interval that could possibly overlap with interval `i` must appear immediately after it in the sorted order. You never need to look backwards.

**Step 2 — Initialize the result with the first interval.** Place the first sorted interval into a result list. This interval is your current "open" merged interval.

**Step 3 — Sweep and merge.** For each subsequent interval, compare its start against the end of the last interval in the result list:
- If `current.start <= last.end`: they overlap. Extend the last interval's end to `max(last.end, current.end)`.
- If `current.start > last.end`: no overlap. Push the current interval as a new entry in the result list.

**Step 4 — Return the result list.** After the sweep, the result list contains the fully merged intervals.

### Pseudocode

```
function mergeIntervals(intervals):
    if len(intervals) == 0:
        return []

    sort intervals by intervals[i][0]  # sort by start time

    result = [intervals[0]]

    for i from 1 to len(intervals) - 1:
        current = intervals[i]
        last = result[len(result) - 1]

        if current[0] <= last[1]:
            # Overlap: extend the end of the last merged interval
            last[1] = max(last[1], current[1])
        else:
            # No overlap: start a new merged interval
            result.append(current)

    return result
```

The sort is the dominant cost at O(n log n). The single sweep is O(n). Total space is O(n) for the result list (in the worst case, no intervals merge and you return all n intervals).

## Example Walkthrough

### Problem

Given the interval list `[[1,3],[2,6],[8,10],[15,18]]`, merge all overlapping intervals.

**Expected Output:** `[[1,6],[8,10],[15,18]]`

### Step-by-Step Solution

**Step 1 — Sort by start time.**

The input is already sorted by start: `[1,3], [2,6], [8,10], [15,18]`. No reordering needed.

**Step 2 — Initialize with the first interval.**

```
result = [ [1, 3] ]
```

The open merged interval is `[1, 3]`.

**Step 3 — Process `[2, 6]`.**

Compare start of current (`2`) against end of last in result (`3`).

`2 <= 3` — overlap detected.

Extend the end: `max(3, 6) = 6`.

```
result = [ [1, 6] ]
```

Visual state:

```
Input:  [1----3]
        [2---------6]
Merged: [1---------6]
```

**Step 4 — Process `[8, 10]`.**

Compare start of current (`8`) against end of last in result (`6`).

`8 > 6` — no overlap.

Append `[8, 10]` as a new merged interval.

```
result = [ [1, 6], [8, 10] ]
```

Visual state:

```
Merged so far:  [1---------6]
Current:                       [8----10]
                               ^ no overlap, gap of 2
```

**Step 5 — Process `[15, 18]`.**

Compare start of current (`15`) against end of last in result (`10`).

`15 > 10` — no overlap.

Append `[15, 18]` as a new merged interval.

```
result = [ [1, 6], [8, 10], [15, 18] ]
```

Visual state:

```
Merged so far:  [1---------6]   [8----10]
Current:                                    [15------18]
                                            ^ no overlap, gap of 5
```

**Final result:** `[[1,6],[8,10],[15,18]]`

**Summary table:**

```
Step  | Current   | last.end | Overlap? | Action          | Result list
------|-----------|----------|----------|-----------------|---------------------------
init  | [1, 3]    | —        | —        | initialize      | [[1,3]]
1     | [2, 6]    | 3        | YES (2≤3)| extend to 6     | [[1,6]]
2     | [8, 10]   | 6        | NO  (8>6)| append          | [[1,6],[8,10]]
3     | [15, 18]  | 10       | NO (15>10| append          | [[1,6],[8,10],[15,18]]
```

## Common Pitfalls

1. **Forgetting to sort before sweeping.**

   The algorithm is only correct if intervals are processed in ascending order of their start times. If you skip the sort step (perhaps assuming the input is already sorted, which the problem may not guarantee), you will miss overlaps between non-adjacent intervals in the original list. Always sort first — even if the input appears ordered.

2. **Using the wrong end value when extending.**

   When two intervals overlap, the merged end must be `max(last.end, current.end)`, not simply `current.end`. A common mistake is writing `last.end = current.end`, which is wrong when the current interval is entirely contained within the last merged interval (e.g., merging `[1,10]` and `[2,5]` should produce `[1,10]`, not `[1,5]`). Always take the maximum.

3. **Modifying the input list in-place incorrectly.**

   Some implementations try to merge intervals by editing the original array while iterating over it, which can corrupt the iteration or produce duplicates. Build a separate result list, or be very careful about which index you read from and write to if modifying in-place.

4. **Confusing the overlap condition.**

   The condition for overlap is `current.start <= last.end`. Using a strict less-than (`<`) will fail to merge adjacent intervals that share a boundary (e.g., `[1,3]` and `[3,5]` should merge into `[1,5]` because they touch at 3). Check whether the problem treats touching intervals as overlapping (most do) or requires a strict gap.

5. **Not handling the insert-interval variant correctly.**

   When inserting a new interval into an already sorted list, you must first handle all intervals that end before the new interval starts (copy them as-is), then merge all overlapping intervals with the new one, and finally copy all remaining intervals. Trying to use the same sweep logic without this three-phase structure typically produces incorrect results or index-out-of-bounds errors.

## Interview Tips

1. **State the overlap condition explicitly before coding.** Write `overlap iff current.start <= last.end` on your scratch pad. Interviewers want to see that you understand the core invariant. It also protects you from using `<` vs `<=` incorrectly and makes your code easier to read.

2. **Sort by start, break ties by end (descending) if needed.** For most variants, sorting by start alone is sufficient. But for problems that ask you to find the minimum number of intervals to remove to make the rest non-overlapping, tie-breaking by end time (sort by end ascending) matters significantly. Mention this distinction if the interviewer asks about variations.

3. **Draw the number line.** Intervals are fundamentally geometric. Sketching a number line with labeled bars takes thirty seconds and makes every overlap or gap visually obvious. This habit catches edge cases you might miss reasoning purely symbolically.

4. **Know the meeting rooms variation cold.** The "minimum number of meeting rooms" problem is a close relative. Instead of merging intervals, you track how many are simultaneously active — best done with a min-heap of end times or by sweeping sorted start and end times with two pointers. If an interviewer gives you merge-intervals as a warm-up, a follow-up about meeting rooms is extremely common.

5. **Discuss the in-place vs. extra space trade-off.** The clean implementation uses O(n) extra space for the result list. You can merge in-place with careful pointer management, reducing space to O(1) beyond the output, but the code becomes more error-prone. Mentioning this trade-off demonstrates depth even if you implement the simpler version.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `merge-intervals` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, problems are typically ordered: merging overlapping intervals (core) before inserting an interval into a sorted list (requires three-phase logic), before finding the minimum number of meeting rooms (requires a heap or event sweep), before finding employee free time across multiple schedules (combines merge with multi-list processing).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Two Pointers** — The insert-interval variant uses a two-pointer style sweep: one pointer walks left of the insertion zone, another walks through overlapping intervals, and the remainder is appended. Understanding two pointers makes the insert logic feel natural.
- **Sorting** — The sort step is not incidental; it is the foundation that allows the O(n) sweep. Problems that give intervals in a pre-sorted order (e.g., sorted by end time for greedy scheduling) are a related family where the merge logic changes slightly based on what property was sorted.
