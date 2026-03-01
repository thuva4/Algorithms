fun matrixDeterminant(arr: IntArray): Int {
    var idx = 0
    val n = arr[idx++]
    val mat = Array(n) { DoubleArray(n) { arr[idx++].toDouble() } }

    var det = 1.0
    for (col in 0 until n) {
        var maxRow = col
        for (row in col + 1 until n) {
            if (Math.abs(mat[row][col]) > Math.abs(mat[maxRow][col])) {
                maxRow = row
            }
        }
        if (maxRow != col) {
            val tmp = mat[col]; mat[col] = mat[maxRow]; mat[maxRow] = tmp
            det *= -1.0
        }
        if (mat[col][col] == 0.0) return 0
        det *= mat[col][col]
        for (row in col + 1 until n) {
            val factor = mat[row][col] / mat[col][col]
            for (j in col + 1 until n) {
                mat[row][j] -= factor * mat[col][j]
            }
        }
    }
    return Math.round(det).toInt()
}

fun main() {
    println(matrixDeterminant(intArrayOf(2, 1, 2, 3, 4)))
    println(matrixDeterminant(intArrayOf(2, 1, 0, 0, 1)))
    println(matrixDeterminant(intArrayOf(3, 6, 1, 1, 4, -2, 5, 2, 8, 7)))
    println(matrixDeterminant(intArrayOf(1, 5)))
}
