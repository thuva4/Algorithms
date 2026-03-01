object MaxFlowMinCut {
  def maxFlowMinCut(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1); val src = arr(2); val sink = arr(3)
    val cap = Array.ofDim[Int](n, n)
    for (i <- 0 until m) cap(arr(4+3*i))(arr(5+3*i)) += arr(6+3*i)
    var maxFlow = 0
    var continue_ = true
    while (continue_) {
      val parent = Array.fill(n)(-1)
      parent(src) = src
      val queue = scala.collection.mutable.Queue[Int]()
      queue.enqueue(src)
      while (queue.nonEmpty && parent(sink) == -1) {
        val u = queue.dequeue()
        for (v <- 0 until n) if (parent(v) == -1 && cap(u)(v) > 0) { parent(v) = u; queue.enqueue(v) }
      }
      if (parent(sink) == -1) { continue_ = false }
      else {
        var flow = Int.MaxValue
        var v = sink
        while (v != src) { flow = math.min(flow, cap(parent(v))(v)); v = parent(v) }
        v = sink
        while (v != src) { cap(parent(v))(v) -= flow; cap(v)(parent(v)) += flow; v = parent(v) }
        maxFlow += flow
      }
    }
    maxFlow
  }
}
