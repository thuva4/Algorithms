fun knuthOptimization(n: Int, freq: IntArray): Int {
    if (n == 0) return 0
    val dp = Array(n) { IntArray(n) }
    val opt = Array(n) { IntArray(n) }
    val prefix = IntArray(n + 1)
    for (i in 0 until n) prefix[i + 1] = prefix[i] + freq[i]

    for (i in 0 until n) {
        dp[i][i] = freq[i]
        opt[i][i] = i
    }

    for (len in 2..n) {
        for (i in 0..n - len) {
            val j = i + len - 1
            dp[i][j] = Int.MAX_VALUE
            val costSum = prefix[j + 1] - prefix[i]
            val lo = opt[i][j - 1]
            val hi = if (i + 1 <= j) opt[i + 1][j] else j
            for (k in lo..hi) {
                val left = if (k > i) dp[i][k - 1] else 0
                val right = if (k < j) dp[k + 1][j] else 0
                val v = left + right + costSum
                if (v < dp[i][j]) {
                    dp[i][j] = v
                    opt[i][j] = k
                }
            }
        }
    }
    return dp[0][n - 1]
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    val n = input[0]
    val freq = input.subList(1, 1 + n).toIntArray()
    println(knuthOptimization(n, freq))
}
