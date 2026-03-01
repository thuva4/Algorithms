object SparseTable {

  class SparseTableDS(arr: Array[Int]) {
    val n: Int = arr.length
    var k: Int = 1
    while ((1 << k) <= n) k += 1
    val table: Array[Array[Int]] = Array.ofDim[Int](k, n)
    val lg: Array[Int] = new Array[Int](n + 1)
    for (i <- 2 to n) lg(i) = lg(i / 2) + 1
    Array.copy(arr, 0, table(0), 0, n)
    for (j <- 1 until k)
      for (i <- 0 to n - (1 << j))
        table(j)(i) = math.min(table(j-1)(i), table(j-1)(i + (1 << (j-1))))

    def query(l: Int, r: Int): Int = {
      val kk = lg(r - l + 1)
      math.min(table(kk)(l), table(kk)(r - (1 << kk) + 1))
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val st = new SparseTableDS(arr)
    val q = input(idx); idx += 1
    val results = new Array[Int](q)
    for (i <- 0 until q) {
      val l = input(idx); idx += 1
      val r = input(idx); idx += 1
      results(i) = st.query(l, r)
    }
    println(results.mkString(" "))
  }
}
