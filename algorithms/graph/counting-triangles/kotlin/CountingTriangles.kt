package algorithms.graph.countingtriangles

class CountingTriangles {
    fun solve(arr: IntArray): Int {
        if (arr.size < 2) return 0
        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m) return 0
        if (n < 3) return 0

        val adj = Array(n) { BooleanArray(n) }
        for (i in 0 until m) {
            val u = arr[2 + 2 * i]
            val v = arr[2 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u][v] = true
                adj[v][u] = true
            }
        }

        var count = 0
        for (i in 0 until n) {
            for (j in i + 1 until n) {
                if (adj[i][j]) {
                    for (k in j + 1 until n) {
                        if (adj[j][k] && adj[k][i]) {
                            count++
                        }
                    }
                }
            }
        }

        return count
    }
}
