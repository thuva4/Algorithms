# Floyd's Cycle Detection

## Overview

Floyd's Cycle Detection algorithm, also known as the "tortoise and hare" algorithm, detects cycles in a sequence of iterated function values. It uses two pointers moving at different speeds: a slow pointer (tortoise) advancing one step at a time, and a fast pointer (hare) advancing two steps. If a cycle exists, the two pointers will eventually meet inside the cycle.

The algorithm is remarkable for its O(1) space complexity -- it detects cycles without using any extra storage for visited nodes. After detecting a cycle, a second phase finds the exact starting position of the cycle.

## How It Works

The algorithm proceeds in two phases:

**Phase 1 -- Cycle Detection:**
1. Initialize both tortoise and hare at the starting position (index 0).
2. Move tortoise one step: `tortoise = next(tortoise)`.
3. Move hare two steps: `hare = next(next(hare))`.
4. If they meet, a cycle exists. If hare reaches the end (-1), no cycle exists.

**Phase 2 -- Find Cycle Start:**
1. Move one pointer back to the start (index 0).
2. Advance both pointers one step at a time.
3. The point where they meet is the start of the cycle.

In this implementation, `arr[i]` represents the next index after position `i`. A value of -1 indicates no next element (end of sequence).

### Example

Given input: `[1, 2, 3, 4, 2]`

Sequence: 0 -> 1 -> 2 -> 3 -> 4 -> 2 -> 3 -> 4 -> ...

**Phase 1 (Detection):**

| Step | Tortoise | Hare |
|------|----------|------|
| 0 | 0 | 0 |
| 1 | 1 | 2 |
| 2 | 2 | 4 |
| 3 | 3 | 3 |

They meet at index 3 (inside the cycle).

**Phase 2 (Find Start):**

| Step | Pointer 1 (from start) | Pointer 2 (from meeting) |
|------|----------------------|------------------------|
| 0 | 0 | 3 |
| 1 | 1 | 4 |
| 2 | 2 | 2 |

They meet at index 2 -- this is the cycle start.

Result: 2

## Pseudocode

```
function detectCycle(arr):
    if length(arr) == 0:
        return -1

    tortoise = 0
    hare = 0

    // Phase 1: Detect cycle
    while true:
        // Move tortoise one step
        if tortoise < 0 or tortoise >= length(arr) or arr[tortoise] == -1:
            return -1
        tortoise = arr[tortoise]

        // Move hare two steps
        if hare < 0 or hare >= length(arr) or arr[hare] == -1:
            return -1
        hare = arr[hare]
        if hare < 0 or hare >= length(arr) or arr[hare] == -1:
            return -1
        hare = arr[hare]

        if tortoise == hare:
            break

    // Phase 2: Find cycle start
    pointer1 = 0
    pointer2 = tortoise
    while pointer1 != pointer2:
        pointer1 = arr[pointer1]
        pointer2 = arr[pointer2]

    return pointer1
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

- **Time -- O(n):** In Phase 1, the hare moves at most 2n steps before meeting the tortoise or reaching the end. In Phase 2, both pointers traverse at most n steps. Total: O(n).
- **Space -- O(1):** Only a constant number of pointer variables are used, regardless of input size. This is the key advantage over hash-set-based cycle detection.

## Applications

- **Linked list cycle detection:** Determine if a linked list contains a cycle and find its entry point.
- **Deadlock detection:** Detect circular wait conditions in operating systems.
- **Random number generators:** Detect periodicity in pseudo-random sequences.
- **Cryptography:** Pollard's rho algorithm for integer factorization uses Floyd's algorithm.
- **Functional iteration:** Detect cycles in iterated function sequences.
- **Memory leak detection:** Identify circular references in garbage collection.

## Implementations

| Language   | File |
|------------|------|
| Python     | [detect_cycle.py](python/detect_cycle.py) |
| Java       | [CycleDetectionFloyd.java](java/CycleDetectionFloyd.java) |
| C++        | [detect_cycle.cpp](cpp/detect_cycle.cpp) |
| C          | [detect_cycle.c](c/detect_cycle.c) |
| Go         | [detect_cycle.go](go/detect_cycle.go) |
| TypeScript | [detectCycle.ts](typescript/detectCycle.ts) |
| Kotlin     | [CycleDetectionFloyd.kt](kotlin/CycleDetectionFloyd.kt) |
| Rust       | [detect_cycle.rs](rust/detect_cycle.rs) |
| Swift      | [CycleDetectionFloyd.swift](swift/CycleDetectionFloyd.swift) |
| Scala      | [CycleDetectionFloyd.scala](scala/CycleDetectionFloyd.scala) |
| C#         | [CycleDetectionFloyd.cs](csharp/CycleDetectionFloyd.cs) |

## References

- Floyd, R. W. (1967). "Nondeterministic Algorithms." *Journal of the ACM*, 14(4), 636-644.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 3.1, Exercise 6.
- [Cycle Detection -- Wikipedia](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)
