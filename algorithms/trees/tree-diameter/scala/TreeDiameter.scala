object TreeDiameter {

  def treeDiameter(arr: Array[Int]): Int = {
    var idx = 0
    val n = arr(idx); idx += 1
    if (n <= 1) return 0

    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    val m = (arr.length - 1) / 2
    for (_ <- 0 until m) {
      val u = arr(idx); idx += 1
      val v = arr(idx); idx += 1
      adj(u) += v; adj(v) += u
    }

    def bfs(start: Int): (Int, Int) = {
      val dist = Array.fill(n)(-1)
      dist(start) = 0
      val queue = scala.collection.mutable.Queue(start)
      var farthest = start
      while (queue.nonEmpty) {
        val node = queue.dequeue()
        for (nb <- adj(node)) {
          if (dist(nb) == -1) {
            dist(nb) = dist(node) + 1
            queue.enqueue(nb)
            if (dist(nb) > dist(farthest)) farthest = nb
          }
        }
      }
      (farthest, dist(farthest))
    }

    val (u, _) = bfs(0)
    val (_, diameter) = bfs(u)
    diameter
  }

  def main(args: Array[String]): Unit = {
    println(treeDiameter(Array(4, 0, 1, 1, 2, 2, 3)))
    println(treeDiameter(Array(5, 0, 1, 0, 2, 0, 3, 0, 4)))
    println(treeDiameter(Array(2, 0, 1)))
    println(treeDiameter(Array(1)))
  }
}
