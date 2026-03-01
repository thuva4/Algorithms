import kotlin.math.sqrt
import kotlin.math.max

fun moAlgorithm(n: Int, arr: IntArray, queries: Array<IntArray>): LongArray {
    val q = queries.size
    val block = max(1, sqrt(n.toDouble()).toInt())
    val order = (0 until q).sortedWith(Comparator { a, b ->
        val ba = queries[a][0] / block; val bb = queries[b][0] / block
        if (ba != bb) ba - bb
        else if (ba % 2 == 0) queries[a][1] - queries[b][1]
        else queries[b][1] - queries[a][1]
    })

    val results = LongArray(q)
    var curL = 0; var curR = -1; var curSum = 0L
    for (idx in order) {
        val l = queries[idx][0]; val r = queries[idx][1]
        while (curR < r) { curR++; curSum += arr[curR] }
        while (curL > l) { curL--; curSum += arr[curL] }
        while (curR > r) { curSum -= arr[curR]; curR-- }
        while (curL < l) { curSum -= arr[curL]; curL++ }
        results[idx] = curSum
    }
    return results
}

fun main() {
    val input = System.`in`.bufferedReader().readText().trim().split("\\s+".toRegex()).map { it.toInt() }
    var idx = 0
    val n = input[idx++]
    val arr = IntArray(n) { input[idx++] }
    val q = input[idx++]
    val queries = Array(q) { intArrayOf(input[idx++], input[idx++]) }
    val results = moAlgorithm(n, arr, queries)
    println(results.joinToString(" "))
}
