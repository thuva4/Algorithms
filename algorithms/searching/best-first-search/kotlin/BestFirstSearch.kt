package algorithms.searching.bestfirstsearch

import java.util.PriorityQueue
import java.util.Collections

fun bestFirstSearch(adjList: Map<Int, List<Int>>, start: Int, goal: Int, heuristic: Map<Int, Int>): IntArray {
    val nodeCount = adjList.size
    val adjacency = Array(nodeCount) { node -> adjList[node] ?: emptyList() }
    val heuristicValues = IntArray(nodeCount) { node -> heuristic[node] ?: 0 }
    return BestFirstSearch().search(nodeCount, adjacency.toList(), start, goal, heuristicValues).toIntArray()
}

class BestFirstSearch {
    data class Node(val id: Int, val heuristic: Int) : Comparable<Node> {
        override fun compareTo(other: Node): Int {
            return this.heuristic.compareTo(other.heuristic)
        }
    }

    fun search(n: Int, adj: List<List<Int>>, start: Int, target: Int, heuristic: IntArray): List<Int> {
        val pq = PriorityQueue<Node>()
        val visited = BooleanArray(n)
        val parent = IntArray(n) { -1 }

        pq.add(Node(start, heuristic[start]))
        visited[start] = true

        var found = false

        while (pq.isNotEmpty()) {
            val current = pq.poll()
            val u = current.id

            if (u == target) {
                found = true
                break
            }

            for (v in adj[u]) {
                if (!visited[v]) {
                    visited[v] = true
                    parent[v] = u
                    pq.add(Node(v, heuristic[v]))
                }
            }
        }

        val path = ArrayList<Int>()
        if (found) {
            var curr = target
            while (curr != -1) {
                path.add(curr)
                curr = parent[curr]
            }
            path.reverse()
        }
        return path
    }
}
