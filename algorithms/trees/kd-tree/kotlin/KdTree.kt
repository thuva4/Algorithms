fun kdTree(data: IntArray): Int {
    val n = data[0]
    val qx = data[1 + 2 * n]; val qy = data[2 + 2 * n]
    var best = Int.MAX_VALUE
    var idx = 1
    for (i in 0 until n) {
        val dx = data[idx] - qx; val dy = data[idx + 1] - qy
        val d = dx * dx + dy * dy
        if (d < best) best = d
        idx += 2
    }
    return best
}

fun main() {
    println(kdTree(intArrayOf(3, 1, 2, 3, 4, 5, 6, 3, 3)))
    println(kdTree(intArrayOf(2, 0, 0, 5, 5, 0, 0)))
    println(kdTree(intArrayOf(1, 3, 4, 0, 0)))
}
