# Linear Search

## Overview

Linear Search (also known as Sequential Search) is the simplest searching algorithm. It works by sequentially checking each element of a list until the target value is found or the entire list has been traversed. Because it requires no preprocessing or sorting, Linear Search is applicable to any collection of data, whether sorted or unsorted.

While Linear Search is not efficient for large datasets, it is often the best choice for small or unsorted collections where the overhead of more advanced algorithms would outweigh their benefits.

## How It Works

Linear Search works by starting at the first element of the array and comparing each element to the target value one by one. If the current element matches the target, the algorithm returns its index. If the end of the array is reached without finding the target, the algorithm returns -1 (or a similar sentinel value) to indicate the target is not present.

### Example

Given input: `[4, 7, 2, 9, 1, 5, 3]`, target = `9`

| Step | Index | Element | Comparison | Result |
|------|-------|---------|------------|--------|
| 1 | 0 | `4` | `4 == 9`? | No, continue |
| 2 | 1 | `7` | `7 == 9`? | No, continue |
| 3 | 2 | `2` | `2 == 9`? | No, continue |
| 4 | 3 | `9` | `9 == 9`? | Yes, return index 3 |

Result: Target `9` found at index `3` after 4 comparisons.

**Example where target is not found:**

Given input: `[4, 7, 2, 9, 1, 5, 3]`, target = `8`

All 7 elements are checked, none match. Return `-1`.

## Pseudocode

```
function linearSearch(array, target):
    for i from 0 to length(array) - 1:
        if array[i] == target:
            return i

    return -1  // target not found
```

The simplicity of Linear Search is its greatest strength -- there is virtually no setup, no requirement for sorted data, and the logic is trivially correct.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The target element is the first element in the array. Only one comparison is needed, so the algorithm terminates immediately.

- **Average Case -- O(n):** On average, the target element is somewhere in the middle of the array. The algorithm performs approximately n/2 comparisons, which simplifies to O(n).

- **Worst Case -- O(n):** The target element is the last element in the array, or it is not present at all. The algorithm must check every single element, performing exactly n comparisons.

- **Space -- O(1):** Linear Search operates in-place and only requires a single index variable to iterate through the array. No additional data structures are needed regardless of input size.

## When to Use

- **Unsorted data:** Linear Search is the only option when the data is not sorted and sorting it would be too expensive.
- **Small datasets (fewer than ~100 elements):** The overhead of binary search setup (sorting, maintaining order) is not worth it for tiny collections.
- **Searching linked lists:** Binary search requires random access, which linked lists do not provide efficiently. Linear Search is the natural choice.
- **One-time searches:** If you only need to search a collection once, sorting it first (O(n log n)) just to do a binary search (O(log n)) is slower than a single linear scan (O(n)).
- **When simplicity matters:** Linear Search is trivial to implement and virtually impossible to get wrong.

## When NOT to Use

- **Large sorted datasets:** Binary Search is vastly superior on sorted data, reducing O(n) to O(log n). For example, searching 1 million elements takes at most 20 comparisons with binary search vs. up to 1 million with linear search.
- **Frequent searches on the same data:** If you search the same collection many times, sorting it once and using binary search amortizes the sorting cost quickly.
- **Performance-critical applications:** When low latency matters, O(n) search time on large datasets is unacceptable.
- **When data has exploitable structure:** If the data is sorted, hashed, or stored in a tree, specialized search algorithms will always outperform linear search.

## Comparison with Similar Algorithms

| Algorithm     | Time (avg) | Space | Requires Sorted Data | Notes                                    |
|---------------|-----------|-------|---------------------|------------------------------------------|
| Linear Search | O(n)      | O(1)  | No                  | Simple; works on any collection          |
| Binary Search | O(log n)  | O(1)  | Yes                 | Much faster on sorted data               |
| Ternary Search| O(log3 n) | O(1)  | Yes                 | Similar to binary search; rarely faster  |
| Hash Table    | O(1) avg  | O(n)  | No                  | Fastest lookup; requires extra space     |

## Implementations

| Language   | File |
|------------|------|
| C          | [LinearSearch.c](c/LinearSearch.c) |
| C++        | [LinearSearch.cpp](cpp/LinearSearch.cpp) |
| C#         | [LinearSearch.cs](csharp/LinearSearch.cs) |
| Go         | [linear_search.go](go/linear_search.go) |
| Java       | [LinearSearch.java](java/LinearSearch.java) |
| Kotlin     | [LinearSearch.kt](kotlin/LinearSearch.kt) |
| Python     | [Python.py](python/Python.py) |
| Rust       | [linear_search.rs](rust/linear_search.rs) |
| Scala      | [LinearSearch.scala](scala/LinearSearch.scala) |
| Swift      | [LinearSearch.swift](swift/LinearSearch.swift) |
| TypeScript | [LinearSearch.js](typescript/LinearSearch.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.1: Sequential Searching.
- [Linear Search -- Wikipedia](https://en.wikipedia.org/wiki/Linear_search)
