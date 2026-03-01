object OptimalBST {

  def optimalBst(arr: Array[Int]): Int = {
    val n = arr(0)
    val freq = Array.tabulate(n)(i => arr(i + 1))

    val cost = Array.ofDim[Int](n, n)
    for (i <- 0 until n) cost(i)(i) = freq(i)

    for (len <- 2 to n) {
      for (i <- 0 to n - len) {
        val j = i + len - 1
        cost(i)(j) = Int.MaxValue
        val freqSum = (i to j).map(freq(_)).sum

        for (r <- i to j) {
          val left = if (r > i) cost(i)(r - 1) else 0
          val right = if (r < j) cost(r + 1)(j) else 0
          val c = left + right + freqSum
          if (c < cost(i)(j)) cost(i)(j) = c
        }
      }
    }

    cost(0)(n - 1)
  }
}
