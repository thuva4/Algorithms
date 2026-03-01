object SuffixArray {
  def suffixArray(arr: Array[Int]): Array[Int] = {
    val n = arr.length
    if (n == 0) return Array.empty[Int]
    var sa = Array.tabulate(n)(identity)
    var rank = arr.clone()
    val tmp = new Array[Int](n)
    var k = 1
    while (k < n) {
      val r = rank.clone()
      val step = k
      sa = sa.sortWith((a, b) => {
        if (r(a) != r(b)) r(a) < r(b)
        else {
          val ra = if (a + step < n) r(a + step) else -1
          val rb = if (b + step < n) r(b + step) else -1
          ra < rb
        }
      })
      tmp(sa(0)) = 0
      for (i <- 1 until n) {
        tmp(sa(i)) = tmp(sa(i - 1))
        val p0 = r(sa(i - 1)); val c0 = r(sa(i))
        val p1 = if (sa(i - 1) + step < n) r(sa(i - 1) + step) else -1
        val c1 = if (sa(i) + step < n) r(sa(i) + step) else -1
        if (p0 != c0 || p1 != c1) tmp(sa(i)) += 1
      }
      rank = tmp.clone()
      if (rank(sa(n - 1)) == n - 1) return sa
      k *= 2
    }
    sa
  }
}
