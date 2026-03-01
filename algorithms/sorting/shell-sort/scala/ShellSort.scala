object ShellSort {
  def sort(arr: Array[Int]): Unit = {
    val n = arr.length
    var gap = n / 2
    while (gap > 0) {
      for (i <- gap until n) {
        val temp = arr(i)
        var j = i
        while (j >= gap && arr(j - gap) > temp) {
          arr(j) = arr(j - gap)
          j -= gap
        }
        arr(j) = temp
      }
      gap /= 2
    }
  }
}
