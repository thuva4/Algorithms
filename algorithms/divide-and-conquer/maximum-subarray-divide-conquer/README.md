# Maximum Subarray (Divide and Conquer)

## Overview

The Maximum Subarray problem finds the contiguous subarray within a one-dimensional array of numbers that has the largest sum. While Kadane's algorithm solves this in O(n), the divide-and-conquer approach runs in O(n log n) and serves as an important pedagogical example of the divide-and-conquer paradigm. This approach was presented in the classic textbook *Introduction to Algorithms* by Cormen et al. (CLRS) as a motivating example for divide-and-conquer before introducing Strassen's algorithm.

The problem has applications in stock trading (finding the best buy/sell window), image processing (maximum brightness region), and genomics (finding regions of high GC content in DNA sequences).

## How It Works

1. **Base case:** A single element -- the maximum subarray is the element itself.
2. **Divide:** Split the array at the midpoint into left and right halves.
3. **Conquer:** Recursively find the maximum subarray in each half.
4. **Combine:** Find the maximum subarray that crosses the midpoint by extending greedily in both directions from the midpoint.
5. Return the maximum of left_max, right_max, and cross_max.

The crossing subarray must include at least one element from each half. To find it, scan left from mid to find the best left extension, then scan right from mid+1 to find the best right extension. Their sum is the crossing maximum.

## Worked Example

Given array: `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

**Level 1: Split at index 4**
- Left half: `[-2, 1, -3, 4, -1]`
- Right half: `[2, 1, -5, 4]`

**Left half recursion (split at index 2):**
- Left-left: `[-2, 1, -3]` --> best = 1 (just element `1`)
- Left-right: `[4, -1]` --> best = 4 (just element `4`)
- Cross from index 2: extend left from index 2: -3, then -3+1=-2, then -2+(-2)=-4. Best left sum = -3 at index 2. Extend right from index 3: 4, then 4+(-1)=3. Best right sum = 4 at index 3. Cross = -3 + 4 = 1.
- Left half maximum = max(1, 4, 1) = **4**

**Right half recursion (split at index 6):**
- Right-left: `[2, 1]` --> best = 3 (both elements)
- Right-right: `[-5, 4]` --> best = 4 (just element `4`)
- Cross from index 6: extend left: 1, then 1+2=3. Best = 3. Extend right: -5. Best = -5. Cross = 3 + (-5) = -2.
- Right half maximum = max(3, 4, -2) = **4**

**Crossing subarray at level 1 (crossing index 4):**
- Extend left from index 4: -1, -1+4=3, 3+(-3)=0, 0+1=1, 1+(-2)=-1. Best left sum = 3 (indices 3-4).
- Extend right from index 5: 2, 2+1=3, 3+(-5)=-2, -2+4=2. Best right sum = 3 (indices 5-6).
- Cross = 3 + 3 = **6** (subarray `[4, -1, 2, 1]`)

**Final answer:** max(4, 4, 6) = **6**, corresponding to subarray `[4, -1, 2, 1]`.

## Pseudocode

```
function maxSubarrayDC(arr, low, high):
    if low == high:
        return arr[low]

    mid = floor((low + high) / 2)

    left_max = maxSubarrayDC(arr, low, mid)
    right_max = maxSubarrayDC(arr, mid + 1, high)
    cross_max = maxCrossingSubarray(arr, low, mid, high)

    return max(left_max, right_max, cross_max)

function maxCrossingSubarray(arr, low, mid, high):
    // Find best sum extending left from mid
    left_sum = -infinity
    sum = 0
    for i = mid downto low:
        sum = sum + arr[i]
        if sum > left_sum:
            left_sum = sum

    // Find best sum extending right from mid+1
    right_sum = -infinity
    sum = 0
    for j = mid + 1 to high:
        sum = sum + arr[j]
        if sum > right_sum:
            right_sum = sum

    return left_sum + right_sum
