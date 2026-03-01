# Dungeon Game

## Overview

The Dungeon Game is a dynamic programming problem where a knight must travel from the top-left corner to the bottom-right corner of an m x n grid (dungeon). Each cell contains an integer representing either health gained (positive) or damage taken (negative). The knight starts with some initial health points and must maintain at least 1 health point at all times. The goal is to determine the minimum initial health required for the knight to reach the destination alive.

This problem is notable because it requires bottom-up DP processing from the destination back to the start, rather than the more common top-down direction. A forward approach fails because the minimum health depends on future cells, not just past ones.

## How It Works

The algorithm builds a 2D table where `dp[i][j]` represents the minimum health the knight needs when entering cell (i, j) to be able to reach the destination. Starting from the bottom-right corner and working backward, at each cell we determine how much health is needed to survive the current cell and have enough to proceed. The knight can only move right or down.

### Example

Given dungeon grid:

```
+-------+-------+-------+
| -2(S) |  -3   |   3   |
+-------+-------+-------+
|  -5   | -10   |   1   |
+-------+-------+-------+
|  10   |  30   | -5(P) |
+-------+-------+-------+
```
(S = Start, P = Princess/destination)

**Building the DP table (right-to-left, bottom-to-top):**

| Step | Cell | Grid Value | Min from right | Min from below | Need here | dp[i][j] |
|------|------|-----------|---------------|---------------|-----------|----------|
| 1 | (2,2) | -5 | - | - | 1-(-5)=6 | 6 |
| 2 | (2,1) | 30 | 6 | - | 6-30=-24, min 1 | 1 |
| 3 | (2,0) | 10 | 1 | - | 1-10=-9, min 1 | 1 |
| 4 | (1,2) | 1 | - | 6 | 6-1=5 | 5 |
| 5 | (1,1) | -10 | 5 | 1 | min(5,1)+10=11 | 11 |
| 6 | (1,0) | -5 | 11 | 1 | min(11,1)+5=6 | 6 |
| 7 | (0,2) | 3 | - | 5 | 5-3=2 | 2 |
| 8 | (0,1) | -3 | 2 | 11 | min(2,11)+3=5 | 5 |
| 9 | (0,0) | -2 | 5 | 6 | min(5,6)+2=7 | 7 |

**DP table result:**

|  7 |  5 | 2 |
|----|----|----|
|  6 | 11 | 5 |
|  1 |  1 | 6 |

Result: Minimum initial health = `7`

**Verification:** Path (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2):
- Start: 7, cell -2: 7-2=5, cell -5: 5-5=0... That fails. Best path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2):
- Start: 7, cell -2: 5, cell -3: 2, cell 3: 5, cell 1: 6, cell -5: 1. Survives with 1 HP.

## Pseudocode

```
function dungeonGame(dungeon):
    m = rows(dungeon)
    n = cols(dungeon)
    dp = 2D array of size m x n

    // Base case: destination cell
    dp[m-1][n-1] = max(1 - dungeon[m-1][n-1], 1)

    // Last column (can only go down)
    for i from m - 2 down to 0:
        dp[i][n-1] = max(dp[i+1][n-1] - dungeon[i][n-1], 1)

    // Last row (can only go right)
    for j from n - 2 down to 0:
        dp[m-1][j] = max(dp[m-1][j+1] - dungeon[m-1][j], 1)

    // Fill remaining cells
    for i from m - 2 down to 0:
        for j from n - 2 down to 0:
            min_health_on_exit = min(dp[i+1][j], dp[i][j+1])
            dp[i][j] = max(min_health_on_exit - dungeon[i][j], 1)

    return dp[0][0]
```

The key insight is processing in reverse: at each cell, we know the minimum health needed upon leaving (the minimum of going right or down), and we compute the minimum health needed upon entering by subtracting the cell's value (adding damage or subtracting healing).

## Complexity Analysis

| Case    | Time   | Space  |
|---------|--------|--------|
| Best    | O(mn)  | O(mn)  |
| Average | O(mn)  | O(mn)  |
| Worst   | O(mn)  | O(mn)  |

**Why these complexities?**

- **Best Case -- O(mn):** Every cell in the grid must be processed to determine the optimal path. The algorithm fills the entire m x n DP table.

- **Average Case -- O(mn):** Each cell computation requires O(1) work: a min of two neighbors, a subtraction, and a max with 1. Total: m * n constant-time operations.

- **Worst Case -- O(mn):** The computation is uniform for all inputs. No grid configuration can reduce or increase the work beyond O(mn).

- **Space -- O(mn):** The DP table has the same dimensions as the input grid. This can be optimized to O(n) by processing one row at a time from bottom to top.

## When to Use

- **Grid pathfinding with survival constraints:** When traversing a grid where you must maintain a minimum resource level throughout the path.
- **Minimum starting resource problems:** Problems where you need to determine the initial resources required to complete a journey.
- **When the path must go only right/down:** The algorithm is designed for monotonically directed paths in a grid.
- **Game design:** Computing difficulty levels or minimum health requirements for game characters.

## When NOT to Use

- **When movement is unrestricted:** If the knight can move in all four directions, BFS/Dijkstra-based approaches are needed.
- **When you need the actual path, not just the minimum health:** Additional backtracking logic is required.
- **Very large grids with sparse interesting cells:** Graph-based approaches may be more efficient.
- **When health can drop to zero and be restored:** The problem assumes health must always stay at 1 or above.

## Comparison with Similar Algorithms

| Algorithm          | Time   | Space  | Notes                                          |
|-------------------|--------|--------|------------------------------------------------|
| Dungeon Game (DP)  | O(mn)  | O(mn)  | Backward DP; minimum starting health            |
| Minimum Path Sum   | O(mn)  | O(mn)  | Forward DP; minimum total cost                   |
| 0/1 Knapsack       | O(nW)  | O(nW)  | Different structure; weight capacity constraint  |
| Dijkstra's         | O(V log V) | O(V) | For general graphs with non-negative weights   |

## Implementations

| Language | File |
|----------|------|
| C++      | [DungeonGame.cpp](cpp/DungeonGame.cpp) |

## References

- [Dungeon Game -- LeetCode Problem 174](https://leetcode.com/problems/dungeon-game/)
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press. Chapter 15: Dynamic Programming.
- [Dynamic Programming on Grids -- Wikipedia](https://en.wikipedia.org/wiki/Dynamic_programming)
