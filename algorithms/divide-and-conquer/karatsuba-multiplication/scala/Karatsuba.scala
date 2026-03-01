object Karatsuba {

  def karatsuba(arr: Array[Int]): Int = {
    multiply(arr(0).toLong, arr(1).toLong).toInt
  }

  private def multiply(x: Long, y: Long): Long = {
    if (x < 10 || y < 10) return x * y

    val n = math.max(x.abs.toString.length, y.abs.toString.length)
    val half = n / 2
    val power = math.pow(10, half).toLong

    val (x1, x0) = (x / power, x % power)
    val (y1, y0) = (y / power, y % power)

    val z0 = multiply(x0, y0)
    val z2 = multiply(x1, y1)
    val z1 = multiply(x0 + x1, y0 + y1) - z0 - z2

    z2 * power * power + z1 * power + z0
  }
}
