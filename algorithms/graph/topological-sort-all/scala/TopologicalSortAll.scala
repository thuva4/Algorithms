object TopologicalSortAll {

  def topologicalSortAll(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    val inDeg = Array.fill(n)(0)
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i); val v = arr(2 + 2 * i + 1)
      adj(u) += v; inDeg(v) += 1
    }
    val visited = Array.fill(n)(false)
    var count = 0

    def backtrack(placed: Int): Unit = {
      if (placed == n) { count += 1; return }
      for (v <- 0 until n) {
        if (!visited(v) && inDeg(v) == 0) {
          visited(v) = true
          for (w <- adj(v)) inDeg(w) -= 1
          backtrack(placed + 1)
          visited(v) = false
          for (w <- adj(v)) inDeg(w) += 1
        }
      }
    }

    backtrack(0)
    count
  }
}
