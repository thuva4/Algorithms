import java.util.LinkedList

fun dpOnTrees(n: Int, values: IntArray, edges: Array<IntArray>): Int {
    if (n == 0) return 0
    if (n == 1) return values[0]

    val adj = Array(n) { mutableListOf<Int>() }
    for (e in edges) {
        adj[e[0]].add(e[1])
        adj[e[1]].add(e[0])
    }

    val dp = IntArray(n)
    val parent = IntArray(n) { -1 }
    val visited = BooleanArray(n)

    val order = mutableListOf<Int>()
    val queue = LinkedList<Int>()
    queue.add(0)
    visited[0] = true
    while (queue.isNotEmpty()) {
        val node = queue.poll()
        order.add(node)
        for (child in adj[node]) {
            if (!visited[child]) {
                visited[child] = true
                parent[child] = node
                queue.add(child)
            }
        }
    }

    for (i in order.indices.reversed()) {
        val node = order[i]
        var bestChild = 0
        for (child in adj[node]) {
            if (child != parent[node]) {
                bestChild = maxOf(bestChild, dp[child])
            }
        }
        dp[node] = values[node] + bestChild
    }

    return dp.max()!!
}

fun main() {
    val br = System.`in`.bufferedReader()
    val n = br.readLine().trim().toInt()
    val values = br.readLine().trim().split(" ").map { it.toInt() }.toIntArray()
    val edges = Array(maxOf(0, n - 1)) {
        br.readLine().trim().split(" ").map { it.toInt() }.toIntArray()
    }
    println(dpOnTrees(n, values, edges))
}
