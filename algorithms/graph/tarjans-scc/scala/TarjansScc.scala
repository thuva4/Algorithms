object TarjansScc {

  def tarjansScc(arr: Array[Int]): Int = {
    val n = arr(0)
    val m = arr(1)
    val adj = Array.fill(n)(scala.collection.mutable.ListBuffer[Int]())
    for (i <- 0 until m) {
      val u = arr(2 + 2 * i)
      val v = arr(2 + 2 * i + 1)
      adj(u) += v
    }

    var indexCounter = 0
    var sccCount = 0
    val disc = Array.fill(n)(-1)
    val low = Array.fill(n)(0)
    val onStack = Array.fill(n)(false)
    val stack = scala.collection.mutable.Stack[Int]()

    def strongconnect(v: Int): Unit = {
      disc(v) = indexCounter
      low(v) = indexCounter
      indexCounter += 1
      stack.push(v)
      onStack(v) = true

      for (w <- adj(v)) {
        if (disc(w) == -1) {
          strongconnect(w)
          low(v) = math.min(low(v), low(w))
        } else if (onStack(w)) {
          low(v) = math.min(low(v), disc(w))
        }
      }

      if (low(v) == disc(v)) {
        sccCount += 1
        var done = false
        while (!done) {
          val w = stack.pop()
          onStack(w) = false
          if (w == v) done = true
        }
      }
    }

    for (v <- 0 until n) {
      if (disc(v) == -1) {
        strongconnect(v)
      }
    }

    sccCount
  }
}
