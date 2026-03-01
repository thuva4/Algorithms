# LRU Cache

## Overview

An LRU (Least Recently Used) Cache is a data structure that maintains a fixed-capacity associative store with O(1) access and insertion. When the cache reaches capacity and a new entry must be added, the least recently accessed entry is evicted to make room. This eviction policy ensures that frequently and recently accessed data remains available while stale data is automatically discarded.

LRU Caches are foundational in systems programming, used extensively in operating system page replacement, database buffer pools, web browser caches, and CDN content management.

## How It Works

An LRU Cache combines two data structures to achieve O(1) time for all operations:

1. **Hash Map**: Provides O(1) lookup by mapping keys directly to nodes in a doubly linked list.
2. **Doubly Linked List**: Maintains the access-recency order. The most recently accessed node is at the head, and the least recently accessed node is at the tail.

### Operations

- **get(key)**: Look up the key in the hash map. If found, move the corresponding node to the head of the linked list (mark as most recently used) and return its value. If not found, return -1.
- **put(key, value)**: If the key already exists, update its value and move it to the head. If the key is new, create a new node at the head. If the cache is at capacity, remove the node at the tail (the least recently used entry) and delete its hash map entry before inserting the new node.

### Example

Given a cache with capacity 2:

| Operation | Cache State (most recent first) | Result |
|-----------|---------------------------------|--------|
| put(1, 1) | [(1,1)] | - |
| put(2, 2) | [(2,2), (1,1)] | - |
| get(1) | [(1,1), (2,2)] | 1 |
| put(3, 3) | [(3,3), (1,1)] -- evicts key 2 | - |
| get(2) | [(3,3), (1,1)] | -1 (miss) |
| get(3) | [(3,3), (1,1)] | 3 |

For the test runner, operations are encoded as a flat integer array: `[capacity, op_count, op1_type, op1_key, op1_value, ...]` where type 1 = put and type 2 = get (value ignored for get). The function returns the sum of all get results (-1 for misses).

## Pseudocode

```
class LRUCache:
    initialize(capacity):
        map = empty hash map
        head = dummy node
        tail = dummy node
        head.next = tail
        tail.prev = head
        this.capacity = capacity

    get(key):
        if key in map:
            node = map[key]
            moveToHead(node)
            return node.value
        return -1

    put(key, value):
        if key in map:
            node = map[key]
            node.value = value
            moveToHead(node)
        else:
            if size(map) == capacity:
                lru = tail.prev
                removeNode(lru)
                delete map[lru.key]
            newNode = Node(key, value)
            addToHead(newNode)
            map[key] = newNode
```

## Complexity Analysis

| Case    | Time | Space |
|---------|------|-------|
| Best    | O(1) | O(n)  |
| Average | O(1) | O(n)  |
| Worst   | O(1) | O(n)  |

**Why these complexities?**

- **Time -- O(1) for all cases:** Both get and put require only a hash map lookup (O(1) amortized) and a constant number of pointer manipulations in the doubly linked list (O(1)). Even eviction is O(1) since the tail node is directly accessible.

- **Space -- O(n):** The cache stores up to n key-value pairs, each occupying a hash map entry and a linked list node. The doubly linked list nodes carry prev/next pointers plus the key-value data, and the hash map holds references to each node.

## Applications

- **Operating Systems**: Page replacement policies in virtual memory management use LRU to decide which memory pages to swap to disk.
- **Database Systems**: Buffer pool managers in databases like PostgreSQL and MySQL use LRU variants to keep frequently accessed disk pages in memory.
- **Web Browsers**: Browser caches use LRU to manage cached resources (images, scripts, stylesheets) with limited storage.
- **CDNs**: Content Delivery Networks use LRU-based policies to decide which content to keep cached at edge servers.
- **CPU Caches**: Hardware cache lines often use LRU or pseudo-LRU replacement policies.
- **Application Memoization**: Function result caching with bounded memory using `functools.lru_cache` in Python or similar constructs.

## Comparison with Similar Structures

| Structure    | Lookup | Insert/Evict | Eviction Policy | Notes |
|-------------|--------|-------------|-----------------|-------|
| LRU Cache   | O(1)   | O(1)        | Least recently used | Best general-purpose cache |
| LFU Cache   | O(1)   | O(1)        | Least frequently used | Better for skewed access patterns |
| FIFO Cache  | O(1)   | O(1)        | First in, first out | Simpler but ignores access recency |
| Hash Map    | O(1)   | O(1)        | None (unbounded) | No eviction; memory grows without bound |

## Implementations

| Language   | File |
|------------|------|
| Python     | [lru_cache.py](python/lru_cache.py) |
| Java       | [LruCache.java](java/LruCache.java) |
| C++        | [lru_cache.cpp](cpp/lru_cache.cpp) |
| C          | [lru_cache.c](c/lru_cache.c) |
| Go         | [lru_cache.go](go/lru_cache.go) |
| TypeScript | [lruCache.ts](typescript/lruCache.ts) |
| Rust       | [lru_cache.rs](rust/lru_cache.rs) |
| Kotlin     | [LruCache.kt](kotlin/LruCache.kt) |
| Swift      | [LruCache.swift](swift/LruCache.swift) |
| Scala      | [LruCache.scala](scala/LruCache.scala) |
| C#         | [LruCache.cs](csharp/LruCache.cs) |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 11: Hash Tables.
- [LRU Cache -- Wikipedia](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))
- [LeetCode 146: LRU Cache](https://leetcode.com/problems/lru-cache/)
