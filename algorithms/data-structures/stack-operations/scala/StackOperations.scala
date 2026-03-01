object StackOperations {

  def stackOps(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    val stack = scala.collection.mutable.ArrayBuffer[Int]()
    val opCount = arr(0)
    var idx = 1
    var total = 0
    for (_ <- 0 until opCount) {
      val tp = arr(idx); val v = arr(idx + 1); idx += 2
      if (tp == 1) stack += v
      else if (tp == 2) {
        if (stack.nonEmpty) { total += stack.last; stack.remove(stack.size - 1) }
        else total += -1
      }
    }
    total
  }
}
