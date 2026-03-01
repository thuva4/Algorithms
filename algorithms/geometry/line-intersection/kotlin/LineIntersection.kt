fun lineIntersection(arr: IntArray): Int {
    val x1 = arr[0]; val y1 = arr[1]; val x2 = arr[2]; val y2 = arr[3]
    val x3 = arr[4]; val y3 = arr[5]; val x4 = arr[6]; val y4 = arr[7]

    fun orientation(px: Int, py: Int, qx: Int, qy: Int, rx: Int, ry: Int): Int {
        val v = (qy - py) * (rx - qx) - (qx - px) * (ry - qy)
        return when {
            v == 0 -> 0
            v > 0 -> 1
            else -> 2
        }
    }

    fun onSegment(px: Int, py: Int, qx: Int, qy: Int, rx: Int, ry: Int): Boolean {
        return qx <= maxOf(px, rx) && qx >= minOf(px, rx) &&
               qy <= maxOf(py, ry) && qy >= minOf(py, ry)
    }

    val o1 = orientation(x1, y1, x2, y2, x3, y3)
    val o2 = orientation(x1, y1, x2, y2, x4, y4)
    val o3 = orientation(x3, y3, x4, y4, x1, y1)
    val o4 = orientation(x3, y3, x4, y4, x2, y2)

    if (o1 != o2 && o3 != o4) return 1

    if (o1 == 0 && onSegment(x1, y1, x3, y3, x2, y2)) return 1
    if (o2 == 0 && onSegment(x1, y1, x4, y4, x2, y2)) return 1
    if (o3 == 0 && onSegment(x3, y3, x1, y1, x4, y4)) return 1
    if (o4 == 0 && onSegment(x3, y3, x2, y2, x4, y4)) return 1

    return 0
}
