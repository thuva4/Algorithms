object MinimumSpanningTreeBoruvka {

  /**
   * Find the minimum spanning tree using Boruvka's algorithm.
   *
   * Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
   * @param arr input array
   * @return total weight of the MST
   */
  def minimumSpanningTreeBoruvka(arr: Array[Int]): Int = {
    var idx = 0
    val n = arr(idx); idx += 1
    val m = arr(idx); idx += 1
    val eu = new Array[Int](m)
    val ev = new Array[Int](m)
    val ew = new Array[Int](m)
    for (i <- 0 until m) {
      eu(i) = arr(idx); idx += 1
      ev(i) = arr(idx); idx += 1
      ew(i) = arr(idx); idx += 1
    }

    val parent = Array.tabulate(n)(identity)
    val rank = new Array[Int](n)

    def find(x: Int): Int = {
      var v = x
      while (parent(v) != v) { parent(v) = parent(parent(v)); v = parent(v) }
      v
    }

    def unite(x: Int, y: Int): Boolean = {
      var rx = find(x); var ry = find(y)
      if (rx == ry) return false
      if (rank(rx) < rank(ry)) { val t = rx; rx = ry; ry = t }
      parent(ry) = rx
      if (rank(rx) == rank(ry)) rank(rx) += 1
      true
    }

    var totalWeight = 0
    var numComponents = n

    while (numComponents > 1) {
      val cheapest = Array.fill(n)(-1)

      for (i <- 0 until m) {
        val ru = find(eu(i)); val rv = find(ev(i))
        if (ru != rv) {
          if (cheapest(ru) == -1 || ew(i) < ew(cheapest(ru))) cheapest(ru) = i
          if (cheapest(rv) == -1 || ew(i) < ew(cheapest(rv))) cheapest(rv) = i
        }
      }

      for (node <- 0 until n) {
        if (cheapest(node) != -1) {
          if (unite(eu(cheapest(node)), ev(cheapest(node)))) {
            totalWeight += ew(cheapest(node))
            numComponents -= 1
          }
        }
      }
    }

    totalWeight
  }

  def main(args: Array[String]): Unit = {
    println(minimumSpanningTreeBoruvka(Array(3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3)))
    println(minimumSpanningTreeBoruvka(Array(4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4)))
    println(minimumSpanningTreeBoruvka(Array(2, 1, 0, 1, 7)))
    println(minimumSpanningTreeBoruvka(Array(4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3)))
  }
}
