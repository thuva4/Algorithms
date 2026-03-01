object BitmaskDp {
  def bitmaskDp(n: Int, cost: Array[Array[Int]]): Int = {
    val total = 1 << n
    val dp = Array.fill(total)(Int.MaxValue)
    dp(0) = 0

    for (mask <- 0 until total) {
      if (dp(mask) != Int.MaxValue) {
        val worker = Integer.bitCount(mask)
        if (worker < n) {
          for (job <- 0 until n) {
            if ((mask & (1 << job)) == 0) {
              val newMask = mask | (1 << job)
              val newCost = dp(mask) + cost(worker)(job)
              if (newCost < dp(newMask)) dp(newMask) = newCost
            }
          }
        }
      }
    }

    dp(total - 1)
  }

  def main(args: Array[String]): Unit = {
    val br = scala.io.StdIn
    val n = br.readLine().trim.toInt
    val cost = Array.fill(n) {
      br.readLine().trim.split(" ").map(_.toInt)
    }
    println(bitmaskDp(n, cost))
  }
}
