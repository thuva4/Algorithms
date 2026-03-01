# Bitap Algorithm

## Overview

The Bitap Algorithm (also known as the Shift-Or or Shift-And algorithm) is a string matching algorithm that uses bitwise operations to efficiently find exact or approximate occurrences of a pattern in a text. It represents the state of the search as a bitmask, where each bit corresponds to a position in the pattern. By using bitwise shifts and OR/AND operations, it achieves highly efficient matching that fits naturally within a CPU word.

The Bitap algorithm is the basis of the `agrep` (approximate grep) tool and is used in fuzzy string matching applications. When the pattern length is within the machine word size (typically 32 or 64 characters), each step requires only O(1) bitwise operations.

## How It Works

For each character in the alphabet, the algorithm precomputes a bitmask indicating the positions in the pattern where that character appears. During the search, it maintains a state bitmask `R` that is updated for each character in the text using a bitwise shift and OR operation. If the bit at position m-1 (where m is the pattern length) is zero, a match is found at the current position.

### Example

Pattern: `"ABAB"`, Text: `"AABABAB"`

**Step 1: Precompute character masks (0 = match, 1 = no match):**

For pattern "ABAB" (positions 0-3):

| Char | Pos 3 | Pos 2 | Pos 1 | Pos 0 | Bitmask (binary) |
|------|-------|-------|-------|-------|-------------------|
| A | 1 | 0 | 1 | 0 | 1010 |
| B | 0 | 1 | 0 | 1 | 0101 |
| * | 1 | 1 | 1 | 1 | 1111 |

**Step 2: Search (using Shift-Or, 0 = active match):**

Initial state R = `1111` (all bits set, no matches)

| Step | Text char | Shift R left + set bit 0 | OR with mask | New R | Match? (R[3]=0?) |
|------|-----------|--------------------------|-------------|-------|-------------------|
| 1 | A | (1111 << 1) OR 1 = 1111 | 1111 OR 1010 = 1111 | 1111 | No |
| 2 | A | (1111 << 1) OR 1 = 1111 | 1111 OR 1010 = 1111 | 1111 | No |
| 3 | B | (1111 << 1) OR 1 = 1111 | 1111 OR 0101 = 1111 | 1111 | No |
| 4 | A | (1111 << 1) OR 1 = 1111 | 1111 OR 1010 = 1111 | 1111 | No |
| 5 | B | (1111 << 1) OR 1 = 1111 | 1111 OR 0101 = 1111 | 1111 | No |

Wait -- let me restate with the correct Shift-Or formulation where bit 0 corresponds to "just started matching":

| Step | Text[i] | R = ((R << 1) \| mask[text[i]]) | R (binary) | Bit m-1 = 0? |
|------|---------|--------------------------------------|------------|---------------|
| 0 | - | Initial | 1111 | No |
| 1 | A | (11111 \| 1010) = ~(~1111<<1) \| 1010 | 1110 | No |
| 2 | A | (11101 \| 1010) | 1010 | No |
| 3 | B | (10101 \| 0101) | 0101 | No |
| 4 | A | (01011 \| 1010) | 1010 | No |
| 5 | B | (10101 \| 0101) | 0101 | No |
| 6 | A | (01011 \| 1010) | 1010 | No |
| 7 | B | (10101 \| 0101) | 0101 | Yes (bit 3 = 0)! |

Result: Pattern `"ABAB"` found ending at index 6 (starting at index `3`).

## Pseudocode

```
function bitapSearch(text, pattern):
    m = length(pattern)
    if m > WORD_SIZE:
        return error("pattern too long")

    // Precompute character bitmasks
    mask = array of size ALPHABET_SIZE, all set to ~0 (all 1s)
    for i from 0 to m - 1:
        mask[pattern[i]] = mask[pattern[i]] AND NOT (1 << i)

    R = ~0  // all bits set (no matches)

    for i from 0 to length(text) - 1:
        R = (R << 1) OR mask[text[i]]
        if (R AND (1 << (m - 1))) == 0:
            // Match found ending at position i
            report match at position i - m + 1

    return results
```

The algorithm processes one text character per iteration with just a shift, an OR, and a comparison -- all O(1) bitwise operations. This makes it extremely fast in practice.

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(m)  |
| Average | O(n) | O(m)  |
| Worst   | O(nm) | O(m)  |

**Why these complexities?**

- **Best Case -- O(n):** When the pattern fits in a single machine word (m <= 64), each text character is processed with O(1) bitwise operations. The total is O(n) for the text scan plus O(m) for preprocessing.

- **Average Case -- O(n):** Same as best case when the pattern fits in a machine word. The constant factor is very small due to the efficiency of bitwise operations.

- **Worst Case -- O(nm):** When the pattern exceeds the machine word size, multiple words are needed to represent the bitmask, and each step requires O(m/w) word operations where w is the word size. For extremely long patterns, this degrades to O(nm/w).

- **Space -- O(m):** The character bitmasks require O(|alphabet| * ceil(m/w)) space. For small alphabets and patterns within word size, this is effectively O(1).

## When to Use

- **Short patterns (within machine word size):** When the pattern length is at most 32 or 64 characters, the algorithm is extremely fast.
- **Approximate matching:** The Bitap algorithm extends naturally to allow k mismatches by maintaining k+1 bitmasks.
- **Fuzzy string search:** The `agrep` tool uses Bitap for approximate grep operations.
- **When implementation simplicity is valued:** The core algorithm is just a few lines of bitwise operations.

## When NOT to Use

- **Long patterns:** Patterns longer than the machine word size lose the O(1)-per-character advantage.
- **Multiple pattern matching:** Use Aho-Corasick for searching many patterns simultaneously.
- **When worst-case guarantees are needed:** KMP provides guaranteed O(n + m) for any pattern length.
- **Very large alphabets:** The precomputation of character masks scales with alphabet size.

## Comparison with Similar Algorithms

| Algorithm   | Time (typical) | Space | Notes                                          |
|------------|---------------|-------|-------------------------------------------------|
| Bitap       | O(n)          | O(m)  | Very fast for short patterns; supports fuzzy match|
| KMP         | O(n + m)      | O(m)  | Guaranteed linear; no pattern length restriction  |
| Rabin-Karp  | O(n + m)      | O(1)  | Hash-based; good for multi-pattern                |
| Boyer-Moore | O(n/m) best   | O(m)  | Can skip characters; fastest for long patterns    |

## Implementations

| Language | File |
|----------|------|
| Python   | [BiTap.py](python/BiTap.py) |
| C++      | [Bitap.cpp](cpp/Bitap.cpp) |

## References

- Baeza-Yates, R., & Gonnet, G. H. (1992). A new approach to text searching. *Communications of the ACM*, 35(10), 74-82.
- Wu, S., & Manber, U. (1992). Fast text searching allowing errors. *Communications of the ACM*, 35(10), 83-91.
- [Bitap Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Bitap_algorithm)
