package algorithms.graph.bidirectionalbfs

import scala.collection.mutable
import java.util.LinkedList
import java.util.Queue

object BidirectionalBfs {
  def solve(arr: Array[Int]): Int = {
    if (arr.length < 4) return -1

    val n = arr(0)
    val m = arr(1)
    val start = arr(2)
    val end = arr(3)

    if (arr.length < 4 + 2 * m) return -1
    if (start == end) return 0

    val adj = Array.fill(n)(new mutable.ListBuffer[Int])
    for (i <- 0 until m) {
      val u = arr(4 + 2 * i)
      val v = arr(4 + 2 * i + 1)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(v)
        adj(v).append(u)
      }
    }

    val distStart = Array.fill(n)(-1)
    val distEnd = Array.fill(n)(-1)

    val qStart: Queue[Int] = new LinkedList()
    val qEnd: Queue[Int] = new LinkedList()

    qStart.add(start)
    distStart(start) = 0

    qEnd.add(end)
    distEnd(end) = 0

    while (!qStart.isEmpty && !qEnd.isEmpty) {
      // Start
      var u = qStart.poll()
      if (distEnd(u) != -1) return distStart(u) + distEnd(u)

      for (v <- adj(u)) {
        if (distStart(v) == -1) {
          distStart(v) = distStart(u) + 1
          if (distEnd(v) != -1) return distStart(v) + distEnd(v)
          qStart.add(v)
        }
      }

      // End
      u = qEnd.poll()
      if (distStart(u) != -1) return distStart(u) + distEnd(u)

      for (v <- adj(u)) {
        if (distEnd(v) == -1) {
          distEnd(v) = distEnd(u) + 1
          if (distStart(v) != -1) return distStart(v) + distEnd(v)
          qEnd.add(v)
        }
      }
    }

    -1
  }
}
