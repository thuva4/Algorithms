# Strand Sort

## Overview

Strand Sort is a sorting algorithm that repeatedly pulls sorted subsequences (strands) out of the unsorted input and merges them into the output. It works by scanning the input list to extract an increasing subsequence, then merging that subsequence into the growing sorted output. This process repeats until the input is exhausted. Strand Sort is particularly efficient on data that already contains long sorted runs, as it can extract and merge them in fewer iterations.

The algorithm was first described by R. W. Hamming and is notable for its elegant use of the merge operation, similar to merge sort, combined with a greedy extraction of naturally occurring sorted subsequences.

## How It Works

1. **Extract a strand:** Move the first element from the input into a new sublist (strand). Then scan through the remaining input: whenever an element is greater than or equal to the last element of the strand, remove it from the input and append it to the strand.
2. **Merge the strand:** Merge the extracted strand into the sorted output list using a standard sorted merge (like the merge step in merge sort).
3. **Repeat** steps 1-2 until the input list is empty.

## Example

Given input: `[6, 2, 4, 7, 1, 3, 8, 5]`

**Iteration 1 -- Extract strand:**
- Start with `6`. Scan: 2 < 6 (skip), 4 < 6 (skip), 7 >= 6 (take), 1 < 7 (skip), 3 < 7 (skip), 8 >= 7 (take), 5 < 8 (skip).
- Strand: `[6, 7, 8]`
- Remaining input: `[2, 4, 1, 3, 5]`
- Merge `[6, 7, 8]` into output `[]`: Output = `[6, 7, 8]`

**Iteration 2 -- Extract strand:**
- Start with `2`. Scan: 4 >= 2 (take), 1 < 4 (skip), 3 < 4 (skip), 5 >= 4 (take).
- Strand: `[2, 4, 5]`
- Remaining input: `[1, 3]`
- Merge `[2, 4, 5]` into `[6, 7, 8]`: Output = `[2, 4, 5, 6, 7, 8]`

**Iteration 3 -- Extract strand:**
- Start with `1`. Scan: 3 >= 1 (take).
- Strand: `[1, 3]`
- Remaining input: `[]`
- Merge `[1, 3]` into `[2, 4, 5, 6, 7, 8]`: Output = `[1, 2, 3, 4, 5, 6, 7, 8]`

Result: `[1, 2, 3, 4, 5, 6, 7, 8]`

## Pseudocode

```
function strandSort(input):
    output = empty list

    while input is not empty:
        // Extract a strand
        strand = [input.removeFirst()]

        i = 0
        while i < length(input):
            if input[i] >= strand.last():
                strand.append(input.remove(i))
            else:
                i = i + 1

        // Merge strand into output
        output = merge(output, strand)

    return output

function merge(a, b):
    result = empty list
    while a is not empty and b is not empty:
        if a.first() <= b.first():
            result.append(a.removeFirst())
        else:
            result.append(b.removeFirst())
    result.extend(a)
    result.extend(b)
    return result
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(n)     | O(n)  |
| Average | O(n^2)   | O(n)  |
| Worst   | O(n^2)   | O(n)  |

**Why these complexities?**

- **Best Case -- O(n):** When the input is already sorted, the entire array is extracted as a single strand in one pass (O(n)), and it is merged into the empty output (O(n)). Total: O(n).

- **Average Case -- O(n^2):** On average, each strand extraction pulls out O(sqrt(n)) elements (the expected length of a longest increasing subsequence in a random permutation). This means O(sqrt(n)) strands are extracted, and each merge into the output takes O(n). Total: O(n * sqrt(n)), but the worst case analysis gives O(n^2) since strands can be as short as 1 element.

- **Worst Case -- O(n^2):** When the input is sorted in reverse order, each strand contains only one element. This requires n strands, and each merge takes O(n) in the worst case, giving O(n^2) total.

- **Space -- O(n):** The output list, strands, and remaining input together hold all n elements, requiring O(n) total space.

## When to Use

- **Partially sorted data:** Strand Sort excels when the data contains long naturally occurring sorted subsequences (runs). In the best case with already-sorted data, it runs in O(n).
- **Linked list data:** The algorithm is naturally suited for linked lists, where element removal from the middle is O(1). On arrays, removal is O(n) which hurts performance.
- **When simplicity is valued:** The algorithm is conceptually simple and easy to implement correctly.
- **Adaptive sorting:** When you want an algorithm that naturally adapts to the existing order in the data.

## When NOT to Use

- **Random or reverse-sorted data:** With few or short natural runs, the algorithm degrades to O(n^2).
- **Array-based implementations:** Removing elements from the middle of an array is O(n), making the algorithm O(n^2) even in favorable cases unless using linked lists.
- **Large datasets:** O(n^2) worst case makes it unsuitable for large inputs. Use Tim Sort or merge sort instead, which also exploit natural runs but guarantee O(n log n).
- **When stability is critical:** While Strand Sort is stable in principle, implementations must be careful with the merge step to maintain stability.

## Comparison

| Algorithm    | Time (avg)   | Time (best) | Space | Stable | Adapts to Runs |
|--------------|-------------|-------------|-------|--------|----------------|
| Strand Sort  | O(n^2)      | O(n)        | O(n)  | Yes    | Yes |
| Tim Sort     | O(n log n)  | O(n)        | O(n)  | Yes    | Yes (optimally) |
| Merge Sort   | O(n log n)  | O(n log n)  | O(n)  | Yes    | No |
| Insertion Sort| O(n^2)     | O(n)        | O(1)  | Yes    | Partially |
| Natural Merge Sort | O(n log n) | O(n)   | O(n)  | Yes    | Yes |

## Implementations

| Language   | File |
|------------|------|
| Python     | [strand_sort.py](python/strand_sort.py) |
| Java       | [StrandSort.java](java/StrandSort.java) |
| C++        | [strand_sort.cpp](cpp/strand_sort.cpp) |
| C          | [strand_sort.c](c/strand_sort.c) |
| Go         | [strand_sort.go](go/strand_sort.go) |
| TypeScript | [strandSort.ts](typescript/strandSort.ts) |
| Rust       | [strand_sort.rs](rust/strand_sort.rs) |
| Kotlin     | [StrandSort.kt](kotlin/StrandSort.kt) |
| Swift      | [StrandSort.swift](swift/StrandSort.swift) |
| Scala      | [StrandSort.scala](scala/StrandSort.scala) |
| C#         | [StrandSort.cs](csharp/StrandSort.cs) |

## References

- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.4: Sorting by Merging.
- [Strand Sort -- Wikipedia](https://en.wikipedia.org/wiki/Strand_sort)
- Chandramouli, B., & Goldstein, J. (2014). "Patience is a Virtue: Revisiting Merge and Sort on Modern Processors." *SIGMOD*, 731-742.
