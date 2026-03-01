# Reservoir Sampling

## Overview

Reservoir Sampling is a family of randomized algorithms for choosing a simple random sample of k items from a stream of unknown (or very large) length n. The most well-known variant is Algorithm R, introduced by Jeffrey Vitter in 1985. The key insight is that you can maintain a uniformly random sample without knowing the total size of the data in advance, using only O(k) memory. Each element in the stream has an equal probability of k/n of being included in the final sample.

## How It Works

1. Fill the reservoir array with the first k elements from the stream.
2. For each subsequent element at position i (where i ranges from k to n-1):
   - Generate a random integer j uniformly in [0, i].
   - If j < k, replace reservoir[j] with the current element.
3. After processing all elements, the reservoir contains k items chosen uniformly at random from the stream.

### Why It Works

Consider any element at position m in the stream. Its probability of being in the final reservoir:
- It is selected into the reservoir with probability k/(m+1) (for m >= k).
- It survives each subsequent step i with probability 1 - 1/(i+1) * (probability of being replaced).
- The product telescopes to exactly k/n.

## Worked Example

Sample k = 2 items from stream [10, 20, 30, 40, 50] using a fixed random sequence.

**Step 1:** Fill reservoir with first 2 elements: reservoir = [10, 20].

**Step 2 (i=2, element=30):** Random j in [0,2]. Suppose j = 1 (j < k=2), so replace reservoir[1]: reservoir = [10, 30].

**Step 3 (i=3, element=40):** Random j in [0,3]. Suppose j = 3 (j >= k=2), so no replacement: reservoir = [10, 30].

**Step 4 (i=4, element=50):** Random j in [0,4]. Suppose j = 0 (j < k=2), so replace reservoir[0]: reservoir = [50, 30].

Final sample: **{50, 30}**.

Each of the 5 elements had a 2/5 = 40% chance of being in the final reservoir.

## Pseudocode

```
function reservoirSample(stream, k, seed):
    rng = initRandom(seed)
    reservoir = stream[0..k-1]

    for i from k to length(stream) - 1:
        j = rng.nextInt(0, i)    // uniform random in [0, i]
        if j < k:
            reservoir[j] = stream[i]

    return reservoir
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(n) | O(k)  |
| Average | O(n) | O(k)  |
| Worst   | O(n) | O(k)  |

- **Time O(n):** Every element in the stream must be examined exactly once.
- **Space O(k):** Only the reservoir of k elements is stored, regardless of n.

## Applications

- **Sampling from data streams:** Selecting representative items from a continuous feed (e.g., network packets, sensor readings, log lines).
- **Database systems:** Approximate query processing by maintaining a random sample of rows.
- **Machine learning:** Random mini-batch selection from large datasets that do not fit in memory.
- **Distributed systems:** Each node can independently run reservoir sampling, and results can be merged.
- **A/B testing:** Randomly assigning users to test groups from a stream of incoming users.

## When NOT to Use

- **When the total size n is known in advance:** Fisher-Yates shuffle (on the first k elements of a random permutation) or simple random indexing is more straightforward.
- **When weighted sampling is needed:** Standard reservoir sampling assumes uniform weights. For weighted streams, use the weighted reservoir sampling variant (e.g., Efraimidis & Spirakis, 2006).
- **When order matters:** Reservoir sampling does not preserve the original order of selected elements. If order must be maintained, use a different approach.
- **When k is close to n:** If you need most of the stream, it is more efficient to decide which items to exclude rather than include.

## Comparison

| Method                     | Time  | Space | Requires n known? | Notes                                    |
|----------------------------|-------|-------|-------------------|------------------------------------------|
| Reservoir Sampling (Alg R) | O(n)  | O(k)  | No                | Standard; single-pass; uniform           |
| Fisher-Yates partial       | O(k)  | O(n)  | Yes               | Requires random access to full array     |
| Random index selection     | O(k)  | O(k)  | Yes               | Generate k random indices; simple        |
| Weighted reservoir         | O(n)  | O(k)  | No                | For non-uniform probabilities            |
| Reservoir with skip (Vitter)| O(k(1 + log(n/k))) | O(k) | No | Faster; skips over non-selected items  |

## References

- Vitter, J. S. (1985). "Random sampling with a reservoir." *ACM Transactions on Mathematical Software*, 11(1), 37-57.
- Efraimidis, P. S., & Spirakis, P. G. (2006). "Weighted random sampling with a reservoir." *Information Processing Letters*, 97(5), 181-185.
- Knuth, D. E. (1997). *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms* (3rd ed.). Addison-Wesley. Section 3.4.2.
- [Reservoir sampling -- Wikipedia](https://en.wikipedia.org/wiki/Reservoir_sampling)

## Implementations

| Language   | File |
|------------|------|
| Python     | [reservoir_sampling.py](python/reservoir_sampling.py) |
| Java       | [ReservoirSampling.java](java/ReservoirSampling.java) |
| C++        | [reservoir_sampling.cpp](cpp/reservoir_sampling.cpp) |
| C          | [reservoir_sampling.c](c/reservoir_sampling.c) |
| Go         | [reservoir_sampling.go](go/reservoir_sampling.go) |
| TypeScript | [reservoirSampling.ts](typescript/reservoirSampling.ts) |
| Rust       | [reservoir_sampling.rs](rust/reservoir_sampling.rs) |
| Kotlin     | [ReservoirSampling.kt](kotlin/ReservoirSampling.kt) |
| Swift      | [ReservoirSampling.swift](swift/ReservoirSampling.swift) |
| Scala      | [ReservoirSampling.scala](scala/ReservoirSampling.scala) |
| C#         | [ReservoirSampling.cs](csharp/ReservoirSampling.cs) |
