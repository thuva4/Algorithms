package algorithms.graph.dijkstras

import java.util.PriorityQueue
import java.util.ArrayList

class Dijkstra {
    private val INF = 1000000000

    data class Edge(val to: Int, val weight: Int)
    data class Node(val u: Int, val d: Int) : Comparable<Node> {
        override fun compareTo(other: Node): Int {
            return this.d.compareTo(other.d)
        }
    }

    fun solve(arr: IntArray): IntArray {
        if (arr.size < 2) return IntArray(0)

        val n = arr[0]
        val m = arr[1]

        if (arr.size < 2 + 3 * m + 1) return IntArray(0)

        val start = arr[2 + 3 * m]
        if (start < 0 || start >= n) return IntArray(0)

        val adj = Array(n) { ArrayList<Edge>() }
        for (i in 0 until m) {
            val u = arr[2 + 3 * i]
            val v = arr[2 + 3 * i + 1]
            val w = arr[2 + 3 * i + 2]
            if (u in 0 until n && v in 0 until n) {
                adj[u].add(Edge(v, w))
            }
        }

        val dist = IntArray(n) { INF }
        dist[start] = 0

        val pq = PriorityQueue<Node>()
        pq.add(Node(start, 0))

        while (pq.isNotEmpty()) {
            val current = pq.poll()
            val u = current.u
            val d = current.d

            if (d > dist[u]) continue

            for (e in adj[u]) {
                if (dist[u] + e.weight < dist[e.to]) {
                    dist[e.to] = dist[u] + e.weight
                    pq.add(Node(e.to, dist[e.to]))
                }
            }
        }

        return dist
    }
}
