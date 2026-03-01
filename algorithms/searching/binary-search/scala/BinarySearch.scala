object BinarySearch {
  def search(arr: Array[Int], target: Int): Int = {
    var left = 0
    var right = arr.length - 1
    
    while (left <= right) {
      val mid = left + (right - left) / 2
      
      if (arr(mid) == target)
        return mid
      
      if (arr(mid) < target)
        left = mid + 1
      else
        right = mid - 1
    }
    
    -1
  }
}
