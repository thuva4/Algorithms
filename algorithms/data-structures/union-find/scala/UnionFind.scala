class UnionFind(n: Int) {
  private val parent: Array[Int] = Array.tabulate(n)(identity)
  private val rank: Array[Int] = Array.fill(n)(0)

  def find(x: Int): Int = {
    if (parent(x) != x)
      parent(x) = find(parent(x))
    parent(x)
  }

  def union(x: Int, y: Int): Unit = {
    var px = find(x)
    var py = find(y)
    if (px == py) return
    if (rank(px) < rank(py)) { val tmp = px; px = py; py = tmp }
    parent(py) = px
    if (rank(px) == rank(py)) rank(px) += 1
  }

  def connected(x: Int, y: Int): Boolean = {
    find(x) == find(y)
  }
}

object UnionFindApp {
  def main(args: Array[String]): Unit = {
    val uf = new UnionFind(5)
    uf.union(0, 1)
    uf.union(1, 2)
    println(s"0 and 2 connected: ${uf.connected(0, 2)}")
    println(s"0 and 3 connected: ${uf.connected(0, 3)}")
  }
}
