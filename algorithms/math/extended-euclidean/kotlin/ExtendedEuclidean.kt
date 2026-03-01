fun extendedGcd(a: Int, b: Int): IntArray {
    if (a == b) {
        return intArrayOf(kotlin.math.abs(a), 1, 0)
    }
    if (b == 0) {
        return intArrayOf(kotlin.math.abs(a), if (a >= 0) 1 else -1, 0)
    }

    val next = extendedGcd(b, a % b)
    val gcd = next[0]
    val x = next[2]
    val y = next[1] - (a / b) * next[2]
    return intArrayOf(gcd, x, y)
}
