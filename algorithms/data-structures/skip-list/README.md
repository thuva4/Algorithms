# Skip List

## Overview

A Skip List is a probabilistic data structure that allows O(log n) average-case search, insertion, and deletion within an ordered sequence of elements. It consists of multiple layers of sorted linked lists, where higher layers act as "express lanes" that skip over many elements at once, enabling fast traversal.

Skip lists were invented by William Pugh in 1990 as a simpler alternative to balanced binary search trees (like AVL trees and red-black trees). They achieve the same expected time complexity through randomization rather than complex rotation-based rebalancing. Their simplicity makes them especially attractive for concurrent implementations.

## How It Works

1. **Structure**: The bottom layer (level 0) is a regular sorted linked list containing all elements. Each higher layer contains a subset of the elements from the layer below. An element that appears at level `k` also appears at all levels 0 through `k-1`.
2. **Level assignment**: When a new element is inserted, its level is determined randomly. A common method: flip a coin repeatedly; the number of heads before the first tail determines the level. This means each element has a 1/2 probability of being promoted to the next level.
3. **Search**: Start at the top-left (highest-level head). Move right while the next node's key is less than the target. When you cannot move right (the next key is too large or null), drop down one level. Repeat until you find the target or reach the bottom level.
4. **Insert**: Search for the position at each level. At each level where the new element should appear, splice it into the linked list by updating pointers.
5. **Delete**: Search for the element. At each level where it appears, remove it by updating pointers.

## Example

**Building a skip list by inserting 3, 6, 7, 9, 12, 19, 21, 25:**

```
Suppose random level assignments are:
  3 -> level 0
  6 -> level 1
  7 -> level 0
  9 -> level 2
  12 -> level 0
  19 -> level 1
  21 -> level 0
  25 -> level 3

Resulting skip list:

Level 3: HEAD -----------------------------------------> 25 -> NIL
Level 2: HEAD ----------------------> 9 ---------------> 25 -> NIL
Level 1: HEAD --------> 6 ---------> 9 --------> 19 --> 25 -> NIL
Level 0: HEAD -> 3 -> 6 -> 7 -> 9 -> 12 -> 19 -> 21 -> 25 -> NIL
```

**Searching for 19:**

```
Start at HEAD, Level 3:
  Next is 25 (25 > 19), drop down to Level 2.

Level 2, at HEAD:
  Next is 9 (9 < 19), move right to 9.
  Next is 25 (25 > 19), drop down to Level 1.

Level 1, at 9:
  Next is 19 (19 == 19), found!

Total comparisons: 4  (vs. up to 6 in a linear scan)
```

**Inserting 17 with random level = 1:**

```
Search path finds position between 12 and 19 at each level.

Level 1: HEAD --------> 6 ---------> 9 --------> 17 -> 19 --> 25 -> NIL
Level 0: HEAD -> 3 -> 6 -> 7 -> 9 -> 12 -> 17 -> 19 -> 21 -> 25 -> NIL
                                             ^^
                                         inserted here
```

## Pseudocode

```
class SkipListNode:
    key
    forward[]   // array of next pointers, one per level

class SkipList:
    maxLevel = 16
    p = 0.5         // promotion probability
    level = 0       // current highest level
    header = new SkipListNode(maxLevel)

function randomLevel():
    lvl = 0
    while random() < p and lvl < maxLevel - 1:
        lvl = lvl + 1
    return lvl

function search(key):
    current = header
    for i = level down to 0:
        while current.forward[i] != null and current.forward[i].key < key:
            current = current.forward[i]
    current = current.forward[0]
    if current != null and current.key == key:
        return current
    return null

function insert(key):
    update = array of size maxLevel   // predecessors at each level
    current = header
    for i = level down to 0:
        while current.forward[i] != null and current.forward[i].key < key:
            current = current.forward[i]
        update[i] = current
    newLevel = randomLevel()
    if newLevel > level:
        for i = level + 1 to newLevel:
            update[i] = header
        level = newLevel
    newNode = new SkipListNode(newLevel)
    newNode.key = key
    for i = 0 to newLevel:
        newNode.forward[i] = update[i].forward[i]
        update[i].forward[i] = newNode

function delete(key):
    update = array of size maxLevel
    current = header
    for i = level down to 0:
        while current.forward[i] != null and current.forward[i].key < key:
            current = current.forward[i]
        update[i] = current
    target = current.forward[0]
    if target != null and target.key == key:
        for i = 0 to level:
            if update[i].forward[i] != target:
                break
            update[i].forward[i] = target.forward[i]
        while level > 0 and header.forward[level] == null:
            level = level - 1
```

## Complexity Analysis

