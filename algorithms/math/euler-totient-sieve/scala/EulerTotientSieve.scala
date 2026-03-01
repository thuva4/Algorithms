object EulerTotientSieve {
  def eulerTotientSieve(n: Int): Long = {
    val phi = Array.tabulate(n + 1)(identity)
    for (i <- 2 to n) {
      if (phi(i) == i) {
        var j = i
        while (j <= n) {
          phi(j) -= phi(j) / i
          j += i
        }
      }
    }
    phi.drop(1).map(_.toLong).sum
  }

  def main(args: Array[String]): Unit = {
    println(eulerTotientSieve(1))
    println(eulerTotientSieve(10))
    println(eulerTotientSieve(100))
  }
}
