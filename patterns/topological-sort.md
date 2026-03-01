---
name: Topological Sort
slug: topological-sort
category: graph
difficulty: intermediate
timeComplexity: O(V + E)
spaceComplexity: O(V + E)
recognitionTips:
  - "Problem involves tasks with dependencies (task A must happen before B)"
  - "Need to find a valid ordering of items with prerequisites"
  - "Problem asks to detect cycles in a directed graph"
  - "Build systems, course scheduling, or compilation order"
commonVariations:
  - "Kahn's algorithm (BFS-based, using in-degree)"
  - "DFS-based topological sort"
  - "Detect cycle in directed graph"
  - "All valid topological orderings"
relatedPatterns: []
keywords: [graph, dag, ordering, dependencies, kahn, in-degree]
estimatedTime: 3-4 hours
---

# Topological Sort Pattern

## Overview

Topological Sort is an algorithm for ordering the vertices of a Directed Acyclic Graph (DAG) such that for every directed edge `u -> v`, vertex `u` appears before vertex `v` in the ordering. In plain terms: if task A must be completed before task B, then A comes first in the sorted output.

A valid topological ordering is only possible when the graph has no directed cycles. If a cycle exists — task A depends on B, which depends on A — no valid ordering can be produced. This makes topological sort doubly useful: it simultaneously produces a valid ordering and detects whether one is even possible (i.e., cycle detection).

There are two classic algorithms for topological sort:

**Kahn's Algorithm (BFS-based):** Repeatedly remove nodes with no incoming edges (in-degree zero), appending them to the result. This is intuitive and easy to implement iteratively. It is also the preferred method for detecting cycles: if the result does not contain all V vertices, a cycle exists.

**DFS-based Topological Sort:** Run DFS and push each fully processed vertex onto a stack. The reverse of the stack is the topological order. This approach is elegant but slightly harder to reason about in interviews and requires explicit cycle detection using a "visiting" state.

In interviews, Kahn's algorithm is almost always the better choice. It is more readable, naturally detects cycles, and its BFS structure is familiar from other graph problems.

## When to Use

Apply topological sort when you see these signals:

- The problem involves a directed graph where nodes have dependencies.
- You need to process items in an order that respects prerequisite constraints.
- The problem asks whether a valid ordering exists, or asks you to find it.
- You need to determine if a directed graph contains a cycle.
- The domain involves scheduling, compilation order, build pipelines, or course prerequisites.

Common problem phrasings:
- "Given a list of courses and prerequisites, find a valid order to take all courses."
- "Given N tasks with dependencies, schedule them or determine if scheduling is impossible."
- "Find the build order of packages given their dependencies."
- "Return True if all courses can be finished, False otherwise."

If the graph is undirected, topological sort does not apply — use BFS/DFS for cycle detection or connected components instead.

## Core Technique

Kahn's Algorithm operates on the concept of **in-degree**: the number of incoming edges for each node. A node with in-degree zero has no prerequisites and is safe to process first.

