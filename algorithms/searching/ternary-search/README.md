# Ternary Search

## Overview

Ternary Search is a divide-and-conquer searching algorithm that works on sorted arrays by dividing the search space into three equal parts instead of two. At each step, it compares the target with two midpoints, eliminating one-third of the search space per iteration. While conceptually similar to Binary Search, Ternary Search reduces the search range by a factor of three but requires two comparisons per step.

Ternary Search is more commonly used for finding the maximum or minimum of unimodal functions (functions that have a single peak or valley), where it is particularly elegant. For simple array searching, Binary Search is generally preferred due to fewer comparisons overall.

## How It Works

Ternary Search divides the current range into three equal parts by computing two midpoints: `mid1` at one-third of the range and `mid2` at two-thirds. It then compares the target with the elements at these positions. If the target matches either midpoint, the search succeeds. Otherwise, the algorithm determines which third of the range the target must lie in and recurses on that portion.

### Example

Given sorted input: `[1, 3, 5, 7, 9, 11, 13, 15, 17]`, target = `13`

| Step | low | high | mid1 | mid2 | array[mid1] | array[mid2] | Action |
|------|-----|------|------|------|------------|------------|--------|
| 1 | 0 | 8 | 2 | 5 | `5` | `11` | `13 > 11`, search right third: low = 6 |
| 2 | 6 | 8 | 6 | 7 | `13` | `15` | `13 == array[mid1]`, return index 6 |

Result: Target `13` found at index `6` after 2 iterations (4 comparisons).

**Example where target is not found:**

Given sorted input: `[1, 3, 5, 7, 9, 11, 13, 15, 17]`, target = `6`

| Step | low | high | mid1 | mid2 | array[mid1] | array[mid2] | Action |
|------|-----|------|------|------|------------|------------|--------|
| 1 | 0 | 8 | 2 | 5 | `5` | `11` | `5 < 6 < 11`, search middle third: low = 3, high = 4 |
| 2 | 3 | 4 | 3 | 4 | `7` | `9` | `6 < 7`, search left third: high = 2 |
| 3 | 3 | 2 | -- | -- | -- | -- | `low > high`, return -1 |

Result: Target `6` not found. Return `-1`.

## Pseudocode

```
function ternarySearch(array, target, low, high):
    if low > high:
        return -1

    mid1 = low + (high - low) / 3
    mid2 = high - (high - low) / 3

    if array[mid1] == target:
        return mid1
    if array[mid2] == target:
        return mid2

    if target < array[mid1]:
        return ternarySearch(array, target, low, mid1 - 1)
    else if target > array[mid2]:
        return ternarySearch(array, target, mid2 + 1, high)
    else:
        return ternarySearch(array, target, mid1 + 1, mid2 - 1)
```

Each step reduces the search space to one-third of its previous size, but requires two comparisons per step rather than one.

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(1)       | O(1)  |
| Average | O(log3 n)  | O(1)  |
| Worst   | O(log3 n)  | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The target is found at one of the two midpoints on the very first iteration. Only two comparisons are needed.

- **Average Case -- O(log3 n):** Each iteration reduces the search space to one-third. After k iterations, the search space is n/3^k. Setting this to 1 gives k = log3(n) iterations. However, each iteration requires 2 comparisons, so the total number of comparisons is 2 * log3(n). Since log3(n) = log2(n) / log2(3) ~ log2(n) / 1.585, the total comparisons are approximately 2 * log2(n) / 1.585 ~ 1.26 * log2(n), which is actually more than Binary Search's log2(n) comparisons.

- **Worst Case -- O(log3 n):** The target is not present or is found only after the maximum number of iterations. The same analysis as the average case applies.

- **Space -- O(1):** The iterative version uses only a constant number of variables. The recursive version uses O(log3 n) stack space, but an iterative implementation avoids this.

## When to Use

- **Finding extrema of unimodal functions:** Ternary Search is ideal for finding the maximum or minimum of a function that increases then decreases (or vice versa), such as in optimization problems.
- **Competitive programming:** Ternary Search is a standard technique for optimization on continuous domains where the function is unimodal.
- **When the comparison operation is expensive but elimination is valuable:** In some specialized scenarios, the ability to eliminate two-thirds of the search space per step (at the cost of two comparisons) can be advantageous.

## When NOT to Use

- **Simple sorted array lookup:** Binary Search performs fewer total comparisons (log2(n) vs. ~1.26 * log2(n)) and is simpler to implement.
- **Unsorted data:** Like Binary Search, Ternary Search requires sorted input.
- **Non-unimodal functions:** Ternary Search for finding extrema only works if the function has a single peak or valley. Multimodal functions require different approaches.
- **When Binary Search suffices:** In virtually all array-searching scenarios, Binary Search is preferred because it is simpler, faster, and equally well-understood.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg)    | Space | Comparisons per Step | Notes                                    |
|----------------|--------------|-------|---------------------|------------------------------------------|
| Binary Search  | O(log2 n)    | O(1)  | 1                   | Fewer total comparisons; generally preferred |
| Ternary Search | O(log3 n)    | O(1)  | 2                   | Better for unimodal function optimization |
| Linear Search  | O(n)         | O(1)  | 1                   | No sorting required; slow on large data  |
| Interpolation Search | O(log log n) | O(1) | 1              | Faster on uniformly distributed data     |

## Implementations

| Language   | File |
|------------|------|
| C          | [ternary.c](c/ternary.c) |
| C++        | [TernarySearch.cpp](cpp/TernarySearch.cpp) |
| Java       | [Ternary_search.java](java/Ternary_search.java) |
| Python     | [ternary.py](python/ternary.py) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley.
- [Ternary Search -- Wikipedia](https://en.wikipedia.org/wiki/Ternary_search)
