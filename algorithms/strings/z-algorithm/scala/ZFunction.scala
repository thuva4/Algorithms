object ZFunction {

  def zFunction(arr: Array[Int]): Array[Int] = {
    val n = arr.length
    val z = Array.fill(n)(0)
    var l = 0
    var r = 0
    for (i <- 1 until n) {
      if (i < r) {
        z(i) = math.min(r - i, z(i - l))
      }
      while (i + z(i) < n && arr(z(i)) == arr(i + z(i))) {
        z(i) += 1
      }
      if (i + z(i) > r) {
        l = i
        r = i + z(i)
      }
    }
    z
  }
}
