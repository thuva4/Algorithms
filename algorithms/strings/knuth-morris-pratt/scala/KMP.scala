object KMP {
  def computeLPS(pattern: String): Array[Int] = {
    val m = pattern.length
    val lps = new Array[Int](m)
    var len = 0
    var i = 1

    while (i < m) {
      if (pattern(i) == pattern(len)) {
        len += 1
        lps(i) = len
        i += 1
      } else {
        if (len != 0) {
          len = lps(len - 1)
        } else {
          lps(i) = 0
          i += 1
        }
      }
    }
    lps
  }

  def kmpSearch(text: String, pattern: String): Int = {
    val n = text.length
    val m = pattern.length

    if (m == 0) return 0

    val lps = computeLPS(pattern)

    var i = 0
    var j = 0
    while (i < n) {
      if (pattern(j) == text(i)) {
        i += 1
        j += 1
      }
      if (j == m) {
        return i - j
      } else if (i < n && pattern(j) != text(i)) {
        if (j != 0) {
          j = lps(j - 1)
        } else {
          i += 1
        }
      }
    }
    -1
  }

  def main(args: Array[String]): Unit = {
    val text = "ABABDABACDABABCABAB"
    val pattern = "ABABCABAB"
    println(s"Pattern found at index: ${kmpSearch(text, pattern)}")
  }
}
