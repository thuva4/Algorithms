package algorithms.graph.connectedcomponentlabeling

import java.util.LinkedList
import java.util.Queue

class ConnectedComponents {
    fun solve(arr: IntArray): IntArray {
        if (arr.size < 2) return IntArray(0)

        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 2 * m) return IntArray(0)
        if (n == 0) return IntArray(0)

        val adj = Array(n) { ArrayList<Int>() }
        for (i in 0 until m) {
            val u = arr[2 + 2 * i]
            val v = arr[2 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(v)
                adj[v].add(u)
            }
        }

        val labels = IntArray(n) { -1 }
        val q: Queue<Int> = LinkedList()

        for (i in 0 until n) {
            if (labels[i] == -1) {
                val componentId = i
                labels[i] = componentId
                q.add(i)

                while (!q.isEmpty()) {
                    val u = q.poll()

                    for (v in adj[u]) {
                        if (labels[v] == -1) {
                            labels[v] = componentId
                            q.add(v)
                        }
                    }
                }
            }
        }

        return labels
    }
}
