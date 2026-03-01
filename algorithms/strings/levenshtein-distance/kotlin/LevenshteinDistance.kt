/**
 * Compute the Levenshtein (edit) distance between two sequences.
 *
 * Input format: [len1, seq1..., len2, seq2...]
 * @param arr input array encoding two sequences
 * @return minimum number of single-element edits
 */
fun levenshteinDistance(arr: IntArray): Int {
    var idx = 0
    val len1 = arr[idx++]
    val seq1 = arr.sliceArray(idx until idx + len1); idx += len1
    val len2 = arr[idx++]
    val seq2 = arr.sliceArray(idx until idx + len2)

    val dp = Array(len1 + 1) { IntArray(len2 + 1) }

    for (i in 0..len1) dp[i][0] = i
    for (j in 0..len2) dp[0][j] = j

    for (i in 1..len1) {
        for (j in 1..len2) {
            if (seq1[i - 1] == seq2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1]
            } else {
                dp[i][j] = 1 + minOf(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
            }
        }
    }

    return dp[len1][len2]
}

fun main() {
    println(levenshteinDistance(intArrayOf(3, 1, 2, 3, 3, 1, 2, 4))) // 1
    println(levenshteinDistance(intArrayOf(2, 5, 6, 2, 5, 6)))       // 0
    println(levenshteinDistance(intArrayOf(2, 1, 2, 2, 3, 4)))       // 2
    println(levenshteinDistance(intArrayOf(0, 3, 1, 2, 3)))          // 3
}
