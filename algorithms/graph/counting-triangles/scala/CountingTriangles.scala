package algorithms.graph.countingtriangles

object CountingTriangles {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return 0
    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m) return 0
    if (n < 3) return 0

    val adj = Array.ofDim[Boolean](n, n)
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u)(v) = true
        adj(v)(u) = true
      }
    }

    var count = 0
    for (i <- 0 until n) {
      for (j <- i + 1 until n) {
        if (adj(i)(j)) {
          for (k <- j + 1 until n) {
            if (adj(j)(k) && adj(k)(i)) {
              count += 1
            }
          }
        }
      }
    }

    count
  }
}
