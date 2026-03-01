# Cuckoo Hashing

## Overview

Cuckoo Hashing is an open-addressing hash table scheme that achieves O(1) worst-case lookup time by using two (or more) hash functions and two separate tables. When a collision occurs during insertion, the existing element is evicted from its position and relocated to its alternate location, much like how a cuckoo bird pushes other eggs out of a nest. This eviction cascade continues until every element finds a home or a cycle is detected, triggering a rehash with new hash functions.

Cuckoo Hashing was introduced by Rasmus Pagh and Flemming Friche Rodler in 2001 and has since become an important building block in networking hardware, concurrent data structures, and as the basis for the cuckoo filter.

## How It Works

1. **Two Hash Functions**: Maintain two hash functions h1 and h2, and two tables T1 and T2 of equal size.
2. **Lookup**: To find key x, check T1[h1(x)] and T2[h2(x)]. If either location contains x, it is present. This takes exactly two memory accesses in the worst case.
3. **Insertion**: To insert key x:
   - Try to place x at T1[h1(x)].
   - If that slot is empty, place x there and return.
   - If occupied by key y, evict y and place x there. Now try to place y at its alternate location in the other table.
   - Repeat the eviction process. If the number of evictions exceeds a threshold (indicating a cycle), rehash both tables with new hash functions and reinsert all elements.
4. **Deletion**: To delete key x, check both tables and clear the matching slot. O(1) worst-case.

### Input/Output Format

- Input: `[n, key1, key2, ..., keyn]` -- insert n keys then count successful insertions.
- Output: number of successfully inserted unique keys.

## Worked Example

Tables of size 4, h1(x) = x mod 4, h2(x) = (x / 4) mod 4.

**Insert 6**: h1(6) = 2. T1[2] is empty. Place 6 at T1[2].
```
T1: [_, _, 6, _]    T2: [_, _, _, _]
```

**Insert 10**: h1(10) = 2. T1[2] is occupied by 6. Evict 6, place 10 at T1[2].
Now insert 6 into T2: h2(6) = 1. T2[1] is empty. Place 6 at T2[1].
```
T1: [_, _, 10, _]   T2: [_, 6, _, _]
```

**Insert 14**: h1(14) = 2. T1[2] is occupied by 10. Evict 10, place 14 at T1[2].
Now insert 10 into T2: h2(10) = 2. T2[2] is empty. Place 10 at T2[2].
```
T1: [_, _, 14, _]   T2: [_, 6, 10, _]
```

**Lookup 6**: Check T1[h1(6)] = T1[2] = 14 (not 6). Check T2[h2(6)] = T2[1] = 6. Found in 2 probes.

## Pseudocode

```
class CuckooHashTable:
    initialize(size):
        T1 = array of size empty slots
        T2 = array of size empty slots
        MAX_EVICTIONS = 6 * log2(size)

    lookup(key):
        if T1[h1(key)] == key: return true
        if T2[h2(key)] == key: return true
        return false

    insert(key):
        if lookup(key): return    // already present

        for i = 0 to MAX_EVICTIONS:
            if T1[h1(key)] is empty:
                T1[h1(key)] = key
                return
            swap(key, T1[h1(key)])

            if T2[h2(key)] is empty:
                T2[h2(key)] = key
                return
            swap(key, T2[h2(key)])

        // Cycle detected: rehash everything
        rehash()
        insert(key)

    rehash():
        collect all keys from T1 and T2
        choose new hash functions h1, h2
        clear T1 and T2
        re-insert all collected keys
```

## Complexity Analysis

| Case    | Time (lookup) | Time (insert amortized) | Space |
|---------|--------------|------------------------|-------|
| Best    | O(1)         | O(1)                   | O(n)  |
| Average | O(1)         | O(1)                   | O(n)  |
| Worst   | O(1)         | O(n) on rehash         | O(n)  |

**Why these complexities?**

- **Lookup -- O(1) worst-case:** Every lookup checks exactly two table positions (T1[h1(x)] and T2[h2(x)]), regardless of the number of elements stored. This is the key advantage over other open-addressing schemes like linear probing, where the worst case is O(n).

