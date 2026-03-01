fun extGcd(a: Long, b: Long): Triple<Long, Long, Long> {
    if (a == 0L) return Triple(b, 0L, 1L)
    val (g, x1, y1) = extGcd(b % a, a)
    return Triple(g, y1 - (b / a) * x1, x1)
}

fun chineseRemainder(arr: IntArray): Int {
    val n = arr[0]
    var r = arr[1].toLong()
    var m = arr[2].toLong()

    for (i in 1 until n) {
        val r2 = arr[1 + 2 * i].toLong()
        val m2 = arr[2 + 2 * i].toLong()
        val (g, p, _) = extGcd(m, m2)
        val lcm = m / g * m2
        r = (r + m * ((r2 - r) / g) * p) % lcm
        if (r < 0) r += lcm
        m = lcm
    }

    return (r % m).toInt()
}
