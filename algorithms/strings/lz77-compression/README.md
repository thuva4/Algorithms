# LZ77 Compression

## Overview

LZ77 is a lossless data compression algorithm published by Abraham Lempel and Jacob Ziv in 1977. It forms the basis of many widely used compression formats including gzip, DEFLATE, PNG, and ZIP. The algorithm works by replacing repeated occurrences of data with references to a single earlier copy, using a sliding window to find matches in previously seen data.

This simplified implementation scans through an integer array and counts how many positions have a back-reference match in a sliding window of previous elements. A match requires at least 2 consecutive equal elements.

## How It Works

1. Maintain a sliding window of the most recent `w` elements (the "search buffer").
2. At the current position, look for the longest sequence of elements that matches a sequence starting somewhere in the sliding window.
3. If a match of length >= 2 is found, emit a back-reference `(offset, length)` where offset is the distance back to the match start, and length is the match length. Advance by the match length.
4. If no match is found, emit the element as a literal and advance by 1.
5. The output of this implementation is the count of back-references found.

Input format: array of integers
Output: number of back-references found

## Worked Example

Given input: `[1, 2, 3, 1, 2, 3, 4]` with window size `w = 6`:

- Position 0: `1` -- no previous data, emit literal
- Position 1: `2` -- no match of length >= 2, emit literal
- Position 2: `3` -- no match of length >= 2, emit literal
- Position 3: `1` -- look back in window `[1, 2, 3]`. Found `1, 2, 3` starting at offset 3, length 3. Emit back-reference (3, 3). Advance to position 6.
- Position 6: `4` -- no match in window, emit literal

**Result:** 1 back-reference found

## Pseudocode

```
function lz77CountBackReferences(data, windowSize):
    n = length(data)
    count = 0
    i = 0

    while i < n:
        bestLength = 0
        bestOffset = 0
        searchStart = max(0, i - windowSize)

        for j from searchStart to i - 1:
            matchLen = 0
            while i + matchLen < n and data[j + matchLen] == data[i + matchLen]:
                matchLen = matchLen + 1
                if j + matchLen >= i:
                    break

            if matchLen >= 2 and matchLen > bestLength:
                bestLength = matchLen
                bestOffset = i - j

        if bestLength >= 2:
            count = count + 1
            i = i + bestLength
        else:
            i = i + 1

    return count
```

## Complexity Analysis

| Case    | Time     | Space |
|---------|----------|-------|
| Best    | O(n)     | O(n)  |
| Average | O(n * w) | O(n)  |
| Worst   | O(n * w) | O(n)  |

Where `n` is the input length and `w` is the sliding window size.

- **Best case O(n):** When no matches are found (all elements are unique), each position requires only a scan through the window that quickly fails to find length-2 matches.
- **Average/Worst case O(n * w):** For each of the n positions, we may scan up to w positions backward and compare sequences.
- **Space O(n):** The input array is stored. The sliding window is a view into the same array, so no additional significant space is needed beyond the output.
- Real implementations use hash tables or suffix trees to accelerate match finding, reducing average time to nearly O(n).

## When to Use

- General-purpose lossless data compression
- Compressing files with repeating patterns (text files, source code, log files)
- As a component in DEFLATE, gzip, and ZIP compression
- Network protocol compression (HTTP compression)
- Image format compression (PNG uses DEFLATE which is LZ77 + Huffman)
- When the data has significant local redundancy

## When NOT to Use

- **Already compressed data:** Applying LZ77 to JPEG, MP3, or other compressed formats will not reduce size and may slightly increase it.
- **Random or high-entropy data:** If the data has no repeating patterns, LZ77 produces output larger than the input due to encoding overhead.
- **When decompression speed is critical above all else:** LZ77 decompression is fast, but simpler schemes like RLE have even lower decompression overhead.
- **Streaming with extreme latency requirements:** The sliding window approach requires buffering. For zero-latency needs, consider simpler encoding methods.
- **When better compression ratio is paramount:** LZ77 alone is often combined with entropy coding (Huffman or arithmetic coding) for better compression. For maximum ratio, consider LZ78, LZMA, or Brotli.

## Comparison

| Algorithm | Compression Ratio | Speed    | Complexity | Used In           |
|-----------|-------------------|----------|------------|-------------------|
| LZ77      | Good              | Fast     | O(n * w)   | gzip, PNG, ZIP    |
| LZ78/LZW  | Good              | Fast     | O(n)       | GIF, Unix compress|
| LZMA      | Excellent         | Slower   | O(n * w)   | 7z, xz            |
| RLE       | Poor (general)    | Very fast| O(n)       | BMP, fax          |
| Huffman   | Moderate          | Fast     | O(n log n) | JPEG, MP3 (part)  |
| Brotli    | Excellent         | Moderate | O(n)       | Web (HTTP)        |

LZ77 strikes a good balance between compression ratio and speed. It is the foundation of the DEFLATE algorithm (LZ77 + Huffman coding), which is one of the most widely deployed compression algorithms in the world. LZMA achieves better compression at the cost of speed; RLE is faster but only effective on data with long runs.

## References

- Ziv, J. and Lempel, A. (1977). "A Universal Algorithm for Sequential Data Compression." *IEEE Transactions on Information Theory*, 23(3), 337-343.
- Salomon, D. (2007). *Data Compression: The Complete Reference* (4th ed.). Springer.
- Sayood, K. (2017). *Introduction to Data Compression* (5th ed.). Morgan Kaufmann.
- RFC 1951 - DEFLATE Compressed Data Format Specification.

## Implementations

| Language   | File |
|------------|------|
| Python     | [lz77_compression.py](python/lz77_compression.py) |
| Java       | [Lz77Compression.java](java/Lz77Compression.java) |
| C++        | [lz77_compression.cpp](cpp/lz77_compression.cpp) |
| C          | [lz77_compression.c](c/lz77_compression.c) |
| Go         | [lz77_compression.go](go/lz77_compression.go) |
| TypeScript | [lz77Compression.ts](typescript/lz77Compression.ts) |
| Rust       | [lz77_compression.rs](rust/lz77_compression.rs) |
| Kotlin     | [Lz77Compression.kt](kotlin/Lz77Compression.kt) |
| Swift      | [Lz77Compression.swift](swift/Lz77Compression.swift) |
| Scala      | [Lz77Compression.scala](scala/Lz77Compression.scala) |
| C#         | [Lz77Compression.cs](csharp/Lz77Compression.cs) |
