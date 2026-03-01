fun hldPathQuery(n: Int, edges: Array<IntArray>, values: IntArray, queries: Array<String>): IntArray {
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

    fun pathNodes(start: Int, end: Int): List<Int> {
        var u = start
        var v = end
        val left = mutableListOf<Int>()
        val right = mutableListOf<Int>()

        while (depth[u] > depth[v]) {
            left.add(u)
            u = parent[u]
        }
        while (depth[v] > depth[u]) {
            right.add(v)
            v = parent[v]
        }
        while (u != v) {
            left.add(u)
            right.add(v)
            u = parent[u]
            v = parent[v]
        }
        left.add(u)
        right.reverse()
        left.addAll(right)
        return left
    }

    val results = mutableListOf<Int>()
    for (query in queries) {
        val parts = query.split(" ").filter { it.isNotEmpty() }
        if (parts.size < 3) {
            continue
        }
        val op = parts[0]
        val u = parts[1].toInt()
        val v = parts[2].toInt()
        val nodes = pathNodes(u, v)
        if (op == "max") {
            results.add(nodes.maxOf { values[it] })
        } else {
            results.add(nodes.sumOf { values[it] })
        }
    }

    return results.toIntArray()
}
