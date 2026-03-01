fun knapsack(weights: IntArray, values: IntArray, capacity: Int): Int {
    val n = weights.size
    val dp = Array(n + 1) { IntArray(capacity + 1) }

    for (i in 1..n) {
        for (w in 0..capacity) {
            if (weights[i - 1] > w) {
                dp[i][w] = dp[i - 1][w]
            } else {
                dp[i][w] = maxOf(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
            }
        }
    }

    return dp[n][capacity]
}

fun main() {
    val weights = intArrayOf(1, 3, 4, 5)
    val values = intArrayOf(1, 4, 5, 7)
    val capacity = 7
    println(knapsack(weights, values, capacity)) // 9
}
