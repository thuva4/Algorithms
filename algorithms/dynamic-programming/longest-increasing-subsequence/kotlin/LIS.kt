fun lis(arr: IntArray): Int {
    val n = arr.size
    if (n == 0) return 0

    val dp = IntArray(n) { 1 }
    var maxLen = 1

    for (i in 1 until n) {
        for (j in 0 until i) {
            if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1
            }
        }
        if (dp[i] > maxLen) maxLen = dp[i]
    }

    return maxLen
}

fun main() {
    println(lis(intArrayOf(10, 9, 2, 5, 3, 7, 101, 18))) // 4
}
