object EulerPath {
  def eulerPath(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    if (n == 0) return 1
    val adj = Array.fill(n)(scala.collection.mutable.ArrayBuffer[Int]())
    val degree = new Array[Int](n)
    for (i <- 0 until m) {
      val u = arr(2+2*i); val v = arr(3+2*i)
      adj(u) += v; adj(v) += u
      degree(u) += 1; degree(v) += 1
    }
    for (d <- degree) if (d % 2 != 0) return 0
    var start = -1
    for (i <- 0 until n) if (degree(i) > 0 && start == -1) start = i
    if (start == -1) return 1
    val visited = new Array[Boolean](n)
    val stack = scala.collection.mutable.Stack[Int]()
    stack.push(start); visited(start) = true
    while (stack.nonEmpty) {
      val v = stack.pop()
      for (u <- adj(v)) if (!visited(u)) { visited(u) = true; stack.push(u) }
    }
    for (i <- 0 until n) if (degree(i) > 0 && !visited(i)) return 0
    1
  }
}
