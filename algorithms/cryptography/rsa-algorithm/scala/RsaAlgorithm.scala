object RsaAlgorithm {
  def rsaAlgorithm(p: Long, q: Long, e: Long, message: Long): Long = {
    val n = p * q
    val phi = (p - 1) * (q - 1)
    val bE = BigInt(e)
    val bPhi = BigInt(phi)
    val bN = BigInt(n)
    val d = bE.modInverse(bPhi)
    val cipher = BigInt(message).modPow(bE, bN)
    cipher.modPow(d, bN).toLong
  }

  def main(args: Array[String]): Unit = {
    println(rsaAlgorithm(61, 53, 17, 65))
    println(rsaAlgorithm(61, 53, 17, 42))
    println(rsaAlgorithm(11, 13, 7, 9))
  }
}
