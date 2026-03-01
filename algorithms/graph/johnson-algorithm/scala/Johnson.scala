import scala.collection.mutable

/**
 * Johnson's algorithm for all-pairs shortest paths.
 */
object Johnson {
  case class Edge(src: Int, dest: Int, weight: Int)

  def johnson(numVertices: Int, edges: List[Edge]): Option[Map[Int, Map[Int, Double]]] = {
    // Add virtual node
    val allEdges = edges ++ (0 until numVertices).map(i => Edge(numVertices, i, 0))

    // Bellman-Ford from virtual node
    val h = Array.fill(numVertices + 1)(Double.PositiveInfinity)
    h(numVertices) = 0.0

    for (_ <- 0 until numVertices) {
      for (e <- allEdges) {
        if (h(e.src) != Double.PositiveInfinity && h(e.src) + e.weight < h(e.dest)) {
          h(e.dest) = h(e.src) + e.weight
        }
      }
    }

    for (e <- allEdges) {
      if (h(e.src) != Double.PositiveInfinity && h(e.src) + e.weight < h(e.dest)) {
        return None // Negative cycle
      }
    }

    // Reweight edges
    val adjList = mutable.Map[Int, mutable.ListBuffer[(Int, Int)]]()
    for (i <- 0 until numVertices) adjList(i) = mutable.ListBuffer()
    for (e <- edges) {
      val newWeight = (e.weight + h(e.src) - h(e.dest)).toInt
      adjList(e.src) += ((e.dest, newWeight))
    }

    // Run Dijkstra from each vertex
    val result = mutable.Map[Int, Map[Int, Double]]()
    for (u <- 0 until numVertices) {
      val dist = dijkstraHelper(numVertices, adjList.toMap.map { case (k, v) => k -> v.toList }, u)
      val distances = (0 until numVertices).map { v =>
        if (dist(v) == Double.PositiveInfinity) v -> Double.PositiveInfinity
        else v -> (dist(v) - h(u) + h(v))
      }.toMap
      result(u) = distances
    }

    Some(result.toMap)
  }

  private def dijkstraHelper(n: Int, adjList: Map[Int, List[(Int, Int)]], src: Int): Array[Double] = {
    val dist = Array.fill(n)(Double.PositiveInfinity)
    val visited = Array.fill(n)(false)
    dist(src) = 0.0

    for (_ <- 0 until n) {
      var u = -1
      var minDist = Double.PositiveInfinity
      for (i <- 0 until n) {
        if (!visited(i) && dist(i) < minDist) {
          minDist = dist(i)
          u = i
        }
      }
      if (u == -1) return dist
      visited(u) = true

      for ((v, w) <- adjList.getOrElse(u, List.empty)) {
        if (!visited(v) && dist(u) + w < dist(v)) {
          dist(v) = dist(u) + w
        }
      }
    }
    dist
  }

  def main(args: Array[String]): Unit = {
    val edges = List(Edge(0,1,1), Edge(1,2,2), Edge(2,3,3), Edge(0,3,10))
    johnson(4, edges) match {
      case Some(result) =>
        for ((u, distances) <- result.toList.sortBy(_._1))
          println(s"From $u: $distances")
      case None => println("Negative cycle detected")
    }
  }
}
