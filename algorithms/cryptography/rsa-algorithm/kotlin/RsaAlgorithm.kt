import java.math.BigInteger

fun rsaAlgorithm(p: Long, q: Long, e: Long, message: Long): Long {
    val n = p * q
    val phi = (p - 1) * (q - 1)
    val bE = BigInteger.valueOf(e)
    val bPhi = BigInteger.valueOf(phi)
    val bN = BigInteger.valueOf(n)
    val d = bE.modInverse(bPhi)
    val cipher = BigInteger.valueOf(message).modPow(bE, bN)
    return cipher.modPow(d, bN).toLong()
}

fun main() {
    println(rsaAlgorithm(61, 53, 17, 65))
    println(rsaAlgorithm(61, 53, 17, 42))
    println(rsaAlgorithm(11, 13, 7, 9))
}
