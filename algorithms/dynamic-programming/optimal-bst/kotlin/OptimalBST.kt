fun optimalBst(arr: IntArray): Int {
    val n = arr[0]
    val freq = IntArray(n) { arr[it + 1] }

    val cost = Array(n) { IntArray(n) }
    for (i in 0 until n) cost[i][i] = freq[i]

    for (len in 2..n) {
        for (i in 0..n - len) {
            val j = i + len - 1
            cost[i][j] = Int.MAX_VALUE
            val freqSum = (i..j).sumOf { freq[it] }

            for (r in i..j) {
                val left = if (r > i) cost[i][r - 1] else 0
                val right = if (r < j) cost[r + 1][j] else 0
                val c = left + right + freqSum
                if (c < cost[i][j]) cost[i][j] = c
            }
        }
    }

    return cost[0][n - 1]
}
