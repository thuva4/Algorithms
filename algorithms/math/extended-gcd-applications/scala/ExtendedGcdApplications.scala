object ExtendedGcdApplications {

  def extGcd(a: Long, b: Long): (Long, Long, Long) = {
    if (a == 0) return (b, 0L, 1L)
    val (g, x1, y1) = extGcd(b % a, a)
    (g, y1 - (b / a) * x1, x1)
  }

  def extendedGcdApplications(arr: Array[Int]): Int = {
    val a = arr(0).toLong; val m = arr(1).toLong
    val (g, x, _) = extGcd(((a % m) + m) % m, m)
    if (g != 1) return -1
    (((x % m) + m) % m).toInt
  }

  def main(args: Array[String]): Unit = {
    println(extendedGcdApplications(Array(3, 7)))
    println(extendedGcdApplications(Array(1, 13)))
    println(extendedGcdApplications(Array(6, 9)))
    println(extendedGcdApplications(Array(2, 11)))
  }
}
