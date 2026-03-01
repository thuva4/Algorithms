object DigitDp {
  var digits: Array[Int] = _
  var numDigits: Int = _
  var targetSum: Int = _
  var memo: Array[Array[Array[Int]]] = _

  def solve(pos: Int, currentSum: Int, tight: Int): Int = {
    if (currentSum > targetSum) return 0
    if (pos == numDigits) return if (currentSum == targetSum) 1 else 0
    if (memo(pos)(currentSum)(tight) != -1) return memo(pos)(currentSum)(tight)

    val limit = if (tight == 1) digits(pos) else 9
    var result = 0
    for (d <- 0 to limit) {
      val newTight = if (tight == 1 && d == limit) 1 else 0
      result += solve(pos + 1, currentSum + d, newTight)
    }

    memo(pos)(currentSum)(tight) = result
    result
  }

  def digitDp(n: Int, target: Int): Int = {
    if (n <= 0) return 0
    targetSum = target

    val s = n.toString
    numDigits = s.length
    digits = s.map(_ - '0').toArray
    val maxSum = 9 * numDigits

    if (target > maxSum) return 0

    memo = Array.fill(numDigits, maxSum + 1, 2)(-1)
    solve(0, 0, 1)
  }

  def main(args: Array[String]): Unit = {
    val parts = scala.io.StdIn.readLine().trim.split(" ").map(_.toInt)
    println(digitDp(parts(0), parts(1)))
  }
}
