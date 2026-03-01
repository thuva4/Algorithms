fun hamiltonianPath(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    if (n <= 1) return 1
    val adj = Array(n) { BooleanArray(n) }
    for (i in 0 until m) {
        val u = arr[2+2*i]; val v = arr[3+2*i]
        adj[u][v] = true; adj[v][u] = true
    }
    val full = (1 shl n) - 1
    val dp = Array(1 shl n) { BooleanArray(n) }
    for (i in 0 until n) dp[1 shl i][i] = true
    for (mask in 1..full) for (i in 0 until n) {
        if (!dp[mask][i]) continue
        for (j in 0 until n) if (mask and (1 shl j) == 0 && adj[i][j])
            dp[mask or (1 shl j)][j] = true
    }
    for (i in 0 until n) if (dp[full][i]) return 1
    return 0
}
