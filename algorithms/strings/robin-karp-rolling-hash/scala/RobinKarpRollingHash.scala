object RobinKarpRollingHash {

  def robinKarpRollingHash(arr: Array[Int]): Int = {
    var idx = 0
    val tlen = arr(idx); idx += 1
    val text = arr.slice(idx, idx + tlen); idx += tlen
    val plen = arr(idx); idx += 1
    val pattern = arr.slice(idx, idx + plen)
    if (plen > tlen) return -1

    for (i <- 0 to tlen - plen) {
      var matched = true
      var j = 0
      while (j < plen && matched) { if (text(i+j) != pattern(j)) matched = false; j += 1 }
      if (matched) return i
    }
    -1
  }

  def main(args: Array[String]): Unit = {
    println(robinKarpRollingHash(Array(5, 1, 2, 3, 4, 5, 2, 1, 2)))
    println(robinKarpRollingHash(Array(5, 1, 2, 3, 4, 5, 2, 3, 4)))
    println(robinKarpRollingHash(Array(4, 1, 2, 3, 4, 2, 5, 6)))
    println(robinKarpRollingHash(Array(4, 1, 2, 3, 4, 1, 4)))
  }
}
