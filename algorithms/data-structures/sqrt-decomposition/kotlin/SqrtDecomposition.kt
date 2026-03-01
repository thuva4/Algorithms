import kotlin.math.sqrt
import kotlin.math.max

class SqrtDecompositionDS(arr: IntArray) {
    private val a = arr.copyOf()
    private val blockSz: Int
    private val blocks: LongArray

    init {
        val n = arr.size
        blockSz = max(1, sqrt(n.toDouble()).toInt())
        blocks = LongArray((n + blockSz - 1) / blockSz)
        for (i in 0 until n) blocks[i / blockSz] += arr[i].toLong()
    }

    fun query(l: Int, r: Int): Long {
        var result = 0L
        val bl = l / blockSz; val br = r / blockSz
        if (bl == br) {
            for (i in l..r) result += a[i]
        } else {
            for (i in l until (bl + 1) * blockSz) result += a[i]
            for (b in bl + 1 until br) result += blocks[b]
            for (i in br * blockSz..r) result += a[i]
        }
        return result
    }
}

fun sqrtDecomposition(n: Int, arr: IntArray, queries: Array<IntArray>): LongArray {
    val decomposition = SqrtDecompositionDS(arr.copyOf(n))
    return LongArray(queries.size) { index ->
        val query = queries[index]
        decomposition.query(query[0], query[1])
    }
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val sd = SqrtDecompositionDS(arr)
    val q = input[idx++]
    val results = mutableListOf<Long>()
    for (i in 0 until q) {
        val l = input[idx++]; val r = input[idx++]
        results.add(sd.query(l, r))
    }
    println(results.joinToString(" "))
}
