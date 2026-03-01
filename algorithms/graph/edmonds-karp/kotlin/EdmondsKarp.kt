import java.util.LinkedList

/**
 * Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
 */
fun edmondsKarp(capacity: Array<IntArray>, source: Int, sink: Int): Int {
    if (source == sink) return 0

    val n = capacity.size
    val residual = Array(n) { capacity[it].copyOf() }
    var totalFlow = 0

    while (true) {
        // BFS to find augmenting path
        val parent = IntArray(n) { -1 }
        val visited = BooleanArray(n)
        val queue = LinkedList<Int>()
        queue.add(source)
        visited[source] = true

        while (queue.isNotEmpty() && !visited[sink]) {
            val u = queue.poll()
            for (v in 0 until n) {
                if (!visited[v] && residual[u][v] > 0) {
                    visited[v] = true
                    parent[v] = u
                    queue.add(v)
                }
            }
        }

        if (!visited[sink]) break

        // Find minimum capacity along path
        var pathFlow = Int.MAX_VALUE
        var v = sink
        while (v != source) {
            pathFlow = minOf(pathFlow, residual[parent[v]][v])
            v = parent[v]
        }

        // Update residual capacities
        v = sink
        while (v != source) {
            residual[parent[v]][v] -= pathFlow
            residual[v][parent[v]] += pathFlow
            v = parent[v]
        }

        totalFlow += pathFlow
    }

    return totalFlow
}

fun main() {
    val capacity = arrayOf(
        intArrayOf(0, 10, 10, 0, 0, 0),
        intArrayOf(0, 0, 2, 4, 8, 0),
        intArrayOf(0, 0, 0, 0, 9, 0),
        intArrayOf(0, 0, 0, 0, 0, 10),
        intArrayOf(0, 0, 0, 6, 0, 10),
        intArrayOf(0, 0, 0, 0, 0, 0)
    )

    val result = edmondsKarp(capacity, 0, 5)
    println("Maximum flow: $result")
}
