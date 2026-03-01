import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

fun dungeonGame(grid: Array<IntArray>): Int {
    val m = grid.size
    if (m == 0) return 0
    val n = grid[0].size

    val dp = Array(m) { IntArray(n) }

    for (i in m - 1 downTo 0) {
        for (j in n - 1 downTo 0) {
            dp[i][j] = when {
                i == m - 1 && j == n - 1 -> min(0, grid[i][j])
                i == m - 1 -> min(0, grid[i][j] + dp[i][j + 1])
                j == n - 1 -> min(0, grid[i][j] + dp[i + 1][j])
                else -> min(0, grid[i][j] + max(dp[i][j + 1], dp[i + 1][j]))
            }
        }
    }

    return abs(dp[0][0]) + 1
}

fun main() {
    val grid = arrayOf(
        intArrayOf(-2, -3, 3),
        intArrayOf(-5, -10, 1),
        intArrayOf(10, 30, -5)
    )
    println(dungeonGame(grid)) // 7
}
