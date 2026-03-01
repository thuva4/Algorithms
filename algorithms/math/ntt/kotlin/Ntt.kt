const val NTT_MOD = 998244353L

fun nttModPow(base: Long, exp: Long, mod: Long): Long {
    var b = base % mod; var e = exp; var result = 1L
    while (e > 0) {
        if (e and 1L == 1L) result = result * b % mod
        e = e shr 1; b = b * b % mod
    }
    return result
}

fun ntt(data: IntArray): IntArray {
    var idx = 0
    val na = data[idx++]
    val a = LongArray(na) { ((data[idx++].toLong() % NTT_MOD) + NTT_MOD) % NTT_MOD }
    val nb = data[idx++]
    val b = LongArray(nb) { ((data[idx++].toLong() % NTT_MOD) + NTT_MOD) % NTT_MOD }

    val resultLen = na + nb - 1
    val result = LongArray(resultLen)
    for (i in 0 until na)
        for (j in 0 until nb)
            result[i + j] = (result[i + j] + a[i] * b[j]) % NTT_MOD
    return IntArray(resultLen) { result[it].toInt() }
}

fun main() {
    println(ntt(intArrayOf(2, 1, 2, 2, 3, 4)).toList())
    println(ntt(intArrayOf(2, 1, 1, 2, 1, 1)).toList())
}
