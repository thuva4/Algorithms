fun intervalScheduling(arr: IntArray): Int {
    val n = arr[0]
    data class Interval(val start: Int, val end: Int)

    val intervals = Array(n) { Interval(arr[1 + 2 * it], arr[1 + 2 * it + 1]) }
    val sorted = intervals.sortedBy { it.end }

    var count = 0
    var lastEnd = -1
    for (iv in sorted) {
        if (iv.start >= lastEnd) {
            count++
            lastEnd = iv.end
        }
    }

    return count
}
