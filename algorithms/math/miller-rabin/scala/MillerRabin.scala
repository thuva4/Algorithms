object MillerRabin {

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

  def millerRabin(n: Int): Int = {
    if (n < 2) return 0
    if (n < 4) return 1
    if (n % 2 == 0) return 0

    var r = 0
    var d = (n - 1).toLong
    while (d % 2 == 0) { r += 1; d /= 2 }

    val witnesses = Array(2L, 3L, 5L, 7L)
    for (a <- witnesses) {
      if (a < n) {
        var x = modPow(a, d, n.toLong)
        if (x != 1 && x != n - 1) {
          var found = false
          var i = 0
          while (i < r - 1 && !found) {
            x = modPow(x, 2, n.toLong)
            if (x == n - 1) found = true
            i += 1
          }
          if (!found) return 0
        }
      }
    }

    1
  }
}
