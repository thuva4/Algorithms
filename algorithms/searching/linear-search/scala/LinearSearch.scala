object LinearSearch {
  def search(arr: Array[Int], target: Int): Int = {
    for (i <- arr.indices) {
      if (arr(i) == target)
        return i
    }
    -1
  }
}
