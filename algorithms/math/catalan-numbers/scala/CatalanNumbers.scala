object CatalanNumbers {

  val MOD: Long = 1000000007L

  def modPow(base: Long, exp: Long, mod: Long): Long = {
    var result = 1L
    var b = base % mod
    var e = exp
    while (e > 0) {
      if (e % 2 == 1) result = result * b % mod
      e /= 2
      b = b * b % mod
    }
    result
  }

  def modInv(a: Long, mod: Long): Long = modPow(a, mod - 2, mod)

  def catalanNumbers(n: Int): Int = {
    var result = 1L
    for (i <- 1 to n) {
      result = result * (2L * (2 * i - 1)) % MOD
      result = result * modInv(i + 1, MOD) % MOD
    }
    result.toInt
  }
}
