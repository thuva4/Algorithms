import kotlin.math.min

class SparseTableDS(arr: IntArray) {
    private val table: Array<IntArray>
    private val lg: IntArray

    init {
        val n = arr.size
        var k = 1
        while ((1 shl k) <= n) k++
        table = Array(k) { IntArray(n) }
        lg = IntArray(n + 1)
        for (i in 2..n) lg[i] = lg[i / 2] + 1
        arr.copyInto(table[0])
        for (j in 1 until k)
            for (i in 0..n - (1 shl j))
                table[j][i] = min(table[j-1][i], table[j-1][i + (1 shl (j-1))])
    }

    fun query(l: Int, r: Int): Int {
        val k = lg[r - l + 1]
        return min(table[k][l], table[k][r - (1 shl k) + 1])
    }
}

fun sparseTable(n: Int, arr: IntArray, queries: Array<IntArray>): IntArray {
    val table = SparseTableDS(arr.copyOf(n))
    return IntArray(queries.size) { index ->
        val query = queries[index]
        table.query(query[0], query[1])
    }
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val st = SparseTableDS(arr)
    val q = input[idx++]
    val results = mutableListOf<Int>()
    for (i in 0 until q) {
        val l = input[idx++]
        val r = input[idx++]
        results.add(st.query(l, r))
    }
    println(results.joinToString(" "))
}
