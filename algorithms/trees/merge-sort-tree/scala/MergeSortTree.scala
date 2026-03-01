object MergeSortTree {

  class MST(arr: Array[Int]) {
    val n: Int = arr.length
    val tree: Array[Array[Int]] = new Array[Array[Int]](4 * n)
    build(arr, 1, 0, n - 1)

    private def build(a: Array[Int], nd: Int, s: Int, e: Int): Unit = {
      if (s == e) { tree(nd) = Array(a(s)); return }
      val m = (s + e) / 2
      build(a, 2*nd, s, m); build(a, 2*nd+1, m+1, e)
      tree(nd) = mergeSorted(tree(2*nd), tree(2*nd+1))
    }

    private def mergeSorted(a: Array[Int], b: Array[Int]): Array[Int] = {
      val r = new Array[Int](a.length + b.length)
      var i = 0; var j = 0; var k = 0
      while (i < a.length && j < b.length) { if (a(i) <= b(j)) { r(k) = a(i); i += 1 } else { r(k) = b(j); j += 1 }; k += 1 }
      while (i < a.length) { r(k) = a(i); i += 1; k += 1 }
      while (j < b.length) { r(k) = b(j); j += 1; k += 1 }
      r
    }

    private def upperBound(arr: Array[Int], k: Int): Int = {
      var lo = 0; var hi = arr.length
      while (lo < hi) { val m = (lo + hi) / 2; if (arr(m) <= k) lo = m + 1 else hi = m }
      lo
    }

    def countLeq(l: Int, r: Int, k: Int): Int = query(1, 0, n-1, l, r, k)

    private def query(nd: Int, s: Int, e: Int, l: Int, r: Int, k: Int): Int = {
      if (r < s || e < l) return 0
      if (l <= s && e <= r) return upperBound(tree(nd), k)
      val m = (s + e) / 2
      query(2*nd, s, m, l, r, k) + query(2*nd+1, m+1, e, l, r, k)
    }
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val mst = new MST(arr)
    val q = input(idx); idx += 1
    val results = new Array[Int](q)
    for (i <- 0 until q) {
      val l = input(idx); idx += 1; val r = input(idx); idx += 1; val k = input(idx); idx += 1
      results(i) = mst.countLeq(l, r, k)
    }
    println(results.mkString(" "))
  }
}
