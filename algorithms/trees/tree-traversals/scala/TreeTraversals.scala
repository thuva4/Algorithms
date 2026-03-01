object TreeTraversals {
  private def inorderHelper(arr: Array[Int], i: Int, result: scala.collection.mutable.ArrayBuffer[Int]): Unit = {
    if (i >= arr.length || arr(i) == -1) return
    inorderHelper(arr, 2 * i + 1, result)
    result += arr(i)
    inorderHelper(arr, 2 * i + 2, result)
  }

  def treeTraversals(arr: Array[Int]): Array[Int] = {
    val result = scala.collection.mutable.ArrayBuffer[Int]()
    inorderHelper(arr, 0, result)
    result.toArray
  }
}
