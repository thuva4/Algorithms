# Permutations

## Overview

A permutation of a set is an arrangement of its elements in a specific order. The problem of generating all permutations of a set of n elements produces n! (n factorial) distinct arrangements. For example, the permutations of {1, 2, 3} are: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1] -- a total of 3! = 6 permutations.

Generating permutations is a fundamental combinatorial operation with applications in brute-force search, cryptanalysis, testing (generating all test cases), scheduling (exploring all possible orderings), and solving puzzles like the traveling salesman problem.

## How It Works

The backtracking approach generates permutations by building them one element at a time. At each position, it tries each unused element, recursively fills the remaining positions, and then backtracks to try the next element. The algorithm maintains a "used" set to track which elements have already been placed in the current partial permutation.

### Example

Generating all permutations of `{1, 2, 3}`:

```
                        []
                /       |        \
              [1]      [2]       [3]
             / \      / \       / \
          [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
           |     |     |     |     |     |
        [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
```

**Step-by-step backtracking trace:**

| Step | Current permutation | Available elements | Action |
|------|--------------------|--------------------|--------|
| 1 | [] | {1, 2, 3} | Choose 1 |
| 2 | [1] | {2, 3} | Choose 2 |
| 3 | [1, 2] | {3} | Choose 3 |
| 4 | [1, 2, 3] | {} | Output permutation, backtrack |
| 5 | [1] | {2, 3} | Choose 3 |
| 6 | [1, 3] | {2} | Choose 2 |
| 7 | [1, 3, 2] | {} | Output permutation, backtrack |
| 8 | [] | {1, 2, 3} | Choose 2 |
| 9 | [2] | {1, 3} | Choose 1 |
| 10 | [2, 1] | {3} | Choose 3 |
| 11 | [2, 1, 3] | {} | Output permutation, backtrack |
| ... | ... | ... | ... continues for remaining |

Result: All 6 permutations generated.

## Pseudocode

```
function permutations(elements):
    result = empty list
    used = array of size n, all false
    current = empty list

    function backtrack():
        if length(current) == length(elements):
            result.append(copy of current)
            return

        for i from 0 to length(elements) - 1:
            if not used[i]:
                used[i] = true
                current.append(elements[i])
                backtrack()
                current.removeLast()
                used[i] = false

    backtrack()
    return result
```

Alternatively, using the swap-based approach (Heap's algorithm) which generates permutations by swapping elements in place:

```
function heapPermutations(arr, n):
    if n == 1:
        output(arr)
        return
    for i from 0 to n - 1:
        heapPermutations(arr, n - 1)
        if n is even:
            swap(arr[i], arr[n - 1])
        else:
            swap(arr[0], arr[n - 1])
```

## Complexity Analysis

| Case    | Time  | Space |
|---------|-------|-------|
| Best    | O(n!) | O(n)  |
| Average | O(n!) | O(n)  |
| Worst   | O(n!) | O(n)  |

**Why these complexities?**

- **Best Case -- O(n!):** There are n! permutations, and generating each one requires at least O(1) work. The total is at least O(n!). With output copying, it is O(n * n!).

- **Average Case -- O(n!):** The recursion tree has n! leaves. Each internal node does O(n) work (scanning through elements), but this is amortized across all permutations.

- **Worst Case -- O(n!):** Every permutation must be generated. There is no input that produces fewer than n! permutations (assuming all elements are distinct).

- **Space -- O(n):** The recursion stack has depth n, and the current permutation being built has at most n elements. The `used` array has size n. (The output storage for all permutations is O(n * n!), but this is output-dependent.)

## When to Use

- **Exhaustive search:** When every possible ordering must be examined (e.g., brute-force TSP for small n).
- **Testing:** Generating all possible test orderings to check for order-dependent bugs.
- **Small input sizes (n <= 10-12):** n! grows rapidly: 10! = 3.6 million, 12! = 479 million.
- **When a specific permutation order is needed:** Lexicographic generation produces permutations in sorted order.

## When NOT to Use

- **Large n (> 12-15):** n! grows super-exponentially. 15! = 1.3 trillion permutations.
- **When you only need some permutations:** Random sampling or next-permutation algorithms are more appropriate.
- **When order does not matter:** Use combinations instead of permutations.
- **When only the count is needed:** The count is simply n!; no generation is necessary.

## Comparison with Similar Algorithms

| Method              | Time     | Space | Notes                                          |
|--------------------|---------|-------|-------------------------------------------------|
| Backtracking        | O(n*n!) | O(n)  | Simple; generates in any order                   |
| Heap's Algorithm    | O(n!)   | O(n)  | Optimal; single swap per permutation             |
| Next Permutation    | O(n) each| O(1) | Generates one at a time in lexicographic order   |
| Steinhaus-Johnson-Trotter| O(n!)| O(n) | Minimal changes between consecutive permutations|

## Implementations

| Language   | File |
|------------|------|
| Python     | [Permutations.py](python/Permutations.py) |
| C++        | [Permutations.cpp](cpp/Permutations.cpp) |
| TypeScript | [index.js](typescript/index.js) |

## References

- Knuth, D. E. (2011). *The Art of Computer Programming, Volume 4A: Combinatorial Algorithms* (1st ed.). Addison-Wesley. Section 7.2.1.2: Generating All Permutations.
- Heap, B. R. (1963). Permutations by interchanges. *The Computer Journal*, 6(3), 293-298.
- [Permutation -- Wikipedia](https://en.wikipedia.org/wiki/Permutation)
