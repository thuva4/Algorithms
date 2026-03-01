object ActivitySelection {

  def activitySelection(arr: Array[Int]): Int = {
    val n = arr.length / 2
    if (n == 0) return 0

    val activities = (0 until n).map(i => (arr(2 * i), arr(2 * i + 1))).toArray
    val sorted = activities.sortBy(_._2)

    var count = 1
    var lastFinish = sorted(0)._2

    for (i <- 1 until n) {
      if (sorted(i)._1 >= lastFinish) {
        count += 1
        lastFinish = sorted(i)._2
      }
    }

    count
  }
}
