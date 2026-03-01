package algorithms.graph.bellmanford

object BellmanFord {
  private val INF = 1000000000

  def solve(arr: Array[Int]): Array[Int] = {
    if (arr.length < 2) return Array.emptyIntArray

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 3 * m + 1) return Array.emptyIntArray

    val start = arr(2 + 3 * m)

    if (start < 0 || start >= n) return Array.emptyIntArray

    val dist = Array.fill(n)(INF)
    dist(start) = 0

    for (_ <- 0 until n - 1) {
      for (j <- 0 until m) {
        val u = arr(2 + 3 * j)
        val v = arr(2 + 3 * j + 1)
        val w = arr(2 + 3 * j + 2)

        if (dist(u) != INF && dist(u) + w < dist(v)) {
          dist(v) = dist(u) + w
        }
      }
    }

    for (j <- 0 until m) {
      val u = arr(2 + 3 * j)
      val v = arr(2 + 3 * j + 1)
      val w = arr(2 + 3 * j + 2)

      if (dist(u) != INF && dist(u) + w < dist(v)) {
        return Array.emptyIntArray // Negative cycle
      }
    }

    dist
  }
}
