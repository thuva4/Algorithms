object QuickSort {
  def sort(arr: Array[Int]): Unit = {
    if (arr.nonEmpty) {
      quickSort(arr, 0, arr.length - 1)
    }
  }

  private def quickSort(arr: Array[Int], low: Int, high: Int): Unit = {
    if (low < high) {
      val pi = partition(arr, low, high)

      quickSort(arr, low, pi - 1)
      quickSort(arr, pi + 1, high)
    }
  }

  private def partition(arr: Array[Int], low: Int, high: Int): Int = {
    val pivot = arr(high)
    var i = (low - 1)

    for (j <- low until high) {
      if (arr(j) < pivot) {
        i += 1
        val temp = arr(i)
        arr(i) = arr(j)
        arr(j) = temp
      }
    }

    val temp = arr(i + 1)
    arr(i + 1) = arr(high)
    arr(high) = temp

    return i + 1
  }
}
