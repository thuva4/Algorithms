---
name: In-place Reversal of a LinkedList
slug: in-place-reversal-linkedlist
category: linked-list
difficulty: intermediate
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem asks to reverse a linked list or a portion of it"
  - "Need to rotate a linked list"
  - "Problem involves reversing every K-group of nodes"
  - "Need to reorder nodes without extra memory"
commonVariations:
  - "Reverse entire linked list"
  - "Reverse sublist (positions i to j)"
  - "Reverse every K-group"
  - "Rotate linked list by K"
relatedPatterns: []
keywords: [linked-list, reverse, in-place, prev-curr-next, rotation]
estimatedTime: 2-3 hours
---

# In-place Reversal of a LinkedList Pattern

## Overview

The In-place Reversal of a LinkedList pattern solves problems that require reversing nodes in a singly linked list — either the entire list, a contiguous sublist, or groups of nodes — without allocating any auxiliary data structure. The entire transformation is performed by rearranging `next` pointers directly on the existing nodes.

The foundation is the **three-pointer technique**: three references named `prev`, `curr`, and `next` march through the list in tandem. At each step, `curr.next` is redirected to point backward at `prev`, effectively reversing one link per iteration. After the loop, `prev` sits at the new head of the reversed section.

This pattern matters in interviews because it demonstrates comfort with pointer manipulation and an understanding of in-place algorithms. The brute-force alternative — collecting nodes into an array and reassembling the list — requires O(n) extra space. Mastering the three-pointer dance eliminates that cost entirely and applies to a surprisingly wide range of linked-list problems beyond simple full reversal.

## When to Use This Pattern

Recognize this pattern when you see:

- The problem explicitly asks to reverse a linked list or a segment of it
- You need to modify the node order **without** using an array, stack, or recursion that implicitly uses O(n) space on the call stack
- The problem involves reversing every K consecutive nodes (K-group reversal)
- You need to rotate the list, which reduces to a reversal after finding the right tail
- The problem asks you to reorder the list such that the second half is reversed and interleaved with the first half
- Keywords: "reverse", "rotate", "flip", "mirror", "reorder in-place", "reverse sublist from position i to j"

A useful heuristic: if the problem involves a singly linked list and you think "I wish I could traverse backward," the answer is usually to reverse a portion of the list instead.

## Core Technique

The three-pointer technique reverses a linked list segment in a single pass.

**Pointer roles:**

- `prev` — the node that `curr` should point to after the reversal of its link. Starts as `null` (or the node before the segment).
- `curr` — the node currently being processed. Its `next` pointer is about to be redirected.
- `next` — a temporary save of `curr.next` before it is overwritten, so the traversal can continue.

**Per-iteration steps (order is critical):**

1. Save `next = curr.next` (preserve the forward link before destroying it)
2. Redirect `curr.next = prev` (reverse the link)
3. Advance `prev = curr` (prev catches up)
4. Advance `curr = next` (move forward)

After the loop, `prev` is the new head of the reversed segment.

### Pseudocode

**Reverse entire list:**

```
function reverseList(head):
    prev = null
    curr = head

    while curr is not null:
        next    = curr.next   // 1. save forward link
        curr.next = prev      // 2. reverse the link
        prev    = curr        // 3. advance prev
        curr    = next        // 4. advance curr

    return prev               // prev is now the new head
```

**Reverse a sublist from position i to j (1-indexed):**

```
function reverseSublist(head, i, j):
    dummy = Node(0)
    dummy.next = head
    prevSublist = dummy

    // Walk to the node just before position i
    for step from 1 to i - 1:
        prevSublist = prevSublist.next

    // curr starts at position i (first node to reverse)
    curr = prevSublist.next
    prev = null

    // Reverse (j - i + 1) nodes
    for step from 0 to j - i:
        next      = curr.next
        curr.next = prev
        prev      = curr
        curr      = next

    // Reconnect: the node at position i is now the tail of the reversed segment
    prevSublist.next.next = curr  // old-i node points to node after j
    prevSublist.next      = prev  // node before i points to old-j node (new head)

    return dummy.next
```

**Reverse every K-group:**

```
function reverseKGroup(head, k):
    curr = head
    while curr is not null:
        // Check if k nodes remain
        check = curr
        count = 0
        while check is not null and count < k:
            check = check.next
            count += 1
        if count < k: break   // fewer than k nodes left — do not reverse

        // Reverse k nodes starting at curr
        prev = null
        tail = curr
        for step from 0 to k - 1:
            next      = curr.next
            curr.next = prev
            prev      = curr
            curr      = next

        // prev is new head of this group; tail is its new tail
        // connect tail to the rest (which will be processed recursively/iteratively)
        tail.next = curr
        // caller links previous group's tail to prev
        yield prev as the head of this reversed group
        curr = tail.next   // continue from the node after this group
```

## Example Walkthrough

### Problem

Reverse the singly linked list: `1 -> 2 -> 3 -> 4 -> 5 -> null`

**Expected output:** `5 -> 4 -> 3 -> 2 -> 1 -> null`

### Step-by-step pointer trace

**Initial state:**

```
prev = null
curr = [1] -> [2] -> [3] -> [4] -> [5] -> null
```

**Iteration 1 — process node 1:**

