object SegmentTreeLazy {

  class SegTreeLazy(arr: Array[Int]) {
    val n: Int = arr.length
    val tree = new Array[Long](4 * n)
    val lazy = new Array[Long](4 * n)
    build(arr, 1, 0, n - 1)

    private def build(a: Array[Int], nd: Int, s: Int, e: Int): Unit = {
      if (s == e) { tree(nd) = a(s); return }
      val m = (s + e) / 2
      build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e)
      tree(nd) = tree(2*nd) + tree(2*nd+1)
    }

    private def applyNode(nd: Int, s: Int, e: Int, v: Long): Unit = {
      tree(nd) += v * (e - s + 1); lazy(nd) += v
    }

    private def pushDown(nd: Int, s: Int, e: Int): Unit = {
      if (lazy(nd) != 0) {
        val m = (s + e) / 2
        applyNode(2*nd, s, m, lazy(nd)); applyNode(2*nd+1, m+1, e, lazy(nd))
        lazy(nd) = 0
      }
    }

    def update(l: Int, r: Int, v: Long): Unit = doUpdate(1, 0, n-1, l, r, v)

    private def doUpdate(nd: Int, s: Int, e: Int, l: Int, r: Int, v: Long): Unit = {
      if (r < s || e < l) return
      if (l <= s && e <= r) { applyNode(nd, s, e, v); return }
      pushDown(nd, s, e)
      val m = (s + e) / 2
      doUpdate(2*nd, s, m, l, r, v); doUpdate(2*nd+1, m+1, e, l, r, v)
      tree(nd) = tree(2*nd) + tree(2*nd+1)
    }

    def query(l: Int, r: Int): Long = doQuery(1, 0, n-1, l, r)

    private def doQuery(nd: Int, s: Int, e: Int, l: Int, r: Int): Long = {
      if (r < s || e < l) return 0
      if (l <= s && e <= r) return tree(nd)
      pushDown(nd, s, e)
      val m = (s + e) / 2
      doQuery(2*nd, s, m, l, r) + doQuery(2*nd+1, m+1, e, l, r)
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val st = new SegTreeLazy(arr)
    val q = input(idx); idx += 1
    val results = scala.collection.mutable.ArrayBuffer[Long]()
    for (_ <- 0 until q) {
      val t = input(idx); idx += 1; val l = input(idx); idx += 1
      val r = input(idx); idx += 1; val v = input(idx); idx += 1
      if (t == 1) st.update(l, r, v.toLong) else results += st.query(l, r)
    }
    println(results.mkString(" "))
  }
}
