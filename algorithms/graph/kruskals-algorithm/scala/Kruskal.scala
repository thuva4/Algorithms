/**
 * Kruskal's algorithm to find the Minimum Spanning Tree (MST) total weight.
 * Uses Union-Find for cycle detection.
 */
object Kruskal {
  class UnionFind(n: Int) {
    private val parent = Array.tabulate(n)(identity)
    private val rank = Array.fill(n)(0)

    def find(x: Int): Int = {
      if (parent(x) != x) {
        parent(x) = find(parent(x))
      }
      parent(x)
    }

    def union(x: Int, y: Int): Boolean = {
      val rootX = find(x)
      val rootY = find(y)

      if (rootX == rootY) return false

      if (rank(rootX) < rank(rootY)) {
        parent(rootX) = rootY
      } else if (rank(rootX) > rank(rootY)) {
        parent(rootY) = rootX
      } else {
        parent(rootY) = rootX
        rank(rootX) += 1
      }
      true
    }
  }

  def kruskal(numVertices: Int, edges: List[(Int, Int, Int)]): Int = {
    val sortedEdges = edges.sortBy(_._3)
    val uf = new UnionFind(numVertices)
    var totalWeight = 0
    var edgesUsed = 0

    for ((src, dest, weight) <- sortedEdges) {
      if (edgesUsed >= numVertices - 1) return totalWeight

      if (uf.union(src, dest)) {
        totalWeight += weight
        edgesUsed += 1
      }
    }

    totalWeight
  }

  def main(args: Array[String]): Unit = {
    val edges = List(
      (0, 1, 10),
      (0, 2, 6),
      (0, 3, 5),
      (1, 3, 15),
      (2, 3, 4)
    )

    val result = kruskal(4, edges)
    println(s"MST total weight: $result")
  }
}
