/**
 * Flood fill algorithm using DFS.
 * Fills all connected cells with the same value as (sr, sc) with newValue.
 */
fun floodFill(grid: Array<IntArray>, sr: Int, sc: Int, newValue: Int): Array<IntArray> {
    val originalValue = grid[sr][sc]
    if (originalValue == newValue) return grid

    val rows = grid.size
    val cols = grid[0].size

    fun dfs(r: Int, c: Int) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != originalValue) return
        grid[r][c] = newValue
        dfs(r - 1, c)
        dfs(r + 1, c)
        dfs(r, c - 1)
        dfs(r, c + 1)
    }

    dfs(sr, sc)
    return grid
}

fun main() {
    val grid = arrayOf(
        intArrayOf(1, 1, 1),
        intArrayOf(1, 1, 0),
        intArrayOf(1, 0, 1)
    )

    floodFill(grid, 0, 0, 2)

    println("After flood fill:")
    for (row in grid) {
        println(row.joinToString(" "))
    }
}
