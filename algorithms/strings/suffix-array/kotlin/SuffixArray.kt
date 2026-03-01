fun suffixArray(arr: IntArray): IntArray {
    val n = arr.size
    if (n == 0) return intArrayOf()
    val sa = Array(n) { it }
    var rank = arr.clone()
    val tmp = IntArray(n)
    var k = 1
    while (k < n) {
        val r = rank.clone()
        val step = k
        sa.sortWith(Comparator { a, b ->
            if (r[a] != r[b]) return@Comparator r[a] - r[b]
            val ra = if (a + step < n) r[a + step] else -1
            val rb = if (b + step < n) r[b + step] else -1
            ra - rb
        })
        tmp[sa[0]] = 0
        for (i in 1 until n) {
            tmp[sa[i]] = tmp[sa[i - 1]]
            val p0 = r[sa[i - 1]]; val c0 = r[sa[i]]
            val p1 = if (sa[i - 1] + step < n) r[sa[i - 1] + step] else -1
            val c1 = if (sa[i] + step < n) r[sa[i] + step] else -1
            if (p0 != c0 || p1 != c1) tmp[sa[i]]++
        }
        rank = tmp.clone()
        if (rank[sa[n - 1]] == n - 1) break
        k *= 2
    }
    return sa.map { it }.toIntArray()
}
