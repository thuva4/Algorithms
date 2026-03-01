fun nQueens(n: Int): Int {
    if (n <= 0) return 0

    val cols = mutableSetOf<Int>()
    val diags = mutableSetOf<Int>()
    val antiDiags = mutableSetOf<Int>()
    var count = 0

    fun backtrack(row: Int) {
        if (row == n) {
            count++
            return
        }
        for (col in 0 until n) {
            if (col in cols || (row - col) in diags || (row + col) in antiDiags) {
                continue
            }
            cols.add(col)
            diags.add(row - col)
            antiDiags.add(row + col)
            backtrack(row + 1)
            cols.remove(col)
            diags.remove(row - col)
            antiDiags.remove(row + col)
        }
    }

    backtrack(0)
    return count
}
