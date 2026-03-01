object PrimsFibonacciHeap {

  def primsFibonacciHeap(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[(Int, Int)]())
    for (i <- 0 until m) {
      val u = arr(2+3*i); val v = arr(2+3*i+1); val w = arr(2+3*i+2)
      adj(u) += ((w, v)); adj(v) += ((w, u))
    }

    val INF = Int.MaxValue
    val inMst = Array.fill(n)(false)
    val key = Array.fill(n)(INF)
    key(0) = 0
    val pq = scala.collection.mutable.PriorityQueue[(Int, Int)]()(Ordering.by[(Int, Int), Int](_._1).reverse)
    pq.enqueue((0, 0))
    var total = 0

    while (pq.nonEmpty) {
      val (w, u) = pq.dequeue()
      if (!inMst(u)) {
        inMst(u) = true; total += w
        for ((ew, v) <- adj(u)) {
          if (!inMst(v) && ew < key(v)) { key(v) = ew; pq.enqueue((ew, v)) }
        }
      }
    }

    total
  }
}
