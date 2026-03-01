package algorithms.sorting.counting

/**
 * Counting Sort implementation.
 * Efficient for sorting integers with a known small range.
 */
object CountingSort {
  def sort(arr: Array[Int]): Array[Int] = {
    if (arr.isEmpty) {
      return Array.empty[Int]
    }

    val minVal = arr.min
    val maxVal = arr.max
    val range = maxVal - minVal + 1

    val count = new Array[Int](range)
    val output = new Array[Int](arr.length)

    for (x <- arr) {
      count(x - minVal) += 1
    }

    for (i <- 1 until range) {
      count(i) += count(i - 1)
    }

    for (i <- arr.indices.reverse) {
      output(count(arr(i) - minVal) - 1) = arr(i)
      count(arr(i) - minVal) -= 1
    }

    output
  }
}
