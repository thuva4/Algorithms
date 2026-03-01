# Minimax

## Overview

Minimax is a decision-making algorithm used in two-player, zero-sum games (such as Tic-Tac-Toe, Chess, and Checkers) to determine the optimal move for a player. The algorithm assumes both players play optimally: the "maximizing" player tries to maximize the score, while the "minimizing" player tries to minimize it. By exploring the complete game tree, minimax guarantees finding the best possible move.

The algorithm was formalized by John von Neumann in 1928 and is foundational to game theory and artificial intelligence. It is the basis for all modern game-playing programs, though in practice it is enhanced with alpha-beta pruning and other optimizations.

## How It Works

The algorithm recursively builds a game tree from the current state. At each node, if it is the maximizing player's turn, the algorithm returns the maximum value among all children; if it is the minimizing player's turn, it returns the minimum value. Terminal states (game over) return the utility value (win, lose, or draw score). The recursion explores all possible game states to determine the optimal play.

### Example

A simple game tree (Tic-Tac-Toe-like scenario):

```
                    MAX
                   / | \
                  /  |  \
               MIN  MIN  MIN
              /  \   |   / \
             3   5   2  9   1
```

**Evaluating from bottom up:**

| Step | Node | Player | Children values | Chosen value | Reasoning |
|------|------|--------|----------------|-------------|-----------|
| 1 | Left MIN | MIN | {3, 5} | 3 | MIN picks minimum |
| 2 | Center MIN | MIN | {2} | 2 | Only child |
| 3 | Right MIN | MIN | {9, 1} | 1 | MIN picks minimum |
| 4 | Root MAX | MAX | {3, 2, 1} | 3 | MAX picks maximum |

```
                    MAX = 3
                   / | \
                  /  |  \
            MIN=3 MIN=2 MIN=1
            /  \    |    / \
           3   5    2   9   1
```

Result: MAX player should choose the **left branch**, guaranteeing a score of at least `3`.

**Deeper example with alternating turns:**

```
              MAX
             /   \
          MIN     MIN
         / \     / \
       MAX MAX MAX MAX
       /\  /\  /\  /\
      3 5 6 9 1 2 0 7
```

| Level | Node | Values considered | Result |
|-------|------|------------------|--------|
| Leaves | - | 3,5,6,9,1,2,0,7 | - |
| MAX (level 2) | Nodes | {3,5}=5, {6,9}=9, {1,2}=2, {0,7}=7 | 5,9,2,7 |
| MIN (level 1) | Nodes | {5,9}=5, {2,7}=2 | 5,2 |
| MAX (root) | Root | {5,2}=5 | 5 |

## Pseudocode

```
function minimax(state, depth, isMaximizing):
    if depth == 0 or state is terminal:
        return evaluate(state)

    if isMaximizing:
        maxEval = -infinity
        for each child of state:
            eval = minimax(child, depth - 1, false)
            maxEval = max(maxEval, eval)
        return maxEval
    else:
        minEval = +infinity
        for each child of state:
            eval = minimax(child, depth - 1, true)
            minEval = min(minEval, eval)
        return minEval
```

The `evaluate` function assigns a numerical score to terminal or depth-limited states. Higher scores favor the maximizing player.

## Complexity Analysis

| Case    | Time   | Space   |
|---------|--------|---------|
| Best    | O(b^d) | O(b*d)  |
| Average | O(b^d) | O(b*d)  |
| Worst   | O(b^d) | O(b*d)  |

**Why these complexities?**

- **Best Case -- O(b^d):** The algorithm always explores the entire game tree. With branching factor b and depth d, the total number of nodes is O(b^d). No pruning occurs in standard minimax.

- **Average Case -- O(b^d):** Every node in the game tree is visited exactly once. Each node requires O(b) work to evaluate its children.

- **Worst Case -- O(b^d):** The same as all cases. Standard minimax does not skip any nodes.

- **Space -- O(b*d):** The recursion stack goes d levels deep, and at each level, the algorithm may need to store information about b children, giving O(b*d) space. If only the value is needed (not the entire path), O(d) suffices for the recursion stack alone.

## When to Use

- **Perfect-information, two-player games:** Games where both players can see the full game state (chess, checkers, tic-tac-toe).
- **When the game tree is small enough to explore fully:** Tic-tac-toe (b ~= 4, d ~= 9) is easily handled.
- **As a foundation for more advanced algorithms:** Minimax is the base algorithm that alpha-beta pruning, iterative deepening, and transposition tables optimize.
- **When optimal play is required:** Minimax guarantees the best possible outcome against a perfect opponent.

## When NOT to Use

- **Games with large branching factors:** Chess (b ~= 35) at full depth is intractable. Use alpha-beta pruning or Monte Carlo Tree Search.
- **Games with hidden information:** Poker, Battleship, and other imperfect-information games require different approaches (e.g., CFR, expectiminimax).
- **Games with more than two players:** Multi-player minimax generalizations exist but are more complex.
- **Real-time decisions under time constraints:** The exponential time complexity makes pure minimax unsuitable for time-limited scenarios.

## Comparison with Similar Algorithms

| Algorithm            | Time         | Space   | Notes                                        |
|---------------------|-------------|---------|----------------------------------------------|
| Minimax              | O(b^d)      | O(b*d)  | Explores full tree; guaranteed optimal        |
| Alpha-Beta Pruning   | O(b^(d/2))* | O(b*d)  | *Best case; prunes unnecessary branches       |
| Monte Carlo Tree Search| O(n)      | O(n)    | Sampling-based; good for large branching      |
| Expectiminimax       | O(b^d)     | O(b*d)  | Handles chance nodes (dice, card draws)       |

## Implementations

| Language | File |
|----------|------|
| C++      | [minimax.cpp](cpp/minimax.cpp) |
| Go       | [minimax.go](go/minimax.go) |

## References

- Von Neumann, J. (1928). Zur Theorie der Gesellschaftsspiele. *Mathematische Annalen*, 100(1), 295-320.
- Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach* (4th ed.). Pearson. Chapter 5: Adversarial Search.
- [Minimax -- Wikipedia](https://en.wikipedia.org/wiki/Minimax)
