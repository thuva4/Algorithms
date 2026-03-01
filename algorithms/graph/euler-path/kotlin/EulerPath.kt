fun eulerPath(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    if (n == 0) return 1
    val adj = Array(n) { mutableListOf<Int>() }
    val degree = IntArray(n)
    for (i in 0 until m) {
        val u = arr[2+2*i]; val v = arr[3+2*i]
        adj[u].add(v); adj[v].add(u)
        degree[u]++; degree[v]++
    }
    for (d in degree) if (d % 2 != 0) return 0
    var start = -1
    for (i in 0 until n) if (degree[i] > 0) { start = i; break }
    if (start == -1) return 1
    val visited = BooleanArray(n)
    val stack = ArrayDeque<Int>()
    stack.addLast(start); visited[start] = true
    while (stack.isNotEmpty()) {
        val v = stack.removeLast()
        for (u in adj[v]) if (!visited[u]) { visited[u] = true; stack.addLast(u) }
    }
    for (i in 0 until n) if (degree[i] > 0 && !visited[i]) return 0
    return 1
}
