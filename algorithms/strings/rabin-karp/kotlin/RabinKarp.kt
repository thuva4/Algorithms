fun rabinKarpSearch(text: String, pattern: String): Int {
    val prime = 101L
    val base = 256L
    val n = text.length
    val m = pattern.length

    if (m == 0) return 0
    if (m > n) return -1

    var patHash = 0L
    var txtHash = 0L
    var h = 1L

    for (i in 0 until m - 1) {
        h = (h * base) % prime
    }

    for (i in 0 until m) {
        patHash = (base * patHash + pattern[i].code) % prime
        txtHash = (base * txtHash + text[i].code) % prime
    }

    for (i in 0..n - m) {
        if (patHash == txtHash) {
            var match = true
            for (j in 0 until m) {
                if (text[i + j] != pattern[j]) {
                    match = false
                    break
                }
            }
            if (match) return i
        }
        if (i < n - m) {
            txtHash = (base * (txtHash - text[i].code * h) + text[i + m].code) % prime
            if (txtHash < 0) txtHash += prime
        }
    }
    return -1
}

fun main() {
    val text = "ABABDABACDABABCABAB"
    val pattern = "ABABCABAB"
    println("Pattern found at index: ${rabinKarpSearch(text, pattern)}")
}
