object SieveOfEratosthenes {
  def sieveOfEratosthenes(n: Int): List[Int] = {
    if (n < 2) return List.empty

    val isPrime = Array.fill(n + 1)(true)
    isPrime(0) = false
    isPrime(1) = false

    var i = 2
    while (i * i <= n) {
      if (isPrime(i)) {
        var j = i * i
        while (j <= n) {
          isPrime(j) = false
          j += i
        }
      }
      i += 1
    }

    (2 to n).filter(isPrime(_)).toList
  }

  def main(args: Array[String]): Unit = {
    println(s"Primes up to 30: ${sieveOfEratosthenes(30)}")
  }
}
