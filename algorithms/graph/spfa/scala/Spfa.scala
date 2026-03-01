object Spfa {

  def spfa(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    val src = arr(2)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[(Int, Int)]())
    for (i <- 0 until m) {
      val u = arr(3 + 3 * i)
      val v = arr(3 + 3 * i + 1)
      val w = arr(3 + 3 * i + 2)
      adj(u) += ((v, w))
    }

    val INF = Int.MaxValue / 2
    val dist = Array.fill(n)(INF)
    dist(src) = 0
    val inQueue = Array.fill(n)(false)
    val queue = scala.collection.mutable.Queue[Int]()
    queue.enqueue(src)
    inQueue(src) = true

    while (queue.nonEmpty) {
      val u = queue.dequeue()
      inQueue(u) = false
      for ((v, w) <- adj(u)) {
        if (dist(u) + w < dist(v)) {
          dist(v) = dist(u) + w
          if (!inQueue(v)) {
            queue.enqueue(v)
            inQueue(v) = true
          }
        }
      }
    }

    if (dist(n - 1) == INF) -1 else dist(n - 1)
  }
}
