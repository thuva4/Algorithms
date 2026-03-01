object PersistentSegmentTree {
  val vals = scala.collection.mutable.ArrayBuffer[Long]()
  val lefts = scala.collection.mutable.ArrayBuffer[Int]()
  val rights = scala.collection.mutable.ArrayBuffer[Int]()

  def newNode(v: Long, l: Int = 0, r: Int = 0): Int = {
    val id = vals.size; vals += v; lefts += l; rights += r; id
  }

  def build(a: Array[Int], s: Int, e: Int): Int = {
    if (s == e) return newNode(a(s))
    val m = (s + e) / 2
    val l = build(a, s, m); val r = build(a, m + 1, e)
    newNode(vals(l) + vals(r), l, r)
  }

  def update(nd: Int, s: Int, e: Int, idx: Int, v: Int): Int = {
    if (s == e) return newNode(v)
    val m = (s + e) / 2
    if (idx <= m) {
      val nl = update(lefts(nd), s, m, idx, v)
      newNode(vals(nl) + vals(rights(nd)), nl, rights(nd))
    } else {
      val nr = update(rights(nd), m + 1, e, idx, v)
      newNode(vals(lefts(nd)) + vals(nr), lefts(nd), nr)
    }
  }

  def query(nd: Int, s: Int, e: Int, l: Int, r: Int): Long = {
    if (r < s || e < l) return 0
    if (l <= s && e <= r) return vals(nd)
    val m = (s + e) / 2
    query(lefts(nd), s, m, l, r) + query(rights(nd), m + 1, e, l, r)
  }

  def main(args: Array[String]): Unit = {
    val input = scala.io.StdIn.readLine().trim.split("\\s+").map(_.toInt)
    var idx = 0
    val n = input(idx); idx += 1
    val arr = input.slice(idx, idx + n); idx += n
    val roots = scala.collection.mutable.ArrayBuffer(build(arr, 0, n - 1))
    val q = input(idx); idx += 1
    val results = scala.collection.mutable.ArrayBuffer[Long]()
    for (_ <- 0 until q) {
      val t = input(idx); idx += 1; val a1 = input(idx); idx += 1
      val b1 = input(idx); idx += 1; val c1 = input(idx); idx += 1
      if (t == 1) roots += update(roots(a1), 0, n - 1, b1, c1)
      else results += query(roots(a1), 0, n - 1, b1, c1)
    }
    println(results.mkString(" "))
  }
}
