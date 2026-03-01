import scala.collection.mutable

/**
 * A* search algorithm to find shortest path from start to goal.
 */
object AStar {
  def aStar(
    adjList: Map[Int, List[(Int, Int)]],
    start: Int,
    goal: Int,
    heuristic: Map[Int, Int]
  ): (List[Int], Double) = {
    if (start == goal) return (List(start), 0.0)

    val gScore = mutable.Map[Int, Double]()
    val cameFrom = mutable.Map[Int, Int]()
    val closedSet = mutable.Set[Int]()

    for (node <- adjList.keys) {
      gScore(node) = Double.PositiveInfinity
    }
    gScore(start) = 0.0

    // Priority queue: (fScore, node)
    val pq = mutable.PriorityQueue[(Double, Int)]()(Ordering.by[(Double, Int), Double](-_._1))
    pq.enqueue((heuristic.getOrElse(start, 0).toDouble, start))

    while (pq.nonEmpty) {
      val (_, currentNode) = pq.dequeue()

      if (currentNode == goal) {
        val path = mutable.ListBuffer[Int]()
        var node = goal
        while (cameFrom.contains(node)) {
          path.prepend(node)
          node = cameFrom(node)
        }
        path.prepend(node)
        return (path.toList, gScore(goal))
      }

      if (!closedSet.contains(currentNode)) {
        closedSet.add(currentNode)

        for ((neighbor, weight) <- adjList.getOrElse(currentNode, List.empty)) {
          if (!closedSet.contains(neighbor)) {
            val tentativeG = gScore(currentNode) + weight
            if (tentativeG < gScore.getOrElse(neighbor, Double.PositiveInfinity)) {
              cameFrom(neighbor) = currentNode
              gScore(neighbor) = tentativeG
              val fScore = tentativeG + heuristic.getOrElse(neighbor, 0)
              pq.enqueue((fScore, neighbor))
            }
          }
        }
      }
    }

    (List.empty, Double.PositiveInfinity)
  }

  def main(args: Array[String]): Unit = {
    val adjList = Map(
      0 -> List((1, 1), (2, 4)),
      1 -> List((2, 2), (3, 6)),
      2 -> List((3, 3)),
      3 -> List()
    )
    val heuristic = Map(0 -> 5, 1 -> 4, 2 -> 2, 3 -> 0)

    val (path, cost) = aStar(adjList, 0, 3, heuristic)
    println(s"Path: $path, Cost: $cost")
  }
}
