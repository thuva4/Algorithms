object RodCutting {

  def rodCut(prices: Array[Int], n: Int): Int = {
    val dp = Array.fill(n + 1)(0)

    for (i <- 1 to n) {
      for (j <- 0 until i) {
        dp(i) = math.max(dp(i), prices(j) + dp(i - j - 1))
      }
    }

    dp(n)
  }

  def main(args: Array[String]): Unit = {
    val prices = Array(1, 5, 8, 9, 10, 17, 17, 20)
    println(rodCut(prices, 8)) // 22
  }
}
