package algorithms.graph.dinic

import java.util.LinkedList
import java.util.Queue
import kotlin.math.min

class Dinic {
    data class Edge(val to: Int, val rev: Int, var cap: Long, var flow: Long = 0)

    private lateinit var adj: Array<ArrayList<Edge>>
    private lateinit var level: IntArray
    private lateinit var ptr: IntArray

    fun solve(arr: IntArray): Int {
        if (arr.size < 4) return 0
        val n = arr[0]
        val m = arr[1]
        val s = arr[2]
        val t = arr[3]

        if (arr.size < 4 + 3 * m) return 0

        adj = Array(n) { ArrayList<Edge>() }
        for (i in 0 until m) {
            val u = arr[4 + 3 * i]
            val v = arr[4 + 3 * i + 1]
            val cap = arr[4 + 3 * i + 2].toLong()
            if (u in 0 until n && v in 0 until n) {
                addEdge(u, v, cap)
            }
        }

        level = IntArray(n)
        ptr = IntArray(n)

        var flow: Long = 0
        while (bfs(s, t, n)) {
            ptr.fill(0)
            while (true) {
                val pushed = dfs(s, t, Long.MAX_VALUE)
                if (pushed == 0L) break
                flow += pushed
            }
        }

        return flow.toInt()
    }

    private fun addEdge(u: Int, v: Int, cap: Long) {
        val a = Edge(v, adj[v].size, cap)
        val b = Edge(u, adj[u].size, 0)
        adj[u].add(a)
        adj[v].add(b)
    }

    private fun bfs(s: Int, t: Int, n: Int): Boolean {
        level.fill(-1)
        level[s] = 0
        val q: Queue<Int> = LinkedList()
        q.add(s)

        while (!q.isEmpty()) {
            val u = q.poll()
            for (e in adj[u]) {
                if (e.cap - e.flow > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1
                    q.add(e.to)
                }
            }
        }
        return level[t] != -1
    }

    private fun dfs(u: Int, t: Int, pushed: Long): Long {
        if (pushed == 0L) return 0
        if (u == t) return pushed

        while (ptr[u] < adj[u].size) {
            val id = ptr[u]
            val e = adj[u][id]
            val v = e.to

            if (level[u] + 1 != level[v] || e.cap - e.flow == 0L) {
                ptr[u]++
                continue
            }

            var tr = pushed
            if (e.cap - e.flow < tr) tr = e.cap - e.flow

            val pushedFlow = dfs(v, t, tr)
            if (pushedFlow == 0L) {
                ptr[u]++
                continue
            }

            e.flow += pushedFlow
            adj[v][e.rev].flow -= pushedFlow

            return pushedFlow
        }

        return 0
    }
}
