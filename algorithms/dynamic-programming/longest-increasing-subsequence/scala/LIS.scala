object LIS {

  def lis(arr: Array[Int]): Int = {
    val n = arr.length
    if (n == 0) return 0

    val dp = Array.fill(n)(1)
    var maxLen = 1

    for (i <- 1 until n) {
      for (j <- 0 until i) {
        if (arr(j) < arr(i) && dp(j) + 1 > dp(i)) {
          dp(i) = dp(j) + 1
        }
      }
      if (dp(i) > maxLen) maxLen = dp(i)
    }

    maxLen
  }

  def main(args: Array[String]): Unit = {
    println(lis(Array(10, 9, 2, 5, 3, 7, 101, 18))) // 4
  }
}
