# Minimum Cost Maximum Flow

## Overview

The Minimum Cost Maximum Flow (MCMF) problem finds the maximum flow from source to sink while minimizing the total cost. Each edge has both a capacity and a per-unit cost. This implementation uses the Successive Shortest Paths algorithm with SPFA (Bellman-Ford with queue optimization) to find augmenting paths of minimum cost. MCMF generalizes both the maximum flow problem and the shortest path problem.

## How It Works

1. Build a residual network with forward edges (capacity, cost) and backward edges (0 capacity, negative cost).
2. Repeatedly find the shortest (minimum cost) augmenting path from source to sink using SPFA.
3. Push as much flow as possible along each shortest path.
4. Continue until no more augmenting paths exist from source to sink.
5. Return the total minimum cost of the maximum flow.

Input format: [n, m, src, sink, u1, v1, cap1, cost1, ...]. Output: minimum cost of maximum flow.

## Worked Example

```
Graph with 4 vertices, source=0, sink=3:
    0 --(cap:3, cost:1)--> 1
    0 --(cap:2, cost:5)--> 2
    1 --(cap:2, cost:3)--> 3
    2 --(cap:3, cost:2)--> 3
    1 --(cap:1, cost:1)--> 2
```

**Iteration 1:** SPFA finds shortest cost path 0->1->3 (cost = 1+3 = 4 per unit).
Push flow = min(3, 2) = 2. Total flow = 2, total cost = 2 * 4 = 8.

**Iteration 2:** SPFA finds shortest cost path 0->1->2->3 (cost = 1+1+2 = 4 per unit).
Push flow = min(1, 1, 3) = 1. Total flow = 3, total cost = 8 + 1 * 4 = 12.

**Iteration 3:** SPFA finds shortest cost path 0->2->3 (cost = 5+2 = 7 per unit).
Push flow = min(2, 2) = 2. Total flow = 5, total cost = 12 + 2 * 7 = 26.

**No more augmenting paths. Maximum flow = 5, minimum cost = 26.**

## Pseudocode

```
function mcmf(n, source, sink, edges):
    // Build adjacency list with forward and backward edges
    graph = adjacency list of size n
    for each edge (u, v, cap, cost):
        add forward edge (v, cap, cost) to graph[u]
        add backward edge (u, 0, -cost) to graph[v]

    totalFlow = 0
    totalCost = 0

    while true:
        // SPFA to find shortest path
        dist = array of size n, all INF
        inQueue = array of size n, all false
        parent = array of size n, all -1
        parentEdge = array of size n, all -1
        dist[source] = 0

        queue = [source]
        inQueue[source] = true

        while queue is not empty:
            u = queue.dequeue()
            inQueue[u] = false
            for each edge (v, cap, cost, index) in graph[u]:
                if cap > 0 and dist[u] + cost < dist[v]:
                    dist[v] = dist[u] + cost
                    parent[v] = u
                    parentEdge[v] = index
                    if not inQueue[v]:
                        queue.enqueue(v)
                        inQueue[v] = true

        if dist[sink] == INF:
            break   // no more augmenting paths

        // Find bottleneck
        bottleneck = INF
        v = sink
        while v != source:
            bottleneck = min(bottleneck, capacity of parentEdge[v])
            v = parent[v]

        // Push flow and update costs
        v = sink
        while v != source:
            decrease capacity of parentEdge[v] by bottleneck
            increase capacity of reverse edge by bottleneck
            v = parent[v]

        totalFlow += bottleneck
        totalCost += bottleneck * dist[sink]

    return totalCost
```

## Complexity Analysis

| Case    | Time              | Space    |
|---------|-------------------|----------|
| Best    | O(V * E * flow)   | O(V + E) |
| Average | O(V * E * flow)   | O(V + E) |
| Worst   | O(V * E * flow)   | O(V + E) |

Each SPFA call takes O(VE) in the worst case. The number of augmenting path iterations depends on the maximum flow value. In practice, the algorithm is much faster because SPFA typically runs in O(E) on average.

## When to Use

- Transportation problems (shipping goods at minimum cost)
- Assignment problems with both capacity and cost constraints
- Network design with bandwidth and cost tradeoffs
- Airline crew scheduling
- Optimal resource distribution in supply chains
- Minimum cost perfect matching via reduction

## When NOT to Use

- When you only need maximum flow without cost minimization -- use Edmonds-Karp or Dinic's, which are simpler and faster.
- When the flow value is very large -- the pseudo-polynomial dependence on flow makes the algorithm slow.
- For very large networks -- consider cost-scaling algorithms or network simplex, which have better worst-case bounds.
- When all costs are equal -- this reduces to plain max-flow.

## Comparison

| Algorithm | Time | Notes |
|-----------|------|-------|
| Successive Shortest Paths + SPFA (this) | O(VE * flow) | Simple; good for small to medium networks |
| Successive Shortest Paths + Dijkstra | O(VE * flow) with potentials | Faster per iteration; needs Johnson's potential trick for negative costs |
| Cost Scaling | O(V^2 * E * log(VC)) | Strongly polynomial; better for large instances |
| Network Simplex | O(V^2 * E) | Often fastest in practice; complex to implement |
| Cycle-Canceling | O(V * E^2 * C) | Conceptually simple but slow |

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 29.
- Ahuja, R. K., Magnanti, T. L., & Orlin, J. B. (1993). *Network Flows: Theory, Algorithms, and Applications*. Prentice Hall.
- [Minimum-cost flow problem -- Wikipedia](https://en.wikipedia.org/wiki/Minimum-cost_flow_problem)

## Implementations

| Language   | File |
|------------|------|
| Python     | [network_flow_mincost.py](python/network_flow_mincost.py) |
| Java       | [NetworkFlowMincost.java](java/NetworkFlowMincost.java) |
| C++        | [network_flow_mincost.cpp](cpp/network_flow_mincost.cpp) |
| C          | [network_flow_mincost.c](c/network_flow_mincost.c) |
| Go         | [network_flow_mincost.go](go/network_flow_mincost.go) |
| TypeScript | [networkFlowMincost.ts](typescript/networkFlowMincost.ts) |
| Rust       | [network_flow_mincost.rs](rust/network_flow_mincost.rs) |
| Kotlin     | [NetworkFlowMincost.kt](kotlin/NetworkFlowMincost.kt) |
| Swift      | [NetworkFlowMincost.swift](swift/NetworkFlowMincost.swift) |
| Scala      | [NetworkFlowMincost.scala](scala/NetworkFlowMincost.scala) |
| C#         | [NetworkFlowMincost.cs](csharp/NetworkFlowMincost.cs) |
