fun convexHullCount(arr: IntArray): Int {
    val n = arr[0]
    if (n <= 2) return n

    data class Pt(val x: Int, val y: Int) : Comparable<Pt> {
        override fun compareTo(other: Pt) = if (x != other.x) x - other.x else y - other.y
    }

    fun cross(o: Pt, a: Pt, b: Pt): Long =
        (a.x - o.x).toLong() * (b.y - o.y) - (a.y - o.y).toLong() * (b.x - o.x)

    val points = mutableListOf<Pt>()
    var idx = 1
    for (i in 0 until n) { points.add(Pt(arr[idx], arr[idx + 1])); idx += 2 }
    points.sort()

    val hull = mutableListOf<Pt>()
    for (p in points) {
        while (hull.size >= 2 && cross(hull[hull.size - 2], hull[hull.size - 1], p) <= 0) hull.removeAt(hull.size - 1)
        hull.add(p)
    }
    val lower = hull.size + 1
    for (i in n - 2 downTo 0) {
        while (hull.size >= lower && cross(hull[hull.size - 2], hull[hull.size - 1], points[i]) <= 0) hull.removeAt(hull.size - 1)
        hull.add(points[i])
    }
    return hull.size - 1
}
