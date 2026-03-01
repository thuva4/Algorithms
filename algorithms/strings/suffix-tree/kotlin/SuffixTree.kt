fun suffixTree(arr: IntArray): Int {
    val n = arr.size
    if (n == 0) return 0
    val sa = Array(n) { it }
    var rank = arr.clone()
    val tmp = IntArray(n)
    var k = 1
    while (k < n) {
        val r = rank.clone(); val step = k
        sa.sortWith(Comparator { a, b ->
            if (r[a] != r[b]) return@Comparator r[a] - r[b]
            val ra = if (a + step < n) r[a + step] else -1
            val rb = if (b + step < n) r[b + step] else -1
            ra - rb
        })
        tmp[sa[0]] = 0
        for (i in 1 until n) {
            tmp[sa[i]] = tmp[sa[i - 1]]
            val p0 = r[sa[i-1]]; val c0 = r[sa[i]]
            val p1 = if (sa[i-1]+step<n) r[sa[i-1]+step] else -1
            val c1 = if (sa[i]+step<n) r[sa[i]+step] else -1
            if (p0 != c0 || p1 != c1) tmp[sa[i]]++
        }
        rank = tmp.clone()
        if (rank[sa[n-1]] == n-1) break
        k *= 2
    }
    val invSa = IntArray(n)
    val lcp = IntArray(n)
    for (i in 0 until n) invSa[sa[i]] = i
    var h = 0
    for (i in 0 until n) {
        if (invSa[i] > 0) {
            val j = sa[invSa[i]-1]
            while (i+h < n && j+h < n && arr[i+h] == arr[j+h]) h++
            lcp[invSa[i]] = h
            if (h > 0) h--
        } else { h = 0 }
    }
    return n * (n + 1) / 2 - lcp.sum()
}