- **Insert -- O(1) amortized:** Most insertions settle quickly. The expected length of a cuckoo eviction chain is O(1) when the load factor is below 50%. However, if a cycle is detected, a full rehash is required, which takes O(n) time. With random hash functions, rehashes are rare enough that the amortized cost remains O(1).

- **Space -- O(n):** Two tables are maintained, each with capacity roughly n/load_factor. With a typical load factor of ~50%, the total space is about 2n slots. Each slot stores one key-value pair.

## Applications

- **Network hardware**: Cuckoo hashing is used in network switches and routers for high-speed packet classification, where O(1) worst-case lookup is essential for wire-speed processing.
- **Cuckoo filters**: The cuckoo filter, a compact alternative to Bloom filters, stores fingerprints in a cuckoo hash table to support both membership queries and deletion.
- **Hardware lookup tables**: FPGA-based and ASIC-based systems use cuckoo hashing for deterministic-latency table lookups.
- **Concurrent hash tables**: Cuckoo hashing's simple structure enables efficient lock-free and lock-striped concurrent implementations.

## When NOT to Use

- **High load factors needed**: Cuckoo hashing with two hash functions becomes unstable above ~50% load factor. If memory efficiency is critical, use linear probing (which works up to 70-80% load) or Robin Hood hashing.
- **Variable-size keys**: Cuckoo hashing works best with fixed-size keys or fingerprints. For variable-length keys, the overhead of managing pointers may negate the benefits.
- **Simple use cases**: If O(1) worst-case is not required and average-case O(1) suffices, a standard hash table with chaining or linear probing is simpler to implement and equally performant in practice.

## Comparison with Similar Structures

| Structure         | Lookup (worst) | Insert (amortized) | Load Factor | Cache-Friendly |
|-------------------|---------------|-------------------|-------------|----------------|
| Cuckoo Hashing    | O(1)          | O(1)              | ~50%        | Moderate       |
| Separate Chaining | O(n)          | O(1)              | > 100%      | Poor           |
| Linear Probing    | O(n)          | O(1)              | ~70-80%     | Excellent      |
| Robin Hood Hashing| O(log n)      | O(1)              | ~90%        | Excellent      |
| Hopscotch Hashing | O(H)          | O(1)              | ~90%        | Excellent      |

## Implementations

| Language   | File |
|------------|------|
| Python     | [cuckoo_hashing.py](python/cuckoo_hashing.py) |
| Java       | [CuckooHashing.java](java/CuckooHashing.java) |
| C++        | [cuckoo_hashing.cpp](cpp/cuckoo_hashing.cpp) |
| C          | [cuckoo_hashing.c](c/cuckoo_hashing.c) |
| Go         | [cuckoo_hashing.go](go/cuckoo_hashing.go) |
| TypeScript | [cuckooHashing.ts](typescript/cuckooHashing.ts) |
| Rust       | [cuckoo_hashing.rs](rust/cuckoo_hashing.rs) |
| Kotlin     | [CuckooHashing.kt](kotlin/CuckooHashing.kt) |
| Swift      | [CuckooHashing.swift](swift/CuckooHashing.swift) |
| Scala      | [CuckooHashing.scala](scala/CuckooHashing.scala) |
| C#         | [CuckooHashing.cs](csharp/CuckooHashing.cs) |

## References

- Pagh, R., & Rodler, F. F. (2004). Cuckoo hashing. *Journal of Algorithms*, 51(2), 122-144.
- Mitzenmacher, M. (2009). Some open questions related to cuckoo hashing. *Proceedings of the European Symposium on Algorithms (ESA)*.
- Fan, B., Andersen, D. G., Kaminsky, M., & Mitzenmacher, M. (2014). Cuckoo Filter: Practically better than Bloom. *Proceedings of the 10th ACM International Conference on Emerging Networking Experiments and Technologies (CoNEXT)*.
- [Cuckoo Hashing -- Wikipedia](https://en.wikipedia.org/wiki/Cuckoo_hashing)
