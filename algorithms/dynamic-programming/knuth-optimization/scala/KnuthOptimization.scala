object KnuthOptimization {

  def knuthOptimization(n: Int, freq: Array[Int]): Int = {
    if (n == 0) return 0
    val dp = Array.ofDim[Int](n, n)
    val opt = Array.ofDim[Int](n, n)
    val prefix = new Array[Int](n + 1)
    for (i <- 0 until n) prefix(i + 1) = prefix(i) + freq(i)

    for (i <- 0 until n) {
      dp(i)(i) = freq(i)
      opt(i)(i) = i
    }

    for (len <- 2 to n) {
      for (i <- 0 to n - len) {
        val j = i + len - 1
        dp(i)(j) = Int.MaxValue
        val costSum = prefix(j + 1) - prefix(i)
        val lo = opt(i)(j - 1)
        val hi = if (i + 1 <= j) opt(i + 1)(j) else j
        for (k <- lo to hi) {
          val left = if (k > i) dp(i)(k - 1) else 0
          val right = if (k < j) dp(k + 1)(j) else 0
          val v = left + right + costSum
          if (v < dp(i)(j)) {
            dp(i)(j) = v
            opt(i)(j) = k
          }
        }
      }
    }
    dp(0)(n - 1)
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    val n = input(0)
    val freq = input.slice(1, 1 + n)
    println(knuthOptimization(n, freq))
  }
}
