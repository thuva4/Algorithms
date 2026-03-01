object ChromaticNumber {

  def chromaticNumber(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    if (n == 0) return 0
    if (m == 0) return 1

    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      adj(u) += v
      adj(v) += u
    }

    def isSafe(colors: Array[Int], v: Int, c: Int): Boolean = {
      for (u <- adj(v)) {
        if (colors(u) == c) return false
      }
      true
    }

    def solve(colors: Array[Int], v: Int, k: Int): Boolean = {
      if (v == n) return true
      for (c <- 1 to k) {
        if (isSafe(colors, v, c)) {
          colors(v) = c
          if (solve(colors, v + 1, k)) return true
          colors(v) = 0
        }
      }
      false
    }

    for (k <- 1 to n) {
      val colors = Array.fill(n)(0)
      if (solve(colors, 0, k)) return k
    }
    n
  }
}
