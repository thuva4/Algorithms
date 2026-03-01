fun robinKarpRollingHash(arr: IntArray): Int {
    var idx = 0
    val tlen = arr[idx++]
    val text = arr.sliceArray(idx until idx + tlen); idx += tlen
    val plen = arr[idx++]
    val pattern = arr.sliceArray(idx until idx + plen)
    if (plen > tlen) return -1

    val BASE = 31L; val MOD = 1000000007L
    var pHash = 0L; var tHash = 0L; var power = 1L
    for (i in 0 until plen) {
        pHash = (pHash + (pattern[i]+1) * power) % MOD
        tHash = (tHash + (text[i]+1) * power) % MOD
        if (i < plen - 1) power = power * BASE % MOD
    }

    fun modpow(b: Long, e: Long, m: Long): Long {
        var r = 1L; var base = b % m; var exp = e
        while (exp > 0) { if (exp and 1L == 1L) r = r * base % m; exp = exp shr 1; base = base * base % m }
        return r
    }
    val invBase = modpow(BASE, MOD - 2, MOD)

    for (i in 0..tlen - plen) {
        if (tHash == pHash) {
            var match = true
            for (j in 0 until plen) if (text[i+j] != pattern[j]) { match = false; break }
            if (match) return i
        }
        if (i < tlen - plen) {
            tHash = ((tHash - (text[i]+1)) % MOD + MOD) % MOD
            tHash = tHash * invBase % MOD
            tHash = (tHash + (text[i + plen] + 1).toLong() * power) % MOD
        }
    }
    return -1
}

fun main() {
    println(robinKarpRollingHash(intArrayOf(5, 1, 2, 3, 4, 5, 2, 1, 2)))
    println(robinKarpRollingHash(intArrayOf(5, 1, 2, 3, 4, 5, 2, 3, 4)))
    println(robinKarpRollingHash(intArrayOf(4, 1, 2, 3, 4, 2, 5, 6)))
    println(robinKarpRollingHash(intArrayOf(4, 1, 2, 3, 4, 1, 4)))
}
