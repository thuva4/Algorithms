object MaximumBipartiteMatching {

  def maximumBipartiteMatching(arr: Array[Int]): Int = {
    val nLeft = arr(0); val nRight = arr(1); val m = arr(2)
    val adj = Array.fill(nLeft)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) adj(arr(3 + 2 * i)) += arr(3 + 2 * i + 1)
    val matchRight = Array.fill(nRight)(-1)

    def dfs(u: Int, visited: Array[Boolean]): Boolean = {
      for (v <- adj(u)) {
        if (!visited(v)) {
          visited(v) = true
          if (matchRight(v) == -1 || dfs(matchRight(v), visited)) {
            matchRight(v) = u; return true
          }
        }
      }
      false
    }

    var result = 0
    for (u <- 0 until nLeft) {
      val visited = Array.fill(nRight)(false)
      if (dfs(u, visited)) result += 1
    }
    result
  }
}
