fun isBipartite(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) {
        val u = arr[2 + 2 * i]
        val v = arr[2 + 2 * i + 1]
        adj[u].add(v)
        adj[v].add(u)
    }

    val color = IntArray(n) { -1 }

    for (start in 0 until n) {
        if (color[start] != -1) continue
        color[start] = 0
        val queue = ArrayDeque<Int>()
        queue.addLast(start)
        while (queue.isNotEmpty()) {
            val u = queue.removeFirst()
            for (v in adj[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u]
                    queue.addLast(v)
                } else if (color[v] == color[u]) {
                    return 0
                }
            }
        }
    }

    return 1
}
