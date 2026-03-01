# SPFA (Shortest Path Faster Algorithm)

## Overview

SPFA is an optimization of the Bellman-Ford algorithm for finding single-source shortest paths. It uses a queue to process only vertices whose distances have been updated, avoiding redundant relaxation of edges. On average, SPFA runs much faster than Bellman-Ford, though it has the same worst-case complexity of O(VE). SPFA can handle negative edge weights and is widely used in competitive programming, particularly in the Chinese competitive programming community where it originated.

## How It Works

1. Initialize distances: source = 0, all others = infinity.
2. Push the source into a queue and mark it as in-queue.
3. While the queue is not empty, dequeue a vertex u and relax all its outgoing edges.
4. If a neighbor v's distance is improved (dist[u] + w < dist[v]), update it and add v to the queue if not already there.
5. The algorithm terminates when no more improvements can be made.

To detect negative cycles, count the number of times each vertex enters the queue. If any vertex enters more than V times, a negative cycle exists.

Input format: [n, m, src, u1, v1, w1, ...]. Output: distance from src to vertex n-1, or -1 if unreachable.

## Worked Example

```
Graph with 5 vertices, source = 0:
    0 --(1)--> 1
    0 --(4)--> 2
    1 --(2)--> 2
    1 --(6)--> 3
    2 --(3)--> 3
    3 --(1)--> 4
```

**Initial:** dist = [0, INF, INF, INF, INF]. Queue = [0].

**Dequeue 0:** Relax edges.
- dist[1] = min(INF, 0+1) = 1. Enqueue 1.
- dist[2] = min(INF, 0+4) = 4. Enqueue 2.
Queue = [1, 2].

**Dequeue 1:** Relax edges.
- dist[2] = min(4, 1+2) = 3. (2 already in queue, no re-enqueue needed.)
- dist[3] = min(INF, 1+6) = 7. Enqueue 3.
Queue = [2, 3].

**Dequeue 2:** Relax edges.
- dist[3] = min(7, 3+3) = 6. (3 already in queue.)
Queue = [3].

**Dequeue 3:** Relax edges.
- dist[4] = min(INF, 6+1) = 7. Enqueue 4.
Queue = [4].

**Dequeue 4:** No outgoing edges. Queue empty.

**Final distances:** [0, 1, 3, 6, 7].

Shortest path to vertex 4: 0 -> 1 -> 2 -> 3 -> 4 with distance 7.

## Pseudocode

```
function spfa(n, adj, source):
    dist = array of size n, all INF
    inQueue = array of size n, all false
    dist[source] = 0
    inQueue[source] = true

    queue = [source]

    while queue is not empty:
        u = queue.dequeue()
        inQueue[u] = false

        for each (v, w) in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not inQueue[v]:
                    queue.enqueue(v)
                    inQueue[v] = true

    return dist
```

## Complexity Analysis

| Case    | Time  | Space |
|---------|-------|-------|
| Best    | O(E)  | O(V)  |
| Average | O(E)  | O(V)  |
| Worst   | O(VE) | O(V)  |

In practice, SPFA runs close to O(E) for most random graphs and real-world graphs. However, adversarial inputs can force it to O(VE), matching Bellman-Ford. The SLF (Smallest Label First) and LLL (Large Label Last) optimizations can improve average-case performance.

## When to Use

- Single-source shortest paths with negative edge weights
- Competitive programming where average-case performance matters
- Graphs where Dijkstra cannot be used due to negative weights and you want better average performance than Bellman-Ford
- Detecting negative cycles (vertex queued more than V times)
- As a subroutine in minimum cost flow algorithms

## When NOT to Use

- When all edge weights are non-negative -- Dijkstra's algorithm with a priority queue is both faster and has better worst-case guarantees.
- In adversarial or worst-case scenarios -- SPFA degrades to O(VE). Use Dijkstra with Johnson's reweighting if you must avoid negative weights.
- When you need guaranteed performance bounds -- SPFA's worst case equals Bellman-Ford, but Dijkstra gives O(E log V) guaranteed.
- For very dense graphs with non-negative weights -- Dijkstra with an array (O(V^2)) is simpler and may be faster.

## Comparison

| Algorithm | Time (Worst) | Time (Average) | Negative Weights? | Notes |
|-----------|-------------|----------------|-------------------|-------|
| SPFA (this) | O(VE) | O(E) | Yes | Queue-based; fast in practice |
| Bellman-Ford | O(VE) | O(VE) | Yes | Guaranteed O(VE); negative cycle detection |
| Dijkstra (binary heap) | O(E log V) | O(E log V) | No | Best for non-negative weights |
| Dijkstra (Fibonacci heap) | O(E + V log V) | O(E + V log V) | No | Theoretically optimal for non-negative |
| DAG Shortest Path | O(V + E) | O(V + E) | Yes | Only for DAGs; fastest possible |

## References

- Duan, F. (1994). "About the Shortest Path Faster Algorithm". *Journal of Southwest Jiaotong University*.
- [Shortest Path Faster Algorithm -- Wikipedia](https://en.wikipedia.org/wiki/Shortest_Path_Faster_Algorithm)
- Cherkassky, B. V., Goldberg, A. V., & Radzik, T. (1996). "Shortest paths algorithms: theory and experimental evaluation." *Mathematical Programming*, 73(2), 129-174.

## Implementations

| Language   | File |
|------------|------|
| Python     | [spfa.py](python/spfa.py) |
| Java       | [Spfa.java](java/Spfa.java) |
| C++        | [spfa.cpp](cpp/spfa.cpp) |
| C          | [spfa.c](c/spfa.c) |
| Go         | [spfa.go](go/spfa.go) |
| TypeScript | [spfa.ts](typescript/spfa.ts) |
| Rust       | [spfa.rs](rust/spfa.rs) |
| Kotlin     | [Spfa.kt](kotlin/Spfa.kt) |
| Swift      | [Spfa.swift](swift/Spfa.swift) |
| Scala      | [Spfa.scala](scala/Spfa.scala) |
| C#         | [Spfa.cs](csharp/Spfa.cs) |
