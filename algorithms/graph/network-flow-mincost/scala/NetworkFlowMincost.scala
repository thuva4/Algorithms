object NetworkFlowMincost {

  def networkFlowMincost(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1); val src = arr(2); val sink = arr(3)
    val head = Array.fill(n)(-1)
    val to = scala.collection.mutable.ArrayBuffer[Int]()
    val cap = scala.collection.mutable.ArrayBuffer[Int]()
    val costBuf = scala.collection.mutable.ArrayBuffer[Int]()
    val nxt = scala.collection.mutable.ArrayBuffer[Int]()
    var edgeCnt = 0

    def addEdge(u: Int, v: Int, c: Int, w: Int): Unit = {
      to += v; cap += c; costBuf += w; nxt += head(u); head(u) = edgeCnt; edgeCnt += 1
      to += u; cap += 0; costBuf += (-w); nxt += head(v); head(v) = edgeCnt; edgeCnt += 1
    }

    for (i <- 0 until m) {
      addEdge(arr(4 + 4 * i), arr(4 + 4 * i + 1), arr(4 + 4 * i + 2), arr(4 + 4 * i + 3))
    }

    val INF = Int.MaxValue / 2
    var totalCost = 0
    var done = false

    while (!done) {
      val dist = Array.fill(n)(INF)
      dist(src) = 0
      val inQueue = Array.fill(n)(false)
      val prevEdge = Array.fill(n)(-1)
      val prevNode = Array.fill(n)(-1)
      val q = scala.collection.mutable.Queue[Int]()
      q.enqueue(src); inQueue(src) = true

      while (q.nonEmpty) {
        val u = q.dequeue(); inQueue(u) = false
        var e = head(u)
        while (e != -1) {
          val v = to(e)
          if (cap(e) > 0 && dist(u) + costBuf(e) < dist(v)) {
            dist(v) = dist(u) + costBuf(e)
            prevEdge(v) = e; prevNode(v) = u
            if (!inQueue(v)) { q.enqueue(v); inQueue(v) = true }
          }
          e = nxt(e)
        }
      }

      if (dist(sink) == INF) {
        done = true
      } else {
        var bottleneck = INF
        var v = sink
        while (v != src) { bottleneck = math.min(bottleneck, cap(prevEdge(v))); v = prevNode(v) }
        v = sink
        while (v != src) {
          val e = prevEdge(v)
          cap(e) -= bottleneck; cap(e ^ 1) += bottleneck
          v = prevNode(v)
        }
        totalCost += bottleneck * dist(sink)
      }
    }

    totalCost
  }
}
