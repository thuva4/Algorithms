fun lowestCommonAncestor(arr: IntArray): Int {
    var idx = 0
    val n = arr[idx++]
    val root = arr[idx++]

    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until n - 1) {
        val u = arr[idx++]; val v = arr[idx++]
        adj[u].add(v); adj[v].add(u)
    }
    val qa = arr[idx++]; val qb = arr[idx++]

    var LOG = 1
    while ((1 shl LOG) < n) LOG++

    val depth = IntArray(n)
    val up = Array(LOG) { IntArray(n) { -1 } }

    val visited = BooleanArray(n)
    visited[root] = true
    up[0][root] = root
    val queue = ArrayDeque<Int>()
    queue.add(root)
    while (queue.isNotEmpty()) {
        val v = queue.removeFirst()
        for (u in adj[v]) {
            if (!visited[u]) {
                visited[u] = true
                depth[u] = depth[v] + 1
                up[0][u] = v
                queue.add(u)
            }
        }
    }

    for (k in 1 until LOG)
        for (v in 0 until n)
            up[k][v] = up[k - 1][up[k - 1][v]]

    var a = qa; var b = qb
    if (depth[a] < depth[b]) { val t = a; a = b; b = t }
    var diff = depth[a] - depth[b]
    for (k in 0 until LOG)
        if ((diff shr k) and 1 == 1) a = up[k][a]
    if (a == b) return a
    for (k in LOG - 1 downTo 0)
        if (up[k][a] != up[k][b]) { a = up[k][a]; b = up[k][b] }
    return up[0][a]
}

fun main() {
    println(lowestCommonAncestor(intArrayOf(5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2)))
    println(lowestCommonAncestor(intArrayOf(5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3)))
    println(lowestCommonAncestor(intArrayOf(3, 0, 0, 1, 0, 2, 2, 2)))
    println(lowestCommonAncestor(intArrayOf(5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4)))
}
