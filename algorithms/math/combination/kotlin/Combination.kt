fun nCr(n: Int, r: Int): Long {
    if (r < 0 || r > n) {
        return 0
    }
    val k = minOf(r, n - r)
    var result = 1L
    for (i in 1..k) {
        result = result * (n - k + i) / i
    }
    return result
}
