fun travellingSalesman(arr: IntArray): Int {
    val n = arr[0]
    if (n <= 1) return 0
    val dist = Array(n) { i -> IntArray(n) { j -> arr[1 + i * n + j] } }
    val INF = Int.MAX_VALUE / 2
    val full = (1 shl n) - 1
    val dp = Array(1 shl n) { IntArray(n) { INF } }
    dp[1][0] = 0
    for (mask in 1..full) for (i in 0 until n) {
        if (dp[mask][i] >= INF || mask and (1 shl i) == 0) continue
        for (j in 0 until n) {
            if (mask and (1 shl j) != 0) continue
            val nm = mask or (1 shl j)
            val cost = dp[mask][i] + dist[i][j]
            if (cost < dp[nm][j]) dp[nm][j] = cost
        }
    }
    var result = INF
    for (i in 0 until n) result = minOf(result, dp[full][i] + dist[i][0])
    return result
}
