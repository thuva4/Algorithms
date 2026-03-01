# Gnome Sort

## Overview

Gnome Sort (also called Stupid Sort) is a simple comparison-based sorting algorithm that is conceptually similar to Insertion Sort but uses a different mechanism to move elements to their correct positions. It is named after the behavior of a garden gnome sorting flower pots: the gnome looks at the pot next to him and the one before, swaps them if they are out of order and steps one position back, or moves forward if they are in order.

The algorithm was first described by Hamid Sarbazi-Azad in 2000. Despite its simplicity, Gnome Sort has O(n^2) average and worst-case time complexity and is rarely used in practice. Its main value is educational: it demonstrates that sorting can be achieved with an extremely simple control flow.

## How It Works

1. Start at position 0.
2. If the current position is 0, or the current element is greater than or equal to the previous element, move forward one position.
3. Otherwise, swap the current element with the previous one and move backward one position.
4. Repeat until the position is past the end of the array.

## Worked Example

Given input: `[5, 3, 1, 4]`

| Step | Position | Comparison         | Action                | Array State    |
|------|----------|--------------------|----------------------|----------------|
| 1    | 0        | (pos == 0)         | Move forward         | [5, 3, 1, 4]  |
| 2    | 1        | 3 < 5              | Swap, move back      | [3, 5, 1, 4]  |
| 3    | 0        | (pos == 0)         | Move forward         | [3, 5, 1, 4]  |
| 4    | 1        | 5 >= 3             | Move forward         | [3, 5, 1, 4]  |
| 5    | 2        | 1 < 5              | Swap, move back      | [3, 1, 5, 4]  |
| 6    | 1        | 1 < 3              | Swap, move back      | [1, 3, 5, 4]  |
| 7    | 0        | (pos == 0)         | Move forward         | [1, 3, 5, 4]  |
| 8    | 1        | 3 >= 1             | Move forward         | [1, 3, 5, 4]  |
| 9    | 2        | 5 >= 3             | Move forward         | [1, 3, 5, 4]  |
| 10   | 3        | 4 < 5              | Swap, move back      | [1, 3, 4, 5]  |
| 11   | 2        | 4 >= 3             | Move forward         | [1, 3, 4, 5]  |
| 12   | 3        | 5 >= 4             | Move forward         | [1, 3, 4, 5]  |
| 13   | 4        | (past end)         | Done                 | [1, 3, 4, 5]  |

Result: `[1, 3, 4, 5]`

## Pseudocode

```
function gnomeSort(array):
    n = length(array)
    pos = 0

    while pos < n:
        if pos == 0 or array[pos] >= array[pos - 1]:
            pos = pos + 1
        else:
            swap(array[pos], array[pos - 1])
            pos = pos - 1

    return array
```

## Complexity Analysis

| Case    | Time   | Space |
|---------|--------|-------|
| Best    | O(n)   | O(1)  |
| Average | O(n^2) | O(1)  |
| Worst   | O(n^2) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** When the array is already sorted, the algorithm simply moves forward through every position without ever swapping. It makes n-1 comparisons and finishes in O(n) time.

- **Average Case -- O(n^2):** On average, each element needs to be moved back roughly half the distance to its correct position. The total number of swaps and comparisons is proportional to the sum of distances, which is O(n^2).

- **Worst Case -- O(n^2):** When the array is sorted in reverse order, each element must be swapped all the way back to the beginning. The total number of swaps is 1 + 2 + ... + (n-1) = n(n-1)/2, which is O(n^2).

- **Space -- O(1):** Gnome Sort is an in-place algorithm. It only uses a single position variable and a temporary for swapping.

## When to Use

- **Educational purposes:** Gnome Sort is one of the simplest sorting algorithms to understand and implement. It is useful for teaching basic sorting concepts.
- **Extremely small arrays:** For very tiny inputs (fewer than 10 elements), the simplicity of Gnome Sort can be an advantage.
- **Nearly sorted data:** Like Insertion Sort, Gnome Sort performs well on data that is already nearly sorted, approaching O(n) time.
- **When minimal code is required:** The algorithm can be implemented in very few lines of code.

## When NOT to Use

- **Large datasets:** With O(n^2) average performance, Gnome Sort is impractical for arrays larger than a few hundred elements.
- **Performance-critical applications:** O(n log n) algorithms are vastly superior for any significant data volume.
- **When stability matters and a better stable sort exists:** While Gnome Sort is stable, Insertion Sort is generally faster in practice for the same use cases.
- **Production code:** There is no practical scenario where Gnome Sort should be preferred over Insertion Sort.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space | Stable | Notes                                          |
|----------------|-----------|-------|--------|-------------------------------------------------|
| Gnome Sort     | O(n^2)    | O(1)  | Yes    | Very simple; similar to Insertion Sort           |
| Insertion Sort | O(n^2)    | O(1)  | Yes    | Faster in practice; fewer total operations       |
| Bubble Sort    | O(n^2)    | O(1)  | Yes    | Also simple; uses adjacent swaps                 |
| Selection Sort | O(n^2)    | O(1)  | No     | Fewer swaps but more comparisons                 |
| Shell Sort     | O(n^(4/3))| O(1)  | No     | Gap-based; much faster on large inputs           |

## Implementations

| Language   | File |
|------------|------|
| Python     | [gnome_sort.py](python/gnome_sort.py) |
| Java       | [GnomeSort.java](java/GnomeSort.java) |
| C++        | [gnome_sort.cpp](cpp/gnome_sort.cpp) |
| C          | [gnome_sort.c](c/gnome_sort.c) |
| Go         | [gnome_sort.go](go/gnome_sort.go) |
| TypeScript | [gnomeSort.ts](typescript/gnomeSort.ts) |
| Kotlin     | [GnomeSort.kt](kotlin/GnomeSort.kt) |
| Rust       | [gnome_sort.rs](rust/gnome_sort.rs) |
| Swift      | [GnomeSort.swift](swift/GnomeSort.swift) |
| Scala      | [GnomeSort.scala](scala/GnomeSort.scala) |
| C#         | [GnomeSort.cs](csharp/GnomeSort.cs) |

## References

- Sarbazi-Azad, H. (2000). "Stupid sort: A new sorting algorithm." *Newsletter of the Computer Science Department, Sharif University of Technology*.
- [Gnome Sort -- Wikipedia](https://en.wikipedia.org/wiki/Gnome_sort)
