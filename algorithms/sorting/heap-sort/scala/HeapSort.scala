package algorithms.sorting.heap

/**
 * Heap Sort implementation.
 * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
 */
object HeapSort {
  def sort(arr: Array[Int]): Array[Int] = {
    val result = arr.clone()
    val n = result.length

    // Build max heap
    for (i <- n / 2 - 1 to 0 by -1) {
      heapify(result, n, i)
    }

    // Extract elements
    for (i <- n - 1 until 0 by -1) {
      val temp = result(0)
      result(0) = result(i)
      result(i) = temp

      heapify(result, i, 0)
    }

    result
  }

  private def heapify(arr: Array[Int], n: Int, i: Int): Unit = {
    var largest = i
    val l = 2 * i + 1
    val r = 2 * i + 2

    if (l < n && arr(l) > arr(largest)) {
      largest = l
    }

    if (r < n && arr(r) > arr(largest)) {
      largest = r
    }

    if (largest != i) {
      val temp = arr(i)
      arr(i) = arr(largest)
      arr(largest) = temp

      heapify(arr, n, largest)
    }
  }
}
