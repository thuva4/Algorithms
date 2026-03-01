object LongestPalindromicSubsequence {

  def longestPalindromicSubsequence(arr: Array[Int]): Int = {
    val n = arr.length
    if (n == 0) return 0
    val dp = Array.ofDim[Int](n, n)
    for (i <- 0 until n) dp(i)(i) = 1
    for (len <- 2 to n; i <- 0 to n - len) {
      val j = i + len - 1
      if (arr(i) == arr(j)) dp(i)(j) = if (len == 2) 2 else dp(i + 1)(j - 1) + 2
      else dp(i)(j) = math.max(dp(i + 1)(j), dp(i)(j - 1))
    }
    dp(0)(n - 1)
  }
}
