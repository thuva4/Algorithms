fun spfa(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    val src = arr[2]
    val adj = Array(n) { mutableListOf<Pair<Int, Int>>() }
    for (i in 0 until m) {
        val u = arr[3 + 3 * i]
        val v = arr[3 + 3 * i + 1]
        val w = arr[3 + 3 * i + 2]
        adj[u].add(Pair(v, w))
    }

    val INF = Int.MAX_VALUE / 2
    val dist = IntArray(n) { INF }
    dist[src] = 0
    val inQueue = BooleanArray(n)
    val queue = ArrayDeque<Int>()
    queue.addLast(src)
    inQueue[src] = true

    while (queue.isNotEmpty()) {
        val u = queue.removeFirst()
        inQueue[u] = false
        for ((v, w) in adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w
                if (!inQueue[v]) {
                    queue.addLast(v)
                    inQueue[v] = true
                }
            }
        }
    }

    return if (dist[n - 1] == INF) -1 else dist[n - 1]
}
