package algorithms.graph.bipartitematching

import scala.collection.mutable
import java.util.LinkedList
import java.util.Queue

object BipartiteMatching {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 3) return 0

    val nLeft = arr(0)
    val nRight = arr(1)
    val m = arr(2)

    if (arr.length < 3 + 2 * m) return 0
    if (nLeft == 0 || nRight == 0) return 0

    val adj = Array.fill(nLeft)(new mutable.ListBuffer[Int])
    for (i <- 0 until m) {
      val u = arr(3 + 2 * i)
      val v = arr(3 + 2 * i + 1)
      if (u >= 0 && u < nLeft && v >= 0 && v < nRight) {
        adj(u).append(v)
      }
    }

    val pairU = Array.fill(nLeft)(-1)
    val pairV = Array.fill(nRight)(-1)
    val dist = new Array[Int](nLeft + 1)

    def bfs(): Boolean = {
      val q: Queue[Int] = new LinkedList()
      for (u <- 0 until nLeft) {
        if (pairU(u) == -1) {
          dist(u) = 0
          q.add(u)
        } else {
          dist(u) = Int.MaxValue
        }
      }

      dist(nLeft) = Int.MaxValue

      while (!q.isEmpty) {
        val u = q.poll()

        if (dist(u) < dist(nLeft)) {
          for (v <- adj(u)) {
            val pu = pairV(v)
            if (pu == -1) {
              if (dist(nLeft) == Int.MaxValue) {
                dist(nLeft) = dist(u) + 1
              }
            } else if (dist(pu) == Int.MaxValue) {
              dist(pu) = dist(u) + 1
              q.add(pu)
            }
          }
        }
      }

      dist(nLeft) != Int.MaxValue
    }

    def dfs(u: Int): Boolean = {
      if (u != -1) {
        for (v <- adj(u)) {
          val pu = pairV(v)
          if (pu == -1 || (dist(pu) == dist(u) + 1 && dfs(pu))) {
            pairV(v) = u
            pairU(u) = v
            return true
          }
        }
        dist(u) = Int.MaxValue
        return false
      }
      true
    }

    var matching = 0
    while (bfs()) {
      for (u <- 0 until nLeft) {
        if (pairU(u) == -1 && dfs(u)) {
          matching += 1
        }
      }
    }

    matching
  }
}
