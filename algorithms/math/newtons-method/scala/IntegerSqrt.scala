object IntegerSqrt {

  def integerSqrt(arr: Array[Int]): Int = {
    val n = arr(0).toLong
    if (n <= 1) return n.toInt
    var x = n
    while (true) {
      val x1 = (x + n / x) / 2
      if (x1 >= x) return x.toInt
      x = x1
    }
    0 // unreachable
  }
}
