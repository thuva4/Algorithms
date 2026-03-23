package algorithms.sorting.partial

import scala.collection.mutable.PriorityQueue

/**
 * Partial Sort implementation.
 * Returns the smallest k elements of the array in sorted order.
 */
object PartialSort {
  def sort(arr: Array[Int]): Array[Int] = sort(arr, arr.length)

  def sort(arr: Array[Int], k: Int): Array[Int] = {
    if (k <= 0) {
      return Array.empty[Int]
    }
    if (k >= arr.length) {
      val result = arr.clone()
      java.util.Arrays.sort(result)
      return result
    }

    // Use a max-heap to keep track of the k smallest elements
    val maxHeap = PriorityQueue.empty[Int]

    for (num <- arr) {
      maxHeap.enqueue(num)
      if (maxHeap.size > k) {
        maxHeap.dequeue()
      }
    }

    val result = new Array[Int](k)
    for (i <- k - 1 to 0 by -1) {
      result(i) = maxHeap.dequeue()
    }

    result
  }
}
