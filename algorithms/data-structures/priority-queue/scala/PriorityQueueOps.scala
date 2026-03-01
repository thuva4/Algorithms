object PriorityQueueOps {

  def priorityQueueOps(arr: Array[Int]): Int = {
    if (arr.isEmpty) return 0
    val heap = scala.collection.mutable.ArrayBuffer[Int]()
    val opCount = arr(0)
    var idx = 1
    var total = 0

    def siftUp(idx: Int): Unit = {
      var i = idx
      while (i > 0) { val p = (i-1)/2; if (heap(i) < heap(p)) { val t = heap(i); heap(i) = heap(p); heap(p) = t; i = p } else return }
    }
    def siftDown(idx: Int): Unit = {
      var i = idx; var cont = true
      while (cont) { var s = i; val l = 2*i+1; val r = 2*i+2
        if (l < heap.size && heap(l) < heap(s)) s = l
        if (r < heap.size && heap(r) < heap(s)) s = r
        if (s != i) { val t = heap(i); heap(i) = heap(s); heap(s) = t; i = s } else cont = false }
    }

    for (_ <- 0 until opCount) {
      val tp = arr(idx); val v = arr(idx+1); idx += 2
      if (tp == 1) { heap += v; siftUp(heap.size - 1) }
      else if (tp == 2) {
        if (heap.isEmpty) {}
        else { total += heap(0); heap(0) = heap(heap.size-1); heap.remove(heap.size-1); if (heap.nonEmpty) siftDown(0) }
      }
    }
    total
  }
}
