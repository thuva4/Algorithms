# Interpolation Search

## Overview

Interpolation Search is an improved variant of binary search designed for sorted arrays with uniformly distributed values. Instead of always checking the middle element, it estimates the likely position of the target using linear interpolation based on the target's value relative to the values at the current boundaries. This gives an average-case complexity of O(log log n) for uniformly distributed data, making it significantly faster than binary search for such inputs.

The algorithm was first described by Peterson in 1957. It mirrors how humans naturally search: when looking up a name starting with "W" in a phone book, you open near the end rather than the middle.

## How It Works

1. Set `low = 0` and `high = n - 1`.
2. While `low <= high` and the target is within the range `[arr[low], arr[high]]`:
   - Estimate the position: `pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])`.
   - If `arr[pos] == target`, return `pos`.
   - If `arr[pos] < target`, set `low = pos + 1`.
   - If `arr[pos] > target`, set `high = pos - 1`.
3. Return -1 if the target is not found.

## Worked Example

Array: `[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`, Target: `70`

| Step | low | high | arr[low] | arr[high] | Estimated pos                                    | arr[pos] | Action     |
|------|-----|------|----------|-----------|--------------------------------------------------|----------|------------|
| 1    | 0   | 9    | 10       | 100       | 0 + (70-10)*(9-0)/(100-10) = 0 + 60*9/90 = 6    | 70       | Found!     |

Result: Target `70` found at index **6** in a single probe.

Consider a non-uniform example: `[1, 3, 5, 7, 9, 11]`, Target: `7`

| Step | low | high | arr[low] | arr[high] | Estimated pos                               | arr[pos] | Action      |
|------|-----|------|----------|-----------|---------------------------------------------|----------|-------------|
| 1    | 0   | 5    | 1        | 11        | 0 + (7-1)*(5-0)/(11-1) = 0 + 6*5/10 = 3    | 7        | Found!      |

Result: Target `7` found at index **3** in a single probe.

## Pseudocode

```
function interpolationSearch(array, target):
    low = 0
    high = length(array) - 1

    while low <= high and target >= array[low] and target <= array[high]:
        // Prevent division by zero
        if array[high] == array[low]:
            if array[low] == target:
                return low
            else:
                break

        // Estimate the position using linear interpolation
        pos = low + ((target - array[low]) * (high - low)) / (array[high] - array[low])

        if array[pos] == target:
            return pos
        else if array[pos] < target:
            low = pos + 1
        else:
            high = pos - 1

    return -1
```

## Complexity Analysis

| Case    | Time         | Space |
|---------|--------------|-------|
| Best    | O(1)         | O(1)  |
| Average | O(log log n) | O(1)  |
| Worst   | O(n)         | O(1)  |

**Why these complexities?**

- **Best Case -- O(1):** The interpolation formula directly computes the exact position of the target on the first attempt.

- **Average Case -- O(log log n):** For uniformly distributed data, each probe eliminates a large fraction of the remaining search space. The interpolation formula estimates the target's position with high accuracy, and the number of probes needed grows as the iterated logarithm of n. This double-logarithmic performance is a significant improvement over binary search's O(log n).

- **Worst Case -- O(n):** When the data distribution is highly skewed (for example, exponentially distributed values), the interpolation formula makes poor estimates and may only eliminate one element per probe. In such cases, it degenerates to linear search.

- **Space -- O(1):** The algorithm uses only a constant number of variables (low, high, pos) regardless of input size.

## When to Use

- **Uniformly distributed sorted data:** Interpolation Search achieves O(log log n), which is significantly faster than binary search's O(log n) for large, uniformly distributed datasets.
- **Database index lookups:** When database keys are approximately uniformly distributed, interpolation search can locate records much faster than binary search.
- **Telephone directory or dictionary lookup:** Natural datasets like alphabetically sorted names often have roughly uniform distribution across first letters.
- **Large datasets where constant-factor improvements matter:** For very large arrays, the difference between O(log n) and O(log log n) is meaningful.

## When NOT to Use

- **Non-uniformly distributed data:** If values are clustered or follow an exponential, logarithmic, or other skewed distribution, interpolation search can degrade to O(n) in the worst case.
- **Unsorted data:** The algorithm requires the input array to be sorted.
- **Small arrays:** For small inputs, the overhead of the interpolation calculation provides no benefit over binary search or even linear search.
- **Integer overflow risk:** The interpolation formula involves multiplication of potentially large values (`(target - arr[low]) * (high - low)`), which can overflow on certain data types without careful implementation.
- **Arrays with many duplicate values:** When `arr[low] == arr[high]` but the target differs, the formula involves division by zero.

## Comparison with Similar Algorithms

| Algorithm            | Time (avg)    | Space | Notes                                                    |
|----------------------|---------------|-------|----------------------------------------------------------|
| Interpolation Search | O(log log n)  | O(1)  | Fastest for uniformly distributed data; O(n) worst case  |
| Binary Search        | O(log n)      | O(1)  | Reliable O(log n) regardless of distribution             |
| Fibonacci Search     | O(log n)      | O(1)  | Uses only addition/subtraction; good for sequential media|
| Exponential Search   | O(log i)      | O(1)  | Best when target is near the beginning                   |
| Jump Search          | O(sqrt(n))    | O(1)  | Simple; suited for sequential access                     |

## Implementations

| Language   | File |
|------------|------|
| Python     | [interpolation_search.py](python/interpolation_search.py) |
| Java       | [InterpolationSearch.java](java/InterpolationSearch.java) |
| C++        | [interpolation_search.cpp](cpp/interpolation_search.cpp) |
| C          | [interpolation_search.c](c/interpolation_search.c) |
| Go         | [interpolation_search.go](go/interpolation_search.go) |
| TypeScript | [interpolationSearch.ts](typescript/interpolationSearch.ts) |
| Rust       | [interpolation_search.rs](rust/interpolation_search.rs) |
| Kotlin     | [InterpolationSearch.kt](kotlin/InterpolationSearch.kt) |
| Swift      | [InterpolationSearch.swift](swift/InterpolationSearch.swift) |
| Scala      | [InterpolationSearch.scala](scala/InterpolationSearch.scala) |
| C#         | [InterpolationSearch.cs](csharp/InterpolationSearch.cs) |

## References

- Peterson, W. W. (1957). "Addressing for random-access storage." *IBM Journal of Research and Development*, 1(2), 130-146.
- Perl, Y., Itai, A., & Avni, H. (1978). "Interpolation search -- a log log n search." *Communications of the ACM*, 21(7), 550-553.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- [Interpolation Search -- Wikipedia](https://en.wikipedia.org/wiki/Interpolation_search)
