# Fisher-Yates Shuffle

## Overview

The Fisher-Yates Shuffle (also known as the Knuth Shuffle) is an algorithm for generating a uniformly random permutation of a finite sequence. Originally described by Ronald Fisher and Frank Yates in 1938, the modern version was popularized by Donald Knuth in *The Art of Computer Programming*. The algorithm works by iterating through the array from the last element to the first, swapping each element with a randomly chosen element from the remaining unshuffled portion. It guarantees that every permutation is equally likely, making it the gold standard for unbiased shuffling.

## How It Works

1. Start from the last element of the array (index `n - 1`).
2. Generate a random index `j` in the range `[0, i]` (inclusive).
3. Swap the element at index `i` with the element at index `j`.
4. Move to the previous element (`i - 1`) and repeat until `i = 1`.
5. The array is now a uniformly random permutation.

The key insight is that at each step, every remaining element has an equal probability of being placed at the current position, which ensures uniform distribution across all `n!` possible permutations.

## Example

Given input: `[A, B, C, D]`

| Step | i | Random j (0 to i) | Action | Array State |
|------|---|-------------------|--------|-------------|
| 1 | 3 | j = 1 | Swap arr[3] and arr[1] | `[A, D, C, B]` |
| 2 | 2 | j = 0 | Swap arr[2] and arr[0] | `[C, D, A, B]` |
| 3 | 1 | j = 1 | Swap arr[1] and arr[1] | `[C, D, A, B]` |

Result: `[C, D, A, B]` (one of the 24 equally likely permutations)

## Pseudocode

```
function fisherYatesShuffle(array):
    n = length(array)

    for i from n - 1 down to 1:
        j = randomInteger(0, i)    // inclusive on both ends
        swap(array[i], array[j])

    return array
```

**Important:** The random index `j` must be chosen from `[0, i]`, not `[0, n-1]`. Using the full range at every step produces a biased shuffle where some permutations are more likely than others.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Time -- O(n):** The algorithm performs exactly `n - 1` iterations, each involving one random number generation and one swap. Both operations are O(1), yielding O(n) total time regardless of input.

- **Space -- O(1):** The shuffle is performed in-place. Only a constant amount of extra memory is needed for the loop variable and the temporary swap variable.

## When to Use

- **Card game simulations:** Shuffling a deck of cards for poker, blackjack, or any card game.
- **Randomized algorithms:** When you need a random permutation as input to another algorithm (e.g., randomized quicksort pivot selection).
- **Sampling without replacement:** Shuffle and take the first k elements to get a random sample of size k.
- **A/B testing and randomized experiments:** Randomly assigning subjects to groups.
- **Music playlist shuffling:** Generating a random play order for a list of songs.

## When NOT to Use

- **When you need reproducibility without a seed:** The algorithm is inherently random. If you need deterministic behavior, you must control the random number generator seed.
- **When cryptographic security is required:** The standard Fisher-Yates shuffle uses a pseudo-random number generator. For security-sensitive applications (e.g., online gambling), use a cryptographically secure random source.
- **When partial shuffling suffices:** If you only need k random elements from n, consider using a partial Fisher-Yates (stop after k swaps) or reservoir sampling instead of shuffling the entire array.

## Comparison

| Algorithm | Uniformity | Time | Space | Notes |
|-----------|-----------|------|-------|-------|
| Fisher-Yates Shuffle | Perfectly uniform | O(n) | O(1) | Gold standard; in-place |
| Sort with random keys | Uniform (if keys unique) | O(n log n) | O(n) | Slower; uses extra memory |
| Naive swap (random i, random j) | Biased | O(n) | O(1) | NOT uniform; do not use |
| Sattolo's algorithm | Uniform cyclic permutations | O(n) | O(1) | Every element moves; no fixed points |

## Implementations

| Language   | File |
|------------|------|
| Python     | [fisher_yates_shuffle.py](python/fisher_yates_shuffle.py) |
| Java       | [FisherYatesShuffle.java](java/FisherYatesShuffle.java) |
| C++        | [fisher_yates_shuffle.cpp](cpp/fisher_yates_shuffle.cpp) |
| Go         | [fisher_yates_shuffle.go](go/fisher_yates_shuffle.go) |
| TypeScript | [fisherYatesShuffle.ts](typescript/fisherYatesShuffle.ts) |
| C#         | [FisherYatesShuffle.cs](csharp/FisherYatesShuffle.cs) |

## References

- Fisher, R. A., & Yates, F. (1938). *Statistical Tables for Biological, Agricultural and Medical Research*. Oliver & Boyd.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 3.4.2: Random Sampling and Shuffling.
- [Fisher-Yates Shuffle -- Wikipedia](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
