object DisjointSparseTable {

  class DST(arr: Array[Int]) {
    var sz = 1; var levels = 0
    while (sz < arr.length) { sz <<= 1; levels += 1 }
    if (levels == 0) levels = 1
    val a = new Array[Long](sz)
    for (i <- arr.indices) a(i) = arr(i).toLong
    val table = Array.ofDim[Long](levels, sz)

    for (level <- 0 until levels) {
      val block = 1 << (level + 1)
      val half = block >> 1
      var start = 0
      while (start < sz) {
        val mid = start + half
        table(level)(mid) = a(mid)
        val end = math.min(start + block, sz)
        for (i <- mid + 1 until end)
          table(level)(i) = table(level)(i - 1) + a(i)
        if (mid - 1 >= start) {
          table(level)(mid - 1) = a(mid - 1)
          for (i <- (start to (mid - 2)).reverse)
            table(level)(i) = table(level)(i + 1) + a(i)
        }
        start += block
      }
    }

    def query(l: Int, r: Int): Long = {
      if (l == r) return a(l)
      val level = 31 - Integer.numberOfLeadingZeros(l ^ r)
      table(level)(l) + table(level)(r)
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val dst = new DST(arr)
    val q = input(idx); idx += 1
    val results = new Array[Long](q)
    for (i <- 0 until q) {
      val l = input(idx); idx += 1
      val r = input(idx); idx += 1
      results(i) = dst.query(l, r)
    }
    println(results.mkString(" "))
  }
}
