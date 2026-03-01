fun longestPalindromeLength(arr: IntArray): Int {
    if (arr.isEmpty()) return 0

    val t = mutableListOf(-1)
    for (x in arr) {
        t.add(x)
        t.add(-1)
    }

    val n = t.size
    val p = IntArray(n)
    var c = 0
    var r = 0
    var maxLen = 0

    for (i in 0 until n) {
        val mirror = 2 * c - i
        if (i < r && mirror >= 0) {
            p[i] = minOf(r - i, p[mirror])
        }
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] == t[i - p[i] - 1]) {
            p[i]++
        }
        if (i + p[i] > r) { c = i; r = i + p[i] }
        if (p[i] > maxLen) maxLen = p[i]
    }

    return maxLen
}
