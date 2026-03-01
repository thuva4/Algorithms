fun bitmaskDp(n: Int, cost: Array<IntArray>): Int {
    val total = 1 shl n
    val dp = IntArray(total) { Int.MAX_VALUE }
    dp[0] = 0

    for (mask in 0 until total) {
        if (dp[mask] == Int.MAX_VALUE) continue
        val worker = Integer.bitCount(mask)
        if (worker >= n) continue
        for (job in 0 until n) {
            if (mask and (1 shl job) == 0) {
                val newMask = mask or (1 shl job)
                val newCost = dp[mask] + cost[worker][job]
                if (newCost < dp[newMask]) dp[newMask] = newCost
            }
        }
    }

    return dp[total - 1]
}

fun main() {
    val br = System.`in`.bufferedReader()
    val n = br.readLine().trim().toInt()
    val cost = Array(n) {
        br.readLine().trim().split(" ").map { it.toInt() }.toIntArray()
    }
    println(bitmaskDp(n, cost))
}
