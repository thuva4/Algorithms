package algorithms.graph.depthfirstsearch

import scala.collection.mutable

object Dfs {
  def solve(arr: Array[Int]): Array[Int] = {
    if (arr.length < 2) return Array.emptyIntArray

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m + 1) return Array.emptyIntArray

    val start = arr(2 + 2 * m)
    if (start < 0 || start >= n) return Array.emptyIntArray

    val adj = Array.fill(n)(new mutable.ListBuffer[Int])
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(v)
        adj(v).append(u)
      }
    }

    for (i <- 0 until n) {
      adj(i) = adj(i).sorted
    }

    val result = new mutable.ListBuffer[Int]()
    val visited = Array.fill(n)(false)

    def dfsRecursive(u: Int): Unit = {
      visited(u) = true
      result.append(u)

      for (v <- adj(u)) {
        if (!visited(v)) {
          dfsRecursive(v)
        }
      }
    }

    dfsRecursive(start)

    result.toArray
  }
}
