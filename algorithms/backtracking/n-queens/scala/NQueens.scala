import scala.collection.mutable

object NQueens {

  def nQueens(n: Int): Int = {
    if (n <= 0) return 0

    val cols = mutable.Set[Int]()
    val diags = mutable.Set[Int]()
    val antiDiags = mutable.Set[Int]()
    var count = 0

    def backtrack(row: Int): Unit = {
      if (row == n) {
        count += 1
        return
      }
      for (col <- 0 until n) {
        if (!cols.contains(col) && !diags.contains(row - col) && !antiDiags.contains(row + col)) {
          cols.add(col)
          diags.add(row - col)
          antiDiags.add(row + col)
          backtrack(row + 1)
          cols.remove(col)
          diags.remove(row - col)
          antiDiags.remove(row + col)
        }
      }
    }

    backtrack(0)
    count
  }
}
