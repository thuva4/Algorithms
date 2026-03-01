fun sudokuSolve(board: IntArray): IntArray {
    val grid = board.copyOf()
    return if (solve(grid)) grid else IntArray(0)
}

private fun isValid(grid: IntArray, pos: Int, num: Int): Boolean {
    val row = pos / 9
    val col = pos % 9

    // Check row
    for (c in 0 until 9) {
        if (grid[row * 9 + c] == num) return false
    }

    // Check column
    for (r in 0 until 9) {
        if (grid[r * 9 + col] == num) return false
    }

    // Check 3x3 box
    val boxRow = 3 * (row / 3)
    val boxCol = 3 * (col / 3)
    for (r in boxRow until boxRow + 3) {
        for (c in boxCol until boxCol + 3) {
            if (grid[r * 9 + c] == num) return false
        }
    }

    return true
}

private fun solve(grid: IntArray): Boolean {
    for (i in 0 until 81) {
        if (grid[i] == 0) {
            for (num in 1..9) {
                if (isValid(grid, i, num)) {
                    grid[i] = num
                    if (solve(grid)) return true
                    grid[i] = 0
                }
            }
            return false
        }
    }
    return true
}
