object LongestPalindromeSubarray {

  def longestPalindromeSubarray(arr: Array[Int]): Int = {
    val n = arr.length
    if (n == 0) return 0

    def expand(l: Int, r: Int): Int = {
      var left = l
      var right = r
      while (left >= 0 && right < n && arr(left) == arr(right)) {
        left -= 1
        right += 1
      }
      right - left - 1
    }

    var maxLen = 1
    for (i <- 0 until n) {
      val odd = expand(i, i)
      val even = expand(i, i + 1)
      maxLen = math.max(maxLen, math.max(odd, even))
    }
    maxLen
  }
}
