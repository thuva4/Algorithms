import scala.collection.mutable

object DpOnTrees {
  def dpOnTrees(n: Int, values: Array[Int], edges: Array[Array[Int]]): Int = {
    if (n == 0) return 0
    if (n == 1) return values(0)

    val adj = Array.fill(n)(mutable.ListBuffer[Int]())
    for (e <- edges) {
      adj(e(0)) += e(1)
      adj(e(1)) += e(0)
    }

    val dp = new Array[Int](n)
    val parent = Array.fill(n)(-1)
    val visited = new Array[Boolean](n)

    val order = mutable.ListBuffer[Int]()
    val queue = mutable.Queue[Int]()
    queue.enqueue(0)
    visited(0) = true
    while (queue.nonEmpty) {
      val node = queue.dequeue()
      order += node
      for (child <- adj(node)) {
        if (!visited(child)) {
          visited(child) = true
          parent(child) = node
          queue.enqueue(child)
        }
      }
    }

    for (i <- order.indices.reverse) {
      val node = order(i)
      var bestChild = 0
      for (child <- adj(node)) {
        if (child != parent(node)) {
          bestChild = math.max(bestChild, dp(child))
        }
      }
      dp(node) = values(node) + bestChild
    }

    dp.max
  }

  def main(args: Array[String]): Unit = {
    val br = scala.io.StdIn
    val n = br.readLine().trim.toInt
    val values = br.readLine().trim.split(" ").map(_.toInt)
    val edges = Array.fill(math.max(0, n - 1)) {
      br.readLine().trim.split(" ").map(_.toInt)
    }
    println(dpOnTrees(n, values, edges))
  }
}
