# Linked List Operations

## Overview

A singly linked list is a linear data structure where each element (node) contains a value and a pointer to the next node in the sequence. Unlike arrays, linked lists do not require contiguous memory allocation, making insertions and deletions efficient at known positions. This module implements core linked list operations: insertion, deletion, reversal, cycle detection, and finding the middle element.

The primary function exposed for the test runner is `reverse_linked_list`, which takes an array representation of a linked list, builds an actual linked list, reverses it in place, and returns the result as an array.

## How It Works

### Reversal (Iterative)

The reversal algorithm uses three pointers to reverse the direction of all `next` pointers in a single pass:

1. Initialize `prev` to null, `current` to the head of the list.
2. For each node, save its `next` pointer, point its `next` to `prev`, then advance `prev` and `current` forward.
3. When `current` becomes null, `prev` is the new head of the reversed list.

### Example

Given input: `[1, 2, 3, 4, 5]`

Build linked list: `1 -> 2 -> 3 -> 4 -> 5 -> null`

| Step | prev | current | current.next (saved) | Action |
|------|------|---------|---------------------|--------|
| 1 | null | 1 | 2 | Point 1.next to null |
| 2 | 1 | 2 | 3 | Point 2.next to 1 |
| 3 | 2 | 3 | 4 | Point 3.next to 2 |
| 4 | 3 | 4 | 5 | Point 4.next to 3 |
| 5 | 4 | 5 | null | Point 5.next to 4 |

Result: `5 -> 4 -> 3 -> 2 -> 1 -> null`

Output: `[5, 4, 3, 2, 1]`

### Other Operations (Included in Implementations)

- **Insert at head**: Create a new node, point its `next` to the current head, update head. O(1).
- **Delete by value**: Traverse to find the node, update the previous node's `next` pointer. O(n).
- **Find middle**: Use two pointers -- slow advances one step, fast advances two steps. When fast reaches the end, slow is at the middle. O(n).
- **Detect cycle**: Floyd's cycle detection -- slow pointer moves one step, fast pointer moves two steps. If they meet, a cycle exists. O(n).

## Pseudocode

```
function reverseLinkedList(array):
    head = buildLinkedList(array)

    prev = null
    current = head

    while current is not null:
        next = current.next
        current.next = prev
        prev = current
        current = next

    return toArray(prev)
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** An empty or single-element list requires no work to reverse.

- **Average/Worst Case -- O(n):** The algorithm must visit every node exactly once to reverse all pointers. There is no way to reverse a linked list without examining each node.

- **Space -- O(1):** The reversal is done in place using only three pointer variables (`prev`, `current`, `next`), regardless of list size. The array-to-list and list-to-array conversions use O(n) space, but the core reversal algorithm itself is O(1) auxiliary space.

## Applications

- **Undo/Redo systems**: Linked lists naturally support sequential operations with efficient insertion and deletion at both ends.
- **Memory allocation**: Operating systems use linked lists (free lists) to track available memory blocks.
- **Polynomial arithmetic**: Each term of a polynomial can be stored as a node, enabling efficient addition and multiplication.
- **Music playlists**: Linked lists are used to implement playlist navigation (next/previous track).
- **Browser history**: Forward and backward navigation is implemented using linked list principles.
- **Hash table chaining**: Separate chaining collision resolution uses linked lists at each bucket.

## Comparison with Similar Structures

| Structure       | Access | Insert (head) | Delete (head) | Search | Notes |
|----------------|--------|--------------|---------------|--------|-------|
| Singly Linked List | O(n) | O(1) | O(1) | O(n) | Simple, forward traversal only |
| Doubly Linked List | O(n) | O(1) | O(1) | O(n) | Bidirectional traversal, more memory |
| Array | O(1) | O(n) | O(n) | O(n) | Random access, costly insertions |
| Dynamic Array | O(1) | O(n) | O(n) | O(n) | Amortized O(1) append |

## Implementations

| Language   | File |
|------------|------|
| Python     | [reverse_linked_list.py](python/reverse_linked_list.py) |
| Java       | [ReverseLinkedList.java](java/ReverseLinkedList.java) |
| C++        | [reverse_linked_list.cpp](cpp/reverse_linked_list.cpp) |
| C          | [reverse_linked_list.c](c/reverse_linked_list.c) |
| Go         | [reverse_linked_list.go](go/reverse_linked_list.go) |
| TypeScript | [reverseLinkedList.ts](typescript/reverseLinkedList.ts) |
| Rust       | [reverse_linked_list.rs](rust/reverse_linked_list.rs) |
| Kotlin     | [ReverseLinkedList.kt](kotlin/ReverseLinkedList.kt) |
| Swift      | [ReverseLinkedList.swift](swift/ReverseLinkedList.swift) |
| Scala      | [ReverseLinkedList.scala](scala/ReverseLinkedList.scala) |
| C#         | [ReverseLinkedList.cs](csharp/ReverseLinkedList.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 10: Elementary Data Structures.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley. Section 2.2: Linear Lists.
- [Linked List -- Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
