object DelaunayTriangulation {

  def delaunayTriangulation(arr: Array[Int]): Int = {
    val n = arr(0)
    if (n < 3) return 0

    val points = Array.tabulate(n) { i =>
      (arr(1 + 2 * i), arr(1 + 2 * i + 1))
    }

    def cross(o: (Int, Int), a: (Int, Int), b: (Int, Int)): Long =
      (a._1 - o._1).toLong * (b._2 - o._2) - (a._2 - o._2).toLong * (b._1 - o._1)

    val base = points(0)
    val allCollinear = points.drop(2).forall(point => cross(base, points(1), point) == 0L)
    if (allCollinear) return 0

    val sorted = points.sortBy(point => (point._1, point._2))

    val lower = scala.collection.mutable.ArrayBuffer[(Int, Int)]()
    for (point <- sorted) {
      while (lower.length >= 2 && cross(lower(lower.length - 2), lower(lower.length - 1), point) <= 0L) {
        lower.remove(lower.length - 1)
      }
      lower += point
    }

    val upper = scala.collection.mutable.ArrayBuffer[(Int, Int)]()
    for (point <- sorted.reverse) {
      while (upper.length >= 2 && cross(upper(upper.length - 2), upper(upper.length - 1), point) <= 0L) {
        upper.remove(upper.length - 1)
      }
      upper += point
    }

    val hullVertices = lower.length + upper.length - 2
    2 * n - 2 - hullVertices
  }
}
