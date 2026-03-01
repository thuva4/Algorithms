fun max1dRangeSum(arr: IntArray): Int {
    var best = 0
    var current = 0

    for (value in arr) {
        current = maxOf(0, current + value)
        best = maxOf(best, current)
    }

    return best
}
