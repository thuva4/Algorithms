object LowestCommonAncestor {

  def lowestCommonAncestor(arr: Array[Int]): Int = {
    var idx = 0
    val n = arr(idx); idx += 1
    val root = arr(idx); idx += 1

    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (_ <- 0 until n - 1) {
      val u = arr(idx); idx += 1
      val v = arr(idx); idx += 1
      adj(u) += v; adj(v) += u
    }
    val qa = arr(idx); idx += 1
    val qb = arr(idx)

    var LOG = 1
    while ((1 << LOG) < n) LOG += 1

    val depth = new Array[Int](n)
    val up = Array.fill(LOG, n)(-1)

    val visited = new Array[Boolean](n)
    visited(root) = true
    up(0)(root) = root
    val queue = scala.collection.mutable.Queue(root)
    while (queue.nonEmpty) {
      val v = queue.dequeue()
      for (u <- adj(v)) {
        if (!visited(u)) {
          visited(u) = true
          depth(u) = depth(v) + 1
          up(0)(u) = v
          queue.enqueue(u)
        }
      }
    }

    for (k <- 1 until LOG; v <- 0 until n)
      up(k)(v) = up(k - 1)(up(k - 1)(v))

    var a = qa; var b = qb
    if (depth(a) < depth(b)) { val t = a; a = b; b = t }
    val diff = depth(a) - depth(b)
    for (k <- 0 until LOG)
      if (((diff >> k) & 1) == 1) a = up(k)(a)
    if (a == b) return a
    for (k <- (LOG - 1) to 0 by -1)
      if (up(k)(a) != up(k)(b)) { a = up(k)(a); b = up(k)(b) }
    up(0)(a)
  }

  def main(args: Array[String]): Unit = {
    println(lowestCommonAncestor(Array(5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2)))
    println(lowestCommonAncestor(Array(5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3)))
    println(lowestCommonAncestor(Array(3, 0, 0, 1, 0, 2, 2, 2)))
    println(lowestCommonAncestor(Array(5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4)))
  }
}
