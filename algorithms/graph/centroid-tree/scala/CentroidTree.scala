package algorithms.graph.centroidtree

import scala.collection.mutable
import scala.math.max

object CentroidTree {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 1) return 0
    val n = arr(0)

    if (n <= 1) return 0
    if (arr.length < 1 + 2 * (n - 1)) return 0

    val adj = Array.fill(n)(new mutable.ListBuffer[Int])
    for (i <- 0 until n - 1) {
      val u = arr(1 + 2 * i)
      val v = arr(1 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(v)
        adj(v).append(u)
      }
    }

    val sz = new Array[Int](n)
    val removed = new Array[Boolean](n)
    var maxDepth = 0

    def getSize(u: Int, p: Int): Unit = {
      sz(u) = 1
      for (v <- adj(u)) {
        if (v != p && !removed(v)) {
          getSize(v, u)
          sz(u) += sz(v)
        }
      }
    }

    def getCentroid(u: Int, p: Int, total: Int): Int = {
      for (v <- adj(u)) {
        if (v != p && !removed(v) && sz(v) > total / 2) {
          return getCentroid(v, u, total)
        }
      }
      u
    }

    def decompose(u: Int, depth: Int): Unit = {
      getSize(u, -1)
      val total = sz(u)
      val centroid = getCentroid(u, -1, total)

      maxDepth = max(maxDepth, depth)

      removed(centroid) = true

      for (v <- adj(centroid)) {
        if (!removed(v)) {
          decompose(v, depth + 1)
        }
      }
    }

    decompose(0, 0)

    maxDepth
  }
}
