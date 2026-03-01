fun kosarajusScc(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    val radj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) {
        val u = arr[2 + 2 * i]
        val v = arr[2 + 2 * i + 1]
        adj[u].add(v)
        radj[v].add(u)
    }

    val visited = BooleanArray(n)
    val order = mutableListOf<Int>()

    fun dfs1(v: Int) {
        visited[v] = true
        for (w in adj[v]) {
            if (!visited[w]) dfs1(w)
        }
        order.add(v)
    }

    for (v in 0 until n) {
        if (!visited[v]) dfs1(v)
    }

    visited.fill(false)
    var sccCount = 0

    fun dfs2(v: Int) {
        visited[v] = true
        for (w in radj[v]) {
            if (!visited[w]) dfs2(w)
        }
    }

    for (i in order.indices.reversed()) {
        val v = order[i]
        if (!visited[v]) {
            dfs2(v)
            sccCount++
        }
    }

    return sccCount
}
