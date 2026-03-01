# Mo's Algorithm

## Overview

Mo's Algorithm is an offline technique for answering range queries efficiently by reordering the queries to minimize the total work of adjusting a sliding window over the array. It processes Q queries on an array of N elements in O((N + Q) * sqrt(N)) time, which is significantly faster than the O(N * Q) naive approach of recomputing each query from scratch.

The algorithm was popularized by Mo Tao and is widely used in competitive programming for problems involving range queries where no efficient data structure (like a segment tree) applies directly -- for example, counting distinct elements in a range or computing range frequency statistics.

## How It Works

1. **Block Decomposition**: Divide the array indices into blocks of size B = floor(sqrt(N)).

2. **Sort Queries**: Sort all queries [l, r] by (block of l, r). That is, queries whose left endpoints fall in the same block are grouped together and sorted by their right endpoints. An optimization: for odd-numbered blocks, sort r in descending order to reduce total pointer movement.

3. **Maintain Current Range**: Keep a "current answer" and two pointers, curL and curR, defining the currently computed range. For each query in sorted order:
   - Expand or shrink the range by moving curL and curR one step at a time, adding or removing elements from the answer.
   - When curR moves right, add the new element. When curR moves left, remove the element.
   - Similarly for curL.

4. **Answer the Query**: Once curL and curR match the query bounds, record the answer.

The key insight is that the sorting order ensures:
- The right pointer moves at most O(N) times within each block of left endpoints (Q/sqrt(N) blocks with O(N) movement each).
- The left pointer moves at most O(sqrt(N)) between consecutive queries in the same block.
- Total movement: O((N + Q) * sqrt(N)).

## Worked Example

Array: `[1, 1, 2, 1, 3]`, Queries: sum(0,2), sum(1,4), sum(2,3). Block size B = floor(sqrt(5)) = 2.

**Sort queries** by (l/B, r):
- sum(0,2): block 0, r=2
- sum(1,4): block 0, r=4
- sum(2,3): block 1, r=3

Sorted order: sum(0,2), sum(1,4), sum(2,3).

**Process:**

Query sum(0,2): Expand from empty to [0,2].
- Add arr[0]=1, add arr[1]=1, add arr[2]=2. Current sum = 4.
- Answer: 4. curL=0, curR=2.

Query sum(1,4): Move curL from 0 to 1 (remove arr[0]=1), move curR from 2 to 4 (add arr[3]=1, arr[4]=3).
- sum = 4 - 1 + 1 + 3 = 7.
- Answer: 7. curL=1, curR=4.

Query sum(2,3): Move curL from 1 to 2 (remove arr[1]=1), move curR from 4 to 3 (remove arr[4]=3).
- sum = 7 - 1 - 3 = 3.
- Answer: 3. curL=2, curR=3.

Total pointer movements: 2 + 3 + 2 = 7 (compared to 3+4+2 = 9 for recomputing each from scratch).

## Pseudocode

```
function mosAlgorithm(arr, queries):
    N = length(arr)
    B = floor(sqrt(N))

    // Sort queries by (l/B, r). For odd blocks, reverse r order.
    sort queries by:
        primary key: l / B
        secondary key: r (ascending if block is even, descending if odd)

    curL = 0
    curR = -1
    currentAnswer = 0
    answers = array of size Q

    for each query (l, r, originalIndex) in sorted order:
        // Expand right
        while curR < r:
            curR = curR + 1
            add(arr[curR])

        // Shrink right
        while curR > r:
            remove(arr[curR])
            curR = curR - 1

        // Expand left
        while curL > l:
            curL = curL - 1
            add(arr[curL])

        // Shrink left
        while curL < l:
            remove(arr[curL])
            curL = curL + 1

        answers[originalIndex] = currentAnswer

    return answers
```

## Complexity Analysis

| Case    | Time              | Space  |
|---------|------------------|--------|
| Best    | O((N+Q)*sqrt(N)) | O(N+Q) |
| Average | O((N+Q)*sqrt(N)) | O(N+Q) |
| Worst   | O((N+Q)*sqrt(N)) | O(N+Q) |

