object RabinKarp {
  val Prime: Long = 101
  val Base: Long = 256

  def rabinKarpSearch(text: String, pattern: String): Int = {
    val n = text.length
    val m = pattern.length

    if (m == 0) return 0
    if (m > n) return -1

    var patHash: Long = 0
    var txtHash: Long = 0
    var h: Long = 1

    for (_ <- 0 until m - 1) {
      h = (h * Base) % Prime
    }

    for (i <- 0 until m) {
      patHash = (Base * patHash + pattern(i).toLong) % Prime
      txtHash = (Base * txtHash + text(i).toLong) % Prime
    }

    for (i <- 0 to n - m) {
      if (patHash == txtHash) {
        var matched = true
        var j = 0
        while (j < m && matched) {
          if (text(i + j) != pattern(j)) matched = false
          j += 1
        }
        if (matched) return i
      }
      if (i < n - m) {
        txtHash = (Base * (txtHash - text(i).toLong * h) + text(i + m).toLong) % Prime
        if (txtHash < 0) txtHash += Prime
      }
    }
    -1
  }

  def main(args: Array[String]): Unit = {
    val text = "ABABDABACDABABCABAB"
    val pattern = "ABABCABAB"
    println(s"Pattern found at index: ${rabinKarpSearch(text, pattern)}")
  }
}
