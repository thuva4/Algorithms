# Prim's MST (Priority Queue)

## Overview

This is Prim's algorithm for finding the Minimum Spanning Tree (MST) of an undirected weighted graph, implemented with a priority queue (min-heap). Prim's algorithm grows the MST one vertex at a time by always adding the cheapest edge that connects a vertex inside the MST to a vertex outside it. With a Fibonacci heap the theoretical complexity is O(E + V log V), but using a binary heap gives O(E log V) which is simpler and practical for most use cases.

## How It Works

1. Start from vertex 0 with key = 0. All other vertices have key = infinity.
2. Use a min-heap to extract the vertex with smallest key.
3. For each neighbor of the extracted vertex, if the edge weight is less than the neighbor's current key, update it (decrease-key operation).
4. Repeat until all vertices are in the MST.

Input format: [n, m, u1, v1, w1, ...]. Output: total MST weight.

## Worked Example

```
Graph with 5 vertices:
    0 --(2)-- 1
    0 --(6)-- 3
    1 --(3)-- 2
    1 --(8)-- 3
    1 --(5)-- 4
    2 --(7)-- 4
    3 --(9)-- 4
```

**Step 1:** Start at vertex 0. Key[0]=0, all others=INF.
Extract vertex 0. Update neighbors: key[1]=2, key[3]=6.

**Step 2:** Extract vertex 1 (key=2). MST edge: 0-1 (weight 2).
Update neighbors: key[2]=3, key[3]=min(6,8)=6, key[4]=5.

**Step 3:** Extract vertex 2 (key=3). MST edge: 1-2 (weight 3).
Update neighbors: key[4]=min(5,7)=5.

**Step 4:** Extract vertex 4 (key=5). MST edge: 1-4 (weight 5).
Update neighbors: key[3]=min(6,9)=6.

**Step 5:** Extract vertex 3 (key=6). MST edge: 0-3 (weight 6).

**MST weight = 2 + 3 + 5 + 6 = 16.**
MST edges: {0-1, 1-2, 1-4, 0-3}.

## Pseudocode

```
function primsMST(n, adj):
    key = array of size n, all INF
    inMST = array of size n, all false
    key[0] = 0
    totalWeight = 0

    heap = min-priority queue
    heap.insert((0, 0))    // (key, vertex)

    while heap is not empty:
        (k, u) = heap.extractMin()
        if inMST[u]: continue
        inMST[u] = true
        totalWeight += k

        for each (v, weight) in adj[u]:
            if not inMST[v] and weight < key[v]:
                key[v] = weight
                heap.insert((weight, v))

    return totalWeight
```

## Complexity Analysis

| Case    | Time       | Space    |
|---------|------------|----------|
| Best    | O(E log V) | O(V + E) |
| Average | O(E log V) | O(V + E) |
| Worst   | O(E log V) | O(V + E) |

With a Fibonacci heap, the time improves to O(E + V log V), which is better for sparse graphs where E = O(V). The binary heap version has O(log V) per insert/extract-min and there are O(E) decrease-key operations.

## When to Use

- Finding MST of dense graphs (adjacency matrix representation)
- When the graph is naturally available as an adjacency list
- Incremental MST construction (starting from a specific vertex)
- When you need to process edges in order of their connection to the growing tree
- Network design (telecommunications, electrical grids, water pipes)

## When NOT to Use

- For very sparse graphs where E << V^2 -- Kruskal's may be more efficient due to simpler data structures.
- When edges are already sorted by weight -- Kruskal's can exploit this directly.
- When you need parallelism -- Boruvka's algorithm is more naturally parallel.
- For directed graphs -- Prim's works only on undirected graphs; use Edmonds/Chu-Liu for directed MST.

## Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| Prim's + Binary Heap (this) | O(E log V) | O(V + E) | Good general-purpose; simple implementation |
| Prim's + Fibonacci Heap | O(E + V log V) | O(V + E) | Theoretically optimal; complex to implement |
| Kruskal's | O(E log E) | O(V + E) | Sort edges first; Union-Find; good for sparse graphs |
| Boruvka's | O(E log V) | O(V + E) | Parallelizable; used in distributed computing |
| Prim's + Adjacency Matrix | O(V^2) | O(V^2) | Best for very dense graphs (E near V^2) |

## References

- Prim, R. C. (1957). "Shortest connection networks and some generalizations." *Bell System Technical Journal*, 36(6), 1389-1401.
- Jarnik, V. (1930). "O jistem problemu minimalnim." *Prace Moravske Prirodovedecke Spolecnosti*, 6, 57-63.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 23.
- [Prim's algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Prim%27s_algorithm)

## Implementations

| Language   | File |
|------------|------|
| Python     | [prims_fibonacci_heap.py](python/prims_fibonacci_heap.py) |
| Java       | [PrimsFibonacciHeap.java](java/PrimsFibonacciHeap.java) |
| C++        | [prims_fibonacci_heap.cpp](cpp/prims_fibonacci_heap.cpp) |
| C          | [prims_fibonacci_heap.c](c/prims_fibonacci_heap.c) |
| Go         | [prims_fibonacci_heap.go](go/prims_fibonacci_heap.go) |
| TypeScript | [primsFibonacciHeap.ts](typescript/primsFibonacciHeap.ts) |
| Rust       | [prims_fibonacci_heap.rs](rust/prims_fibonacci_heap.rs) |
| Kotlin     | [PrimsFibonacciHeap.kt](kotlin/PrimsFibonacciHeap.kt) |
| Swift      | [PrimsFibonacciHeap.swift](swift/PrimsFibonacciHeap.swift) |
| Scala      | [PrimsFibonacciHeap.scala](scala/PrimsFibonacciHeap.scala) |
| C#         | [PrimsFibonacciHeap.cs](csharp/PrimsFibonacciHeap.cs) |
