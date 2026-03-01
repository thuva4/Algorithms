fun graphCycleDetection(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) { adj[arr[2 + 2 * i]].add(arr[2 + 2 * i + 1]) }
    val color = IntArray(n)

    fun dfs(v: Int): Boolean {
        color[v] = 1
        for (w in adj[v]) {
            if (color[w] == 1) return true
            if (color[w] == 0 && dfs(w)) return true
        }
        color[v] = 2
        return false
    }

    for (v in 0 until n) {
        if (color[v] == 0 && dfs(v)) return 1
    }
    return 0
}
