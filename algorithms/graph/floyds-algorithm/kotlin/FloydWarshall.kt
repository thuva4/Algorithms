/**
 * Floyd-Warshall algorithm to find shortest paths between all pairs of vertices.
 * Input: distance matrix (2D array).
 * Returns the shortest distance matrix.
 */
fun floydWarshall(matrix: Array<DoubleArray>): Array<DoubleArray> {
    val n = matrix.size
    val dist = Array(n) { i -> matrix[i].copyOf() }

    for (k in 0 until n) {
        for (i in 0 until n) {
            for (j in 0 until n) {
                if (dist[i][k] != Double.POSITIVE_INFINITY &&
                    dist[k][j] != Double.POSITIVE_INFINITY &&
                    dist[i][k] + dist[k][j] < dist[i][j]
                ) {
                    dist[i][j] = dist[i][k] + dist[k][j]
                }
            }
        }
    }

    return dist
}

fun main() {
    val inf = Double.POSITIVE_INFINITY
    val matrix = arrayOf(
        doubleArrayOf(0.0, 3.0, inf, 7.0),
        doubleArrayOf(8.0, 0.0, 2.0, inf),
        doubleArrayOf(5.0, inf, 0.0, 1.0),
        doubleArrayOf(2.0, inf, inf, 0.0)
    )

    val result = floydWarshall(matrix)

    println("Shortest distance matrix:")
    for (row in result) {
        println(row.joinToString("\t") { if (it == inf) "INF" else it.toInt().toString() })
    }
}
