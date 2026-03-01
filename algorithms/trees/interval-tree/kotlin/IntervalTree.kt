fun intervalTree(data: IntArray): Int {
    val n = data[0]
    val query = data[2 * n + 1]
    var count = 0
    var idx = 1
    for (i in 0 until n) {
        val lo = data[idx]; val hi = data[idx + 1]
        idx += 2
        if (lo <= query && query <= hi) count++
    }
    return count
}

fun main() {
    println(intervalTree(intArrayOf(3, 1, 5, 3, 8, 6, 10, 4)))
    println(intervalTree(intArrayOf(2, 1, 3, 5, 7, 10)))
    println(intervalTree(intArrayOf(3, 1, 10, 2, 9, 3, 8, 5)))
}
