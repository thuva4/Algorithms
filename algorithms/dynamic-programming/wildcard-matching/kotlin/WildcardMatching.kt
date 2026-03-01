fun wildcardMatching(arr: IntArray): Int {
    var idx = 0
    val tlen = arr[idx++]
    val text = arr.sliceArray(idx until idx + tlen); idx += tlen
    val plen = arr[idx++]
    val pattern = arr.sliceArray(idx until idx + plen)

    val dp = Array(tlen + 1) { BooleanArray(plen + 1) }
    dp[0][0] = true
    for (j in 1..plen) if (pattern[j-1] == 0) dp[0][j] = dp[0][j-1]

    for (i in 1..tlen) for (j in 1..plen) {
        if (pattern[j-1] == 0) dp[i][j] = dp[i-1][j] || dp[i][j-1]
        else if (pattern[j-1] == -1 || pattern[j-1] == text[i-1]) dp[i][j] = dp[i-1][j-1]
    }
    return if (dp[tlen][plen]) 1 else 0
}

fun main() {
    println(wildcardMatching(intArrayOf(3, 1, 2, 3, 3, 1, 2, 3)))
    println(wildcardMatching(intArrayOf(3, 1, 2, 3, 1, 0)))
    println(wildcardMatching(intArrayOf(3, 1, 2, 3, 3, 1, -1, 3)))
    println(wildcardMatching(intArrayOf(2, 1, 2, 2, 3, 4)))
    println(wildcardMatching(intArrayOf(0, 1, 0)))
}
