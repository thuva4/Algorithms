object LCS {

  def lcs(x: String, y: String): Int = {
    val m = x.length
    val n = y.length
    val dp = Array.ofDim[Int](m + 1, n + 1)

    for (i <- 1 to m) {
      for (j <- 1 to n) {
        if (x(i - 1) == y(j - 1)) {
          dp(i)(j) = dp(i - 1)(j - 1) + 1
        } else {
          dp(i)(j) = math.max(dp(i - 1)(j), dp(i)(j - 1))
        }
      }
    }

    dp(m)(n)
  }

  def main(args: Array[String]): Unit = {
    println(lcs("ABCBDAB", "BDCAB")) // 4
  }
}
