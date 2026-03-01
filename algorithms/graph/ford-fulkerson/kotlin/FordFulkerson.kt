private lateinit var capFK: Array<IntArray>
private var nFK = 0

private fun dfsFK(u: Int, sink: Int, flow: Int, visited: BooleanArray): Int {
    if (u == sink) return flow
    visited[u] = true
    for (v in 0 until nFK) {
        if (!visited[v] && capFK[u][v] > 0) {
            val d = dfsFK(v, sink, minOf(flow, capFK[u][v]), visited)
            if (d > 0) { capFK[u][v] -= d; capFK[v][u] += d; return d }
        }
    }
    return 0
}

fun fordFulkerson(arr: IntArray): Int {
    nFK = arr[0]; val m = arr[1]; val src = arr[2]; val sink = arr[3]
    capFK = Array(nFK) { IntArray(nFK) }
    for (i in 0 until m) capFK[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i]
    var maxFlow = 0
    while (true) {
        val visited = BooleanArray(nFK)
        val flow = dfsFK(src, sink, Int.MAX_VALUE, visited)
        if (flow == 0) break
        maxFlow += flow
    }
    return maxFlow
}
