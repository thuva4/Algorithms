fun boyerMooreSearch(arr: IntArray): Int {
    val textLen = arr[0]
    val patLen = arr[1 + textLen]

    if (patLen == 0) return 0
    if (patLen > textLen) return -1

    val text = arr.sliceArray(1 until 1 + textLen)
    val pattern = arr.sliceArray(2 + textLen until 2 + textLen + patLen)

    val badChar = mutableMapOf<Int, Int>()
    for (i in pattern.indices) {
        badChar[pattern[i]] = i
    }

    var s = 0
    while (s <= textLen - patLen) {
        var j = patLen - 1
        while (j >= 0 && pattern[j] == text[s + j]) j--
        if (j < 0) return s
        val bc = badChar.getOrDefault(text[s + j], -1)
        var shift = j - bc
        if (shift < 1) shift = 1
        s += shift
    }

    return -1
}
