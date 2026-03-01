import scala.collection.mutable

object DiscreteLogarithm {
  def modPow(base: Long, exp: Long, mod: Long): Long = {
    var b = base % mod; var e = exp; var result = 1L
    while (e > 0) {
      if ((e & 1) == 1) result = result * b % mod
      e >>= 1
      b = b * b % mod
    }
    result
  }

  def discreteLogarithm(base: Long, target: Long, modulus: Long): Int = {
    if (modulus == 1) return 0
    val m = math.ceil(math.sqrt(modulus.toDouble)).toLong
    val t = target % modulus

    val table = mutable.HashMap[Long, Int]()
    var power = 1L
    for (j <- 0 until m.toInt) {
      if (power == t) return j
      table(power) = j
      power = power * base % modulus
    }

    val baseInvM = modPow(base, modulus - 1 - (m % (modulus - 1)), modulus)
    var gamma = t
    for (i <- 0 until m.toInt) {
      table.get(gamma) match {
        case Some(j) => return i * m.toInt + j
        case None    =>
      }
      gamma = gamma * baseInvM % modulus
    }
    -1
  }

  def main(args: Array[String]): Unit = {
    println(discreteLogarithm(2, 8, 13))
    println(discreteLogarithm(5, 1, 7))
    println(discreteLogarithm(3, 3, 11))
    println(discreteLogarithm(3, 13, 17))
  }
}
