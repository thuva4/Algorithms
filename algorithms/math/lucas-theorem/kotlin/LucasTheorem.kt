fun modPowLT(base: Long, exp: Long, mod: Long): Long {
    var b = base % mod; var e = exp; var result = 1L
    while (e > 0) {
        if (e and 1L == 1L) result = result * b % mod
        e = e shr 1; b = b * b % mod
    }
    return result
}

fun lucasTheorem(n: Long, k: Long, p: Int): Int {
    if (k > n) return 0
    val pp = p.toLong()
    val fact = LongArray(p)
    fact[0] = 1
    for (i in 1 until p) fact[i] = fact[i - 1] * i % pp

    var result = 1L; var nn = n; var kk = k
    while (nn > 0 || kk > 0) {
        val ni = (nn % pp).toInt(); val ki = (kk % pp).toInt()
        if (ki > ni) return 0
        val c = fact[ni] * modPowLT(fact[ki], pp - 2, pp) % pp * modPowLT(fact[ni - ki], pp - 2, pp) % pp
        result = result * c % pp
        nn /= pp; kk /= pp
    }
    return result.toInt()
}

fun main() {
    println(lucasTheorem(10, 3, 7))
    println(lucasTheorem(5, 2, 3))
    println(lucasTheorem(100, 50, 13))
}
