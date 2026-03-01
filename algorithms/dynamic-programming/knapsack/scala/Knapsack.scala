object Knapsack {

  def knapsack(weights: Array[Int], values: Array[Int], capacity: Int): Int = {
    val n = weights.length
    val dp = Array.ofDim[Int](n + 1, capacity + 1)

    for (i <- 1 to n) {
      for (w <- 0 to capacity) {
        if (weights(i - 1) > w) {
          dp(i)(w) = dp(i - 1)(w)
        } else {
          dp(i)(w) = math.max(dp(i - 1)(w), dp(i - 1)(w - weights(i - 1)) + values(i - 1))
        }
      }
    }

    dp(n)(capacity)
  }

  def main(args: Array[String]): Unit = {
    val weights = Array(1, 3, 4, 5)
    val values = Array(1, 4, 5, 7)
    val capacity = 7
    println(knapsack(weights, values, capacity)) // 9
  }
}
