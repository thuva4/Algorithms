object SelectionSort {
  def sort(arr: Array[Int]): Unit = {
    val n = arr.length
    for (i <- 0 until n - 1) {
      var min_idx = i
      for (j <- i + 1 until n) {
        if (arr(j) < arr(min_idx))
          min_idx = j
      }
      val temp = arr(min_idx)
      arr(min_idx) = arr(i)
      arr(i) = temp
    }
  }
}
