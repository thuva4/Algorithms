/**
 * Longest path in a DAG using topological sort.
 */
fun longestPath(adjList: Map<Int, List<List<Int>>>, startNode: Int): Map<Int, Double> {
    val numNodes = adjList.size
    val visited = mutableSetOf<Int>()
    val topoOrder = mutableListOf<Int>()

    fun dfs(node: Int) {
        visited.add(node)
        for (edge in adjList[node] ?: emptyList()) {
            if (edge[0] !in visited) dfs(edge[0])
        }
        topoOrder.add(node)
    }

    for (i in 0 until numNodes) {
        if (i !in visited) dfs(i)
    }

    val dist = DoubleArray(numNodes) { Double.NEGATIVE_INFINITY }
    dist[startNode] = 0.0

    for (i in topoOrder.indices.reversed()) {
        val u = topoOrder[i]
        if (dist[u] != Double.NEGATIVE_INFINITY) {
            for (edge in adjList[u] ?: emptyList()) {
                val v = edge[0]
                val w = edge[1]
                if (dist[u] + w > dist[v]) {
                    dist[v] = dist[u] + w
                }
            }
        }
    }

    return (0 until numNodes).associate { it to dist[it] }
}

fun main() {
    val adjList = mapOf(
        0 to listOf(listOf(1, 3), listOf(2, 6)),
        1 to listOf(listOf(3, 4), listOf(2, 4)),
        2 to listOf(listOf(3, 2)),
        3 to emptyList()
    )

    val result = longestPath(adjList, 0)
    println("Longest distances: $result")
}
