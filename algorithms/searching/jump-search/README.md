# Jump Search

## Overview

Jump Search is a searching algorithm for sorted arrays that works by jumping ahead in fixed-size blocks and then performing a linear search within the block where the target might reside. The optimal block size is the square root of the array length, giving an O(sqrt(n)) time complexity. Jump Search offers a middle ground between linear search (O(n)) and binary search (O(log n)), and is particularly useful on systems where jumping forward is cheap but jumping backward is expensive.

The algorithm is sometimes called Block Search because it divides the array into blocks of fixed size and searches block by block.

## How It Works

1. Compute the optimal jump size: `step = floor(sqrt(n))`.
2. Starting from index 0, jump forward by `step` positions until either:
   - The element at the current position is greater than or equal to the target, or
   - The end of the array is reached.
3. Perform a linear search backward from the current position to the previous jump position.
4. Return the index if found, or -1 otherwise.

## Worked Example

Array: `[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31]` (length 16), Target: `21`

Jump size: `floor(sqrt(16)) = 4`

**Phase 1 -- Jump forward in blocks of 4:**

| Step | Index | arr[index] | Comparison   | Action        |
|------|-------|------------|--------------|---------------|
| 1    | 0     | 1          | 1 < 21       | Jump forward  |
| 2    | 4     | 9          | 9 < 21       | Jump forward  |
| 3    | 8     | 17         | 17 < 21      | Jump forward  |
| 4    | 12    | 25         | 25 >= 21     | Stop jumping  |

Target must be in the block between indices 8 and 12.

**Phase 2 -- Linear search from index 8:**

| Step | Index | arr[index] | Comparison   | Action    |
|------|-------|------------|--------------|-----------|
| 1    | 8     | 17         | 17 != 21     | Next      |
| 2    | 9     | 19         | 19 != 21     | Next      |
| 3    | 10    | 21         | 21 == 21     | Found!    |

Result: Target `21` found at index **10**.

## Pseudocode

```
function jumpSearch(array, target):
    n = length(array)
    step = floor(sqrt(n))

    // Phase 1: Jump forward to find the block
    prev = 0
    curr = step
    while curr < n and array[curr] < target:
        prev = curr
        curr = curr + step

    // Phase 2: Linear search within the block
    for i from prev to min(curr, n - 1):
        if array[i] == target:
            return i

    return -1
```

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(1)       | O(1)  |
| Average | O(sqrt(n)) | O(1)  |
| Worst   | O(sqrt(n)) | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The target is at the first position checked (index 0), so it is found immediately.

- **Average and Worst Case -- O(sqrt(n)):** With a jump size of sqrt(n), the algorithm makes at most sqrt(n) jumps in the first phase to identify the correct block. The subsequent linear search within the block examines at most sqrt(n) elements. The total number of comparisons is at most 2 * sqrt(n), which is O(sqrt(n)).

- **Space -- O(1):** The algorithm uses only a few variables (step, prev, curr) and requires no additional data structures.

## When to Use

- **Sorted arrays with sequential access:** Jump Search is well-suited for systems where jumping forward is efficient but backward movement is costly, such as linked lists with skip pointers or data stored on tape.
- **When binary search overhead is too high:** On some hardware, the overhead of binary search (computing midpoints, maintaining two pointers) may exceed the benefit for moderate-sized arrays.
- **Simple implementation needed:** Jump Search is straightforward to implement and understand, making it a good choice for embedded systems or teaching environments.
- **When the array fits in cache:** For arrays that fit in L1/L2 cache, the linear scan phase benefits from sequential access patterns.

## When NOT to Use

- **Large arrays where O(log n) is needed:** For very large datasets, binary search (O(log n)) vastly outperforms Jump Search (O(sqrt(n))). For example, on an array of 1,000,000 elements, binary search needs about 20 comparisons while jump search needs about 2,000.
- **Unsorted data:** Jump Search requires the input to be sorted.
- **Uniformly distributed data:** Interpolation Search achieves O(log log n) on uniform data, which is far superior.
- **When random access is available and array is large:** With efficient random access, binary search is almost always a better choice for large arrays.

## Comparison with Similar Algorithms

| Algorithm            | Time (avg)    | Space | Notes                                              |
|----------------------|---------------|-------|----------------------------------------------------|
| Jump Search          | O(sqrt(n))    | O(1)  | Simple; good for sequential access                 |
| Linear Search        | O(n)          | O(1)  | No prerequisites; works on unsorted data            |
| Binary Search        | O(log n)      | O(1)  | Much faster on large arrays; needs random access    |
| Interpolation Search | O(log log n)  | O(1)  | Fastest for uniformly distributed data              |
| Exponential Search   | O(log i)      | O(1)  | Best when target is near the beginning              |

## Implementations

| Language   | File |
|------------|------|
| Python     | [jump_search.py](python/jump_search.py) |
| Java       | [JumpSearch.java](java/JumpSearch.java) |
| C++        | [jump_search.cpp](cpp/jump_search.cpp) |
| C          | [jump_search.c](c/jump_search.c) |
| Go         | [jump_search.go](go/jump_search.go) |
| TypeScript | [jumpSearch.ts](typescript/jumpSearch.ts) |
| Rust       | [jump_search.rs](rust/jump_search.rs) |
| Kotlin     | [JumpSearch.kt](kotlin/JumpSearch.kt) |
| Swift      | [JumpSearch.swift](swift/JumpSearch.swift) |
| Scala      | [JumpSearch.scala](scala/JumpSearch.scala) |
| C#         | [JumpSearch.cs](csharp/JumpSearch.cs) |

## References

- Nemeth, G. (1969). "Searching in a file using jump search." *Journal of the ACM*.
- Baeza-Yates, R. A., & Salton, G. (1989). "A comparison of search algorithms." In *Algorithms and Data Structures*, 1-14.
- [Jump Search -- Wikipedia](https://en.wikipedia.org/wiki/Jump_search)
