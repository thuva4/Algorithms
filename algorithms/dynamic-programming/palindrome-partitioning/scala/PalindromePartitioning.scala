object PalindromePartitioning {

  def palindromePartitioning(arr: Array[Int]): Int = {
    val n = arr.length
    if (n <= 1) return 0

    val isPal = Array.ofDim[Boolean](n, n)
    for (i <- 0 until n) isPal(i)(i) = true
    for (i <- 0 until n - 1) isPal(i)(i+1) = arr(i) == arr(i+1)
    for (len <- 3 to n; i <- 0 to n - len) {
      val j = i + len - 1
      isPal(i)(j) = arr(i) == arr(j) && isPal(i+1)(j-1)
    }

    val cuts = new Array[Int](n)
    for (i <- 0 until n) {
      if (isPal(0)(i)) { cuts(i) = 0 }
      else {
        cuts(i) = i
        for (j <- 1 to i)
          if (isPal(j)(i) && cuts(j-1) + 1 < cuts(i)) cuts(i) = cuts(j-1) + 1
      }
    }
    cuts(n-1)
  }

  def main(args: Array[String]): Unit = {
    println(palindromePartitioning(Array(1, 2, 1)))
    println(palindromePartitioning(Array(1, 2, 3, 2)))
    println(palindromePartitioning(Array(1, 2, 3)))
    println(palindromePartitioning(Array(5)))
  }
}
