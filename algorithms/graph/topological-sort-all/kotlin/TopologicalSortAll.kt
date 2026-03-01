fun topologicalSortAll(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    val inDeg = IntArray(n)
    for (i in 0 until m) {
        val u = arr[2 + 2 * i]; val v = arr[2 + 2 * i + 1]
        adj[u].add(v); inDeg[v]++
    }
    val visited = BooleanArray(n)
    var count = 0

    fun backtrack(placed: Int) {
        if (placed == n) { count++; return }
        for (v in 0 until n) {
            if (!visited[v] && inDeg[v] == 0) {
                visited[v] = true
                for (w in adj[v]) inDeg[w]--
                backtrack(placed + 1)
                visited[v] = false
                for (w in adj[v]) inDeg[w]++
            }
        }
    }

    backtrack(0)
    return count
}
