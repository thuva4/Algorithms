object SuffixTree {
  def suffixTree(arr: Array[Int]): Int = {
    val n = arr.length
    if (n == 0) return 0
    var sa = Array.tabulate(n)(identity)
    var rank = arr.clone()
    val tmp = new Array[Int](n)
    var k = 1
    while (k < n) {
      val r = rank.clone(); val step = k
      sa = sa.sortWith((a, b) => {
        if (r(a) != r(b)) r(a) < r(b)
        else {
          val ra = if (a+step<n) r(a+step) else -1
          val rb = if (b+step<n) r(b+step) else -1
          ra < rb
        }
      })
      tmp(sa(0)) = 0
      for (i <- 1 until n) {
        tmp(sa(i)) = tmp(sa(i-1))
        val p0 = r(sa(i-1)); val c0 = r(sa(i))
        val p1 = if (sa(i-1)+step<n) r(sa(i-1)+step) else -1
        val c1 = if (sa(i)+step<n) r(sa(i)+step) else -1
        if (p0 != c0 || p1 != c1) tmp(sa(i)) += 1
      }
      rank = tmp.clone()
      if (rank(sa(n-1)) == n-1) { k = n }
      else k *= 2
    }
    val invSa = new Array[Int](n)
    val lcp = new Array[Int](n)
    for (i <- 0 until n) invSa(sa(i)) = i
    var h = 0
    for (i <- 0 until n) {
      if (invSa(i) > 0) {
        val j = sa(invSa(i)-1)
        while (i+h < n && j+h < n && arr(i+h) == arr(j+h)) h += 1
        lcp(invSa(i)) = h
        if (h > 0) h -= 1
      } else { h = 0 }
    }
    n * (n + 1) / 2 - lcp.sum
  }
}
