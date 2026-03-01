object TravellingSalesman {
  def travellingSalesman(arr: Array[Int]): Int = {
    val n = arr(0)
    if (n <= 1) return 0
    val dist = Array.tabulate(n, n)((i, j) => arr(1 + i*n + j))
    val INF = Int.MaxValue / 2
    val full = (1 << n) - 1
    val dp = Array.fill(1 << n, n)(INF)
    dp(1)(0) = 0
    for (mask <- 1 to full; i <- 0 until n if dp(mask)(i) < INF && (mask & (1 << i)) != 0; j <- 0 until n if (mask & (1 << j)) == 0) {
      val nm = mask | (1 << j)
      val cost = dp(mask)(i) + dist(i)(j)
      if (cost < dp(nm)(j)) dp(nm)(j) = cost
    }
    var result = INF
    for (i <- 0 until n) result = math.min(result, dp(full)(i) + dist(i)(0))
    result
  }
}
