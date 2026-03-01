object DelaunayTriangulation {

  def delaunayTriangulation(arr: Array[Int]): Int = {
    val n = arr(0)
    if (n < 3) return 0

    val px = Array.tabulate(n)(i => arr(1 + 2 * i).toDouble)
    val py = Array.tabulate(n)(i => arr(1 + 2 * i + 1).toDouble)

    val eps = 1e-9
    var count = 0

    for (i <- 0 until n; j <- (i + 1) until n; k <- (j + 1) until n) {
      val (ax, ay) = (px(i), py(i))
      val (bx, by) = (px(j), py(j))
      val (cx, cy) = (px(k), py(k))

      val d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
      if (math.abs(d) >= eps) {
        val ux = ((ax*ax + ay*ay) * (by - cy) +
                  (bx*bx + by*by) * (cy - ay) +
                  (cx*cx + cy*cy) * (ay - by)) / d
        val uy = ((ax*ax + ay*ay) * (cx - bx) +
                  (bx*bx + by*by) * (ax - cx) +
                  (cx*cx + cy*cy) * (bx - ax)) / d

        val rSq = (ux - ax) * (ux - ax) + (uy - ay) * (uy - ay)

        val valid = (0 until n).forall { m =>
          m == i || m == j || m == k || {
            val distSq = (ux - px(m)) * (ux - px(m)) + (uy - py(m)) * (uy - py(m))
            distSq >= rSq - eps
          }
        }

        if (valid) count += 1
      }
    }

    count
  }
}
