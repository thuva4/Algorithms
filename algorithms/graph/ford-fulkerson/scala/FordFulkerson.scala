object FordFulkerson {
  private var capS: Array[Array[Int]] = _
  private var nS: Int = 0

  private def dfsS(u: Int, sink: Int, flow: Int, visited: Array[Boolean]): Int = {
    if (u == sink) return flow
    visited(u) = true
    for (v <- 0 until nS) {
      if (!visited(v) && capS(u)(v) > 0) {
        val d = dfsS(v, sink, math.min(flow, capS(u)(v)), visited)
        if (d > 0) { capS(u)(v) -= d; capS(v)(u) += d; return d }
      }
    }
    0
  }

  def fordFulkerson(arr: Array[Int]): Int = {
    nS = arr(0); val m = arr(1); val src = arr(2); val sink = arr(3)
    capS = Array.ofDim[Int](nS, nS)
    for (i <- 0 until m) capS(arr(4+3*i))(arr(5+3*i)) += arr(6+3*i)
    var maxFlow = 0
    var continue_ = true
    while (continue_) {
      val visited = new Array[Boolean](nS)
      val flow = dfsS(src, sink, Int.MaxValue, visited)
      if (flow == 0) continue_ = false
      else maxFlow += flow
    }
    maxFlow
  }
}
