---
name: Top K Elements
slug: top-k-elements
category: heap
difficulty: intermediate
timeComplexity: O(n log k)
spaceComplexity: O(k)
recognitionTips:
  - "Problem asks for K largest, smallest, or most frequent elements"
  - "Need to find the Kth element in a sorted or unsorted collection"
  - "Problem involves maintaining a running top-K as elements arrive"
  - "Need to efficiently track extremes in a large dataset"
commonVariations:
  - "K largest elements (min-heap of size K)"
  - "K smallest elements (max-heap of size K)"
  - "K most frequent elements"
  - "Kth largest in stream"
relatedPatterns: []
keywords: [heap, priority-queue, top-k, kth-largest, frequency]
estimatedTime: 3-4 hours
---

# Top K Elements Pattern

## Overview

The Top K Elements pattern uses a heap (priority queue) to efficiently find the K largest, K smallest, or K most frequent elements from an unsorted collection without fully sorting it. The core insight is a space-time trade-off: instead of sorting all n elements in O(n log n) and slicing off K of them, you maintain a heap of exactly K elements as you scan through the input, processing each new element in O(log k) time. The total cost becomes O(n log k), which is strictly better than O(n log n) when k << n, and uses only O(k) space.

The counterintuitive trick is the choice of heap type. To find the **K largest** elements, you maintain a **min-heap** of size K. The min-heap always evicts its smallest element when a new, larger element arrives — which means whatever remains at the end of the scan is exactly the K largest elements seen. To find the **K smallest** elements, you maintain a **max-heap** of size K by the same symmetric logic.

This pattern is especially powerful in streaming settings where you cannot load all data into memory at once. The heap acts as a sliding "best-K buffer" that processes each element exactly once in O(log k) time. Recognizing that a problem reduces to maintaining a bounded heap is a high-signal interview skill, because it demonstrates knowledge of the right data structure and the reasoning behind its application.

## When to Use

Recognize this pattern when you see:

- The problem asks for the K largest, K smallest, or K most frequent elements from a collection
- The problem asks for the "Kth largest" or "Kth smallest" element (not all K of them, but the boundary element)
- Elements arrive in a stream and you must maintain a running top-K after each insertion
- A full sort would work but seems unnecessarily expensive — the problem only needs the top or bottom K, not a full ordering
- n is large (potentially millions of elements) but K is small (tens or hundreds)
- Keywords in the problem: "top K", "K largest", "K smallest", "Kth largest", "most frequent", "least frequent", "rank"

## Core Technique

**To find K largest elements — use a min-heap of size K:**

1. Push the first K elements into a min-heap.
2. For each remaining element, if it is greater than the heap's minimum (heap top), pop the minimum and push the new element.
3. After scanning all n elements, the heap contains exactly the K largest.

**To find K smallest elements — use a max-heap of size K:**

Same logic with polarity reversed: push into a max-heap, evict the maximum when a smaller element arrives.

**To find K most frequent elements:**

Count element frequencies with a hash map, then apply the min-heap of size K approach on (frequency, element) pairs rather than raw values.

### Pseudocode

**K largest (min-heap of size K):**

```
function kLargest(nums, k):
    minHeap = new MinHeap()

    for num in nums:
        minHeap.push(num)
        if minHeap.size() > k:
            minHeap.pop()  # remove the smallest; keeps the k largest

    return minHeap.toList()
```

**Kth largest only (not all K):**

```
function kthLargest(nums, k):
    result = kLargest(nums, k)
    return minHeap.peek()  # the root of the min-heap is the Kth largest
```

**K most frequent:**

```
function kMostFrequent(nums, k):
    freq = countFrequencies(nums)           # O(n) hash map pass
    minHeap = new MinHeap(keyBy=frequency)

    for (element, count) in freq.entries():
        minHeap.push((count, element))
        if minHeap.size() > k:
            minHeap.pop()                   # evict the least frequent

    return [element for (count, element) in minHeap.toList()]
```

All variants run in O(n log k) time and O(k) space (plus O(n) for the frequency map in the frequency variant).

## Example Walkthrough

### Problem

Given the array `[3, 1, 5, 12, 2, 11]` and K = 3, find the 3 largest elements.

**Expected Output:** `[5, 11, 12]` (order within the result may vary)

### Step-by-Step Min-Heap Trace

We maintain a min-heap of size at most K = 3. After processing each element, the heap holds the K largest values seen so far. The heap root is always the smallest of those K values — making it the easiest to evict when a larger element arrives.

**Process element `3`:**

Heap is empty; push `3`. Size = 1, no eviction needed.

```
Heap (min at top):  [3]
Heap contents:      {3}
```

**Process element `1`:**

Push `1`. Size = 2, no eviction needed.

```
Heap (min at top):  [1, 3]
Heap contents:      {1, 3}
```

**Process element `5`:**

Push `5`. Size = 3, no eviction needed. Heap is now at capacity.

```
Heap (min at top):  [1, 3, 5]
Heap contents:      {1, 3, 5}
```

**Process element `12`:**

Push `12`. Size = 4 > K. Pop the minimum: `1` is evicted.

`12 > 1` (heap minimum), so `12` earns its place. The heap now holds the 3 largest seen so far.

```
Before pop:  [1, 3, 5, 12]
After pop:   [3, 5, 12]
Heap contents: {3, 5, 12}
```

**Process element `2`:**

Push `2`. Size = 4 > K. Pop the minimum: `2` is immediately evicted (it is smaller than all current top-3 candidates).

