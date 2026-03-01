# 2-SAT

## Overview

2-SAT (2-Satisfiability) determines whether a Boolean formula in 2-CNF (conjunctive normal form with exactly 2 literals per clause) is satisfiable. It constructs an implication graph from the clauses and uses Tarjan's SCC algorithm to check for contradictions. A formula is unsatisfiable if and only if some variable and its negation belong to the same SCC.

## How It Works

1. For each clause (a OR b), add implications (NOT a -> b) and (NOT b -> a) to the implication graph.
2. Variables are represented as nodes 0..n-1 and their negations as nodes n..2n-1.
3. Find all SCCs using Tarjan's algorithm.
4. The formula is satisfiable if and only if no variable x and NOT x are in the same SCC.

Input format: [n_vars, n_clauses, lit1a, lit1b, lit2a, lit2b, ...] where positive literals are 1-indexed and negative literals are negative. Output: 1 if satisfiable, 0 otherwise.

## Complexity Analysis

| Case    | Time     | Space    |
|---------|----------|----------|
| Best    | O(V + E) | O(V + E) |
| Average | O(V + E) | O(V + E) |
| Worst   | O(V + E) | O(V + E) |

Where V = 2 * n_vars and E = 2 * n_clauses (each clause produces two implications).

## Worked Example

Consider the formula: `(x1 OR x2) AND (NOT x1 OR x3) AND (NOT x2 OR NOT x3) AND (x1 OR x3)`

Variables: x1, x2, x3 (n=3). Nodes 0,1,2 represent x1,x2,x3 and nodes 3,4,5 represent NOT x1, NOT x2, NOT x3.

**Step 1 -- Build Implication Graph:**

| Clause | Implication 1 | Implication 2 |
|--------|--------------|--------------|
| x1 OR x2 | NOT x1 -> x2 | NOT x2 -> x1 |
| NOT x1 OR x3 | x1 -> x3 | NOT x3 -> NOT x1 |
| NOT x2 OR NOT x3 | x2 -> NOT x3 | x3 -> NOT x2 |
| x1 OR x3 | NOT x1 -> x3 | NOT x3 -> x1 |

**Step 2 -- Find SCCs using Tarjan's algorithm:**

SCCs found: {x1}, {x2}, {x3}, {NOT x1}, {NOT x2}, {NOT x3}

**Step 3 -- Check for contradictions:**

No variable and its negation share an SCC, so the formula is **satisfiable**.

A valid assignment: x1=TRUE, x2=TRUE, x3=FALSE.

## Pseudocode

```
function solve2SAT(n_vars, clauses):
    // Build implication graph with 2*n nodes
    graph = new AdjacencyList(2 * n_vars)

    for each clause (a, b) in clauses:
        // (a OR b) becomes (NOT a -> b) and (NOT b -> a)
        graph.addEdge(negate(a), b)
        graph.addEdge(negate(b), a)

    // Find SCCs using Tarjan's or Kosaraju's algorithm
    scc_id = tarjanSCC(graph)

    // Check satisfiability
    for i = 0 to n_vars - 1:
        if scc_id[i] == scc_id[i + n_vars]:
            return UNSATISFIABLE

    return SATISFIABLE
```

## When to Use

- **Configuration and dependency solving**: Determining if a set of constraints with two options each can be simultaneously satisfied
- **Circuit design**: Verifying if a digital circuit with binary variables meets all constraints
- **Type inference**: Resolving type constraints that have two possible resolutions
- **2-coloring with constraints**: Assigning binary labels (true/false, 0/1) to variables subject to pairwise clauses
- **Scheduling with binary choices**: When tasks have exactly two possible time slots and pairwise conflicts

## When NOT to Use

- **k-SAT for k >= 3**: The problem becomes NP-complete for 3-SAT and above; 2-SAT's polynomial-time approach does not generalize
- **Optimization problems**: 2-SAT only determines satisfiability, not optimal solutions; use MAX-2-SAT or ILP for optimization
- **Constraints with more than 2 literals per clause**: If clauses contain 3+ literals, convert to 3-SAT or use a general SAT solver
- **Weighted or prioritized constraints**: 2-SAT treats all clauses equally; for weighted variants, use weighted MAX-SAT solvers

## Comparison

| Algorithm | Time Complexity | Problem Scope | Notes |
|-----------|----------------|---------------|-------|
| 2-SAT (Tarjan's SCC) | O(V + E) | 2-CNF formulas | Polynomial, optimal for 2-SAT |
| DPLL (General SAT) | O(2^n) worst | k-SAT | Exponential but handles any clause size |
| Resolution | O(n^3) for 2-SAT | 2-SAT or general | Slower than SCC-based for 2-SAT |
| Random Walk (Papadimitriou) | O(n^2) expected | 2-SAT | Randomized, simpler but slower |

## Implementations

| Language   | File |
|------------|------|
| Python     | [two_sat.py](python/two_sat.py) |
| Java       | [TwoSat.java](java/TwoSat.java) |
| C++        | [two_sat.cpp](cpp/two_sat.cpp) |
| C          | [two_sat.c](c/two_sat.c) |
| Go         | [two_sat.go](go/two_sat.go) |
| TypeScript | [twoSat.ts](typescript/twoSat.ts) |
| Rust       | [two_sat.rs](rust/two_sat.rs) |
| Kotlin     | [TwoSat.kt](kotlin/TwoSat.kt) |
| Swift      | [TwoSat.swift](swift/TwoSat.swift) |
| Scala      | [TwoSat.scala](scala/TwoSat.scala) |
| C#         | [TwoSat.cs](csharp/TwoSat.cs) |

## References

- Aspvall, B., Plass, M. F., & Tarjan, R. E. (1979). "A linear-time algorithm for testing the truth of certain quantified Boolean formulas". *Information Processing Letters*. 8(3): 121-123.
- [2-Satisfiability -- Wikipedia](https://en.wikipedia.org/wiki/2-satisfiability)
