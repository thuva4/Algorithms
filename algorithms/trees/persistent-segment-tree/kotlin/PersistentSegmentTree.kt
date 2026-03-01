class PersistentSegmentTree {
    private val vals = mutableListOf<Long>()
    private val lefts = mutableListOf<Int>()
    private val rights = mutableListOf<Int>()

    fun newNode(v: Long, l: Int = 0, r: Int = 0): Int {
        val id = vals.size; vals.add(v); lefts.add(l); rights.add(r); return id
    }

    fun build(a: IntArray, s: Int, e: Int): Int {
        if (s == e) return newNode(a[s].toLong())
        val m = (s + e) / 2
        val l = build(a, s, m); val r = build(a, m + 1, e)
        return newNode(vals[l] + vals[r], l, r)
    }

    fun update(nd: Int, s: Int, e: Int, idx: Int, v: Int): Int {
        if (s == e) return newNode(v.toLong())
        val m = (s + e) / 2
        return if (idx <= m) {
            val nl = update(lefts[nd], s, m, idx, v)
            newNode(vals[nl] + vals[rights[nd]], nl, rights[nd])
        } else {
            val nr = update(rights[nd], m + 1, e, idx, v)
            newNode(vals[lefts[nd]] + vals[nr], lefts[nd], nr)
        }
    }

    fun query(nd: Int, s: Int, e: Int, l: Int, r: Int): Long {
        if (r < s || e < l) return 0
        if (l <= s && e <= r) return vals[nd]
        val m = (s + e) / 2
        return query(lefts[nd], s, m, l, r) + query(rights[nd], m + 1, e, l, r)
    }
}

fun persistentSegmentTree(n: Int, arr: IntArray, operations: Array<IntArray>): LongArray {
    val tree = PersistentSegmentTree()
    val roots = mutableListOf(tree.build(arr.copyOf(n), 0, n - 1))
    val results = mutableListOf<Long>()

    for (operation in operations) {
        if (operation.size < 4) {
            continue
        }
        if (operation[0] == 1) {
            roots.add(tree.update(roots[operation[1]], 0, n - 1, operation[2], operation[3]))
        } else {
            results.add(tree.query(roots[operation[1]], 0, n - 1, operation[2], operation[3]))
        }
    }

    return results.toLongArray()
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val pst = PersistentSegmentTree()
    val roots = mutableListOf(pst.build(arr, 0, n - 1))
    val q = input[idx++]
    val results = mutableListOf<Long>()
    for (i in 0 until q) {
        val t = input[idx++]; val a1 = input[idx++]; val b1 = input[idx++]; val c1 = input[idx++]
        if (t == 1) roots.add(pst.update(roots[a1], 0, n - 1, b1, c1))
        else results.add(pst.query(roots[a1], 0, n - 1, b1, c1))
    }
    println(results.joinToString(" "))
}
