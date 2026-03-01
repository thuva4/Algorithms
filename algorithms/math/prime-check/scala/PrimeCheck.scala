object PrimeCheck {
  def isPrime(n: Int): Boolean = {
    if (n <= 1) return false
    if (n <= 3) return true
    if (n % 2 == 0 || n % 3 == 0) return false

    var i = 5
    while (i * i <= n) {
      if (n % i == 0 || n % (i + 2) == 0) return false
      i += 6
    }
    true
  }

  def main(args: Array[String]): Unit = {
    println(s"2 is prime: ${isPrime(2)}")
    println(s"4 is prime: ${isPrime(4)}")
    println(s"97 is prime: ${isPrime(97)}")
  }
}
