object LongestPalindromeLength {

  def longestPalindromeLength(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0

    val t = scala.collection.mutable.ArrayBuffer[Int](-1)
    for (x <- arr) {
      t += x
      t += -1
    }

    val n = t.length
    val p = Array.fill(n)(0)
    var c = 0
    var r = 0
    var maxLen = 0

    for (i <- 0 until n) {
      val mirror = 2 * c - i
      if (i < r && mirror >= 0) {
        p(i) = math.min(r - i, p(mirror))
      }
      while (i + p(i) + 1 < n && i - p(i) - 1 >= 0 && t(i + p(i) + 1) == t(i - p(i) - 1)) {
        p(i) += 1
      }
      if (i + p(i) > r) { c = i; r = i + p(i) }
      if (p(i) > maxLen) maxLen = p(i)
    }

    maxLen
  }
}
