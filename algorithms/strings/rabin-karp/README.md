# Rabin-Karp

## Overview

The Rabin-Karp algorithm is a string matching algorithm that uses hashing to find occurrences of a pattern within a text. It computes a hash of the pattern and then slides a window across the text, computing a rolling hash for each window position. When the hashes match, it performs a character-by-character comparison to confirm the match (avoiding false positives from hash collisions).

Developed by Michael Rabin and Richard Karp in 1987, this algorithm is particularly effective when searching for multiple patterns simultaneously. Its average-case performance is O(n + m), though hash collisions can degrade worst-case performance to O(nm).

## How It Works

The algorithm uses a rolling hash function that can be updated in O(1) time when the window slides one position. A common choice is the polynomial rolling hash: `hash = (c_1 * d^(m-1) + c_2 * d^(m-2) + ... + c_m * d^0) mod q`, where d is the base (typically the alphabet size) and q is a prime modulus. When the window shifts right by one character, the hash is updated by removing the contribution of the leftmost character and adding the new rightmost character.

### Example

Pattern: `"ABC"`, Text: `"AABABCAB"`, Base d = 256, Modulus q = 101

Hash function: h(s) = (s[0]*256^2 + s[1]*256 + s[2]) mod 101

**Step 1: Compute pattern hash:**
- h("ABC") = (65*256^2 + 66*256 + 67) mod 101 = (4259840 + 16896 + 67) mod 101 = 4276803 mod 101 = `6`

**Step 2: Slide window across text:**

| Step | Window | Text chars | Hash | Hash match? | Char compare? | Found? |
|------|--------|-----------|------|-------------|---------------|--------|
| 1 | [0-2] | "AAB" | 4243523 mod 101 = 78 | No | - | - |
| 2 | [1-3] | "ABA" | 4276545 mod 101 = 75 | No | - | - |
| 3 | [2-4] | "BAB" | 4342594 mod 101 = 10 | No | - | - |
| 4 | [3-5] | "ABC" | 4276803 mod 101 = 6 | Yes | A==A, B==B, C==C | Yes! |
| 5 | [4-6] | "BCA" | 4342081 mod 101 = 94 | No | - | - |
| 6 | [5-7] | "CAB" | 4407362 mod 101 = 35 | No | - | - |

Result: Pattern found at index `3`

**Rolling hash update formula:**
new_hash = (d * (old_hash - text[i] * d^(m-1)) + text[i + m]) mod q

## Pseudocode

```
function rabinKarp(text, pattern):
    n = length(text)
    m = length(pattern)
    d = 256          // alphabet size
    q = large prime  // modulus
    h = d^(m-1) mod q  // highest power factor
    results = empty list

    // Compute hash of pattern and first window
    p_hash = 0
    t_hash = 0
    for i from 0 to m - 1:
        p_hash = (d * p_hash + pattern[i]) mod q
        t_hash = (d * t_hash + text[i]) mod q

    // Slide the window
    for i from 0 to n - m:
        if p_hash == t_hash:
            // Verify character by character
            if text[i..i+m-1] == pattern:
                results.append(i)

        // Compute hash for next window
        if i < n - m:
            t_hash = (d * (t_hash - text[i] * h) + text[i + m]) mod q
            if t_hash < 0:
                t_hash = t_hash + q

    return results
```

The rolling hash allows O(1) window updates, avoiding the O(m) cost of rehashing from scratch at each position.

## Complexity Analysis

| Case    | Time     | Space |
|---------|---------|-------|
| Best    | O(n + m) | O(1)  |
| Average | O(n + m) | O(1)  |
| Worst   | O(nm)    | O(1)  |

**Why these complexities?**

- **Best Case -- O(n + m):** Computing the pattern hash takes O(m). When there are no hash collisions and the pattern does not occur, each position requires only O(1) hash comparison. Total: O(n + m).

- **Average Case -- O(n + m):** With a good hash function and large prime modulus, the probability of a hash collision (spurious hit) is about 1/q per position. The expected number of false positives is n/q, which is negligible for large q.

- **Worst Case -- O(nm):** If the hash function produces many collisions (e.g., text = "AAAA...A" and pattern = "AAA...AB"), every position triggers a character-by-character comparison. This gives n * m comparisons total.

- **Space -- O(1):** The algorithm uses only a constant number of variables for hash values, the power factor, and loop indices. No additional arrays are needed.

## When to Use

- **Multiple pattern search:** Rabin-Karp naturally extends to searching for multiple patterns by storing all pattern hashes in a set.
- **Plagiarism detection:** Rolling hashes efficiently compare document fingerprints.
- **When simplicity is valued:** The algorithm is conceptually simple and easy to implement.
- **When average-case performance is acceptable:** In practice, hash collisions are rare, making the algorithm fast.

## When NOT to Use

- **When worst-case guarantees are needed:** KMP or Boyer-Moore provide guaranteed O(n + m) time.
- **Short patterns in long texts:** The overhead of hash computation may not pay off for very short patterns where a naive search suffices.
- **When hash collisions are likely:** Pathological inputs can cause O(nm) performance. Using multiple hash functions mitigates this.
- **Streaming data with no backtracking requirement:** KMP is better for streaming since it processes each character exactly once.

## Comparison with Similar Algorithms

| Algorithm      | Time (worst) | Space | Notes                                          |
|---------------|-------------|-------|-------------------------------------------------|
| Rabin-Karp     | O(nm)       | O(1)  | Hash-based; excels at multi-pattern search       |
| KMP            | O(n + m)    | O(m)  | Deterministic O(n + m); no hash collisions       |
| Boyer-Moore    | O(nm)       | O(m + sigma)| Best practical performance for long patterns|
| Aho-Corasick   | O(n + m + z)| O(m)  | Optimal multi-pattern; builds trie automaton     |

## Implementations

| Language | File |
|----------|------|
| Python   | [Rabin_Karp.py](python/Rabin_Karp.py) |
| Java     | [RabinKarp.java](java/RabinKarp.java) |
| C++      | [RabinKarp.cpp](cpp/RabinKarp.cpp) |

## References

- Karp, R. M., & Rabin, M. O. (1987). Efficient randomized pattern-matching algorithms. *IBM Journal of Research and Development*, 31(2), 249-260.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 32.2: The Rabin-Karp Algorithm.
- [Rabin-Karp Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm)
