fun delaunayTriangulation(arr: IntArray): Int {
    val n = arr[0]
    if (n < 3) return 0

    val points = MutableList(n) { index ->
        intArrayOf(arr[1 + 2 * index], arr[1 + 2 * index + 1])
    }
    points.sortWith(compareBy<IntArray> { it[0] }.thenBy { it[1] })

    fun cross(a: IntArray, b: IntArray, c: IntArray): Long {
        return (b[0] - a[0]).toLong() * (c[1] - a[1]) - (b[1] - a[1]).toLong() * (c[0] - a[0])
    }

    val lower = mutableListOf<IntArray>()
    for (point in points) {
        while (lower.size >= 2 && cross(lower[lower.size - 2], lower[lower.size - 1], point) <= 0L) {
            lower.removeAt(lower.lastIndex)
        }
        lower.add(point)
    }

    val upper = mutableListOf<IntArray>()
    for (index in points.indices.reversed()) {
        val point = points[index]
        while (upper.size >= 2 && cross(upper[upper.size - 2], upper[upper.size - 1], point) <= 0L) {
            upper.removeAt(upper.lastIndex)
        }
        upper.add(point)
    }

    val hullSize = lower.size + upper.size - 2
    return 2 * n - 2 - hullSize
}
