fun rodCut(prices: IntArray, n: Int): Int {
    val dp = IntArray(n + 1)

    for (i in 1..n) {
        for (j in 0 until i) {
            dp[i] = maxOf(dp[i], prices[j] + dp[i - j - 1])
        }
    }

    return dp[n]
}

fun main() {
    val prices = intArrayOf(1, 5, 8, 9, 10, 17, 17, 20)
    println(rodCut(prices, 8)) // 22
}
