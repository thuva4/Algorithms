import scala.collection.mutable

/**
 * Prim's algorithm to find the Minimum Spanning Tree (MST) total weight.
 * Uses a weighted adjacency list.
 */
object Prim {
  def prim(numVertices: Int, adjList: Map[Int, List[(Int, Int)]]): Int = {
    val inMST = Array.fill(numVertices)(false)
    val key = Array.fill(numVertices)(Int.MaxValue)
    key(0) = 0

    // Priority queue: (weight, vertex)
    val pq = mutable.PriorityQueue[(Int, Int)]()(Ordering.by[(Int, Int), Int](-_._1))
    pq.enqueue((0, 0))

    var totalWeight = 0

    while (pq.nonEmpty) {
      val (w, u) = pq.dequeue()

      if (!inMST(u)) {
        inMST(u) = true
        totalWeight += w

        for ((v, weight) <- adjList.getOrElse(u, List.empty)) {
          if (!inMST(v) && weight < key(v)) {
            key(v) = weight
            pq.enqueue((weight, v))
          }
        }
      }
    }

    totalWeight
  }

  def main(args: Array[String]): Unit = {
    val adjList = Map(
      0 -> List((1, 10), (2, 6), (3, 5)),
      1 -> List((0, 10), (3, 15)),
      2 -> List((0, 6), (3, 4)),
      3 -> List((0, 5), (1, 15), (2, 4))
    )

    val result = prim(4, adjList)
    println(s"MST total weight: $result")
  }
}
