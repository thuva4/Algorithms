import scala.collection.mutable

/**
 * Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
 */
object EdmondsKarp {
  def edmondsKarp(capacity: Array[Array[Int]], source: Int, sink: Int): Int = {
    if (source == sink) return 0

    val n = capacity.length
    val residual = capacity.map(_.clone())
    var totalFlow = 0

    var continue_ = true
    while (continue_) {
      // BFS to find augmenting path
      val parent = Array.fill(n)(-1)
      val visited = Array.fill(n)(false)
      val queue = mutable.Queue[Int]()
      queue.enqueue(source)
      visited(source) = true

      while (queue.nonEmpty && !visited(sink)) {
        val u = queue.dequeue()
        for (v <- 0 until n) {
          if (!visited(v) && residual(u)(v) > 0) {
            visited(v) = true
            parent(v) = u
            queue.enqueue(v)
          }
        }
      }

      if (!visited(sink)) {
        continue_ = false
      } else {
        // Find minimum capacity along path
        var pathFlow = Int.MaxValue
        var v = sink
        while (v != source) {
          pathFlow = math.min(pathFlow, residual(parent(v))(v))
          v = parent(v)
        }

        // Update residual capacities
        v = sink
        while (v != source) {
          residual(parent(v))(v) -= pathFlow
          residual(v)(parent(v)) += pathFlow
          v = parent(v)
        }

        totalFlow += pathFlow
      }
    }

    totalFlow
  }

  def main(args: Array[String]): Unit = {
    val capacity = Array(
      Array(0, 10, 10, 0, 0, 0),
      Array(0, 0, 2, 4, 8, 0),
      Array(0, 0, 0, 0, 9, 0),
      Array(0, 0, 0, 0, 0, 10),
      Array(0, 0, 0, 6, 0, 10),
      Array(0, 0, 0, 0, 0, 0)
    )

    val result = edmondsKarp(capacity, 0, 5)
    println(s"Maximum flow: $result")
  }
}
