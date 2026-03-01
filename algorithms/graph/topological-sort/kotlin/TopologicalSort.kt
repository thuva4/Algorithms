import java.util.PriorityQueue

/**
 * Topological sort of a directed acyclic graph.
 * Returns the lexicographically smallest valid order to keep tests deterministic.
 */
fun topologicalSort(adjList: Map<Int, List<Int>>): List<Int> {
    val nodeCount = adjList.size
    val inDegree = IntArray(nodeCount)

    for (neighbors in adjList.values) {
        for (neighbor in neighbors) {
            if (neighbor in 0 until nodeCount) {
                inDegree[neighbor]++
            }
        }
    }

    val available = PriorityQueue<Int>()
    for (node in 0 until nodeCount) {
        if (inDegree[node] == 0) {
            available.add(node)
        }
    }

    val order = mutableListOf<Int>()
    while (available.isNotEmpty()) {
        val node = available.poll()
        order.add(node)

        for (neighbor in adjList[node] ?: emptyList()) {
            if (neighbor !in 0 until nodeCount) {
                continue
            }
            inDegree[neighbor]--
            if (inDegree[neighbor] == 0) {
                available.add(neighbor)
            }
        }
    }

    return order
}

fun main() {
    val adjList = mapOf(
        0 to listOf(1, 2),
        1 to listOf(3),
        2 to listOf(3),
        3 to emptyList()
    )

    val result = topologicalSort(adjList)
    println("Topological order: $result")
}
