# Pigeonhole Sort

## Overview

Pigeonhole Sort is a non-comparison sorting algorithm suitable for sorting elements where the range of key values is approximately equal to the number of elements. It works by distributing elements into "pigeonholes" (one for each possible key value in the range) and then collecting them in order. The algorithm is a specialized form of counting sort that handles duplicate values naturally by storing lists of elements in each pigeonhole rather than just counts.

Pigeonhole Sort is named after the Pigeonhole Principle in mathematics, which states that if n items are placed into m containers with n > m, at least one container must hold more than one item.

## How It Works

1. **Find the range:** Determine the minimum and maximum values in the input array. The range is `max - min + 1`.
2. **Create pigeonholes:** Allocate an array of empty lists (pigeonholes) with size equal to the range.
3. **Distribute:** Place each element into its corresponding pigeonhole at index `value - min`.
4. **Collect:** Iterate through the pigeonholes in order and concatenate all elements back into the output array.

## Example

Given input: `[8, 3, 2, 7, 4, 6, 8, 2, 5]`

**Step 1 -- Find range:** min = 2, max = 8, range = 7

**Step 2 -- Create 7 pigeonholes** (indices 0 through 6, representing values 2 through 8):

**Step 3 -- Distribute elements:**

| Pigeonhole Index | Value | Elements |
|-----------------|-------|----------|
| 0 | 2 | `[2, 2]` |
| 1 | 3 | `[3]` |
| 2 | 4 | `[4]` |
| 3 | 5 | `[5]` |
| 4 | 6 | `[6]` |
| 5 | 7 | `[7]` |
| 6 | 8 | `[8, 8]` |

**Step 4 -- Collect in order:**

Result: `[2, 2, 3, 4, 5, 6, 7, 8, 8]`

## Pseudocode

```
function pigeonholeSort(array):
    n = length(array)
    if n == 0:
        return array

    // Step 1: Find range
    min_val = minimum(array)
    max_val = maximum(array)
    range = max_val - min_val + 1

    // Step 2: Create pigeonholes
    holes = array of 'range' empty lists

    // Step 3: Distribute elements
    for each element in array:
        holes[element - min_val].append(element)

    // Step 4: Collect elements
    index = 0
    for i from 0 to range - 1:
        for each element in holes[i]:
            array[index] = element
            index = index + 1

    return array
```

## Complexity Analysis

| Case    | Time          | Space     |
|---------|--------------|-----------|
| Best    | O(n + range)  | O(n + range) |
| Average | O(n + range)  | O(n + range) |
| Worst   | O(n + range)  | O(n + range) |

Where range = max - min + 1.

**Why these complexities?**

- **Time -- O(n + range):** Finding min and max requires O(n). Creating pigeonholes requires O(range). Distributing n elements takes O(n). Collecting elements requires iterating over all pigeonholes O(range) plus moving all n elements O(n). Total: O(n + range).

- **Space -- O(n + range):** The pigeonhole array requires O(range) entries, and storing all n elements across the pigeonholes requires O(n) total space. When range is approximately n, this is O(n).

## When to Use

- **Dense integer data:** When the range of values is close to the number of elements (range is approximately n). For example, sorting employee ages, exam scores (0-100), or ratings (1-5).
- **When stability is required:** Pigeonhole Sort is naturally stable -- elements with equal keys maintain their relative input order.
- **Known, bounded range:** When the minimum and maximum values are known in advance or the range is guaranteed to be small.
- **Sorting with satellite data:** Unlike Counting Sort (which only counts), Pigeonhole Sort stores the actual elements, making it easy to sort objects by a numeric key while preserving associated data.

## When NOT to Use

- **Large, sparse ranges:** If the range is much larger than n (e.g., sorting 100 elements with values between 1 and 1,000,000), the algorithm wastes enormous amounts of memory on empty pigeonholes and time initializing them.
- **Floating-point or non-integer data:** The algorithm requires integer-like keys that can serve as array indices. For floating-point data, use bucket sort instead.
- **Unknown or unbounded ranges:** If the range of values is not known in advance or can be arbitrarily large, Pigeonhole Sort is impractical.
- **Memory-constrained environments:** The O(range) space requirement can be prohibitive for large ranges.

## Comparison

| Algorithm       | Time          | Space       | Stable | Requirement |
|-----------------|--------------|-------------|--------|-------------|
| Pigeonhole Sort | O(n + range)  | O(n + range) | Yes   | range ~ n |
| Counting Sort   | O(n + k)      | O(k)        | Yes    | Integer keys in [0, k) |
| Bucket Sort     | O(n + k)      | O(n + k)    | Yes    | Uniform distribution |
| Radix Sort      | O(n * d)      | O(n + b)    | Yes    | Fixed-length keys |
| Insertion Sort  | O(n^2)        | O(1)        | Yes    | None |

## Implementations

| Language   | File |
|------------|------|
| Python     | [pigeonhole_sort.py](python/pigeonhole_sort.py) |
| Java       | [PigeonholeSort.java](java/PigeonholeSort.java) |
| C++        | [pigeonhole_sort.cpp](cpp/pigeonhole_sort.cpp) |
| C          | [pigeonhole_sort.c](c/pigeonhole_sort.c) |
| Go         | [pigeonhole_sort.go](go/pigeonhole_sort.go) |
| TypeScript | [pigeonholeSort.ts](typescript/pigeonholeSort.ts) |
| Kotlin     | [PigeonholeSort.kt](kotlin/PigeonholeSort.kt) |
| Rust       | [pigeonhole_sort.rs](rust/pigeonhole_sort.rs) |
| Swift      | [PigeonholeSort.swift](swift/PigeonholeSort.swift) |
| Scala      | [PigeonholeSort.scala](scala/PigeonholeSort.scala) |
| C#         | [PigeonholeSort.cs](csharp/PigeonholeSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 8: Sorting in Linear Time.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.5: Sorting by Distribution.
- [Pigeonhole Sort -- Wikipedia](https://en.wikipedia.org/wiki/Pigeonhole_sort)
