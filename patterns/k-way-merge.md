---
name: K-way Merge
slug: k-way-merge
category: heap
difficulty: advanced
timeComplexity: O(n log k)
spaceComplexity: O(k)
recognitionTips:
  - "Problem involves merging K sorted arrays, lists, or streams"
  - "Need to find the smallest range covering elements from K lists"
  - "Problem involves finding Kth smallest across multiple sorted arrays"
  - "Need to merge K sorted linked lists efficiently"
commonVariations:
  - "Merge K sorted lists"
  - "Kth smallest in M sorted lists"
  - "Smallest range covering K lists"
relatedPatterns: []
keywords: [heap, merge, sorted, k-lists, min-heap, multi-way]
estimatedTime: 3-4 hours
---

# K-way Merge Pattern

## Overview

The K-way Merge pattern efficiently merges `K` sorted sequences — arrays, linked lists, or streams — into a single sorted output. The naive approach of concatenating all sequences and sorting them costs O(n log n) where `n` is the total number of elements. K-way Merge reduces this to **O(n log k)** by exploiting the fact that each input sequence is already sorted: you never need to compare every element against every other element. You only need to compare the current front elements of the K sequences.

The mechanism is a **min-heap of size K**. Each heap entry represents the "current candidate" from one of the K sequences: the smallest remaining element from that sequence. At each step, the global minimum across all K sequences is always the heap root. You extract it, emit it to the output, and push the next element from the same sequence. This way, the heap always contains exactly one element per active sequence, maintaining O(k) space regardless of n.

**Why O(n log k)?** Each of the `n` total elements is pushed into and popped from the heap exactly once. Each heap operation costs O(log k) because the heap size never exceeds K. Total: O(n log k).

This pattern generalizes beyond simple merging. Any problem that requires tracking the minimum (or maximum) across K sorted frontiers — finding the Kth smallest element across K sorted arrays, finding the smallest range that covers at least one element from each list — reduces to a K-way Merge variant.

## When to Use This Pattern

Recognize this pattern when you see:

- The input is K sorted arrays, linked lists, or sorted streams, and you need to process or merge them in sorted order
- The problem asks for the **Kth smallest (or largest) element** across multiple sorted arrays
- You need to find the **smallest range** such that the range contains at least one element from each of K sorted lists
- Merging two sorted arrays (the two-pointer merge step of merge sort) is clearly insufficient because K > 2
- A brute-force solution would sort everything together: "sort all n elements across all K lists"
- Keywords: "K sorted", "merge lists", "sorted streams", "smallest element from each list", "overall Kth smallest"

A useful heuristic: if you would naturally write K separate pointers each pointing into a separate sorted list, and at each step you need the globally smallest among those K pointed-at values, replace those K pointers with a min-heap.

## Core Technique

**Heap entry structure:** Each entry in the min-heap stores three values: `(value, listIndex, elementIndex)`. The heap is ordered by `value`. `listIndex` tells you which input list to advance, and `elementIndex` tells you the current position within that list.

**Algorithm:**

1. **Initialize:** Push the first element from each of the K lists into the min-heap. If a list is empty, skip it.
2. **Extract-push loop:** While the heap is non-empty:
   - Pop the minimum entry `(value, listIndex, elementIndex)` from the heap.
   - Emit `value` to the output (or record it for Kth-element counting).
   - If `elementIndex + 1 < len(lists[listIndex])`, push `(lists[listIndex][elementIndex + 1], listIndex, elementIndex + 1)` to the heap.
3. **Terminate:** When the heap is empty, all elements have been processed in sorted order.

### Pseudocode

**Merge K sorted arrays:**

```
function mergeKSortedArrays(lists):
    minHeap = MinHeap()
    result  = []

    // Step 1: seed the heap with the first element of each list
    for i from 0 to len(lists) - 1:
        if lists[i] is not empty:
            minHeap.push( (lists[i][0], i, 0) )

    // Step 2: extract-push loop
    while minHeap is not empty:
        (value, listIdx, elemIdx) = minHeap.pop()
        result.append(value)

        nextElemIdx = elemIdx + 1
        if nextElemIdx < len(lists[listIdx]):
            minHeap.push( (lists[listIdx][nextElemIdx], listIdx, nextElemIdx) )

    return result
```

