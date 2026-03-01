object CountSetBits {

  def countSetBits(arr: Array[Int]): Int = {
    var total = 0
    for (num <- arr) {
      var n = num
      while (n != 0) {
        total += 1
        n = n & (n - 1)
      }
    }
    total
  }
}
