object ClosestPair {

  def closestPair(arr: Array[Int]): Int = {
    val n = arr.length / 2
    val points = Array.tabulate(n)(i => (arr(2 * i), arr(2 * i + 1)))
    val sorted = points.sortBy(p => (p._1, p._2))

    def distSq(a: (Int, Int), b: (Int, Int)): Int =
      (a._1 - b._1) * (a._1 - b._1) + (a._2 - b._2) * (a._2 - b._2)

    def solve(l: Int, r: Int): Int = {
      if (r - l < 3) {
        var mn = Int.MaxValue
        for (i <- l to r; j <- (i + 1) to r)
          mn = math.min(mn, distSq(sorted(i), sorted(j)))
        return mn
      }

      val mid = (l + r) / 2
      val midX = sorted(mid)._1

      val dl = solve(l, mid)
      val dr = solve(mid + 1, r)
      var d = math.min(dl, dr)

      val strip = (l to r).filter(i =>
        (sorted(i)._1 - midX) * (sorted(i)._1 - midX) < d
      ).map(sorted(_)).sortBy(_._2)

      for (i <- strip.indices) {
        var j = i + 1
        while (j < strip.length && (strip(j)._2 - strip(i)._2) * (strip(j)._2 - strip(i)._2) < d) {
          d = math.min(d, distSq(strip(i), strip(j)))
          j += 1
        }
      }

      d
    }

    solve(0, n - 1)
  }
}
