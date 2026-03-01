object SequenceAlignment {

  val GapCost = 4
  val MismatchCost = 3

  def sequenceAlignment(s1: String, s2: String): Int = {
    val m = s1.length
    val n = s2.length
    val dp = Array.ofDim[Int](m + 1, n + 1)

    for (i <- 0 to m) dp(i)(0) = i * GapCost
    for (j <- 0 to n) dp(0)(j) = j * GapCost

    for (i <- 1 to m) {
      for (j <- 1 to n) {
        val matchCost = if (s1(i - 1) == s2(j - 1)) 0 else MismatchCost
        dp(i)(j) = math.min(
          math.min(dp(i - 1)(j) + GapCost, dp(i)(j - 1) + GapCost),
          dp(i - 1)(j - 1) + matchCost
        )
      }
    }

    dp(m)(n)
  }

  def main(args: Array[String]): Unit = {
    println(sequenceAlignment("GCCCTAGCG", "GCGCAATG")) // 18
  }
}
