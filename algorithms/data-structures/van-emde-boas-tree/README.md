# van Emde Boas Tree

## Overview

A van Emde Boas (vEB) tree is a data structure that supports insert, delete, member, successor, and predecessor queries over integer keys from a bounded universe [0, U) in O(log log U) time per operation. This is exponentially faster than the O(log n) operations provided by balanced binary search trees when U is bounded.

The vEB tree achieves its remarkable speed by recursively partitioning the universe into sqrt(U) clusters of size sqrt(U), reducing the problem size by a square root at each recursive level. Since U is halved in the exponent at each level, the recursion depth is O(log log U).

vEB trees were introduced by Peter van Emde Boas in 1975 and are a cornerstone result in the study of integer data structures.

## How It Works

### Structure

A vEB tree for universe size U contains:
- **min** and **max**: The minimum and maximum elements stored. These are stored directly (not in any cluster), which is key to achieving the O(log log U) bound.
- **clusters[0..sqrt(U)-1]**: An array of sqrt(U) sub-vEB trees, each responsible for a cluster of sqrt(U) values.
- **summary**: A vEB tree of size sqrt(U) that tracks which clusters are non-empty.

### Key Functions

For a key `x` in universe [0, U):
- **high(x)** = floor(x / sqrt(U)) -- the cluster index
- **low(x)** = x mod sqrt(U) -- the position within the cluster
- **index(c, p)** = c * sqrt(U) + p -- reconstruct key from cluster and position

### Operations

**Member(x)**: Check if x equals min or max. If not, recurse into clusters[high(x)] with low(x).

**Insert(x)**:
1. If the tree is empty (min is null), set min = max = x. Done.
2. If x < min, swap x and min (the new min is stored directly, and we insert the old min into the clusters).
3. Insert low(x) into clusters[high(x)].
4. If the cluster was empty, also insert high(x) into the summary.
5. Update max if x > max.

