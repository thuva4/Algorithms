package algorithms.sorting.bitonic

/**
 * Bitonic Sort implementation.
 * Works on any array size by padding to the nearest power of 2.
 */
object BitonicSort {
  def sort(arr: Array[Int]): Array[Int] = {
    if (arr.isEmpty) {
      return Array.empty[Int]
    }

    val n = arr.length
    var nextPow2 = 1
    while (nextPow2 < n) {
      nextPow2 *= 2
    }

    // Pad the array to the next power of 2
    // We use Int.MaxValue for padding to handle ascending sort
    val padded = Array.fill(nextPow2)(Int.MaxValue)
    System.arraycopy(arr, 0, padded, 0, n)

    bitonicSortRecursive(padded, 0, nextPow2, ascending = true)

    // Return the first n elements (trimmed back to original size)
    padded.take(n)
  }

  private def compareAndSwap(arr: Array[Int], i: Int, j: Int, ascending: Boolean): Unit = {
    if ((ascending && arr(i) > arr(j)) || (!ascending && arr(i) < arr(j))) {
      val temp = arr(i)
      arr(i) = arr(j)
      arr(j) = temp
    }
  }

  private def bitonicMerge(arr: Array[Int], low: Int, cnt: Int, ascending: Boolean): Unit = {
    if (cnt > 1) {
      val k = cnt / 2
      for (i <- low until (low + k)) {
        compareAndSwap(arr, i, i + k, ascending)
      }
      bitonicMerge(arr, low, k, ascending)
      bitonicMerge(arr, low + k, k, ascending)
    }
  }

  private def bitonicSortRecursive(arr: Array[Int], low: Int, cnt: Int, ascending: Boolean): Unit = {
    if (cnt > 1) {
      val k = cnt / 2
      // Sort first half in ascending order
      bitonicSortRecursive(arr, low, k, ascending = true)
      // Sort second half in descending order
      bitonicSortRecursive(arr, low + k, k, ascending = false)
      // Merge the whole sequence in given order
      bitonicMerge(arr, low, cnt, ascending)
    }
  }
}
