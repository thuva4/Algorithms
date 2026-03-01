fun coinChange(coins: IntArray, amount: Int): Int {
    if (amount == 0) return 0

    val dp = IntArray(amount + 1) { Int.MAX_VALUE }
    dp[0] = 0

    for (i in 1..amount) {
        for (coin in coins) {
            if (coin <= i && dp[i - coin] != Int.MAX_VALUE) {
                dp[i] = minOf(dp[i], dp[i - coin] + 1)
            }
        }
    }

    return if (dp[amount] == Int.MAX_VALUE) -1 else dp[amount]
}

fun main() {
    println(coinChange(intArrayOf(1, 5, 10, 25), 30)) // 2
}