```
next      = curr.next         // next = [2]
curr.next = prev              // [1].next = null
prev      = curr              // prev = [1]
curr      = next              // curr = [2]

State:  null <- [1]    [2] -> [3] -> [4] -> [5] -> null
        prev           curr
```

**Iteration 2 — process node 2:**

```
next      = curr.next         // next = [3]
curr.next = prev              // [2].next = [1]
prev      = curr              // prev = [2]
curr      = next              // curr = [3]

State:  null <- [1] <- [2]    [3] -> [4] -> [5] -> null
                       prev   curr
```

**Iteration 3 — process node 3:**

```
next      = curr.next         // next = [4]
curr.next = prev              // [3].next = [2]
prev      = curr              // prev = [3]
curr      = next              // curr = [4]

State:  null <- [1] <- [2] <- [3]    [4] -> [5] -> null
                              prev   curr
```

**Iteration 4 — process node 4:**

```
next      = curr.next         // next = [5]
curr.next = prev              // [4].next = [3]
prev      = curr              // prev = [4]
curr      = next              // curr = [5]

State:  null <- [1] <- [2] <- [3] <- [4]    [5] -> null
                                     prev   curr
```

**Iteration 5 — process node 5:**

```
next      = curr.next         // next = null
curr.next = prev              // [5].next = [4]
prev      = curr              // prev = [5]
curr      = next              // curr = null

State:  null <- [1] <- [2] <- [3] <- [4] <- [5]
                                             prev   curr = null
```

**Loop ends (curr is null). Return prev.**

**Result:** `5 -> 4 -> 3 -> 2 -> 1 -> null`

Every node was touched exactly once. Time: O(n). Space: O(1) — only three pointer variables were used regardless of list length.

## Common Pitfalls

1. **Saving `next` after overwriting `curr.next`**

   The most common mistake is writing `curr.next = prev` before saving `next = curr.next`. Once you overwrite `curr.next`, the original forward reference is permanently lost and the rest of the list becomes unreachable.

   Always follow the strict order: **save, redirect, advance prev, advance curr.**

2. **Failing to reconnect the reversed segment to the surrounding list**

   For sublist reversal, after the inner loop completes, two stitching operations are required:
   - The node that was at position `i` (now the tail of the reversed segment) must point to the node that was at position `j+1`.
   - The node at position `i-1` (the node before the segment) must point to the node that was at position `j` (now the head of the reversed segment).

   Forgetting either reconnection creates a broken or cyclic list. A dummy head node simplifies this by giving `prevSublist` a safe sentinel when `i = 1`.

3. **Off-by-one errors in sublist boundary traversal**

   When walking to position `i`, counting from 1 vs. 0 causes subtle boundary errors. A common safe approach: use a dummy node at the front, count `i - 1` steps from the dummy, and confirm with a single-element test case (reverse a one-node sublist should return the list unchanged).

4. **Not checking for fewer than K remaining nodes in K-group reversal**

   If the problem specifies that the last group should be left unreversed when it has fewer than K elements, failing to check remaining length before reversing will produce wrong output. Always count K nodes forward before committing to the reversal.

5. **Losing the tail reference in rotation problems**

   Rotating a linked list by K positions usually requires finding the new tail (at position `n - K - 1`) and the new head (at position `n - K`). Forgetting to set `newTail.next = null` leaves the list circular, causing infinite loops in subsequent traversals.

## Interview Tips

1. **Draw the pointers before writing code.** Linked list pointer manipulation is error-prone under pressure. Spend 30-60 seconds sketching a 3-4 node example with labeled arrows for `prev`, `curr`, and `next`. This visualization will catch reconnection bugs before they appear in code.

2. **Use a dummy head node for sublist problems.** When `i = 1`, there is no node before the reversed segment, which creates a special case. A dummy node `{val: 0, next: head}` eliminates this edge case: `prevSublist` always has a node to attach the new segment head to, regardless of where the sublist starts.

3. **Recite the four-step order as a mantra.** Under interview pressure, it is easy to forget to save `next`. Before coding, say aloud: "save next, redirect curr, advance prev, advance curr." Writing these four lines as a comment block first and then filling them in is a reliable strategy.

4. **Handle edge cases explicitly.** State before coding: "If the list is empty or has one node, I'll return head immediately." For sublist reversal: "If i equals j, no reversal is needed." This shows thoroughness and avoids off-by-one crashes on trivial inputs.

5. **Verify with a two-node list.** The minimal non-trivial linked list has two nodes. Tracing through a full reversal of `1 -> 2 -> null` by hand takes under a minute and catches the majority of boundary errors that would appear in longer lists.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `in-place-reversal-linkedlist` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a typical progression is: reverse a full singly linked list (warm-up), then reverse a sublist between positions i and j (introduces reconnection), then reverse every K-group (combines segment reversal with iteration), then rotate a linked list by K positions (reduces to reversal after length calculation).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Two Pointers** — The fast/slow pointer technique is a sibling pattern for linked lists, used to find midpoints, detect cycles, and find the Kth node from the end. In-place reversal pairs naturally with two pointers when you need to find the midpoint of a list before reversing its second half.
- **Sliding Window** — Both patterns use multiple co-moving references to process sequences in a single pass. Sliding window applies to arrays and strings; in-place reversal applies to linked lists. The "save before overwrite" discipline is analogous to tracking window state before updating boundaries.
