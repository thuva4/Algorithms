fun modExp(arr: IntArray): Int {
    var base = arr[0].toLong()
    var exp = arr[1].toLong()
    val mod = arr[2].toLong()
    if (mod == 1L) return 0
    var result = 1L
    base %= mod
    while (exp > 0) {
        if (exp % 2 == 1L) {
            result = (result * base) % mod
        }
        exp = exp shr 1
        base = (base * base) % mod
    }
    return result.toInt()
}
