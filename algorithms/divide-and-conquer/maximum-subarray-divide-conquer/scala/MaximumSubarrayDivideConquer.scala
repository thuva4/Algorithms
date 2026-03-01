object MaximumSubarrayDivideConquer {

  def maxSubarrayDC(arr: Array[Int]): Long = {
    def helper(lo: Int, hi: Int): Long = {
      if (lo == hi) return arr(lo).toLong
      val mid = (lo + hi) / 2

      var leftSum = Long.MinValue; var s = 0L
      for (i <- mid to lo by -1) { s += arr(i); if (s > leftSum) leftSum = s }
      var rightSum = Long.MinValue; s = 0
      for (i <- mid + 1 to hi) { s += arr(i); if (s > rightSum) rightSum = s }

      val cross = leftSum + rightSum
      val leftMax = helper(lo, mid)
      val rightMax = helper(mid + 1, hi)
      math.max(math.max(leftMax, rightMax), cross)
    }
    helper(0, arr.length - 1)
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    val n = input(0)
    val arr = input.slice(1, 1 + n)
    println(maxSubarrayDC(arr))
  }
}
