# Cycle Sort

## Overview

Cycle Sort is a comparison-based, in-place sorting algorithm that is theoretically optimal in terms of the number of writes to memory. It is based on the idea that any permutation can be decomposed into cycles, and each cycle can be rotated to place elements in their correct positions. The algorithm minimizes the total number of writes to the array, making each write place an element in its final sorted position.

Cycle Sort is notable because it performs at most n - 1 writes in the worst case, which is the minimum possible for any in-place sorting algorithm. This property makes it uniquely valuable when writes to memory are extremely expensive, such as with flash memory or EEPROM where write cycles cause physical wear. However, its O(n^2) time complexity limits its use to small datasets or write-constrained environments.

## How It Works

Cycle Sort works by examining each element and determining its correct final position by counting how many elements in the array are smaller than it. If an element is not already in its correct position, it is placed there, displacing the element that was in that position. The displaced element is then placed in its correct position, and this process continues until the cycle returns to the starting position. Each "cycle" is completed before moving on to the next starting element.

### Example

Given input: `[5, 3, 8, 1, 2]`

**Cycle 1:** Start with element `5` at index 0

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Count elements smaller than `5`: `3, 1, 2` = 3 elements | Position for `5` is index 3 |
| 2 | Place `5` at index 3, take out `1` | `[_, 3, 8, 5, 2]`, displaced: `1` |
| 3 | Count elements smaller than `1`: none = 0 elements | Position for `1` is index 0 |
| 4 | Place `1` at index 0, cycle complete | `[1, 3, 8, 5, 2]` |

End of Cycle 1: `[1, 3, 8, 5, 2]` -- `1` and `5` are in their final positions.

**Cycle 2:** Start with element `3` at index 1

| Step | Action | Array State |
|------|--------|-------------|
| 1 | Count elements smaller than `3`: `1, 2` = 2 elements | Position for `3` is index 2 |
| 2 | Place `3` at index 2, take out `8` | `[1, _, 3, 5, 2]`, displaced: `8` |
| 3 | Count elements smaller than `8`: `1, 3, 5, 2` = 4 elements | Position for `8` is index 4 |
| 4 | Place `8` at index 4, take out `2` | `[1, _, 3, 5, 8]`, displaced: `2` |
| 5 | Count elements smaller than `2`: `1` = 1 element | Position for `2` is index 1 |
| 6 | Place `2` at index 1, cycle complete | `[1, 2, 3, 5, 8]` |

End of Cycle 2: `[1, 2, 3, 5, 8]` -- All remaining elements are in their final positions.

**Cycles 3-4:** Starting at indices 2, 3, and 4, each element is already in its correct position, so no writes are needed.

Result: `[1, 2, 3, 5, 8]`

## Pseudocode

```
function cycleSort(array):
    n = length(array)
    writes = 0

    for cycleStart from 0 to n - 2:
        item = array[cycleStart]

        // Find the correct position for this item
        pos = cycleStart
        for i from cycleStart + 1 to n - 1:
            if array[i] < item:
                pos = pos + 1

        // If the item is already in the correct position, skip
        if pos == cycleStart:
            continue

        // Handle duplicates: skip past any equal elements
        while item == array[pos]:
            pos = pos + 1

        // Place the item in its correct position
        swap item with array[pos]
        writes = writes + 1

        // Rotate the rest of the cycle
        while pos != cycleStart:
            pos = cycleStart
            for i from cycleStart + 1 to n - 1:
                if array[i] < item:
                    pos = pos + 1

            while item == array[pos]:
                pos = pos + 1

            swap item with array[pos]
            writes = writes + 1

    return array
```

The duplicate handling (skipping past equal elements) is critical for correctness. Without it, the algorithm could enter an infinite loop when the array contains duplicate values. The `writes` counter tracks the total number of memory writes, which is always minimized.

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n^2) | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n^2):** Even when the array is already sorted (zero writes needed), Cycle Sort must still count the number of elements smaller than each element to determine that it is already in the correct position. For each of the n elements, this counting step scans the remaining array, giving approximately n + (n-1) + ... + 1 = n(n-1)/2 comparisons, which is O(n^2).

