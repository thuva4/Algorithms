object CoinChange {

  def coinChange(coins: Array[Int], amount: Int): Int = {
    if (amount == 0) return 0

    val dp = Array.fill(amount + 1)(Int.MaxValue)
    dp(0) = 0

    for (i <- 1 to amount) {
      for (coin <- coins) {
        if (coin <= i && dp(i - coin) != Int.MaxValue) {
          dp(i) = math.min(dp(i), dp(i - coin) + 1)
        }
      }
    }

    if (dp(amount) == Int.MaxValue) -1 else dp(amount)
  }

  def main(args: Array[String]): Unit = {
    println(coinChange(Array(1, 5, 10, 25), 30)) // 2
  }
}
