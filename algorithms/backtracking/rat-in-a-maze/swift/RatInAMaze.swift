func ratInMaze(_ arr: [Int]) -> Int {
    let n = arr[0]
    var grid = Array(repeating: Array(repeating: 0, count: n), count: n)
    var idx = 1
    for i in 0..<n { for j in 0..<n { grid[i][j] = arr[idx]; idx += 1 } }
    if grid[0][0] == 0 || grid[n-1][n-1] == 0 { return 0 }
    var visited = Array(repeating: Array(repeating: false, count: n), count: n)

    func solve(_ r: Int, _ c: Int) -> Bool {
        if r == n - 1 && c == n - 1 { return true }
        if r < 0 || r >= n || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c] { return false }
        visited[r][c] = true
        if solve(r + 1, c) || solve(r, c + 1) { return true }
        visited[r][c] = false
        return false
    }

    return solve(0, 0) ? 1 : 0
}
