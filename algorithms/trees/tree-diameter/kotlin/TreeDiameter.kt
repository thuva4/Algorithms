fun treeDiameter(arr: IntArray): Int {
    var idx = 0
    val n = arr[idx++]
    if (n <= 1) return 0

    val adj = Array(n) { mutableListOf<Int>() }
    val m = (arr.size - 1) / 2
    for (i in 0 until m) {
        val u = arr[idx++]; val v = arr[idx++]
        adj[u].add(v); adj[v].add(u)
    }

    fun bfs(start: Int): Pair<Int, Int> {
        val dist = IntArray(n) { -1 }
        dist[start] = 0
        val queue = ArrayDeque<Int>()
        queue.add(start)
        var farthest = start
        while (queue.isNotEmpty()) {
            val node = queue.removeFirst()
            for (nb in adj[node]) {
                if (dist[nb] == -1) {
                    dist[nb] = dist[node] + 1
                    queue.add(nb)
                    if (dist[nb] > dist[farthest]) farthest = nb
                }
            }
        }
        return Pair(farthest, dist[farthest])
    }

    val (u, _) = bfs(0)
    val (_, diameter) = bfs(u)
    return diameter
}

fun main() {
    println(treeDiameter(intArrayOf(4, 0, 1, 1, 2, 2, 3)))
    println(treeDiameter(intArrayOf(5, 0, 1, 0, 2, 0, 3, 0, 4)))
    println(treeDiameter(intArrayOf(2, 0, 1)))
    println(treeDiameter(intArrayOf(1)))
}
