package algorithms.graph.depthfirstsearch

class Dfs {
    fun solve(arr: IntArray): IntArray {
        if (arr.size < 2) return IntArray(0)

        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m + 1) return IntArray(0)

        val start = arr[2 + 2 * m]
        if (start < 0 || start >= n) return IntArray(0)

        val adj = Array(n) { ArrayList<Int>() }
        for (i in 0 until m) {
            val u = arr[2 + 2 * i]
            val v = arr[2 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(v)
                adj[v].add(u)
            }
        }

        for (i in 0 until n) {
            adj[i].sort()
        }

        val result = ArrayList<Int>()
        val visited = BooleanArray(n)

        fun dfsRecursive(u: Int) {
            visited[u] = true
            result.add(u)

            for (v in adj[u]) {
                if (!visited[v]) {
                    dfsRecursive(v)
                }
            }
        }

        dfsRecursive(start)

        return result.toIntArray()
    }
}
