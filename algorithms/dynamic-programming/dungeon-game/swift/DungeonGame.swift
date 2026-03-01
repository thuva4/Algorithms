func dungeonGame(_ grid: [[Int]]) -> Int {
    let m = grid.count
    if m == 0 { return 0 }
    let n = grid[0].count

    var dp = Array(repeating: Array(repeating: 0, count: n), count: m)

    for i in stride(from: m - 1, through: 0, by: -1) {
        for j in stride(from: n - 1, through: 0, by: -1) {
            if i == m - 1 && j == n - 1 {
                dp[i][j] = min(0, grid[i][j])
            } else if i == m - 1 {
                dp[i][j] = min(0, grid[i][j] + dp[i][j + 1])
            } else if j == n - 1 {
                dp[i][j] = min(0, grid[i][j] + dp[i + 1][j])
            } else {
                dp[i][j] = min(0, grid[i][j] + max(dp[i][j + 1], dp[i + 1][j]))
            }
        }
    }

    return abs(dp[0][0]) + 1
}

let grid = [[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]
print(dungeonGame(grid)) // 7
