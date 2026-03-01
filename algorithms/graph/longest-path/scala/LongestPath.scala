import scala.collection.mutable

/**
 * Longest path in a DAG using topological sort.
 */
object LongestPath {
  def longestPath(adjList: Map[Int, List[(Int, Int)]], startNode: Int): Map[Int, Double] = {
    val numNodes = adjList.size
    val visited = mutable.Set[Int]()
    val topoOrder = mutable.ListBuffer[Int]()

    def dfs(node: Int): Unit = {
      visited.add(node)
      for ((v, _) <- adjList.getOrElse(node, List.empty)) {
        if (!visited.contains(v)) dfs(v)
      }
      topoOrder += node
    }

    for (i <- 0 until numNodes) {
      if (!visited.contains(i)) dfs(i)
    }

    val dist = Array.fill(numNodes)(Double.NegativeInfinity)
    dist(startNode) = 0.0

    for (i <- topoOrder.indices.reverse) {
      val u = topoOrder(i)
      if (dist(u) != Double.NegativeInfinity) {
        for ((v, w) <- adjList.getOrElse(u, List.empty)) {
          if (dist(u) + w > dist(v)) {
            dist(v) = dist(u) + w
          }
        }
      }
    }

    (0 until numNodes).map(i => i -> dist(i)).toMap
  }

  def main(args: Array[String]): Unit = {
    val adjList = Map(
      0 -> List((1, 3), (2, 6)),
      1 -> List((3, 4), (2, 4)),
      2 -> List((3, 2)),
      3 -> List()
    )

    val result = longestPath(adjList, 0)
    println(s"Longest distances: $result")
  }
}
