object GCD {

  def main(args: Array[String]): Unit = {
    println(gcd(10,70))
  }

  def gcd(x: Int, y: Int) : Int = if (y==0) x else gcd(y, x%y)
}