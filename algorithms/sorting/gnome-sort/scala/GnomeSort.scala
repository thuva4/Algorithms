package algorithms.sorting.gnome

/**
 * Gnome Sort implementation.
 * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
 * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
 */
object GnomeSort {
  def sort(arr: Array[Int]): Array[Int] = {
    val result = arr.clone()
    val n = result.length
    if (n < 2) {
      return result
    }
    var index = 0

    while (index < n) {
      if (index == 0) {
        index += 1
      }
      if (result(index) >= result(index - 1)) {
        index += 1
      } else {
        val temp = result(index)
        result(index) = result(index - 1)
        result(index - 1) = temp
        index -= 1
      }
    }

    result
  }
}
