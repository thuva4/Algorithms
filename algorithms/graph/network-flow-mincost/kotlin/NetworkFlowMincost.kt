fun networkFlowMincost(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]; val src = arr[2]; val sink = arr[3]
    val head = IntArray(n) { -1 }
    val to = mutableListOf<Int>(); val capList = mutableListOf<Int>()
    val costList = mutableListOf<Int>(); val nxt = mutableListOf<Int>()
    var edgeCnt = 0

    fun addEdge(u: Int, v: Int, c: Int, w: Int) {
        to.add(v); capList.add(c); costList.add(w); nxt.add(head[u]); head[u] = edgeCnt++
        to.add(u); capList.add(0); costList.add(-w); nxt.add(head[v]); head[v] = edgeCnt++
    }

    for (i in 0 until m) {
        addEdge(arr[4 + 4 * i], arr[4 + 4 * i + 1], arr[4 + 4 * i + 2], arr[4 + 4 * i + 3])
    }

    val cap = capList.toIntArray()
    val INF = Int.MAX_VALUE / 2
    var totalCost = 0

    while (true) {
        val dist = IntArray(n) { INF }
        dist[src] = 0
        val inQueue = BooleanArray(n)
        val prevEdge = IntArray(n) { -1 }
        val prevNode = IntArray(n)
        val q = ArrayDeque<Int>()
        q.addLast(src); inQueue[src] = true

        while (q.isNotEmpty()) {
            val u = q.removeFirst()
            inQueue[u] = false
            var e = head[u]
            while (e != -1) {
                val v = to[e]
                if (cap[e] > 0 && dist[u] + costList[e] < dist[v]) {
                    dist[v] = dist[u] + costList[e]
                    prevEdge[v] = e; prevNode[v] = u
                    if (!inQueue[v]) { q.addLast(v); inQueue[v] = true }
                }
                e = nxt[e]
            }
        }

        if (dist[sink] == INF) break

        var bottleneck = INF
        var v = sink
        while (v != src) { bottleneck = minOf(bottleneck, cap[prevEdge[v]]); v = prevNode[v] }

        v = sink
        while (v != src) {
            val e = prevEdge[v]
            cap[e] -= bottleneck; cap[e xor 1] += bottleneck
            v = prevNode[v]
        }

        totalCost += bottleneck * dist[sink]
    }

    return totalCost
}
