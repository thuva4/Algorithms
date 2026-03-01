class SegmentTreeLazyDS(arr: IntArray) {
    private val n = arr.size
    private val tree = LongArray(4 * n)
    private val lazy = LongArray(4 * n)

    init { build(arr, 1, 0, n - 1) }

    private fun build(a: IntArray, nd: Int, s: Int, e: Int) {
        if (s == e) { tree[nd] = a[s].toLong(); return }
        val m = (s + e) / 2
        build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e)
        tree[nd] = tree[2*nd] + tree[2*nd+1]
    }

    private fun applyNode(nd: Int, s: Int, e: Int, v: Long) {
        tree[nd] += v * (e - s + 1); lazy[nd] += v
    }

    private fun pushDown(nd: Int, s: Int, e: Int) {
        if (lazy[nd] != 0L) {
            val m = (s + e) / 2
            applyNode(2*nd, s, m, lazy[nd]); applyNode(2*nd+1, m+1, e, lazy[nd])
            lazy[nd] = 0
        }
    }

    fun update(l: Int, r: Int, v: Long) = doUpdate(1, 0, n-1, l, r, v)

    private fun doUpdate(nd: Int, s: Int, e: Int, l: Int, r: Int, v: Long) {
        if (r < s || e < l) return
        if (l <= s && e <= r) { applyNode(nd, s, e, v); return }
        pushDown(nd, s, e)
        val m = (s + e) / 2
        doUpdate(2*nd, s, m, l, r, v); doUpdate(2*nd+1, m+1, e, l, r, v)
        tree[nd] = tree[2*nd] + tree[2*nd+1]
    }

    fun query(l: Int, r: Int): Long = doQuery(1, 0, n-1, l, r)

    private fun doQuery(nd: Int, s: Int, e: Int, l: Int, r: Int): Long {
        if (r < s || e < l) return 0
        if (l <= s && e <= r) return tree[nd]
        pushDown(nd, s, e)
        val m = (s + e) / 2
        return doQuery(2*nd, s, m, l, r) + doQuery(2*nd+1, m+1, e, l, r)
    }
}

fun segmentTreeLazy(n: Int, arr: IntArray, operations: Array<IntArray>): LongArray {
    val tree = SegmentTreeLazyDS(arr.copyOf(n))
    val results = mutableListOf<Long>()

    for (operation in operations) {
        if (operation.size < 4) {
            continue
        }
        if (operation[0] == 1) {
            tree.update(operation[1], operation[2], operation[3].toLong())
        } else {
            results.add(tree.query(operation[1], operation[2]))
        }
    }

    return results.toLongArray()
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val st = SegmentTreeLazyDS(arr)
    val q = input[idx++]
    val results = mutableListOf<Long>()
    for (i in 0 until q) {
        val t = input[idx++]; val l = input[idx++]; val r = input[idx++]; val v = input[idx++]
        if (t == 1) st.update(l, r, v.toLong())
        else results.add(st.query(l, r))
    }
    println(results.joinToString(" "))
}
