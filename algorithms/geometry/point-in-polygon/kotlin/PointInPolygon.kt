fun pointInPolygon(arr: IntArray): Int {
    val px = arr[0].toDouble()
    val py = arr[1].toDouble()
    val n = arr[2]

    var inside = false
    var j = n - 1
    for (i in 0 until n) {
        val xi = arr[3 + 2 * i].toDouble()
        val yi = arr[3 + 2 * i + 1].toDouble()
        val xj = arr[3 + 2 * j].toDouble()
        val yj = arr[3 + 2 * j + 1].toDouble()

        if ((yi > py) != (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
            inside = !inside
        }
        j = i
    }

    return if (inside) 1 else 0
}
