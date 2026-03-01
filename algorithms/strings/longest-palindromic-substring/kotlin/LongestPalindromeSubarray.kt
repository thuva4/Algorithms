fun longestPalindromeSubarray(arr: IntArray): Int {
    val n = arr.size
    if (n == 0) return 0

    fun expand(l: Int, r: Int): Int {
        var left = l
        var right = r
        while (left >= 0 && right < n && arr[left] == arr[right]) {
            left--
            right++
        }
        return right - left - 1
    }

    var maxLen = 1
    for (i in 0 until n) {
        val odd = expand(i, i)
        val even = expand(i, i + 1)
        maxLen = maxOf(maxLen, odd, even)
    }
    return maxLen
}
