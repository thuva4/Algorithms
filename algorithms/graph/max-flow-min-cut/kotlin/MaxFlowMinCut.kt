fun maxFlowMinCut(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]; val src = arr[2]; val sink = arr[3]
    val cap = Array(n) { IntArray(n) }
    for (i in 0 until m) cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i]
    var maxFlow = 0
    while (true) {
        val parent = IntArray(n) { -1 }
        parent[src] = src
        val queue = ArrayDeque<Int>()
        queue.addLast(src)
        while (queue.isNotEmpty() && parent[sink] == -1) {
            val u = queue.removeFirst()
            for (v in 0 until n) if (parent[v] == -1 && cap[u][v] > 0) { parent[v] = u; queue.addLast(v) }
        }
        if (parent[sink] == -1) break
        var flow = Int.MAX_VALUE
        var v = sink
        while (v != src) { flow = minOf(flow, cap[parent[v]][v]); v = parent[v] }
        v = sink
        while (v != src) { cap[parent[v]][v] -= flow; cap[v][parent[v]] += flow; v = parent[v] }
        maxFlow += flow
    }
    return maxFlow
}
