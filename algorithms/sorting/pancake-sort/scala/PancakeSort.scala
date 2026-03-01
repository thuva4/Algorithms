package algorithms.sorting.pancake

/**
 * Pancake Sort implementation.
 * Sorts the array by repeatedly flipping subarrays.
 */
object PancakeSort {
  def sort(arr: Array[Int]): Array[Int] = {
    val result = arr.clone()
    val n = result.length

    for (currSize <- n to 2 by -1) {
      val mi = findMax(result, currSize)

      if (mi != currSize - 1) {
        flip(result, mi)
        flip(result, currSize - 1)
      }
    }

    result
  }

  private def flip(arr: Array[Int], k: Int): Unit = {
    var i = 0
    var j = k
    while (i < j) {
      val temp = arr(i)
      arr(i) = arr(j)
      arr(j) = temp
      i += 1
      j -= 1
    }
  }

  private def findMax(arr: Array[Int], n: Int): Int = {
    var mi = 0
    for (i <- 0 until n) {
      if (arr(i) > arr(mi)) {
        mi = i
      }
    }
    mi
  }
}
