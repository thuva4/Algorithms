object RatInAMaze {

  def ratInMaze(arr: Array[Int]): Int = {
    val n = arr(0)
    val grid = Array.ofDim[Int](n, n)
    var idx = 1
    for (i <- 0 until n; j <- 0 until n) { grid(i)(j) = arr(idx); idx += 1 }
    if (grid(0)(0) == 0 || grid(n-1)(n-1) == 0) return 0
    val visited = Array.ofDim[Boolean](n, n)

    def solve(r: Int, c: Int): Boolean = {
      if (r == n - 1 && c == n - 1) return true
      if (r < 0 || r >= n || c < 0 || c >= n || grid(r)(c) == 0 || visited(r)(c)) return false
      visited(r)(c) = true
      if (solve(r + 1, c) || solve(r, c + 1)) return true
      visited(r)(c) = false
      false
    }

    if (solve(0, 0)) 1 else 0
  }
}
