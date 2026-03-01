fun countBridges(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) {
        val u = arr[2 + 2 * i]
        val v = arr[2 + 2 * i + 1]
        adj[u].add(v)
        adj[v].add(u)
    }

    val disc = IntArray(n) { -1 }
    val low = IntArray(n)
    val parent = IntArray(n) { -1 }
    var timer = 0
    var bridgeCount = 0

    fun dfs(u: Int) {
        disc[u] = timer
        low[u] = timer
        timer++

        for (v in adj[u]) {
            if (disc[v] == -1) {
                parent[v] = u
                dfs(v)
                low[u] = minOf(low[u], low[v])
                if (low[v] > disc[u]) bridgeCount++
            } else if (v != parent[u]) {
                low[u] = minOf(low[u], disc[v])
            }
        }
    }

    for (i in 0 until n) {
        if (disc[i] == -1) dfs(i)
    }

    return bridgeCount
}
