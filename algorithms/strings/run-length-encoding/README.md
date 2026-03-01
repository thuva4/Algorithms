# Run-Length Encoding

## Overview

Run-Length Encoding (RLE) is one of the simplest and oldest forms of lossless data compression. It replaces consecutive runs of the same value with a pair: the value followed by the count of consecutive occurrences. RLE is highly effective on data with many long runs of repeated values, such as simple graphics, fax transmissions, and certain binary data formats.

## How It Works

1. Scan the input array from left to right.
2. For each group of consecutive identical elements, output the value followed by the count.
3. Continue until the entire array has been processed.

For decoding, read each (value, count) pair and repeat the value count times.

## Worked Example

**Encoding:**

Given input: `[4, 4, 4, 2, 2, 7, 7, 7, 7, 1]`

- Elements 0-2: three `4`s -- emit `(4, 3)`
- Elements 3-4: two `2`s -- emit `(2, 2)`
- Elements 5-8: four `7`s -- emit `(7, 4)`
- Element 9: one `1` -- emit `(1, 1)`

**Encoded output:** `[4, 3, 2, 2, 7, 4, 1, 1]`

The original 10 elements were compressed to 8 elements (a modest reduction). With longer runs, the compression improves dramatically.

**Decoding:**

Given encoded: `[4, 3, 2, 2, 7, 4, 1, 1]`

- `(4, 3)` -- `[4, 4, 4]`
- `(2, 2)` -- `[2, 2]`
- `(7, 4)` -- `[7, 7, 7, 7]`
- `(1, 1)` -- `[1]`

**Decoded output:** `[4, 4, 4, 2, 2, 7, 7, 7, 7, 1]`

## Pseudocode

```
function rleEncode(arr):
    if arr is empty: return []
    result = []
    count = 1

    for i from 1 to length(arr) - 1:
        if arr[i] == arr[i - 1]:
            count = count + 1
        else:
            result.append(arr[i - 1])
            result.append(count)
            count = 1

    // Don't forget the last run
    result.append(arr[length(arr) - 1])
    result.append(count)

    return result

function rleDecode(encoded):
    result = []
    for i from 0 to length(encoded) - 1 step 2:
        value = encoded[i]
        count = encoded[i + 1]
        repeat value count times and append to result
    return result
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(1)  |
| Average | O(n) | O(n)  |
| Worst   | O(n) | O(2n) |

- **Time O(n):** A single pass through the input, examining each element exactly once.
- **Best case space O(1):** When the entire array is a single run (e.g., `[5, 5, 5, 5]`), the output is just `[5, 4]` -- two elements regardless of input size.
- **Worst case space O(2n):** When no two consecutive elements are the same (e.g., `[1, 2, 3, 4]`), every element becomes a pair `(value, 1)`, doubling the output size. In this case, RLE actually expands the data.

## When to Use

- Images with large areas of solid color (BMP, TIFF, PCX formats)
- Fax transmission (ITU-T Group 3 and Group 4 standards)
- Binary data with long runs (e.g., bitmasks, sparse binary arrays)
- As a preprocessing step before other compression algorithms
- Game level data or tile maps with repeated tiles
- Simple telemetry data compression where sensor readings change infrequently
- When implementation simplicity and speed are priorities

## When NOT to Use

- **Natural language text:** Text rarely has long runs of the same character, so RLE will typically expand the data rather than compress it.
- **Random data or high-entropy data:** Without repeated runs, RLE produces output up to 2x larger than the input.
- **Photographic images:** Natural photos have complex color variation. Use JPEG, PNG, or WebP instead.
- **Audio or video:** These require domain-specific compression (MP3, AAC, H.264, etc.).
- **When better compression is needed:** LZ77, LZ78, Huffman coding, or their combinations (DEFLATE, Brotli) achieve much higher compression ratios on general data.

## Comparison

| Algorithm  | Compression Ratio | Speed      | Best For                     | Complexity |
|------------|-------------------|------------|------------------------------|------------|
| RLE        | Poor-Excellent*   | Very fast  | Data with long repeated runs | O(n)       |
| Huffman    | Moderate          | Fast       | Variable-frequency symbols   | O(n log n) |
| LZ77       | Good              | Fast       | Repeated patterns (general)  | O(n * w)   |
| DEFLATE    | Good              | Fast       | General-purpose              | O(n)       |
| Arithmetic | Good-Excellent    | Moderate   | Skewed probability data      | O(n)       |

*RLE compression ratio is highly data-dependent. On data with long runs it achieves excellent compression; on data without runs it expands the data.

RLE is unmatched in simplicity and speed. It serves as an excellent first-pass compressor when the data is known to have long runs, often combined with other methods (e.g., BWT + MTF + RLE in bzip2).

## References

- Salomon, D. (2007). *Data Compression: The Complete Reference* (4th ed.), Chapter 2. Springer.
- Sayood, K. (2017). *Introduction to Data Compression* (5th ed.), Chapter 3. Morgan Kaufmann.
- Nelson, M. and Gailly, J.L. (1996). *The Data Compression Book* (2nd ed.). M&T Books.

## Implementations

| Language   | File |
|------------|------|
| Python     | [run_length_encoding.py](python/run_length_encoding.py) |
| Java       | [RunLengthEncoding.java](java/RunLengthEncoding.java) |
| C++        | [run_length_encoding.cpp](cpp/run_length_encoding.cpp) |
| C          | [run_length_encoding.c](c/run_length_encoding.c) |
| Go         | [run_length_encoding.go](go/run_length_encoding.go) |
| TypeScript | [runLengthEncoding.ts](typescript/runLengthEncoding.ts) |
| Rust       | [run_length_encoding.rs](rust/run_length_encoding.rs) |
| Kotlin     | [RunLengthEncoding.kt](kotlin/RunLengthEncoding.kt) |
| Swift      | [RunLengthEncoding.swift](swift/RunLengthEncoding.swift) |
| Scala      | [RunLengthEncoding.scala](scala/RunLengthEncoding.scala) |
| C#         | [RunLengthEncoding.cs](csharp/RunLengthEncoding.cs) |
