/**
 * Find the length of the longest contiguous subarray common to both arrays.
 *
 * @param arr1 first array of integers
 * @param arr2 second array of integers
 * @return length of the longest common contiguous subarray
 */
fun longestCommonSubstring(arr1: IntArray, arr2: IntArray): Int {
    val n = arr1.size
    val m = arr2.size
    var maxLen = 0

    val dp = Array(n + 1) { IntArray(m + 1) }

    for (i in 1..n) {
        for (j in 1..m) {
            if (arr1[i - 1] == arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1
                if (dp[i][j] > maxLen) {
                    maxLen = dp[i][j]
                }
            } else {
                dp[i][j] = 0
            }
        }
    }

    return maxLen
}

fun main() {
    println(longestCommonSubstring(intArrayOf(1, 2, 3, 4, 5), intArrayOf(3, 4, 5, 6, 7)))  // 3
    println(longestCommonSubstring(intArrayOf(1, 2, 3), intArrayOf(4, 5, 6)))                // 0
    println(longestCommonSubstring(intArrayOf(1, 2, 3, 4), intArrayOf(1, 2, 3, 4)))          // 4
    println(longestCommonSubstring(intArrayOf(1), intArrayOf(1)))                             // 1
    println(longestCommonSubstring(intArrayOf(1, 2, 3, 2, 1), intArrayOf(3, 2, 1, 4, 7)))   // 3
}
