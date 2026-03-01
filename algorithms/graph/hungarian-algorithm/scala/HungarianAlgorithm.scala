/**
 * Hungarian Algorithm - Solve the assignment problem in O(n^3).
 */
object HungarianAlgorithm {

  def hungarian(cost: Array[Array[Int]]): (Array[Int], Int) = {
    val n = cost.length
    val INF = Int.MaxValue / 2

    val u = new Array[Int](n + 1)
    val v = new Array[Int](n + 1)
    val matchJob = new Array[Int](n + 1)

    for (i <- 1 to n) {
      matchJob(0) = i
      var j0 = 0
      val dist = Array.fill(n + 1)(INF)
      val used = new Array[Boolean](n + 1)
      val prevJob = new Array[Int](n + 1)

      var continue_ = true
      while (continue_) {
        used(j0) = true
        val w = matchJob(j0)
        var delta = INF
        var j1 = -1

        for (j <- 1 to n) {
          if (!used(j)) {
            val cur = cost(w - 1)(j - 1) - u(w) - v(j)
            if (cur < dist(j)) {
              dist(j) = cur
              prevJob(j) = j0
            }
            if (dist(j) < delta) {
              delta = dist(j)
              j1 = j
            }
          }
        }

        for (j <- 0 to n) {
          if (used(j)) {
            u(matchJob(j)) += delta
            v(j) -= delta
          } else {
            dist(j) -= delta
          }
        }

        j0 = j1
        if (matchJob(j0) == 0) continue_ = false
      }

      while (j0 != 0) {
        matchJob(j0) = matchJob(prevJob(j0))
        j0 = prevJob(j0)
      }
    }

    val assignment = new Array[Int](n)
    for (j <- 1 to n) {
      assignment(matchJob(j) - 1) = j - 1
    }

    val totalCost = (0 until n).map(i => cost(i)(assignment(i))).sum
    (assignment, totalCost)
  }

  def main(args: Array[String]): Unit = {
    val cost = Array(Array(9, 2, 7), Array(6, 4, 3), Array(5, 8, 1))
    val (assignment, totalCost) = hungarian(cost)
    println(s"Assignment: ${assignment.mkString(", ")}")
    println(s"Total cost: $totalCost")
  }
}
