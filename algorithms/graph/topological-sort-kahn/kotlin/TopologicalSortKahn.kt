import java.util.LinkedList

fun topologicalSortKahn(arr: IntArray): IntArray {
    if (arr.size < 2) {
        return intArrayOf()
    }

    val numVertices = arr[0]
    val numEdges = arr[1]

    val adj = Array(numVertices) { mutableListOf<Int>() }
    val inDegree = IntArray(numVertices)

    for (i in 0 until numEdges) {
        val u = arr[2 + 2 * i]
        val v = arr[2 + 2 * i + 1]
        adj[u].add(v)
        inDegree[v]++
    }

    val queue = LinkedList<Int>()
    for (v in 0 until numVertices) {
        if (inDegree[v] == 0) {
            queue.add(v)
        }
    }

    val result = mutableListOf<Int>()
    while (queue.isNotEmpty()) {
        val u = queue.poll()
        result.add(u)
        for (v in adj[u]) {
            inDegree[v]--
            if (inDegree[v] == 0) {
                queue.add(v)
            }
        }
    }

    return if (result.size == numVertices) {
        result.toIntArray()
    } else {
        intArrayOf()
    }
}