| Operation | Average    | Worst Case | Space    |
|-----------|-----------|------------|----------|
| Search    | O(log n)  | O(n)       | -        |
| Insert    | O(log n)  | O(n)       | -        |
| Delete    | O(log n)  | O(n)       | -        |
| Space     | -         | -          | O(n log n) worst, O(n) expected |

- **Average case**: The expected number of levels is O(log n), and at each level we examine O(1) expected nodes, giving O(log n) total work for all operations.
- **Worst case**: If the random number generator produces pathologically bad level assignments (e.g., all elements at level 0), the skip list degenerates to a plain linked list with O(n) operations. This is astronomically unlikely for a good random number generator.
- **Space**: Each element has an expected number of 1/(1-p) = 2 pointers (for p = 0.5), so expected total space is O(n). The worst case is O(n log n) if all elements are promoted to the maximum level.

## Applications

- **Redis sorted sets**: Redis uses skip lists as the underlying data structure for sorted sets (ZSET), which support range queries and ranked access.
- **LevelDB / RocksDB memtable**: These key-value stores use skip lists for their in-memory sorted buffer (memtable) before flushing to disk.
- **Concurrent data structures**: Lock-free skip lists are simpler to implement than lock-free balanced BSTs because operations only modify local pointers. Java's `ConcurrentSkipListMap` is a standard-library example.
- **Database indexing**: Skip lists serve as an alternative to B-trees for in-memory indexes where simplicity and concurrency matter.
- **Priority queues**: A skip list can function as a priority queue with O(log n) insert and O(1) delete-min (the minimum is always the first element).

## When NOT to Use

- **When worst-case guarantees are required**: Skip lists rely on randomization for their O(log n) expected performance. If your application cannot tolerate the (extremely unlikely) worst case of O(n), use a deterministic balanced BST (AVL tree, red-black tree) instead.
- **When memory is extremely constrained**: Skip list nodes carry multiple forward pointers (an average of 2 per node with p = 0.5). A simple linked list or array uses less memory per element.
- **When cache locality matters**: Skip lists have poor spatial locality because nodes at different levels are scattered in memory. Arrays and B-trees have much better cache behavior.
- **For persistent (immutable) data structures**: Functional data structures based on balanced BSTs support efficient persistent versions through path copying. Skip lists are harder to make persistent due to their randomized structure.

## Comparison

| Feature            | Skip List   | AVL Tree    | Red-Black Tree | B-Tree      | Hash Table  |
|--------------------|-------------|-------------|----------------|-------------|-------------|
| Search             | O(log n)*   | O(log n)    | O(log n)       | O(log n)    | O(1)*       |
| Insert             | O(log n)*   | O(log n)    | O(log n)       | O(log n)    | O(1)*       |
| Delete             | O(log n)*   | O(log n)    | O(log n)       | O(log n)    | O(1)*       |
| Range queries      | Yes         | Yes         | Yes            | Yes         | No          |
| Ordered iteration  | Yes         | Yes         | Yes            | Yes         | No          |
| Implementation     | Simple      | Moderate    | Complex        | Complex     | Simple      |
| Concurrency        | Excellent   | Difficult   | Difficult      | Moderate    | Moderate    |
| Deterministic      | No          | Yes         | Yes            | Yes         | No          |
| Cache locality     | Poor        | Poor        | Poor           | Excellent   | Moderate    |

\* Expected/amortized.

## References

- Pugh, W. (1990). "Skip Lists: A Probabilistic Alternative to Balanced Trees." *Communications of the ACM*, 33(6), 668-676.
- Pugh, W. (1990). "Concurrent Maintenance of Skip Lists." Technical Report CS-TR-2222, University of Maryland.
- Herlihy, M., Lev, Y., Luchangco, V., & Shavit, N. (2006). "A Provably Correct Scalable Concurrent Skip List." *OPODIS 2006*.
- "Skip list." Wikipedia. https://en.wikipedia.org/wiki/Skip_list

## Implementations

| Language   | File |
|------------|------|
| Python     | [skip_list.py](python/skip_list.py) |
| Java       | [SkipList.java](java/SkipList.java) |
| C++        | [skip_list.cpp](cpp/skip_list.cpp) |
| C          | [skip_list.c](c/skip_list.c) |
| Go         | [skip_list.go](go/skip_list.go) |
| TypeScript | [skipList.ts](typescript/skipList.ts) |
| Rust       | [skip_list.rs](rust/skip_list.rs) |
| Kotlin     | [SkipList.kt](kotlin/SkipList.kt) |
| Swift      | [SkipList.swift](swift/SkipList.swift) |
| Scala      | [SkipList.scala](scala/SkipList.scala) |
| C#         | [SkipList.cs](csharp/SkipList.cs) |
