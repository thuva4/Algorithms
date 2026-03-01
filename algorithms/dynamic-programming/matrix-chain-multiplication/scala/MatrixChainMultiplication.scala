object MatrixChainMultiplication {

  /**
   * Given a sequence of matrix dimensions, find the minimum number
   * of scalar multiplications needed to compute the chain product.
   *
   * @param dims array where matrix i has dimensions dims(i-1) x dims(i)
   * @return minimum number of scalar multiplications
   */
  def matrixChainOrder(dims: Array[Int]): Int = {
    val n = dims.length - 1 // number of matrices

    if (n <= 0) return 0

    val m = Array.ofDim[Int](n, n)

    for (chainLen <- 2 to n) {
      for (i <- 0 to n - chainLen) {
        val j = i + chainLen - 1
        m(i)(j) = Int.MaxValue
        for (k <- i until j) {
          val cost = m(i)(k) + m(k + 1)(j) +
                     dims(i) * dims(k + 1) * dims(j + 1)
          if (cost < m(i)(j)) {
            m(i)(j) = cost
          }
        }
      }
    }

    m(0)(n - 1)
  }

  def main(args: Array[String]): Unit = {
    println(matrixChainOrder(Array(10, 20, 30)))              // 6000
    println(matrixChainOrder(Array(40, 20, 30, 10, 30)))      // 26000
    println(matrixChainOrder(Array(10, 20, 30, 40, 30)))      // 30000
    println(matrixChainOrder(Array(1, 2, 3, 4)))              // 18
    println(matrixChainOrder(Array(5, 10, 3, 12, 5, 50, 6)))  // 2010
  }
}
