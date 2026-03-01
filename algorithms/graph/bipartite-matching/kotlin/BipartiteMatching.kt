package algorithms.graph.bipartitematching

import java.util.LinkedList
import java.util.Queue

class BipartiteMatching {
    private var nLeft = 0
    private var nRight = 0
    private lateinit var adj: Array<ArrayList<Int>>
    private lateinit var pairU: IntArray
    private lateinit var pairV: IntArray
    private lateinit var dist: IntArray

    fun solve(arr: IntArray): Int {
        if (arr.size < 3) return 0

        nLeft = arr[0]
        nRight = arr[1]
        val m = arr[2]

        if (arr.size < 3 + 2 * m) return 0
        if (nLeft == 0 || nRight == 0) return 0

        adj = Array(nLeft) { ArrayList<Int>() }
        for (i in 0 until m) {
            val u = arr[3 + 2 * i]
            val v = arr[3 + 2 * i + 1]
            if (u in 0 until nLeft && v in 0 until nRight) {
                adj[u].add(v)
            }
        }

        pairU = IntArray(nLeft) { -1 }
        pairV = IntArray(nRight) { -1 }
        dist = IntArray(nLeft + 1)

        var matching = 0
        while (bfs()) {
            for (u in 0 until nLeft) {
                if (pairU[u] == -1 && dfs(u)) {
                    matching++
                }
            }
        }

        return matching
    }

    private fun bfs(): Boolean {
        val q: Queue<Int> = LinkedList()
        for (u in 0 until nLeft) {
            if (pairU[u] == -1) {
                dist[u] = 0
                q.add(u)
            } else {
                dist[u] = Int.MAX_VALUE
            }
        }

        dist[nLeft] = Int.MAX_VALUE

        while (!q.isEmpty()) {
            val u = q.poll()

            if (dist[u] < dist[nLeft]) {
                for (v in adj[u]) {
                    val pu = pairV[v]
                    if (pu == -1) {
                        if (dist[nLeft] == Int.MAX_VALUE) {
                            dist[nLeft] = dist[u] + 1
                        }
                    } else if (dist[pu] == Int.MAX_VALUE) {
                        dist[pu] = dist[u] + 1
                        q.add(pu)
                    }
                }
            }
        }

        return dist[nLeft] != Int.MAX_VALUE
    }

    private fun dfs(u: Int): Boolean {
        if (u != -1) {
            for (v in adj[u]) {
                val pu = pairV[v]
                if (pu == -1 || (dist[pu] == dist[u] + 1 && dfs(pu))) {
                    pairV[v] = u
                    pairU[u] = v
                    return true
                }
            }
            dist[u] = Int.MAX_VALUE
            return false
        }
        return true
    }
}
