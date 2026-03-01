object SudokuSolver {

  def sudokuSolve(board: Array[Int]): Array[Int] = {
    val grid = board.clone()
    if (solve(grid)) grid else Array.empty[Int]
  }

  private def isValid(grid: Array[Int], pos: Int, num: Int): Boolean = {
    val row = pos / 9
    val col = pos % 9

    // Check row
    for (c <- 0 until 9) {
      if (grid(row * 9 + c) == num) return false
    }

    // Check column
    for (r <- 0 until 9) {
      if (grid(r * 9 + col) == num) return false
    }

    // Check 3x3 box
    val boxRow = 3 * (row / 3)
    val boxCol = 3 * (col / 3)
    for (r <- boxRow until boxRow + 3) {
      for (c <- boxCol until boxCol + 3) {
        if (grid(r * 9 + c) == num) return false
      }
    }

    true
  }

  private def solve(grid: Array[Int]): Boolean = {
    for (i <- 0 until 81) {
      if (grid(i) == 0) {
        for (num <- 1 to 9) {
          if (isValid(grid, i, num)) {
            grid(i) = num
            if (solve(grid)) return true
            grid(i) = 0
          }
        }
        return false
      }
    }
    true
  }
}
