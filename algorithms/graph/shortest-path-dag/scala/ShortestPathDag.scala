object ShortestPathDag {

  /**
   * Find shortest path from source to vertex n-1 in a DAG.
   *
   * Input format: [n, m, src, u1, v1, w1, ...]
   * @param arr input array
   * @return shortest distance from src to n-1, or -1 if unreachable
   */
  def shortestPathDag(arr: Array[Int]): Int = {
    var idx = 0
    val n = arr(idx); idx += 1
    val m = arr(idx); idx += 1
    val src = arr(idx); idx += 1

    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[(Int, Int)]())
    val inDegree = new Array[Int](n)
    for (_ <- 0 until m) {
      val u = arr(idx); idx += 1
      val v = arr(idx); idx += 1
      val w = arr(idx); idx += 1
      adj(u) += ((v, w))
      inDegree(v) += 1
    }

    val queue = scala.collection.mutable.Queue[Int]()
    for (i <- 0 until n) if (inDegree(i) == 0) queue.enqueue(i)

    val topoOrder = scala.collection.mutable.ListBuffer[Int]()
    while (queue.nonEmpty) {
      val node = queue.dequeue()
      topoOrder += node
      for ((v, _) <- adj(node)) {
        inDegree(v) -= 1
        if (inDegree(v) == 0) queue.enqueue(v)
      }
    }

    val INF = Int.MaxValue
    val dist = Array.fill(n)(INF)
    dist(src) = 0

    for (u <- topoOrder) {
      if (dist(u) != INF) {
        for ((v, w) <- adj(u)) {
          if (dist(u) + w < dist(v)) dist(v) = dist(u) + w
        }
      }
    }

    if (dist(n - 1) == INF) -1 else dist(n - 1)
  }

  def main(args: Array[String]): Unit = {
    println(shortestPathDag(Array(4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7)))
    println(shortestPathDag(Array(3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1)))
    println(shortestPathDag(Array(2, 1, 0, 0, 1, 10)))
    println(shortestPathDag(Array(3, 1, 0, 1, 2, 5)))
  }
}
