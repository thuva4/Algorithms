fun rangeTree(data: IntArray): Int {
    val n = data[0]
    val points = data.sliceArray(1 until 1 + n).also { it.sort() }
    val lo = data[1 + n]; val hi = data[2 + n]
    val left = points.indexOfFirst { it >= lo }.let { if (it == -1) n else it }
    val right = points.indexOfLast { it <= hi }.let { if (it == -1) -1 else it }
    return if (right < left) 0 else right - left + 1
}

fun main() {
    println(rangeTree(intArrayOf(5, 1, 3, 5, 7, 9, 2, 6)))
    println(rangeTree(intArrayOf(4, 2, 4, 6, 8, 1, 10)))
    println(rangeTree(intArrayOf(3, 1, 2, 3, 10, 20)))
}
