package algorithms.graph.connectedcomponentlabeling

import scala.collection.mutable
import java.util.LinkedList
import java.util.Queue

object ConnectedComponents {
  def solve(arr: Array[Int]): Array[Int] = {
    if (arr.length < 2) return Array.emptyIntArray

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 2 * m) return Array.emptyIntArray
    if (n == 0) return Array.emptyIntArray

    val adj = Array.fill(n)(new mutable.ListBuffer[Int])
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(v)
        adj(v).append(u)
      }
    }

    val labels = Array.fill(n)(-1)
    val q: Queue[Int] = new LinkedList()

    for (i <- 0 until n) {
      if (labels(i) == -1) {
        val componentId = i
        labels(i) = componentId
        q.add(i)

        while (!q.isEmpty) {
          val u = q.poll()

          for (v <- adj(u)) {
            if (labels(v) == -1) {
              labels(v) = componentId
              q.add(v)
            }
          }
        }
      }
    }

    labels
  }
}
