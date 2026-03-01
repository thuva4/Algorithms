object ConvexHull {

  def convexHullCount(arr: Array[Int]): Int = {
    val n = arr(0)
    if (n <= 2) return n

    val points = new Array[(Int, Int)](n)
    var idx = 1
    for (i <- 0 until n) { points(i) = (arr(idx), arr(idx + 1)); idx += 2 }
    val sorted = points.sorted

    def cross(o: (Int, Int), a: (Int, Int), b: (Int, Int)): Long =
      (a._1 - o._1).toLong * (b._2 - o._2) - (a._2 - o._2).toLong * (b._1 - o._1)

    val hull = scala.collection.mutable.ArrayBuffer[(Int, Int)]()
    for (p <- sorted) {
      while (hull.size >= 2 && cross(hull(hull.size - 2), hull(hull.size - 1), p) <= 0) hull.remove(hull.size - 1)
      hull += p
    }
    val lower = hull.size + 1
    for (i <- n - 2 to 0 by -1) {
      while (hull.size >= lower && cross(hull(hull.size - 2), hull(hull.size - 1), sorted(i)) <= 0) hull.remove(hull.size - 1)
      hull += sorted(i)
    }
    hull.size - 1
  }
}