**Why these complexities?**

- **Right pointer movement -- O(N * sqrt(N)):** Queries are grouped into sqrt(N) blocks by their left endpoint. Within each block, r is sorted, so the right pointer moves at most N positions per block. Over sqrt(N) blocks, total right pointer movement is O(N * sqrt(N)).

- **Left pointer movement -- O(N * sqrt(N)):** Between consecutive queries in the same block, the left pointer moves at most 2B = O(sqrt(N)) positions. Across Q queries, the left pointer moves O(Q * sqrt(N)). If Q is O(N), this is O(N * sqrt(N)).

- **Total -- O((N + Q) * sqrt(N)):** Combining both pointer movements. The add/remove operations must be O(1) each for this bound to hold.

- **Space -- O(N + Q):** The array and query answers require O(N + Q) storage. Any auxiliary data structure for tracking the current answer (e.g., a frequency array) adds at most O(N) space.

## Applications

- **Range distinct count**: Count the number of distinct values in a subarray. Maintain a frequency array and a counter of non-zero frequencies.
- **Range frequency queries**: Count how many times a specific value appears in a range.
- **Range mode queries**: Find the most frequent element in a range.
- **Competitive programming**: Mo's algorithm is a go-to technique for offline range queries that do not have a clean segment tree solution, particularly when the "add" and "remove" operations are O(1).

## When NOT to Use

- **Online queries**: Mo's algorithm requires all queries upfront to sort them. If queries arrive one at a time and must be answered immediately, use a segment tree or other online data structure.
- **When updates are interleaved with queries**: Mo's algorithm works on a static array. If elements change between queries, use Mo's algorithm with updates (a variant with O(N^(5/3)) complexity) or a different approach.
- **When add/remove is expensive**: If adding or removing an element from the current range is not O(1) (e.g., maintaining a sorted set), the total complexity increases to O((N + Q) * sqrt(N) * T) where T is the cost per add/remove.
- **When a direct O(n log n) or O(1) per query structure exists**: If the query can be answered with a sparse table, segment tree, or prefix sums in better time, prefer those.

## Comparison with Similar Techniques

| Technique            | Time per Query | Offline? | Supports Updates | Space   |
|---------------------|---------------|----------|-----------------|---------|
| Mo's Algorithm       | O(sqrt(N))*   | Yes      | No              | O(N+Q)  |
| Segment Tree         | O(log N)      | No       | Yes             | O(N)    |
| Sparse Table         | O(1)          | No       | No              | O(N log N)|
| Sqrt Decomposition   | O(sqrt(N))    | No       | Yes             | O(N)    |
| Prefix Sums          | O(1)          | No       | No (static)     | O(N)    |

\* = amortized across all queries

## Implementations

| Language   | File |
|------------|------|
| Python     | [mo_algorithm.py](python/mo_algorithm.py) |
| Java       | [MoAlgorithm.java](java/MoAlgorithm.java) |
| C++        | [mo_algorithm.cpp](cpp/mo_algorithm.cpp) |
| C          | [mo_algorithm.c](c/mo_algorithm.c) |
| Go         | [mo_algorithm.go](go/mo_algorithm.go) |
| TypeScript | [moAlgorithm.ts](typescript/moAlgorithm.ts) |
| Rust       | [mo_algorithm.rs](rust/mo_algorithm.rs) |
| Kotlin     | [MoAlgorithm.kt](kotlin/MoAlgorithm.kt) |
| Swift      | [MoAlgorithm.swift](swift/MoAlgorithm.swift) |
| Scala      | [MoAlgorithm.scala](scala/MoAlgorithm.scala) |
| C#         | [MoAlgorithm.cs](csharp/MoAlgorithm.cs) |

## References

- Mo's Algorithm Tutorial -- [HackerEarth](https://www.hackerearth.com/practice/notes/mos-algorithm/)
- [Mo's Algorithm -- CP-Algorithms](https://cp-algorithms.com/data_structures/sqrt_decomposition.html)
- Hilbert Curve Optimization for Mo's Algorithm -- [Codeforces Blog](https://codeforces.com/blog/entry/61203)
