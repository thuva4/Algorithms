object KdTree {
  def kdTree(data: Array[Int]): Int = {
    val n = data(0)
    val qx = data(1 + 2 * n); val qy = data(2 + 2 * n)
    var best = Int.MaxValue
    var idx = 1
    for (_ <- 0 until n) {
      val dx = data(idx) - qx; val dy = data(idx + 1) - qy
      val d = dx * dx + dy * dy
      if (d < best) best = d
      idx += 2
    }
    best
  }

  def main(args: Array[String]): Unit = {
    println(kdTree(Array(3, 1, 2, 3, 4, 5, 6, 3, 3)))
    println(kdTree(Array(2, 0, 0, 5, 5, 0, 0)))
    println(kdTree(Array(1, 3, 4, 0, 0)))
  }
}