**Find Kth smallest across K sorted arrays:**

```
function kthSmallest(lists, k):
    minHeap = MinHeap()
    count   = 0

    for i from 0 to len(lists) - 1:
        if lists[i] is not empty:
            minHeap.push( (lists[i][0], i, 0) )

    while minHeap is not empty:
        (value, listIdx, elemIdx) = minHeap.pop()
        count += 1
        if count == k:
            return value

        nextElemIdx = elemIdx + 1
        if nextElemIdx < len(lists[listIdx]):
            minHeap.push( (lists[listIdx][nextElemIdx], listIdx, nextElemIdx) )

    return -1   // k is out of range
```

**Merge K sorted linked lists:**

```
function mergeKLinkedLists(listHeads):
    minHeap = MinHeap()
    dummy   = Node(0)
    tail    = dummy

    for head in listHeads:
        if head is not null:
            minHeap.push( (head.val, head) )   // store node reference directly

    while minHeap is not empty:
        (value, node) = minHeap.pop()
        tail.next = node
        tail      = tail.next
        if node.next is not null:
            minHeap.push( (node.next.val, node.next) )

    return dummy.next
```

## Example Walkthrough

### Problem

Merge three sorted arrays: `[[1, 4, 5], [1, 3, 4], [2, 6]]`

**Expected output:** `[1, 1, 2, 3, 4, 4, 5, 6]`

### Step-by-step heap trace

**Initialization — push first element from each list:**

```
Heap after init: [(1, list=0, idx=0), (1, list=1, idx=0), (2, list=2, idx=0)]
                   ^min
Output: []
```

(Heap shown as sorted for clarity; internally it is a binary heap.)

**Extraction 1 — pop (1, list=0, idx=0):**

```
Pop:  value=1 from list 0, idx 0
Push: list[0][1] = 4  →  (4, list=0, idx=1)

Heap: [(1, list=1, idx=0), (2, list=2, idx=0), (4, list=0, idx=1)]
Output: [1]
```

**Extraction 2 — pop (1, list=1, idx=0):**

```
Pop:  value=1 from list 1, idx 0
Push: list[1][1] = 3  →  (3, list=1, idx=1)

Heap: [(2, list=2, idx=0), (3, list=1, idx=1), (4, list=0, idx=1)]
Output: [1, 1]
```

**Extraction 3 — pop (2, list=2, idx=0):**

```
Pop:  value=2 from list 2, idx 0
Push: list[2][1] = 6  →  (6, list=2, idx=1)

Heap: [(3, list=1, idx=1), (4, list=0, idx=1), (6, list=2, idx=1)]
Output: [1, 1, 2]
```

**Extraction 4 — pop (3, list=1, idx=1):**

```
Pop:  value=3 from list 1, idx 1
Push: list[1][2] = 4  →  (4, list=1, idx=2)

Heap: [(4, list=0, idx=1), (4, list=1, idx=2), (6, list=2, idx=1)]
Output: [1, 1, 2, 3]
```

**Extraction 5 — pop (4, list=0, idx=1):**

```
Pop:  value=4 from list 0, idx 1
Push: list[0][2] = 5  →  (5, list=0, idx=2)

Heap: [(4, list=1, idx=2), (5, list=0, idx=2), (6, list=2, idx=1)]
Output: [1, 1, 2, 3, 4]
```

**Extraction 6 — pop (4, list=1, idx=2):**

```
Pop:  value=4 from list 1, idx 2
Push: list[1][3] = out of bounds — do not push

Heap: [(5, list=0, idx=2), (6, list=2, idx=1)]
Output: [1, 1, 2, 3, 4, 4]
```

**Extraction 7 — pop (5, list=0, idx=2):**

```
Pop:  value=5 from list 0, idx 2
Push: list[0][3] = out of bounds — do not push

Heap: [(6, list=2, idx=1)]
Output: [1, 1, 2, 3, 4, 4, 5]
```

**Extraction 8 — pop (6, list=2, idx=1):**

```
Pop:  value=6 from list 2, idx 1
Push: list[2][2] = out of bounds — do not push

Heap: [] (empty)
Output: [1, 1, 2, 3, 4, 4, 5, 6]
```

