object LucasTheorem {
  def modPow(base: Long, exp: Long, mod: Long): Long = {
    var b = base % mod; var e = exp; var result = 1L
    while (e > 0) {
      if ((e & 1) == 1) result = result * b % mod
      e >>= 1; b = b * b % mod
    }
    result
  }

  def lucasTheorem(n: Long, k: Long, p: Int): Int = {
    if (k > n) return 0
    val pp = p.toLong
    val fact = Array.ofDim[Long](p)
    fact(0) = 1
    for (i <- 1 until p) fact(i) = fact(i - 1) * i % pp

    var result = 1L; var nn = n; var kk = k
    while (nn > 0 || kk > 0) {
      val ni = (nn % pp).toInt; val ki = (kk % pp).toInt
      if (ki > ni) return 0
      val c = fact(ni) * modPow(fact(ki), pp - 2, pp) % pp * modPow(fact(ni - ki), pp - 2, pp) % pp
      result = result * c % pp
      nn /= pp; kk /= pp
    }
    result.toInt
  }

  def main(args: Array[String]): Unit = {
    println(lucasTheorem(10, 3, 7))
    println(lucasTheorem(5, 2, 3))
    println(lucasTheorem(100, 50, 13))
  }
}
