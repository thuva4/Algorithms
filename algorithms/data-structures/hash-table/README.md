# Hash Table

## Overview

A Hash Table (also called a hash map, dictionary, or associative array) is a data structure that implements a mapping from keys to values with O(1) average-case lookup, insertion, and deletion. It achieves this performance by using a hash function to compute an index into an array of buckets, from which the desired value can be found directly.

Hash tables are among the most widely used data structures in computer science, forming the backbone of database indexing, caching systems, symbol tables in compilers, and countless application-level data lookups.

## How It Works

A hash table operates in three steps:

1. **Hashing**: A hash function transforms the key into an integer (the hash code). This integer is then mapped to a valid array index using the modulo operation: `index = hash(key) % table_size`.
2. **Storage**: The key-value pair is stored in the bucket at the computed index.
3. **Collision Resolution**: When two different keys hash to the same index (a collision), a resolution strategy is applied. The most common strategies are:
   - **Separate Chaining**: Each bucket holds a linked list of all key-value pairs that hash to that index.
   - **Open Addressing (Linear Probing)**: If the target bucket is occupied, probe subsequent buckets until an empty one is found.

This implementation uses **separate chaining** for collision resolution.

### Operations

- **put(key, value)**: Hash the key, find the bucket, and either update an existing entry or append a new one.
- **get(key)**: Hash the key, find the bucket, and search the chain for the matching key. Return the value if found, or -1 if not.
- **delete(key)**: Hash the key, find the bucket, and remove the entry with the matching key from the chain.

### Example

Given operations: put(5, 50), put(10, 100), get(5)

Assume table size = 8:
- `hash(5) % 8 = 5` -- store (5, 50) at bucket 5
- `hash(10) % 8 = 2` -- store (10, 100) at bucket 2
- `get(5)`: `hash(5) % 8 = 5` -- find (5, 50) at bucket 5, return 50

| Bucket | Contents |
|--------|----------|
| 0 | empty |
| 1 | empty |
| 2 | (10, 100) |
| 3 | empty |
| 4 | empty |
| 5 | (5, 50) |
| 6 | empty |
| 7 | empty |

For the test runner, operations are encoded as a flat integer array: `[op_count, op1_type, op1_key, op1_value, ...]` where type 1 = put, 2 = get (returns value or -1), 3 = delete. The function returns the sum of all get results.

## Pseudocode

```
class HashTable:
    initialize(size):
        buckets = array of size empty lists

    hash(key):
        return abs(key) mod size

    put(key, value):
        index = hash(key)
        for entry in buckets[index]:
            if entry.key == key:
                entry.value = value
                return
        buckets[index].append(Entry(key, value))

    get(key):
        index = hash(key)
        for entry in buckets[index]:
            if entry.key == key:
                return entry.value
        return -1

    delete(key):
        index = hash(key)
        remove entry with matching key from buckets[index]
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(n)  |
| Average | O(1) | O(n)  |
| Worst   | O(n) | O(n)  |

**Why these complexities?**

- **Best/Average Case -- O(1):** With a good hash function and a reasonable load factor (number of entries / number of buckets), each bucket contains a small constant number of entries. The hash computation is O(1), and searching a short chain is effectively O(1).

- **Worst Case -- O(n):** If all keys hash to the same bucket (a pathological case), all entries end up in a single chain of length n. Every lookup, insertion, or deletion must traverse this entire chain, degrading to O(n). In practice, this is avoided with good hash functions and resizing.

- **Space -- O(n):** The table stores n key-value pairs, plus the overhead of the bucket array and any chain pointers. With separate chaining, each entry requires a node with key, value, and a next pointer.

## Applications

- **Databases**: Hash indexes for O(1) lookups on equality queries.
- **Compilers**: Symbol tables mapping variable names to their types, scopes, and memory locations.
- **Caching**: In-memory key-value stores like Redis and Memcached are fundamentally hash tables.
- **Counting/Frequency analysis**: Tallying occurrences of items in a dataset.
- **Deduplication**: Detecting and eliminating duplicate entries in data processing pipelines.
- **Routing tables**: Network routers use hash-based structures for fast IP address lookup.

## Comparison with Similar Structures

| Structure         | Lookup (avg) | Insert (avg) | Delete (avg) | Ordered | Notes |
|-------------------|-------------|-------------|-------------|---------|-------|
| Hash Table        | O(1)        | O(1)        | O(1)        | No      | Fastest for unordered key-value storage |
| Balanced BST      | O(log n)    | O(log n)    | O(log n)    | Yes     | Maintains sorted order |
| Sorted Array      | O(log n)    | O(n)        | O(n)        | Yes     | Good for static datasets |
| Unsorted Array    | O(n)        | O(1)        | O(n)        | No      | Simple but slow lookups |
| Bloom Filter      | O(k)        | O(k)        | N/A         | No      | Probabilistic; no false negatives |

## Implementations

| Language   | File |
|------------|------|
| Python     | [hash_table.py](python/hash_table.py) |
| Java       | [HashTable.java](java/HashTable.java) |
| C++        | [hash_table.cpp](cpp/hash_table.cpp) |
| C          | [hash_table.c](c/hash_table.c) |
| Go         | [hash_table.go](go/hash_table.go) |
| TypeScript | [hashTable.ts](typescript/hashTable.ts) |
| Rust       | [hash_table.rs](rust/hash_table.rs) |
| Kotlin     | [HashTable.kt](kotlin/HashTable.kt) |
| Swift      | [HashTable.swift](swift/HashTable.swift) |
| Scala      | [HashTable.scala](scala/HashTable.scala) |
| C#         | [HashTable.cs](csharp/HashTable.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 11: Hash Tables.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 6.4: Hashing.
- [Hash Table -- Wikipedia](https://en.wikipedia.org/wiki/Hash_table)
