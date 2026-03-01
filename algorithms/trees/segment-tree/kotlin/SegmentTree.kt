class SegmentTree(arr: IntArray) {
    private val tree: IntArray
    private val n: Int = arr.size

    init {
        tree = IntArray(4 * n)
        if (n > 0) build(arr, 0, 0, n - 1)
    }

    private fun build(arr: IntArray, node: Int, start: Int, end: Int) {
        if (start == end) {
            tree[node] = arr[start]
        } else {
            val mid = (start + end) / 2
            build(arr, 2 * node + 1, start, mid)
            build(arr, 2 * node + 2, mid + 1, end)
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2]
        }
    }

    fun update(idx: Int, value: Int) {
        update(0, 0, n - 1, idx, value)
    }

    private fun update(node: Int, start: Int, end: Int, idx: Int, value: Int) {
        if (start == end) {
            tree[node] = value
        } else {
            val mid = (start + end) / 2
            if (idx <= mid) update(2 * node + 1, start, mid, idx, value)
            else update(2 * node + 2, mid + 1, end, idx, value)
            tree[node] = tree[2 * node + 1] + tree[2 * node + 2]
        }
    }

    fun query(l: Int, r: Int): Int = query(0, 0, n - 1, l, r)

    private fun query(node: Int, start: Int, end: Int, l: Int, r: Int): Int {
        if (r < start || end < l) return 0
        if (l <= start && end <= r) return tree[node]
        val mid = (start + end) / 2
        return query(2 * node + 1, start, mid, l, r) +
               query(2 * node + 2, mid + 1, end, l, r)
    }
}

fun segmentTreeOperations(arr: IntArray, queries: Array<String>): IntArray {
    val segmentTree = SegmentTree(arr)
    val results = mutableListOf<Int>()

    for (query in queries) {
        val parts = query.split(" ").filter { it.isNotEmpty() }
        if (parts.isEmpty()) {
            continue
        }
        when (parts[0]) {
            "update" -> if (parts.size >= 3) segmentTree.update(parts[1].toInt(), parts[2].toInt())
            "sum" -> if (parts.size >= 3) results.add(segmentTree.query(parts[1].toInt(), parts[2].toInt()))
        }
    }

    return results.toIntArray()
}

fun main() {
    val arr = intArrayOf(1, 3, 5, 7, 9, 11)
    val st = SegmentTree(arr)
    println("Sum [1, 3]: ${st.query(1, 3)}")

    st.update(1, 10)
    println("After update, sum [1, 3]: ${st.query(1, 3)}")
}
