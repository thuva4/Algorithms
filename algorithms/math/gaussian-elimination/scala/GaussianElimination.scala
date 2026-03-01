object GaussianElimination {

  def gaussianElimination(arr: Array[Int]): Int = {
    var idx = 0; val n = arr(idx); idx += 1
    val mat = Array.ofDim[Double](n, n+1)
    for (i <- 0 until n; j <- 0 to n) { mat(i)(j) = arr(idx).toDouble; idx += 1 }
    for (col <- 0 until n) {
      var maxRow = col
      for (row <- col+1 until n) if (math.abs(mat(row)(col)) > math.abs(mat(maxRow)(col))) maxRow = row
      val tmp = mat(col); mat(col) = mat(maxRow); mat(maxRow) = tmp
      for (row <- col+1 until n) {
        if (mat(col)(col) != 0) {
          val f = mat(row)(col) / mat(col)(col)
          for (j <- col to n) mat(row)(j) -= f * mat(col)(j)
        }
      }
    }
    val sol = new Array[Double](n)
    for (i <- (n-1) to 0 by -1) {
      sol(i) = mat(i)(n)
      for (j <- i+1 until n) sol(i) -= mat(i)(j) * sol(j)
      sol(i) /= mat(i)(i)
    }
    math.round(sol.sum).toInt
  }

  def main(args: Array[String]): Unit = {
    println(gaussianElimination(Array(2, 1, 1, 3, 2, 1, 4)))
    println(gaussianElimination(Array(2, 1, 0, 5, 0, 1, 3)))
    println(gaussianElimination(Array(1, 2, 6)))
    println(gaussianElimination(Array(3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9)))
  }
}
