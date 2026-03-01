fun maximumBipartiteMatching(arr: IntArray): Int {
    val nLeft = arr[0]; val nRight = arr[1]; val m = arr[2]
    val adj = Array(nLeft) { mutableListOf<Int>() }
    for (i in 0 until m) adj[arr[3 + 2 * i]].add(arr[3 + 2 * i + 1])
    val matchRight = IntArray(nRight) { -1 }

    fun dfs(u: Int, visited: BooleanArray): Boolean {
        for (v in adj[u]) {
            if (!visited[v]) {
                visited[v] = true
                if (matchRight[v] == -1 || dfs(matchRight[v], visited)) {
                    matchRight[v] = u; return true
                }
            }
        }
        return false
    }

    var result = 0
    for (u in 0 until nLeft) {
        val visited = BooleanArray(nRight)
        if (dfs(u, visited)) result++
    }
    return result
}
