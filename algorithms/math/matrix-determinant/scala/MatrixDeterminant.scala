object MatrixDeterminant {
  def matrixDeterminant(arr: Array[Int]): Int = {
    var idx = 0
    val n = arr(idx); idx += 1
    val mat = Array.ofDim[Double](n, n)
    for (i <- 0 until n; j <- 0 until n) {
      mat(i)(j) = arr(idx).toDouble; idx += 1
    }

    var det = 1.0
    for (col <- 0 until n) {
      var maxRow = col
      for (row <- col + 1 until n) {
        if (math.abs(mat(row)(col)) > math.abs(mat(maxRow)(col))) maxRow = row
      }
      if (maxRow != col) {
        val tmp = mat(col); mat(col) = mat(maxRow); mat(maxRow) = tmp
        det *= -1.0
      }
      if (mat(col)(col) == 0.0) return 0
      det *= mat(col)(col)
      for (row <- col + 1 until n) {
        val factor = mat(row)(col) / mat(col)(col)
        for (j <- col + 1 until n) {
          mat(row)(j) -= factor * mat(col)(j)
        }
      }
    }
    math.round(det).toInt
  }

  def main(args: Array[String]): Unit = {
    println(matrixDeterminant(Array(2, 1, 2, 3, 4)))
    println(matrixDeterminant(Array(2, 1, 0, 0, 1)))
    println(matrixDeterminant(Array(3, 6, 1, 1, 4, -2, 5, 2, 8, 7)))
    println(matrixDeterminant(Array(1, 5)))
  }
}
