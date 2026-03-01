package algorithms.sorting.pigeonhole

import scala.collection.mutable.ListBuffer

/**
 * Pigeonhole Sort implementation.
 * Efficient for sorting lists of integers where the number of elements is roughly the same as the number of possible key values.
 */
object PigeonholeSort {
  def sort(arr: Array[Int]): Array[Int] = {
    if (arr.isEmpty) {
      return Array.empty[Int]
    }

    val minVal = arr.min
    val maxVal = arr.max
    val range = maxVal - minVal + 1

    val holes = Array.fill(range)(ListBuffer.empty[Int])

    for (x <- arr) {
      holes(x - minVal) += x
    }

    val result = new Array[Int](arr.length)
    var k = 0
    for (hole <- holes) {
      for (x <- hole) {
        result(k) = x
        k += 1
      }
    }

    result
  }
}
