fun palindromePartitioning(arr: IntArray): Int {
    val n = arr.size
    if (n <= 1) return 0

    val isPal = Array(n) { BooleanArray(n) }
    for (i in 0 until n) isPal[i][i] = true
    for (i in 0 until n - 1) isPal[i][i+1] = arr[i] == arr[i+1]
    for (len in 3..n)
        for (i in 0..n-len) {
            val j = i + len - 1
            isPal[i][j] = arr[i] == arr[j] && isPal[i+1][j-1]
        }

    val cuts = IntArray(n)
    for (i in 0 until n) {
        if (isPal[0][i]) { cuts[i] = 0; continue }
        cuts[i] = i
        for (j in 1..i)
            if (isPal[j][i] && cuts[j-1] + 1 < cuts[i]) cuts[i] = cuts[j-1] + 1
    }
    return cuts[n-1]
}

fun main() {
    println(palindromePartitioning(intArrayOf(1, 2, 1)))
    println(palindromePartitioning(intArrayOf(1, 2, 3, 2)))
    println(palindromePartitioning(intArrayOf(1, 2, 3)))
    println(palindromePartitioning(intArrayOf(5)))
}
