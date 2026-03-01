object WordBreak {

  /**
   * Determine if target can be formed by summing elements from arr
   * with repetition allowed.
   *
   * @param arr    array of positive integers (available elements)
   * @param target the target sum to reach
   * @return 1 if target is achievable, 0 otherwise
   */
  def canSum(arr: Array[Int], target: Int): Int = {
    if (target == 0) return 1

    val dp = Array.fill(target + 1)(false)
    dp(0) = true

    for (i <- 1 to target) {
      for (elem <- arr) {
        if (elem <= i && dp(i - elem)) {
          dp(i) = true
        }
      }
    }

    if (dp(target)) 1 else 0
  }

  def main(args: Array[String]): Unit = {
    println(canSum(Array(2, 3), 7))   // 1
    println(canSum(Array(5, 3), 8))   // 1
    println(canSum(Array(2, 4), 7))   // 0
    println(canSum(Array(1), 5))      // 1
    println(canSum(Array(7), 3))      // 0
  }
}
