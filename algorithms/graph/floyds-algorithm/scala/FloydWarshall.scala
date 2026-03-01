/**
 * Floyd-Warshall algorithm to find shortest paths between all pairs of vertices.
 * Input: distance matrix (2D array).
 * Returns the shortest distance matrix.
 */
object FloydWarshall {
  def floydWarshall(matrix: Array[Array[Double]]): Array[Array[Double]] = {
    val n = matrix.length
    val dist = matrix.map(_.clone())

    for (k <- 0 until n) {
      for (i <- 0 until n) {
        for (j <- 0 until n) {
          if (dist(i)(k) != Double.PositiveInfinity &&
              dist(k)(j) != Double.PositiveInfinity &&
              dist(i)(k) + dist(k)(j) < dist(i)(j)) {
            dist(i)(j) = dist(i)(k) + dist(k)(j)
          }
        }
      }
    }

    dist
  }

  def main(args: Array[String]): Unit = {
    val inf = Double.PositiveInfinity
    val matrix = Array(
      Array(0.0, 3.0, inf, 7.0),
      Array(8.0, 0.0, 2.0, inf),
      Array(5.0, inf, 0.0, 1.0),
      Array(2.0, inf, inf, 0.0)
    )

    val result = floydWarshall(matrix)

    println("Shortest distance matrix:")
    for (row <- result) {
      println(row.map(v => if (v == inf) "INF" else v.toInt.toString).mkString("\t"))
    }
  }
}
