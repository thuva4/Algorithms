fun closestPair(arr: IntArray): Int {
    val n = arr.size / 2
    data class Point(val x: Int, val y: Int)

    val points = Array(n) { Point(arr[2 * it], arr[2 * it + 1]) }
    points.sortWith(compareBy({ it.x }, { it.y }))

    fun distSq(a: Point, b: Point): Int =
        (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)

    fun solve(l: Int, r: Int): Int {
        if (r - l < 3) {
            var mn = Int.MAX_VALUE
            for (i in l..r) {
                for (j in (i + 1)..r) {
                    mn = minOf(mn, distSq(points[i], points[j]))
                }
            }
            return mn
        }

        val mid = (l + r) / 2
        val midX = points[mid].x

        val dl = solve(l, mid)
        val dr = solve(mid + 1, r)
        var d = minOf(dl, dr)

        val strip = mutableListOf<Point>()
        for (i in l..r) {
            if ((points[i].x - midX) * (points[i].x - midX) < d) {
                strip.add(points[i])
            }
        }
        strip.sortBy { it.y }

        for (i in strip.indices) {
            var j = i + 1
            while (j < strip.size && (strip[j].y - strip[i].y) * (strip[j].y - strip[i].y) < d) {
                d = minOf(d, distSq(strip[i], strip[j]))
                j++
            }
        }

        return d
    }

    return solve(0, n - 1)
}
