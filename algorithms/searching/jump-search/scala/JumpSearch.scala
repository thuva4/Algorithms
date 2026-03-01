import scala.math._

object JumpSearch {
  def search(arr: Array[Int], target: Int): Int = {
    val n = arr.length
    if (n == 0) return -1
    
    var step = sqrt(n).toInt
    var prev = 0
    
    while (arr(min(step, n) - 1) < target) {
      prev = step
      step += sqrt(n).toInt
      if (prev >= n) return -1
    }
    
    while (arr(prev) < target) {
      prev += 1
      if (prev == min(step, n)) return -1
    }
    
    if (arr(prev) == target) return prev
    
    -1
  }
}
