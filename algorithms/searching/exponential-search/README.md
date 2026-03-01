# Exponential Search

## Overview

Exponential Search (also called doubling search or galloping search) is a search algorithm designed for sorted arrays. It works in two phases: first, it finds a range where the target element might exist by exponentially increasing an index bound (1, 2, 4, 8, 16, ...), and then it performs a binary search within that narrowed range. This approach is particularly efficient when the target element is located near the beginning of the array, achieving O(log i) time where i is the position of the target.

Exponential Search was introduced by Bentley and Yao in 1976 as an almost-optimal algorithm for unbounded searching. It is commonly used in practice for searching in unbounded or infinite lists and as a building block inside other algorithms such as merging runs in Timsort.

## How It Works

1. Start by checking if the first element matches the target. If so, return index 0.
2. Set an initial bound of 1, then repeatedly double the bound (1, 2, 4, 8, ...) until either:
   - The element at the bound is greater than or equal to the target, or
   - The bound exceeds the length of the array.
3. Once the range is identified, perform a standard binary search in the subarray from `bound/2` to `min(bound, n - 1)`.
4. Return the index if the target is found, or -1 if it is not present.

## Worked Example

Array: `[2, 5, 8, 12, 15, 23, 37, 45, 67, 89]`, Target: `23`

**Phase 1 -- Find the range by doubling:**

| Step | Bound | arr[bound] | Comparison        | Action          |
|------|-------|------------|-------------------|-----------------|
| 1    | 1     | 5          | 5 < 23            | Double bound    |
| 2    | 2     | 8          | 8 < 23            | Double bound    |
| 3    | 4     | 15         | 15 < 23           | Double bound    |
| 4    | 8     | 67         | 67 >= 23          | Stop doubling   |

Range identified: indices 4 through 8.

**Phase 2 -- Binary search within [4, 8]:**

| Step | Low | High | Mid | arr[mid] | Comparison        | Action       |
|------|-----|------|-----|----------|-------------------|--------------|
| 1    | 4   | 8    | 6   | 37       | 37 > 23           | high = 5     |
| 2    | 4   | 5    | 4   | 15       | 15 < 23           | low = 5      |
| 3    | 5   | 5    | 5   | 23       | 23 == 23          | Found!       |

Result: Target `23` found at index **5**.

## Pseudocode

```
function exponentialSearch(array, target):
    n = length(array)

    // Check the first element
    if array[0] == target:
        return 0

    // Find the range by doubling
    bound = 1
    while bound < n and array[bound] <= target:
        bound = bound * 2

    // Binary search within the identified range
    return binarySearch(array, target, bound / 2, min(bound, n - 1))
```

## Complexity Analysis

| Case    | Time      | Space |
|---------|-----------|-------|
| Best    | O(1)      | O(1)  |
| Average | O(log i)  | O(1)  |
| Worst   | O(log n)  | O(1)  |

Where `i` is the index of the target element and `n` is the array length.

**Why these complexities?**

- **Best Case -- O(1):** The target is the first element in the array, so it is found immediately without any doubling or binary search.

- **Average Case -- O(log i):** The doubling phase takes O(log i) steps to find a bound that exceeds the target's position. The subsequent binary search operates on a range of size at most `i`, which also takes O(log i) comparisons. The total is O(log i), which is better than O(log n) when the target is near the beginning.

- **Worst Case -- O(log n):** When the target is near the end of the array, the doubling phase takes O(log n) steps and the binary search also takes O(log n) comparisons, giving O(log n) total.

- **Space -- O(1):** The algorithm uses only a constant number of variables (bound, low, high, mid) regardless of input size.

## When to Use

- **Target is likely near the beginning:** Exponential Search outperforms binary search when the target's index i is much smaller than n, since it runs in O(log i) rather than O(log n).
- **Unbounded or infinite lists:** The doubling strategy naturally handles cases where the size of the search space is not known in advance.
- **As a subroutine in other algorithms:** Timsort uses a galloping mode based on exponential search to efficiently merge runs of sorted data.
- **When random access is available:** Like binary search, it requires O(1) access to arbitrary indices.

## When NOT to Use

- **Unsorted data:** Exponential Search requires the array to be sorted. For unsorted data, use linear search or sort first.
- **Small arrays:** For very small arrays, the overhead of the doubling phase offers no benefit over a simple linear scan or binary search.
- **Target is near the end:** When the target is near the end of the array, exponential search has no advantage over standard binary search and involves a slightly larger constant factor.
- **Linked lists or sequential access:** The algorithm depends on efficient random access. On sequential data structures, jump search or linear search is preferable.

## Comparison with Similar Algorithms

| Algorithm            | Time (avg)    | Space | Notes                                              |
|----------------------|---------------|-------|----------------------------------------------------|
| Exponential Search   | O(log i)      | O(1)  | Best when target is near the beginning              |
| Binary Search        | O(log n)      | O(1)  | General-purpose; always searches the full range     |
| Interpolation Search | O(log log n)  | O(1)  | Faster for uniformly distributed data               |
| Jump Search          | O(sqrt(n))    | O(1)  | Simpler; works well on sequential access storage    |
| Linear Search        | O(n)          | O(1)  | No prerequisites; works on unsorted data            |

## Implementations

| Language   | File |
|------------|------|
| Python     | [exponential_search.py](python/exponential_search.py) |
| Java       | [ExponentialSearch.java](java/ExponentialSearch.java) |
| C++        | [exponential_search.cpp](cpp/exponential_search.cpp) |
| C          | [exponential_search.c](c/exponential_search.c) |
| Go         | [exponential_search.go](go/exponential_search.go) |
| TypeScript | [exponentialSearch.ts](typescript/exponentialSearch.ts) |
| Rust       | [exponential_search.rs](rust/exponential_search.rs) |
| Kotlin     | [ExponentialSearch.kt](kotlin/ExponentialSearch.kt) |
| Swift      | [ExponentialSearch.swift](swift/ExponentialSearch.swift) |
| Scala      | [ExponentialSearch.scala](scala/ExponentialSearch.scala) |
| C#         | [ExponentialSearch.cs](csharp/ExponentialSearch.cs) |

## References

- Bentley, J. L., & Yao, A. C. (1976). "An almost optimal algorithm for unbounded searching." *Information Processing Letters*, 5(3), 82-87.
- Baeza-Yates, R. A., & Salton, G. (1989). "A comparison of search algorithms." In *Algorithms and Data Structures*, 1-14.
- [Exponential Search -- Wikipedia](https://en.wikipedia.org/wiki/Exponential_search)
