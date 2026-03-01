import scala.collection.mutable

object TopologicalSortKahn {

  def topologicalSortKahn(arr: Array[Int]): Array[Int] = {
    if (arr.length < 2) return Array.empty[Int]

    val numVertices = arr(0)
    val numEdges = arr(1)

    val adj = Array.fill(numVertices)(mutable.ListBuffer[Int]())
    val inDegree = Array.fill(numVertices)(0)

    for (i <- 0 until numEdges) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      adj(u) += v
      inDegree(v) += 1
    }

    val queue = mutable.Queue[Int]()
    for (v <- 0 until numVertices) {
      if (inDegree(v) == 0) {
        queue.enqueue(v)
      }
    }

    val result = mutable.ListBuffer[Int]()
    while (queue.nonEmpty) {
      val u = queue.dequeue()
      result += u
      for (v <- adj(u)) {
        inDegree(v) -= 1
        if (inDegree(v) == 0) {
          queue.enqueue(v)
        }
      }
    }

    if (result.size == numVertices) result.toArray
    else Array.empty[Int]
  }
}
