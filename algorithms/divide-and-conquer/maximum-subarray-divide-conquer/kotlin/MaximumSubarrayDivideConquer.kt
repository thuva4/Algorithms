fun maxSubarrayDC(arr: IntArray): Long {
    fun helper(lo: Int, hi: Int): Long {
        if (lo == hi) return arr[lo].toLong()
        val mid = (lo + hi) / 2

        var leftSum = Long.MIN_VALUE; var s = 0L
        for (i in mid downTo lo) { s += arr[i]; if (s > leftSum) leftSum = s }
        var rightSum = Long.MIN_VALUE; s = 0
        for (i in mid + 1..hi) { s += arr[i]; if (s > rightSum) rightSum = s }

        val cross = leftSum + rightSum
        val leftMax = helper(lo, mid)
        val rightMax = helper(mid + 1, hi)
        return maxOf(leftMax, rightMax, cross)
    }
    return helper(0, arr.size - 1)
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    val n = input[0]
    val arr = IntArray(n) { input[it + 1] }
    println(maxSubarrayDC(arr))
}
