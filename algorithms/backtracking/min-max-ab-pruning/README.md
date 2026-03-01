# Minimax with Alpha-Beta Pruning

## Overview

Alpha-Beta Pruning is an optimization of the minimax algorithm that significantly reduces the number of nodes evaluated in the game tree. It maintains two bounds -- alpha (the minimum score the maximizing player is assured of) and beta (the maximum score the minimizing player is assured of) -- and prunes branches that cannot possibly influence the final decision. In the best case, alpha-beta pruning reduces the effective branching factor from b to sqrt(b), evaluating O(b^(d/2)) nodes instead of O(b^d).

Developed independently by several researchers in the 1950s and 1960s, alpha-beta pruning is essential for practical game-playing programs. It allows chess engines to search twice as deep as pure minimax with the same computational budget.

## How It Works

The algorithm is identical to minimax but passes alpha and beta bounds through the recursion. At a MAX node, if a child's value exceeds beta, the remaining children are pruned (the MIN parent would never allow this path). At a MIN node, if a child's value is less than alpha, the remaining children are pruned (the MAX grandparent would never allow this path).

### Example

Game tree with alpha-beta pruning:

```
              MAX
             /   \
          MIN     MIN
         / \     / \
       MAX MAX MAX MAX
       /\  /\  /\  /\
      3 5 6 9 1 2 0 7
```

**Evaluation with alpha-beta pruning:**

| Step | Node | alpha | beta | Value | Action |
|------|------|-------|------|-------|--------|
| 1 | Leaf 3 | -inf | +inf | 3 | Return 3 |
| 2 | Leaf 5 | -inf | +inf | 5 | Return 5 |
| 3 | MAX node | -inf | +inf | max(3,5)=5 | Return 5 |
| 4 | Leaf 6 | -inf | 5 | 6 | Return 6 |
| 5 | MAX node | -inf | 5 | 6 > beta=5 | **Prune!** Skip leaf 9 |
| 6 | MIN node | -inf | +inf | min(5, 6)=5 | Return 5, update alpha=5 |
| 7 | Leaf 1 | 5 | +inf | 1 | Return 1 |
| 8 | MAX node | 5 | +inf | 1 | Continue |
| 9 | Leaf 2 | 5 | +inf | 2 | Return 2 |
| 10 | MAX node | 5 | +inf | max(1,2)=2 | Return 2 |
| 11 | MIN node | 5 | +inf | 2 < alpha=5 | **Prune!** Skip right MAX node |
| 12 | Root MAX | | | max(5, 2)=5 | Return 5 |

**Nodes pruned:** Leaf 9 (step 5) and the entire right subtree of the second MIN node (step 11).

Without pruning: 8 leaf nodes evaluated.
With pruning: **5 leaf nodes evaluated** -- a 37.5% reduction.

## Pseudocode

```
function alphabeta(state, depth, alpha, beta, isMaximizing):
    if depth == 0 or state is terminal:
        return evaluate(state)

    if isMaximizing:
        maxEval = -infinity
        for each child of state:
            eval = alphabeta(child, depth - 1, alpha, beta, false)
            maxEval = max(maxEval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break    // beta cutoff
        return maxEval
    else:
        minEval = +infinity
        for each child of state:
            eval = alphabeta(child, depth - 1, alpha, beta, true)
            minEval = min(minEval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break    // alpha cutoff
        return minEval

// Initial call:
alphabeta(rootState, maxDepth, -infinity, +infinity, true)
```

The key addition over standard minimax is the alpha-beta window and the `break` statements that prune unnecessary branches.

## Complexity Analysis

| Case    | Time         | Space   |
|---------|-------------|---------|
| Best    | O(b^(d/2))  | O(b*d)  |
| Average | O(b^(3d/4)) | O(b*d)  |
| Worst   | O(b^d)      | O(b*d)  |

**Why these complexities?**

- **Best Case -- O(b^(d/2)):** With perfect move ordering (best moves examined first), alpha-beta prunes maximally, effectively doubling the searchable depth. The number of evaluated nodes drops to O(b^(d/2)).

- **Average Case -- O(b^(3d/4)):** With random move ordering, alpha-beta achieves an intermediate level of pruning. The effective branching factor is approximately b^(3/4).

- **Worst Case -- O(b^d):** With the worst possible move ordering (worst moves examined first), no pruning occurs, and the algorithm degenerates to standard minimax.

- **Space -- O(b*d):** The recursion stack depth is d, and at each level the algorithm may examine up to b children. The space complexity is the same as minimax.

## When to Use

- **Two-player, zero-sum games with perfect information:** Chess, checkers, Othello, Connect Four.
- **When combined with move ordering heuristics:** Iterative deepening, killer moves, and history heuristics improve the likelihood of best-case pruning.
- **When minimax is too slow:** Alpha-beta is always at least as fast as minimax and typically much faster.
- **As a component of game engines:** Nearly all classical game engines use alpha-beta as their core search algorithm.

## When NOT to Use

- **Games with very high branching factors (b > 100):** Even with pruning, the tree is too large. Use Monte Carlo Tree Search instead.
- **Imperfect information games:** Hidden information (poker, etc.) invalidates the pruning assumptions.
- **When evaluation functions are unreliable:** Poor evaluation functions negate the benefit of deeper search.
- **Real-time games with continuous action spaces:** Alpha-beta assumes discrete, enumerable moves.

## Comparison with Similar Algorithms

| Algorithm            | Time         | Space   | Notes                                        |
|---------------------|-------------|---------|----------------------------------------------|
| Minimax              | O(b^d)      | O(b*d)  | No pruning; explores full tree                |
| Alpha-Beta Pruning   | O(b^(d/2))* | O(b*d)  | *Best case; move ordering critical            |
| NegaScout (PVS)      | O(b^(d/2))* | O(b*d)  | Refinement of alpha-beta; null-window search  |
| Monte Carlo TS       | O(iterations)| O(n)   | Sampling-based; no pruning needed             |
| SSS*                 | O(b^(d/2))  | O(b^(d/2))| Best-first; high memory usage               |

## Implementations

| Language | File |
|----------|------|
| Java     | [MiniMaxWithABPruning.java](java/MiniMaxWithABPruning.java) |

## References

- Knuth, D. E., & Moore, R. W. (1975). An analysis of alpha-beta pruning. *Artificial Intelligence*, 6(4), 293-326.
- Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. Chapter 5.3: Alpha-Beta Pruning.
- [Alpha-Beta Pruning -- Wikipedia](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning)
