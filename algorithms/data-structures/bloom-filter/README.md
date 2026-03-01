# Bloom Filter

## Overview

A Bloom filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It can produce false positives (reporting an element is present when it is not) but never false negatives (if it reports an element is absent, it is definitely absent). Conceived by Burton Howard Bloom in 1970, it is widely used in applications where space is at a premium and a small false positive rate is acceptable.

A Bloom filter uses a bit array of m bits (initially all set to 0) and k independent hash functions, each mapping an element to one of the m positions uniformly at random.

## How It Works

1. **Initialization**: Create a bit array of m bits, all set to 0. Choose k independent hash functions h1, h2, ..., hk, each producing a value in [0, m-1].

2. **Insertion**: To add an element x, compute h1(x), h2(x), ..., hk(x) and set each corresponding bit to 1.

3. **Query**: To test whether an element x is in the set, compute h1(x), h2(x), ..., hk(x) and check whether all corresponding bits are 1. If any bit is 0, x is definitely not in the set. If all bits are 1, x is probably in the set (with a quantifiable false positive probability).

4. **Deletion**: Standard Bloom filters do not support deletion, because clearing a bit might affect other elements that hash to the same position. Counting Bloom filters replace each bit with a counter to support deletion.

## Worked Example

Parameters: m = 10 bits, k = 3 hash functions.

**Insert "cat"**:
- h1("cat") = 1, h2("cat") = 4, h3("cat") = 7
- Bit array: `[0, 1, 0, 0, 1, 0, 0, 1, 0, 0]`

**Insert "dog"**:
- h1("dog") = 3, h2("dog") = 4, h3("dog") = 8
- Bit array: `[0, 1, 0, 1, 1, 0, 0, 1, 1, 0]`

**Query "cat"**: Check bits 1, 4, 7 -- all are 1. Result: probably present (correct).

**Query "bird"**:
- h1("bird") = 1, h2("bird") = 3, h3("bird") = 9
- Bit 9 is 0. Result: definitely not present (correct).

**Query "fox"**:
- h1("fox") = 3, h2("fox") = 4, h3("fox") = 7
- Bits 3, 4, 7 are all 1 (set by "cat" and "dog"). Result: probably present -- this is a **false positive** since "fox" was never inserted.

**False positive probability**: For m bits, k hash functions, and n inserted elements: p = (1 - e^(-kn/m))^k. The optimal number of hash functions is k = (m/n) * ln(2).

## Pseudocode

```
class BloomFilter:
    initialize(m, k):
        bits = array of m zeros
        hashFunctions = k independent hash functions

    insert(element):
        for i = 1 to k:
            index = hashFunctions[i](element) mod m
            bits[index] = 1

    query(element):
        for i = 1 to k:
            index = hashFunctions[i](element) mod m
            if bits[index] == 0:
                return DEFINITELY_NOT_PRESENT
        return PROBABLY_PRESENT

    falsePositiveRate(n):
        // n = number of inserted elements
        return (1 - e^(-k * n / m))^k
```

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Insert    | O(k) | O(m)  |
| Query     | O(k) | O(m)  |

**Why these complexities?**

- **Time -- O(k):** Both insert and query compute k hash functions and access k positions in the bit array. Each hash computation and bit access is O(1), so the total time per operation is O(k), where k is typically a small constant (3-10).

- **Space -- O(m):** The Bloom filter stores m bits regardless of how many elements are inserted. For a desired false positive rate p and n elements, the optimal size is m = -(n * ln(p)) / (ln(2))^2. For example, to store 1 million elements with a 1% false positive rate requires only about 1.2 MB (9.6 million bits), compared to the potentially tens of megabytes needed to store the actual elements.

## Applications

- **Web browsers**: Google Chrome uses a Bloom filter to check URLs against a list of known malicious websites before fetching the page, avoiding a network request for the vast majority of safe URLs.
- **Database engines**: Apache Cassandra, HBase, and LevelDB use Bloom filters to avoid expensive disk reads for non-existent keys. Before reading an SSTable, the Bloom filter is checked to skip files that definitely do not contain the key.
- **Network routing**: Content delivery networks and routers use Bloom filters for cache summarization and routing table compression.
- **Spell checkers**: Early spell checkers used Bloom filters to compactly store dictionaries, flagging potentially misspelled words for further checking.
- **Duplicate detection**: Web crawlers use Bloom filters to avoid revisiting URLs, and email systems use them to detect duplicate messages.

## When NOT to Use

- **When false positives are unacceptable**: If your application requires a definitive yes/no answer with no error, use a hash set or hash table instead. Bloom filters inherently trade accuracy for space.
- **When deletion is required**: Standard Bloom filters cannot remove elements. Use a counting Bloom filter (which uses more space) or a cuckoo filter if deletion is needed.
- **When the set is small**: For small sets (e.g., fewer than 1000 elements), a hash set uses a comparable amount of memory and provides exact answers.
- **When enumeration is needed**: Bloom filters cannot list the elements they contain. If you need to iterate over the set, use a different data structure.

## Comparison with Similar Structures

| Structure       | Space      | False Positives | False Negatives | Deletion | Lookup Time |
|----------------|-----------|-----------------|-----------------|----------|-------------|
| Bloom Filter    | O(n)      | Yes             | No              | No       | O(k)        |
| Counting Bloom  | O(n)      | Yes             | No              | Yes      | O(k)        |
| Cuckoo Filter   | O(n)      | Yes             | No              | Yes      | O(1)        |
| Hash Set        | O(n*s)    | No              | No              | Yes      | O(1) avg    |
| Sorted Array    | O(n*s)    | No              | No              | O(n)     | O(log n)    |

Where s is the average element size. Bloom filters use approximately 10 bits per element regardless of element size.

## Implementations

| Language | File |
|----------|------|
| Python   | [BloomFilter.py](python/BloomFilter.py) |

## References

- Bloom, B. H. (1970). Space/time trade-offs in hash coding with allowable errors. *Communications of the ACM*, 13(7), 422-426.
- Broder, A., & Mitzenmacher, M. (2004). Network applications of Bloom filters: A survey. *Internet Mathematics*, 1(4), 485-509.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. (Bloom filters discussed in problem 11-2.)
- [Bloom Filter -- Wikipedia](https://en.wikipedia.org/wiki/Bloom_filter)