**High-level steps:**
1. Build an adjacency list and compute the in-degree of every node.
2. Enqueue all nodes with in-degree zero into a queue.
3. While the queue is not empty:
   a. Dequeue a node and append it to the result.
   b. For each neighbor of that node, decrement its in-degree by 1 (we've "removed" this dependency).
   c. If any neighbor's in-degree drops to zero, enqueue it.
4. If the result contains all V nodes, return it. Otherwise, a cycle exists.

### Pseudocode (Kahn's Algorithm)

```
function topologicalSort(numNodes, edges):
    // Step 1: Build graph and compute in-degrees
    adjacency = array of empty lists, length numNodes
    inDegree  = array of zeros, length numNodes

    for each (u, v) in edges:
        adjacency[u].append(v)
        inDegree[v] += 1

    // Step 2: Seed the queue with all zero-in-degree nodes
    queue = new Queue()
    for node from 0 to numNodes - 1:
        if inDegree[node] == 0:
            queue.enqueue(node)

    // Step 3: Process queue
    result = []
    while queue is not empty:
        node = queue.dequeue()
        result.append(node)

        for neighbor in adjacency[node]:
            inDegree[neighbor] -= 1
            if inDegree[neighbor] == 0:
                queue.enqueue(neighbor)

    // Step 4: Cycle check
    if length(result) == numNodes:
        return result       // valid topological order
    else:
        return []           // cycle detected; no valid ordering exists
```

### DFS-Based Variant (for reference)

```
function topologicalSortDFS(numNodes, edges):
    adjacency = build adjacency list from edges
    visited = array of "unvisited" states, length numNodes
    stack = []
    hasCycle = false

    function dfs(node):
        visited[node] = "visiting"
        for neighbor in adjacency[node]:
            if visited[neighbor] == "visiting":
                hasCycle = true
                return
            if visited[neighbor] == "unvisited":
                dfs(neighbor)
        visited[node] = "visited"
        stack.push(node)    // push AFTER processing all descendants

    for node from 0 to numNodes - 1:
        if visited[node] == "unvisited":
            dfs(node)

    if hasCycle:
        return []
    return reverse(stack)
```

The three visited states ("unvisited", "visiting", "visited") are necessary to distinguish a back edge (cycle) from a cross edge (already fully processed node).

## Example Walkthrough

**Problem:** 4 courses numbered 0 to 3. Prerequisites:
- Course 1 requires Course 0 (edge 0 -> 1)
- Course 2 requires Course 0 (edge 0 -> 2)
- Course 3 requires Course 1 (edge 1 -> 3)
- Course 3 requires Course 2 (edge 2 -> 3)

Find a valid order to take all courses.

**Graph structure:**
```
0 -> 1 -> 3
0 -> 2 -> 3
```

**Step 1: Build adjacency list and in-degrees**

```
adjacency:
  0: [1, 2]
  1: [3]
  2: [3]
  3: []

inDegree:
  0: 0   (no prerequisites)
  1: 1   (requires 0)
  2: 1   (requires 0)
  3: 2   (requires 1 and 2)
```

**Step 2: Seed queue with zero in-degree nodes**

```
queue: [0]
result: []
```

**Step 3: Process the queue**

Iteration 1 — dequeue 0:
```
result: [0]
Process neighbors of 0: nodes 1 and 2
  inDegree[1]: 1 -> 0  => enqueue 1
  inDegree[2]: 1 -> 0  => enqueue 2
queue: [1, 2]
```

Iteration 2 — dequeue 1:
```
result: [0, 1]
Process neighbors of 1: node 3
  inDegree[3]: 2 -> 1  (not yet zero, don't enqueue)
queue: [2]
```

Iteration 3 — dequeue 2:
```
result: [0, 1, 2]
Process neighbors of 2: node 3
  inDegree[3]: 1 -> 0  => enqueue 3
queue: [3]
```

Iteration 4 — dequeue 3:
```
result: [0, 1, 2, 3]
Process neighbors of 3: none
queue: []
```

**Step 4: Cycle check**

`length(result) = 4 = numNodes`. No cycle. Valid order: `[0, 1, 2, 3]`.

Note: `[0, 2, 1, 3]` is also valid — topological sort may have multiple correct answers. Kahn's algorithm produces one valid ordering depending on the order nodes are enqueued.

## Common Pitfalls

1. **Not initializing in-degrees for all nodes.** If a node has no incoming edges and you never explicitly set its in-degree to 0, it may be missing from your map or array. Always initialize in-degrees for all V nodes before processing any edge. Nodes with no incoming edges should start at 0, not be absent from the data structure.

2. **Returning an incorrect result when a cycle exists.** After Kahn's algorithm finishes, always compare `length(result)` to `numNodes`. If they differ, the graph has a cycle and no valid ordering exists — return an empty list or signal an error. Returning the partial result silently is a subtle but serious bug that interviewers will catch.

3. **Using the wrong graph direction.** If the problem says "course A is a prerequisite for course B," the edge should go `A -> B`, meaning A must come before B. Reversing the direction (B -> A) produces a reversed topological order. Read the problem statement carefully and explicitly draw a small example to confirm edge direction before coding.

4. **Assuming there is only one valid topological ordering.** Many problems with prerequisites have multiple valid orderings. If the interviewer asks for "any" valid order, Kahn's standard BFS output is fine. If they ask for the "lexicographically smallest," replace the queue with a min-heap. Clarify before assuming uniqueness.

## Interview Tips

1. **Draw the graph before coding.** Even for small examples, sketching nodes and edges takes 30 seconds and makes the dependency structure immediately visible. It helps you verify edge directions, spot obvious cycles, and confirm your in-degree calculations before touching code.

2. **Use Kahn's algorithm by default.** Kahn's is iterative, readable, and naturally handles cycle detection through the result-length check. DFS-based topological sort requires managing three-state node coloring ("unvisited", "visiting", "visited"), which is harder to implement correctly under pressure. Unless the interviewer specifically requests DFS, Kahn's is the safer choice.

3. **Explicitly state the cycle detection step.** After your loop, say "if `result.length != numNodes`, a cycle exists and I return an empty array." This shows you understand the connection between topological sort and DAG validation — a depth that many candidates miss.

4. **Know how to count the number of valid orderings.** If the interviewer asks "how many valid orderings exist?", the answer is a combinatorial formula involving the number of nodes at each BFS level. Each time there are K nodes in the queue simultaneously, any of K! orderings of that batch is valid. Mentioning this without being prompted demonstrates strong conceptual understanding.

5. **Recognize the pattern across domains.** Topological sort appears in: course scheduling (LeetCode 207/210), alien dictionary (order of characters), task scheduling with deadlines, build dependency resolution, and deadlock detection. Recognizing the underlying graph structure — "there's a dependency, which is a directed edge" — is the key skill that transfers across all these problem types.

## Practice Progression

Work through problems in this order to build mastery incrementally:

**Level 1 — Core algorithm:**
- Course Schedule (LeetCode 207) — just detect if a valid ordering exists
- Course Schedule II (LeetCode 210) — return the actual ordering

**Level 2 — Variations:**
- Minimum Height Trees (LeetCode 310) — Kahn's on undirected graph (prune leaves)
- Parallel Courses (LeetCode 1136) — find the minimum number of semesters

**Level 3 — Disguised problems:**
- Alien Dictionary (LeetCode 269) — extract ordering constraints from word list
- Sequence Reconstruction (LeetCode 444) — verify a unique topological order
- Find All Possible Recipes (LeetCode 2115) — topological sort with ingredient dependencies

**Level 4 — Hard variants:**
- Sort Items by Groups Respecting Dependencies (LeetCode 1203) — nested topological sorts
- Build a Matrix With Conditions (LeetCode 2392) — two independent topological sorts

## Related Patterns

No directly linked patterns yet. Topological sort pairs naturally with BFS/graph traversal patterns and is a prerequisite for understanding more advanced DAG algorithms such as critical path analysis and dynamic programming on DAGs.
