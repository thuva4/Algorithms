object ConvexHullTrick {

  def solve(lines: Array[(Long, Long)], queries: Array[Long]): Array[Long] = {
    val sorted = lines.sortBy(_._1)
    val hull = scala.collection.mutable.ArrayBuffer[(Long, Long)]()

    def bad(l1: (Long, Long), l2: (Long, Long), l3: (Long, Long)): Boolean = {
      (l3._2 - l1._2).toDouble * (l1._1 - l2._1).toDouble <=
      (l2._2 - l1._2).toDouble * (l1._1 - l3._1).toDouble
    }

    for (line <- sorted) {
      while (hull.size >= 2 && bad(hull(hull.size - 2), hull(hull.size - 1), line))
        hull.remove(hull.size - 1)
      hull += line
    }

    queries.map { x =>
      var lo = 0
      var hi = hull.size - 1
      while (lo < hi) {
        val mid = (lo + hi) / 2
        if (hull(mid)._1 * x + hull(mid)._2 <= hull(mid + 1)._1 * x + hull(mid + 1)._2)
          hi = mid
        else
          lo = mid + 1
      }
      hull(lo)._1 * x + hull(lo)._2
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toLong)
    var idx = 0
    val n = input(idx).toInt; idx += 1
    val lines = Array.fill(n) {
      val m = input(idx); idx += 1
      val b = input(idx); idx += 1
      (m, b)
    }
    val q = input(idx).toInt; idx += 1
    val queries = Array.fill(q) { val v = input(idx); idx += 1; v }
    println(solve(lines, queries).mkString(" "))
  }
}
