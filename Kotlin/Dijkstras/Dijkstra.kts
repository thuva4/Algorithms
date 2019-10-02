typealias DistanceMatrix = Array<IntArray>

/*
 * Dijkstra's single source shortest path algorithm for a graph using adjacency matrix representation
 */
fun dijkstra(distanceMatrix: DistanceMatrix, origin: Int) : IntArray {
    val n = distanceMatrix.size // size of the array representing the n x n matrix
    val shortestDistanceFromOrigin = IntArray(n) { Int.MAX_VALUE } // result array
    val visited = BooleanArray(n) // already visited vertices (initialized to false)

    shortestDistanceFromOrigin[origin] = 0

    // find vertex with shortest distance from origin not already visited
    // otherwise return null
    fun minDistanceVertexNotVisited() : Int? {
        var minDistance = Int.MAX_VALUE
        var minIndex = n
        for (i in 0 until n) {
            val currentDistance = shortestDistanceFromOrigin[i]
            if (!visited[i] && currentDistance != Int.MAX_VALUE && currentDistance < minDistance) {
                minDistance = currentDistance
                minIndex = i
            }
        }
        return minIndex.takeIf { it < n }
    }

    // Find shortest path for all vertices
    for (count in 0 until n - 1) {
        val u = minDistanceVertexNotVisited() ?: break
        visited[u] = true // set u as visited

        // update adjacent vertex labels
        for (v in 0 until n) {
            if (!visited[v] && // ignore already visited nodes
                    distanceMatrix[u][v] != 0 && // there is an arc (u,v)
                    // new distance is smaller than the current value
                    shortestDistanceFromOrigin[u] + distanceMatrix[u][v] < shortestDistanceFromOrigin[v])
                shortestDistanceFromOrigin[v] = shortestDistanceFromOrigin[u] + distanceMatrix[u][v]
        }
    }

    return shortestDistanceFromOrigin
}

fun main() {
    // Distance matrix for the graph from the C++ example
    val distanceMatrix: DistanceMatrix = arrayOf(
            intArrayOf(0, 4,  0, 0,  0,  0,  0, 8,  0),
            intArrayOf(4, 0,  8, 0,  0,  0,  0, 11, 0),
            intArrayOf(0, 8,  0, 7,  0,  4,  0, 0,  2),
            intArrayOf(0, 0,  7, 0,  9,  14, 0, 0,  0),
            intArrayOf(0, 0,  0, 9,  0,  10, 0, 0,  0),
            intArrayOf(0, 0,  4, 14, 10, 0,  2, 0,  0),
            intArrayOf(0, 0,  0, 0,  0,  2,  0, 1,  6),
            intArrayOf(8, 11, 0, 0,  0,  0,  1, 0,  7),
            intArrayOf(0, 0,  2, 0,  0,  0,  6, 7,  0)
    )

    // calculate shortest distances from 0 to all vertices
    val shortestDistances = dijkstra(distanceMatrix, origin = 0)

    println(shortestDistances.toList())
}
