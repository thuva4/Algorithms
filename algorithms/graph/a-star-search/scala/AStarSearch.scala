package algorithms.graph.astarsearch

import scala.collection.mutable
import scala.math.Ordering

object AStarSearch {
  case class Node(id: Int, f: Int, g: Int) extends Ordered[Node] {
    def compare(that: Node): Int = that.f - this.f // Min-heap
  }

  case class Edge(to: Int, weight: Int)

  def solve(arr: Array[Int]): Int = {
    if (arr.length < 2) return -1

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 3 * m + 2 + n) return -1

    val start = arr(2 + 3 * m)
    val goal = arr(2 + 3 * m + 1)

    if (start < 0 || start >= n || goal < 0 || goal >= n) return -1
    if (start == goal) return 0

    val adj = Array.fill(n)(new mutable.ListBuffer[Edge])
    for (i <- 0 until m) {
      val u = arr(2 + 3 * i)
      val v = arr(2 + 3 * i + 1)
      val w = arr(2 + 3 * i + 2)

      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(Edge(v, w))
      }
    }

    val hIndex = 2 + 3 * m + 2
    
    val openSet = mutable.PriorityQueue.empty[Node]
    val gScore = Array.fill(n)(Int.MaxValue)

    gScore(start) = 0
    openSet.enqueue(Node(start, arr(hIndex + start), 0))

    while (openSet.nonEmpty) {
      val current = openSet.dequeue()
      val u = current.id

      if (u == goal) return current.g

      if (current.g <= gScore(u)) {
        for (e <- adj(u)) {
          val v = e.to
          val w = e.weight

          if (gScore(u) != Int.MaxValue && gScore(u).toLong + w < gScore(v)) {
            gScore(v) = gScore(u) + w
            val f = gScore(v) + arr(hIndex + v)
            openSet.enqueue(Node(v, f, gScore(v)))
          }
        }
      }
    }

    -1
  }
}
