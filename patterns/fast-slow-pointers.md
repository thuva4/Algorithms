---
name: Fast and Slow Pointers
slug: fast-slow-pointers
category: linked-list
difficulty: intermediate
timeComplexity: O(n)
spaceComplexity: O(1)
recognitionTips:
  - "Problem involves detecting a cycle in a linked list or array"
  - "Need to find the middle element of a linked list"
  - "Problem asks about repeated numbers in a constrained array"
  - "Need to determine if a structure is circular"
  - "Floyd's cycle detection is applicable"
commonVariations:
  - "Cycle detection (does a cycle exist?)"
  - "Cycle entry point (where does the cycle start?)"
  - "Middle of linked list"
  - "Kth element from end"
relatedPatterns: []
keywords: [linked-list, cycle, floyd, tortoise-hare, middle]
estimatedTime: 2-3 hours
---

# Fast and Slow Pointers Pattern

## Overview

The Fast and Slow Pointers pattern — also called Floyd's Cycle Detection Algorithm, or the Tortoise and Hare algorithm — uses two pointers that traverse a sequence at different speeds. The slow pointer (tortoise) advances one step at a time; the fast pointer (hare) advances two steps at a time.

The fundamental mathematical guarantee is this: **if a cycle exists, the fast pointer will eventually lap the slow pointer and they will meet inside the cycle.** If no cycle exists, the fast pointer will reach the end of the structure (a `null` node) before any meeting occurs. This gives a definitive yes/no answer to cycle existence in O(n) time and, critically, O(1) space — no visited set, no hash map, no auxiliary array of any kind.

Why does the meeting happen? Once both pointers are inside the cycle, think of the distance between them. Each step, the fast pointer closes the gap by one node (it moves two, the slow moves one; net gain: one). If the cycle has length L, after at most L steps the fast pointer catches up to the slow pointer. The total number of steps before both enter the cycle is at most n (the length of the list to the cycle entry). So the entire algorithm is O(n).

The pattern extends beyond simple yes/no cycle detection:

- **Finding the cycle entry point:** After detection, reset one pointer to the head and advance both at speed 1. They meet exactly at the cycle's entry node. This is a consequence of a simple algebraic identity involving the distances traveled.
- **Finding the middle of a linked list:** When the fast pointer reaches the end (or goes null), the slow pointer is at the midpoint. This is because slow has traveled exactly half as far as fast.
- **Finding the kth node from the end:** Advance the fast pointer k steps first, then advance both at speed 1 until fast reaches the end. Slow is then k nodes from the end.

All of these are O(n) time, O(1) space.

## When to Use This Pattern

Recognize this pattern when you see:

- The problem explicitly mentions a **linked list** and asks whether it contains a cycle
- You need to find the **entry point of a cycle** in a linked list or a sequence
- You are asked for the **middle node** of a linked list in one pass
- The problem involves an array where values are in the range `[1, n]` and you need to detect a **repeated number** — such arrays can be treated as implicit linked lists where `arr[i]` is the "next" pointer from index `i`
- The problem asks you to determine whether a sequence of operations is **eventually periodic** (e.g., the Happy Number problem: repeatedly summing digit squares)
- You need the **kth element from the end** of a linked list
- The problem states you must use **O(1) extra space** and the structure is a linked list or can be modeled as one — a hash set of visited nodes would be the obvious but disqualified approach

## Core Technique

Both pointers start at the head of the linked list. At each iteration, slow moves one step and fast moves two steps. The loop continues until either the pointers meet (cycle detected) or fast reaches null (no cycle).

### Pseudocode

**Cycle detection:**

```
function hasCycle(head):
    slow = head
    fast = head

    while fast != null and fast.next != null:
        slow = slow.next          # Tortoise: one step
        fast = fast.next.next     # Hare: two steps

        if slow == fast:
            return true           # Pointers met inside the cycle

    return false                  # Fast reached end; no cycle
```

**Finding the cycle entry point** (run this after detecting a cycle at the meeting node):

```
function cycleEntryPoint(head, meetingNode):
    pointer1 = head
    pointer2 = meetingNode

    while pointer1 != pointer2:
        pointer1 = pointer1.next
        pointer2 = pointer2.next

    return pointer1               # Both arrive at cycle entry simultaneously
```

The mathematical proof: let `F` = distance from head to cycle entry, `C` = cycle length, `a` = distance from cycle entry to meeting point (inside the cycle). When they meet, slow has traveled `F + a` steps and fast has traveled `F + a + C` steps (fast has done one extra full loop). Since fast travels twice as far: `2(F + a) = F + a + C`, which gives `F = C - a`. This means the distance from head to the cycle entry equals the distance from the meeting point back around to the cycle entry — precisely why advancing two pointers at speed 1 from the head and the meeting point causes them to arrive at the entry simultaneously.

**Finding the middle of a linked list:**

```
function findMiddle(head):
    slow = head
    fast = head

    while fast != null and fast.next != null:
        slow = slow.next
        fast = fast.next.next

    return slow                   # Slow is at the middle when fast reaches end
```

For even-length lists, `slow` stops at the second of the two middle nodes. If you need the first middle node, check `fast.next.next` instead of `fast.next` in the condition (problem-dependent).

## Example Walkthrough

### Problem: Cycle Detection

Given the linked list below where node 4 links back to node 2, determine whether a cycle exists and find where it starts.

```
1 -> 2 -> 3 -> 4
          ^    |
          |____|

Nodes: 1 -> 2 -> 3 -> 4 -> (back to 2)
```

The list has nodes: 1, 2, 3, 4, and a back-edge from 4 to 2. The cycle is 2 -> 3 -> 4 -> 2 (length 3). The cycle entry is node 2.

