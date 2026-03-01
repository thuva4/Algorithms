# Counting Sort

## Overview

Counting Sort is an efficient, non-comparison-based sorting algorithm that sorts elements by counting the number of occurrences of each distinct value in the input. It operates by determining, for each element, the number of elements that are less than it, and uses this information to place each element directly into its correct output position. The algorithm achieves linear time complexity O(n + k), where n is the number of elements and k is the range of input values.

Unlike comparison-based sorts which are bounded by O(n log n), Counting Sort breaks this barrier by not comparing elements against each other. However, it is only practical when the range of input values (k) is not significantly larger than the number of elements (n).

## How It Works

Counting Sort works in three phases. First, it counts the occurrences of each value in the input array using a count array indexed by the element values. Second, it computes cumulative counts so that each position in the count array reflects the number of elements less than or equal to that value. Third, it iterates through the original array in reverse order, placing each element at the position indicated by the cumulative count array and decrementing the count. Iterating in reverse preserves the relative order of equal elements, making the algorithm stable.

### Example

Given input: `[4, 2, 2, 8, 3, 3, 1]`

**Phase 1: Count Occurrences**

| Value | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|-------|---|---|---|---|---|---|---|---|---|
| Count | 0 | 1 | 2 | 2 | 1 | 0 | 0 | 0 | 1 |

**Phase 2: Compute Cumulative Counts**

| Step | Action | Cumulative Count Array |
|------|--------|----------------------|
| 1 | count[1] += count[0] | `[0, 1, 2, 2, 1, 0, 0, 0, 1]` |
| 2 | count[2] += count[1] | `[0, 1, 3, 2, 1, 0, 0, 0, 1]` |
| 3 | count[3] += count[2] | `[0, 1, 3, 5, 1, 0, 0, 0, 1]` |
| 4 | count[4] += count[3] | `[0, 1, 3, 5, 6, 0, 0, 0, 1]` |
| 5 | count[5] += count[4] | `[0, 1, 3, 5, 6, 6, 0, 0, 1]` |
| 6 | count[6] += count[5] | `[0, 1, 3, 5, 6, 6, 6, 0, 1]` |
| 7 | count[7] += count[6] | `[0, 1, 3, 5, 6, 6, 6, 6, 1]` |
| 8 | count[8] += count[7] | `[0, 1, 3, 5, 6, 6, 6, 6, 7]` |

**Phase 3: Build Output Array** (iterate input in reverse for stability)

| Step | Element | Count Value | Output Position | Output Array | Updated Count |
|------|---------|-------------|-----------------|-------------|---------------|
| 1 | `1` | count[1] = 1 | index 0 | `[_, _, _, _, _, _, _]` -> place at 0 | count[1] = 0 |
| 2 | `3` | count[3] = 5 | index 4 | `[1, _, _, _, 3, _, _]` | count[3] = 4 |
| 3 | `3` | count[3] = 4 | index 3 | `[1, _, _, 3, 3, _, _]` | count[3] = 3 |
| 4 | `8` | count[8] = 7 | index 6 | `[1, _, _, 3, 3, _, 8]` | count[8] = 6 |
| 5 | `2` | count[2] = 3 | index 2 | `[1, _, 2, 3, 3, _, 8]` | count[2] = 2 |
| 6 | `2` | count[2] = 2 | index 1 | `[1, 2, 2, 3, 3, _, 8]` | count[2] = 1 |
| 7 | `4` | count[4] = 6 | index 5 | `[1, 2, 2, 3, 3, 4, 8]` | count[4] = 5 |

Result: `[1, 2, 2, 3, 3, 4, 8]`

## Pseudocode

```
function countingSort(array, maxValue):
    n = length(array)

    // Phase 1: Count occurrences
    count = array of size (maxValue + 1), initialized to 0
    for i from 0 to n - 1:
        count[array[i]] = count[array[i]] + 1

    // Phase 2: Compute cumulative counts
    for i from 1 to maxValue:
        count[i] = count[i] + count[i - 1]

    // Phase 3: Build output array (iterate in reverse for stability)
    output = array of size n
    for i from n - 1 down to 0:
        output[count[array[i]] - 1] = array[i]
        count[array[i]] = count[array[i]] - 1

    return output
```

