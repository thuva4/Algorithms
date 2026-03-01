object CountBridges {

  def countBridges(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      adj(u) += v
      adj(v) += u
    }

    val disc = Array.fill(n)(-1)
    val low = Array.fill(n)(0)
    val parent = Array.fill(n)(-1)
    var timer = 0
    var bridgeCount = 0

    def dfs(u: Int): Unit = {
      disc(u) = timer
      low(u) = timer
      timer += 1

      for (v <- adj(u)) {
        if (disc(v) == -1) {
          parent(v) = u
          dfs(v)
          low(u) = math.min(low(u), low(v))
          if (low(v) > disc(u)) bridgeCount += 1
        } else if (v != parent(u)) {
          low(u) = math.min(low(u), disc(v))
        }
      }
    }

    for (i <- 0 until n) {
      if (disc(i) == -1) dfs(i)
    }

    bridgeCount
  }
}
