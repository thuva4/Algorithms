object PostmanSort {
  def sort(arr: Array[Int]): Unit = {
    if (arr.isEmpty) return
    
    val min = arr.min
    var offset = 0
    
    if (min < 0) {
      offset = Math.abs(min)
      for (i <- arr.indices) {
        arr(i) += offset
      }
    }
    
    val max = arr.max
    var exp = 1
    
    while (max / exp > 0) {
      countSort(arr, exp)
      exp *= 10
    }
    
    if (offset > 0) {
      for (i <- arr.indices) {
        arr(i) -= offset
      }
    }
  }
  
  private def countSort(arr: Array[Int], exp: Int): Unit = {
    val n = arr.length
    val output = new Array[Int](n)
    val count = new Array[Int](10)
    
    for (i <- 0 until n) {
      count((arr(i) / exp) % 10) += 1
    }
    
    for (i <- 1 until 10) {
      count(i) += count(i - 1)
    }
    
    for (i <- n - 1 to 0 by -1) {
      output(count((arr(i) / exp) % 10) - 1) = arr(i)
      count((arr(i) / exp) % 10) -= 1
    }
    
    for (i <- 0 until n) {
      arr(i) = output(i)
    }
  }
}