- **Average Case -- O(n^2):** For each starting position, the algorithm counts elements smaller than the current item, which requires scanning all subsequent elements. This scanning cost dominates the running time regardless of the number of cycles or swaps. The total number of comparisons is always n(n-1)/2, giving O(n^2).

- **Worst Case -- O(n^2):** The comparison count is the same in all cases: n(n-1)/2. What varies is the number of writes (at most n - 1), but since writes are constant-time operations and comparisons dominate, the time complexity is always O(n^2).

- **Space -- O(1):** Cycle Sort is an in-place sorting algorithm. It only requires a constant amount of extra space for the current item being placed, the position counter, and loop variables. No additional arrays or data structures are needed.

## When to Use

- **When minimizing writes is critical:** Cycle Sort makes the minimum possible number of writes to sort an array (at most n - 1). This is essential for storage media with limited write endurance, such as flash memory (SSD), EEPROM, or other non-volatile memory where each write cycle degrades the medium.
- **Small datasets with expensive writes:** For small arrays where the O(n^2) time is acceptable but write operations are costly.
- **Counting the minimum number of swaps:** Cycle Sort naturally computes the minimum number of element movements needed to sort an array, which is useful in permutation analysis.
- **When every write must place an element in its final position:** Unlike other sorting algorithms that may move elements multiple times, every write in Cycle Sort is a final placement.

## When NOT to Use

- **Large datasets:** The O(n^2) time complexity in all cases makes Cycle Sort impractical for any significant input size, regardless of the initial order.
- **When writes are cheap:** If memory writes are not a bottleneck (which is the case for most RAM-based applications), the write optimization provides no benefit, and faster algorithms should be used.
- **When stability is required:** Cycle Sort is not stable. The cycle rotation process can change the relative order of equal elements.
- **Nearly sorted data:** Unlike Insertion Sort, Cycle Sort cannot take advantage of existing order. It always performs O(n^2) comparisons regardless of the input arrangement.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space    | Stable | Notes                                       |
|----------------|-----------|----------|--------|---------------------------------------------|
| Cycle Sort     | O(n^2)    | O(1)     | No     | Minimum writes; optimal for write-limited media |
| Selection Sort | O(n^2)    | O(1)     | No     | At most n-1 swaps but not minimum writes     |
| Insertion Sort | O(n^2)    | O(1)     | Yes    | Adaptive; better for nearly sorted data      |
| Bubble Sort    | O(n^2)    | O(1)     | Yes    | Many more swaps; simpler logic               |

## Implementations

| Language   | File |
|------------|------|
| Python     | [cycle_sort.py](python/cycle_sort.py) |
| Java       | [CycleSort.java](java/CycleSort.java) |
| C++        | [cycle_sort.cpp](cpp/cycle_sort.cpp) |
| C          | [cycle_sort.c](c/cycle_sort.c) |
| Go         | [cycle_sort.go](go/cycle_sort.go) |
| TypeScript | [cycleSort.ts](typescript/cycleSort.ts) |
| Kotlin     | [CycleSort.kt](kotlin/CycleSort.kt) |
| Rust       | [cycle_sort.rs](rust/cycle_sort.rs) |
| Swift      | [CycleSort.swift](swift/CycleSort.swift) |
| Scala      | [CycleSort.scala](scala/CycleSort.scala) |
| C#         | [CycleSort.cs](csharp/CycleSort.cs) |

## References

- Haddon, B. K. (1990). "Cycle-sort: A Linear Sorting Method." *The Computer Journal*, 33(4), 365-367.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2: Internal Sorting.
- [Cycle Sort -- Wikipedia](https://en.wikipedia.org/wiki/Cycle_sort)
