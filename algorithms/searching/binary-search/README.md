# Binary Search

## Overview

Binary Search is an efficient divide-and-conquer searching algorithm that works on sorted arrays. It repeatedly divides the search interval in half by comparing the target value to the middle element of the array. If the target matches the middle element, the search is complete. Otherwise, the search continues in the half where the target must lie, eliminating the other half entirely.

Binary Search is one of the most fundamental algorithms in computer science, reducing the search space by half with each comparison and achieving O(log n) time complexity -- a dramatic improvement over linear search for large datasets.

## How It Works

Binary Search maintains two pointers, `low` and `high`, that define the current search range. At each step, it computes the middle index, compares the middle element with the target, and narrows the range accordingly. If the middle element equals the target, the index is returned. If the target is smaller, the search continues in the left half. If the target is larger, the search continues in the right half. The process repeats until the target is found or the range is empty.

### Example

Given sorted input: `[1, 3, 5, 7, 9, 11, 13, 15]`, target = `7`

| Step | low | high | mid | array[mid] | Comparison | Action |
|------|-----|------|-----|-----------|------------|--------|
| 1 | 0 | 7 | 3 | `7` | `7 == 7`? | Yes, return index 3 |

Result: Target `7` found at index `3` in just 1 comparison.

**Example requiring multiple steps:**

Given sorted input: `[1, 3, 5, 7, 9, 11, 13, 15]`, target = `13`

| Step | low | high | mid | array[mid] | Comparison | Action |
|------|-----|------|-----|-----------|------------|--------|
| 1 | 0 | 7 | 3 | `7` | `13 > 7` | Search right half: low = 4 |
| 2 | 4 | 7 | 5 | `11` | `13 > 11` | Search right half: low = 6 |
| 3 | 6 | 7 | 6 | `13` | `13 == 13` | Yes, return index 6 |

Result: Target `13` found at index `6` after 3 comparisons (vs. 7 with linear search).

## Pseudocode

```
function binarySearch(array, target):
    low = 0
    high = length(array) - 1

    while low <= high:
        mid = low + (high - low) / 2    // avoids integer overflow

        if array[mid] == target:
            return mid
        else if array[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1  // target not found
```

Note: Using `low + (high - low) / 2` instead of `(low + high) / 2` prevents potential integer overflow when `low` and `high` are large values.

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(1)     | O(1)  |
| Average | O(log n) | O(1)  |
| Worst   | O(log n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The target element happens to be at the middle of the array on the first comparison. The algorithm finds it immediately and returns.

- **Average Case -- O(log n):** On average, the algorithm halves the search space with each comparison. Starting with n elements, after k comparisons the search space is n/2^k. The search ends when the space contains 1 element, so n/2^k = 1, giving k = log2(n) comparisons.

- **Worst Case -- O(log n):** The target is not in the array, or it is found only after the search space has been reduced to a single element. This requires exactly floor(log2(n)) + 1 comparisons. For example, searching 1 billion elements requires at most 30 comparisons.

- **Space -- O(1):** The iterative version uses only a constant number of variables (`low`, `high`, `mid`). The recursive version uses O(log n) space due to the call stack, but the iterative approach is preferred in practice.

## When to Use

- **Sorted arrays with frequent searches:** Binary Search shines when you search the same sorted dataset many times, amortizing any initial sorting cost.
- **Large datasets:** The logarithmic time complexity makes Binary Search practical even for billions of elements.
- **Finding boundaries:** Variations of binary search can efficiently find the first/last occurrence of a value, or the insertion point for a new value.
- **Answering "is X present?" queries on static data:** Databases and search engines use binary search on indexes extensively.
- **Numerical methods:** Binary search on the answer space (also called "bisection method") solves many optimization and root-finding problems.

## When NOT to Use

- **Unsorted data:** Binary Search requires sorted input. If the data is unsorted and you only search once, linear search (O(n)) is faster than sorting (O(n log n)) + binary search (O(log n)).
- **Linked lists:** Binary Search requires O(1) random access to compute the middle element. On a linked list, finding the middle takes O(n), negating the advantage.
- **Frequently changing data:** If insertions and deletions are common, maintaining sorted order is expensive. Consider a balanced BST or hash table instead.
- **Very small datasets:** For arrays with fewer than ~10 elements, linear search may be faster due to lower overhead and better cache behavior.

## Comparison with Similar Algorithms

| Algorithm        | Time (avg) | Space | Requires Sorted Data | Notes                                    |
|------------------|-----------|-------|---------------------|------------------------------------------|
| Binary Search    | O(log n)  | O(1)  | Yes                 | Efficient; the standard for sorted data  |
| Linear Search    | O(n)      | O(1)  | No                  | Simple but slow on large datasets        |
| Ternary Search   | O(log3 n) | O(1)  | Yes                 | More comparisons per step; rarely better |
| Interpolation Search | O(log log n) avg | O(1) | Yes (uniform) | Faster if data is uniformly distributed |

## Implementations

| Language   | File |
|------------|------|
| C          | [BinarySearch.c](c/BinarySearch.c) |
| C++        | [BinarySearch - (recursive).cpp](cpp/BinarySearch%20-%20(recursive).cpp) |
| C++        | [BinarySearch-(iterative).cpp](cpp/BinarySearch-(iterative).cpp) |
| C#         | [binSearchAlgo.cs](csharp/binSearchAlgo.cs) |
| Go         | [BinarySearch.go](go/BinarySearch.go) |
| Java       | [BinarySearchRecursive.java](java/BinarySearchRecursive.java) |
| Java       | [binarySerach.java](java/binarySerach.java) |
| Kotlin     | [BinarySearchRecursive.kt](kotlin/BinarySearchRecursive.kt) |
| Python     | [BinarySearch(iterative).py](python/BinarySearch(iterative).py) |
| Python     | [BinarySearch(recursive).py](python/BinarySearch(recursive).py) |
| Swift      | [BinarySearch.swift](swift/BinarySearch.swift) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started (Exercise 2.3-5).
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.2.1: Searching an Ordered Table.
- [Binary Search Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
