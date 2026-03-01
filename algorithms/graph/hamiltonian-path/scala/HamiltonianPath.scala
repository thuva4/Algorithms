object HamiltonianPath {
  def hamiltonianPath(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    if (n <= 1) return 1
    val adj = Array.ofDim[Boolean](n, n)
    for (i <- 0 until m) {
      val u = arr(2+2*i); val v = arr(3+2*i)
      adj(u)(v) = true; adj(v)(u) = true
    }
    val full = (1 << n) - 1
    val dp = Array.ofDim[Boolean](1 << n, n)
    for (i <- 0 until n) dp(1 << i)(i) = true
    for (mask <- 1 to full; i <- 0 until n if dp(mask)(i); j <- 0 until n) {
      if ((mask & (1 << j)) == 0 && adj(i)(j))
        dp(mask | (1 << j))(j) = true
    }
    for (i <- 0 until n) if (dp(full)(i)) return 1
    0
  }
}
