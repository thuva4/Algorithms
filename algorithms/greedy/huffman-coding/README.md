# Huffman Coding

## Overview

Huffman Coding is a greedy algorithm for lossless data compression. It assigns variable-length binary codes to characters based on their frequencies: frequently occurring characters get shorter codes, while rare characters get longer codes. The result is an optimal prefix-free code, meaning no code is a prefix of another, enabling unambiguous decoding.

Developed by David A. Huffman in 1952, this algorithm is a foundational technique in information theory and is used in file compression formats such as ZIP, GZIP, and JPEG.

## How It Works

The algorithm builds a binary tree (the Huffman tree) from the bottom up:

1. Create a leaf node for each character with its frequency and insert all nodes into a min-priority queue (min-heap).
2. While there is more than one node in the queue:
   a. Extract the two nodes with the lowest frequency.
   b. Create a new internal node with these two as children and frequency equal to their sum.
   c. Insert the new node back into the queue.
3. The remaining node is the root of the Huffman tree.
4. The total weighted path length (sum of frequency * code length for each character) gives the total number of bits needed to encode the data.

### Example

Given frequencies: `[5, 9, 12, 13, 16, 45]` (for characters a through f)

**Building the tree:**

| Step | Queue Contents | Action |
|------|---------------|--------|
| 0 | 5, 9, 12, 13, 16, 45 | Initial state |
| 1 | 12, 13, 14, 16, 45 | Merge 5+9=14 |
| 2 | 14, 16, 25, 45 | Merge 12+13=25 |
| 3 | 25, 30, 45 | Merge 14+16=30 |
| 4 | 45, 55 | Merge 25+30=55 |
| 5 | 100 | Merge 45+55=100 |

**Resulting codes:**
- f(45): `0` (1 bit)
- c(12): `100` (3 bits)
- d(13): `101` (3 bits)
- a(5): `1100` (4 bits)
- b(9): `1101` (4 bits)
- e(16): `111` (3 bits)

**Total bits:** 45*1 + 5*4 + 9*4 + 12*3 + 13*3 + 16*3 = 45 + 20 + 36 + 36 + 39 + 48 = 224

## Pseudocode

```
function huffmanCoding(frequencies):
    n = length(frequencies)
    if n <= 1:
        return 0

    minHeap = new MinHeap()
    for each freq in frequencies:
        minHeap.insert(freq)

    totalCost = 0
    while minHeap.size() > 1:
        left = minHeap.extractMin()
        right = minHeap.extractMin()
        merged = left + right
        totalCost += merged
        minHeap.insert(merged)

    return totalCost
```

The total weighted path length equals the sum of all internal node values, which is computed by accumulating the merged values during tree construction.

## Complexity Analysis

| Case    | Time       | Space |
|---------|------------|-------|
| Best    | O(n log n) | O(n)  |
| Average | O(n log n) | O(n)  |
| Worst   | O(n log n) | O(n)  |

- **Time -- O(n log n):** We perform n-1 extract-min and insert operations on a heap of at most n elements. Each heap operation takes O(log n), giving O(n log n) total.
- **Space -- O(n):** The min-heap stores at most n elements at any time.

## Applications

- **File compression:** ZIP, GZIP, and BZIP2 use Huffman coding as part of their compression pipeline.
- **Image compression:** JPEG uses Huffman coding for entropy coding of quantized coefficients.
- **Network protocols:** HTTP/2 header compression (HPACK) uses Huffman coding.
- **Text encoding:** Foundation for understanding variable-length encoding schemes.
- **Information theory:** Demonstrates that entropy provides a lower bound on average code length.

## Implementations

| Language   | File |
|------------|------|
| Python     | [huffman_coding.py](python/huffman_coding.py) |
| Java       | [HuffmanCoding.java](java/HuffmanCoding.java) |
| C++        | [huffman_coding.cpp](cpp/huffman_coding.cpp) |
| C          | [huffman_coding.c](c/huffman_coding.c) |
| Go         | [huffman_coding.go](go/huffman_coding.go) |
| TypeScript | [huffmanCoding.ts](typescript/huffmanCoding.ts) |
| Kotlin     | [HuffmanCoding.kt](kotlin/HuffmanCoding.kt) |
| Rust       | [huffman_coding.rs](rust/huffman_coding.rs) |
| Swift      | [HuffmanCoding.swift](swift/HuffmanCoding.swift) |
| Scala      | [HuffmanCoding.scala](scala/HuffmanCoding.scala) |
| C#         | [HuffmanCoding.cs](csharp/HuffmanCoding.cs) |

## References

- Huffman, D. A. (1952). "A Method for the Construction of Minimum-Redundancy Codes." *Proceedings of the IRE*, 40(9), 1098-1101.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 16.3: Huffman Codes.
- [Huffman Coding -- Wikipedia](https://en.wikipedia.org/wiki/Huffman_coding)
