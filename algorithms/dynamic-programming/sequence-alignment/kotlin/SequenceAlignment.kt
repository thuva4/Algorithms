const val GAP_COST = 4
const val MISMATCH_COST = 3

fun sequenceAlignment(s1: String, s2: String): Int {
    val m = s1.length
    val n = s2.length
    val dp = Array(m + 1) { IntArray(n + 1) }

    for (i in 0..m) dp[i][0] = i * GAP_COST
    for (j in 0..n) dp[0][j] = j * GAP_COST

    for (i in 1..m) {
        for (j in 1..n) {
            val matchCost = if (s1[i - 1] == s2[j - 1]) 0 else MISMATCH_COST
            dp[i][j] = minOf(
                dp[i - 1][j - 1] + matchCost,
                dp[i - 1][j] + GAP_COST,
                dp[i][j - 1] + GAP_COST
            )
        }
    }

    return dp[m][n]
}

fun main() {
    println(sequenceAlignment("GCCCTAGCG", "GCGCAATG")) // 18
}
