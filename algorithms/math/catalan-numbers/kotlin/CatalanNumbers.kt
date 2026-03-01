fun catalanNumbers(n: Int): Int {
    val MOD = 1000000007L

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

    fun modInv(a: Long, mod: Long): Long = modPow(a, mod - 2, mod)

    var result = 1L
    for (i in 1..n) {
        result = result * (2L * (2 * i - 1)) % MOD
        result = result * modInv((i + 1).toLong(), MOD) % MOD
    }

    return result.toInt()
}
