package algorithms.graph.bellmanford

class BellmanFord {
    private val INF = 1000000000

    fun solve(arr: IntArray): IntArray {
        if (arr.size < 2) return IntArray(0)

        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 3 * m + 1) return IntArray(0)

        val start = arr[2 + 3 * m]

        if (start < 0 || start >= n) return IntArray(0)

        val dist = IntArray(n) { INF }
        dist[start] = 0

        for (i in 0 until n - 1) {
            for (j in 0 until m) {
                val u = arr[2 + 3 * j]
                val v = arr[2 + 3 * j + 1]
                val w = arr[2 + 3 * j + 2]

                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w
                }
            }
        }

        for (j in 0 until m) {
            val u = arr[2 + 3 * j]
            val v = arr[2 + 3 * j + 1]
            val w = arr[2 + 3 * j + 2]

            if (dist[u] != INF && dist[u] + w < dist[v]) {
                return IntArray(0) // Negative cycle
            }
        }

        return dist
    }
}
