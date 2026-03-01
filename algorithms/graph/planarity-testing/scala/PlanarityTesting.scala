object PlanarityTesting {

  def planarityTesting(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    val edges = scala.collection.mutable.Set[(Int, Int)]()
    for (i <- 0 until m) {
      val u = arr(2+2*i); val v = arr(2+2*i+1)
      if (u != v) {
        val a = math.min(u, v); val b = math.max(u, v)
        edges += ((a, b))
      }
    }
    val e = edges.size
    if (n < 3) return 1
    if (e <= 3 * n - 6) 1 else 0
  }
}
