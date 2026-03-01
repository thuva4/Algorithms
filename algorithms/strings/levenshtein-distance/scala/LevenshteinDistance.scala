object LevenshteinDistance {

  /**
   * Compute the Levenshtein (edit) distance between two sequences.
   *
   * Input format: [len1, seq1..., len2, seq2...]
   * @param arr input array encoding two sequences
   * @return minimum number of single-element edits
   */
  def levenshteinDistance(arr: Array[Int]): Int = {
    var idx = 0
    val len1 = arr(idx); idx += 1
    val seq1 = arr.slice(idx, idx + len1); idx += len1
    val len2 = arr(idx); idx += 1
    val seq2 = arr.slice(idx, idx + len2)

    val dp = Array.ofDim[Int](len1 + 1, len2 + 1)

    for (i <- 0 to len1) dp(i)(0) = i
    for (j <- 0 to len2) dp(0)(j) = j

    for (i <- 1 to len1) {
      for (j <- 1 to len2) {
        if (seq1(i - 1) == seq2(j - 1)) {
          dp(i)(j) = dp(i - 1)(j - 1)
        } else {
          dp(i)(j) = 1 + math.min(dp(i - 1)(j), math.min(dp(i)(j - 1), dp(i - 1)(j - 1)))
        }
      }
    }

    dp(len1)(len2)
  }

  def main(args: Array[String]): Unit = {
    println(levenshteinDistance(Array(3, 1, 2, 3, 3, 1, 2, 4))) // 1
    println(levenshteinDistance(Array(2, 5, 6, 2, 5, 6)))       // 0
    println(levenshteinDistance(Array(2, 1, 2, 2, 3, 4)))       // 2
    println(levenshteinDistance(Array(0, 3, 1, 2, 3)))          // 3
  }
}
