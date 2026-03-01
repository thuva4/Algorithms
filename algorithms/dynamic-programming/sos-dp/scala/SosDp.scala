object SosDp {
  def sosDp(n: Int, f: Array[Int]): Array[Int] = {
    val size = 1 << n
    val sos = f.clone()

    for (i <- 0 until n) {
      for (mask <- 0 until size) {
        if ((mask & (1 << i)) != 0) {
          sos(mask) += sos(mask ^ (1 << i))
        }
      }
    }
    sos
  }

  def main(args: Array[String]): Unit = {
    val br = scala.io.StdIn
    val n = br.readLine().trim.toInt
    val f = br.readLine().trim.split(" ").map(_.toInt)
    val result = sosDp(n, f)
    println(result.mkString(" "))
  }
}
