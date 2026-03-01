package algorithms.graph.allpairsshortestpath

import kotlin.math.min

class AllPairsShortestPath {
    private val INF = 1000000000

    fun solve(arr: IntArray): Int {
        if (arr.size < 2) return -1

        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 3 * m) return -1
        if (n <= 0) return -1
        if (n == 1) return 0

        val dist = Array(n) { IntArray(n) { INF } }
        for (i in 0 until n) dist[i][i] = 0

        for (i in 0 until m) {
            val u = arr[2 + 3 * i]
            val v = arr[2 + 3 * i + 1]
            val w = arr[2 + 3 * i + 2]

            if (u in 0 until n && v in 0 until n) {
                dist[u][v] = min(dist[u][v], w)
            }
        }

        for (k in 0 until n) {
            for (i in 0 until n) {
                for (j in 0 until n) {
                    if (dist[i][k] != INF && dist[k][j] != INF) {
                        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                    }
                }
            }
        }

        return if (dist[0][n - 1] == INF) -1 else dist[0][n - 1]
    }
}
