object GraphCycleDetection {

  def graphCycleDetection(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) { adj(arr(2 + 2 * i)) += arr(2 + 2 * i + 1) }
    val color = Array.fill(n)(0)

    def dfs(v: Int): Boolean = {
      color(v) = 1
      for (w <- adj(v)) {
        if (color(w) == 1) return true
        if (color(w) == 0 && dfs(w)) return true
      }
      color(v) = 2
      false
    }

    for (v <- 0 until n) {
      if (color(v) == 0 && dfs(v)) return 1
    }
    0
  }
}
