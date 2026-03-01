# Bitonic Sort

## Overview

Bitonic Sort is a comparison-based parallel sorting algorithm designed by Ken Batcher in 1968. It works by first constructing a bitonic sequence (a sequence that monotonically increases then decreases, or can be circularly shifted to have this property) and then repeatedly merging bitonic sequences into sorted order. The algorithm's key strength is its fixed comparison pattern that does not depend on the data, making it highly suitable for parallel and hardware implementations such as GPU sorting and sorting networks.

Bitonic Sort requires the input size to be a power of 2. If the input is not a power of 2, it must be padded with sentinel values (e.g., infinity for ascending sort).

## How It Works

1. **Build bitonic sequences:** Starting with pairs of elements, sort alternating pairs in ascending and descending order to create small bitonic sequences.
2. **Bitonic merge:** Recursively merge pairs of bitonic sequences. A bitonic merge compares elements that are a fixed distance apart and swaps them if needed to maintain the desired direction (ascending or descending).
3. **Repeat at increasing scales:** Double the merge size at each stage until the entire array forms a single sorted sequence.

The algorithm proceeds in `log(n)` stages, where stage `k` builds bitonic sequences of size `2^k` and merges them. Each stage consists of `k` merge passes, each performing `n/2` compare-and-swap operations.

## Example

Given input: `[7, 3, 5, 1, 6, 2, 8, 4]` (n = 8)

**Stage 1 -- Create bitonic pairs (size 2):**
- Sort `[7,3]` ascending: `[3,7]`
- Sort `[5,1]` descending: `[5,1]`
- Sort `[6,2]` ascending: `[2,6]`
- Sort `[8,4]` descending: `[8,4]`
- Result: `[3, 7, 5, 1, 2, 6, 8, 4]`

**Stage 2 -- Merge into bitonic sequences of size 4:**
- Merge `[3,7,5,1]` ascending:
  - Compare distance-2 pairs: (3,5)->(3,5), (7,1)->(1,7) -> `[3, 1, 5, 7]`
  - Compare distance-1 pairs: (3,1)->(1,3), (5,7)->(5,7) -> `[1, 3, 5, 7]`
- Merge `[2,6,8,4]` descending:
  - Compare distance-2 pairs: (2,8)->(8,2), (6,4)->(6,4) -> `[8, 6, 2, 4]`
  - Compare distance-1 pairs: (8,6)->(8,6), (2,4)->(4,2) -> `[8, 6, 4, 2]`
- Result: `[1, 3, 5, 7, 8, 6, 4, 2]`

**Stage 3 -- Final bitonic merge (size 8, ascending):**
- Compare distance-4: (1,8)->(1,8), (3,6)->(3,6), (5,4)->(4,5), (7,2)->(2,7) -> `[1, 3, 4, 2, 8, 6, 5, 7]`
- Compare distance-2: (1,4)->(1,4), (3,2)->(2,3), (8,5)->(5,8), (6,7)->(6,7) -> `[1, 2, 4, 3, 5, 6, 8, 7]`
- Compare distance-1: (1,2)->(1,2), (4,3)->(3,4), (5,6)->(5,6), (8,7)->(7,8) -> `[1, 2, 3, 4, 5, 6, 7, 8]`

Result: `[1, 2, 3, 4, 5, 6, 7, 8]`

## Pseudocode

```
function bitonicSort(array, n):
    // k is the size of bitonic sequences being merged
    for k from 2 to n (doubling each time):
        // j is the distance between compared elements
        for j from k/2 down to 1 (halving each time):
            for i from 0 to n - 1:
                // Determine partner to compare with
                partner = i XOR j
                if partner > i:
                    // Determine sort direction based on which k-block we're in
                    ascending = ((i AND k) == 0)
                    if ascending and array[i] > array[partner]:
                        swap(array[i], array[partner])
                    if not ascending and array[i] < array[partner]:
                        swap(array[i], array[partner])
    return array
```

## Complexity Analysis

| Case    | Time             | Space |
|---------|-----------------|-------|
| Best    | O(n log^2 n)    | O(1)  |
| Average | O(n log^2 n)    | O(1)  |
| Worst   | O(n log^2 n)    | O(1)  |

**Parallel time:** O(log^2 n) with n/2 processors.

**Why these complexities?**

- **Time -- O(n log^2 n):** There are log(n) stages. Stage k requires k merge passes, and each pass performs n/2 comparisons. Total comparisons = n/2 * (1 + 2 + ... + log n) = n/2 * log(n) * (log(n)+1) / 2 = O(n log^2 n).

- **Space -- O(1):** The algorithm sorts in-place using only compare-and-swap operations. No additional arrays are needed. The recursive version uses O(log^2 n) stack space.

- **Parallel time -- O(log^2 n):** With n/2 processors, each merge pass takes O(1) time (all comparisons are independent), and there are O(log^2 n) total passes.

## When to Use

- **GPU sorting:** The fixed, data-independent comparison pattern maps perfectly to GPU architectures (CUDA, OpenCL).
- **Hardware sorting networks:** Used in FPGA and ASIC designs where the comparison network must be fixed at design time.
- **When parallelism is abundant:** The algorithm achieves near-optimal parallel speedup with n/2 processors.
- **When branch prediction matters:** The fixed comparison pattern avoids data-dependent branches, which is beneficial on some architectures.

## When NOT to Use

- **Sequential execution:** With O(n log^2 n) sequential time, it is slower than O(n log n) algorithms like merge sort or quicksort.
- **Non-power-of-2 sizes:** Requires padding, which wastes memory and computation.
- **When stability is needed:** Bitonic sort is not a stable sorting algorithm.
- **Variable-size inputs:** The sorting network is fixed for a given n, so it cannot easily handle dynamic input sizes.

## Comparison

| Algorithm      | Time (sequential) | Time (parallel) | Space | Stable | Notes |
|----------------|------------------|-----------------|-------|--------|-------|
| Bitonic Sort   | O(n log^2 n)     | O(log^2 n)      | O(1)  | No     | Best for GPU/hardware |
| Merge Sort     | O(n log n)       | O(log n)        | O(n)  | Yes    | Faster sequential; needs memory |
| Odd-Even Merge | O(n log^2 n)     | O(log^2 n)      | O(1)  | No     | Similar to bitonic; Batcher's other network |
| Quick Sort     | O(n log n)       | O(log^2 n)      | O(log n) | No  | Faster sequential; poor parallel |
| Radix Sort     | O(n * w)         | O(w)            | O(n)  | Yes    | Non-comparison; good for integers |

## Implementations

| Language   | File |
|------------|------|
| Java       | [BitonicSort.java](java/BitonicSort.java) |
| C++        | [bitonic_sort.cpp](cpp/bitonic_sort.cpp) |
| C          | [bitonic_sort.c](c/bitonic_sort.c) |

## References

- Batcher, K. E. (1968). "Sorting Networks and Their Applications." *Proceedings of the AFIPS Spring Joint Computer Conference*, 32, 307-314.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 27: Multithreaded Algorithms.
- [Bitonic Sorter -- Wikipedia](https://en.wikipedia.org/wiki/Bitonic_sorter)
