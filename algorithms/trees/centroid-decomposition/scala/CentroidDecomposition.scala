object CentroidDecomposition {

  var adj: Array[scala.collection.mutable.ListBuffer[Int]] = _
  var removed: Array[Boolean] = _
  var subSize: Array[Int] = _

  def getSubSize(v: Int, parent: Int): Unit = {
    subSize(v) = 1
    for (u <- adj(v))
      if (u != parent && !removed(u)) { getSubSize(u, v); subSize(v) += subSize(u) }
  }

  def getCentroid(v: Int, parent: Int, treeSize: Int): Int = {
    for (u <- adj(v))
      if (u != parent && !removed(u) && subSize(u) > treeSize / 2)
        return getCentroid(u, v, treeSize)
    v
  }

  def decompose(v: Int, depth: Int): Int = {
    getSubSize(v, -1)
    val centroid = getCentroid(v, -1, subSize(v))
    removed(centroid) = true
    var maxDepth = depth
    for (u <- adj(centroid))
      if (!removed(u)) { val r = decompose(u, depth + 1); if (r > maxDepth) maxDepth = r }
    removed(centroid) = false
    maxDepth
  }

  def centroidDecomposition(arr: Array[Int]): Int = {
    var idx = 0
    val n = arr(idx); idx += 1
    if (n <= 1) return 0

    adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    val m = (arr.length - 1) / 2
    for (_ <- 0 until m) {
      val u = arr(idx); idx += 1
      val v = arr(idx); idx += 1
      adj(u) += v; adj(v) += u
    }
    removed = new Array[Boolean](n)
    subSize = new Array[Int](n)
    decompose(0, 0)
  }

  def main(args: Array[String]): Unit = {
    println(centroidDecomposition(Array(4, 0, 1, 1, 2, 2, 3)))
    println(centroidDecomposition(Array(5, 0, 1, 0, 2, 0, 3, 0, 4)))
    println(centroidDecomposition(Array(1)))
    println(centroidDecomposition(Array(7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6)))
  }
}
