fun longestPalindromicSubsequence(arr: IntArray): Int {
    val n = arr.size
    if (n == 0) return 0
    val dp = Array(n) { IntArray(n) }
    for (i in 0 until n) dp[i][i] = 1
    for (len in 2..n) {
        for (i in 0..n - len) {
            val j = i + len - 1
            if (arr[i] == arr[j]) dp[i][j] = if (len == 2) 2 else dp[i + 1][j - 1] + 2
            else dp[i][j] = maxOf(dp[i + 1][j], dp[i][j - 1])
        }
    }
    return dp[0][n - 1]
}
