class DisjointSparseTableDS(arr: IntArray) {
    private val table: Array<LongArray>
    private val a: LongArray
    private val sz: Int
    private val levels: Int

    init {
        val n = arr.size
        var s = 1; var lv = 0
        while (s < n) { s = s shl 1; lv++ }
        if (lv == 0) lv = 1
        sz = s; levels = lv
        a = LongArray(sz)
        for (i in 0 until n) a[i] = arr[i].toLong()
        table = Array(levels) { LongArray(sz) }
        build()
    }

    private fun build() {
        for (level in 0 until levels) {
            val block = 1 shl (level + 1)
            val half = block shr 1
            var start = 0
            while (start < sz) {
                val mid = start + half
                val end = minOf(start + block, sz)
                if (mid >= end) {
                    start += block
                    continue
                }
                table[level][mid] = a[mid]
                for (i in mid + 1 until end)
                    table[level][i] = table[level][i - 1] + a[i]
                if (mid - 1 >= start) {
                    table[level][mid - 1] = a[mid - 1]
                    for (i in mid - 2 downTo start)
                        table[level][i] = table[level][i + 1] + a[i]
                }
                start += block
            }
        }
    }

    fun query(l: Int, r: Int): Long {
        if (l == r) return a[l]
        val level = 31 - Integer.numberOfLeadingZeros(l xor r)
        return table[level][l] + table[level][r]
    }
}

fun disjointSparseTable(n: Int, arr: IntArray, queries: Array<IntArray>): LongArray {
    val table = DisjointSparseTableDS(arr.copyOf(n))
    return LongArray(queries.size) { index ->
        val query = queries[index]
        table.query(query[0], query[1])
    }
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val dst = DisjointSparseTableDS(arr)
    val q = input[idx++]
    val results = mutableListOf<Long>()
    for (i in 0 until q) {
        val l = input[idx++]; val r = input[idx++]
        results.add(dst.query(l, r))
    }
    println(results.joinToString(" "))
}
