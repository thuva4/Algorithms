object DiffieHellman {
  def modPow(base: Long, exp: Long, mod: Long): Long = {
    var result = 1L
    var b = base % mod
    var e = exp
    while (e > 0) {
      if ((e & 1) == 1)
        result = (result * b) % mod
      e >>= 1
      b = (b * b) % mod
    }
    result
  }

  def main(args: Array[String]): Unit = {
    val p = 23L
    val g = 5L
    val a = 6L
    val b = 15L

    val publicA = modPow(g, a, p)
    println(s"Alice sends: $publicA")

    val publicB = modPow(g, b, p)
    println(s"Bob sends: $publicB")

    val aliceSecret = modPow(publicB, a, p)
    println(s"Alice's shared secret: $aliceSecret")

    val bobSecret = modPow(publicA, b, p)
    println(s"Bob's shared secret: $bobSecret")
  }
}
