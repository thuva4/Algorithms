object EditDistance {

  def editDistance(s1: String, s2: String): Int = {
    val m = s1.length
    val n = s2.length
    val dp = Array.ofDim[Int](m + 1, n + 1)

    for (i <- 0 to m) dp(i)(0) = i
    for (j <- 0 to n) dp(0)(j) = j

    for (i <- 1 to m) {
      for (j <- 1 to n) {
        val cost = if (s1(i - 1) != s2(j - 1)) 1 else 0
        dp(i)(j) = math.min(
          math.min(dp(i - 1)(j) + 1, dp(i)(j - 1) + 1),
          dp(i - 1)(j - 1) + cost
        )
      }
    }

    dp(m)(n)
  }

  def main(args: Array[String]): Unit = {
    println(editDistance("kitten", "sitting")) // 3
  }
}
