object FibonacciSearch {
  def search(arr: Array[Int], target: Int): Int = {
    val n = arr.length
    if (n == 0) return -1
    
    var fibMMm2 = 0
    var fibMMm1 = 1
    var fibM = fibMMm2 + fibMMm1
    
    while (fibM < n) {
      fibMMm2 = fibMMm1
      fibMMm1 = fibM
      fibM = fibMMm2 + fibMMm1
    }
    
    var offset = -1
    
    while (fibM > 1) {
      val i = math.min(offset + fibMMm2, n - 1)
      
      if (arr(i) < target) {
        fibM = fibMMm1
        fibMMm1 = fibMMm2
        fibMMm2 = fibM - fibMMm1
        offset = i
      } else if (arr(i) > target) {
        fibM = fibMMm2
        fibMMm1 = fibMMm1 - fibMMm2
        fibMMm2 = fibM - fibMMm1
      } else {
        return i
      }
    }
    
    if (fibMMm1 == 1 && offset + 1 < n && arr(offset + 1) == target)
      return offset + 1
      
    -1
  }
}