**Result:** `[1, 1, 2, 3, 4, 4, 5, 6]`. 8 extractions for 8 total elements. Heap size never exceeded 3 (= K).

## Common Pitfalls

1. **Seeding the heap with duplicate values from different lists**

   When two lists share the same first element (as in this example: both list 0 and list 1 start with 1), both must be pushed into the heap independently. A common mistake is deduplicating on insertion, which would skip a list entirely and produce incorrect output. Each list is always represented by at most one entry in the heap, but identical values from different lists are legitimate distinct entries.

2. **Not storing the list index and element index in the heap entry**

   After extracting the minimum, you must know which list and which position to advance. Storing only the value is insufficient. A heap entry must carry enough context to fetch the next element: for arrays, `(value, listIndex, elementIndex)`; for linked lists, `(value, nodeReference)`.

3. **Heap entry comparison ambiguity when values are equal**

   Most heap implementations compare tuples lexicographically. If two entries have equal `value`, the heap compares the second field (`listIndex`). In Python, this is fine as long as `listIndex` (an int) is comparable. In Java/C++, custom comparators must handle ties explicitly. A common bug is storing non-comparable objects (e.g., linked list nodes) as the second tuple field in Python, causing a `TypeError` when values tie.

4. **Forgetting to handle empty input lists**

   If any of the K input lists is empty, attempting to access `lists[i][0]` raises an index error. The initialization step must check `if lists[i]` (or `if lists[i] is not empty`) before pushing. Similarly, for linked lists, skip null heads during initialization.

5. **Confusing Kth-smallest with "K-way merge output at position K"**

   For the Kth-smallest problem, you run the extract-push loop and count extractions. The Kth extraction is the Kth smallest element globally. A common mistake is confusing this with "the element at index K-1 in any individual list." The heap guarantees global sorted order across all lists, so counting extractions gives the correct global rank.

## Interview Tips

1. **Lead with the heap size insight.** Before any code, say: "The heap will always contain at most K elements — one per active list. This gives O(k) space and O(log k) per extraction, leading to O(n log k) total." Stating the complexity argument upfront demonstrates that you understand the pattern, not just the mechanics.

2. **Contrast with the naive approach explicitly.** Briefly mention: "A naive solution would concatenate all lists and sort them in O(n log n). K-way Merge improves this to O(n log k) by reusing the sorted order already present in each list." This framing shows algorithmic thinking.

3. **Clarify the heap entry structure before coding.** Ask yourself (or say aloud): "What does each heap entry need to contain?" For arrays: value, list index, element index. For linked lists: value, node reference. Establish this before writing the loop — it is the most common source of bugs.

4. **Handle the linked list variant with a dummy head node.** The same dummy-node technique from linked list problems applies here: create a `dummy` node and a `tail` pointer. Attach each extracted node to `tail.next` and advance `tail`. Return `dummy.next` at the end. This avoids special-casing the first node.

5. **Discuss the smallest-range variation if time permits.** For "smallest range covering K lists," the approach is a sliding window over the K-way merge output: maintain the current max seen across K lists, extract the min from the heap, and check if `[currentMin, currentMax]` is the best range. Mentioning this extension shows you understand the broader applicability of the pattern.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `k-way-merge` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a typical progression is: merge K sorted linked lists (core pattern, no index tracking needed), then Kth smallest in M sorted arrays (adds counting logic), then smallest range covering elements from K lists (combines K-way merge with a sliding window and a running max tracker).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Two Heaps** — Both patterns use priority queues as their core data structure, but with different invariants. Two Heaps maintains a partition boundary between two halves of a dataset; K-way Merge uses a single min-heap to track K sorted frontiers. The heap-entry discipline (storing context alongside the value) is shared.
- **Merge Sort** — The merge step of merge sort is a 2-way merge. K-way Merge generalizes this to K inputs. Understanding merge sort's merge step is prerequisite knowledge for K-way Merge.
- **Top K Elements** — Both patterns frequently use heaps and involve ranking. Top K Elements uses a heap of fixed size K to track the K largest/smallest seen so far; K-way Merge uses a heap of fixed size K as a routing mechanism across K sorted sources.
