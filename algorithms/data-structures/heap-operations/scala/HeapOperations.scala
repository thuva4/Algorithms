object HeapOperations {

  def heapSortViaExtract(arr: Array[Int]): Array[Int] = {
    val heap = scala.collection.mutable.ArrayBuffer[Int]()

    def siftUp(idx: Int): Unit = {
      var i = idx
      while (i > 0) {
        val parent = (i - 1) / 2
        if (heap(i) < heap(parent)) {
          val tmp = heap(i); heap(i) = heap(parent); heap(parent) = tmp
          i = parent
        } else return
      }
    }

    def siftDown(idx: Int, size: Int): Unit = {
      var i = idx
      var continue_ = true
      while (continue_) {
        var smallest = i
        val left = 2 * i + 1; val right = 2 * i + 2
        if (left < size && heap(left) < heap(smallest)) smallest = left
        if (right < size && heap(right) < heap(smallest)) smallest = right
        if (smallest != i) {
          val tmp = heap(i); heap(i) = heap(smallest); heap(smallest) = tmp
          i = smallest
        } else continue_ = false
      }
    }

    for (v <- arr) {
      heap += v
      siftUp(heap.size - 1)
    }

    val result = scala.collection.mutable.ArrayBuffer[Int]()
    while (heap.nonEmpty) {
      result += heap(0)
      heap(0) = heap(heap.size - 1)
      heap.remove(heap.size - 1)
      if (heap.nonEmpty) siftDown(0, heap.size)
    }
    result.toArray
  }
}
