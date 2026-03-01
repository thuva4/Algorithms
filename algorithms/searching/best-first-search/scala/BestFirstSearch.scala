import scala.collection.mutable
import scala.collection.mutable.PriorityQueue

object BestFirstSearch {
  case class Node(id: Int, heuristic: Int) extends Ordered[Node] {
    def compare(that: Node): Int = that.heuristic - this.heuristic // Min-heap behavior
  }

  def search(n: Int, adj: Array[List[Int]], start: Int, target: Int, heuristic: Array[Int]): List[Int] = {
    val pq = new PriorityQueue[Node]()
    val visited = new Array[Boolean](n)
    val parent = new Array[Int](n)
    for (i <- 0 until n) parent(i) = -1

    pq.enqueue(Node(start, heuristic(start)))
    visited(start) = true

    var found = false

    while (pq.nonEmpty) {
      val current = pq.dequeue()
      val u = current.id

      if (u == target) {
        found = true
        // break equivalent
        pq.clear() 
      } else {
        for (v <- adj(u)) {
          if (!visited(v)) {
            visited(v) = true
            parent(v) = u
            pq.enqueue(Node(v, heuristic(v)))
          }
        }
      }
    }

    if (found) {
      var path = List[Int]()
      var curr = target
      while (curr != -1) {
        path = curr :: path
        curr = parent(curr)
      }
      path
    } else {
      List()
    }
  }
}
