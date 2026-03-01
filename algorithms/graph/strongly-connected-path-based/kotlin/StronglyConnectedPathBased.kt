fun stronglyConnectedPathBased(arr: IntArray): Int {
    val n = arr[0]; val m = arr[1]
    val adj = Array(n) { mutableListOf<Int>() }
    for (i in 0 until m) adj[arr[2 + 2 * i]].add(arr[2 + 2 * i + 1])

    val preorder = IntArray(n) { -1 }
    var counter = 0; var sccCount = 0
    val sStack = ArrayDeque<Int>(); val pStack = ArrayDeque<Int>()
    val assigned = BooleanArray(n)

    fun dfs(v: Int) {
        preorder[v] = counter++
        sStack.addLast(v); pStack.addLast(v)
        for (w in adj[v]) {
            if (preorder[w] == -1) dfs(w)
            else if (!assigned[w]) {
                while (pStack.isNotEmpty() && preorder[pStack.last()] > preorder[w]) pStack.removeLast()
            }
        }
        if (pStack.isNotEmpty() && pStack.last() == v) {
            pStack.removeLast(); sccCount++
            while (true) {
                val u = sStack.removeLast(); assigned[u] = true
                if (u == v) break
            }
        }
    }

    for (v in 0 until n) { if (preorder[v] == -1) dfs(v) }
    return sccCount
}
