package algorithms.sorting.bogo

import scala.util.Random

/**
 * Bogo Sort implementation.
 * Repeatedly shuffles the array until it's sorted.
 * WARNING: Highly inefficient for large arrays.
 */
object BogoSort {
  private val random = new Random()

  def sort(arr: Array[Int]): Array[Int] = {
    if (arr.length <= 1) {
      return arr.clone()
    }

    val result = arr.clone()
    while (!isSorted(result)) {
      shuffle(result)
    }
    result
  }

  private def isSorted(arr: Array[Int]): Boolean = {
    for (i <- 0 until arr.length - 1) {
      if (arr[i] > arr[i + 1]) {
        return false
      }
    }
    true
  }

  private def shuffle(arr: Array[Int]): Unit = {
    for (i <- arr.length - 1 to 1 by -1) {
      val j = random.nextInt(i + 1)
      val temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
  }
}
