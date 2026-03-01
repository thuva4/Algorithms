package algorithms.graph.chromaticnumber

object ChromaticNumber {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return 0
    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m) return 0
    if (n == 0) return 0

    val adj = Array.ofDim[Boolean](n, n)
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u)(v) = true
        adj(v)(u) = true
      }
    }

    val color = new Array[Int](n)

    def isSafe(u: Int, c: Int): Boolean = {
      for (v <- 0 until n) {
        if (adj(u)(v) && color(v) == c) {
          return false
        }
      }
      true
    }

    def graphColoringUtil(u: Int, k: Int): Boolean = {
      if (u == n) return true

      for (c <- 1 to k) {
        if (isSafe(u, c)) {
          color(u) = c
          if (graphColoringUtil(u + 1, k)) {
            return true
          }
          color(u) = 0
        }
      }
      false
    }

    for (k <- 1 to n) {
      if (graphColoringUtil(0, k)) {
        return k
      }
    }

    n
  }
}
