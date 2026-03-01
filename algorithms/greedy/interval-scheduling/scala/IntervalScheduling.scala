object IntervalScheduling {

  def intervalScheduling(arr: Array[Int]): Int = {
    val n = arr(0)
    val intervals = Array.tabulate(n)(i => (arr(1 + 2 * i), arr(1 + 2 * i + 1)))
    val sorted = intervals.sortBy(_._2)

    var count = 0
    var lastEnd = -1
    for ((start, end) <- sorted) {
      if (start >= lastEnd) {
        count += 1
        lastEnd = end
      }
    }

    count
  }
}
