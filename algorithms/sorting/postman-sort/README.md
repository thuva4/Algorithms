# Postman Sort

## Overview

Postman Sort (also known as Postman's Sort or Mailbox Sort) is a non-comparison sorting algorithm inspired by the way postal workers sort mail. Just as a mail carrier sorts letters first by country, then by city, then by street, and finally by house number, Postman Sort processes elements by examining their digits (or characters) from the most significant to the least significant position. It is a variant of radix sort that uses the Most Significant Digit (MSD) first approach, distributing elements into buckets based on each digit position and recursively sorting within each bucket.

The algorithm is particularly well-suited for sorting strings, postal codes, fixed-length numeric keys, and other data that can be decomposed into a hierarchy of digit positions.

## How It Works

1. **Determine the maximum number of digits** (or character positions) across all elements.
2. **Starting from the most significant digit (MSD):**
   - Distribute all elements into buckets (0-9 for decimal digits, or 0-25 for lowercase letters, etc.) based on the current digit position.
   - Recursively sort each non-empty bucket by the next digit position.
3. **Concatenate** the sorted buckets to produce the final result.
4. Elements that have no digit at the current position (shorter elements) are placed in a special "empty" bucket that comes first.

## Example

Given input: `[423, 125, 432, 215, 312, 123, 421, 213]`

**Pass 1 -- Sort by most significant digit (hundreds):**

| Bucket (100s) | Elements |
|--------------|----------|
| 1 | `[125, 123]` |
| 2 | `[215, 213]` |
| 3 | `[312]` |
| 4 | `[423, 432, 421]` |

**Pass 2 -- Sort each bucket by tens digit:**

Bucket 1 (hundreds = 1):
| Bucket (10s) | Elements |
|--------------|----------|
| 2 | `[125, 123]` |

Bucket 2 (hundreds = 2):
| Bucket (10s) | Elements |
|--------------|----------|
| 1 | `[215, 213]` |

Bucket 4 (hundreds = 4):
| Bucket (10s) | Elements |
|--------------|----------|
| 2 | `[423, 421]` |
| 3 | `[432]` |

**Pass 3 -- Sort each sub-bucket by units digit:**

`[125, 123]` by units: `[123, 125]`
`[215, 213]` by units: `[213, 215]`
`[423, 421]` by units: `[421, 423]`

**Concatenation:** `[123, 125, 213, 215, 312, 421, 423, 432]`

Result: `[123, 125, 213, 215, 312, 421, 423, 432]`

## Pseudocode

```
function postmanSort(array, digitPosition, maxDigits):
    if length(array) <= 1 or digitPosition >= maxDigits:
        return array

    // Create buckets (e.g., 10 for decimal digits)
    buckets = array of 10 empty lists

    // Distribute elements into buckets based on current digit
    for each element in array:
        digit = getDigit(element, digitPosition)
        buckets[digit].append(element)

    // Recursively sort each bucket by the next digit position
    result = []
    for bucket in buckets:
        if length(bucket) > 0:
            sorted_bucket = postmanSort(bucket, digitPosition + 1, maxDigits)
            result.extend(sorted_bucket)

    return result

function getDigit(number, position):
    // Extract digit at given position (0 = most significant)
    divisor = 10^(maxDigits - position - 1)
    return (number / divisor) mod 10
```

## Complexity Analysis

| Case    | Time       | Space     |
|---------|------------|-----------|
| Best    | O(n * d)   | O(n + b*d) |
| Average | O(n * d)   | O(n + b*d) |
| Worst   | O(n * d)   | O(n + b*d) |

Where n = number of elements, d = number of digit positions (key length), b = bucket count (base, e.g., 10 for decimal).

**Why these complexities?**

- **Time -- O(n * d):** Each element is examined once per digit position, and there are d positions. Distribution into buckets and concatenation are both O(n) per pass. Since there are d passes, the total is O(n * d).

- **Space -- O(n + b*d):** The algorithm needs O(n) space for the elements across all buckets at any level, plus O(b) buckets at each of the d recursion levels, giving O(b*d) overhead for the bucket structure.

## When to Use

- **Fixed-length keys:** Postal codes, phone numbers, IP addresses, social security numbers, or any data with a fixed number of digit positions.
- **String sorting:** Sorting words or strings lexicographically, where each character position serves as a digit.
- **Hierarchical data:** Data that naturally decomposes into levels of significance (like dates: year/month/day).
- **When the key length d is small relative to log n:** Postman Sort achieves O(n * d) which beats O(n log n) comparison sorts when d < log n.
- **Large datasets with short keys:** Scales linearly with data size for fixed-length keys.

## When NOT to Use

- **Variable-length keys with large range:** When keys vary greatly in length, the algorithm may waste effort on empty buckets and require complex padding logic.
- **Small datasets:** The overhead of bucket management makes it slower than simple comparison sorts for small inputs.
- **When d >> log n:** If keys are very long relative to the number of elements, a comparison-based O(n log n) sort is faster.
- **Limited memory:** The bucket structure requires significant extra memory compared to in-place sorting algorithms.

## Comparison

| Algorithm | Type | Time | Space | Stable | Approach |
|-----------|------|------|-------|--------|----------|
| Postman Sort (MSD Radix) | Non-comparison | O(n * d) | O(n + b*d) | Yes | Most significant digit first |
| LSD Radix Sort | Non-comparison | O(n * d) | O(n + b) | Yes | Least significant digit first |
| Counting Sort | Non-comparison | O(n + k) | O(k) | Yes | Single key range |
| Bucket Sort | Non-comparison | O(n + k) | O(n + k) | Yes | Uniform distribution |
| Quick Sort | Comparison | O(n log n) | O(log n) | No | Divide and conquer |

## Implementations

| Language   | File |
|------------|------|
| Java       | [PostmanSort.java](java/PostmanSort.java) |
| C++        | [postman_sort.cpp](cpp/postman_sort.cpp) |
| C          | [postman_sort.c](c/postman_sort.c) |

## References

- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.5: Sorting by Distribution.
- McIlroy, P. M., Bostic, K., & McIlroy, M. D. (1993). "Engineering Radix Sort." *Computing Systems*, 6(1), 5-27.
- [Radix Sort -- Wikipedia](https://en.wikipedia.org/wiki/Radix_sort)
