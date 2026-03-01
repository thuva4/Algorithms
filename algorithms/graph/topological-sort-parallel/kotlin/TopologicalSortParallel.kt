fun topologicalSortParallel(data: IntArray): Int {
    val n = data[0]
    val m = data[1]

    val adj = Array(n) { mutableListOf<Int>() }
    val indegree = IntArray(n)

    var idx = 2
    repeat(m) {
        val u = data[idx]; val v = data[idx + 1]
        adj[u].add(v)
        indegree[v]++
        idx += 2
    }

    var queue = mutableListOf<Int>()
    for (i in 0 until n) {
        if (indegree[i] == 0) queue.add(i)
    }

    var rounds = 0
    var processed = 0

    while (queue.isNotEmpty()) {
        val nextQueue = mutableListOf<Int>()
        for (node in queue) {
            processed++
            for (neighbor in adj[node]) {
                indegree[neighbor]--
                if (indegree[neighbor] == 0) {
                    nextQueue.add(neighbor)
                }
            }
        }
        queue = nextQueue
        rounds++
    }

    return if (processed == n) rounds else -1
}
