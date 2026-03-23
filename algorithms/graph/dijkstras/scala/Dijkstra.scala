package algorithms.graph.dijkstras

import _root_.scala.collection.mutable
import _root_.scala.math.Ordering

object Dijkstra {
  private val INF = 1000000000

  case class Edge(to: Int, weight: Int)
  case class Node(u: Int, d: Int)

  def solve(arr: Array[Int]): Array[Int] = {
    if (arr.length < 2) return Array.emptyIntArray

    val n = arr(0)
    val m = arr(1)

    if (arr.length < 2 + 3 * m + 1) return Array.emptyIntArray

    val start = arr(2 + 3 * m)
    if (start < 0 || start >= n) return Array.emptyIntArray

    val adj = Array.fill(n)(new mutable.ListBuffer[Edge])
    for (i <- 0 until m) {
      val u = arr(2 + 3 * i)
      val v = arr(2 + 3 * i + 1)
      val w = arr(2 + 3 * i + 2)
      if (u >= 0 && u < n && v >= 0 && v < n) {
        adj(u).append(Edge(v, w))
      }
    }

    val dist = Array.fill(n)(INF)
    dist(start) = 0

    implicit val nodeOrdering: Ordering[Node] = Ordering.by(-_.d)
    val pq = mutable.PriorityQueue.empty[Node]
    pq.enqueue(Node(start, 0))

    while (pq.nonEmpty) {
      val current = pq.dequeue()
      val u = current.u
      val d = current.d

      if (d <= dist(u)) {
        for (e <- adj(u)) {
          if (dist(u) + e.weight < dist(e.to)) {
            dist(e.to) = dist(u) + e.weight
            pq.enqueue(Node(e.to, dist(e.to)))
          }
        }
      }
    }

    dist
  }
}
