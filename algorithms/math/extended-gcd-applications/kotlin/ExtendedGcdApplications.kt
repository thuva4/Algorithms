fun extGcd(a: Long, b: Long): Triple<Long, Long, Long> {
    if (a == 0L) return Triple(b, 0L, 1L)
    val (g, x1, y1) = extGcd(b % a, a)
    return Triple(g, y1 - (b / a) * x1, x1)
}

fun extendedGcdApplications(arr: IntArray): Int {
    val a = arr[0].toLong(); val m = arr[1].toLong()
    val (g, x, _) = extGcd(((a % m) + m) % m, m)
    if (g != 1L) return -1
    return (((x % m) + m) % m).toInt()
}

fun main() {
    println(extendedGcdApplications(intArrayOf(3, 7)))
    println(extendedGcdApplications(intArrayOf(1, 13)))
    println(extendedGcdApplications(intArrayOf(6, 9)))
    println(extendedGcdApplications(intArrayOf(2, 11)))
}
