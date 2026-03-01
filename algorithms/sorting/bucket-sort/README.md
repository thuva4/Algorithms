# Bucket Sort

## Overview

Bucket Sort is a distribution-based sorting algorithm that works by distributing elements into a number of "buckets," sorting each bucket individually (typically using insertion sort or another simple algorithm), and then concatenating all the sorted buckets to produce the final sorted array. It is particularly efficient when the input data is uniformly distributed over a known range.

Bucket Sort achieves linear average-case time complexity O(n + k) when the data is uniformly distributed, where k is the number of buckets. It is widely used in applications such as sorting floating-point numbers in a bounded range and as a subroutine in radix sort implementations.

## How It Works

1. Determine the minimum and maximum values in the input to establish the range.
2. Create `k` empty buckets, each representing a sub-range of the total range.
3. Distribute each element into the appropriate bucket based on its value: `bucket_index = floor((value - min) * k / (max - min + 1))`.
4. Sort each individual bucket (commonly using insertion sort).
5. Concatenate all buckets in order to produce the sorted output.

## Worked Example

Given input: `[29, 25, 3, 49, 9, 37, 21, 43]`, using 5 buckets.

Range: min = 3, max = 49, span = 47.

**Step 1 -- Distribute elements into buckets:**

| Element | Bucket Index                      | Bucket   |
|---------|-----------------------------------|----------|
| 29      | floor((29-3)*5/47) = floor(2.76) = 2 | Bucket 2 |
| 25      | floor((25-3)*5/47) = floor(2.34) = 2 | Bucket 2 |
| 3       | floor((3-3)*5/47) = floor(0) = 0     | Bucket 0 |
| 49      | floor((49-3)*5/47) = floor(4.89) = 4 | Bucket 4 |
| 9       | floor((9-3)*5/47) = floor(0.63) = 0  | Bucket 0 |
| 37      | floor((37-3)*5/47) = floor(3.61) = 3 | Bucket 3 |
| 21      | floor((21-3)*5/47) = floor(1.91) = 1 | Bucket 1 |
| 43      | floor((43-3)*5/47) = floor(4.25) = 4 | Bucket 4 |

**Step 2 -- Sort each bucket:**

| Bucket   | Before Sorting | After Sorting |
|----------|---------------|---------------|
| Bucket 0 | [3, 9]        | [3, 9]        |
| Bucket 1 | [21]          | [21]          |
| Bucket 2 | [29, 25]      | [25, 29]      |
| Bucket 3 | [37]          | [37]          |
| Bucket 4 | [49, 43]      | [43, 49]      |

**Step 3 -- Concatenate:** `[3, 9, 21, 25, 29, 37, 43, 49]`

## Pseudocode

```
function bucketSort(array, k):
    n = length(array)
    if n <= 1:
        return array

    minVal = min(array)
    maxVal = max(array)

    // Create k empty buckets
    buckets = array of k empty lists

    // Distribute elements into buckets
    for each element in array:
        index = floor((element - minVal) * k / (maxVal - minVal + 1))
        buckets[index].append(element)

    // Sort each bucket (using insertion sort)
    for each bucket in buckets:
        insertionSort(bucket)

    // Concatenate all buckets
    result = []
    for each bucket in buckets:
        result.extend(bucket)

    return result
```

## Complexity Analysis

| Case    | Time      | Space    |
|---------|-----------|----------|
| Best    | O(n + k)  | O(n + k) |
| Average | O(n + k)  | O(n + k) |
| Worst   | O(n^2)    | O(n + k) |

**Why these complexities?**

- **Best and Average Case -- O(n + k):** When elements are uniformly distributed, each of the k buckets contains approximately n/k elements. Distributing elements takes O(n). Sorting each bucket with insertion sort takes O((n/k)^2), and summing across all k buckets gives O(k * (n/k)^2) = O(n^2/k). When k is chosen proportional to n (k ~ n), this becomes O(n).

- **Worst Case -- O(n^2):** When all elements fall into a single bucket (due to highly skewed distribution), the entire sort reduces to sorting n elements with insertion sort, which is O(n^2).

- **Space -- O(n + k):** The algorithm requires space for k buckets plus storage for all n elements distributed across those buckets.

## When to Use

- **Uniformly distributed data over a known range:** Bucket Sort achieves linear time when elements are spread evenly across the range.
- **Sorting floating-point numbers in [0, 1):** This is the classic use case where each bucket covers an equal sub-interval.
- **External sorting:** Bucket Sort's distribution phase maps naturally to splitting data across disk partitions.
- **As a subroutine in radix sort:** Radix sort uses a variant of bucket sort (counting sort) to sort by each digit.
- **Histogram-based processing:** When data naturally partitions into range-based groups.

## When NOT to Use

- **Highly skewed or non-uniform distributions:** If most elements cluster into a few buckets, performance degrades to O(n^2).
- **Unknown data range:** Bucket Sort requires knowing or computing the minimum and maximum values. If the range is extremely large relative to the number of elements, too many empty buckets waste memory.
- **Integer data with large range and few elements:** Counting sort or radix sort may be more appropriate.
- **When in-place sorting is required:** Bucket Sort requires O(n + k) additional space for the buckets.

## Comparison with Similar Algorithms

| Algorithm      | Time (avg) | Space    | Stable | Notes                                          |
|----------------|-----------|----------|--------|-------------------------------------------------|
| Bucket Sort    | O(n + k)  | O(n + k) | Yes*   | Best for uniformly distributed data              |
| Counting Sort  | O(n + k)  | O(n + k) | Yes    | Best for small integer ranges                    |
| Radix Sort     | O(d(n+k)) | O(n + k) | Yes    | Sorts by digit; uses counting/bucket as subroutine |
| Quick Sort     | O(n log n)| O(log n) | No     | General-purpose comparison sort                  |
| Merge Sort     | O(n log n)| O(n)     | Yes    | Guaranteed O(n log n); comparison-based           |

*Bucket Sort is stable when the sub-sort within each bucket is stable (e.g., insertion sort).

## Implementations

| Language   | File |
|------------|------|
| Python     | [bucket_sort.py](python/bucket_sort.py) |
| Java       | [BucketSort.java](java/BucketSort.java) |
| C++        | [bucket_sort.cpp](cpp/bucket_sort.cpp) |
| C          | [bucket_sort.c](c/bucket_sort.c) |
| Go         | [bucket_sort.go](go/bucket_sort.go) |
| TypeScript | [bucketSort.ts](typescript/bucketSort.ts) |
| Rust       | [bucket_sort.rs](rust/bucket_sort.rs) |
| Kotlin     | [BucketSort.kt](kotlin/BucketSort.kt) |
| Swift      | [BucketSort.swift](swift/BucketSort.swift) |
| Scala      | [BucketSort.scala](scala/BucketSort.scala) |
| C#         | [BucketSort.cs](csharp/BucketSort.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Section 8.4: Bucket Sort.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley.
- [Bucket Sort -- Wikipedia](https://en.wikipedia.org/wiki/Bucket_sort)
