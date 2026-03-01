object IntervalTree {
  def intervalTree(data: Array[Int]): Int = {
    val n = data(0)
    val query = data(2 * n + 1)
    var count = 0
    var idx = 1
    for (_ <- 0 until n) {
      val lo = data(idx); val hi = data(idx + 1)
      idx += 2
      if (lo <= query && query <= hi) count += 1
    }
    count
  }

  def main(args: Array[String]): Unit = {
    println(intervalTree(Array(3, 1, 5, 3, 8, 6, 10, 4)))
    println(intervalTree(Array(2, 1, 3, 5, 7, 10)))
    println(intervalTree(Array(3, 1, 10, 2, 9, 3, 8, 5)))
  }
}
