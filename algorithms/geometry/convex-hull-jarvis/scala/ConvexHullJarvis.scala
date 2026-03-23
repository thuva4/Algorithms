object ConvexHullJarvis {

  def convexHullJarvis(arr: Array[Int]): Int = {
    val n = arr(0)
    if (n < 2) return n

    val px = Array.tabulate(n)(i => arr(1 + 2 * i))
    val py = Array.tabulate(n)(i => arr(1 + 2 * i + 1))

    def cross(o: Int, a: Int, b: Int): Int =
      (px(a) - px(o)) * (py(b) - py(o)) - (py(a) - py(o)) * (px(b) - px(o))

    def distSq(a: Int, b: Int): Int =
      (px(a) - px(b)) * (px(a) - px(b)) + (py(a) - py(b)) * (py(a) - py(b))

    var start = 0
    for (i <- 1 until n) {
      if (px(i) < px(start) || (px(i) == px(start) && py(i) < py(start)))
        start = i
    }

    var hullCount = 0
    var current = start
    var firstPass = true
    while (firstPass || current != start) {
      firstPass = false
      hullCount += 1
      var candidate = 0
      for (i <- 1 until n) {
        if (i != current) {
          if (candidate == current) {
            candidate = i
          } else {
            val c = cross(current, candidate, i)
            if (c < 0) candidate = i
            else if (c == 0 && distSq(current, i) > distSq(current, candidate))
              candidate = i
          }
        }
      }
      current = candidate
    }

    hullCount
  }
}
