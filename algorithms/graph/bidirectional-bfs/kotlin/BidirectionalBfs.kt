package algorithms.graph.bidirectionalbfs

import java.util.LinkedList
import java.util.Queue

class BidirectionalBfs {
    fun solve(arr: IntArray): Int {
        if (arr.size < 4) return -1

        val n = arr[0]
        val m = arr[1]
        val start = arr[2]
        val end = arr[3]

        if (arr.size < 4 + 2 * m) return -1
        if (start == end) return 0

        val adj = Array(n) { ArrayList<Int>() }
        for (i in 0 until m) {
            val u = arr[4 + 2 * i]
            val v = arr[4 + 2 * i + 1]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(v)
                adj[v].add(u)
            }
        }

        val distStart = IntArray(n) { -1 }
        val distEnd = IntArray(n) { -1 }

        val qStart: Queue<Int> = LinkedList()
        val qEnd: Queue<Int> = LinkedList()

        qStart.add(start)
        distStart[start] = 0

        qEnd.add(end)
        distEnd[end] = 0

        while (!qStart.isEmpty() && !qEnd.isEmpty()) {
            var u = qStart.poll()
            if (distEnd[u] != -1) return distStart[u] + distEnd[u]

            for (v in adj[u]) {
                if (distStart[v] == -1) {
                    distStart[v] = distStart[u] + 1
                    if (distEnd[v] != -1) return distStart[v] + distEnd[v]
                    qStart.add(v)
                }
            }

            u = qEnd.poll()
            if (distStart[u] != -1) return distStart[u] + distEnd[u]

            for (v in adj[u]) {
                if (distEnd[v] == -1) {
                    distEnd[v] = distEnd[u] + 1
                    if (distStart[v] != -1) return distStart[v] + distEnd[v]
                    qEnd.add(v)
                }
            }
        }

        return -1
    }
}
