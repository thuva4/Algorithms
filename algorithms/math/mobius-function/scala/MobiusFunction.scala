object MobiusFunction {
  def mobiusFunction(n: Int): Int = {
    val mu = Array.fill(n + 1)(1)
    mu(1) = 1
    val isPrime = Array.fill(n + 1)(true)
    if (n >= 0) {
      isPrime(0) = false
    }
    if (n >= 1) {
      isPrime(1) = false
    }

    for (i <- 2 to n) {
      if (isPrime(i)) {
        var j = i
        while (j <= n) {
          if (j != i) {
            isPrime(j) = false
          }
          mu(j) = -mu(j)
          j += i
        }
        val i2 = i.toLong * i
        var k = i2
        while (k <= n) {
          mu(k.toInt) = 0
          k += i2
        }
      }
    }
    mu.drop(1).sum
  }

  def main(args: Array[String]): Unit = {
    println(mobiusFunction(1))
    println(mobiusFunction(10))
    println(mobiusFunction(50))
  }
}
