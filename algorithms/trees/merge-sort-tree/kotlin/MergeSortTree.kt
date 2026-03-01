class MergeSortTreeDS(arr: IntArray) {
    private val tree: Array<IntArray>
    private val n = arr.size

    init {
        tree = Array(4 * n) { IntArray(0) }
        build(arr, 1, 0, n - 1)
    }

    private fun build(a: IntArray, nd: Int, s: Int, e: Int) {
        if (s == e) { tree[nd] = intArrayOf(a[s]); return }
        val m = (s + e) / 2
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e)
        tree[nd] = mergeSorted(tree[2*nd], tree[2*nd+1])
    }

    private fun mergeSorted(a: IntArray, b: IntArray): IntArray {
        val r = IntArray(a.size + b.size)
        var i = 0; var j = 0; var k = 0
        while (i < a.size && j < b.size) { if (a[i] <= b[j]) { r[k++] = a[i++] } else { r[k++] = b[j++] } }
        while (i < a.size) r[k++] = a[i++]
        while (j < b.size) r[k++] = b[j++]
        return r
    }

    private fun upperBound(arr: IntArray, k: Int): Int {
        var lo = 0; var hi = arr.size
        while (lo < hi) { val m = (lo + hi) / 2; if (arr[m] <= k) lo = m + 1 else hi = m }
        return lo
    }

    fun countLeq(l: Int, r: Int, k: Int): Int = query(1, 0, n-1, l, r, k)

    private fun query(nd: Int, s: Int, e: Int, l: Int, r: Int, k: Int): Int {
        if (r < s || e < l) return 0
        if (l <= s && e <= r) return upperBound(tree[nd], k)
        val m = (s + e) / 2
        return query(2*nd, s, m, l, r, k) + query(2*nd+1, m+1, e, l, r, k)
    }
}

fun mergeSortTree(n: Int, arr: IntArray, queries: Array<IntArray>): IntArray {
    val tree = MergeSortTreeDS(arr.copyOf(n))
    return IntArray(queries.size) { index ->
        val query = queries[index]
        tree.countLeq(query[0], query[1], query[2])
    }
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val mst = MergeSortTreeDS(arr)
    val q = input[idx++]
    val results = mutableListOf<Int>()
    for (i in 0 until q) {
        val l = input[idx++]; val r = input[idx++]; val k = input[idx++]
        results.add(mst.countLeq(l, r, k))
    }
    println(results.joinToString(" "))
}
