# Rabin-Karp Rolling Hash

## Overview

The Rabin-Karp algorithm is a string-matching algorithm that uses hashing to find patterns in text. Invented by Michael O. Rabin and Richard M. Karp in 1987, its key innovation is the use of a rolling hash function that can be updated in constant time as the search window slides one position to the right. This allows the algorithm to avoid recomputing the hash from scratch at each position, making it efficient for single-pattern matching and especially powerful for multi-pattern search.

## How It Works

1. **Compute the hash of the pattern** using a polynomial rolling hash: `hash = (p[0]*d^(m-1) + p[1]*d^(m-2) + ... + p[m-1]) mod q`, where `d` is the base (related to alphabet size) and `q` is a large prime.
2. **Compute the hash of the first window** of the text (first `m` characters) using the same formula.
3. **Slide the window** one position at a time. Update the hash in O(1) by removing the contribution of the outgoing character and adding the incoming character: `hash = (d * (oldHash - text[i]*d^(m-1)) + text[i+m]) mod q`.
4. **On hash match:** Compare the actual characters of the pattern and the current window to confirm (hash collisions are possible).
5. Return the index of the first match, or -1 if no match is found.

Input format: `[text_len, ...text, pattern_len, ...pattern]`
Output: index of first match, or -1 if not found.

## Worked Example

Given text = `[2, 3, 5, 3, 5, 7]`, pattern = `[3, 5]`, base `d = 256`, prime `q = 101`:

**Step 1 -- Compute pattern hash:**
`hash_p = (3 * 256 + 5) mod 101 = 773 mod 101 = (7*101 + 66) = 66`

**Step 2 -- Compute first window hash:**
Window `[2, 3]`: `hash_w = (2 * 256 + 3) mod 101 = 515 mod 101 = 9`

**Step 3 -- Slide:**
- Position 0: `hash_w = 9`, `hash_p = 66`. No match.
- Position 1: Remove `2`, add `5`. `hash_w = (256*(9 - 2*256) + 5) mod 101 = ... = 66`. Hash matches! Compare `[3,5]` vs `[3,5]` -- confirmed match.

**Result:** 1

## Pseudocode

```
function rabinKarpSearch(text, pattern):
    n = length(text)
    m = length(pattern)
    d = 256          // base
    q = 1000000007   // large prime
    if m > n: return -1

    // Compute d^(m-1) mod q
    h = 1
    for i from 1 to m - 1:
        h = (h * d) mod q

    // Compute initial hashes
    hashP = 0
    hashT = 0
    for i from 0 to m - 1:
        hashP = (d * hashP + pattern[i]) mod q
        hashT = (d * hashT + text[i]) mod q

    // Slide the window
    for i from 0 to n - m:
        if hashP == hashT:
            // Verify character by character
            if text[i..i+m-1] == pattern[0..m-1]:
                return i

        if i < n - m:
            // Rolling hash update
            hashT = (d * (hashT - text[i] * h) + text[i + m]) mod q
            if hashT < 0:
                hashT = hashT + q

    return -1
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(n + m) | O(1)  |
| Average | O(n + m) | O(1)  |
| Worst   | O(n * m) | O(1)  |

- **Best/Average case O(n + m):** Hash collisions are rare with a good hash function and large prime. Each position requires O(1) for the rolling hash update.
- **Worst case O(n * m):** If every window produces a hash collision (spurious hit), every position requires O(m) verification. This is extremely unlikely with a good hash function but can be triggered adversarially.
- **Space O(1):** Only a constant number of variables are needed (hash values, base power).

## When to Use

- Single-pattern search where practical speed and implementation simplicity matter
- **Multi-pattern search:** Rabin-Karp excels when searching for multiple patterns simultaneously -- compute hashes for all patterns and check each window against the set
- Plagiarism detection (comparing document fingerprints)
- Detecting duplicate content in large text corpora
- Rolling window computations in data streams
- When you need a simple, hash-based approach that is easy to parallelize

## When NOT to Use

- **When worst-case guarantees are required:** Use KMP or Boyer-Moore for guaranteed O(n+m) or better worst-case time.
- **Very short patterns:** The overhead of computing hash values is not justified for patterns of 1-2 characters.
- **When hash collisions are unacceptable:** In security-sensitive applications where an adversary could craft inputs to cause many collisions, deterministic algorithms like KMP are safer.
- **Single-pattern search on large alphabets:** Boyer-Moore is typically faster in practice for single-pattern matching due to its ability to skip characters.

## Comparison

| Algorithm     | Preprocessing | Avg Search | Worst Search | Multi-pattern | Space |
|---------------|---------------|------------|--------------|---------------|-------|
| Rabin-Karp    | O(m)          | O(n + m)   | O(n * m)     | Yes           | O(1)  |
| KMP           | O(m)          | O(n)       | O(n)         | No            | O(m)  |
| Boyer-Moore   | O(m + k)      | O(n/m)     | O(n*m)       | No            | O(k)  |
| Aho-Corasick  | O(sum of m)   | O(n + z)   | O(n + z)     | Yes           | O(sum)|
| Naive         | O(1)          | O(n * m)   | O(n * m)     | No            | O(1)  |

Rabin-Karp is unique in combining O(1) space with natural support for multi-pattern matching. Aho-Corasick is faster for multi-pattern matching but requires building an automaton. Boyer-Moore is the fastest single-pattern matcher in practice.

## References

- Karp, R.M. and Rabin, M.O. (1987). "Efficient Randomized Pattern-Matching Algorithms." *IBM Journal of Research and Development*, 31(2), 249-260.
- Cormen, T.H., Leiserson, C.E., Rivest, R.L., and Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Section 32.2. MIT Press.
- Sedgewick, R. and Wayne, K. (2011). *Algorithms* (4th ed.), Section 5.3. Addison-Wesley.

## Implementations

| Language   | File |
|------------|------|
| Python     | [robin_karp_rolling_hash.py](python/robin_karp_rolling_hash.py) |
| Java       | [RobinKarpRollingHash.java](java/RobinKarpRollingHash.java) |
| C++        | [robin_karp_rolling_hash.cpp](cpp/robin_karp_rolling_hash.cpp) |
| C          | [robin_karp_rolling_hash.c](c/robin_karp_rolling_hash.c) |
| Go         | [robin_karp_rolling_hash.go](go/robin_karp_rolling_hash.go) |
| TypeScript | [robinKarpRollingHash.ts](typescript/robinKarpRollingHash.ts) |
| Rust       | [robin_karp_rolling_hash.rs](rust/robin_karp_rolling_hash.rs) |
| Kotlin     | [RobinKarpRollingHash.kt](kotlin/RobinKarpRollingHash.kt) |
| Swift      | [RobinKarpRollingHash.swift](swift/RobinKarpRollingHash.swift) |
| Scala      | [RobinKarpRollingHash.scala](scala/RobinKarpRollingHash.scala) |
| C#         | [RobinKarpRollingHash.cs](csharp/RobinKarpRollingHash.cs) |
