# Fibonacci Search

## Overview

Fibonacci Search is a comparison-based search algorithm for sorted arrays that uses Fibonacci numbers to divide the search space into unequal parts. Unlike binary search, which splits the array in half, Fibonacci Search splits it according to consecutive Fibonacci numbers. This approach can be advantageous on systems where accessing later elements is more expensive than accessing earlier ones (for example, data stored on magnetic tape), because Fibonacci Search tends to examine elements closer to the beginning of the array first.

The algorithm was described by Kiefer in 1953 and later formalized by Ferguson in 1960. It operates in O(log n) time, the same as binary search, but uses only addition and subtraction (no division), which can be beneficial on hardware where division is slow.

## How It Works

1. Find the smallest Fibonacci number `F(m)` that is greater than or equal to the array length `n`. Let `F(m-1)` and `F(m-2)` be the two preceding Fibonacci numbers.
2. Set an offset of -1 (the start of the eliminated range).
3. While `F(m-2)` is greater than 0:
   - Compute the index `i = min(offset + F(m-2), n - 1)`.
   - If `arr[i]` equals the target, return `i`.
   - If `arr[i]` is less than the target, move the Fibonacci numbers two steps down: `F(m) = F(m-1)`, `F(m-1) = F(m-2)`, and update the offset to `i`.
   - If `arr[i]` is greater than the target, move the Fibonacci numbers one step down: `F(m) = F(m-2)`, `F(m-1) = F(m-1) - F(m-2)`.
4. If there is one remaining element, check whether it matches the target.
5. Return -1 if the target is not found.

## Worked Example

Array: `[4, 8, 14, 21, 33, 47, 55, 68, 72, 89, 91, 98]` (length 12), Target: `47`

The Fibonacci numbers: 1, 1, 2, 3, 5, 8, 13. The smallest Fibonacci number >= 12 is **13**.
So: `F(m) = 13`, `F(m-1) = 8`, `F(m-2) = 5`, offset = -1.

| Step | F(m) | F(m-1) | F(m-2) | offset | Index i            | arr[i] | Comparison      | Action              |
|------|------|--------|--------|--------|--------------------|--------|-----------------|---------------------|
| 1    | 13   | 8      | 5      | -1     | min(-1+5, 11) = 4  | 33     | 33 < 47         | Move two steps down; offset = 4 |
| 2    | 8    | 5      | 3      | 4      | min(4+3, 11) = 7   | 68     | 68 > 47         | Move one step down  |
| 3    | 3    | 2      | 1      | 4      | min(4+1, 11) = 5   | 47     | 47 == 47        | Found!              |

Result: Target `47` found at index **5**.

## Pseudocode

```
function fibonacciSearch(array, target):
    n = length(array)

    // Initialize Fibonacci numbers
    fib2 = 0             // F(m-2)
    fib1 = 1             // F(m-1)
    fib  = fib1 + fib2   // F(m)

    while fib < n:
        fib2 = fib1
        fib1 = fib
        fib  = fib1 + fib2

    offset = -1

    while fib2 > 0:
        i = min(offset + fib2, n - 1)

        if array[i] < target:
            fib  = fib1
            fib1 = fib2
            fib2 = fib - fib1
            offset = i
        else if array[i] > target:
            fib  = fib2
            fib1 = fib1 - fib2
            fib2 = fib - fib1
        else:
            return i

    // Check the last remaining element
    if fib1 == 1 and offset + 1 < n and array[offset + 1] == target:
        return offset + 1

    return -1
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(1)     | O(1)  |
| Average | O(log n) | O(1)  |
| Worst   | O(log n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The target is located at the first index examined, requiring only one comparison.

- **Average and Worst Case -- O(log n):** Each iteration reduces the search space by at least one-third (since Fibonacci numbers grow exponentially, roughly by a factor of the golden ratio ~1.618). This means the number of iterations is proportional to the logarithm of n, specifically about log_phi(n) where phi is the golden ratio.

- **Space -- O(1):** The algorithm only uses a constant number of variables to track the current Fibonacci numbers and the offset.

## When to Use

- **Sequential or semi-sequential access:** On storage media where accessing elements at lower indices is cheaper, Fibonacci Search has an advantage because it tends to probe positions nearer the beginning.
- **Hardware without fast division:** Fibonacci Search uses only addition and subtraction to compute probe positions, avoiding the integer division required by binary search.
- **Sorted arrays where O(log n) search is needed:** It offers the same asymptotic performance as binary search with different practical trade-offs.
- **When cache locality matters:** The non-uniform splitting may yield better cache behavior in some memory hierarchies.

## When NOT to Use

- **Unsorted data:** Like all comparison-based search algorithms for sorted arrays, Fibonacci Search requires the input to be sorted.
- **Uniformly distributed data:** Interpolation Search achieves O(log log n) on uniformly distributed data, outperforming Fibonacci Search.
- **Small arrays:** For very small datasets, linear search is simpler and has comparable performance due to lower constant overhead.
- **When code simplicity is paramount:** Binary search is simpler to implement and understand, and performs equally well on random-access data structures.

## Comparison with Similar Algorithms

| Algorithm            | Time (avg)    | Space | Division-Free | Notes                                              |
|----------------------|---------------|-------|---------------|----------------------------------------------------|
| Fibonacci Search     | O(log n)      | O(1)  | Yes           | Uses only addition/subtraction; good for sequential access |
| Binary Search        | O(log n)      | O(1)  | No            | Simplest O(log n) search; requires division         |
| Exponential Search   | O(log i)      | O(1)  | No            | Better when target is near the beginning            |
| Interpolation Search | O(log log n)  | O(1)  | No            | Fastest for uniformly distributed data              |
| Jump Search          | O(sqrt(n))    | O(1)  | No            | Simpler; good for sequential access                 |

## Implementations

| Language   | File |
|------------|------|
| Python     | [fibonacci_search.py](python/fibonacci_search.py) |
| Java       | [FibonacciSearch.java](java/FibonacciSearch.java) |
| C++        | [fibonacci_search.cpp](cpp/fibonacci_search.cpp) |
| C          | [fibonacci_search.c](c/fibonacci_search.c) |
| Go         | [fibonacci_search.go](go/fibonacci_search.go) |
| TypeScript | [fibonacciSearch.ts](typescript/fibonacciSearch.ts) |
| Rust       | [fibonacci_search.rs](rust/fibonacci_search.rs) |
| Kotlin     | [FibonacciSearch.kt](kotlin/FibonacciSearch.kt) |
| Swift      | [FibonacciSearch.swift](swift/FibonacciSearch.swift) |
| Scala      | [FibonacciSearch.scala](scala/FibonacciSearch.scala) |
| C#         | [FibonacciSearch.cs](csharp/FibonacciSearch.cs) |

## References

- Kiefer, J. (1953). "Sequential minimax search for a maximum." *Proceedings of the American Mathematical Society*, 4(3), 502-506.
- Ferguson, D. E. (1960). "Fibonaccian searching." *Communications of the ACM*, 3(12), 648.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.2.1.
- [Fibonacci Search -- Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_search_technique)
