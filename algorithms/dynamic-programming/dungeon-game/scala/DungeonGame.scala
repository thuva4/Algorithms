object DungeonGame {

  def dungeonGame(grid: Array[Array[Int]]): Int = {
    val m = grid.length
    if (m == 0) return 0
    val n = grid(0).length

    val dp = Array.ofDim[Int](m, n)

    for (i <- (0 until m).reverse) {
      for (j <- (0 until n).reverse) {
        if (i == m - 1 && j == n - 1) {
          dp(i)(j) = math.min(0, grid(i)(j))
        } else if (i == m - 1) {
          dp(i)(j) = math.min(0, grid(i)(j) + dp(i)(j + 1))
        } else if (j == n - 1) {
          dp(i)(j) = math.min(0, grid(i)(j) + dp(i + 1)(j))
        } else {
          dp(i)(j) = math.min(0, grid(i)(j) + math.max(dp(i)(j + 1), dp(i + 1)(j)))
        }
      }
    }

    math.abs(dp(0)(0)) + 1
  }

  def main(args: Array[String]): Unit = {
    val grid = Array(
      Array(-2, -3, 3),
      Array(-5, -10, 1),
      Array(10, 30, -5)
    )
    println(dungeonGame(grid)) // 7
  }
}
