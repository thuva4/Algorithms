fun convexHullJarvis(arr: IntArray): Int {
    val n = arr[0]
    if (n < 2) return n

    val px = IntArray(n) { arr[1 + 2 * it] }
    val py = IntArray(n) { arr[1 + 2 * it + 1] }

    fun cross(o: Int, a: Int, b: Int): Int =
        (px[a] - px[o]) * (py[b] - py[o]) - (py[a] - py[o]) * (px[b] - px[o])

    fun distSq(a: Int, b: Int): Int =
        (px[a] - px[b]) * (px[a] - px[b]) + (py[a] - py[b]) * (py[a] - py[b])

    var start = 0
    for (i in 1 until n) {
        if (px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]))
            start = i
    }

    var hullCount = 0
    var current = start
    do {
        hullCount++
        var candidate = 0
        for (i in 1 until n) {
            if (i == current) continue
            if (candidate == current) { candidate = i; continue }
            val c = cross(current, candidate, i)
            if (c < 0) candidate = i
            else if (c == 0 && distSq(current, i) > distSq(current, candidate))
                candidate = i
        }
        current = candidate
    } while (current != start)

    return hullCount
}
