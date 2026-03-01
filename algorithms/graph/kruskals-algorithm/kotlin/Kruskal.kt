/**
 * Kruskal's algorithm to find the Minimum Spanning Tree (MST) total weight.
 * Uses Union-Find for cycle detection.
 */
class UnionFind(n: Int) {
    private val parent = IntArray(n) { it }
    private val rank = IntArray(n)

    fun find(x: Int): Int {
        if (parent[x] != x) {
            parent[x] = find(parent[x])
        }
        return parent[x]
    }

    fun union(x: Int, y: Int): Boolean {
        val rootX = find(x)
        val rootY = find(y)

        if (rootX == rootY) return false

        when {
            rank[rootX] < rank[rootY] -> parent[rootX] = rootY
            rank[rootX] > rank[rootY] -> parent[rootY] = rootX
            else -> {
                parent[rootY] = rootX
                rank[rootX]++
            }
        }
        return true
    }
}

fun kruskal(numVertices: Int, edges: List<List<Int>>): Int {
    val sortedEdges = edges.sortedBy { it[2] }
    val uf = UnionFind(numVertices)
    var totalWeight = 0
    var edgesUsed = 0

    for (edge in sortedEdges) {
        if (edgesUsed >= numVertices - 1) break

        if (uf.union(edge[0], edge[1])) {
            totalWeight += edge[2]
            edgesUsed++
        }
    }

    return totalWeight
}

fun main() {
    val edges = listOf(
        listOf(0, 1, 10),
        listOf(0, 2, 6),
        listOf(0, 3, 5),
        listOf(1, 3, 15),
        listOf(2, 3, 4)
    )

    val result = kruskal(4, edges)
    println("MST total weight: $result")
}
