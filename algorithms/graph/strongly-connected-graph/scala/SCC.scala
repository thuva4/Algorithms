import scala.collection.mutable

/**
 * Kosaraju's algorithm to find strongly connected components.
 */
object SCC {
  def findSCCs(adjList: Map[Int, List[Int]]): List[List[Int]] = {
    val numNodes = adjList.size
    val visited = mutable.Set[Int]()
    val finishOrder = mutable.ListBuffer[Int]()

    def dfs1(node: Int): Unit = {
      visited.add(node)
      for (neighbor <- adjList.getOrElse(node, List.empty)) {
        if (!visited.contains(neighbor)) dfs1(neighbor)
      }
      finishOrder += node
    }

    for (i <- 0 until numNodes) {
      if (!visited.contains(i)) dfs1(i)
    }

    // Build reverse graph
    val revAdj = mutable.Map[Int, mutable.ListBuffer[Int]]()
    for (node <- adjList.keys) revAdj(node) = mutable.ListBuffer[Int]()
    for ((node, neighbors) <- adjList) {
      for (neighbor <- neighbors) {
        revAdj.getOrElseUpdate(neighbor, mutable.ListBuffer[Int]()) += node
      }
    }

    // Second DFS pass on reversed graph
    visited.clear()
    val components = mutable.ListBuffer[List[Int]]()

    def dfs2(node: Int, component: mutable.ListBuffer[Int]): Unit = {
      visited.add(node)
      component += node
      for (neighbor <- revAdj.getOrElse(node, mutable.ListBuffer.empty)) {
        if (!visited.contains(neighbor)) dfs2(neighbor, component)
      }
    }

    for (node <- finishOrder.reverse) {
      if (!visited.contains(node)) {
        val component = mutable.ListBuffer[Int]()
        dfs2(node, component)
        components += component.toList
      }
    }

    components.toList
  }

  def main(args: Array[String]): Unit = {
    val adjList = Map(
      0 -> List(1),
      1 -> List(2),
      2 -> List(0, 3),
      3 -> List(4),
      4 -> List(3)
    )

    val components = findSCCs(adjList)
    println(s"SCCs: $components")
  }
}
