object TimSort {
  private val RUN = 32

  def sort(arr: Array[Int]): Unit = {
    val n = arr.length
    for (i <- 0 until n by RUN) {
      insertionSort(arr, i, math.min((i + RUN - 1), (n - 1)))
    }

    var size = RUN
    while (size < n) {
      for (left <- 0 until n by 2 * size) {
        val mid = left + size - 1
        val right = math.min((left + 2 * size - 1), (n - 1))

        if (mid < right) {
          merge(arr, left, mid, right)
        }
      }
      size *= 2
    }
  }

  private def insertionSort(arr: Array[Int], left: Int, right: Int): Unit = {
    for (i <- left + 1 to right) {
      val temp = arr(i)
      var j = i - 1
      while (j >= left && arr(j) > temp) {
        arr(j + 1) = arr(j)
        j -= 1
      }
      arr(j + 1) = temp
    }
  }

  private def merge(arr: Array[Int], l: Int, m: Int, r: Int): Unit = {
    val len1 = m - l + 1
    val len2 = r - m
    val left = new Array[Int](len1)
    val right = new Array[Int](len2)

    for (x <- 0 until len1) {
      left(x) = arr(l + x)
    }
    for (x <- 0 until len2) {
      right(x) = arr(m + 1 + x)
    }

    var i = 0
    var j = 0
    var k = l

    while (i < len1 && j < len2) {
      if (left(i) <= right(j)) {
        arr(k) = left(i)
        i += 1
      } else {
        arr(k) = right(j)
        j += 1
      }
      k += 1
    }

    while (i < len1) {
      arr(k) = left(i)
      k += 1
      i += 1
    }

    while (j < len2) {
      arr(k) = right(j)
      k += 1
      j += 1
    }
  }
}
