package algorithms.graph.bridges

import kotlin.math.min

class Bridges {
    private lateinit var adj: Array<ArrayList<Int>>
    private lateinit var dfn: IntArray
    private lateinit var low: IntArray
    private var timer = 0
    private var bridgeCount = 0

    fun solve(arr: IntArray): Int {
        if (arr.size < 2) return 0
        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m) return 0

        adj = Array(n) { ArrayList<Int>() }
        for (i in 0 until m) {
            val u = arr[2 + 2 * i]
            val v = arr[2 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(v)
                adj[v].add(u)
            }
        }

        dfn = IntArray(n)
        low = IntArray(n)
        timer = 0
        bridgeCount = 0

        for (i in 0 until n) {
            if (dfn[i] == 0) dfs(i, -1)
        }

        return bridgeCount
    }

    private fun dfs(u: Int, p: Int) {
        timer++
        dfn[u] = timer
        low[u] = timer

        for (v in adj[u]) {
            if (v == p) continue
            if (dfn[v] != 0) {
                low[u] = min(low[u], dfn[v])
            } else {
                dfs(v, u)
                low[u] = min(low[u], low[v])
                if (low[v] > dfn[u]) {
                    bridgeCount++
                }
            }
        }
    }
}
