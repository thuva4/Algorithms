object Ntt {
  val NTT_MOD = 998244353L

  def ntt(data: Array[Int]): Array[Int] = {
    var idx = 0
    val na = data(idx); idx += 1
    val a = Array.tabulate(na)(i => ((data(idx + i).toLong % NTT_MOD) + NTT_MOD) % NTT_MOD)
    idx += na
    val nb = data(idx); idx += 1
    val b = Array.tabulate(nb)(i => ((data(idx + i).toLong % NTT_MOD) + NTT_MOD) % NTT_MOD)

    val resultLen = na + nb - 1
    val result = Array.fill(resultLen)(0L)
    for (i <- 0 until na; j <- 0 until nb)
      result(i + j) = (result(i + j) + a(i) * b(j)) % NTT_MOD
    result.map(_.toInt)
  }

  def main(args: Array[String]): Unit = {
    println(ntt(Array(2, 1, 2, 2, 3, 4)).mkString(", "))
    println(ntt(Array(2, 1, 1, 2, 1, 1)).mkString(", "))
  }
}
