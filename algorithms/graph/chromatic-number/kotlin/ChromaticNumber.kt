package algorithms.graph.chromaticnumber

class ChromaticNumber {
    fun solve(arr: IntArray): Int {
        if (arr.size < 2) return 0
        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m) return 0
        if (n == 0) return 0

        val adj = Array(n) { BooleanArray(n) }
        for (i in 0 until m) {
            val u = arr[2 + 2 * i]
            val v = arr[2 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u][v] = true
                adj[v][u] = true
            }
        }

        val color = IntArray(n)

        for (k in 1..n) {
            if (graphColoringUtil(0, n, k, color, adj)) {
                return k
            }
        }

        return n
    }

    private fun isSafe(u: Int, c: Int, n: Int, color: IntArray, adj: Array<BooleanArray>): Boolean {
        for (v in 0 until n) {
            if (adj[u][v] && color[v] == c) {
                return false
            }
        }
        return true
    }

    private fun graphColoringUtil(u: Int, n: Int, k: Int, color: IntArray, adj: Array<BooleanArray>): Boolean {
        if (u == n) return true

        for (c in 1..k) {
            if (isSafe(u, c, n, color, adj)) {
                color[u] = c
                if (graphColoringUtil(u + 1, n, k, color, adj)) {
                    return true
                }
                color[u] = 0
            }
        }
        return false
    }
}
