package algorithms.graph.bipartitecheck

import java.util.LinkedList
import java.util.Queue

class BipartiteCheck {
    fun solve(arr: IntArray): Int {
        if (arr.size < 2) return 0

        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m) return 0
        if (n == 0) return 1

        val adj = Array(n) { ArrayList<Int>() }
        for (i in 0 until m) {
            val u = arr[2 + 2 * i]
            val v = arr[2 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(v)
                adj[v].add(u)
            }
        }

        val color = IntArray(n) // 0: none, 1: red, -1: blue
        val q: Queue<Int> = LinkedList()

        for (i in 0 until n) {
            if (color[i] == 0) {
                color[i] = 1
                q.add(i)

                while (!q.isEmpty()) {
                    val u = q.poll()

                    for (v in adj[u]) {
                        if (color[v] == 0) {
                            color[v] = -color[u]
                            q.add(v)
                        } else if (color[v] == color[u]) {
                            return 0
                        }
                    }
                }
            }
        }

        return 1
    }
}
