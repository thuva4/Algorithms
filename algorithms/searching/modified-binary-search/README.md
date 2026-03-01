# Modified Binary Search

## Overview

Modified Binary Search refers to variations of the standard Binary Search algorithm that adapt the core divide-and-conquer approach to solve problems beyond simple element lookup. The two most common variants are Lower Bound (finding the first position where a value could be inserted to maintain sorted order) and Upper Bound (finding the position just past the last occurrence of a value). These operations are fundamental building blocks in computational geometry, database querying, and competitive programming.

These modifications maintain the O(log n) efficiency of standard Binary Search while extending its applicability to range queries, counting occurrences, and finding insertion points in sorted arrays.

## How It Works

**Lower Bound** finds the first index where the value is greater than or equal to the target. It returns the leftmost position where the target could be inserted without breaking the sorted order.

**Upper Bound** finds the first index where the value is strictly greater than the target. It returns the position just after the last occurrence of the target.

Together, `upper_bound - lower_bound` gives the count of elements equal to the target.

### Example: Lower Bound

Given sorted input: `[1, 3, 3, 5, 7, 7, 7, 9]`, target = `7`

| Step | low | high | mid | array[mid] | Comparison | Action |
|------|-----|------|-----|-----------|------------|--------|
| 1 | 0 | 8 | 4 | `7` | `7 >= 7` | result = 4, high = 3 |
| 2 | 0 | 3 | 1 | `3` | `3 < 7` | low = 2 |
| 3 | 2 | 3 | 2 | `3` | `3 < 7` | low = 3 |
| 4 | 3 | 3 | 3 | `5` | `5 < 7` | low = 4 |
| 5 | 4 | 3 | -- | -- | `low > high` | Return result = 4 |

Result: Lower bound of `7` is index `4` (the first occurrence of 7).

### Example: Upper Bound

Given sorted input: `[1, 3, 3, 5, 7, 7, 7, 9]`, target = `7`

| Step | low | high | mid | array[mid] | Comparison | Action |
|------|-----|------|-----|-----------|------------|--------|
| 1 | 0 | 8 | 4 | `7` | `7 <= 7` | low = 5 |
| 2 | 5 | 8 | 6 | `7` | `7 <= 7` | low = 7 |
| 3 | 7 | 8 | 7 | `9` | `9 > 7` | result = 7, high = 6 |
| 4 | 7 | 6 | -- | -- | `low > high` | Return result = 7 |

Result: Upper bound of `7` is index `7`. Count of 7s = upper_bound - lower_bound = 7 - 4 = 3.

## Pseudocode

```
function lowerBound(array, target):
    low = 0
    high = length(array) - 1
    result = length(array)

    while low <= high:
        mid = low + (high - low) / 2

        if array[mid] >= target:
            result = mid
            high = mid - 1
        else:
            low = mid + 1

    return result

function upperBound(array, target):
    low = 0
    high = length(array) - 1
    result = length(array)

    while low <= high:
        mid = low + (high - low) / 2

        if array[mid] > target:
            result = mid
            high = mid - 1
        else:
            low = mid + 1

    return result
```

The key difference between the two functions is a single comparison operator: `>=` for lower bound and `>` for upper bound. This subtle change shifts the boundary from "first element >= target" to "first element > target".

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(1)     | O(1)  |
| Average | O(log n) | O(1)  |
| Worst   | O(log n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The boundary is found at the first midpoint checked. This happens when the array structure causes the first mid to be the answer, though both functions always run to completion to guarantee correctness (making O(log n) a more honest best case for some implementations).

- **Average Case -- O(log n):** Like standard Binary Search, each iteration halves the search space. The algorithm requires log2(n) iterations regardless of target position, since it must narrow the range to a single element to determine the exact boundary.

- **Worst Case -- O(log n):** The algorithm always performs exactly floor(log2(n)) + 1 iterations because it must fully narrow the search range, unlike standard Binary Search which can terminate early on a match.

- **Space -- O(1):** Only a constant number of variables (`low`, `high`, `mid`, `result`) are used, independent of input size.

## When to Use

- **Counting occurrences in a sorted array:** `upper_bound(x) - lower_bound(x)` gives the count of element x in O(log n) time.
- **Finding insertion points:** Lower bound gives the correct insertion index to maintain sorted order.
- **Range queries:** Finding all elements in a range [a, b] can be done using `lower_bound(a)` and `upper_bound(b)`.
- **Binary search on the answer:** Many optimization problems reduce to finding the boundary where a predicate changes from false to true.
- **Competitive programming:** Modified binary search is a fundamental technique for solving a wide variety of problems efficiently.

## When NOT to Use

- **Unsorted data:** Like standard Binary Search, these variants require the array to be sorted.
- **When exact match is sufficient:** If you only need to know whether an element exists, standard Binary Search is simpler and equally fast.
- **Linked lists or non-random-access containers:** These algorithms require O(1) random access to be efficient.
- **Dynamically changing data:** If the data changes frequently, maintaining sorted order is expensive. Consider balanced BSTs or skip lists instead.

## Comparison with Similar Algorithms

| Algorithm               | Time (avg) | Space | Notes                                    |
|-------------------------|-----------|-------|------------------------------------------|
| Standard Binary Search  | O(log n)  | O(1)  | Finds any occurrence; may terminate early |
| Lower Bound             | O(log n)  | O(1)  | Finds first occurrence / insertion point  |
| Upper Bound             | O(log n)  | O(1)  | Finds position past last occurrence       |
| Linear Scan             | O(n)      | O(1)  | Works on unsorted data; much slower       |
| std::lower_bound (C++)  | O(log n)  | O(1)  | STL implementation; highly optimized      |

## Implementations

| Language | File |
|----------|------|
| C++      | [lower_bound.cpp](cpp/lower_bound.cpp) |
| C++      | [upper_bound.cpp](cpp/upper_bound.cpp) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 2: Getting Started.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.2.1: Searching an Ordered Table.
- [Binary Search Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Upper and Lower Bound -- C++ Reference](https://en.cppreference.com/w/cpp/algorithm/lower_bound)
