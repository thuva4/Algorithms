/**
 * Flood fill algorithm using DFS.
 */
object FloodFill {
  def floodFill(grid: Array[Array[Int]], sr: Int, sc: Int, newValue: Int): Array[Array[Int]] = {
    val originalValue = grid(sr)(sc)
    if (originalValue == newValue) return grid

    val rows = grid.length
    val cols = grid(0).length

    def dfs(r: Int, c: Int): Unit = {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid(r)(c) != originalValue) return
      grid(r)(c) = newValue
      dfs(r - 1, c)
      dfs(r + 1, c)
      dfs(r, c - 1)
      dfs(r, c + 1)
    }

    dfs(sr, sc)
    grid
  }

  def main(args: Array[String]): Unit = {
    val grid = Array(
      Array(1, 1, 1),
      Array(1, 1, 0),
      Array(1, 0, 1)
    )

    floodFill(grid, 0, 0, 2)

    println("After flood fill:")
    for (row <- grid) {
      println(row.mkString(" "))
    }
  }
}
