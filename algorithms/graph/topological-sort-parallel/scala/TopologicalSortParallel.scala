import scala.collection.mutable

object TopologicalSortParallel {

  def topologicalSortParallel(data: Array[Int]): Int = {
    val n = data(0)
    val m = data(1)

    val adj = Array.fill(n)(mutable.ListBuffer[Int]())
    val indegree = new Array[Int](n)

    var idx = 2
    for (_ <- 0 until m) {
      val u = data(idx); val v = data(idx + 1)
      adj(u) += v
      indegree(v) += 1
      idx += 2
    }

    var queue = mutable.Queue[Int]()
    for (i <- 0 until n) {
      if (indegree(i) == 0) queue.enqueue(i)
    }

    var rounds = 0
    var processed = 0

    while (queue.nonEmpty) {
      val size = queue.size
      for (_ <- 0 until size) {
        val node = queue.dequeue()
        processed += 1
        for (neighbor <- adj(node)) {
          indegree(neighbor) -= 1
          if (indegree(neighbor) == 0) {
            queue.enqueue(neighbor)
          }
        }
      }
      rounds += 1
    }

    if (processed == n) rounds else -1
  }
}