**Initial state:**

```
Position:   1    2    3    4   (-> back to 2)
            S                    slow = node 1
            F                    fast = node 1
```

**Step 1 — slow moves 1, fast moves 2:**

```
slow = slow.next      -> node 2
fast = fast.next.next -> node 3

Position:   1    2    3    4
                 S    F
slow = node 2,  fast = node 3   (not equal, continue)
```

**Step 2 — slow moves 1, fast moves 2:**

```
slow = slow.next      -> node 3
fast = fast.next.next -> node 2  (4's next is 2, so fast: 4 -> 2)

Position:   1    2    3    4
                 F    S
slow = node 3,  fast = node 2   (not equal, continue)
```

**Step 3 — slow moves 1, fast moves 2:**

```
slow = slow.next      -> node 4
fast = fast.next.next -> node 4  (2 -> 3 -> 4)

Position:   1    2    3    4
                      SF
slow = node 4,  fast = node 4   (EQUAL -- cycle detected!)
```

Cycle detected. Meeting point is **node 4**.

**Step-by-step table:**

```
Step  slow  fast  slow.val  fast.val  Equal?
----  ----  ----  --------  --------  ------
  0    1     1       1          1      (start, skip check)
  1    2     3       2          3      No
  2    3     2       3          2      No
  3    4     4       4          4      YES -- cycle detected
```

**Finding the cycle entry point:**

Reset `pointer1` to head (node 1). Keep `pointer2` at meeting point (node 4). Advance both by 1 each step:

```
Step  pointer1  pointer2
----  --------  --------
  0      1          4
  1      2          2      (pointer2: 4 -> 2, pointer1: 1 -> 2)  EQUAL
```

Both reach **node 2** simultaneously. The cycle entry is **node 2**. This matches the list structure (4 loops back to 2).

## Common Pitfalls

1. **Not checking `fast != null AND fast.next != null` before advancing**

   - Problem: Calling `fast.next.next` when `fast` is already null, or when `fast.next` is null, causes a null pointer exception. This is the most common implementation bug with this pattern.
   - Solution: The loop guard must be `while fast != null and fast.next != null`. Both conditions are necessary. For cycle entry detection after the meeting, the loop is simpler (`while pointer1 != pointer2`) because you are already inside the cycle or guaranteed both pointers will meet.

2. **Starting slow and fast at different positions**

   - Problem: Starting `fast = head.next` instead of `fast = head` (or vice versa) breaks the mathematical proof for cycle entry detection and middle-finding. The meeting-point analysis assumes both pointers start at the head.
   - Solution: Always initialize both `slow = head` and `fast = head`. If the loop immediately checks equality before moving, add a pre-move step or use a `do-while` style loop that moves first. The cleanest approach is to move both before checking equality inside the loop body, which is what the pseudocode above does.

3. **Confusing middle-finding behavior for even-length lists**

   - Problem: For a 4-node list `[1, 2, 3, 4]`, the slow pointer lands on node 3 (the second middle). Some problems require node 2 (the first middle), e.g., when splitting the list for merge sort. Using the wrong node as the "middle" corrupts the split.
   - Solution: Clarify with the interviewer which middle is needed. To land on the first middle of an even-length list, change the loop condition to `while fast.next != null and fast.next.next != null`. Trace both variants on a 4-node example to verify before submitting.

## Interview Tips

1. **Explain the tortoise and hare analogy before diving into code.** Say: "The fast pointer laps the slow pointer if a cycle exists, just like a faster runner on a circular track will eventually overtake a slower one." This immediately communicates that you understand the intuition, not just the mechanics.

2. **Know the cycle entry point proof.** Many interviewers follow up cycle detection with "can you also find where the cycle starts?" Memorize the one-sentence explanation: "After meeting, the distance from the meeting point back to the entry equals the distance from the head to the entry, so we advance two pointers at the same speed from the head and meeting point and they collide at the entry." You do not need to derive the algebra from scratch under pressure — just know the claim and why it works at a high level.

3. **Practice the middle-finding variant separately.** It shares the same structure but the termination condition is different (no cycle exists; fast reaches null). Mixing up when to stop is a common source of bugs. In an interview, trace through a 5-node (odd) and a 4-node (even) list to confirm your condition.

4. **Recognize the Happy Number and similar problems as disguised cycle detection.** When a problem asks whether some iterative process eventually repeats or loops forever, model it as a sequence and apply fast/slow pointers. This is non-obvious and impresses interviewers who expect a hash set solution.

5. **State the O(1) space advantage explicitly.** The naive approach to cycle detection is to store every visited node in a hash set and check for membership — O(n) space. Fast and slow pointers achieve the same result in O(1) space. Pointing this out demonstrates you understand the pattern's value, not just its implementation.

## Practice Progression

This section is auto-populated from algorithms in this repository that are tagged with the `fast-slow-pointers` pattern. As more algorithms are added and linked, they will appear here organized by difficulty.

For external practice, a recommended ordering is: Linked List Cycle (yes/no detection) before Linked List Cycle II (find the entry node) before Middle of the Linked List before Happy Number (non-linked-list application) before Find the Duplicate Number (array modeled as linked list, requires proving the reduction to cycle detection).

## Related Patterns

No related patterns are linked yet. As additional patterns are added to this repository, the following connections will be documented:

- **Two Pointers** — Fast and slow pointers is a specialization of the same-direction two-pointer technique. In the general two-pointer pattern applied to arrays, slow and fast typically advance by 1 (with fast skipping invalid elements). In the fast-and-slow variant, the speed ratio is exactly 2:1, and this fixed ratio is what produces the cycle-detection and midpoint-finding mathematical properties. See the Two Pointers pattern for the broader technique.
