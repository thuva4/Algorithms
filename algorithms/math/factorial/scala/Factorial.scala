object Factorial {
  def factorial(n: Int): Long = {
    var result: Long = 1
    for (i <- 2 to n) {
      result *= i
    }
    result
  }

  def main(args: Array[String]): Unit = {
    println(s"5! = ${factorial(5)}")
    println(s"10! = ${factorial(10)}")
    println(s"0! = ${factorial(0)}")
  }
}
