object IsBipartite {

  def isBipartite(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      adj(u) += v
      adj(v) += u
    }

    val color = Array.fill(n)(-1)

    for (start <- 0 until n) {
      if (color(start) == -1) {
        color(start) = 0
        val queue = scala.collection.mutable.Queue[Int]()
        queue.enqueue(start)
        while (queue.nonEmpty) {
          val u = queue.dequeue()
          for (v <- adj(u)) {
            if (color(v) == -1) {
              color(v) = 1 - color(u)
              queue.enqueue(v)
            } else if (color(v) == color(u)) {
              return 0
            }
          }
        }
      }
    }

    1
  }
}
