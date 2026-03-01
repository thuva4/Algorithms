import scala.collection.mutable

object PollardsRho {
  def gcd(a: Long, b: Long): Long = {
    var x = math.abs(a); var y = math.abs(b)
    while (y != 0) { val t = y; y = x % y; x = t }
    x
  }

  def isPrime(n: Long): Boolean = {
    if (n < 2) return false
    if (n < 4) return true
    if (n % 2 == 0 || n % 3 == 0) return false
    var i = 5L
    while (i * i <= n) {
      if (n % i == 0 || n % (i + 2) == 0) return false
      i += 6
    }
    true
  }

  def rho(n: Long): Long = {
    if (n % 2 == 0) return 2
    var x = 2L; var y = 2L; val c = 1L; var d = 1L
    while (d == 1) {
      x = (x * x + c) % n
      y = (y * y + c) % n
      y = (y * y + c) % n
      d = gcd(math.abs(x - y), n)
    }
    if (d != n) d else n
  }

  def pollardsRho(n: Long): Long = {
    if (n <= 1) return n
    if (isPrime(n)) return n
    var smallest = n
    val stack = mutable.Stack[Long](n)
    while (stack.nonEmpty) {
      val num = stack.pop()
      if (num > 1) {
        if (isPrime(num)) { smallest = math.min(smallest, num) }
        else {
          val d = rho(num)
          stack.push(d)
          stack.push(num / d)
        }
      }
    }
    smallest
  }

  def main(args: Array[String]): Unit = {
    println(pollardsRho(15))
    println(pollardsRho(13))
    println(pollardsRho(91))
    println(pollardsRho(221))
  }
}
