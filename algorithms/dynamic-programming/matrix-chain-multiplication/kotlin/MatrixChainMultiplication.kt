/**
 * Given a sequence of matrix dimensions, find the minimum number
 * of scalar multiplications needed to compute the chain product.
 *
 * @param dims array where matrix i has dimensions dims[i-1] x dims[i]
 * @return minimum number of scalar multiplications
 */
fun matrixChainOrder(dims: IntArray): Int {
    val n = dims.size - 1 // number of matrices

    if (n <= 0) return 0

    val m = Array(n) { IntArray(n) }

    for (chainLen in 2..n) {
        for (i in 0..n - chainLen) {
            val j = i + chainLen - 1
            m[i][j] = Int.MAX_VALUE
            for (k in i until j) {
                val cost = m[i][k] + m[k + 1][j] +
                           dims[i] * dims[k + 1] * dims[j + 1]
                if (cost < m[i][j]) {
                    m[i][j] = cost
                }
            }
        }
    }

    return m[0][n - 1]
}

fun main() {
    println(matrixChainOrder(intArrayOf(10, 20, 30)))              // 6000
    println(matrixChainOrder(intArrayOf(40, 20, 30, 10, 30)))      // 26000
    println(matrixChainOrder(intArrayOf(10, 20, 30, 40, 30)))      // 30000
    println(matrixChainOrder(intArrayOf(1, 2, 3, 4)))              // 18
    println(matrixChainOrder(intArrayOf(5, 10, 3, 12, 5, 50, 6)))  // 2010
}
