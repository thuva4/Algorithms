object StronglyConnectedPathBased {

  def stronglyConnectedPathBased(arr: Array[Int]): Int = {
    val n = arr(0); val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) adj(arr(2 + 2 * i)) += arr(2 + 2 * i + 1)

    val preorder = Array.fill(n)(-1)
    var counter = 0; var sccCount = 0
    val sStack = scala.collection.mutable.Stack[Int]()
    val pStack = scala.collection.mutable.Stack[Int]()
    val assigned = Array.fill(n)(false)

    def dfs(v: Int): Unit = {
      preorder(v) = counter; counter += 1
      sStack.push(v); pStack.push(v)
      for (w <- adj(v)) {
        if (preorder(w) == -1) dfs(w)
        else if (!assigned(w)) {
          while (pStack.nonEmpty && preorder(pStack.top) > preorder(w)) pStack.pop()
        }
      }
      if (pStack.nonEmpty && pStack.top == v) {
        pStack.pop(); sccCount += 1
        var done = false
        while (!done) {
          val u = sStack.pop(); assigned(u) = true
          if (u == v) done = true
        }
      }
    }

    for (v <- 0 until n) { if (preorder(v) == -1) dfs(v) }
    sccCount
  }
}
