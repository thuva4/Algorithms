import java.util.PriorityQueue

fun pruferEncode(n: Int, edges: Array<IntArray>): IntArray {
    if (n <= 2) {
        return intArrayOf()
    }

    val adjacency = Array(n) { mutableListOf<Int>() }
    val degree = IntArray(n)

    for (edge in edges) {
        if (edge.size >= 2) {
            val u = edge[0]
            val v = edge[1]
            adjacency[u].add(v)
            adjacency[v].add(u)
            degree[u]++
            degree[v]++
        }
    }

    val leaves = PriorityQueue<Int>()
    for (node in 0 until n) {
        if (degree[node] == 1) {
            leaves.add(node)
        }
    }

    val result = IntArray(n - 2)
    for (index in 0 until n - 2) {
        val leaf = leaves.poll()
        val neighbor = adjacency[leaf].first { degree[it] > 0 }
        result[index] = neighbor
        degree[leaf]--
        degree[neighbor]--
        if (degree[neighbor] == 1) {
            leaves.add(neighbor)
        }
    }

    return result
}
