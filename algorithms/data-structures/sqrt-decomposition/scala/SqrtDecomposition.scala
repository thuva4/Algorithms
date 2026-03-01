object SqrtDecomposition {

  class SqrtDecomp(arr: Array[Int]) {
    val n: Int = arr.length
    val blockSz: Int = math.max(1, math.sqrt(n.toDouble).toInt)
    val a: Array[Int] = arr.clone()
    val blocks: Array[Long] = new Array[Long]((n + blockSz - 1) / blockSz)
    for (i <- 0 until n) blocks(i / blockSz) += a(i)

    def query(l: Int, r: Int): Long = {
      var result = 0L
      val bl = l / blockSz; val br = r / blockSz
      if (bl == br) {
        for (i <- l to r) result += a(i)
      } else {
        for (i <- l until (bl + 1) * blockSz) result += a(i)
        for (b <- bl + 1 until br) result += blocks(b)
        for (i <- br * blockSz to r) result += a(i)
      }
      result
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val sd = new SqrtDecomp(arr)
    val q = input(idx); idx += 1
    val results = new Array[Long](q)
    for (i <- 0 until q) {
      val l = input(idx); idx += 1
      val r = input(idx); idx += 1
      results(i) = sd.query(l, r)
    }
    println(results.mkString(" "))
  }
}
