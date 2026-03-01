# Bogo Sort

## Overview

Bogo Sort (also known as permutation sort, stupid sort, or monkey sort) is a deliberately inefficient sorting algorithm based on the generate-and-test paradigm. It works by repeatedly checking whether the array is sorted and, if not, randomly shuffling it. The algorithm continues until the shuffle happens to produce a sorted arrangement. Bogo Sort serves primarily as an educational example and a humorous contrast to efficient algorithms, illustrating the importance of algorithmic design.

The name "bogo" is derived from "bogus." The algorithm is sometimes used in theoretical computer science to demonstrate worst-case behavior, as its expected running time is O((n+1)!).

## How It Works

1. Check if the array is sorted in non-decreasing order.
2. If sorted, return the array.
3. If not sorted, randomly shuffle the entire array.
4. Repeat from step 1.

## Worked Example

Array: `[3, 1, 2]`

| Attempt | Shuffled Array | Sorted? | Action          |
|---------|---------------|---------|-----------------|
| 1       | [3, 1, 2]     | No      | Shuffle again   |
| 2       | [2, 3, 1]     | No      | Shuffle again   |
| 3       | [1, 3, 2]     | No      | Shuffle again   |
| 4       | [1, 2, 3]     | Yes     | Return result   |

Result: `[1, 2, 3]` (after a lucky 4th shuffle).

In practice, the number of shuffles is random. For an array of 3 elements, there are 3! = 6 permutations, so on average it takes 6 attempts. For 10 elements, the expected number of attempts is 10! = 3,628,800.

## Pseudocode

```
function isSorted(array):
    for i from 0 to length(array) - 2:
        if array[i] > array[i + 1]:
            return false
    return true

function bogoSort(array):
    while not isSorted(array):
        shuffle(array)   // random permutation
    return array
```

## Complexity Analysis

| Case    | Time          | Space |
|---------|---------------|-------|
| Best    | O(n)          | O(1)  |
| Average | O((n+1)!)     | O(1)  |
| Worst   | O(infinity)   | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** The array is already sorted. The `isSorted` check takes O(n), and no shuffles are needed.

- **Average Case -- O((n+1)!):** There are n! possible permutations. Each shuffle produces a uniformly random permutation, so the probability of hitting the sorted one is 1/n!. The expected number of shuffles is n!, and each shuffle plus sort-check costs O(n), giving O(n * n!) = O((n+1)!).

- **Worst Case -- O(infinity):** Since the shuffles are random, there is no guarantee that the sorted permutation will ever be produced. The algorithm is not guaranteed to terminate (though it terminates with probability 1).

- **Space -- O(1):** The algorithm works in-place, requiring only a temporary variable for swaps during the shuffle.

## When to Use

- **Educational purposes:** Bogo Sort is an excellent teaching tool for demonstrating why algorithm design matters and for comparing against efficient sorting algorithms.
- **Extremely small arrays (n <= 3):** For trivially small inputs, the expected number of shuffles is small enough to be practical (but there is still no reason to prefer it over simpler sorts).
- **Humor and theoretical discussions:** It is often used in academic settings to illustrate concepts like expected running time and probabilistic termination.

## When NOT to Use

- **Any practical application:** Bogo Sort should never be used in production code. Even for moderately small arrays (n > 10), the expected running time becomes astronomical.
- **Time-sensitive contexts:** The runtime is unbounded and unpredictable.
- **When determinism is required:** The random version is non-deterministic, meaning repeated runs on the same input may take vastly different amounts of time.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space | Stable | Notes                                          |
|----------------|-----------|-------|--------|-------------------------------------------------|
| Bogo Sort      | O((n+1)!) | O(1)  | No     | Deliberately impractical; educational only       |
| Bubble Sort    | O(n^2)    | O(1)  | Yes    | Simple but much faster than Bogo Sort            |
| Insertion Sort | O(n^2)    | O(1)  | Yes    | Efficient for small or nearly sorted data        |
| Quick Sort     | O(n log n)| O(log n)| No   | Practical general-purpose sort                   |
| Merge Sort     | O(n log n)| O(n)  | Yes    | Guaranteed O(n log n); stable                    |

## Implementations

| Language   | File |
|------------|------|
| Python     | [bogo_sort.py](python/bogo_sort.py) |
| Java       | [BogoSort.java](java/BogoSort.java) |
| C++        | [bogo_sort.cpp](cpp/bogo_sort.cpp) |
| C          | [bogo_sort.c](c/bogo_sort.c) |
| Go         | [bogo_sort.go](go/bogo_sort.go) |
| TypeScript | [bogoSort.ts](typescript/bogoSort.ts) |
| Rust       | [bogo_sort.rs](rust/bogo_sort.rs) |
| Kotlin     | [BogoSort.kt](kotlin/BogoSort.kt) |
| Swift      | [BogoSort.swift](swift/BogoSort.swift) |
| Scala      | [BogoSort.scala](scala/BogoSort.scala) |
| C#         | [BogoSort.cs](csharp/BogoSort.cs) |

## References

- Gruber, H., Holzer, M., & Ruepp, O. (2007). "Sorting the slow way: an analysis of perversely awful randomized sorting algorithms." *International Conference on Fun with Algorithms*, 183-197.
- [Bogosort -- Wikipedia](https://en.wikipedia.org/wiki/Bogosort)
