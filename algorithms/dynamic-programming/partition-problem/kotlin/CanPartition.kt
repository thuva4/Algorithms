fun canPartition(arr: IntArray): Int {
    val total = arr.sum()
    if (total % 2 != 0) return 0
    val target = total / 2
    val dp = BooleanArray(target + 1)
    dp[0] = true
    for (num in arr) {
        for (j in target downTo num) {
            dp[j] = dp[j] || dp[j - num]
        }
    }
    return if (dp[target]) 1 else 0
}
