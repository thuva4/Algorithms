import java.util.PriorityQueue

/**
 * Prim's algorithm to find the Minimum Spanning Tree (MST) total weight.
 * Input: number of vertices, weighted adjacency list where each entry is [neighbor, weight].
 */
fun prim(numVertices: Int, adjList: Map<Int, List<List<Int>>>): Int {
    val inMST = BooleanArray(numVertices)
    val key = IntArray(numVertices) { Int.MAX_VALUE }
    key[0] = 0

    // Priority queue: Pair(weight, vertex)
    val pq = PriorityQueue<Pair<Int, Int>>(compareBy { it.first })
    pq.add(Pair(0, 0))

    var totalWeight = 0

    while (pq.isNotEmpty()) {
        val (w, u) = pq.poll()
        if (inMST[u]) continue

        inMST[u] = true
        totalWeight += w

        for (edge in adjList[u] ?: emptyList()) {
            val v = edge[0]
            val weight = edge[1]
            if (!inMST[v] && weight < key[v]) {
                key[v] = weight
                pq.add(Pair(weight, v))
            }
        }
    }

    return totalWeight
}

fun main() {
    val adjList = mapOf(
        0 to listOf(listOf(1, 10), listOf(2, 6), listOf(3, 5)),
        1 to listOf(listOf(0, 10), listOf(3, 15)),
        2 to listOf(listOf(0, 6), listOf(3, 4)),
        3 to listOf(listOf(0, 5), listOf(1, 15), listOf(2, 4))
    )

    val result = prim(4, adjList)
    println("MST total weight: $result")
}
