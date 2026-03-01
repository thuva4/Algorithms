object LongestCommonSubstring {

  /**
   * Find the length of the longest contiguous subarray common to both arrays.
   *
   * @param arr1 first array of integers
   * @param arr2 second array of integers
   * @return length of the longest common contiguous subarray
   */
  def longestCommonSubstring(arr1: Array[Int], arr2: Array[Int]): Int = {
    val n = arr1.length
    val m = arr2.length
    var maxLen = 0

    val dp = Array.ofDim[Int](n + 1, m + 1)

    for (i <- 1 to n) {
      for (j <- 1 to m) {
        if (arr1(i - 1) == arr2(j - 1)) {
          dp(i)(j) = dp(i - 1)(j - 1) + 1
          if (dp(i)(j) > maxLen) {
            maxLen = dp(i)(j)
          }
        } else {
          dp(i)(j) = 0
        }
      }
    }

    maxLen
  }

  def main(args: Array[String]): Unit = {
    println(longestCommonSubstring(Array(1, 2, 3, 4, 5), Array(3, 4, 5, 6, 7)))  // 3
    println(longestCommonSubstring(Array(1, 2, 3), Array(4, 5, 6)))                // 0
    println(longestCommonSubstring(Array(1, 2, 3, 4), Array(1, 2, 3, 4)))          // 4
    println(longestCommonSubstring(Array(1), Array(1)))                             // 1
    println(longestCommonSubstring(Array(1, 2, 3, 2, 1), Array(3, 2, 1, 4, 7)))   // 3
  }
}
