object ModExp {

  def modExp(arr: Array[Int]): Int = {
    var base = arr(0).toLong
    var exp = arr(1).toLong
    val mod = arr(2).toLong
    if (mod == 1) return 0
    var result = 1L
    base = base % mod
    while (exp > 0) {
      if (exp % 2 == 1) {
        result = (result * base) % mod
      }
      exp >>= 1
      base = (base * base) % mod
    }
    result.toInt
  }
}