`2 < 3` (heap minimum), so `2` does not belong in the top 3.

```
Before pop:  [2, 3, 5, 12]
After pop:   [3, 5, 12]
Heap contents: {3, 5, 12}
```

**Process element `11`:**

Push `11`. Size = 4 > K. Pop the minimum: `3` is evicted.

`11 > 3`, so `11` displaces `3` from the top 3.

```
Before pop:  [3, 5, 11, 12]
After pop:   [5, 11, 12]
Heap contents: {5, 11, 12}
```

**Final heap state:**

```
Heap (min at top):  [5, 11, 12]
```

The 3 largest elements are `{5, 11, 12}`. The Kth largest (3rd largest) is the heap root: `5`.

**Full trace summary table:**

```
Element | Action        | Evicted | Heap contents after
--------|---------------|---------|---------------------
3       | push          | —       | {3}
1       | push          | —       | {1, 3}
5       | push          | —       | {1, 3, 5}
12      | push + pop    | 1       | {3, 5, 12}
2       | push + pop    | 2       | {3, 5, 12}
11      | push + pop    | 3       | {5, 11, 12}
```

Each element is pushed once and popped at most once, giving O(log k) per element and O(n log k) total.

## Common Pitfalls

1. **Choosing the wrong heap type.**

   For K largest, use a min-heap. For K smallest, use a max-heap. The most common mistake is reversing these: using a max-heap for K largest would keep evicting the largest element you have seen, leaving you with K smallest instead. The rule to remember: the heap type determines what gets evicted. You evict from the top, so use the heap that puts your "worst" current candidate at the top.

2. **Not maintaining a heap of exactly size K.**

   Some implementations push all n elements into the heap first and then pop K times. This is correct but uses O(n) space instead of O(k), and loses the streaming benefit. The intended approach pushes and immediately pops to keep the heap at size K, maintaining O(k) space throughout. In interviews, confirm whether streaming/space efficiency matters — but the O(k) approach is almost always preferred.

3. **Using a max-heap in languages that only provide max-heaps (like Python's heapq).**

   Python's `heapq` is a min-heap. To simulate a max-heap for K smallest, negate all values before pushing and negate again when popping. Forgetting to negate on both push and pop produces a heap that behaves correctly structurally but returns the wrong sign. Alternatively, for the K most frequent variant, push `(-count, element)` to sort by descending frequency.

4. **Confusing the Kth largest element with the K largest elements.**

   The Kth largest is a single value — the minimum of the K largest, which is the root of the min-heap after processing all elements. The K largest is the full contents of the min-heap. These are related but different outputs. Read the problem statement carefully, and confirm with the interviewer if ambiguous.

5. **Not handling duplicate elements in the frequency variant.**

   When counting frequencies and then building the top-K heap, each (frequency, element) pair must be unique. If two elements have the same frequency, the heap must break ties consistently (e.g., by element value or insertion order, depending on what the problem requires). Using just the frequency as the heap key causes collisions and non-deterministic ordering in many languages.

## Interview Tips

1. **Explain why a min-heap gives you K largest before writing a single line of code.** Say: "I'll use a min-heap of size K. The heap always evicts its smallest element, so after scanning all n elements, whatever remains in the heap is the K largest values. The root of the heap gives me the exact Kth largest." This single explanation demonstrates you understand the pattern deeply, not just that you memorized it.

2. **Compare to sorting upfront.** Sorting is O(n log n) and then slicing is O(k). The heap approach is O(n log k). For k << n this is a significant improvement, and for large streaming inputs sorting is not even feasible. Articulating this trade-off shows you are thinking about practical constraints, not just asymptotic theory.

3. **Know the Quickselect alternative.** Quickselect finds the Kth largest in O(n) average time (O(n²) worst case) by using a partition step similar to quicksort. If an interviewer asks for the theoretically fastest in-memory approach, Quickselect is the answer. The heap approach is preferred in practice because it is O(n log k) worst-case and works on streams, while Quickselect requires all data in memory. Mentioning Quickselect as a known alternative — and why you prefer the heap here — impresses interviewers.

4. **Proactively handle the edge cases.** What if k > n? (Return all elements.) What if k = 1? (A single max or min scan is enough — no heap needed.) What if the array is empty? These take fifteen seconds to mention and prevent you from being caught off-guard by a follow-up.

5. **For the frequency variant, show the two-phase structure.** Phase 1 is always a linear scan to build a frequency map: O(n) time, O(n) space. Phase 2 is the heap pass over the (at most n) unique elements: O(n log k) time, O(k) heap space plus O(n) for the frequency map. Distinguishing the two phases makes your explanation of the complexity clean and unambiguous.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `top-k-elements` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, problems are typically ordered: K largest elements in an array (core pattern, min-heap of size K) before Kth largest element in an array (same structure, return heap root) before K most frequent elements (adds frequency-counting phase) before Kth largest element in a stream (online variant, maintain heap across multiple inserts) before sort characters by frequency (frequency heap with output reconstruction).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Two Heaps** — A close relative that splits elements into two halves using a max-heap and a min-heap simultaneously. Used for problems like finding the running median, where you need fast access to both the lower half's maximum and the upper half's minimum. The Top K Elements pattern is a building block for understanding why two heaps are useful.
- **Sorting** — Full sorting in O(n log n) is the brute-force alternative to the heap approach. For small datasets or when the full sorted order is needed anyway, sorting is simpler. The heap pattern is specifically motivated by cases where k << n and only the top or bottom K matter.
