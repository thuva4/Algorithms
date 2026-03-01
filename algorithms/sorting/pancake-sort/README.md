# Pancake Sort

## Overview

Pancake Sort is a sorting algorithm in which the only allowed operation is a "pancake flip" -- reversing the order of the first k elements of the array. The algorithm is named after the analogous problem of sorting a stack of pancakes by size using only a spatula that can flip the top portion of the stack. The goal is to sort the entire array using a sequence of such prefix reversals.

The pancake sorting problem was first posed by Jacob E. Goodman under the pseudonym "Harry Dweighter" (a play on "harried waiter") in 1975. Bill Gates (co-founder of Microsoft) co-authored one of the first papers on the problem, establishing upper bounds on the number of flips required. The problem remains of theoretical interest because the exact number of flips needed for the worst case is still an open question for large n.

## How It Works

1. For each position from `n` down to `2` (where `n` is the array length):
   - Find the index of the maximum element in the unsorted portion (indices 0 to current position - 1).
   - If the maximum is not already at the correct position:
     - If the maximum is not at index 0, flip the prefix from 0 to the maximum's index, bringing the maximum to position 0.
     - Flip the prefix from 0 to the current position - 1, placing the maximum in its correct final position.
2. After processing all positions, the array is sorted.

## Worked Example

Given input: `[3, 1, 5, 2, 4]`

**Iteration 1** (place max in position 4):
- Unsorted portion: `[3, 1, 5, 2, 4]` (indices 0-4). Max is 5 at index 2.
- Flip(0..2): `[5, 1, 3, 2, 4]` -- bring 5 to front.
- Flip(0..4): `[4, 2, 3, 1, 5]` -- place 5 at index 4.

**Iteration 2** (place max in position 3):
- Unsorted portion: `[4, 2, 3, 1]` (indices 0-3). Max is 4 at index 0.
- 4 is already at index 0, so just flip(0..3): `[1, 3, 2, 4, 5]` -- place 4 at index 3.

**Iteration 3** (place max in position 2):
- Unsorted portion: `[1, 3, 2]` (indices 0-2). Max is 3 at index 1.
- Flip(0..1): `[3, 1, 2, 4, 5]` -- bring 3 to front.
- Flip(0..2): `[2, 1, 3, 4, 5]` -- place 3 at index 2.

**Iteration 4** (place max in position 1):
- Unsorted portion: `[2, 1]` (indices 0-1). Max is 2 at index 0.
- Flip(0..1): `[1, 2, 3, 4, 5]` -- place 2 at index 1.

Result: `[1, 2, 3, 4, 5]`

## Pseudocode

```
function flip(array, k):
    // Reverse elements from index 0 to k
    left = 0
    right = k
    while left < right:
        swap(array[left], array[right])
        left = left + 1
        right = right - 1

function pancakeSort(array):
    n = length(array)

    for size from n down to 2:
        // Find index of max element in array[0..size-1]
        maxIdx = 0
        for i from 1 to size - 1:
            if array[i] > array[maxIdx]:
                maxIdx = i

        // Move max to its correct position
        if maxIdx != size - 1:
            if maxIdx != 0:
                flip(array, maxIdx)    // bring max to front
            flip(array, size - 1)      // place max at end of unsorted portion

    return array
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** When the array is already sorted, the algorithm scans each subarray to find the maximum, confirms it is already in place, and does no flips. The total number of comparisons for finding maxima is n-1 + n-2 + ... + 1 = n(n-1)/2, but with an optimized check, a single pass confirms sortedness in O(n).

- **Average and Worst Case -- O(n^2):** The outer loop runs n-1 times. Each iteration requires finding the maximum (O(k) for a subarray of size k) and performing up to 2 flips (each O(k)). The total work is proportional to n + (n-1) + ... + 1 = n(n-1)/2, which is O(n^2).

- **Space -- O(1):** Pancake Sort is an in-place algorithm. The flip operation reverses elements in place and requires only a constant number of extra variables.

## When to Use

- **Constrained environments where only prefix reversals are allowed:** In robotics or hardware where the only available operation is flipping a prefix of a sequence, pancake sort is a natural fit.
- **Educational purposes:** It clearly illustrates the concept of sorting under restricted operations.
- **Studying combinatorial problems:** The pancake number (minimum worst-case flips for n elements) is an active area of combinatorial research.
- **Sorting pancakes:** The literal application of sorting a disordered stack of pancakes by size using a spatula.

## When NOT to Use

- **General-purpose sorting:** O(n^2) performance makes Pancake Sort impractical for anything beyond small arrays.
- **Large datasets:** For large inputs, O(n log n) algorithms are dramatically faster.
- **When stability matters:** Pancake Sort is not stable, as prefix reversals can change the relative order of equal elements.
- **When comparisons are expensive:** Pancake Sort always performs O(n^2) comparisons even when the data is partially sorted.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space | Stable | Notes                                          |
|----------------|-----------|-------|--------|-------------------------------------------------|
| Pancake Sort   | O(n^2)    | O(1)  | No     | Only uses prefix reversals; theoretical interest |
| Bubble Sort    | O(n^2)    | O(1)  | Yes    | Uses adjacent swaps; stable                      |
| Selection Sort | O(n^2)    | O(1)  | No     | Similar strategy of placing max/min first        |
| Insertion Sort | O(n^2)    | O(1)  | Yes    | Generally faster in practice                     |
| Quick Sort     | O(n log n)| O(log n) | No  | Far superior for large datasets                  |

## Implementations

| Language   | File |
|------------|------|
| Python     | [pancake_sort.py](python/pancake_sort.py) |
| Java       | [PancakeSort.java](java/PancakeSort.java) |
| C++        | [pancake_sort.cpp](cpp/pancake_sort.cpp) |
| C          | [pancake_sort.c](c/pancake_sort.c) |
| Go         | [pancake_sort.go](go/pancake_sort.go) |
| TypeScript | [pancakeSort.ts](typescript/pancakeSort.ts) |
| Rust       | [pancake_sort.rs](rust/pancake_sort.rs) |
| Kotlin     | [PancakeSort.kt](kotlin/PancakeSort.kt) |
| Swift      | [PancakeSort.swift](swift/PancakeSort.swift) |
| Scala      | [PancakeSort.scala](scala/PancakeSort.scala) |
| C#         | [PancakeSort.cs](csharp/PancakeSort.cs) |

## References

- Gates, W. H., & Papadimitriou, C. H. (1979). "Bounds for sorting by prefix reversal." *Discrete Mathematics*, 27(1), 47-57.
- Chitturi, B., et al. (2009). "An (18/11)n upper bound for sorting by prefix reversals." *Theoretical Computer Science*, 410(36), 3372-3390.
- [Pancake Sorting -- Wikipedia](https://en.wikipedia.org/wiki/Pancake_sorting)
