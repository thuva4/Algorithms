import scala.collection.mutable

/**
 * Topological sort of a directed acyclic graph using DFS.
 * Returns a list of nodes in topological order.
 */
object TopologicalSort {
  def topologicalSort(adjList: Map[Int, List[Int]]): List[Int] = {
    val visited = mutable.Set[Int]()
    val stack = mutable.ListBuffer[Int]()

    def dfs(node: Int): Unit = {
      visited.add(node)

      for (neighbor <- adjList.getOrElse(node, List.empty)) {
        if (!visited.contains(neighbor)) {
          dfs(neighbor)
        }
      }

      stack += node
    }

    // Process all nodes in order
    for (i <- 0 until adjList.size) {
      if (!visited.contains(i)) {
        dfs(i)
      }
    }

    stack.toList.reverse
  }

  def main(args: Array[String]): Unit = {
    val adjList = Map(
      0 -> List(1, 2),
      1 -> List(3),
      2 -> List(3),
      3 -> List()
    )

    val result = topologicalSort(adjList)
    println(s"Topological order: $result")
  }
}
