package algorithms.graph.bipartitecheck

import scala.collection.mutable
import java.util.LinkedList
import java.util.Queue

object BipartiteCheck {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return 0

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m) return 0
    if (n == 0) return 1

    val adj = Array.fill(n)(new mutable.ListBuffer[Int])
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(v)
        adj(v).append(u)
      }
    }

    val color = Array.fill(n)(0) // 0: none, 1: red, -1: blue
    val q: Queue[Int] = new LinkedList()

    for (i <- 0 until n) {
      if (color(i) == 0) {
        color(i) = 1
        q.add(i)

        while (!q.isEmpty) {
          val u = q.poll()

          for (v <- adj(u)) {
            if (color(v) == 0) {
              color(v) = -color(u)
              q.add(v)
            } else if (color(v) == color(u)) {
              return 0
            }
          }
        }
      }
    }

    1
  }
}
