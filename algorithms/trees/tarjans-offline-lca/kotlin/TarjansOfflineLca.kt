fun offlineLca(n: Int, edges: Array<IntArray>, queries: Array<IntArray>): IntArray {
    val adjacency = Array(n) { mutableListOf<Int>() }
    for (edge in edges) {
        if (edge.size >= 2) {
            val u = edge[0]
            val v = edge[1]
            adjacency[u].add(v)
            adjacency[v].add(u)
        }
    }

    val parent = IntArray(n) { -1 }
    val depth = IntArray(n)
    val queue = ArrayDeque<Int>()
    queue.addLast(0)
    parent[0] = 0

    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        for (next in adjacency[node]) {
            if (parent[next] != -1) {
                continue
            }
            parent[next] = node
            depth[next] = depth[node] + 1
            queue.addLast(next)
        }
    }

    fun lca(a: Int, b: Int): Int {
        var u = a
        var v = b
        while (depth[u] > depth[v]) {
            u = parent[u]
        }
        while (depth[v] > depth[u]) {
            v = parent[v]
        }
        while (u != v) {
            u = parent[u]
            v = parent[v]
        }
        return u
    }

    return IntArray(queries.size) { index ->
        val query = queries[index]
        lca(query[0], query[1])
    }
}
