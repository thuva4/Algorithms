object ModifiedBinarySearch {
  def search(arr: Array[Int], target: Int): Int = {
    if (arr.isEmpty) return -1
    
    var start = 0
    var end = arr.length - 1
    
    val isAscending = arr(start) <= arr(end)
    
    while (start <= end) {
      val mid = start + (end - start) / 2
      
      if (arr(mid) == target)
        return mid
        
      if (isAscending) {
        if (target < arr(mid))
          end = mid - 1
        else
          start = mid + 1
      } else {
        if (target > arr(mid))
          end = mid - 1
        else
          start = mid + 1
      }
    }
    -1
  }
}
