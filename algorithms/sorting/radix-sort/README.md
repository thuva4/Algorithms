# Radix Sort

## Overview

Radix Sort is a non-comparison-based sorting algorithm that sorts integers by processing individual digits. It works by sorting elements digit by digit, starting from the least significant digit (LSD) to the most significant digit (MSD), using a stable sorting algorithm (typically Counting Sort) as a subroutine for each digit position. The algorithm achieves O(nk) time complexity, where n is the number of elements and k is the number of digits in the largest number.

Radix Sort bypasses the O(n log n) lower bound of comparison-based sorting by exploiting the structure of integer representations. It is particularly effective when the number of digits k is small relative to log n, making it faster than comparison-based sorts in practice for certain types of data.

## How It Works

Radix Sort (LSD variant) processes the array one digit position at a time, from the least significant digit to the most significant. At each digit position, it uses a stable sort (usually Counting Sort) to rearrange elements based on that digit alone. Because the subroutine sort is stable, the relative order established by previous digit passes is preserved, and after processing all digit positions, the array is fully sorted.

### Example

Given input: `[170, 45, 75, 90, 802, 24, 2, 66]`

**Pass 1:** Sort by ones digit (least significant)

| Element | Ones Digit |
|---------|-----------|
| 170     | 0         |
| 45      | 5         |
| 75      | 5         |
| 90      | 0         |
| 802     | 2         |
| 24      | 4         |
| 2       | 2         |
| 66      | 6         |

After stable sort by ones digit: `[170, 90, 802, 2, 24, 45, 75, 66]`

**Pass 2:** Sort by tens digit

| Element | Tens Digit |
|---------|-----------|
| 170     | 7         |
| 90      | 9         |
| 802     | 0         |
| 2       | 0         |
| 24      | 2         |
| 45      | 4         |
| 75      | 7         |
| 66      | 6         |

After stable sort by tens digit: `[802, 2, 24, 45, 66, 170, 75, 90]`

**Pass 3:** Sort by hundreds digit

| Element | Hundreds Digit |
|---------|---------------|
| 802     | 8             |
| 2       | 0             |
| 24      | 0             |
| 45      | 0             |
| 66      | 0             |
| 170     | 1             |
| 75      | 0             |
| 90      | 0             |

After stable sort by hundreds digit: `[2, 24, 45, 66, 75, 90, 170, 802]`

Result: `[2, 24, 45, 66, 75, 90, 170, 802]`

## Pseudocode

```
function radixSort(array):
    maxVal = maximum value in array
    exp = 1

    while maxVal / exp > 0:
        countingSortByDigit(array, exp)
        exp = exp * 10

function countingSortByDigit(array, exp):
    n = length(array)
    output = array of size n
    count = array of size 10, initialized to 0

    // Count occurrences of each digit
    for i from 0 to n - 1:
        digit = (array[i] / exp) % 10
        count[digit] = count[digit] + 1

    // Compute cumulative counts
    for i from 1 to 9:
        count[i] = count[i] + count[i - 1]

    // Build output array (reverse order for stability)
    for i from n - 1 down to 0:
        digit = (array[i] / exp) % 10
        output[count[digit] - 1] = array[i]
        count[digit] = count[digit] - 1

    // Copy output back to array
    copy output to array
```

The key insight is that stability of the digit-level sort is essential. If the subroutine sort were not stable, the ordering from previous digit passes would be destroyed, and the final result would be incorrect.

## Complexity Analysis

| Case    | Time   | Space   |
|---------|--------|---------|
| Best    | O(nk)  | O(n+k)  |
| Average | O(nk)  | O(n+k)  |
| Worst   | O(nk)  | O(n+k)  |

**Why these complexities?**

- **Best Case -- O(nk):** Even when the array is already sorted, Radix Sort must still process every digit position. For each of the k digit positions, the Counting Sort subroutine iterates through all n elements. The total work is k passes * O(n + base) per pass. With a fixed base (e.g., base 10), each pass is O(n), giving O(nk) total.

- **Average Case -- O(nk):** Radix Sort performs the same operations regardless of input order. The number of passes is determined by k (the number of digits in the maximum value), and each pass processes all n elements. The input distribution does not affect the number of operations.

- **Worst Case -- O(nk):** The worst case is identical to the best and average cases. The only factor that increases running time is a larger k (more digits), which means larger numbers in the input. For d-digit numbers in base b, the time is O(d * (n + b)).

- **Space -- O(n+k):** The Counting Sort subroutine requires an output array of size n and a count array of size equal to the base (e.g., 10 for decimal). The total auxiliary space is O(n + base). Since the base is typically a small constant, this simplifies to O(n) in practice.

## When to Use

- **Fixed-length integer keys:** Radix Sort excels when sorting integers, fixed-length strings, or other data with a bounded number of digit positions. When k is constant or O(log n), Radix Sort achieves effectively linear time.
- **Large datasets of integers with bounded range:** For example, sorting millions of 32-bit integers. With base 256, only 4 passes are needed regardless of n, giving near-linear performance.
- **When comparison-based O(n log n) is too slow:** For sufficiently large n with small k, Radix Sort's O(nk) can be significantly faster than O(n log n).
- **Sorting strings of equal length:** Radix Sort (MSD variant) can sort fixed-length strings character by character very efficiently.

## When NOT to Use

- **Variable-length keys or floating-point numbers:** Radix Sort requires keys that can be decomposed into digits or characters. Floating-point numbers require special handling to preserve order.
- **When k is large relative to log n:** If numbers have many digits (e.g., arbitrary-precision integers), the O(nk) time may be worse than O(n log n) comparison-based sorting.
- **Small datasets:** The overhead of multiple passes and auxiliary arrays makes Radix Sort slower than simpler algorithms like Insertion Sort or even Quick Sort for small inputs.
- **When space is very limited:** The O(n) auxiliary space for the counting sort subroutine may be prohibitive in memory-constrained environments.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)  | Space    | Stable | Notes                                       |
|----------------|------------|----------|--------|---------------------------------------------|
| Radix Sort     | O(nk)     | O(n+k)   | Yes    | Non-comparison; digit-by-digit processing    |
| Counting Sort  | O(n+k)    | O(n+k)   | Yes    | Single pass; limited to small value ranges   |
| Bucket Sort    | O(n+k)    | O(n+k)   | Yes    | Distributes into buckets; works with floats  |
| Quick Sort     | O(n log n)| O(log n) | No     | Comparison-based; general purpose            |

## Implementations

| Language   | File |
|------------|------|
| Python     | [RadixSort.py](python/RadixSort.py) |
| Java       | [RadixSort.java](java/RadixSort.java) |
| C++        | [RadixSort.cpp](cpp/RadixSort.cpp) |
| C          | [RadixSort.c](c/RadixSort.c) |
| Go         | [RadixSort.go](go/RadixSort.go) |
| TypeScript | [index.js](typescript/index.js) |
| Kotlin     | [RadixSort.kt](kotlin/RadixSort.kt) |
| Rust       | [radix_sort.rs](rust/radix_sort.rs) |
| Swift      | [RadixSort.swift](swift/RadixSort.swift) |
| Scala      | [RadixSort.scala](scala/RadixSort.scala) |
| C#         | [RadixSort.cs](csharp/RadixSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 8: Sorting in Linear Time (Section 8.3: Radix Sort).
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.5: Sorting by Distribution.
- [Radix Sort -- Wikipedia](https://en.wikipedia.org/wiki/Radix_sort)
