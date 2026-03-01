import kotlin.math.abs
import kotlin.math.roundToInt

fun gaussianElimination(arr: IntArray): Int {
    var idx = 0; val n = arr[idx++]
    val mat = Array(n) { DoubleArray(n+1) { arr[idx++].toDouble() } }
    for (col in 0 until n) {
        var maxRow = col
        for (row in col+1 until n) if (abs(mat[row][col]) > abs(mat[maxRow][col])) maxRow = row
        val tmp = mat[col]; mat[col] = mat[maxRow]; mat[maxRow] = tmp
        for (row in col+1 until n) {
            if (mat[col][col] == 0.0) continue
            val f = mat[row][col] / mat[col][col]
            for (j in col..n) mat[row][j] -= f * mat[col][j]
        }
    }
    val sol = DoubleArray(n)
    for (i in n-1 downTo 0) {
        sol[i] = mat[i][n]
        for (j in i+1 until n) sol[i] -= mat[i][j] * sol[j]
        sol[i] /= mat[i][i]
    }
    return sol.sum().roundToInt()
}

fun main() {
    println(gaussianElimination(intArrayOf(2, 1, 1, 3, 2, 1, 4)))
    println(gaussianElimination(intArrayOf(2, 1, 0, 5, 0, 1, 3)))
    println(gaussianElimination(intArrayOf(1, 2, 6)))
    println(gaussianElimination(intArrayOf(3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9)))
}
