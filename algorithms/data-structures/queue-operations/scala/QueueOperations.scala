object QueueOperations {

  def queueOps(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    val queue = scala.collection.mutable.Queue[Int]()
    val opCount = arr(0)
    var idx = 1; var total = 0
    for (_ <- 0 until opCount) {
      val tp = arr(idx); val v = arr(idx + 1); idx += 2
      if (tp == 1) queue.enqueue(v)
      else if (tp == 2 && queue.nonEmpty) total += queue.dequeue()
    }
    total
  }
}
