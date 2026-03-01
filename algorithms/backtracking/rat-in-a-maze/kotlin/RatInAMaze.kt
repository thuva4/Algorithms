fun ratInMaze(arr: IntArray): Int {
    val n = arr[0]
    val grid = Array(n) { IntArray(n) }
    var idx = 1
    for (i in 0 until n) for (j in 0 until n) { grid[i][j] = arr[idx]; idx++ }
    if (grid[0][0] == 0 || grid[n-1][n-1] == 0) return 0
    val visited = Array(n) { BooleanArray(n) }

    fun solve(r: Int, c: Int): Boolean {
        if (r == n - 1 && c == n - 1) return true
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] == 0 || visited[r][c]) return false
        visited[r][c] = true
        if (solve(r + 1, c) || solve(r, c + 1)) return true
        visited[r][c] = false
        return false
    }

    return if (solve(0, 0)) 1 else 0
}
