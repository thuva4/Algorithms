object JobScheduling {

  def jobScheduling(arr: Array[Int]): Int = {
    val n = arr(0)
    val jobs = Array.tabulate(n)(i => (arr(1 + 2 * i), arr(1 + 2 * i + 1)))
    val maxDeadline = jobs.map(_._1).max

    val sorted = jobs.sortBy(-_._2)
    val slots = Array.fill(maxDeadline + 1)(false)
    var totalProfit = 0

    for ((deadline, profit) <- sorted) {
      var t = math.min(deadline, maxDeadline)
      var placed = false
      while (t > 0 && !placed) {
        if (!slots(t)) {
          slots(t) = true
          totalProfit += profit
          placed = true
        }
        t -= 1
      }
    }

    totalProfit
  }
}