**Successor(x)**: Find the smallest element greater than x.
1. If x < min, return min.
2. Check if low(x) has a successor within its cluster (compare with the cluster's max).
3. If yes, recurse into the cluster.
4. If no, use the summary to find the next non-empty cluster, then return that cluster's min.

**Delete(x)**: Similar logic with careful handling of min/max updates.

### Input/Output Format

- Input: [universe_size, n_ops, op1, val1, op2, val2, ...]
  - op=1: insert val
  - op=2: member query (is val present?) -- output 1 or 0
  - op=3: successor query -- output successor of val, or -1

- Output: results of queries (op=2 and op=3) in order.

## Example

**Universe size U = 16, operations: insert 2, insert 3, insert 7, insert 14, member 3, successor 3, successor 7, member 5:**

```
Insert 2:
  Tree is empty. Set min = max = 2.
  vEB(16): min=2, max=2

Insert 3:
  3 > min(2), so insert low(3) = 3 mod 4 = 3 into clusters[high(3)] = clusters[0]
  clusters[0] was empty, so insert 0 into summary
  Update max = 3
  vEB(16): min=2, max=3, summary={0}, clusters[0]={3}

Insert 7:
  7 > min(2), insert low(7) = 3 into clusters[high(7)] = clusters[1]
  clusters[1] was empty, insert 1 into summary
  Update max = 7
  vEB(16): min=2, max=7, summary={0,1}, clusters[0]={3}, clusters[1]={3}

Insert 14:
  14 > min(2), insert low(14) = 2 into clusters[high(14)] = clusters[3]
  clusters[3] was empty, insert 3 into summary
  Update max = 14
  vEB(16): min=2, max=14, summary={0,1,3}, clusters[0]={3}, clusters[1]={3}, clusters[3]={2}

Member 3:
  3 != min(2), 3 != max(14)
  Check clusters[high(3)]=clusters[0] for low(3)=3 -> found!
  Output: 1

Successor 3:
  high(3)=0, low(3)=3. Is there a successor in clusters[0]? clusters[0].max=3, low(3)=3, no.
  Find next non-empty cluster via summary.successor(0) = 1.
  Return index(1, clusters[1].min) = 1*4 + 3 = 7.
  Output: 7

Successor 7:
  high(7)=1, low(7)=3. Is there a successor in clusters[1]? clusters[1].max=3, no.
  summary.successor(1) = 3.
  Return index(3, clusters[3].min) = 3*4 + 2 = 14.
  Output: 14

Member 5:
  5 != min(2), 5 != max(14)
  Check clusters[high(5)]=clusters[1] for low(5)=1 -> not found (clusters[1] has min=max=3).
  Output: 0

Final output: [1, 7, 14, 0]
```

## Pseudocode

```
class vEB:
    universe_size
    min, max
    summary         // vEB of size sqrt(universe_size)
    clusters[]      // array of sqrt(universe_size) vEB trees

function high(x):
    return x / sqrt(universe_size)

function low(x):
    return x mod sqrt(universe_size)

function index(cluster, position):
    return cluster * sqrt(universe_size) + position

function member(T, x):
    if x == T.min or x == T.max:
        return true
    if T.universe_size == 2:
        return false
    return member(T.clusters[high(x)], low(x))

function insert(T, x):
    if T.min == null:           // tree is empty
        T.min = T.max = x
        return
    if x < T.min:
        swap(x, T.min)
    if T.universe_size > 2:
        c = high(x)
        if T.clusters[c].min == null:   // cluster was empty
            insert(T.summary, c)
            T.clusters[c].min = T.clusters[c].max = low(x)
        else:
            insert(T.clusters[c], low(x))
    if x > T.max:
        T.max = x

function successor(T, x):
    if T.universe_size == 2:
        if x == 0 and T.max == 1:
            return 1
        return null
    if T.min != null and x < T.min:
        return T.min
    c = high(x)
    maxInCluster = T.clusters[c].max
    if maxInCluster != null and low(x) < maxInCluster:
        offset = successor(T.clusters[c], low(x))
        return index(c, offset)
    else:
        nextCluster = successor(T.summary, c)
        if nextCluster == null:
            return null
        offset = T.clusters[nextCluster].min
        return index(nextCluster, offset)
```

## Complexity Analysis

| Operation   | Time          | Space |
|-------------|--------------|-------|
| Member      | O(log log U) | O(U)  |
| Insert      | O(log log U) | O(U)  |
| Delete      | O(log log U) | O(U)  |
| Successor   | O(log log U) | O(U)  |
| Predecessor | O(log log U) | O(U)  |
| Min / Max   | O(1)         | O(U)  |

**Why O(log log U)?** At each recursive level, the universe size goes from U to sqrt(U). The sequence of universe sizes is U, U^(1/2), U^(1/4), U^(1/8), ..., 2. Taking logarithms: log U, log U / 2, log U / 4, ..., 1. This reaches 1 in O(log log U) steps.

**Why O(U) space?** A vEB tree for universe U has sqrt(U) clusters plus a summary, each of size sqrt(U). The recurrence is S(U) = (sqrt(U) + 1) * S(sqrt(U)) + O(sqrt(U)), which solves to O(U). This is the main drawback: space depends on the universe size, not the number of elements stored.

**Space optimization**: The X-fast trie and Y-fast trie achieve O(n) space (where n is the number of elements stored) while maintaining O(log log U) query time (expected) by using hashing.

## Applications

- **Router IP lookup tables**: Fast successor queries on IP address prefixes can use vEB trees when the address space is bounded.
- **Priority queues with integer keys**: vEB trees provide O(log log U) insert and delete-min, which is faster than binary heaps when U is known and bounded.
- **Computational geometry**: Algorithms that require fast predecessor/successor queries on integer coordinates benefit from vEB trees.
- **Graph algorithms with integer weights**: Dijkstra's algorithm with a vEB tree priority queue runs in O(E * log log C) time, where C is the maximum edge weight.
- **Kernel memory allocators**: Some operating system memory allocators use vEB-like structures for fast allocation of fixed-size memory blocks from a bounded range.

## When NOT to Use

- **When the universe is large and elements are sparse**: A vEB tree for U = 2^32 (4 billion) consumes O(U) = O(4 billion) memory, which is impractical. If only a few thousand elements are stored, a balanced BST using O(n) space is far more practical.
- **When keys are not integers**: vEB trees are specifically designed for integer keys in a bounded universe. For string keys, floating-point keys, or keys from an unbounded domain, use a balanced BST, hash table, or trie instead.
- **When simplicity is more important**: vEB trees are complex to implement correctly, especially the delete operation. For most applications, a balanced BST or a skip list provides a good enough performance with much simpler code.
- **When expected O(1) operations suffice**: Hash tables provide O(1) expected time for insert, delete, and member queries. If you do not need successor/predecessor queries, a hash table is simpler and faster in practice.
- **When n << U**: If the number of elements n is much smaller than U, the O(U) space is wasteful. Consider X-fast tries (O(n log U) space) or Y-fast tries (O(n) space) as alternatives that maintain O(log log U) query time.

## Comparison

| Data Structure  | Insert       | Delete       | Member   | Successor    | Space    |
|-----------------|-------------|-------------|----------|-------------|----------|
| vEB Tree        | O(log log U)| O(log log U)| O(log log U)| O(log log U)| O(U)  |
| Balanced BST    | O(log n)    | O(log n)    | O(log n) | O(log n)    | O(n)     |
| Hash Table      | O(1)*       | O(1)*       | O(1)*    | O(n)        | O(n)     |
| X-fast Trie     | O(log log U)*| O(log log U)*| O(1) (hash)| O(log log U)*| O(n log U)|
| Y-fast Trie     | O(log log U)*| O(log log U)*| O(log log U)*| O(log log U)*| O(n) |
| Skip List       | O(log n)*   | O(log n)*   | O(log n)*| O(log n)*   | O(n)     |
| Fusion Tree     | O(log_w n)  | O(log_w n)  | O(log_w n)| O(log_w n) | O(n)     |

\* Expected/amortized.

**vEB vs. Balanced BST**: vEB trees are faster when log log U < log n, i.e., when the universe is not astronomically larger than the number of elements. For U = 2^20 and n = 1000, log log U ~ 4.3 while log n ~ 10, so vEB wins. But vEB uses O(U) space vs O(n).

**vEB vs. Hash Table**: Hash tables offer O(1) expected member queries but O(n) successor queries. vEB trees provide O(log log U) for both. Use vEB when successor/predecessor queries are needed; use hash tables when they are not.

## References

- van Emde Boas, P. (1975). "Preserving order in a forest in less than logarithmic time." *Proceedings of the 16th Annual Symposium on Foundations of Computer Science*, pp. 75-84.
- van Emde Boas, P., Kaas, R., & Zijlstra, E. (1977). "Design and implementation of an efficient priority queue." *Mathematical Systems Theory*, 10(1), 99-127.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Chapter 20: van Emde Boas Trees.
- "Van Emde Boas tree." Wikipedia. https://en.wikipedia.org/wiki/Van_Emde_Boas_tree

## Implementations

| Language   | File |
|------------|------|
| Python     | [van_emde_boas_tree.py](python/van_emde_boas_tree.py) |
| Java       | [VanEmdeBoasTree.java](java/VanEmdeBoasTree.java) |
| C++        | [van_emde_boas_tree.cpp](cpp/van_emde_boas_tree.cpp) |
| C          | [van_emde_boas_tree.c](c/van_emde_boas_tree.c) |
| Go         | [van_emde_boas_tree.go](go/van_emde_boas_tree.go) |
| TypeScript | [vanEmdeBoasTree.ts](typescript/vanEmdeBoasTree.ts) |
| Rust       | [van_emde_boas_tree.rs](rust/van_emde_boas_tree.rs) |
| Kotlin     | [VanEmdeBoasTree.kt](kotlin/VanEmdeBoasTree.kt) |
| Swift      | [VanEmdeBoasTree.swift](swift/VanEmdeBoasTree.swift) |
| Scala      | [VanEmdeBoasTree.scala](scala/VanEmdeBoasTree.scala) |
| C#         | [VanEmdeBoasTree.cs](csharp/VanEmdeBoasTree.cs) |
