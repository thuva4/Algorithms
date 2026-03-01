/**
 * Johnson's algorithm for all-pairs shortest paths.
 * Combines Bellman-Ford with Dijkstra's algorithm.
 */
fun johnson(numVertices: Int, edges: List<List<Int>>): Any {
    // Add virtual node
    val allEdges = edges.toMutableList()
    for (i in 0 until numVertices) {
        allEdges.add(listOf(numVertices, i, 0))
    }

    // Bellman-Ford from virtual node
    val h = DoubleArray(numVertices + 1) { Double.POSITIVE_INFINITY }
    h[numVertices] = 0.0

    for (i in 0 until numVertices) {
        for (e in allEdges) {
            if (h[e[0]] != Double.POSITIVE_INFINITY && h[e[0]] + e[2] < h[e[1]]) {
                h[e[1]] = h[e[0]] + e[2]
            }
        }
    }

    for (e in allEdges) {
        if (h[e[0]] != Double.POSITIVE_INFINITY && h[e[0]] + e[2] < h[e[1]]) {
            return "negative_cycle"
        }
    }

    // Reweight edges
    val adjList = mutableMapOf<Int, MutableList<Pair<Int, Int>>>()
    for (i in 0 until numVertices) adjList[i] = mutableListOf()
    for (e in edges) {
        val newWeight = (e[2] + h[e[0]] - h[e[1]]).toInt()
        adjList[e[0]]!!.add(Pair(e[1], newWeight))
    }

    // Run Dijkstra from each vertex
    val result = mutableMapOf<Int, Map<Int, Double>>()
    for (u in 0 until numVertices) {
        val dist = dijkstraHelper(numVertices, adjList, u)
        val distances = mutableMapOf<Int, Double>()
        for (v in 0 until numVertices) {
            distances[v] = if (dist[v] == Double.POSITIVE_INFINITY) {
                Double.POSITIVE_INFINITY
            } else {
                dist[v] - h[u] + h[v]
            }
        }
        result[u] = distances
    }

    return result
}

private fun dijkstraHelper(n: Int, adjList: Map<Int, List<Pair<Int, Int>>>, src: Int): DoubleArray {
    val dist = DoubleArray(n) { Double.POSITIVE_INFINITY }
    val visited = BooleanArray(n)
    dist[src] = 0.0

    for (count in 0 until n) {
        var u = -1
        var minDist = Double.POSITIVE_INFINITY
        for (i in 0 until n) {
            if (!visited[i] && dist[i] < minDist) {
                minDist = dist[i]
                u = i
            }
        }
        if (u == -1) break
        visited[u] = true

        for ((v, w) in adjList[u] ?: emptyList()) {
            if (!visited[v] && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w
            }
        }
    }
    return dist
}

fun main() {
    val edges = listOf(
        listOf(0, 1, 1), listOf(1, 2, 2), listOf(2, 3, 3), listOf(0, 3, 10)
    )
    val result = johnson(4, edges)
    println("Result: $result")
}
