object KosarajusScc {

  def kosarajusScc(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    val radj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      adj(u) += v
      radj(v) += u
    }

    val visited = Array.fill(n)(false)
    val order = scala.collection.mutable.ListBuffer[Int]()

    def dfs1(v: Int): Unit = {
      visited(v) = true
      for (w <- adj(v)) {
        if (!visited(w)) dfs1(w)
      }
      order += v
    }

    for (v <- 0 until n) {
      if (!visited(v)) dfs1(v)
    }

    for (i <- 0 until n) visited(i) = false
    var sccCount = 0

    def dfs2(v: Int): Unit = {
      visited(v) = true
      for (w <- radj(v)) {
        if (!visited(w)) dfs2(w)
      }
    }

    for (i <- order.indices.reverse) {
      val v = order(i)
      if (!visited(v)) {
        dfs2(v)
        sccCount += 1
      }
    }

    sccCount
  }
}
