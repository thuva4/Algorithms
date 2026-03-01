object BinaryIndexedTree2D {

  class BIT2D(val rows: Int, val cols: Int) {
    val tree = Array.ofDim[Long](rows + 1, cols + 1)

    def update(r: Int, c: Int, v: Long): Unit = {
      var i = r + 1
      while (i <= rows) {
        var j = c + 1
        while (j <= cols) { tree(i)(j) += v; j += j & (-j) }
        i += i & (-i)
      }
    }

    def query(r: Int, c: Int): Long = {
      var s = 0L; var i = r + 1
      while (i > 0) {
        var j = c + 1
        while (j > 0) { s += tree(i)(j); j -= j & (-j) }
        i -= i & (-i)
      }
      s
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val rows = input(idx); idx += 1; val cols = input(idx); idx += 1
    val bit = new BIT2D(rows, cols)
    for (r <- 0 until rows; c <- 0 until cols) { val v = input(idx); idx += 1; if (v != 0) bit.update(r, c, v) }
    val q = input(idx); idx += 1
    val results = scala.collection.mutable.ArrayBuffer[Long]()
    for (_ <- 0 until q) {
      val t = input(idx); idx += 1; val r = input(idx); idx += 1
      val c = input(idx); idx += 1; val v = input(idx); idx += 1
      if (t == 1) bit.update(r, c, v) else results += bit.query(r, c)
    }
    println(results.mkString(" "))
  }
}
