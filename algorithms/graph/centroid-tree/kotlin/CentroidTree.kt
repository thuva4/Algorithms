package algorithms.graph.centroidtree

import kotlin.math.max

class CentroidTree {
    private lateinit var adj: Array<ArrayList<Int>>
    private lateinit var sz: IntArray
    private lateinit var removed: BooleanArray
    private var maxDepth = 0

    fun solve(arr: IntArray): Int {
        if (arr.size < 1) return 0
        val n = arr[0]

        if (n <= 1) return 0
        if (arr.size < 1 + 2 * (n - 1)) return 0

        adj = Array(n) { ArrayList<Int>() }
        for (i in 0 until n - 1) {
            val u = arr[1 + 2 * i]
            val v = arr[1 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(v)
                adj[v].add(u)
            }
        }

        sz = IntArray(n)
        removed = BooleanArray(n)
        maxDepth = 0

        decompose(0, 0)

        return maxDepth
    }

    private fun getSize(u: Int, p: Int) {
        sz[u] = 1
        for (v in adj[u]) {
            if (v != p && !removed[v]) {
                getSize(v, u)
                sz[u] += sz[v]
            }
        }
    }

    private fun getCentroid(u: Int, p: Int, total: Int): Int {
        for (v in adj[u]) {
            if (v != p && !removed[v] && sz[v] > total / 2) {
                return getCentroid(v, u, total)
            }
        }
        return u
    }

    private fun decompose(u: Int, depth: Int) {
        getSize(u, -1)
        val total = sz[u]
        val centroid = getCentroid(u, -1, total)

        maxDepth = max(maxDepth, depth)

        removed[centroid] = true

        for (v in adj[centroid]) {
            if (!removed[v]) {
                decompose(v, depth + 1)
            }
        }
    }
}