The reverse iteration in Phase 3 is critical for stability: when two elements have the same value, the one appearing later in the input will be placed at a higher index in the output, preserving their original relative order.

## Complexity Analysis

| Case    | Time    | Space   |
|---------|---------|---------|
| Best    | O(n+k)  | O(n+k)  |
| Average | O(n+k)  | O(n+k)  |
| Worst   | O(n+k)  | O(n+k)  |

**Why these complexities?**

- **Best Case -- O(n+k):** Even in the best case, Counting Sort must iterate through the input array to count occurrences (O(n)), iterate through the count array to compute cumulative sums (O(k)), and iterate through the input again to build the output (O(n)). The total is always O(n + k).

- **Average Case -- O(n+k):** The algorithm performs the same three passes regardless of the input distribution: counting (O(n)), cumulating (O(k)), and placing (O(n)). There is no variation based on input order.

- **Worst Case -- O(n+k):** Counting Sort always performs exactly the same operations regardless of the input arrangement. The worst case arises not from element order but from a large value range k. If k is much larger than n (e.g., sorting 10 elements with values up to 1,000,000), the O(k) term dominates, making the algorithm impractical.

- **Space -- O(n+k):** The algorithm requires an output array of size n and a count array of size k + 1. Both are necessary and cannot be eliminated in the standard stable version of Counting Sort.

## When to Use

- **Integer data with a small, known range:** Counting Sort is ideal when sorting integers (or data that can be mapped to integers) where the range k is on the order of n. For example, sorting exam scores (0-100) for a class of students.
- **When linear-time sorting is needed:** Counting Sort achieves O(n + k) time, which is faster than any comparison-based algorithm's O(n log n) lower bound when k = O(n).
- **As a subroutine in Radix Sort:** Counting Sort's stability makes it the preferred subroutine for sorting individual digits in Radix Sort.
- **When stability is required with non-comparison sorting:** Counting Sort is one of the few non-comparison sorts that is naturally stable.

## When NOT to Use

- **Large value ranges:** When k is much larger than n (e.g., sorting floating-point numbers or arbitrary 64-bit integers), the count array becomes prohibitively large. Use comparison-based algorithms instead.
- **Non-integer data:** Counting Sort requires discrete, bounded values to index the count array. It cannot directly sort floating-point numbers, strings, or complex objects.
- **When space is limited:** Counting Sort requires O(n + k) extra space, which may be prohibitive for large datasets or embedded systems.
- **Negative numbers without preprocessing:** The standard algorithm assumes non-negative values. Handling negatives requires shifting all values, adding complexity.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)  | Space    | Stable | Notes                                       |
|----------------|------------|----------|--------|---------------------------------------------|
| Counting Sort  | O(n+k)    | O(n+k)   | Yes    | Linear time; limited to small integer ranges |
| Radix Sort     | O(nk)     | O(n+k)   | Yes    | Uses Counting Sort per digit; handles larger ranges |
| Bucket Sort    | O(n+k)    | O(n+k)   | Yes    | Distributes into buckets; works with floats  |
| Quick Sort     | O(n log n)| O(log n) | No     | Comparison-based; general purpose            |

## Implementations

| Language   | File |
|------------|------|
| Python     | [counting_sort.py](python/counting_sort.py) |
| Java       | [CountingSort.java](java/CountingSort.java) |
| C++        | [counting_sort.cpp](cpp/counting_sort.cpp) |
| C          | [counting_sort.c](c/counting_sort.c) |
| Go         | [counting_sort.go](go/counting_sort.go) |
| TypeScript | [countingSort.ts](typescript/countingSort.ts) |
| Kotlin     | [CountingSort.kt](kotlin/CountingSort.kt) |
| Rust       | [counting_sort.rs](rust/counting_sort.rs) |
| Swift      | [CountingSort.swift](swift/CountingSort.swift) |
| Scala      | [CountingSort.scala](scala/CountingSort.scala) |
| C#         | [CountingSort.cs](csharp/CountingSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 8: Sorting in Linear Time (Section 8.2: Counting Sort).
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2: Internal Sorting.
- [Counting Sort -- Wikipedia](https://en.wikipedia.org/wiki/Counting_sort)