```

## Complexity Analysis

| Case    | Time       | Space    |
|---------|-----------|----------|
| Best    | O(n log n) | O(log n) |
| Average | O(n log n) | O(log n) |
| Worst   | O(n log n) | O(log n) |

**Why these complexities?**

- **Time -- O(n log n):** The algorithm divides the problem into two halves (each of size n/2) and performs O(n) work to find the crossing subarray. By the Master Theorem, T(n) = 2T(n/2) + O(n) gives T(n) = O(n log n). There are log n levels in the recursion tree, and each level performs O(n) total work.

- **Space -- O(log n):** The recursion depth is O(log n), and each recursive call uses O(1) extra space. No auxiliary arrays are needed since the algorithm works in-place on the original array.

## When to Use

- **Teaching divide-and-conquer:** This is an excellent example for introducing the paradigm because the problem is easy to understand and the three-way decomposition (left, right, crossing) is intuitive.
- **When you need subarray boundaries:** The divide-and-conquer approach naturally tracks the indices of the maximum subarray, which can be useful for further processing.
- **Parallel computing:** The left and right recursive calls are independent and can be executed in parallel, giving O(n) span with O(n log n) work, achieving efficient parallelism.
- **When the problem generalizes:** The technique extends to higher dimensions (e.g., maximum sum rectangle in a 2D matrix).

## When NOT to Use

- **When O(n) is needed:** Kadane's algorithm solves the same problem in O(n) time and O(1) space, making it strictly better for serial execution. Always prefer Kadane's for production code.
- **When all elements are negative:** Both approaches handle this correctly, but it is important to decide the convention (return the least negative element, or return 0 for an empty subarray).
- **Very large arrays in memory-constrained environments:** While O(log n) space is efficient, Kadane's O(1) space is even better.

## Comparison

| Algorithm             | Time       | Space    | Notes                                    |
|----------------------|-----------|----------|------------------------------------------|
| Kadane's Algorithm    | O(n)      | O(1)     | Optimal serial solution; simple to code  |
| **Divide & Conquer**  | **O(n log n)** | **O(log n)** | **Parallelizable; good for teaching**   |
| Brute Force           | O(n^2)    | O(1)     | Try all subarrays; simple but slow       |
| Prefix Sum            | O(n)      | O(n)     | Uses prefix sums; equivalent to Kadane's |

## Implementations

| Language   | File |
|------------|------|
| Python     | [maximum_subarray_divide_conquer.py](python/maximum_subarray_divide_conquer.py) |
| Java       | [MaximumSubarrayDivideConquer.java](java/MaximumSubarrayDivideConquer.java) |
| C++        | [maximum_subarray_divide_conquer.cpp](cpp/maximum_subarray_divide_conquer.cpp) |
| C          | [maximum_subarray_divide_conquer.c](c/maximum_subarray_divide_conquer.c) |
| Go         | [maximum_subarray_divide_conquer.go](go/maximum_subarray_divide_conquer.go) |
| TypeScript | [maximumSubarrayDivideConquer.ts](typescript/maximumSubarrayDivideConquer.ts) |
| Rust       | [maximum_subarray_divide_conquer.rs](rust/maximum_subarray_divide_conquer.rs) |
| Kotlin     | [MaximumSubarrayDivideConquer.kt](kotlin/MaximumSubarrayDivideConquer.kt) |
| Swift      | [MaximumSubarrayDivideConquer.swift](swift/MaximumSubarrayDivideConquer.swift) |
| Scala      | [MaximumSubarrayDivideConquer.scala](scala/MaximumSubarrayDivideConquer.scala) |
| C#         | [MaximumSubarrayDivideConquer.cs](csharp/MaximumSubarrayDivideConquer.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 4.1: The Maximum-Subarray Problem.
- Bentley, J. (1984). "Programming Pearls: Algorithm Design Techniques." *Communications of the ACM*, 27(9), 865-873.
- Kadane, J. B. (original algorithm, 1984, as cited in Bentley's column).
- [Maximum Subarray Problem -- Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
