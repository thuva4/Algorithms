object LongestBitonicSubsequence {

  def longestBitonicSubsequence(arr: Array[Int]): Int = {
    val n = arr.length
    if (n == 0) return 0

    val lis = Array.fill(n)(1)
    val lds = Array.fill(n)(1)

    for (i <- 1 until n)
      for (j <- 0 until i)
        if (arr(j) < arr(i) && lis(j) + 1 > lis(i))
          lis(i) = lis(j) + 1

    for (i <- (0 until n - 1).reverse)
      for (j <- (i + 1 until n).reverse)
        if (arr(j) < arr(i) && lds(j) + 1 > lds(i))
          lds(i) = lds(j) + 1

    (0 until n).map(i => lis(i) + lds(i) - 1).max
  }

  def main(args: Array[String]): Unit = {
    println(longestBitonicSubsequence(Array(1, 3, 4, 2, 6, 1))) // 5
  }
}
