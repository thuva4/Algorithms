package algorithms.sorting.cycle

/**
 * Cycle Sort implementation.
 * An in-place, unstable sorting algorithm that is optimal in terms of
 * the number of writes to the original array.
 */
object CycleSort {
  def sort(arr: Array[Int]): Array[Int] = {
    val result = arr.clone()
    val n = result.length

    for (cycleStart <- 0 until n - 1) {
      var item = result(cycleStart)

      var pos = cycleStart
      for (i <- cycleStart + 1 until n) {
        if (result(i) < item) {
          pos += 1
        }
      }

      if (pos != cycleStart) {
        while (item == result(pos)) {
          pos += 1
        }

        if (pos != cycleStart) {
          val temp = item
          item = result(pos)
          result(pos) = temp
        }

        while (pos != cycleStart) {
          pos = cycleStart
          for (i <- cycleStart + 1 until n) {
            if (result(i) < item) {
              pos += 1
            }
          }

          while (item == result(pos)) {
            pos += 1
          }

          if (item != result(pos)) {
            val temp = item
            item = result(pos)
            result(pos) = temp
          }
        }
      }
    }

    result
  }
}
