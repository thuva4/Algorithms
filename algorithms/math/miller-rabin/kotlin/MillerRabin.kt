fun millerRabin(n: Int): Int {
    if (n < 2) return 0
    if (n < 4) return 1
    if (n % 2 == 0) return 0

    fun modPow(base: Long, exp: Long, mod: Long): Long {
        var result = 1L
        var b = base % mod
        var e = exp
        while (e > 0) {
            if (e % 2 == 1L) result = result * b % mod
            e /= 2
            b = b * b % mod
        }
        return result
    }

    var r = 0
    var d = (n - 1).toLong()
    while (d % 2 == 0L) { r++; d /= 2 }

    val witnesses = longArrayOf(2, 3, 5, 7)
    for (a in witnesses) {
        if (a >= n) continue

        var x = modPow(a, d, n.toLong())
        if (x == 1L || x == (n - 1).toLong()) continue

        var found = false
        for (i in 0 until r - 1) {
            x = modPow(x, 2, n.toLong())
            if (x == (n - 1).toLong()) { found = true; break }
        }

        if (!found) return 0
    }

    return 1
}
