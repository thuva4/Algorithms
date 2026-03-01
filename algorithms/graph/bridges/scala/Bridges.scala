package algorithms.graph.bridges

import scala.collection.mutable
import scala.math.min

object Bridges {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return 0
    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m) return 0

    val adj = Array.fill(n)(new mutable.ListBuffer[Int])
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(v)
        adj(v).append(u)
      }
    }

    val dfn = new Array[Int](n)
    val low = new Array[Int](n)
    var timer = 0
    var bridgeCount = 0

    def dfs(u: Int, p: Int): Unit = {
      timer += 1
      dfn(u) = timer
      low(u) = timer

      for (v <- adj(u)) {
        if (v != p) {
          if (dfn(v) != 0) {
            low(u) = min(low(u), dfn(v))
          } else {
            dfs(v, u)
            low(u) = min(low(u), low(v))
            if (low(v) > dfn(u)) {
              bridgeCount += 1
            }
          }
        }
      }
    }

    for (i <- 0 until n) {
      if (dfn(i) == 0) dfs(i, -1)
    }

    bridgeCount
  }
}
