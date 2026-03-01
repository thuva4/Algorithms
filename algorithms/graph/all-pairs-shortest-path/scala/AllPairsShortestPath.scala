package algorithms.graph.allpairsshortestpath

import scala.math.min

object AllPairsShortestPath {
  private val INF = 1000000000

  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return -1

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 3 * m) return -1
    if (n <= 0) return -1
    if (n == 1) return 0

    val dist = Array.fill(n, n)(INF)
    for (i <- 0 until n) dist(i)(i) = 0

    for (i <- 0 until m) {
      val u = arr(2 + 3 * i)
      val v = arr(2 + 3 * i + 1)
      val w = arr(2 + 3 * i + 2)

      if (u >= 0 && u < n && v >= 0 && v < n) {
        dist(u)(v) = min(dist(u)(v), w)
      }
    }

    for (k <- 0 until n) {
      for (i <- 0 until n) {
        for (j <- 0 until n) {
          if (dist(i)(k) != INF && dist(k)(j) != INF) {
            dist(i)(j) = min(dist(i)(j), dist(i)(k) + dist(k)(j))
          }
        }
      }
    }

    if (dist(0)(n - 1) == INF) -1 else dist(0)(n - 1)
  }
}
