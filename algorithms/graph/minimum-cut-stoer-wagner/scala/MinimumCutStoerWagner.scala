object MinimumCutStoerWagner {

  def minimumCutStoerWagner(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    val w = Array.ofDim[Int](n, n)
    var idx = 2
    for (_ <- 0 until m) {
      val u = arr(idx); val v = arr(idx + 1); val c = arr(idx + 2)
      w(u)(v) += c
      w(v)(u) += c
      idx += 3
    }

    val merged = Array.fill(n)(false)
    var best = Int.MaxValue

    for (phase <- 0 until n - 1) {
      val key = Array.fill(n)(0)
      val inA = Array.fill(n)(false)
      var prev = -1
      var last = -1

      for (_ <- 0 until n - phase) {
        var sel = -1
        for (v <- 0 until n) {
          if (!merged(v) && !inA(v)) {
            if (sel == -1 || key(v) > key(sel)) sel = v
          }
        }
        inA(sel) = true
        prev = last
        last = sel
        for (v <- 0 until n) {
          if (!merged(v) && !inA(v)) {
            key(v) += w(sel)(v)
          }
        }
      }

      if (key(last) < best) best = key(last)

      for (v <- 0 until n) {
        w(prev)(v) += w(last)(v)
        w(v)(prev) += w(v)(last)
      }
      merged(last) = true
    }

    best
  }
}
