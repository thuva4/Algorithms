/**
 * Find shortest path from source to vertex n-1 in a DAG.
 *
 * Input format: [n, m, src, u1, v1, w1, ...]
 * @param arr input array
 * @return shortest distance from src to n-1, or -1 if unreachable
 */
fun shortestPathDag(arr: IntArray): Int {
    var idx = 0
    val n = arr[idx++]
    val m = arr[idx++]
    val src = arr[idx++]

    val adj = Array(n) { mutableListOf<Pair<Int, Int>>() }
    val inDegree = IntArray(n)
    for (i in 0 until m) {
        val u = arr[idx++]; val v = arr[idx++]; val w = arr[idx++]
        adj[u].add(Pair(v, w))
        inDegree[v]++
    }

    val queue = ArrayDeque<Int>()
    for (i in 0 until n) if (inDegree[i] == 0) queue.add(i)

    val topoOrder = mutableListOf<Int>()
    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        topoOrder.add(node)
        for ((v, _) in adj[node]) {
            inDegree[v]--
            if (inDegree[v] == 0) queue.add(v)
        }
    }

    val INF = Int.MAX_VALUE
    val dist = IntArray(n) { INF }
    dist[src] = 0

    for (u in topoOrder) {
        if (dist[u] == INF) continue
        for ((v, w) in adj[u]) {
            if (dist[u] + w < dist[v]) dist[v] = dist[u] + w
        }
    }

    return if (dist[n - 1] == INF) -1 else dist[n - 1]
}

fun main() {
    println(shortestPathDag(intArrayOf(4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7)))
    println(shortestPathDag(intArrayOf(3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1)))
    println(shortestPathDag(intArrayOf(2, 1, 0, 0, 1, 10)))
    println(shortestPathDag(intArrayOf(3, 1, 0, 1, 2, 5)))
}
