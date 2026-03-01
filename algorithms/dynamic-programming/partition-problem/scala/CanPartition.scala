object CanPartition {

  def canPartition(arr: Array[Int]): Int = {
    val total = arr.sum
    if (total % 2 != 0) return 0
    val target = total / 2
    val dp = Array.fill(target + 1)(false)
    dp(0) = true
    for (num <- arr) {
      for (j <- target to num by -1) {
        dp(j) = dp(j) || dp(j - num)
      }
    }
    if (dp(target)) 1 else 0
  }
}
