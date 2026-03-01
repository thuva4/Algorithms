fun computeLPS(pattern: String): IntArray {
    val m = pattern.length
    val lps = IntArray(m)
    var len = 0
    var i = 1

    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++
            lps[i] = len
            i++
        } else {
            if (len != 0) {
                len = lps[len - 1]
            } else {
                lps[i] = 0
                i++
            }
        }
    }
    return lps
}

fun kmpSearch(text: String, pattern: String): Int {
    val n = text.length
    val m = pattern.length

    if (m == 0) return 0

    val lps = computeLPS(pattern)

    var i = 0
    var j = 0
    while (i < n) {
        if (pattern[j] == text[i]) {
            i++
            j++
        }
        if (j == m) {
            return i - j
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1]
            } else {
                i++
            }
        }
    }
    return -1
}

fun main() {
    val text = "ABABDABACDABABCABAB"
    val pattern = "ABABCABAB"
    println("Pattern found at index: ${kmpSearch(text, pattern)}")
}
