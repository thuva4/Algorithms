object SubsetSum {

  def subsetSum(arr: Array[Int], target: Int): Int = {
    if (backtrack(arr, 0, target)) 1 else 0
  }

  private def backtrack(arr: Array[Int], index: Int, remaining: Int): Boolean = {
    if (remaining == 0) return true
    if (index >= arr.length) return false

    // Include arr(index)
    if (backtrack(arr, index + 1, remaining - arr(index))) return true

    // Exclude arr(index)
    if (backtrack(arr, index + 1, remaining)) return true

    false
  }
}
