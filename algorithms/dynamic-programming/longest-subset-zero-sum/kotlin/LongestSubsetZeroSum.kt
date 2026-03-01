fun longestSubsetZeroSum(arr: IntArray): Int {
    var maxLen = 0
    val sumMap = mutableMapOf(0 to -1)
    var sum = 0

    for (i in arr.indices) {
        sum += arr[i]
        if (sum in sumMap) {
            val length = i - sumMap[sum]!!
            maxLen = maxOf(maxLen, length)
        } else {
            sumMap[sum] = i
        }
    }

    return maxLen
}

fun main() {
    println(longestSubsetZeroSum(intArrayOf(1, 2, -3, 3))) // 3
}
