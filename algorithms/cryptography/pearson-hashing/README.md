# Pearson Hashing

## Overview

Pearson hashing is a fast, non-cryptographic hash function that maps an arbitrary-length input to an 8-bit hash value (0-255). Proposed by Peter Pearson in 1990, it uses a precomputed 256-entry lookup table containing a permutation of the values 0-255. The algorithm processes input bytes sequentially, using each byte and the current hash to index into the lookup table.

Pearson hashing is valued for its extreme simplicity, speed, and excellent avalanche properties (small changes in input produce very different hashes). It is suitable for hash tables, checksums, and any application needing a fast 8-bit hash. Larger hash values can be produced by running the algorithm multiple times with different initial values.

## How It Works

The algorithm starts with an initial hash value (typically 0), then for each byte of the input, it XORs the current hash with the input byte and uses the result as an index into the permutation table. The table entry becomes the new hash value. This process continues for all input bytes.

### Example

Using a simplified lookup table T (first 16 entries shown):

```
T = [98, 6, 85, 150, 36, 23, 112, 164, 135, 207, 169, 5, 26, 64, 165, 219, ...]
```

Hashing the string `"abc"` (ASCII: a=97, b=98, c=99):

| Step | Input byte | hash XOR byte | Table index | T[index] = new hash |
|------|-----------|---------------|-------------|---------------------|
| Init | - | - | - | 0 |
| 1 | 97 (a) | 0 XOR 97 = 97 | 97 | T[97] (some value, say 53) |
| 2 | 98 (b) | 53 XOR 98 = 87 | 87 | T[87] (some value, say 201) |
| 3 | 99 (c) | 201 XOR 99 = 174 | 174 | T[174] (some value, say 42) |

Result: Hash of "abc" = `42` (hypothetical, depends on the specific permutation table)

**Key property demonstration -- changing one character:**

Hashing `"abd"` (changed 'c' to 'd'):

| Step | Input byte | hash XOR byte | Table index | new hash |
|------|-----------|---------------|-------------|----------|
| 1 | 97 (a) | 0 XOR 97 = 97 | 97 | 53 (same as before) |
| 2 | 98 (b) | 53 XOR 98 = 87 | 87 | 201 (same as before) |
| 3 | 100 (d) | 201 XOR 100 = 173 | 173 | T[173] (different value!) |

The single character change produces a completely different final hash, demonstrating good avalanche properties.

## Pseudocode

```
function pearsonHash(input):
    T = precomputed permutation table of [0..255]
    hash = 0

    for each byte b in input:
        hash = T[hash XOR b]

    return hash

// For a wider hash (e.g., 16-bit), run twice with different initial values:
function pearsonHash16(input):
    T = precomputed permutation table of [0..255]

    hash1 = 0
    hash2 = 1    // different initial value
    for each byte b in input:
        hash1 = T[hash1 XOR b]
        hash2 = T[hash2 XOR b]

    return (hash1 << 8) | hash2
```

The lookup table must be a permutation of 0-255 (each value appears exactly once). Different permutation tables produce different hash functions.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(1)  |
| Worst   | O(n) | O(1)  |

**Why these complexities?**

- **Best Case -- O(n):** Every byte of the input must be processed. For a single-byte input, the algorithm performs one table lookup.

- **Average Case -- O(n):** Each byte requires exactly one XOR operation and one table lookup (both O(1)), processing all n bytes sequentially.

- **Worst Case -- O(n):** The algorithm always processes every input byte. No input causes more or fewer operations.

- **Space -- O(1):** The lookup table has a fixed size of 256 entries (constant). Only a single hash variable is maintained during processing.

## When to Use

- **Fast hash table indexing:** When you need a quick hash for small hash tables (up to 256 buckets).
- **Checksums for small data:** Quick integrity checks for short messages or data packets.
- **Embedded systems:** The algorithm is extremely lightweight and has a tiny code footprint.
- **When distribution quality matters more than cryptographic security:** Pearson hashing has excellent distribution properties for non-adversarial inputs.
- **Building larger hashes:** Multiple Pearson hash passes with different initial values can construct wider hashes (16-bit, 32-bit, etc.).

## When NOT to Use

- **Cryptographic applications:** Pearson hashing is not collision-resistant against adversarial inputs. Use SHA-256 or BLAKE3 for security.
- **Large hash tables:** An 8-bit hash only provides 256 possible values. For larger tables, use a wider hash function.
- **When collision resistance is critical:** With only 256 possible outputs, collisions are frequent by the birthday paradox.
- **Password hashing:** Use bcrypt, scrypt, or Argon2 for password storage.

## Comparison with Similar Algorithms

| Hash Function    | Output size | Time | Notes                                          |
|-----------------|------------|------|-------------------------------------------------|
| Pearson          | 8 bits     | O(n) | Very fast; excellent distribution; non-crypto    |
| CRC-8            | 8 bits     | O(n) | Error detection; polynomial division             |
| FNV-1a           | 32/64 bits | O(n) | Simple; good distribution; wider output          |
| MurmurHash       | 32/128 bits| O(n) | Very fast; widely used in hash tables            |
| SHA-256          | 256 bits   | O(n) | Cryptographic; much slower; collision-resistant  |

## Implementations

| Language | File |
|----------|------|
| Java     | [PearsonHashing.java](java/PearsonHashing.java) |

## References

- Pearson, P. K. (1990). Fast hashing of variable-length text strings. *Communications of the ACM*, 33(6), 677-680.
- Knuth, D. E. (1997). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.4: Hashing.
- [Pearson Hashing -- Wikipedia](https://en.wikipedia.org/wiki/Pearson_hashing)
