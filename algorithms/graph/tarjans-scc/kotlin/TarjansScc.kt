fun tarjansScc(arr: IntArray): Int {
    val n = arr[0]
    val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) {
        val u = arr[2 + 2 * i]
        val v = arr[2 + 2 * i + 1]
        adj[u].add(v)
    }

    var indexCounter = 0
    var sccCount = 0
    val disc = IntArray(n) { -1 }
    val low = IntArray(n)
    val onStack = BooleanArray(n)
    val stack = ArrayDeque<Int>()

    fun strongconnect(v: Int) {
        disc[v] = indexCounter
        low[v] = indexCounter
        indexCounter++
        stack.addLast(v)
        onStack[v] = true

        for (w in adj[v]) {
            if (disc[w] == -1) {
                strongconnect(w)
                low[v] = minOf(low[v], low[w])
            } else if (onStack[w]) {
                low[v] = minOf(low[v], disc[w])
            }
        }

        if (low[v] == disc[v]) {
            sccCount++
            while (true) {
                val w = stack.removeLast()
                onStack[w] = false
                if (w == v) break
            }
        }
    }

    for (v in 0 until n) {
        if (disc[v] == -1) {
            strongconnect(v)
        }
    }

    return sccCount
}
