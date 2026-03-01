object CountingInversions {
  def countInversions(arr: Array[Int]): Int = {
    val temp = new Array[Int](arr.length)
    mergeSortCount(arr, temp, 0, arr.length - 1)
  }

  def mergeSortCount(arr: Array[Int], temp: Array[Int], left: Int, right: Int): Int = {
    var invCount = 0
    if (left < right) {
      val mid = (left + right) / 2
      invCount += mergeSortCount(arr, temp, left, mid)
      invCount += mergeSortCount(arr, temp, mid + 1, right)
      invCount += merge(arr, temp, left, mid + 1, right)
    }
    invCount
  }

  def merge(arr: Array[Int], temp: Array[Int], left: Int, mid: Int, right: Int): Int = {
    var i = left
    var j = mid
    var k = left
    var invCount = 0

    while (i < mid && j <= right) {
      if (arr(i) <= arr(j)) {
        temp(k) = arr(i); i += 1
      } else {
        temp(k) = arr(j); j += 1
        invCount += (mid - i)
      }
      k += 1
    }
    while (i < mid) { temp(k) = arr(i); i += 1; k += 1 }
    while (j <= right) { temp(k) = arr(j); j += 1; k += 1 }
    for (idx <- left to right) arr(idx) = temp(idx)

    invCount
  }

  def main(args: Array[String]): Unit = {
    val arr = Array(2, 4, 1, 3, 5)
    println(s"Number of inversions: ${countInversions(arr)}")
  }
}
