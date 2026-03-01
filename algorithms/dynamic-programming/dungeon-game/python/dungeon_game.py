def dungeon_game(grid):
    m = len(grid)
    if m == 0:
        return 0
    n = len(grid[0])

    dp = [[0] * n for _ in range(m)]

    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            if i == m - 1 and j == n - 1:
                dp[i][j] = min(0, grid[i][j])
            elif i == m - 1:
                dp[i][j] = min(0, grid[i][j] + dp[i][j + 1])
            elif j == n - 1:
                dp[i][j] = min(0, grid[i][j] + dp[i + 1][j])
            else:
                dp[i][j] = min(0, grid[i][j] + max(dp[i][j + 1], dp[i + 1][j]))

    return abs(dp[0][0]) + 1


if __name__ == "__main__":
    grid = [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]
    print(dungeon_game(grid))  # 7
